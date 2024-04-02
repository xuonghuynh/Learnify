import getChapter from "@/actions/get-chapter";
import CourseProgressButton from "@/app/(course)/courses/[courseId]/_components/course-progress-button";
import CourseEnrollButton from "@/app/(course)/courses/[courseId]/chapters/[chapterId]/_components/course-enroll-button";
import VideoPlayer from "@/app/(course)/courses/[courseId]/chapters/[chapterId]/_components/video-player";
import Banner from "@/components/banner";
import { Preview } from "@/components/preview";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { File } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";

interface ChapterIdPageProps {
    params: {
        chapterId: string;
        courseId: string;
    };
}

const ChapterIdPage = async ({ params }: ChapterIdPageProps) => {
    const { chapterId, courseId } = params;
    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    const {
        chapter,
        course,
        youtubeUrl,
        attachments,
        nextChapter,
        userProgress,
        purchase,
    }: any = await getChapter({ chapterId, userId, courseId });

    const isLocked = !chapter.isFree && !purchase;
    const isCompleteOnEnd = !!purchase && !userProgress?.[0]?.isCompleted;

    return (
        <div>
            {userProgress?.[0]?.isCompleted && (
                <Banner
                    label="Congratulations, you have completed this chapter."
                    variant="success"
                />
            )}
            {isLocked && (
                <Banner
                    label="You need to purchase this course to view this chapter."
                    variant="warning"
                />
            )}
            <div className="flex flex-col pb-20 max-w-screen-xl mx-auto">
                <div className="p-4">
                    <VideoPlayer
                        youtubeUrl={youtubeUrl}
                        chapterId={chapterId}
                        courseId={courseId}
                        title={chapter.title}
                        nextChapterId={nextChapter?.id}
                        isLocked={isLocked}
                        isCompleteOnEnd={isCompleteOnEnd}
                    />
                </div>
                <div>
                    <div className="p-4 flex flex-col md:flex-row items-center justify-between">
                        <h2 className="text-3xl font-semibold mb-2">
                            {chapter.title}
                        </h2>
                        {purchase ? (
                            <CourseProgressButton
                                chapterId={chapterId}
                                nextChapterId={nextChapter?.id}
                                isCompleted={!!userProgress?.isCompleted}
                                courseId={courseId}
                            />
                        ) : (
                            <CourseEnrollButton
                                courseId={courseId}
                                price={course.price}
                            />
                        )}
                    </div>
                    <Separator />
                    <div>
                        <Preview value={chapter.description} />
                    </div>
                    {attachments.length > 0 && (
                        <>
                            <Separator />
                            <div className="p-4">
                                {attachments.map((attachment: any) => (
                                    <a
                                        href={attachment.url}
                                        target="_blank"
                                        key={attachment.id}
                                        className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                                    >
                                        <File />
                                        <p className="line-clamp-1">
                                            {attachment.name}
                                        </p>
                                    </a>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChapterIdPage;
