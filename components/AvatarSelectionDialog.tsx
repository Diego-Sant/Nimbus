"use client";

import React, { useState } from "react";
import Image from "next/image";

import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";

const avatarOptions = [
    "https://img.freepik.com/premium-vector/man-empty-avatar-casual-business-style-vector-photo-placeholder-social-networks-resumes_885953-434.jpg",
    "https://cdn-icons-png.flaticon.com/128/1154/1154480.png",
    "https://cdn-icons-png.flaticon.com/128/4140/4140042.png",
    "https://cdn-icons-png.flaticon.com/128/4140/4140048.png",
    "https://cdn-icons-png.flaticon.com/128/706/706830.png",
    "https://cdn-icons-png.flaticon.com/128/4140/4140061.png",
    "https://cdn-icons-png.flaticon.com/128/921/921124.png",
    "https://cdn-icons-png.flaticon.com/128/4140/4140047.png",
    "https://cdn-icons-png.flaticon.com/128/706/706831.png",
    "https://img.freepik.com/premium-vector/black-african-american-man-with-beard-round-avatar-face-icon-flat-style_768258-2089.jpg",
    "https://cdn-icons-png.flaticon.com/128/4140/4140055.png",
    "https://cdn-icons-png.flaticon.com/128/4333/4333637.png",
    "https://cdn-icons-png.flaticon.com/128/4322/4322991.png",
    "https://cdn-icons-png.flaticon.com/128/1326/1326377.png",
    "https://cdn-icons-png.flaticon.com/128/3940/3940403.png",
    "https://cdn-icons-png.flaticon.com/128/3940/3940417.png",
    "https://cdn-icons-png.flaticon.com/128/1326/1326405.png",
    "https://cdn-icons-png.flaticon.com/128/1326/1326390.png",
    "https://cdn-icons-png.flaticon.com/128/1308/1308845.png",
    "https://cdn-icons-png.flaticon.com/128/1326/1326382.png"
];

const AvatarSelectionDialog = ({ currentAvatar, onAvatarChange }: AvatarSelectionDialogProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);

    const handleSave = () => {
        onAvatarChange(selectedAvatar);
        setIsOpen(false);
    };
    
    const handleCancel = () => {
    setSelectedAvatar(currentAvatar);
    setIsOpen(false);
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <Image
              src={currentAvatar}
              alt="Avatar Atual"
              width={44}
              height={44}
              className="sidebar-user-avatar cursor-pointer"
            />
          </AlertDialogTrigger>
    
          <AlertDialogContent>
            <AlertDialogTitle className="text-[26px] font-semibold">Escolha um Avatar</AlertDialogTitle>
            <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-4">
              {avatarOptions.map((avatar, index) => (

                <div key={index} className={`flex cursor-pointer items-center justify-center 
                    rounded-md border p-2 ${avatar === selectedAvatar ? 
                    "border-blue" : "border-neutral-200"}`} 
                    onClick={() => setSelectedAvatar(avatar)}>

                    <Image src={avatar} alt={`Avatar ${index + 1}`} 
                      width={64} height={64} className="header-choose-user-avatar" 
                    />
                </div>
            
            ))}
            
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
                <Button className="uploader-button-cancel" onClick={handleCancel}>
                    Cancelar
                </Button>
                <Button className="uploader-button"  onClick={handleSave}>
                    Salvar
                </Button>
            </div>
          </AlertDialogContent>
        </AlertDialog>
    );
};
    
export default AvatarSelectionDialog;