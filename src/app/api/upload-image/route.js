import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

// POST /api/upload-image
// Receives a multipart form with a single "file" field,
// uploads it to Cloudinary, and returns the secure URL.
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { error: "No file provided." },
        { status: 400 }
      );
    }

    // Convert the file to a base64 data URI so Cloudinary can accept it.
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    // Upload to Cloudinary.
    // - folder: keeps images organized in the dashboard
    // - resource_type: "image" (auto works too but being explicit is cleaner)
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "lexmora",
      resource_type: "image",
    });

    return NextResponse.json({ url: result.secure_url }, { status: 200 });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json(
      { error: "Image upload failed. Please try again." },
      { status: 500 }
    );
  }
}
