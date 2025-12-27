export interface New {
    created_at: Date; // Timestamp
    titulo: string;
    tag?: string | null;
    descripcion: any; // JSON TipTap
    bucket_folder_url: string;
};

export interface NewEdit extends New {
    id: number;
}

export interface UpdateNewsInput extends New {
    antiguoTitulo: string;
    removedImageUrls: string[]; // URLs de imágenes eliminadas
}

export interface TagItem {
    nombre: string;
    descripcion?: string;
}

export interface NewsNotificationParams {
  titulo: string;
  tipo: 'creada' | 'actualizada';
};
