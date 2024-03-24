import React from "react";

const ChapterEdit = async ({
    params,
}: {
    params: { chapterId: string; courseId: string };
}) => {
    // const { chapterId } = useRouter();

    return (
        <div>
            <div>{params.chapterId}</div>
            <div>{params.courseId}</div>
        </div>
    );
};

export default ChapterEdit;
