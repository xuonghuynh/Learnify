"use client";
import { Loader2, Lock } from "lucide-react";
import React from "react";
import ReactPlayer from "react-player";
import dynamic from "next/dynamic";
import axios from "axios";
import { useRouter } from "next/navigation";

interface VideoPlayerProps {
    youtubeUrl: string;
    chapterId: string;
    courseId: string;
    title: string;
    nextChapterId: string;
    isLocked: boolean;
    isCompleteOnEnd: boolean;
}

const VideoPlayer = ({
    youtubeUrl,
    chapterId,
    courseId,
    title,
    nextChapterId,
    isLocked,
    isCompleteOnEnd,
}: VideoPlayerProps) => {
    const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });
    const router = useRouter();
    const onVideoEnd = async() => {
        try {
            if(isCompleteOnEnd) {
                await axios.post(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
                    isCompleted: true
                });
                if(nextChapterId) {
                    router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
                }
                router.refresh();
            }
            
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="relative aspect-video">
            {!isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <Loader2 className="h-8 w-8 animate-spin text-secondary" />
                </div>
            )}
            {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
                    <Lock className="h-8 w-8" />
                    <p className="text-sm">This chapter is locked</p>
                </div>
            )}
            {!isLocked && (
                <div className="aspect-video relative mt-2">
                    <ReactPlayer
                        url={youtubeUrl}
                        width={"100%"}
                        height={"100%"}
                        controls
                        onEnded={onVideoEnd}
                        // playing={true}
                    />
                </div>
            )}
        </div>
    );
};

export default VideoPlayer;
