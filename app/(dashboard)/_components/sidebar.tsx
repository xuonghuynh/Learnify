import Logo from '@/app/(dashboard)/_components/logo'
import SidebarRoutes from '@/app/(dashboard)/_components/sidebar-routes'
import React from 'react'

const Sidebar = () => {
  return (
    <div className='h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm'>
      <div className="p-6">
        <Logo />
      </div>
      <div className="w-full mt-[8px]">
        <SidebarRoutes />
      </div>
    </div>
  )
}

export default Sidebar
