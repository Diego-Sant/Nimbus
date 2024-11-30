import Card from '@/components/Card';
import Sort from '@/components/Sort';
import { getFiles, getTotalSpaceUsed } from '@/lib/actions/file.actions';
import { convertFileSize, getFileTypesParams, getUsageSummary } from '@/lib/utils';
import { Models } from 'node-appwrite';
import React from 'react'

const Page = async({ searchParams, params }: SearchParamProps) => {
    const type = ((await params)?.type as string) || "";
    const searchText = ((await searchParams)?.query) as string || "";
    const sort = ((await searchParams)?.sort) as string || "$createdAt-desc";

    const types = getFileTypesParams(type) as FileType[];
    const files = await getFiles({ types, searchText, sort });

    const totalSpaceUsed = files.documents.reduce(
        (total: any, file: Models.Document) => total + (file.size || 0),
        0
    );

    return (
        <div className="page-container">
            <section className="w-full">
                <h1 className="h1 capitalize">
                    {type}
                </h1>

                <div className="total-size-section">
                    <p className="body-1">
                        Espaço utilizado: <span className="h5">
                            {convertFileSize(totalSpaceUsed) || '0 MB'}
                        </span>
                    </p>

                    <div className="sort-container">
                        <p className="body-1 hidden sm:block text-light-100">
                            Ordenar por:
                        </p>
                        <Sort />
                    </div>
                </div>
            </section>

            {files.total > 0 ? (
                <section className="file-list">
                    {files.documents.map((file: Models.Document) => (
                        <Card key={file.$id} file={file} />
                    ))}
                </section>
            ): <p className="empty-list">Nenhum arquivo encontrado.</p>}
        </div>
    )
}

export default Page
