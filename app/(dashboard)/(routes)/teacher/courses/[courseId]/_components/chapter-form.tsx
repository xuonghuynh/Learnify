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
import { Pencil, PlusCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Course, Chapter } from "@prisma/client";

const formSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required",
    }),
});

interface ChapterFormProps {
    courseId: string;
    initialData: Course & {chapters: Chapter[]};
}

const ChapterForm = ({ initialData, courseId }: ChapterFormProps) => {

    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ""
        }
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        try {
            console.log(values)
            await axios.post(`/api/courses/${courseId}/chapters`, values);
            toast({
                description: "Course Chapter created!",
                variant: "success",
                duration: 2000,
            })
            setIsCreating(false)
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
                Course chapters
                <Button
                    variant={"ghost"}
                    onClick={() => setIsCreating(!isCreating)}
                >
                    {isCreating ? (
                        <>
                            Cancel
                        </>
                    ) : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2"/>
                            Add new chapter
                        </>
                    )}
                </Button>
            </h3>
            {isCreating && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                <Input placeholder="e.g. Introduction to the course" {...field} disabled={isSubmitting} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting || !isValid}>Create</Button>
                    </form>
                </Form>
            )}
            {!isCreating && (
                <div className={cn("text-sm mt-2", !initialData?.chapters.length && "text-slate-500italic")}>
                    {!initialData?.chapters.length && (
                        <div>No chapters</div>
                    )}
                    {initialData?.chapters.map((chapter) => (
                        <div key={chapter.id} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Pencil className="h-4 w-4 mr-2"/>
                                <p>{chapter.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {!isCreating && (
                <p className="text-sm text-muted-foreground mt-4">
                    Drag and drop to reorder the chapter
                </p>
            )}
            
        </div>
    ) 
};

export default ChapterForm;
