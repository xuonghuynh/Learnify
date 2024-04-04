import React from 'react'

export const runtime = "edge";

const AuthLayout = ({children}: Readonly<{children: React.ReactNode;}>) => {
  return (
    <div className='h-full flex justify-center items-center'>
        {children}
      </div>
  )
}

export default AuthLayout
