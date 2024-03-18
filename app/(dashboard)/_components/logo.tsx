import Image from 'next/image'
import React from 'react'

const Logo = () => {
  return (
    <Image alt='Logo' src={'/logo.svg'} width={130} height={130} />
  )
}

export default Logo
