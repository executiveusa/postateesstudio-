
import React from 'react';
import { Icons } from './Icons';

interface LandingPageProps {
    onEnter: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
    return (
        <div className="fixed inset-0 z-50 bg-brand-bg flex items-center justify-center overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-primary/20 via-brand-bg to-brand-bg opacity-60" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] brightness-200" />
                
                {/* Basketball Court Lines Effect */}
                <div className="absolute bottom-0 left-0 w-full h-[40vh] bg-gradient-to-t from-brand-primary/5 to-transparent" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] border-2 border-brand-primary/10 rounded-t-full" />
            </div>

            <div className="relative z-10 text-center px-6 max-w-4xl mx-auto space-y-8">
                
                <div className="space-y-2 pt-12">
                    <h1 className="font-display text-6xl md:text-9xl font-bold tracking-tighter text-white leading-[0.9] uppercase">
                        Posta<span className="text-brand-primary">Tees</span><br/>Studio
                    </h1>
                    <p className="font-sans text-xl md:text-2xl text-text-muted max-w-2xl mx-auto font-light tracking-wide">
                        The AI Atelier for <span className="text-white font-medium">Next-Gen Streetwear</span>.
                    </p>
                </div>

                <div className="flex flex-col items-center gap-6 pt-8">
                    <button 
                        onClick={onEnter}
                        className="group relative px-12 py-5 bg-brand-primary text-black font-display font-bold text-2xl tracking-wide uppercase rounded-none hover:bg-white transition-all duration-300 shadow-[0_0_40px_rgba(242,190,34,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)]"
                    >
                        <span className="relative z-10 flex items-center gap-3">
                           Enter The Paint <Icons.arrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </span>
                        {/* Slanted cut effect */}
                        <div className="absolute -inset-1 bg-white/20 skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                    
                    <p className="text-xs text-text-muted uppercase tracking-widest opacity-60">
                        Designed for Creators
                    </p>
                </div>
            </div>

            {/* Footer Elements */}
            <div className="absolute bottom-8 left-8 text-white/20 text-xs font-mono hidden md:block">
                LAT: 34.0522 N <br/> LON: 118.2437 W
            </div>
            <div className="absolute bottom-8 right-8 flex gap-4 text-white/20">
                 <Icons.basketball className="w-6 h-6 animate-bounce" style={{ animationDuration: '3s' }} />
            </div>
        </div>
    );
};
