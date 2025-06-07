import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextResponse } from 'next/server';


export async function DELETE(request) {
    const { commentId } = await request.json();

    const { getUser } = getKindeServerSession(request);
    const user = await getUser(); // Get the authenticated user to delete the comment

    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Check if the comment exists and belongs to the user
        const existingComment = await prisma.comment.findUnique({
            where: { id: commentId, userId: user.id },
        });

        if (!existingComment || existingComment.userId !== user.id) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        // Delete the comment
        await prisma.comment.delete({
            where: { id: commentId },
        });

        return NextResponse.json({ message: 'Comment deleted successfully' }, { status: 200 });

    } catch (error) {
        console.error("Failed to delete comment:", error);
        return NextResponse.json({ message: 'Failed to delete comment' }, { status: 500 });
    }
}   