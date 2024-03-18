import MobileSidebar from '@/app/(dashboard)/_components/mobile-sidebar'
import NavbarRoutes from '@/components/navbar-routes'
import React from 'react'

const Navbar = () => {
  return (
    <div className='p-4 flex items-center bg-white h-full border-b shadow-sm'>
      <MobileSidebar />
      <NavbarRoutes />
    </div>
  )
}

export default Navbar
