import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import prisma from "../../../../lib/db";

export async function PATCH(request) {
  const { commentId, content } = await request.json(); //get commentId and content from the request body

  const { getUser } = getKindeServerSession(request);
  const user = await getUser(); // Get the authenticated user to edit the comment

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check if the comment exists and belongs to the user
    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId, userId: user.id },
    });

    if (!existingComment || existingComment.userId !== user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Update the comment
    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
      include: {
        user: true, // Include user details in the response
      },
    });

    return NextResponse.json(updatedComment, { status: 200 });
  } catch (error) {
    console.error("Failed to update comment:", error);
    return NextResponse.json(
      { message: "Failed to update comment" },
      { status: 500 }
    );
  }
}
