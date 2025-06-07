import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client"; // Adjust path to your sanity client

export async function POST(req) {
  const { postId } = await req.json();

  if (!postId) {
    return NextResponse.json({ error: "Missing postId" }, { status: 400 });
  }

  try {
    await client
      .patch(postId)
      .setIfMissing({ views: 0 })
      .inc({ views: 1 })
      .commit();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}