"use client";

import React, {useCallback, useState} from 'react'
import Image from 'next/image';

import {useDropzone} from 'react-dropzone'

import Thumbnail from '@/components/Thumbnail';
import { cn, convertFileToUrl, getFileType } from '@/lib/utils';
import { Button } from '@/components/ui/button';


interface Props {
  ownerId: string;
  accountId: string;
  className?: string;
}

const FileUploader = ({ className }: Props) => {
  const [files, setFiles] = useState<File[]>([])
  
  const onDrop = useCallback(async(acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);

  const handleRemoveFile = (e: React.MouseEvent<HTMLImageElement>, fileName: string) => {
    e.stopPropagation();
    setFiles((prev) => prev.filter((file) => file.name !== fileName));
  }

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps()} className='cursor-pointer'>
      <input {...getInputProps()} />

      <Button type='button' className={cn('uploader-button', className)}>
        <Image src="/icons/upload.svg" alt='Upar arquivos' width={24} height={24} />
        <p>Carregar Arquivo</p>
      </Button>

      {files.length > 0 && (
        <ul className='uploader-preview-list'>
          <h4 className='h4 text-light-100'>
            Carregando arquivos...
          </h4>

          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);

            return (
              <li key={`${file.name}-${index}`} className='uploader-preview-item'>
                <div className='flex items-center gap-3'>
                  <Thumbnail type={type} extension={extension} url={convertFileToUrl(file)} />

                  <div className='preview-item-name'>
                    {file.name}
                    <Image src="/icons/file-loader.gif" width={80}
                      height={26} alt='Carregando...' />
                  </div>
                </div>

                <Image src="/icons/remove.svg" width={24} height={24} alt="Remover arquivo" 
                onClick={(e) => handleRemoveFile(e, file.name)}/>
              </li>
            )
          })}

        </ul>
      )}


      {
        isDragActive ?
          <p></p> :
          <p></p>
      }
    </div>
  )
}

export default FileUploader
