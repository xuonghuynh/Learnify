import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string; attachmentId: string } }
) {
    try {
        const { userId } = auth();
        const courseId = params.courseId;
        const attachmentId = params.attachmentId;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId,
            },
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const attachment = await db.attachment.delete({
            where: {
                courseId,
                id: attachmentId,
            },
        });

        return NextResponse.json(attachment, { status: 200 });
    } catch (error) {
        console.log("[COURSE_ID_ATTACHMENT_DELETE] Error: ", error);
        return new NextResponse(`"Internal Server Error"`, { status: 500 });
    }
}
