"use client";

import React, { useState } from 'react'
import { usePathname } from 'next/navigation';
import Image from 'next/image'
import Link from 'next/link';

import { getCurrentUser, signOutUser, updateAvatar } from '@/lib/actions/user.actions';
import { cn } from '@/lib/utils';
import { navItems } from '@/constants';

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import FileUploader from '@/components/FileUploader';
import AvatarSelectionDialog from '@/components/AvatarSelectionDialog';

interface Props {
  ownerId: string;
  accountId: string;
  username: string;
  avatar: string;
  email: string;
}

const MobileNavigation = ({ username, avatar, email}: Props) => {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(avatar);

  const handleAvatarChange = async (newAvatar: string) => {
    setCurrentAvatar(newAvatar);

    try {
        const user = await getCurrentUser();
        if (user) {
            await updateAvatar(user.$id, newAvatar);
        }
    } catch (error) {
        console.error("Erro ao atualizar o avatar.", error);
    }
  };

  return (
    <header className='mobile-header'>
      <div className='flex items-center gap-3'>
        <Image src="/Nimbus.svg" alt='Nimbus Logo' width={60} height={52} />
        <h1 className='mt-1 text-[20px] font-bold text-primaryColor'>Nimbus</h1>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <Image src="/icons/menu.svg" alt='Menu Hamburguer' width={30} height={30} />
        </SheetTrigger>
        <SheetContent className='shad-sheet h-screen px-3'>

          <SheetTitle>
            <div className='header-user'>
              <AvatarSelectionDialog
                  currentAvatar={currentAvatar}
                  onAvatarChange={handleAvatarChange}
              />
              <div>
                <p className='subtitle-2 max-w-[240px] truncate capitalize'>{username}</p>
                <p className='caption max-w-[240px] truncate'>{email}</p>
              </div>
            </div>

            <Separator className='mb-4 bg-light-200/20'/>
          </SheetTitle>

          <nav className='mobile-nav'>
            <ul className='mobile-nav-list'>
              {navItems.map(({ url, name, icon }) => (
                <Link href={url} key={name} className='lg:w-full'>
                  <li className={cn("mobile-nav-item", (pathname === url) && "shad-active")}>
                    
                    <Image src={icon} alt={name} width={24} height={24} 
                      className={cn("nav-icon", (pathname === url) && "nav-icon-active")}/>
                    <p>{name}</p>

                  </li>
                </Link>
              ))}
            </ul>

          </nav>

          <Separator className='my-5 bg-light-200/20' />

          <div className='flex flex-col justify-between gap-5 pb-5'>
            <FileUploader />

            <Button type='submit' className='mobile-sign-out-button' 
              onClick={async() => await signOutUser()}>
              <Image src="/icons/logout.svg" alt='Sair da conta'
                width={24} height={24} />
              <p>Sair</p>
            </Button>
          </div>
            
        </SheetContent>
      </Sheet>
      
    </header>
  )
}

export default MobileNavigation
