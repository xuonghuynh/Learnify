import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";

const { video } = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

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
        console.log(values)
        if (values.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: params.chapterId,
                },
            });
            if (existingMuxData) {
                await video.assets.delete(existingMuxData.assetId);
                await db.muxData.delete({ where: { id: existingMuxData.id } });
            }
            
            const asset = await video.assets.create({
                input: values.videoUrl,
                playback_policy: ["public"],
                test: false
            })
            
            await db.muxData.create({
                data: {
                    chapterId,
                    assetId: asset.id,
                    playbackId: asset.playback_ids?.[0].id
                }
            });
        }
        
        

        return NextResponse.json(chapter, { status: 200 });
    } catch (error) {
        console.log("CHAPTER", error);
        return new NextResponse(`"Internal Server Error"`, { status: 500 });
    }
}
