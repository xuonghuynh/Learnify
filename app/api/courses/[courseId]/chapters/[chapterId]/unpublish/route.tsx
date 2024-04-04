import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const runtime = 'edge'

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } }
) {
    try {
        const { userId } = auth();
        
        if(!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const ownedCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            },
        });

        if(!ownedCourse) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const chapter = await db.chapter.findUnique({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            }
        });

        if(!chapter) {
            return new NextResponse('Chapter not found', { status: 404 });
        }

        if(chapter.isPublished) {
            await db.chapter.update({
                where: {
                    id: params.chapterId,
                    courseId: params.courseId,
                },
                data: {
                    isPublished: false,
                },
            })
        } else {
            return new NextResponse('Chapter already Unpublished', { status: 400 });
        }

        const chapterInCourse = await db.chapter.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true
            }
        });

        if(chapterInCourse.length === 0) {
            await db.course.update({
                where: {
                    id: params.courseId
                },
                data: {
                    isPublished: false
                }
            })
        }

        return NextResponse.json(chapter, { status: 200 });

    } catch (error) {
        console.log(error)
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
