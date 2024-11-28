import { Models } from 'node-appwrite'
import React, { useState } from 'react'

import { convertFileSize, formatDateTime } from '@/lib/utils';
import Thumbnail from '@/components/Thumbnail'
import FormattedDateTime from '@/components/FormattedDateTime'

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ImageThumbnail = ({ file }: { file: Models.Document }) => (
    <div className="file-details-thumbnail">
        <Thumbnail type={file.type} extension={file.extension} 
            url={file.url} 
        />

        <div className="flex-col flex">
            <p className="subtitle-2 mb-1">
                {file.name}
            </p>
            <FormattedDateTime date={file.$createdAt}
                className="caption" 
            />
        </div>

    </div>
);

const DetailRow = ({ label, value }: { label: string, value: string }) => (
    <div className="flex">
        <p className="file-details-label text-left">
            {label}
        </p>
        <p className="file-details-value text-left">
            {value}
        </p>
    </div>
)

export const FileDetails = ({ file }: { file: Models.Document}) => {
  return (
    <>
        <ImageThumbnail file={file} />
        <div className="space-y-4 px-2 pt-2">
            <DetailRow label="Extensão:" value={file.extension} />
            <DetailRow label="Tamanho:" value={convertFileSize(file.size)} />
            <DetailRow label="Proprietário:" value={file.owner.username} />
            <DetailRow label="Atualizado em: " value={formatDateTime(file.$updatedAt)} />
        </div>
    </>
  )
}

export const RemoveUser = ({ file }: { file: Models.Document}) => {
    return (
      <>
        <p className="delete-confimation">
            Tem certeza que deseja remover seu email do arquivo compartilhado?
        </p>
        <ImageThumbnail file={file} />
      </>
    )
  }

export const ShareInput = ({ file, emails, onInputChange, onRemove }: ShareInputProps) => {
    const [currentInput, setCurrentInput] = useState("");

    const addEmail = () => {
        const email = currentInput.trim();

        if (email && !emails.includes(email)) {
            const newEmails = [...emails, email];
            onInputChange(newEmails);
            file.users.push(email);
        }

        setCurrentInput("");
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentInput(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "," || e.key === " " || e.key === "Enter") {
            e.preventDefault();
            addEmail();
        }
    };

    const handleRemove = (email: string) => {
        onRemove(email);

        const index = file.users.indexOf(email);
        if (index > -1) {
            file.users.splice(index, 1);
        };

        toast.success(`O email "${email}" foi removido com sucesso!`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
        });
    };

    return (
      <>
        <ImageThumbnail file={file} />

        <div className="share-wrapper">
            <p className="subtitle-2 pl-1 text-light-100">
                Compartilhar arquivo com outros usuários.
            </p>

            <input
                type="email"
                placeholder="Coloque o endereço de email."
                value={currentInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="share-input-field"
            />

            <div className="pt-4">
                <div className="flex justify-between">
                    <p className="subtitle-2 text-light-100">
                        Compartilhado com:
                    </p>
                    <p className="subtitle-2 text-light-200">
                        {file.users.length} usuários
                    </p>
                </div>

                {file.users.length > 0 ? (
                    <ul className="pt-2">
                        {file.users.map((email: any) => (
                            <li key={email} className="flex items-center justify-between gap-2">
                                <p className="subtitle-2">{email}</p>
                                <button
                                    onClick={() => handleRemove(email)}
                                    className="share-remove-user"
                                >
                                    <img
                                        src="/icons/remove.svg"
                                        alt="Remover"
                                        width={24}
                                        height={24}
                                        className="remove-icon"
                                    />
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className='pt-4 text-light-100'>Nenhum usuário compartilhado.</p>
                )}
            </div>

        </div>
      </>
    )
}
