"use server";

import { revalidatePath } from 'next/cache';

import { InputFile } from 'node-appwrite/file';
import { ID, Models, Query } from 'node-appwrite';

import { createAdminClient } from '@/lib/appwrite';
import { appwriteConfig } from '@/lib/appwrite/config';
import { constructFileUrl, getFileType, parseStringify } from '@/lib/utils';
import { getCurrentUser } from '@/lib/actions/user.actions';

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

const createQueries = (currentUser: Models.Document, types: string[], searchText: string, sort: string, limit?: number) => {
    const queries = [
        Query.or([
            Query.equal("owner", [currentUser.$id]),
            Query.contains("users", [currentUser.email])
        ])
    ];

    if(types.length > 0) queries.push(Query.equal("type", types));
    if(searchText) queries.push(Query.contains("name", searchText));
    if(limit) queries.push(Query.limit(limit));

    if(sort) {
        const [sortBy, orderBy] = sort.split("-");

        queries.push(orderBy === "asc" ? Query.orderAsc(sortBy) 
            : Query.orderDesc(sortBy));
    }

    return queries;
}

export const getFiles = async({ types = [], searchText = "", sort = "$createdAt-desc", limit }: GetFilesProps) => {
    const { databases } = await createAdminClient();

    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) throw new Error("Usuário não encontrado.");

        const queries = createQueries(currentUser, types, searchText, sort, limit);

        const files = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            queries
        );

        return parseStringify(files);

    } catch (error) {
        handleError(error, "Falha ao buscar os arquivos.");
    }
}

export const renameFile = async({ fileId, name, extension, path }: RenameFileProps) => {
    const { databases } = await createAdminClient();

    try {
        const newName = `${name}.${extension}`;
        const updatedFile = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            fileId,
            {
                name: newName
            }
        );

        revalidatePath(path);

        return parseStringify(updatedFile);

    } catch (error) {
        handleError(error, "Falha ao renomear o arquivo.");
    }
}

export const removeFileUser = async({ fileId, currentUserEmail, path }: RemoveFileUserProps) => {
    const { databases } = await createAdminClient();

    try {
        const file = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            fileId
        );

        if (!file.users || !Array.isArray(file.users)) {
            throw new Error("O arquivo não possui usuários compartilhados.");
        }

        const updatedUsers = file.users.filter(email => email !== currentUserEmail);

        const updatedFile = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            fileId,
            {
                users: updatedUsers
            }
        );

        revalidatePath(path);

        return parseStringify(updatedFile);

    } catch (error) {
        handleError(error, "Falha ao remover o usuário do arquivo.");
    }
}

export const updateFileUsers = async({ fileId, emails, path }: UpdateFileUsersProps) => {
    const { databases } = await createAdminClient();

    try {
        const updatedFile = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            fileId,
            {
                users: emails
            }
        );

        revalidatePath(path);

        return parseStringify(updatedFile);

    } catch (error) {
        handleError(error, "Falha ao atualizar os usuários do arquivo.");
    }
}

export const deleteFile = async({ fileId, bucketFileId, path }: DeleteFileProps) => {
    const { databases, storage } = await createAdminClient();

    try {
        const deletedFile = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            fileId
        );

        if (deletedFile) {
            await storage.deleteFile(
                appwriteConfig.bucketId,
                bucketFileId
            );
        }

        revalidatePath(path);

        return parseStringify({status: "success"});

    } catch (error) {
        handleError(error, "Falha ao deletar o arquivo.");
    }
}