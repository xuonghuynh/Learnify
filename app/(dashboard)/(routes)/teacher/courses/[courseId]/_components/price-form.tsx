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
import { Pencil } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Course } from "@prisma/client";
import { formatPrice } from "@/lib/format";

const formSchema = z.object({
    price: z.coerce.number(),
});

interface PriceFormProps {
    courseId: string;
    initialData: Course;
}

const PriceForm = ({ initialData, courseId }: PriceFormProps) => {

    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            price: initialData?.price || undefined,
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
                Course description
                <Button
                    variant={"ghost"}
                    onClick={() => setIsEditing(!isEditing)}
                >
                    {isEditing ? (
                        <>
                            Cancel
                        </>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2"/>
                            Edit
                        </>
                    )}
                </Button>
            </h3>
            {isEditing ? (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                <Input placeholder="Set a price for your course..." {...field} disabled={isSubmitting} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting || !isValid}>Save</Button>
                    </form>
                </Form>
            ): (
                <div className={cn("text-sm mt-2", !initialData.price && 'text-slate-500 italic')}>{!initialData.price ? 'No price' : formatPrice(initialData.price)}</div>
            )}
            
        </div>
    ) 
};

export default PriceForm;
