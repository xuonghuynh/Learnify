'use client'
import React from 'react'
import { z } from "zod"
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useToast } from '@/components/ui/use-toast'

const formSchema = z.object({
    title: z.string().min(2, {
      message: "Title must be at least 2 characters",
    }).max(50, {
      message: "Title must be less than 50 characters",
    }),
  })

  
const CreateCoursePage = () => {
    const router = useRouter();
    const { toast } = useToast()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        }
    })
    const { isSubmitting, isValid } = form.formState;

    /**
     * Handles the form submission.
     *
     * @param {z.infer<typeof formSchema>} values The form data
     */
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            // Send a POST request to the server to create the course
            const response = await axios.post('/api/courses', values)

            // Log the server response
            console.log(response)

            // Redirect the user to the new course's page
            router.push(`/teacher/courses/${response.data.id}`)
            toast({
                // The variant of the toast
                variant: "default", // Indicates the type of message

                duration: 2000, // The duration of the toast in milliseconds

                // The title of the toast
                title: "Course created!", // The title of the toast
            })
        } catch (error) {
            // Log the error
            console.log(error)

            // Show an error message to the user
            toast({
                // The variant of the toast
                variant: "destructive", // Indicates the type of message

                duration: 2000, // The duration of the toast in milliseconds

                // The title of the toast
                title: "Something went wrong!", // The title of the toast
            })
        }
    }


    return (
        <div className='p-6 max-w-5xl mx-auto flex md:items-center md:justify-center h-full'>
            <div>
                <h1 className='text-2xl'>Course Name</h1>
                <p className="text-sm text-purple-600">
                    What would you like to name your course? Don&apos;t worry, you can change it later.
                </p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
                        <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Course Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g Advanced React" {...field} disabled={isSubmitting} />
                                </FormControl>
                                <FormDescription>
                                    What will teach in this course?
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Link href={"/teacher/courses"}>
                                <Button variant="ghost">Cancel</Button>
                            </Link>
                            <Button disabled={!isValid || isSubmitting} type="submit">Submit</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default CreateCoursePage
