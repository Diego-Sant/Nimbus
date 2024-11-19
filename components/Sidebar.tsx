"use client";

import React, { useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { navItems } from '@/constants'
import { cn } from '@/lib/utils';
import AvatarSelectionDialog from './AvatarSelectionDialog';
import { getCurrentUser, updateAvatar } from '@/lib/actions/user.actions';

const Sidebar = ({ username, avatar, email }: SidebarProps) => {
  const pathname = usePathname();
  const [currentAvatar, setCurrentAvatar] = useState(avatar);

  const handleAvatarChange = async (newAvatar: string) => {
    setCurrentAvatar(newAvatar);

    try {
        const user = await getCurrentUser();
        if (user) {
            await updateAvatar(user.$id, newAvatar);
        }
    } catch (error) {
        console.error("Erro ao atualizar o avatar no backend:", error);
    }
  };

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

      <div className='hidden items-center justify-center lg:flex'>
        <Image src="/Illustration-2.svg" alt='Ilustração de armazenamento na nuvem'
        width={160} height={160}/>
      </div>

      <div className='sidebar-user-info'>

          <AvatarSelectionDialog
              currentAvatar={currentAvatar}
              onAvatarChange={handleAvatarChange}
          />

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
