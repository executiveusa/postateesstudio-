import { GoogleGenAI, Modality } from "@google/genai";
import type { AspectRatio } from '../types';

// POSTATEES BRAND GUARDRAILS
// Analyzed from: postatees.com & Reference Images
// Style: Grand Theft Auto Box Art x Vintage Bootleg Rap Tee x Comic Panels
const STYLE_PRIMER = `
MANDATORY ART DIRECTION [STRICT ENFORCEMENT]:
You are the Lead Illustrator for PostaTees. You are forbidden from generating generic portraits.
You MUST generate images in the "PostaTees Signature Collage" style.

STRICT LAYOUT RULES (THE "GTA" GRID):
1. COMPOSITION: The image MUST be a MULTI-PANEL COLLAGE or SPLIT-GRID layout.
   - Do NOT generate a single character standing in the middle.
   - DIVIDE the canvas into 3-5 geometric boxes/panels (like Grand Theft Auto box art).
   - Panel A: Close-up emotion/face.
   - Panel B: Full body action shot.
   - Panel C: Scenery or secondary angle.
   
2. VISUAL STYLE:
   - TYPE: Vector Illustration (Screen Print Ready).
   - OUTLINES: Thick, heavy black ink outlines.
   - SHADING: HALFTONE DOTS (Ben-Day dots) are MANDATORY for shadows.
   - COLOR: Flat, cel-shaded blocking. No soft airbrushing. High contrast.

3. CONTENT:
   - If the user requests a player/person, you must create this specific "Comic Book Cover" layout featuring them.
   - Backgrounds must be abstract cityscapes or team colors, but always inside the panels.

4. RESTRICTIONS:
   - NO Photorealism.
   - NO 3D Renders.
   - NO Single-subject portraits without the collage grid.
   - NO Soft gradients.

Your goal is to create a design that looks like a 1990s Bootleg Rap Tee that used stolen comic book art.
`;

export const enhancePrompt = async (input: string): Promise<string> => {
    if (!input) return "";
    
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // We tell the text model to act as the Art Director translating a client request into a technical prompt
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are the Creative Director for PostaTees. Convert this user concept into a strict "GTA Box Art" layout prompt.
            
            User Concept: "${input}"
            
            Your Task: Rewrite this to ensure the output is a MULTI-PANEL COLLAGE.
            
            Structure the prompt like this:
            "A comic book style collage divided into panels. 
            Panel 1: Close up of [Subject]. 
            Panel 2: Action shot of [Subject]. 
            Panel 3: [Subject] in a different pose. 
            Style: Vector illustration, thick outlines, halftone shading, Grand Theft Auto loading screen style."
            
            Keep it under 50 words.
            `,
        });

        return response.text?.trim() || input;
    } catch (e) {
        console.error("Failed to enhance prompt", e);
        return input + " multi-panel collage, gta box art style, split grid layout, vector illustration, halftone shading"; 
    }
};

export const generateTeeDesigns = async (
    prompt: string,
    base64ImageData: string | null,
    mimeType: string | null
): Promise<string[]> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Combined model for image generation and editing
    const model = 'gemini-2.5-flash-image';
    
    // We wrap the user prompt in the visual manifesto
    const fullPrompt = `${STYLE_PRIMER}\n\nDESIGN REQUEST: ${prompt}\n\nREMEMBER: SPLIT THE IMAGE INTO PANELS/BOXES. DO NOT MAKE A SINGLE PORTRAIT.`;

    const parts: any[] = [{ text: fullPrompt }];

    if (base64ImageData && mimeType) {
        parts.unshift({
            inlineData: {
                data: base64ImageData,
                mimeType: mimeType,
            },
        });
    }

    // Generate 4 images
    const promises = Array(4).fill(0).map(() => 
        ai.models.generateContent({
            model: model,
            contents: { parts },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        })
    );

    const responses = await Promise.all(promises);
    const images: string[] = [];

    responses.forEach(response => {
        if (response.candidates && response.candidates[0].content.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    images.push(part.inlineData.data);
                }
            }
        }
    });

    if (images.length === 0) {
        throw new Error("The design engine failed to render. This usually means the prompt triggered a safety filter. Try a simpler prompt.");
    }

    return images;
};


export const generateVideoFromImage = async (
    base64ImageData: string,
    prompt: string,
    aspectRatio: AspectRatio,
    onProgress: (progress: number) => void,
    onSuccess: (url: string) => void,
    onError: (error: Error) => void
): Promise<void> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        // Using Veo fast for quick iterations
        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: `Cinematic motion: ${prompt}. Maintain the vector illustration style.`,
            image: {
                imageBytes: base64ImageData,
                mimeType: 'image/png',
            },
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: aspectRatio,
            }
        });

        const totalSteps = 10;
        let currentStep = 0;

        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000));
            operation = await ai.operations.getVideosOperation({ operation: operation });
            currentStep++;
            onProgress(Math.min(95, (currentStep / totalSteps) * 100));
        }
        
        onProgress(100);

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (downloadLink) {
            const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
            const blob = await response.blob();
            const videoUrl = URL.createObjectURL(blob);
            onSuccess(videoUrl);
        } else {
            throw new Error("Video generation completed but no download link was provided.");
        }
    } catch (e) {
        onError(e as Error);
    }
};