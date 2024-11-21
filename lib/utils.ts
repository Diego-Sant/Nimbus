import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const parseStringify = (value: unknown) => {
  return JSON.parse(JSON.stringify(value));
}

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export const convertFileSize = (sizeInBytes: number, digits?: number) => {
  if (sizeInBytes < 1024) {
    return sizeInBytes + " Bytes";
  } else if (sizeInBytes < 1024 * 1024) {
    const sizeInKB = sizeInBytes / 1024;
    return sizeInKB.toFixed(digits || 1) + " KB";
  } else if (sizeInBytes < 1024 * 1024 * 1024) {
    const sizeInMB = sizeInBytes / (1024 * 1024);
    return sizeInMB.toFixed(digits || 1) + " MB";
  } else {
    const sizeInGB = sizeInBytes / (1024 * 1024 * 1024);
    return sizeInGB.toFixed(digits || 1) + " GB";
  }
};

export const calculatePercentage = (sizeInBytes: number) => {
  const totalSizeInBytes = 2 * 1024 * 1024 * 1024;
  const percentage = (sizeInBytes / totalSizeInBytes) * 100;
  return Number(percentage.toFixed(2));
};


export const getFileType = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();

  if (!extension) return { type: "other", extension: "" };

  const archiveExtensions = [
    "7z", "zip", "rar", "tar", "gz", "bz2", "xz", "iso", "dmg", "pkg",
    "deb", "rpm", "msi", "exe", "apk", "ipa"
  ];

  const documentExtensions = [
    "pdf", "doc", "docx", "txt", "xls", "xlsx", "csv", "rtf", "ods", "ppt",
    "odp", "md", "html", "htm", "epub", "pages", "fig", "psd", "ai", "indd",
    "xd", "sketch", "afdesign", "afphoto", "odt", "tex", "wpd", "key", "numbers",
    "xml", "json", "yaml", "yml", "tsv"
  ];

  const imageExtensions = [
    "jpg", "jpeg", "png", "gif", "bmp", "svg", "webp", "tiff", "ico", "heic",
    "avif", "jif", "jfif", "jp2", "j2k", "jpx", "jpm"
  ];

  const videoExtensions = [
    "mp4", "avi", "mov", "mkv", "webm", "flv", "wmv", "mpeg", "3gp", "m4v",
    "ogv", "ogm", "asf", "amv"
  ];

  const audioExtensions = [
    "mp3", "wav", "ogg", "flac", "aac", "wma", "m4a", "aiff", "alac", "midi",
    "mid", "amr", "m4r"
  ];

  if (documentExtensions.includes(extension)) return { type: "document", extension };
  if (imageExtensions.includes(extension)) return { type: "image", extension };
  if (videoExtensions.includes(extension)) return { type: "video", extension };
  if (audioExtensions.includes(extension)) return { type: "audio", extension };
  if (archiveExtensions.includes(extension)) return { type: "archive", extension };

  return { type: "other", extension };
};

export const formatDateTime = (isoString: string | null | undefined) => {
  if (!isoString) return "—";

  const date = new Date(isoString);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const time = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

  const day = date.getDate();

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${time}, ${day} de ${month} de ${year}`;
};

export const getFileIcon = (
  extension: string | undefined,
  type: FileType | string,
) => {

  switch (extension) {
    case "pdf":
      return "/icons/file-pdf.svg";
    case "doc":
      return "/icons/file-doc.svg";
    case "docx":
      return "/icons/file-docx.svg";
    case "csv":
      return "/icons/file-csv.svg";
    case "txt":
      return "/icons/file-txt.svg";
    case "rar":
    case "zip":
      return "/icons/file-rar.svg"
    case "7z":
      return "/icons/file-7z.svg";
    case "xls":
    case "xlsx":
      return "/icons/file-document.svg";
    case "svg":
      return "/icons/file-image.svg";
    case "mkv":
    case "mov":
    case "avi":
    case "wmv":
    case "mp4":
    case "flv":
    case "webm":
    case "m4v":
    case "3gp":
    case "mpeg":
    case "ogv":
    case "ogm":
    case "asf":
    case "amv":
      return "/icons/file-video.svg";
    case "mp3":
    case "mpeg":
    case "wav":
    case "aac":
    case "flac":
    case "ogg":
    case "wma":
    case "m4a":
    case "aiff":
    case "alac":
    case "midi":
    case "mid":
    case "amr":
    case "m4r":
      return "/icons/file-audio.svg";

    default:
      switch (type) {
        case "image":
          return "/icons/file-image.svg";
        case "document":
          return "/icons/file-document.svg";
        case "video":
          return "/icons/file-video.svg";
        case "audio":
          return "/icons/file-audio.svg";
        case "archive":
          return "/icons/file-archive.svg"
        default:
          return "/icons/file-other.svg";
      }
  }
};

export const constructFileUrl = (bucketFileId: string) => {
  return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET}/files/${bucketFileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;
};

export const constructDownloadUrl = (bucketFileId: string) => {
  return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET}/files/${bucketFileId}/download?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;
};

export const getUsageSummary = (totalSpace: any) => {
  return [
    {
      title: "Documentos",
      size: totalSpace.document.size,
      latestDate: totalSpace.document.latestDate,
      icon: "/icons/file-document-light.svg",
      url: "/documentos",
    },
    {
      title: "Arquivos",
      size: totalSpace.archive.size,
      latestDate: totalSpace.archive.latestDate,
      icon: "/icons/file-archive-light.svg",
      url: "/arquivos",
    },
    {
      title: "Imagens",
      size: totalSpace.image.size,
      latestDate: totalSpace.image.latestDate,
      icon: "/icons/file-image-light.svg",
      url: "/imagens",
    },
    {
      title: "Mídia",
      size: totalSpace.video.size + totalSpace.audio.size,
      latestDate:
        totalSpace.video.latestDate > totalSpace.audio.latestDate
          ? totalSpace.video.latestDate
          : totalSpace.audio.latestDate,
      icon: "/icons/file-video-light.svg",
      url: "/midia",
    },
    {
      title: "Outros",
      size: totalSpace.other.size,
      latestDate: totalSpace.other.latestDate,
      icon: "/icons/file-other-light.svg",
      url: "/outros",
    },
  ];
};

export const getFileTypesParams = (type: string) => {
  switch (type) {
    case "document":
      return ["document"];
    case "image":
      return ["image"];
    case "archive":
      return ["archive"];
    case "media":
      return ["video", "audio"];
    case "other":
      return ["other"];
    default:
      return ["document"];
  }
};
