"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Chapter } from "@prisma/client";
import { cn } from "@/lib/utils";
import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";

const formSchema = z.object({
    description: z.string().min(1, {
        message: "Description is required",
    }),
});

interface ChapterDescriptionFormProps {
    courseId: string;
    chapterId: string;
    initialData: Chapter;
}

const ChapterDescriptionForm = ({
    initialData,
    courseId,
    chapterId,
}: ChapterDescriptionFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: initialData?.description || "",
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
                description: "Chapter description updated!",
                variant: "success",
                duration: 2000,
            });
            setIsEditing(false);
            router.refresh();
        } catch (error) {
            console.log(error);
            toast({
                title: "Something went wrong!",
                variant: "destructive",
                duration: 2000,
            });
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <h3 className="flex items-center justify-between font-medium">
                Chapter description
                <Button
                    variant={"ghost"}
                    onClick={() => setIsEditing(!isEditing)}
                >
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
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
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Editor {...field} />
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
                <div className={cn("mt-2 text-sm", !initialData?.description && "text-slate-500 italic")}>
                    {!initialData?.description ? (
                        <div>
                            <p className="text-slate-500">No description</p>
                        </div>
                    ) : (
                        <div>
                            <Preview value={initialData.description} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChapterDescriptionForm;
