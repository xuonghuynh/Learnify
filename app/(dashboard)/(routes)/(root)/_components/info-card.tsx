import IconBadget from "@/components/icon-badge";
import { LucideIcon } from "lucide-react";
import React from "react";

interface InfoCardProps {
    label: string;
    numberOfItems: number;
    icon: LucideIcon;
    variant?: "default" | "success";
}
const InfoCard = ({
    label,
    numberOfItems,
    icon: Icon,
    variant,
}: InfoCardProps) => {
    return (
        <div className="border rounded-md flex items-center gap-x-2 p-3">
            <IconBadget icon={Icon} variant={variant} />
            <div>
                <p className="font-medium">{label}</p>
                <p className="text-sm text-gray-500">{numberOfItems} {numberOfItems === 1 ? "Course" : "Courses"}</p>
            </div>
        </div>
    );
};

export default InfoCard;
