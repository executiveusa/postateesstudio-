
import React from 'react';
import { Icons } from './Icons';
import type { SavedProject } from '../types';

interface ProjectVaultProps {
    isOpen: boolean;
    onClose: () => void;
    projects: SavedProject[];
    onLoad: (project: SavedProject) => void;
    onDelete: (id: string) => void;
}

export const ProjectVault: React.FC<ProjectVaultProps> = ({ isOpen, onClose, projects, onLoad, onDelete }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>

            <div className="relative w-full max-w-4xl bg-brand-bg border border-surface-border rounded-3xl shadow-2xl max-h-[80vh] flex flex-col overflow-hidden animate-[scaleIn_0.2s_ease-out]">
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/50">
                    <div className="flex items-center gap-3">
                        <Icons.folder className="w-6 h-6 text-brand-primary" />
                        <div>
                            <h2 className="font-display text-2xl font-bold text-white uppercase tracking-wide">Design Vault</h2>
                            <p className="text-xs text-text-muted font-mono">SAVED PROJECTS: {projects.length}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <Icons.close className="w-6 h-6 text-white" />
                    </button>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-6">
                    {projects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-text-muted opacity-50">
                            <Icons.folder className="w-16 h-16 mb-4" />
                            <p className="font-display uppercase tracking-widest">Vault is Empty</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project) => (
                                <div key={project.id} className="group relative bg-surface-glass border border-white/5 hover:border-brand-primary/50 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                                    {/* Thumbnail */}
                                    <div className="aspect-square w-full bg-black/50 relative">
                                        {project.imageVariants.length > 0 ? (
                                            <img src={`data:image/png;base64,${project.imageVariants[0].base64}`} className="w-full h-full object-cover" alt="Project Thumbnail" />
                                        ) : project.uploadedImage ? (
                                            <img src={project.uploadedImage} className="w-full h-full object-cover grayscale opacity-50" alt="Uploaded Reference" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Icons.image className="w-12 h-12 text-white/10" />
                                            </div>
                                        )}
                                        
                                        {/* Overlay Actions */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                            <button 
                                                onClick={() => { onLoad(project); onClose(); }}
                                                className="bg-brand-primary text-black font-bold py-2 px-4 rounded-full hover:scale-105 transition-transform flex items-center gap-2"
                                            >
                                                <Icons.upload className="w-4 h-4 rotate-90" /> Load
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); onDelete(project.id); }}
                                                className="bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white p-2 rounded-full transition-colors border border-red-500/30"
                                            >
                                                <Icons.trash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="p-4">
                                        <h3 className="font-bold text-white truncate">{project.name || "Untitled Project"}</h3>
                                        <p className="text-xs text-text-muted mt-1 line-clamp-2 h-8">{project.prompt || "No prompt"}</p>
                                        <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center">
                                            <span className="text-[10px] font-mono text-white/40">
                                                {new Date(project.timestamp).toLocaleDateString()}
                                            </span>
                                            <div className="flex gap-1">
                                                {project.imageVariants.length > 0 && (
                                                    <span className="text-[10px] bg-brand-primary/20 text-brand-primary px-2 py-0.5 rounded">
                                                        {project.imageVariants.length} VARS
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
