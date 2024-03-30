import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";
import { Category, Course } from "@prisma/client";

type CourseWithProgressCategory = Course & {
    category: Category | null;
    progress: number | null;
    chapters: { id: string }[];
};

type GetCourses = {
    userId: string;
    title?: string;
    categoryId?: string;
};

export const getCourse = async ({
    userId,
    title,
    categoryId,
}: GetCourses): Promise<CourseWithProgressCategory[]> => {
    try {
        const courses = await db.course.findMany({
            where: {
                isPublished: true,
                title: {
                    contains: title,
                },
                categoryId,
            },
            include: {
                category: true,
                chapters: {
                    where: {
                        isPublished: true,
                    },
                    select: {
                        id: true,
                    },
                },
                purchase: {
                    where: {
                        userId,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        console.log(courses)
        const courseWithProgress: CourseWithProgressCategory[] =
            await Promise.all(
                courses.map(async (course) => {
                    if (course.purchase.length === 0) {
                        return {
                            ...course,
                            progress: null,
                        };
                    }

                    const progressPercentage = await getProgress(
                        userId,
                        course.id
                    );
                    return {
                        ...course,
                        progress: progressPercentage,
                    };
                })
            );

        return courseWithProgress;
    } catch (error) {
        console.log("GET_COURSES", error);
        return [];
    }
};
