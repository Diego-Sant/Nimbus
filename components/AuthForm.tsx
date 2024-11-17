"use client"

import { useForm } from "react-hook-form";
import { useState } from "react";
import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem,
FormLabel, FormMessage } from "@/components/ui/form";
import Link from "next/link";
import { createAccount } from "@/lib/actions/user.actions";
import OTPModal from "./OTPModal";

type FormType = 'entrar' | 'cadastrar';

const authFormSchema = (formType: FormType) => {
    return z.object({
        email: z.string().email("Por favor, insira um email válido."),
        username: formType === "entrar" ? 
            z.string().min(2, "O nome de usuário deve ter no mínimo 2 caracteres.")
            .max(50, "O nome de usuário deve ter no máximo 50 caracteres.") 
            : z.string().optional(),
    })
}

const AuthForm = ({ type }: {type: FormType}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [accountId, setAccountId] = useState(null);

    const formSchema = authFormSchema(type);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          username: "",
          email: ""
        },
    })
    
    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        setErrorMessage('');

        try {
            const user = await createAccount({ 
                username: values.username || "",
                email: values.email
            });
            
            setAccountId(user.accountId);

        } catch {
            setErrorMessage("Falha ao criar o usuário, tente novamente mais tarde!")
        } finally {
            setIsLoading(false);
        }
    }

  return (
    <>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
                <h1 className="form-title">
                    {type === "cadastrar" ? "Cadastrar" : "Entrar"}
                </h1>

                {type === "entrar" && (
                    <FormField control={form.control} name="username"
                    render={({ field }) => (
    
                        <FormItem>

                            <div className="shad-form-item">
                                <FormLabel className="shad-form-label">
                                    Nome
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="Coloque o nome do usuário" 
                                        className="shad-input" {...field} 
                                        autoFocus={type === "entrar"}
                                    />
                                </FormControl>
                            </div>
        
                            <FormMessage className="shad-form-message" />
                        </FormItem>
                        
                    )}
                    />
                )}

                <FormField control={form.control} name="email"
                    render={({ field }) => (
    
                    <FormItem>

                        <div className="shad-form-item">
                            <FormLabel className="shad-form-label">
                                Email
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="Coloque o email" 
                                    className="shad-input" {...field}
                                    autoFocus={type === "cadastrar"} 
                                />
                            </FormControl>
                        </div>
    
                        <FormMessage className="shad-form-message" />
                    </FormItem>
                    
                )}
                />

                <Button type="submit" className="form-submit-button" disabled={isLoading}>
                    <p className="flex items-center gap-2 text-[18px]">
                        {type === "entrar" ? "Entrar" : "Cadastrar"}
                        {isLoading && (
                            <Image src="/icons/loader.svg" alt="Carregamento"
                                width={24} height={24} className="ml-2 animate-spin" 
                            />
                        )}
                    </p>
                </Button>

                {errorMessage && (
                    <p className="error-message">*{errorMessage}</p>
                )}

                <div className="body-2 flex justify-center">
                    <p className="text-light-100">
                        {type === "entrar" ? "Ainda não tem uma conta?" :
                        "Já tem uma conta?"}
                    </p>
                    <Link href={type === "entrar" ? "/cadastrar" : "/entrar"}
                        className="ml-1 font-medium text-primaryColor">
                            {type === "entrar" ? "Cadastre-se" : "Entrar"}
                    </Link>
                </div>

            </form>
        </Form>

        {true && (
            <OTPModal email={form.getValues('email')} accountId={accountId} />
        )}
    </>
  )
}

export default AuthForm
