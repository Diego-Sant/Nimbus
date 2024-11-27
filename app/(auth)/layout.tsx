import { getCurrentUser } from '@/lib/actions/user.actions';
import Image from 'next/image'
import { redirect } from 'next/navigation';
import React from 'react'

const Layout = async({ children }: {children: React.ReactNode}) => {
    const currentUser = await getCurrentUser();

    if (currentUser) return redirect('/');

    return (
        <div className='flex min-h-screen'>
            <section className='hidden w-1/2 items-center justify-center 
                bg-primaryColor p-10 lg:flex xl:w-2/5'>

                <div className='flex max-h-[800px] max-w-[480px] flex-col justify-center 
                    space-y-12'>

                    <div className='flex items-center gap-2'>
                        <Image src="/Nimbus.svg" alt='Nimbus Logo' 
                        width={110} height={82} className='h-auto'
                        />
                        <h1 className='h1 text-white'>Nimbus</h1>
                    </div>
                    
                    <div className='space-y-7 text-white'>
                        <h1 className='h1'>
                            Acesse seus arquivos com segurança no Nimbus.
                        </h1>
                        <p className='body-1'>
                            Organize, compartilhe e acesse seus arquivos de qualquer 
                            lugar, com facilidade e proteção. Simples, rápido e ao seu 
                            alcance.
                        </p>
                        <div className="flex justify-center pr-20">
                            <Image 
                            src="/Illustration.svg" 
                            alt="Arquivos" 
                            width={280} 
                            height={280} 
                            className="transition-all hover:scale-105"
                            />
                        </div>
                    </div>

                </div>

            </section>
            
            <section className='flex flex-1 flex-col items-center bg-white p-4 py-10
                lg:justify-center lg:p-10 lg:py-0'>

                <div className='mb-16 lg:hidden'>
                    <Image src="/Nimbus.svg" alt="Nimbus Logo" width={167} height={82}
                        className='h-auto' />
                </div>
                {children}
                
            </section>
        </div>
    )
}

export default Layout
