
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { GenerationPanel } from './components/GenerationPanel';
import { ApiKeySelector } from './components/ApiKeySelector';
import { LandingPage } from './components/LandingPage';
import { ProjectVault } from './components/ProjectVault';
import type { ImageVariant, AspectRatio, VideoGenerationState, SavedProject } from './types';
import { generateTeeDesigns, generateVideoFromImage } from './services/geminiService';

declare global {
    interface AIStudio {
        hasSelectedApiKey: () => Promise<boolean>;
        openSelectKey: () => Promise<void>;
    }
    interface Window {
        aistudio?: AIStudio;
    }
}

export default function App() {
    const [hasEntered, setHasEntered] = useState(false);
    const [prompt, setPrompt] = useState<string>('');
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [imageVariants, setImageVariants] = useState<ImageVariant[]>([]);
    const [selectedVariant, setSelectedVariant] = useState<ImageVariant | null>(null);
    const [isLoadingImages, setIsLoadingImages] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [apiKeySelected, setApiKeySelected] = useState<boolean>(false);
    const [videoState, setVideoState] = useState<VideoGenerationState>({
        status: 'idle',
        url: null,
        progress: 0,
        error: null,
    });

    // Persistence State
    const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
    const [isVaultOpen, setIsVaultOpen] = useState(false);
    
    useEffect(() => {
        const checkApiKey = async () => {
            if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
                setApiKeySelected(true);
            }
        };
        checkApiKey();
        
        // Load projects from localStorage
        const loaded = localStorage.getItem('postatees_projects');
        if (loaded) {
            try {
                setSavedProjects(JSON.parse(loaded));
            } catch (e) {
                console.error("Failed to parse saved projects", e);
            }
        }
    }, []);

    const saveToLocalStorage = (projects: SavedProject[]) => {
        try {
            localStorage.setItem('postatees_projects', JSON.stringify(projects));
            setSavedProjects(projects);
        } catch (e) {
            setError("Vault Full. Delete old projects to save new ones.");
        }
    };

    const handleSaveProject = () => {
        if (!prompt) return;
        
        const name = window.prompt("Name this drop:", prompt.substring(0, 20) + "...");
        if (!name) return;

        const newProject: SavedProject = {
            id: Date.now().toString(),
            name,
            timestamp: Date.now(),
            prompt,
            uploadedImage,
            imageVariants,
            selectedVariantId: selectedVariant?.id || null
        };

        const updated = [newProject, ...savedProjects];
        saveToLocalStorage(updated);
    };

    const handleLoadProject = (project: SavedProject) => {
        setPrompt(project.prompt);
        setUploadedImage(project.uploadedImage);
        setImageVariants(project.imageVariants);
        const variant = project.imageVariants.find(v => v.id === project.selectedVariantId) || null;
        setSelectedVariant(variant);
        setVideoState({ status: 'idle', url: null, progress: 0, error: null });
        setError(null);
    };

    const handleDeleteProject = (id: string) => {
        if(window.confirm("Are you sure you want to trash this project?")) {
            const updated = savedProjects.filter(p => p.id !== id);
            saveToLocalStorage(updated);
        }
    };

    const handleImageGeneration = useCallback(async () => {
        if (!prompt && !uploadedImage) {
            setError('Give me a play to run. Enter a prompt or upload a reference.');
            return;
        }
        setIsLoadingImages(true);
        setError(null);
        setImageVariants([]);
        setSelectedVariant(null);
        setVideoState({ status: 'idle', url: null, progress: 0, error: null });

        try {
            const base64ImageData = uploadedImage ? uploadedImage.split(',')[1] : null;
            const mimeType = uploadedImage ? uploadedImage.split(';')[0].split(':')[1] : null;

            const designs = await generateTeeDesigns(prompt, base64ImageData, mimeType);
            setImageVariants(designs.map((base64, index) => ({ id: `variant-${index}-${Date.now()}`, base64 })));
        } catch (e) {
            console.error(e);
            setError('Foul on the play. Failed to generate designs. Try again.');
        } finally {
            setIsLoadingImages(false);
        }
    }, [prompt, uploadedImage]);

    const handleVideoGeneration = useCallback(async (aspectRatio: AspectRatio, videoPrompt: string) => {
        if (!selectedVariant) {
            setVideoState({ status: 'error', url: null, progress: 0, error: 'Select a design first to animate.' });
            return;
        }
        
        if (!apiKeySelected) {
            try {
                await window.aistudio?.openSelectKey();
                setApiKeySelected(true);
            } catch (e) {
                 setVideoState({ status: 'error', url: null, progress: 0, error: 'API Key required for the highlights reel.' });
                 return;
            }
        }
        
        setVideoState({ status: 'generating', url: null, progress: 0, error: null });

        try {
            const base64ImageData = selectedVariant.base64;
            await generateVideoFromImage(
                base64ImageData,
                videoPrompt,
                aspectRatio,
                (progress) => setVideoState(prev => ({ ...prev, progress })),
                (url) => setVideoState({ status: 'success', url, progress: 100, error: null }),
                (e) => {
                    const errorMessage = e instanceof Error ? e.message : 'Unknown error.';
                    if (errorMessage.includes("Requested entity was not found.")) {
                        setApiKeySelected(false);
                        setVideoState({ status: 'error', url: null, progress: 0, error: 'Invalid Key. Please re-select.' });
                    } else {
                        setVideoState({ status: 'error', url: null, progress: 0, error: `Animation failed: ${errorMessage}` });
                    }
                }
            );
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Unknown error.';
            setVideoState({ status: 'error', url: null, progress: 0, error: `Animation failed: ${errorMessage}` });
        }
    }, [selectedVariant, apiKeySelected]);

    const handleSelectVariant = (variant: ImageVariant) => {
        setSelectedVariant(variant);
        if (selectedVariant?.id !== variant.id) {
            setVideoState({ status: 'idle', url: null, progress: 0, error: null });
        }
    };

    if (!hasEntered) {
        return <LandingPage onEnter={() => setHasEntered(true)} />;
    }

    return (
        <div className="min-h-screen bg-brand-bg relative overflow-x-hidden">
            {/* Nano Banana Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-brand-primary/10 blur-[150px] animate-pulse-slow" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-accent/10 blur-[150px] animate-pulse-slow" style={{animationDelay: '2s'}} />
                <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] rounded-full bg-yellow-600/5 blur-[100px]" />
                
                {/* Noise Texture Overlay */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150"></div>
            </div>

            <Header onOpenVault={() => setIsVaultOpen(true)} />
            
            <main className="container mx-auto px-4 py-8 relative z-10">
                {!apiKeySelected && (
                    <div className="mb-8 animate-[fadeIn_0.5s_ease-out]">
                        <ApiKeySelector onKeySelected={() => setApiKeySelected(true)} />
                    </div>
                )}

                <div className="w-full max-w-7xl mx-auto">
                    <GenerationPanel
                        prompt={prompt}
                        setPrompt={setPrompt}
                        onGenerateImages={handleImageGeneration}
                        isLoadingImages={isLoadingImages}
                        imageVariants={imageVariants}
                        onSelectVariant={handleSelectVariant}
                        selectedVariant={selectedVariant}
                        onGenerateVideo={handleVideoGeneration}
                        videoState={videoState}
                        setUploadedImage={setUploadedImage}
                        uploadedImage={uploadedImage}
                        error={error}
                        onSaveProject={handleSaveProject}
                    />
                </div>
            </main>

            <ProjectVault 
                isOpen={isVaultOpen}
                onClose={() => setIsVaultOpen(false)}
                projects={savedProjects}
                onLoad={handleLoadProject}
                onDelete={handleDeleteProject}
            />
        </div>
    );
}
