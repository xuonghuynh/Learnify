"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
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

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            imageUrl: initialData?.imageUrl || ""
        }
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        try {
            console.log(values)
            await axios.patch(`/api/courses/${courseId}`, values);
            toast({
                description: "Course Description updated!",
                variant: "success",
                duration: 2000,
            })
            setIsEditing(false)
            router.refresh();
        } catch (error) {
            console.log(error);
            toast({
                title: "Something went wrong!",
                variant: "destructive",
                duration: 2000,
              })
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
                        <Image className="object-cover rounded-md" src={initialData.imageUrl} alt="Course image" fill />
                    )}
                </div>
            )}
            
        </div>
    ) 
};

export default ImageForm;
