import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { MongoClient } from "mongodb";

// Confirmed from lexmora-server/index.js: client.db("lexmora_db")
const DB_NAME = "lexmora_db";

// Reuse the MongoDB connection across requests (lazy singleton).
let mongoClient = null;

async function getDb() {
  if (!mongoClient) {
    mongoClient = new MongoClient(process.env.AUTH_DB_URI);
    await mongoClient.connect();
  }
  return mongoClient.db(DB_NAME);
}

// PATCH /api/user/update-profile
// Updates the authenticated user's display name and avatar in the "user"
// collection, then syncs those values across every lesson they have authored
// so lesson cards always show up-to-date profile information.
export async function PATCH(request) {
  try {
    // Confirm the request comes from a logged-in user
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { name, image } = await request.json();

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Display name is required." },
        { status: 400 }
      );
    }

    const db = await getDb();
    const trimmedName = name.trim();
    const avatarUrl = image || null;

    // 1. Update the user record in the better-auth "user" collection
    await db.collection("user").updateOne(
      { email: session.user.email },
      {
        $set: {
          name: trimmedName,
          image: avatarUrl,
          updatedAt: new Date(),
        },
      }
    );

    // 2. Sync the updated name + avatar across all lessons this user has
    //    authored. Lesson cards store these values at creation time (denormalised),
    //    so they must be updated here to stay consistent site-wide.
    await db.collection("lessons").updateMany(
      { authorEmail: session.user.email },
      {
        $set: {
          authorName: trimmedName,
          authorAvatar: avatarUrl,
          "author.name": trimmedName,
          "author.avatar": avatarUrl,
        },
      }
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile. Please try again." },
      { status: 500 }
    );
  }
}
