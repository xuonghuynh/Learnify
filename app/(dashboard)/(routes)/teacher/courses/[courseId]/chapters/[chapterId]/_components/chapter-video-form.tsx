"use client";
import axios from "axios";
import React, { useState } from "react";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, Video } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Chapter, MuxData } from "@prisma/client";
import { FileUpload } from "@/components/file-upload";
import MuxPlayer from "@mux/mux-player-react"

const formSchema = z.object({
    videoUrl: z.string().min(1, {
        message: "Video url is required",
    }),
});

interface ChapterVideoFormProps {
    courseId: string;
    chapterId: string;
    initialData: Chapter & {
        muxData?: MuxData | null;
    };
}

const ChapterVideoForm = ({
    initialData,
    courseId,
    chapterId,
}: ChapterVideoFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(
                `/api/courses/${courseId}/chapters/${chapterId}`,
                values
            );
            toast({
                description: "Course video updated!",
                variant: "success",
                duration: 2000,
            });
            setIsEditing(false);
            router.refresh();
        } catch (error) {
            toast({
                title: `${error}`,
                variant: "destructive",
                duration: 2000,
            });
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <h3 className="flex items-center justify-between font-medium">
                Chapter video
                <Button
                    variant={"ghost"}
                    onClick={() => setIsEditing(!isEditing)}
                >
                    {isEditing && <>Cancel</>}
                    {!isEditing && !initialData.videoUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add an Video
                        </>
                    )}
                    {!isEditing && initialData.videoUrl && (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                        </>
                    )}
                </Button>
            </h3>
            {isEditing ? (
                <div>
                    <FileUpload
                        endpoint="chapterVideo"
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ videoUrl: url });
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Upload this video&apos;s chapter
                    </div>
                </div>
            ) : (
                <div>
                    {!initialData.videoUrl ? (
                        <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                            <Video className="h-10 w-10 text-slate-500" />
                        </div>
                    ) : (
                        <div>
                            <div className="">Video uploaded!</div>
                            <div className="aspect-video relative mt-2">
                                <MuxPlayer
                                    playbackId={
                                        initialData?.muxData?.playbackId || ""
                                    }
                                />
                            </div>
                            <div className="text-xs text-muted-foreground mt-2">
                                Video can take a few minutes to process. Refresh
                                the page if video is not appear.
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChapterVideoForm;
