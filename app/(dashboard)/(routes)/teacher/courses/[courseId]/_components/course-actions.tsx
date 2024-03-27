"use client";
import ConfirmModal from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface CourseActionProps {
    disabled: boolean;
    courseId: string;
    isPublished: boolean;
}

const CourseActions = ({
    courseId,
    isPublished,
    disabled,
}: CourseActionProps) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const router = useRouter();
    const confetti = useConfettiStore()

    const onDelete = async () => {
        setIsLoading(true);
        try {
            await axios.delete(`/api/courses/${courseId}`);
            toast({
                description: "Course deleted!",
                variant: "success",
                duration: 2000,
            });
            router.refresh();
            router.push(`/teacher/courses`);
        } catch (error) {
            console.log(error);
            toast({
                title: "Something went wrong!",
                variant: "destructive",
                duration: 2000,
            });
        } finally {
            setIsLoading(false);
        }
    }

    const onPublish = async () => {
        setIsLoading(true);
        try {
            if(isPublished) {
                await axios.patch(`/api/courses/${courseId}/unpublish`);
                toast({
                    description: "Course unpublished!",
                    variant: "success",
                    duration: 2000,
                });
            } else {
                await axios.patch(`/api/courses/${courseId}/publish`);
                toast({
                    description: "Course published!",
                    variant: "success",
                    duration: 2000,
                });
                confetti.onOpen()
            }

            router.refresh();
        } catch (error) {
            console.log(error);
            toast({
                title: "Something went wrong!",
                variant: "destructive",
                duration: 2000,
            });
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={onPublish}
                disabled={disabled || isLoading}
                variant={"outline"}
                size={"sm"}
            >
                {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size={"sm"} disabled={isLoading}>
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModal>
        </div>
    );
};

export default CourseActions;
