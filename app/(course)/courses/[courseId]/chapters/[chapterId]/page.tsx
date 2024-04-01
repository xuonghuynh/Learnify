import getChapter from "@/actions/get-chapter";
import Banner from "@/components/banner";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

interface ChapterIdPageProps {
    params: {
        chapterId: string;
        courseId: string;
    };
}

const ChapterIdPage = async ({
    params,
}: ChapterIdPageProps) => {
    const { chapterId, courseId } = params;
    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    const { chapter, course, youtubeUrl, attachments, nextChapter, userProgress, purchase }: any = await getChapter({ chapterId, userId, courseId });

    console.log("LGOS", chapter)

    const isLocked = !chapter.isFree && !purchase;
    const isCompleteOnEnd = !!purchase && !userProgress?.[0]?.isCompleted;

    return (
        <div>
            {userProgress?.[0]?.isCompleted && (
                <Banner label="Congratulations, you have completed this chapter." variant="success" />
            )}
            {isLocked && (
                <Banner label="You need to purchase this course to view this chapter." variant="warning" />
            )}
        </div>
    );
};

export default ChapterIdPage;
