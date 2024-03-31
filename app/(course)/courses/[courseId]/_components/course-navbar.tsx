import CourseMobileNavbar from "@/app/(course)/courses/[courseId]/_components/course-mobile-navbar";
import NavbarRoutes from "@/components/navbar-routes";
import { Chapter, Course, UserProgress } from "@prisma/client";
import React from "react";

interface CourseNavBarProps {
    course: Course & {
        chapters: (Chapter & {
            userProgress: UserProgress[] | null;
        })[];
    };
    progressCount: number;
}

const CourseNavBar = ({ course, progressCount }: CourseNavBarProps) => {
    return (
        <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
            <CourseMobileNavbar course={course} progressCount={progressCount} />
            <NavbarRoutes />
        </div>
    );
};

export default CourseNavBar;
