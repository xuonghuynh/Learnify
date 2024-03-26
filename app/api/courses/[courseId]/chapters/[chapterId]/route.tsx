import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";

const { video } = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function DELETE(req: Request, { params }: { params: { courseId: string; chapterId: string } }) {
    try {
        const { userId } = auth();

        if(!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            },
        });

        if (!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const deletedChapter = await db.chapter.delete({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            },
        });

        const publishedChapterInCourse = await db.chapter.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true,
            },
        });

        if(publishedChapterInCourse.length === 0) {
            await db.course.update({
                where: {
                    id: params.courseId,
                },
                data: {
                    isPublished: false,
                }
            })
        }

        return NextResponse.json(deletedChapter, { status: 200 });
    } catch (error) {
        console.log("DELETE_CHAPTER", error);
        return new NextResponse(`"Internal Server Error"`, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } }
) {
    try {
        const { userId } = auth();
        const { isPublic, ...values } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            },
        });

        if (!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { courseId, chapterId } = params;

        const chapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId,
            },
            data: { ...values },
        });
        
        return NextResponse.json(chapter, { status: 200 });
    } catch (error) {
        console.log("CHAPTER", error);
        return new NextResponse(`"Internal Server Error"`, { status: 500 });
    }
}
