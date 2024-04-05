import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = auth();
        const { url } = await req.json();
        const { courseId } = params;

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

        const attachment = await db.attachment.create({
            data: {
                url,
                name: url.split("/").pop(),
                courseId,
            },
        });

        return NextResponse.json(attachment, { status: 200 });
    } catch (error) {
        console.log("[COURSE_ID_ATTACHMENT] Error: ", error);
        return new NextResponse(`"Internal Server Error"`, { status: 500 });
    }
}
