import { Models } from 'node-appwrite'
import React from 'react'

import Thumbnail from './Thumbnail'
import FormattedDateTime from './FormattedDateTime'
import { convertFileSize, formatDateTime } from '@/lib/utils';
import { Input } from './ui/input';
import { Button } from './ui/button';
import Image from 'next/image';

const ImageThumbnail = ({ file }: { file: Models.Document }) => (
    <div className='file-details-thumbnail'>
        <Thumbnail type={file.type} extension={file.extension} 
            url={file.url} 
        />

        <div className='flex-col flex'>
            <p className='subtitle-2 mb-1'>
                {file.name}
            </p>
            <FormattedDateTime date={file.$createdAt}
                className='caption' 
            />
        </div>

    </div>
);

const DetailRow = ({ label, value }: { label: string, value: string }) => (
    <div className='flex'>
        <p className='file-details-label text-left'>
            {label}
        </p>
        <p className='file-details-value text-left'>
            {value}
        </p>
    </div>
)

export const FileDetails = ({ file }: { file: Models.Document}) => {
  return (
    <>
        <ImageThumbnail file={file} />
        <div className='space-y-4 px-2 pt-2'>
            <DetailRow label='Extensão:' value={file.extension} />
            <DetailRow label='Tamanho:' value={convertFileSize(file.size)} />
            <DetailRow label='Proprietário:' value={file.owner.username} />
            <DetailRow label='Atualizado em: ' value={formatDateTime(file.$updatedAt)} />
        </div>
    </>
  )
}

export const ShareInput = ({ file, onInputChange, onRemove }: ShareInputProps) => {
    return (
      <>
        <ImageThumbnail file={file} />

        <div className='share-wrapper'>
            <p className='subtitle-2 pl-1 text-light-100'>
                Compartilhar arquivo com outros usuários.
            </p>

            <Input type='email' placeholder='Coloque o endereço de email.' 
                onChange={(e) => onInputChange(e.target.value.trim().split(','))} 
                className='share-input-field'
            />

            <div className='pt-4'>
                <div className='flex justify-between'>
                    <p className='subtitle-2 text-light-100'>
                        Compartilhado com:
                    </p>
                    <p className='subtitle-2 text-light-200'>
                        {file.users.length} usuários
                    </p>
                </div>

                <ul className='pt-2'>
                    {file.users.map((email: string) => (
                        <li key={email} className='flex items-center
                            justify-between gap-2'>
                                <p className='subtitle-2'>
                                    {email}
                                </p>
                                <Button onClick={() => onRemove(email)}
                                    className='share-remove-user'>
                                    <Image src="/icons/remove.svg" 
                                        alt='Remover' width={24}
                                        height={24} className='remove-icon'
                                    />
                                </Button>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
      </>
    )
  }
  
  export default ShareInput
