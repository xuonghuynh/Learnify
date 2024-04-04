import Navbar from '@/app/(dashboard)/_components/navbar';
import Sidebar from '@/app/(dashboard)/_components/sidebar';
import { Toaster } from '@/components/ui/toaster';
import React from 'react';

export const runtime = "edge";

const DashboardLayout = ({ children }: {children: React.ReactNode}) => {
  return (
    <div className="h-full">
        <div className="w-full h-[80px] fixed inset-y-0 md:pl-56">
            <Navbar />
        </div>
        <div className="hidden h-full w-56 md:flex flex-col fixed inset-y-0 z-50">
            <Sidebar></Sidebar>
        </div>
        <div className="md:pl-56 h-full pt-[80px]">
            {children}
            <Toaster />
        </div>
    </div>
  );
};

export default DashboardLayout;