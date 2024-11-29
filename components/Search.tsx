"use client";

import React, { useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Models } from 'node-appwrite';
import { useDebounce } from "use-debounce";

import { Input } from '@/components/ui/input'
import { getFiles } from '@/lib/actions/file.actions';
import Thumbnail from '@/components/Thumbnail';
import FormattedDateTime from '@/components/FormattedDateTime';

const Search = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<Models.Document[]>([]);
  const [open, setOpen] = useState(false);

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";

  const [debouncedQuery] = useDebounce(query, 200);
  const router = useRouter();
  const path = usePathname();

  const searchWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      if (debouncedQuery.length === 0) {
        setResult([]);
        setOpen(false);

        return router.push(path.replace(searchParams.toString(), ""));
      }
      
      const files = await getFiles({ types: [], searchText: debouncedQuery });

      setResult(files.documents);
      setOpen(true);
    }

    fetchFiles();
  }, [debouncedQuery]);

  useEffect(() => {
    if (!searchQuery) {
      setQuery("");
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickItem = (file: Models.Document) => {
    setOpen(false);
    setResult([]);

    const path = (type: string) => {
      switch (type) {
        case "video":
        case "audio":
          return "midia";
        case "document":
          return "documentos";
        case "image":
          return "imagens";
        case "archive":
          return "arquivos";
        case "other":
          return "outros";
        default:
          return "";
      }
    };
    
    router.push(`/${path(file.type)}?query=${query}`);
  }

  return (
    <div className="search" ref={searchWrapperRef}>
      <div className="search-input-wrapper">

        <Image src="/icons/search.svg" alt="Pesquisar" width={24} height={24} className="w-6" />
        <Input value={query} placeholder="Pesquisar o nome do arquivo..."
          className="search-input" 
          onChange={(e) => setQuery(e.target.value)} 
          onFocus={() => {
            if (query.trim().length > 0 && result.length > 0) {
              setOpen(true);
            }
          }}
        />

        {open && (
          <ul className="search-result">
            {result.length > 0 ? (
              result.map((file) => (
                <li key={file.$id}
                  onClick={() => handleClickItem(file)}
                  className="flex items-center justify-between gap-4">
                  
                  <div className="flex cursor-pointer items-center gap-4">
                    
                    <Thumbnail type={file.type} 
                      extension={file.extension} url={file.url}
                      className="size-9 min-w-9"  
                    />

                    <p className="subtitle-2 line-clamp-1 break-all 
                    text-light-100">
                      {file.name}
                    </p>

                  </div>

                  <FormattedDateTime date={file.$createdAt}
                    className="caption line-clamp-1 break-all 
                    text-light-200"
                  />

                </li>
              )
            )) : (
              <p className="empty-result">
                Não encontramos nenhum resultado para "{query}".
              </p>
            )}
          </ul>
        )}

      </div>
    </div>
  )
}

export default Search
