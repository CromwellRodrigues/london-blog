import { NextResponse } from 'next/server';
import prisma from '../../../../lib/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
        return NextResponse.json({ message: 'Post ID is required' }, { status: 400 });
    }

    try {
        const comments = await prisma.comment.findMany({
            where: { postId, parentId: null }, // Fetch top-level comments for the post
            include: {
                user: true, // Include user details in the response
                replies: { // Include replies to the comments
                    include: {
                        user: true, // Include user details for replies
                    },
                },
            },
            orderBy: {
                createdAt: 'desc', // Order comments by creation date
            },
        });
       
        
            return NextResponse.json(comments, { status: 200 });

    } catch (error) {
        console.error("Failed to fetch comments:", error);
        return NextResponse.json({ message: 'Failed to fetch comments' }, { status: 500 });
    }
}