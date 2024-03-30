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
                    <div key={item.id}>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                        <p>{item.category?.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CoursesList;
