import CourseCard from "@/components/course-card";
import { Category, Course } from "@prisma/client";
import React from "react";

type CourseWithProgressCategory = Course & {
    category: Category | null;
    progress: number | null;
    chapters: { id: string }[];
};

interface CoursesListProps {
    items: CourseWithProgressCategory[];
}
const CoursesList = ({ items }: CoursesListProps) => {
    return (
        <div>
            {items.length === 0 && (
                <div className="flex items-center justify-center text-md italic text-muted-foreground mt-10">
                    <p>No courses found.</p>
                </div>
            )}
            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
                {items.map((item) => (
                    <CourseCard
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        chaptersLength={item.chapters.length}
                        category={item?.category?.name}
                        progress={item.progress!}
                        price={item.price!}
                        imageUrl={item.imageUrl!}
                    />
                ))}
            </div>
        </div>
    );
};

export default CoursesList;
