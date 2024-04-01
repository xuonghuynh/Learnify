import React from "react";

interface VideoPlayerProps {
    url: string;
    chapterId: string;
    courseId: string;
    title: string;
    nextChapterId: string;
    isLocked: boolean;
    isCompleteOnEnd: boolean;
}

const VideoPlayer = ({
    url,
    chapterId,
    courseId,
    title,
    nextChapterId,
    isLocked,
    isCompleteOnEnd,
}: VideoPlayerProps) => {
    return <div>Video Player</div>;
};

export default VideoPlayer;
