
import React from 'react';
import { Icons } from './Icons';
import { Tooltip } from './Tooltip';

interface HeaderProps {
    onOpenVault: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenVault }) => {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-surface-border bg-black/80 backdrop-blur-lg">
            <div className="container mx-auto flex h-20 items-center justify-between px-4">
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="relative">
                        <div className="absolute -inset-1 bg-brand-primary/50 rounded-full blur opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                        <img 
                            src="https://www.postatees.com/cdn/shop/files/1000615349_130x@2x.jpg?v=1757349783" 
                            alt="PostaTees Logo" 
                            className="h-12 w-auto relative z-10 rounded-full border border-white/10"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-display text-xl font-bold leading-none text-white">POSTA<span className="text-brand-primary">TEES</span></span>
                        <span className="text-[10px] font-mono text-text-muted tracking-[0.2em] uppercase">Studio v3.0</span>
                    </div>
                </div>
                
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
                    <a href="#" className="text-white border-b-2 border-brand-primary pb-1">Create</a>
                    <button onClick={onOpenVault} className="text-text-muted hover:text-white transition-colors flex items-center gap-2">
                        <Icons.folder className="w-4 h-4" /> Drafts
                    </button>
                    <a href="#" className="text-text-muted hover:text-white transition-colors">Trends</a>
                    <a href="#" className="text-text-muted hover:text-white transition-colors">Market</a>
                </nav>

                <div className="flex items-center gap-4">
                    <Tooltip content="Settings">
                        <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                            <Icons.settings className="h-5 w-5 text-text-muted" />
                        </button>
                    </Tooltip>
                    <button className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-primary to-yellow-600 flex items-center justify-center text-black font-bold text-sm shadow-lg shadow-brand-primary/20 hover:scale-105 transition-transform">
                        PT
                    </button>
                </div>
            </div>
        </header>
    );
};
