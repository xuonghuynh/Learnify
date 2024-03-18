'use client'
import SidebarRouteItem from '@/app/(dashboard)/_components/sidebar-route-item'
import { BarChart, Compass, Layout, List } from 'lucide-react'
import { usePathname } from 'next/navigation'
import React from 'react'

const guestRoutesMenu = [
    {
        lable: "Dashboard",
        href: "/",
        icon: Layout
    },
    {
        lable: "Browse",
        href: "/search",
        icon: Compass
    }
]

const teacherRoutesMenu = [
    {
        lable: "Courses",
        href: "/teacher/courses",
        icon: List
    },
    {
        lable: "Analytics",
        href: "/teacher/analytics",
        icon: BarChart
    }
]

const SidebarRoutes = () => {
    const pathname = usePathname();
    const routes = pathname?.includes('/teacher') ? teacherRoutesMenu : guestRoutesMenu

    return (
        <div className='w-full flex flex-col'>
            {routes.map((route) => {
                return (
                    <SidebarRouteItem key={route.href} lable={route.lable} icon={route.icon} href={route.href} />
                )
            })}
        </div>
    )
}

export default SidebarRoutes
