"use client";
import ConfirmModal from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface ChapterActionProps {
    disabled: boolean;
    courseId: string;
    chapterId: string;
    isPublished: boolean;
}

const ChapterActions = ({
    courseId,
    chapterId,
    isPublished,
    disabled,
}: ChapterActionProps) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const router = useRouter();

    const onDelete = async () => {
        setIsLoading(true);
        try {
            await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
            toast({
                description: "Chapter deleted!",
                variant: "success",
                duration: 2000,
            });
            router.refresh();
            router.push(`/teacher/courses/${courseId}`);
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
                onClick={() => {}}
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

export default ChapterActions;
