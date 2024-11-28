"use client";

import React, { useState } from 'react'
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { sendEmailOTP, verifySecret } from '@/lib/actions/user.actions';

import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription,
AlertDialogFooter, AlertDialogHeader, AlertDialogTitle} from '@/components/ui/alert-dialog'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'

const OTPModal = ({ accountId, email }: { accountId: string; email: string}) => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");

  const handleSubmit = async(e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const sessionId = await verifySecret({ accountId, password });

      if(sessionId) {
        router.push("/");
      }
      
    } catch (error) {
      console.log("Falha ao verificar senha única.", error);
    }

    setIsLoading(false);
  }

  const handleResendOTP = async() => {
    await sendEmailOTP({ email });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="shad-alert-dialog">

        <AlertDialogHeader className="relative flex justify-center">
          <AlertDialogTitle className="h2 text-center">
            Digite sua senha única.
            <Image src="/icons/close-dark.svg" alt="Fechar Modal" width={20} height={20}
              onClick={() => setIsOpen(false)} className="otp-close-button"
            />
          </AlertDialogTitle>

          <AlertDialogDescription className="subtitle-2 text-center text-light-100">
            Uma senha única foi enviada para o endereço de email 
            <span className="pl-1 text-primaryColor">{email}</span>. 
            Por favor, verifique sua caixa de entrada e insira o código no campo abaixo 
            para continuar. Caso não encontre, verifique também sua pasta de spam ou lixo 
            eletrônico.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <InputOTP maxLength={6} value={password} onChange={setPassword}>
          <InputOTPGroup className="shad-otp">
            <InputOTPSlot index={0} className="shad-otp-slot"/>
            <InputOTPSlot index={1} className="shad-otp-slot"/>
            <InputOTPSlot index={2} className="shad-otp-slot"/>
            <InputOTPSlot index={3} className="shad-otp-slot"/>
            <InputOTPSlot index={4} className="shad-otp-slot"/>
            <InputOTPSlot index={5} className="shad-otp-slot"/>
          </InputOTPGroup>
        </InputOTP>

        <AlertDialogFooter>
          <div className="flex w-full flex-col gap-4">
            <AlertDialogAction onClick={handleSubmit} className="shad-submit-btn h-12"
              type="button"
            >
              Enviar
              {isLoading && (
                <Image src="/icons/loader.svg" alt="Carregamento" width={24} height={24}
                className="ml-2 animate-spin"/>
              )}
            </AlertDialogAction>

            <div className="subtitle-2 mt-2 text-center text-light-100">
              Não recebeu a mensagem na caixa de entrada?
              <Button type="button" variant="link" className="pl-1 text-primaryColor"
                onClick={handleResendOTP}>
                  Clique para reenviar.
              </Button>
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default OTPModal
