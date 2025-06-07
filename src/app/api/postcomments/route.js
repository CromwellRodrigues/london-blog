import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

import { NextResponse } from 'next/server';

import prisma from '../../../../lib/db';

export async function POST(request) {
    const { postId, content, parentId } = await request.json();


    const { getUser } = getKindeServerSession(request);
    const user = await getUser(); // Get the authenticated user to post the comment
    console.log("User from Kinde:", user);

    if(!user) {
        return NextResponse.json({ message : 'Unauthorized' }, { status: 401 });
    }   
   
    try {
        let existingUser = await prisma.user.findUnique({
            
        
            where:{id: user.id},
        })

        if(!existingUser) {
            existingUser = await prisma.user.create({
                data: {
                    id: user.id,
                    email: user.email,
                    givenName: user.given_name,
                    picture: user.picture || "",
                },
            });
        }

        const newComment = await prisma.comment.create({
            data: {
                content,
                postId,
                parentId : parentId || null, // If parentId is not provided, it will be null
                userId: existingUser.id,
            },
            include: {
                user : true, // Include user details in the response
            }
        });

        return NextResponse.json(newComment, { status: 201 });

    } catch (error) {
        console.error("Failed to create comment:", error);
        return NextResponse.json({
            message: 'Failed to create comment'
        }, { status: 500 });

    }

}