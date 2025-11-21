import React, { useState } from 'react';
import type { ImageVariant, VideoGenerationState, AspectRatio } from '../types';
import { Icons } from './Icons';
import { Tooltip } from './Tooltip';

interface VideoGeneratorProps {
    selectedVariant: ImageVariant;
    videoState: VideoGenerationState;
    onGenerate: (aspectRatio: AspectRatio, videoPrompt: string) => void;
}

export const VideoGenerator: React.FC<VideoGeneratorProps> = ({ selectedVariant, videoState, onGenerate }) => {
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
    const [videoPrompt, setVideoPrompt] = useState<string>('Animate this image with subtle motion.');

    const isLoading = videoState.status === 'generating';

    const ratios: { val: AspectRatio, label: string, desc: string }[] = [
        { val: '9:16', label: '9:16', desc: 'Portrait (Stories/TikTok)' },
        { val: '16:9', label: '16:9', desc: 'Landscape (YouTube)' },
        { val: '1:1', label: '1:1', desc: 'Square (Feed)' },
        { val: '4:3', label: '4:3', desc: 'Classic TV' },
    ];

    return (
        <div className="bg-brand-bg/30 p-4 rounded-lg">
            <h3 className="font-display text-xl mb-4">Animate Your Design</h3>
            
            <div className="relative mb-4">
                {videoState.status === 'success' && videoState.url ? (
                    <video src={videoState.url} controls autoPlay loop className="w-full rounded-md aspect-video"></video>
                ) : (
                    <>
                        <img 
                            src={`data:image/png;base64,${selectedVariant.base64}`} 
                            alt="Selected variant" 
                            className="w-full rounded-md"
                        />
                        {isLoading && (
                             <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-4">
                                <div className="w-full bg-surface-border rounded-full h-2.5 mb-4">
                                    <div className="bg-brand-primary h-2.5 rounded-full" style={{ width: `${videoState.progress}%` }}></div>
                                </div>
                                <p className="text-sm text-center">Animating... this can take a few minutes.</p>
                                <p className="text-xs text-text-muted text-center">Please stay on this page.</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {videoState.status !== 'generating' && (
                <>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-text-muted">Animation Prompt</label>
                         <input
                            type="text"
                            value={videoPrompt}
                            onChange={(e) => setVideoPrompt(e.target.value)}
                            className="w-full p-2 bg-brand-bg/50 border border-surface-border rounded-md focus:ring-1 focus:ring-brand-primary"
                            placeholder="e.g., zooms in slowly"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-text-muted">Aspect Ratio</label>
                        <div className="grid grid-cols-4 gap-2">
                            {ratios.map((r) => (
                                <Tooltip key={r.val} content={r.desc}>
                                    <button 
                                        onClick={() => setAspectRatio(r.val)} 
                                        className={`px-2 py-2 rounded-md border text-xs font-bold transition-all ${aspectRatio === r.val ? 'bg-brand-primary text-brand-bg border-brand-primary shadow-[0_0_10px_rgba(242,190,34,0.3)]' : 'border-surface-border hover:bg-white/5'}`}
                                    >
                                        {r.label}
                                    </button>
                                </Tooltip>
                            ))}
                        </div>
                    </div>
                    <Tooltip content="Generates an animated video from the selected design (Requires Key)">
                        <button 
                            onClick={() => onGenerate(aspectRatio, videoPrompt)}
                            disabled={isLoading}
                            className="w-full bg-brand-accent text-white font-bold py-3 px-4 rounded-md hover:bg-teal-500 transition-colors flex items-center justify-center shadow-lg"
                        >
                            <Icons.video className="w-5 h-5 mr-2"/>
                            Generate Video
                        </button>
                    </Tooltip>
                </>
            )}

            {videoState.status === 'error' && (
                <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded text-red-200 text-xs flex gap-2 items-start">
                    <Icons.close className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{videoState.error}</span>
                </div>
            )}
        </div>
    );
};