import { Menu } from 'lucide-react'
import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import Sidebar from '@/app/(dashboard)/_components/sidebar'

const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger className='md:hidden p-4 hover:opacity-75 transition'>
        <Menu />
      </SheetTrigger>
      <SheetContent side={"left"} className='bg-white p-0'>
        <Sidebar />
      </SheetContent>
    </Sheet>
  )
}

export default MobileSidebar
