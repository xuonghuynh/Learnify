import ChapterAccessFormForm from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/[chapterId]/_components/chapter-access-form";
import ChapterDescriptionForm from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/[chapterId]/_components/chapter-description-form";
import ChapterTitlteForm from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/[chapterId]/_components/chapter-title-form";
import ChapterVideoForm from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/[chapterId]/_components/chapter-video-form";
import IconBadget from "@/components/icon-badge";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { ArrowLeft, BackpackIcon, EyeIcon, LayoutDashboard, Trash, Video } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";

const ChapterEdit = async ({
    params,
}: {
    params: { chapterId: string; courseId: string };
}) => {
    const { userId } = auth();
    const courseId = params.courseId
    const chapterId = params.chapterId

    if (!userId) {
        return redirect("/");
    }

    const chapter = await db.chapter.findUnique({
        where: {
            id: params.chapterId,
            courseId: params.courseId,
        },
        include: {
            muxData: true,
        },
    });

    if (!chapter) {
        return redirect("/");
    }

    const requiredFields = [
        chapter.title,
        chapter.description,
        chapter.videoUrl,
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `${completedFields}/${totalFields}`;

    const backUrl = () => {
        return `/teacher/courses/${chapter.courseId}`;
    };

    return (
        <div className="p-6">
            <Link
                href={backUrl()}
                className="flex items-center text-slate-700 gap-x-2 text-sm hover:opacity-75"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to the course setup
            </Link>
            <div className="items-center justify-between flex mt-6">
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium">Chapter Creation</h1>
                    <div className="text-sm text-slate-700">
                        Please complete all fieds ({completionText})
                    </div>
                </div>
                <div className="flex gap-x-2">
                    <Button variant={"outline"} className="font-bold">
                        State
                    </Button>
                    <Button>
                        <Trash className="h-4 w-4"/>
                    </Button>
                    
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div>
                    <div className="flex items-center gap-x-2">
                        <IconBadget icon={LayoutDashboard} />
                        <h2 className="text-xl font-medium">Customize your chapter</h2>
                    </div>

                    <ChapterTitlteForm initialData={chapter} courseId={courseId} chapterId={chapterId} />
                    <ChapterDescriptionForm initialData={chapter} courseId={courseId} chapterId={chapterId} />

                    <div className="flex items-center gap-x-2 mt-6 font-medium">
                        <IconBadget icon={EyeIcon} />
                        <h2 className="text-xl">Access Settings</h2>
                    </div>
                    <ChapterAccessFormForm initialData={chapter} courseId={courseId} chapterId={chapterId} />
                </div>
                <div>
                    <div className="flex items-center gap-x-2">
                        <IconBadget icon={Video} />
                        <h2 className="text-xl font-medium">Chapter video</h2>
                    </div>
                    <ChapterVideoForm initialData={chapter} courseId={courseId} chapterId={chapterId} />
                </div>
            </div>
        </div>
    );
};

export default ChapterEdit;
