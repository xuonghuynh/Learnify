"use client";
import axios from "axios";
import React, { useState } from "react";
import * as z from "zod";

import { Button } from "@/components/ui/button"
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";

const formSchema = z.object({
    imageUrl: z.string().min(1, {
        message: "Image is required",
    }),
});

interface ImageFormProps {
    courseId: string;
    initialData: Course;
}

const ImageForm = ({ initialData, courseId }: ImageFormProps) => {

    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast({
                description: "Course Image updated!",
                variant: "success",
                duration: 2000,
            })
            setIsEditing(false)
            router.refresh();
        } catch (error) {
            // toast({
            //     title: `${error}`,
            //     variant: "destructive",
            //     duration: 2000,
            //   })
        }
      }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <h3 className="flex items-center justify-between font-medium">
                Course image
                <Button
                    variant={"ghost"}
                    onClick={() => setIsEditing(!isEditing)}
                >
                    {isEditing && (
                        <>
                            Cancel
                        </>
                    )}
                    {!isEditing && !initialData.imageUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2"/>
                            Add an image
                        </>
                    )}
                    {!isEditing && initialData.imageUrl && (
                        <>
                            <Pencil className="h-4 w-4 mr-2"/>
                            Edit
                        </>
                    )}
                </Button>
            </h3>
            {isEditing ? (
                <div>
                    <FileUpload
                        endpoint="courseImage"
                        onChange={(url) => {
                            if(url) {
                                onSubmit({ imageUrl: url })
                            }
                        }} />
                    <div className="text-xs text-muted-foreground mt-4">
                        16:9 aspect ratio
                    </div>
                </div>
            ): (
                <div>
                    {!initialData.imageUrl ? (
                        <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                            <ImageIcon className="h-10 w-10 text-slate-500" />
                        </div>
                    ): (
                        <div className="aspect-video relative mt-2">
                            <Image className="object-cover rounded-md" src={initialData.imageUrl} alt="Course image" fill />
                        </div>
                    )}
                </div>
            )}
            
        </div>
    ) 
};

export default ImageForm;
