"use client";
import axios from "axios";
import React, { useState } from "react";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, Video } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Chapter } from "@prisma/client";
import MuxPlayer from "@mux/mux-player-react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ReactPlayer from 'react-player'
import dynamic from 'next/dynamic'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
    youtubeUrl: z.string().min(1, {
        message: "Youtube url is required",
    }),
});

interface ChapterVideoFormProps {
    courseId: string;
    chapterId: string;
    initialData: Chapter;
}

const ChapterVideoForm = ({
    initialData,
    courseId,
    chapterId,
}: ChapterVideoFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            youtubeUrl: initialData.youtubeUrl || "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

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
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <FormField
                            control={form.control}
                            name="youtubeUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder="Your youtube url here"
                                            {...field}
                                            disabled={isSubmitting}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            disabled={isSubmitting || !isValid}
                        >
                            Save
                        </Button>
                    </form>
                </Form>
            ) : (
                <div>
                    {!initialData.youtubeUrl ? (
                        <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                            <Video className="h-10 w-10 text-slate-500" />
                        </div>
                    ) : (
                        <div>
                            <div className="aspect-video relative mt-2">
                                <ReactPlayer url={initialData.youtubeUrl} width={"100%"} height={"100%"} controls />
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
