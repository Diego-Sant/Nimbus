"use server";

import { ID, Query } from "node-appwrite";

import { createAdminClient, createSessionClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";
import { avatarPlaceholderUrl } from "@/constants";

const getUserByEmail = async (email: string) => {
    const { databases } = await createAdminClient();

    const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.equal("email", [email])]
    );

    return result.total > 0 ? result.documents[0] : null;
};

const handleError = (error: unknown, message: string) => {
    console.log(error, message);
    throw error;
}

export const sendEmailOTP = async ({ email }: { email: string}) => {
    const { account } = await createAdminClient();

    try {
        const session = await account.createEmailToken(ID.unique(), email);

        return session.userId;

    } catch (error) {
        handleError(error, "Falha ao enviar a senha única para o email.")
    }
}

export const createAccount = async({ username, email }: { username: string; email: string}) => {
    const existingUser = await getUserByEmail(email);

    const accountId = await sendEmailOTP({ email });

    if (!accountId) throw new Error("Falha ao enviar a senha única.");

    if (!existingUser) {
        const { databases } = await createAdminClient();

        await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            ID.unique(),
            {
                username,
                email,
                avatar: avatarPlaceholderUrl,
                accountId
            }
        )
    }

    return parseStringify({ accountId });
}

export const verifySecret = async ({ accountId, password }: { accountId: string; password: string}) => {
    try {
        const { account } = await createAdminClient();
        const session = await account.createSession(accountId, password);

        (await cookies()).set('appwrite-session', session.secret, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: true
        });

        return parseStringify({ sessionId: session.$id })

    } catch (error) {
        handleError(error, "Falha ao verificar senha única.")
    }
};

export const getCurrentUser = async () => {
    const sessionClient = await createSessionClient();

    if (!sessionClient) return null;

    const { databases, account } = sessionClient;

    try {
        const result = await account.get();

        const user = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [Query.equal("accountId", result.$id)]
        );

        if (user.total <= 0) return null;

        return parseStringify(user.documents[0]);
    } catch (error) {
        console.error("Erro ao buscar usuário atual:", error);
        return null;
    }
};