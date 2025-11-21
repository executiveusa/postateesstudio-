import React, { useCallback, useRef } from 'react';
import { Icons } from './Icons';
import { Tooltip } from './Tooltip';

interface ImageUploaderProps {
    uploadedImage: string | null;
    setUploadedImage: (image: string | null) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ uploadedImage, setUploadedImage }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setUploadedImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const file = event.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setUploadedImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    }, [setUploadedImage]);

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveImage = () => {
        setUploadedImage(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="w-full">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
            />
            {uploadedImage ? (
                <div className="relative group">
                    <img src={uploadedImage} alt="Uploaded preview" className="w-full h-auto object-contain rounded-lg border border-surface-border" />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Tooltip content="Remove image">
                            <button 
                                onClick={handleRemoveImage}
                                className="p-1.5 bg-black/50 rounded-full text-white"
                            >
                                <Icons.close className="w-4 h-4" />
                            </button>
                        </Tooltip>
                    </div>
                </div>
            ) : (
                <div
                    onClick={handleClick}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="w-full aspect-square border-2 border-dashed border-surface-border rounded-lg flex flex-col items-center justify-center text-center cursor-pointer hover:border-brand-primary transition-colors p-4"
                >
                    <Icons.upload className="w-10 h-10 text-text-muted mb-2" />
                    <p className="text-sm font-semibold">Upload an image</p>
                    <p className="text-xs text-text-muted">or drag and drop</p>
                </div>
            )}
        </div>
    );
};
