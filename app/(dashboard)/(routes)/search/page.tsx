import { getCourse } from "@/actions/get-courses";
import Categories from "@/app/(dashboard)/(routes)/search/_components/categories";
import CoursesList from "@/components/courses-list";
import SearchInput from "@/components/search-input";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

interface SearchPageProps {
    searchParams: { title: string; categoryId: string };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }
    const categories = await db.category.findMany({
        orderBy: {
            name: "asc",
        },
    });

    const courses = await getCourse({
        userId: userId,
        ...searchParams,
    });

    console.log(courses)

    return (
        <>
            <div className="px-6 pt-6 md:hidden md:mb-0 block">
                <SearchInput />
            </div>
            <div className="p-6">
                <Categories items={categories} />
                <CoursesList items={courses} />
            </div>

        </>
    );
};

export default SearchPage;
