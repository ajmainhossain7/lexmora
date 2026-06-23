"use server";
import { redirect } from "next/navigation";
import { auth } from "../auth";
import { headers } from "next/headers";

export const getUserSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  return session?.user || null;
}

export const getUserToken = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });
    return session?.session?.token || null;
  } catch (error) {
    console.error("Error in getUserToken:", error);
    return null;
  }
}

export const requireRole = async (role) => {
  const user = await getUserSession()
  if (!user) {
    redirect('/signin')
  }
  if (user?.role !== role) {
    redirect('/unauthorized')
  }
  return user;
}