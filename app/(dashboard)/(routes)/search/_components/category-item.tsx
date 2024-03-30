"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import React from "react";
import { IconType } from "react-icons";

interface CategoryItemProps {
    label: string;
    value?: string;
    icon?: IconType;
}
const CategoryItem = ({ label, icon: Icon, value }: CategoryItemProps) => {
    const pathName = usePathname();
    const router = useRouter();
    const searchParam = useSearchParams();

    const currentCaterogyId = searchParam.get("categoryId");
    const currentTitle = searchParam.get("title");

    const isSelected = currentCaterogyId === value;

    const onClick = () => {
        const url = qs.stringifyUrl(
            {
                url: pathName,
                query: {
                    title: currentTitle,
                    categoryId: isSelected ? null : value,
                },
            },
            { skipNull: true, skipEmptyString: true }
        );
        router.push(url);
    };

    return (
        <div>
            <Button
                onClick={onClick}
                variant={"ghost"}
                className={cn(
                    "py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 hover:border-sky-700 transition",
                    isSelected &&
                        "border-sky-700 text-sky-800 bg-sky-200/20"
                )}
                type="button"
            >
                {Icon && <Icon size={20} />}
                <div className="truncate">{label}</div>
            </Button>
        </div>
    );
};

export default CategoryItem;
