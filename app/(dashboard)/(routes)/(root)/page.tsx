import { Button } from "@/components/ui/button";
import Image from "next/image";
import { UserButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import GetDashboardCourses from "@/actions/get-dashboard-courses";
import CoursesList from "@/components/courses-list";
import { CheckCircle, Clock } from "lucide-react";
import InfoCard from "@/app/(dashboard)/(routes)/(root)/_components/info-card";

export default async function Dashboard() {
    const { userId } = auth();
    if (!userId) {
        redirect("/");
    }
    const { completedCourses, courseInProgress } =
        await GetDashboardCourses(userId);

    return (
        <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <InfoCard label="In Progress" numberOfItems={courseInProgress.length} icon={Clock} />
                </div>
                <div>
                    <InfoCard label="Completed" numberOfItems={completedCourses.length} icon={CheckCircle} variant="success" />
                </div>
            </div>
            <CoursesList items={[...courseInProgress, ...completedCourses]} />
        </div>
    );
}
