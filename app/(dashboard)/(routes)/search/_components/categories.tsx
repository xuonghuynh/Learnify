'use client'
import { Category } from "@prisma/client";
import React from "react";
import {
    FcEngineering,
    FcFilmReel,
    FcMultipleDevices,
    FcMusic,
    FcOldTimeCamera,
    FcSalesPerformance,
    FcSportsMode,
    FcRuler,
    FcBiomass
} from "react-icons/fc";
import { IconType } from "react-icons";
import CategoryItem from "@/app/(dashboard)/(routes)/search/_components/category-item";

interface CategoriesProps {
    items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
    "Music": FcMusic,
    "Accounting": FcSalesPerformance,
    "Fitness": FcSportsMode,
    "Filming": FcFilmReel,
    "Programming": FcMultipleDevices,
    "Photography": FcOldTimeCamera,
    "Engineering": FcEngineering,
    "Mathematics": FcRuler,
    "Science": FcBiomass
}

const Categories = ({ items }: CategoriesProps) => {
    return (
        <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
            {items.map((item) => (
                <CategoryItem key={item.id} label={item.name} icon={iconMap[item.name]} value={item.id} />
            ))}
        </div>
    );
};

export default Categories;
