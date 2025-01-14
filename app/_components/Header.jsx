"use client"
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'

export default function Header() {

  const {user, isSignedIn}=useUser();
  return (
    <div className='p-5 flex justify-between items-center border shadow-sm'>
      <Image
      src={'./logo.svg'}
      alt='Logo'
      width={160}
      height={100}
       />
       {isSignedIn ? <UserButton/>: 
       <Link href={'/dashboard'}>
       <Button>Getting Started</Button>
       </Link>
       }       
    </div>
  )
}
