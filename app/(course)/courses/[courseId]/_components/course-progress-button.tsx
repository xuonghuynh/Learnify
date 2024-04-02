'use client';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface CourseProgressButtonProps {
    chapterId: string;
    courseId: string;
    nextChapterId?: string;
    isCompleted?: boolean;
}

const CourseProgressButton = ({
    chapterId,
    courseId,
    nextChapterId,
    isCompleted,
}: CourseProgressButtonProps) => {
    const Icon = isCompleted ? XCircle : CheckCircle;
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);
    const onClick = async () => {
        try {
            setIsLoading(true);
            await axios.post(
                `/api/courses/${courseId}/chapters/${chapterId}/progress`, {
                    isCompleted: !isCompleted,
                }
            );
            if(!isCompleted && nextChapterId) {
                router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
            }
            toast({
                title: "Success",
                description: "You have completed this chapter.",
                variant: "success",
                duration: 2000,
            });
            router.refresh();
        } catch (error) {
            toast({
                title: "Something went wrong!",
                description: "Please try again later.",
                variant: "destructive",
                duration: 2000,
            });
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <Button
            className="w-full md:w-auto"
            type="button"
            variant={isCompleted ? "outline" : "success"}
            onClick={onClick}
            disabled={isLoading}
        >
            {isCompleted ? "Completed" : "Complete & Continue"}
            <Icon className="ml-2 h-4 w-4" />
        </Button>
    );
};

export default CourseProgressButton;
