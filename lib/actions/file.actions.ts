"use server";

import { revalidatePath } from "next/cache";

import { InputFile } from "node-appwrite/file";
import { ID, Models, Query } from "node-appwrite";

import { createAdminClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { constructFileUrl, getFileType, parseStringify } from "../utils";
import { getCurrentUser } from "./user.actions";

const handleError = (error: unknown, message: string) => {
    console.log(error, message);
    throw error;
}

export const uploadFile = async({ file, ownerId, accountId, path }
    : UploadFileProps) => {
        const { storage, databases } = await createAdminClient();

        try {
            const inputFile = InputFile.fromBuffer(file, file.name);

            const bucketFile = await storage.createFile(
                appwriteConfig.bucketId,
                ID.unique(),
                inputFile
            );

            const fileDocument = {
                type: getFileType(bucketFile.name).type,
                name: bucketFile.name,
                url: constructFileUrl(bucketFile.$id),
                extension: getFileType(bucketFile.name).extension,
                size: bucketFile.sizeOriginal,
                owner: ownerId,
                accountId,
                users: [],
                bucketFileId: bucketFile.$id
            };

            const newFile = await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.filesCollectionId,
                ID.unique(),
                fileDocument
            ).catch((async (error: unknown) => {
                await storage.deleteFile(
                    appwriteConfig.bucketId, 
                    bucketFile.$id
                );
                handleError(error, "Falha ao criar o documento no banco de dados.")
            }));

            revalidatePath(path);

            return parseStringify(newFile);
            
        } catch (error) {
            handleError(error, "Falha ao enviar o arquivo.");
        }
};

const createQueries = (currentUser: Models.Document) => {
    const queries = [
        Query.or([
            Query.equal("owner", [currentUser.$id]),
            Query.contains("users", [currentUser.email])
        ])
    ];

    return queries;
}

export const getFiles = async() => {
    const { databases } = await createAdminClient();

    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) throw new Error("Usuário não encontrado.");

        const queries = createQueries(currentUser);

        console.log({currentUser, queries})

        const files = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            queries
        );

        console.log(files);

        return parseStringify(files);

    } catch (error) {
        handleError(error, "Falha ao buscar os arquivos.");
    }
}