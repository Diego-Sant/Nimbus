"use client";

import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

import { usePathname } from 'next/navigation';
import Image from 'next/image';

import { Models } from 'node-appwrite';

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileDetails, RemoveUser, ShareInput } from '@/components/ActionsModalContent';
  
import { actionsDropdownItems } from '@/constants';
import { constructDownloadUrl } from '@/lib/utils';
import { deleteFile, removeFileUser, renameFile, updateFileUsers } from '@/lib/actions/file.actions';
import { getCurrentUser } from '@/lib/actions/user.actions';

const ActionDropdown = ({ file }: { file: Models.Document }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const [emails, setEmails] = useState<string[]>([]);
    const [action, setAction] = useState<ActionType | null>(null);
    const [name, setName] = useState(file.name.replace(`.${file.extension}`, ""));
    const [currentUser, setCurrentUser] = useState<Models.Document | null>(null);

    const path = usePathname();

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const user = await getCurrentUser();
            setCurrentUser(user);
        };

        fetchCurrentUser();
    }, []);

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

        if (action.value === "share") {
            const emailInput = emails.join(', ')

            if (emailInput.trim() === "") {
                toast.error(
                    "O campo precisa ser enviado ou esvaziado antes de clicar no botão de compartilhar.",
                    {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        theme: "light",
                    }
                );
                setIsLoading(false);
                return;
            }

            if (emails.length === 0) {
                toast.error("Por favor, adicione ao menos um email antes de compartilhar.", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                });
                setIsLoading(false);
                return;
            }
    
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            const invalidEmail = emails.find((email) => !emailRegex.test(email));
    
            if (invalidEmail) {
                toast.error(`O email "${invalidEmail}" não é válido. Por favor, corrija antes de compartilhar.`, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                });
                setIsLoading(false);
                return;
            }
        }

        const actions = {
            rename: () => renameFile({
                fileId: file.$id, name: name.trim(), 
                extension: file.extension, path
                }),
            share: () => updateFileUsers ({
                fileId: file.$id, emails, path
            }),
            delete: () => deleteFile({ 
                fileId: file.$id, path, 
                bucketFileId: file.bucketFileId 
            }),
            remove: () => removeFileUser({
                fileId: file.$id, 
                currentUserEmail: currentUser?.email,path
            })
        }

        success = await actions[action.value as keyof typeof actions]();

        if (success) {
            if (action?.value === "share") {
                toast.success("Seu arquivo foi compartilhado com sucesso!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
            if (action?.value === "delete") {
                toast.success("Seu arquivo foi excluído com sucesso!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            };
            if (action?.value === "rename") {
                toast.success("Seu arquivo foi renomeado com sucesso!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            };
            if (action?.value === "remove") {
                toast.success("Seu email foi removido do compartilhamento com sucesso!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            };

            closeAllModals();
        }

        setIsLoading(false);
    }

    const handleRemoveUser = async (email: string) => {
        const updatedEmails = emails.filter((e) => e !== email);

        const success = await updateFileUsers({
            fileId: file.$id,
            emails: updatedEmails,
            path
        });

        if (success) setEmails(updatedEmails);

        closeAllModals();
    };

    const renderDialogContent = () => {
        if (!action) return null;

        const { value, label } = action;

        return (
            <DialogContent className="shad-dialog button">
                <DialogHeader className="flex flex-col gap-3 cursor-pointer">

                    <DialogTitle className="text-center text-light-100">
                        {label}
                    </DialogTitle>

                    {value === "rename" && (
                        <Input type="text" value={name}
                            onChange={(e) => setName(e.target.value)} 
                        />
                    )}

                    {value === "details" && (
                        <FileDetails file={file} />
                    )}

                    {value === "share" && (
                        <ShareInput file={file}
                            emails={emails}
                            onInputChange={setEmails} 
                            onRemove={handleRemoveUser} 
                        />
                    )}

                    {value === "remove" && (
                        <RemoveUser file={file} />
                    )}

                    {value === "delete" && (
                        <p className="delete-confimation pb-3">
                            Tem certeza que deseja excluir esse arquivo?{` `}
                            <span className="delete-file-name">
                                {file.name}
                            </span>
                        </p>
                    )}
                    
                </DialogHeader>

                {["rename", "delete", "share", "remove"].includes(value) && (
                    <DialogFooter className="flex flex-col gap-3 md:flex-row">

                        <Button onClick={closeAllModals} 
                            className="modal-cancel-button">
                            Voltar
                        </Button>

                        <Button onClick={handleAction} 
                            className="modal-submit-button">

                            <p className="capitalize">
                                {label}
                            </p>
                            {isLoading && (
                                <Image src="/icons/loader.svg"
                                    alt="Carregando..." width={24}
                                    height={24} className="animate-spin"
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


            <DropdownMenuTrigger className="shad-no-focus"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Image src={isHovered ? "/icons/dotshover.svg" 
                    : "/icons/dots.svg"} 
                    alt="Abrir menu" width={34} height={34} 
                />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="min-w-[250px] mr-2 sm:mr-0">

                <DropdownMenuLabel className="max-w-[200px] truncate">
                    {file.name}
                </DropdownMenuLabel>

                <DropdownMenuSeparator />
                
                {actionsDropdownItems.filter(actionItem => {
                    if (currentUser?.username === file.owner.username) {
                        return actionItem.value !== "remove";
                    }
                    return ["details", "download", "remove"].includes(actionItem.value);
                }).map((actionItem) => (

                    <DropdownMenuItem key={actionItem.value} className="shad-dropwdown-item cursor-pointer"
                        onClick={() => {
                            setAction(actionItem);
                            if (["rename", "delete", "share", "details", "remove"].includes(actionItem.value)) {
                                setIsModalOpen(true);
                            }
                        }}
                    >

                        {actionItem.value === "download" ? (
                            <a href={constructDownloadUrl(file.bucketFileId)} download={file.name}
                                className="flex items-center gap-2 w-full h-full">

                                <div className="flex items-center gap-2 w-full">
                                    <Image
                                        src={actionItem.icon}
                                        alt={actionItem.label}
                                        width={30}
                                        height={30}
                                    />
                                    {actionItem.label}
                                </div>

                            </a>

                        ) : (

                            <div className="flex items-center gap-2">
                                <Image
                                    src={actionItem.icon}
                                    alt={actionItem.label}
                                    width={30}
                                    height={30}
                                />
                                {actionItem.label}
                            </div>

                        )}
                    </DropdownMenuItem>
                ))}

            </DropdownMenuContent>
        </DropdownMenu>

        {renderDialogContent()}
    </Dialog>
  )
}

export default ActionDropdown
