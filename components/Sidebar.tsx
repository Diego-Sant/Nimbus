"use client";

import React from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { navItems } from '@/constants'
import { cn } from '@/lib/utils';

interface Props {
  username: string;
  avatar: string;
  email: string;
}

const Sidebar = ({ username, avatar, email }: Props) => {
  const pathname = usePathname();

  return (
    <aside className='sidebar'>
      <Link href="/" className='flex items-center gap-4'>

        <Image src="/Nimbus.svg" alt='Nimbus Logo' 
          width={95} height={82} className='hidden h-auto lg:block'
        />
        <h1 className='hidden text-[30px] font-bold text-primaryColor lg:block'>Nimbus</h1>

        <Image src="/Nimbus.svg" alt='Nimbus Logo' 
          width={65} height={82} className='lg:hidden'
        />

      </Link>

      <nav className='sidebar-nav'>
        <ul className='flex flex-1 flex-col gap-6'>
          {navItems.map(({ url, name, icon }) => (
            <Link href={url} key={name} className='lg:w-full'>
              <li className={cn("sidebar-nav-item", (pathname === url) && "shad-active")}>
                
                <Image src={icon} alt={name} width={24} height={24} 
                  className={cn("nav-icon", (pathname === url) && "nav-icon-active")}/>
                <p className='hidden lg:block'>{name}</p>

              </li>
            </Link>
          ))}
        </ul>
      </nav>

      <div className='flex items-center justify-center'>
        <Image src="/Illustration-2.svg" alt='Ilustração de armazenamento na nuvem'
        width={200} height={200}/>
      </div>

      <div className='sidebar-user-info'>

          <Image src={avatar} alt='Avatar' width={44} height={44}
            className='sidebar-user-avatar' />

          <div className='hidden lg:block'>
            <p className='subtitle-2 max-w-[150px] truncate capitalize xl:max-w-[200px]'>
              {username}
            </p>
            <p className='caption max-w-[150px] truncate xl:max-w-[200px]'>
              {email}
            </p>
          </div>
          
      </div>
    </aside>
  )
}

export default Sidebar
