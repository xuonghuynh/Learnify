import { columns } from "@/app/(dashboard)/(routes)/teacher/courses/_components/columns";
import { DataTable } from "@/app/(dashboard)/(routes)/teacher/courses/_components/data-table";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const CoursesPage = async () => {

    const { userId } = auth();

    if(!userId) {
        return redirect("/");
    }

    const courses = await db.course.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="p-6">
            <DataTable columns={columns} data={courses} />
        </div>
    );
};

export default CoursesPage;
