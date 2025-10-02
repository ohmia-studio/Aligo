export interface New {
    created_at: Date; // Timestamp
    titulo: string;
    tag?: string | null;
    descripcion: any; // JSON TipTap
    bucket_folder_url: string;
};

export interface TagItem {
    nombre: string;
    descripcion?: string;
}