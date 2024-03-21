"use client";
import axios from "axios";
import React, { useState } from "react";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Attachment, Course } from "@prisma/client";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";

const formSchema = z.object({
    url: z.string().min(1, {
        message: "Image is required",
    }),
});

interface AttachmentFormProps {
    courseId: string;
    initialData: Course & {
        attachments: Attachment[];
    };
}

const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/attachments`, values);
            toast({
                description: "Course attachment added!",
                variant: "success",
                duration: 2000,
            });
            setIsEditing(false);
            router.refresh();
        } catch (error) {
            toast({
                title: `Something went wrong!`,
                variant: "destructive",
                duration: 2000,
            });
        }
    };

    const onDelete = async (id: string) => {
        try {
            setDeletingId(id);
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
            toast({
                description: "Course attachment deleted!",
                variant: "success",
                duration: 2000,
            });
            router.refresh();
        } catch (error) {
            toast({
                title: `${error}`,
                variant: "destructive",
                duration: 2000,
            });
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <h3 className="flex items-center justify-between font-medium">
                Course attachments
                <Button
                    variant={"ghost"}
                    onClick={() => setIsEditing(!isEditing)}
                >
                    {isEditing && <>Cancel</>}
                    {!isEditing && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a file
                        </>
                    )}
                </Button>
            </h3>
            {isEditing ? (
                <div>
                    <FileUpload
                        endpoint="courseAttachment"
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ url: url });
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Add anything you want to share with your students.
                    </div>
                </div>
            ) : (
                <div>
                    {initialData.attachments.length === 0 ? (
                        <p className="text-sm italic text-slate-500 mt-2">
                            No attachments yet
                        </p>
                    ) : (
                        <div className="relative mt-2">
                            <div className="flex flex-col gap-y-1">
                                {initialData.attachments.map((attachment) => (
                                    <div
                                        key={attachment.id}
                                        className="flex items-center w-full border bg-sky-100 rounded-md p-3 border-sky-200 text-sky-700 mb-2"
                                    >
                                        <File className="h-4 w-4 flex-shrink-0 mr-2" />
                                        <p className="text-sm">
                                            {attachment.name}
                                        </p>
                                        <div className="flex items-center justify-center ml-auto">
                                            {deletingId === attachment.id ? (
                                                <div>
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                </div>
                                            ) : (
                                                <Button
                                                    className="hover:opacity-50 transition p-0 w-4 h-4"
                                                    variant={"link"}
                                                    onClick={() =>
                                                        onDelete(attachment.id)
                                                    }
                                                >
                                                    <div>
                                                        <X className="h-4 w-4" />
                                                    </div>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AttachmentForm;
