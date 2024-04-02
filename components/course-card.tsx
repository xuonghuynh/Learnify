import CourseProgress from '@/components/course-progress'
import IconBadget from '@/components/icon-badge'
import { formatPrice } from '@/lib/format'
import { BookOpen } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface CourseCardProps {
    id: string
    title: string
    imageUrl: string
    category: string | undefined
    chaptersLength: number
    progress: number
    price: number 
}

const CourseCard = ({id, title, imageUrl, category, chaptersLength, progress, price}: CourseCardProps) => {
  return (
    <Link href={`/courses/${id}`}>
        <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
            <div className="relative w-full aspect-video rounded-md overflow-hidden">
                <Image src={imageUrl} alt={title} fill className="object-cover"/>

            </div>
            <div className="flex flex-col pt-2">
                <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">{title}</div>
            </div>
            <p className='text-xs text-muted-foreground'>{category}</p>
            <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
                <div className="flex items-center gap-x-1 text-slate-500">
                    <IconBadget icon={BookOpen} size="sm" />
                    <span>{chaptersLength} {chaptersLength === 1 ? 'chapter' : 'chapters'}</span>
                </div>
            </div>
            {progress !== null ? (
                <CourseProgress value={progress} size='sm' variant={progress === 100 ? 'success' : 'default'} />
            ) : (
                <p className='text-md md:text-sm font-medium text-slate-700'>{formatPrice(price)}</p>
            )}
        </div>
    </Link>
  )
}

export default CourseCard
