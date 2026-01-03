import React, { forwardRef } from 'react';
import { Sparkles, Beer } from 'lucide-react';

export const ShareCard = forwardRef(({ fortune, userName = "幸運兒" }, ref) => {
    if (!fortune) return null;

    return (
        <div
            ref={ref}
            className="fixed left-[-9999px] top-0 w-[400px] h-[711px] bg-gradient-to-br from-[#fff0f5] to-[#fff5e6] p-8 flex flex-col items-center text-center font-sans"
        // 9:16 aspect ratio roughly (1080x1920 scaled down)
        >
            {/* Border Decoration */}
            <div className="absolute inset-4 border-4 border-pink-200 rounded-[2rem] pointer-events-none"></div>

            {/* Header */}
            <div className="mt-8 mb-4">
                <div className="bg-pink-100 p-3 rounded-full inline-block mb-2">
                    <Beer className="text-pink-500 w-8 h-8" />
                </div>
                <p className="text-pink-500 font-bold tracking-widest text-xs uppercase">WELCOME 2026</p>
                <h1 className="text-4xl font-black italic text-transparent bg-clip-text bg-gradient-to-br from-pink-500 to-orange-400">
                    2026 好運籤
                </h1>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center w-full relative z-10">
                <div className="mb-4">
                    <div className="w-32 h-32 bg-white rounded-3xl flex items-center justify-center border-4 border-pink-50 shadow-sm mx-auto">
                        {/* Render Icon Clone size 60 */}
                        {React.cloneElement(fortune.icon, { size: 60 })}
                    </div>
                </div>

                <div className="bg-white/80 p-6 rounded-2xl shadow-sm w-full mb-4 mx-4 backdrop-blur-sm">
                    <p className="text-slate-400 text-sm mb-1">To: {userName}</p>
                    <p className="text-pink-500 font-bold mb-2 uppercase tracking-widest text-xs">YOUR FORTUNE</p>
                    <h2 className="text-3xl font-black text-slate-800 mb-3">{fortune.title}</h2>
                    <div className="w-12 h-1 bg-gradient-to-r from-pink-300 to-orange-300 rounded-full mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium leading-relaxed text-sm px-2">
                        {fortune.desc}
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-auto mb-8 relative z-10">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="text-yellow-400 w-4 h-4" />
                    <p className="text-slate-800 font-bold text-sm">建誠聯合會計師事務所</p>
                    <Sparkles className="text-yellow-400 w-4 h-4" />
                </div>
                <p className="text-slate-400 text-[10px] uppercase tracking-wider">
                    May your 2026 be wonderful
                </p>
                <p className="text-slate-300 text-[8px] mt-1">
                    www.chienchen.net.tw
                </p>
            </div>

            {/* Background Orbs */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-pink-200/20 rounded-full blur-2xl"></div>
        </div>
    );
});
