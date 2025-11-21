import React from 'react';
import type { ImageVariant } from '../types';
import { Icons } from './Icons';

interface ImageGridProps {
    variants: ImageVariant[];
    onSelect: (variant: ImageVariant) => void;
    selectedId?: string;
}

export const ImageGrid: React.FC<ImageGridProps> = ({ variants, onSelect, selectedId }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {variants.map((variant) => {
                const isSelected = selectedId === variant.id;
                return (
                    <div 
                        key={variant.id}
                        onClick={() => onSelect(variant)}
                        className={`
                            group relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all duration-500 ease-out
                            ${isSelected 
                                ? 'ring-4 ring-brand-primary ring-offset-2 ring-offset-brand-bg shadow-[0_0_30px_rgba(242,190,34,0.5)] scale-[1.02]' 
                                : 'hover:ring-2 hover:ring-brand-primary/50 hover:scale-[1.05] hover:shadow-[0_0_25px_rgba(242,190,34,0.4)]'
                            }
                        `}
                    >
                        <img 
                            src={`data:image/png;base64,${variant.base64}`} 
                            alt="Generated Design" 
                            className={`w-full h-full object-cover transition-transform duration-700 ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`}
                        />
                        
                        {/* Overlay */}
                        <div className={`absolute inset-0 bg-black/0 transition-colors duration-300 ${isSelected ? '' : 'group-hover:bg-brand-primary/10'}`} />
                        
                        {/* Selection Checkmark */}
                        {isSelected && (
                            <div className="absolute top-2 right-2 bg-brand-primary text-brand-bg rounded-full p-1 shadow-lg z-10 animate-[scaleIn_0.2s_ease-out]">
                                <Icons.check className="w-4 h-4" />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};