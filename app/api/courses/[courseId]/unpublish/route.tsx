import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, { params }: { params: { courseId: string } }) {
    try {
        const { userId } = auth();

        if(!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            },
            include: {
                chapters: true,
            }
        });

        if(!course) {
            return new NextResponse("Course not found", { status: 404 });
        }

        const unpublishedCourse = await db.course.update({
            where: {
                id: params.courseId,
                userId,
            },
            data: {
                isPublished: false
            }
        });

        return NextResponse.json(unpublishedCourse, { status: 200 });

    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}