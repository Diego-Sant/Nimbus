"use client";

import React, { useState } from 'react'

import Link from 'next/link';
import Image from 'next/image';

import { Models } from 'node-appwrite';

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Input } from '@/components/ui/input';
import { actionsDropdownItems } from '@/constants';
import { constructDownloadUrl } from '@/lib/utils';
import { Button } from './ui/button';
import { renameFile } from '@/lib/actions/file.actions';
import { usePathname } from 'next/navigation';
import { FileDetails } from './ActionsModalContent';
  

const ActionDropdown = ({ file }: { file: Models.Document }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [action, setAction] = useState<ActionType | null>(null);
    const [name, setName] = useState(file.name.replace(`.${file.extension}`, ""));

    const path = usePathname();

    const closeAllModals = () => {
        setIsModalOpen(false);
        setIsDropdownOpen(false);
        setAction(null);
        setName(file.name);
    };

    const handleAction = async() => {
        if (!action) return;
        setIsLoading(true);

        let success = false;

        const actions = {
            rename: () => 
                renameFile({ fileId: file.$id, name: name.trim(), 
                    extension: file.extension, path
                }),

            share: () => console.log("share"),
            delete: () => console.log("delete"),
        }

        success = await actions[action.value as keyof typeof actions]();

        if (success) closeAllModals();

        setIsLoading(false);
    }

    const renderDialogContent = () => {
        if (!action) return null;

        const { value, label } = action;

        return (
            <DialogContent className='shad-dialog button'>
                <DialogHeader className='flex flex-col gap-3'>

                    <DialogTitle className='text-center text-light-100'>
                        {label}
                    </DialogTitle>

                    {value === 'rename' && (
                        <Input type='text' value={name}
                            onChange={(e) => setName(e.target.value)} 
                        />
                    )}

                    {value === 'details' && (
                        <FileDetails file={file} />
                    )}
                    
                </DialogHeader>

                {['rename', 'delete', 'share'].includes(value) && (
                    <DialogFooter className='flex flex-col gap-3 md:flex-row'>

                        <Button onClick={closeAllModals} 
                            className='modal-cancel-button'>
                            Voltar
                        </Button>

                        <Button onClick={handleAction} 
                            className='modal-submit-button'>

                            <p className='capitalize'>
                                {label}
                            </p>
                            {isLoading && (
                                <Image src="/icons/loader.svg"
                                    alt='Carregando...' width={24}
                                    height={24} className='animate-spin'
                                />
                            )}

                        </Button>

                    </DialogFooter>
                )}
            </DialogContent>
        )
    }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>


            <DropdownMenuTrigger className='shad-no-focus'>
                <Image src="/icons/dots.svg" alt='Abrir menu' 
                    width={34} height={34} 
                />
            </DropdownMenuTrigger>

            <DropdownMenuContent className='min-w-[250px] mr-2 sm:mr-0'>

                <DropdownMenuLabel className='max-w-[200px] truncate'>
                    {file.name}
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                {actionsDropdownItems.map((actionItem) => (
                    <DropdownMenuItem key={actionItem.value}
                        className='shad-dropwdown-item' 
                        onClick={() => {
                            setAction(actionItem)

                            if(['rename', 'share', 'delete', 'details'].includes(actionItem.value)) {
                                setIsModalOpen(true);
                            }
                        }}
                    >

                        {actionItem.value === 'download' ? (
                            <Link href={constructDownloadUrl(file.bucketFileId)}
                            download={file.name} className='flex items-center gap-2'
                            >
                        
                            <Image src={actionItem.icon} alt={actionItem.label}
                                width={30} height={30} 
                            />
                            {actionItem.label}

                        </Link>
                        ) : 
                        <div className='flex items-center gap-2'>
                            <Image src={actionItem.icon} alt={actionItem.label}
                                width={30} height={30} 
                            />
                            {actionItem.label}
                        </div>}
                        

                    </DropdownMenuItem>
                ))}

            </DropdownMenuContent>
        </DropdownMenu>

        {renderDialogContent()}
    </Dialog>
  )
}

export default ActionDropdown
