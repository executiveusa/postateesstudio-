
export interface ImageVariant {
  id: string;
  base64: string;
}

export type AspectRatio = "16:9" | "9:16" | "1:1" | "4:3";

export type VideoGenerationStatus = 'idle' | 'generating' | 'success' | 'error';

export interface VideoGenerationState {
    status: VideoGenerationStatus;
    url: string | null;
    progress: number;
    error: string | null;
}

export interface SavedProject {
    id: string;
    name: string;
    timestamp: number;
    prompt: string;
    uploadedImage: string | null;
    imageVariants: ImageVariant[];
    selectedVariantId: string | null;
}