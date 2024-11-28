import React from 'react'
import Image from 'next/image'

import { signOutUser } from '@/lib/actions/user.actions'
import { Button } from '@/components/ui/button'
import Search from '@/components/Search'
import FileUploader from '@/components/FileUploader'

const Header = ({ userId, accountId }: { userId: string, accountId: string }) => {
  return (
    <header className="header">
      <Search />
      
      <div className="header-wrapper">
        <FileUploader ownerId={userId} accountId={accountId}  />

        <form action={async() => {
          "use server";

          await signOutUser();
        }}>

          <Button type="submit" className="sign-out-button">
            <Image src="/icons/logout.svg" alt="Sair da conta"
              width={24} height={24} className="w-6" />
          </Button>
        </form>
      </div>
    </header>
  )
}

export default Header
