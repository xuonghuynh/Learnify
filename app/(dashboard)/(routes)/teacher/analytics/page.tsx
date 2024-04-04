import { getAnalytics } from "@/actions/get-analysis";
import Chart from "@/app/(dashboard)/(routes)/teacher/analytics/_components/chart";
import DataCard from "@/app/(dashboard)/(routes)/teacher/analytics/_components/data-card";
import { auth } from "@clerk/nextjs";
import axios from "axios";
import { redirect } from "next/navigation";
import React from "react";

const AnalyticsPage = async () => {
    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    const { data, totalRevenue, totalSales } = await getAnalytics(userId);

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <DataCard label="Total Sales" value={totalSales} />
                <DataCard label="Total Revenue" value={totalRevenue} shouldFormat />
            </div>
            <Chart data={data} />
        </div>
    );
};

export default AnalyticsPage;
