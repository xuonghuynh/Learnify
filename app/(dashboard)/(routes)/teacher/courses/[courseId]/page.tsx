import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'

const CourseIdPage = async({params} : {
  params: {courseId: string}
}) => {

  const { userId } = auth();

  if(!userId) {
    return redirect('/')
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId
    }
  })

  if(!course) {
    return redirect('/')
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId
  ]

  const totalFields = requiredFields.length
  const completedFields = requiredFields.filter(Boolean).length
  const completionText = `${completedFields}/${totalFields}`
   
  return (
    <div className='p-6'> 
      <div className='items-center justify-center flex'></div>
      {completionText}
    </div>
  )
}

export default CourseIdPage
