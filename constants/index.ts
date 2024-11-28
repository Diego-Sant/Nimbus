export const navItems = [
  { 
      name: "Painel de controle",
      icon: "/icons/dashboard.svg",
      url: "/"
  },
  { 
      name: "Documentos",
      icon: "/icons/documents.svg",
      url: "/documentos"
  },
  { 
      name: "Arquivos",
      icon: "/icons/archives.svg",
      url: "/arquivos"
  },
  { 
      name: "Imagens",
      icon: "/icons/images.svg",
      url: "/imagens"
  },
  { 
      name: "Mídia",
      icon: "/icons/media.svg",
      url: "/midia"
  },
  { 
      name: "Outros",
      icon: "/icons/others.svg",
      url: "/outros"
  },
];

export const actionsDropdownItems = [
  {
    label: "Renomear",
    icon: "/icons/edit.svg",
    value: "rename",
  },
  {
    label: "Detalhes",
    icon: "/icons/info.svg",
    value: "details",
  },
  {
    label: "Compartilhar",
    icon: "/icons/share.svg",
    value: "share",
  },
  {
    label: "Remover",
    icon: "/icons/removeShare.svg",
    value: "remove",
  },
  {
    label: "Baixar",
    icon: "/icons/download.svg",
    value: "download",
  },
  {
    label: "Excluir",
    icon: "/icons/delete.svg",
    value: "delete",
  },
];

export const sortTypes = [
  {
    label: "Data de criação (mais recente)",
    value: "$createdAt-desc",
  },
  {
    label: "Data de criação (mais antiga)",
    value: "$createdAt-asc",
  },
  {
    label: "Nome (A-Z)",
    value: "name-asc",
  },
  {
    label: "Nome (Z-A)",
    value: "name-desc",
  },
  {
    label: "Tamanho (Maior)",
    value: "size-desc",
  },
  {
    label: "Tamanho (Menor)",
    value: "size-asc",
  },
];

export const avatarPlaceholderUrl = "https://img.freepik.com/premium-vector/man-empty-avatar-casual-business-style-vector-photo-placeholder-social-networks-resumes_885953-434.jpg"

export const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024;