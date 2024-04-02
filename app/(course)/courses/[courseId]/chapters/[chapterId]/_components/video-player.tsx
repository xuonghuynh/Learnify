"use client";
import { Loader2, Lock } from "lucide-react";
import React from "react";
import ReactPlayer from "react-player";
import dynamic from "next/dynamic";

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
                        // playing={true}
                    />
                </div>
            )}
        </div>
    );
};

export default VideoPlayer;
