
import React, { useState } from 'react';
import { Icons } from './Icons';

interface ApiKeySelectorProps {
    onKeySelected: () => void;
}

export const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySelected }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSelectKey = async () => {
        if (!window.aistudio) {
            alert("API selection interface is not available.");
            return;
        }
        setIsLoading(true);
        try {
            await window.aistudio.openSelectKey();
            onKeySelected();
        } catch (e) {
            console.error("Failed to open API key selector:", e);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="max-w-2xl mx-auto mb-8 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg text-center">
            <div className="flex items-center justify-center gap-3">
                <Icons.key className="w-6 h-6 text-blue-400" />
                <h3 className="font-display text-lg text-blue-300">Veo Video Generation Requires an API Key</h3>
            </div>
            <p className="text-sm text-blue-400/80 mt-2 mb-4">
                To generate videos, you need to select a Google AI API key. This will be used for billing purposes. 
                <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-300"> Learn more about billing.</a>
            </p>
            <button
                onClick={handleSelectKey}
                disabled={isLoading}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:bg-blue-800 disabled:cursor-wait"
            >
                {isLoading ? 'Opening...' : 'Select API Key'}
            </button>
        </div>
    );
};
