import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { Category, Chapter, Course } from "@prisma/client";
import React from "react";

type CourseWithProgressWithCategory = Course & {
    category: Category;
    chapters: Chapter[];
    progress: number | null;
}

type GetDashboardCoursesProps = {
    completedCourses: CourseWithProgressWithCategory[];
    courseInProgress: CourseWithProgressWithCategory[];
}

const GetDashboardCourses = async (userId: string):Promise<GetDashboardCoursesProps> => {
    try {
        const purchasedCourses = await db.purchase.findMany({
            where: {
                userId: userId,
            },
            select: {
                course: {
                    include: {
                        category: true,
                        chapters: {
                            where: {
                                isPublished: true
                            }
                        }
                    }
                }
            }
        })

        const courses = purchasedCourses.map((purchasedCourse) => purchasedCourse.course) as CourseWithProgressWithCategory[];

        for(let course of courses) {
            const progress = await getProgress(userId, course.id);
            course["progress"] = progress;
        }

        const completedCourses = courses.filter((course) => course.progress === 100);
        const courseInProgress = courses.filter((course) => course.progress !== 100);

        return {
            completedCourses,
            courseInProgress,
        }

    } catch (error) {
        console.log("GET_DASHBOARD_COURSES", error)
        return {
            completedCourses: [],
            courseInProgress: [],
        }
    }
};

export default GetDashboardCourses;
