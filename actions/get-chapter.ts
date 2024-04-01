import { db } from "@/lib/db";
import { Attachment, Chapter } from "@prisma/client";
import next from "next";

interface GetChapterProps {
    chapterId: string;
    userId: string;
    courseId: string;
}
const getChapter = async({chapterId, userId, courseId}: GetChapterProps) => {
    try {
        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId
                }
            }
        })
        console.log("PURCHASE", purchase)

        const course = await db.course.findUnique({
            where: {
                id: courseId,
                isPublished: true
            },
            select: {
                price: true
            }
        })
        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                isPublished: true
            }
        })

        if(!chapter || !course) {
            return new Error("Chapter or Course not found")
        }

        let attachment: Attachment[] = []
        let nextChapter: Chapter | null = null

        if(purchase) {
            attachment = await db.attachment.findMany({
                where: {
                    courseId
                }
            })
        }

        if(chapter.isFree || purchase) {
            nextChapter = await db.chapter.findFirst({
                where: {
                    courseId,
                    isPublished: true,
                    position: {
                        gt: chapter.position
                    }
                },
                orderBy: {
                    position: "asc"
                }
            })
        }

        const userProgress = await db.userProgress.findUnique({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId
                }
            }
        })

        return {
            chapter,
            youtubeUrl: chapter.youtubeUrl,
            course,
            attachments: attachment,
            nextChapter,
            userProgress,
            purchase
        }

    } catch (error) {
        console.log("GET_CHAPTER_ACTION", error);
        return {
            chapter: null,
            youtubeUrl: null,
            course: null,
            attachments: [],
            nextChapter: null,
            userProgress: null,
            purchase: null
        }
    }
};

export default getChapter;
