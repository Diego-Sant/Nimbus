import React from 'react';
import { redirect } from 'next/navigation';

import { ToastContainer } from 'react-toastify';
import { Toaster } from "@/components/ui/toaster";
import 'react-toastify/dist/ReactToastify.css';

import Header from '@/components/Header';
import MobileNavigation from '@/components/MobileNavigation';
import Sidebar from '@/components/Sidebar';

import { getCurrentUser } from '@/lib/actions/user.actions';

const Layout = async({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();

  if(!currentUser) return redirect("/entrar");

  return (
    <main className="flex h-screen">
        <Sidebar {... currentUser}/>

        <section className="flex h-full flex-1 flex-col">

            <MobileNavigation {... currentUser} />
            <Header userId={currentUser.$id} accountId={currentUser.accountId} />
            <div className="main-content">
                {children}
            </div>

        </section>

        <ToastContainer />
        <Toaster />
    </main>
  )
}

export default Layout
