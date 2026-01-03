import React, { useState, useEffect } from 'react';
import {
    Sparkles, Send, Gift, RefreshCw, Beer, Heart, Plane,
    Utensils, Coins, Moon, Clock, Lightbulb, ShieldCheck,
    Activity, Smile
} from 'lucide-react';

const App = () => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [fortune, setFortune] = useState(null);
    const [particles, setParticles] = useState([]);

    // 擴充後的 12 個年度好運關鍵字
    const fortunes = [
        { title: "荷包爆滿", icon: <Coins className="text-yellow-400" />, desc: "2026 財神爺住你家，買什麼都中獎，隨便花都花不完！" },
        { title: "吃喝不胖", icon: <Utensils className="text-orange-400" />, desc: "火鍋宵夜隨便點，體重計永遠對你溫柔。這就是魔法！" },
        { title: "脫單/恩愛", icon: <Heart className="text-pink-500" />, desc: "單身者紅鸞星動，有對象者甜度破表。天天都是情人節！" },
        { title: "機票入手", icon: <Plane className="text-blue-400" />, desc: "說走就走的旅行即將發生！護照準備好，世界在等你。" },
        { title: "歐氣爆棚", icon: <Sparkles className="text-purple-400" />, desc: "2026 你就是天選之子！抽卡抽到手軟，路邊都能撿到好康。" },
        { title: "準時下班", icon: <Clock className="text-emerald-400" />, desc: "事情做完、準時閃人。你的 2026 充滿了自由的空氣！" },
        { title: "一夜好眠", icon: <Moon className="text-indigo-400" />, desc: "頭一靠枕頭就睡著，每天睡飽飽，黑眼圈徹底遠離你。" },
        { title: "靈感噴發", icon: <Lightbulb className="text-amber-400" />, desc: "腦袋像開了光，隨便一個點子都能驚豔全場，你是最聰明的！" },
        { title: "小人退散", icon: <ShieldCheck className="text-cyan-400" />, desc: "自帶保護罩，所有不順心、壞運氣通通彈開，貴人運爆發。" },
        { title: "健康滿分", icon: <Activity className="text-red-400" />, desc: "體力像電池一樣充沛，吃得好睡得香，渾身充滿正能量！" },
        { title: "萬事如意", icon: <Smile className="text-yellow-500" />, desc: "想什麼來什麼，事情發展總比預期的還順利，笑容停不下來。" },
        { title: "顏值巔峰", icon: <Sparkles className="text-rose-400" />, desc: "素顏也好看，隨便穿都時尚。2026 年你就是這條街最正/帥的！" }
    ];

    // 簡單的音效合成器 (不需外部檔案)
    const playSound = (type) => {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;

        if (type === 'magic') {
            // 抽籤音效：閃亮的琶音
            osc.type = 'sine';
            osc.frequency.setValueAtTime(500, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
            osc.start(now);
            osc.stop(now + 0.5);

            // 疊加第二層聲音
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.type = 'triangle';
            osc2.frequency.setValueAtTime(800, now);
            osc2.frequency.linearRampToValueAtTime(1500, now + 0.2);
            gain2.gain.setValueAtTime(0.2, now);
            gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
            osc2.start(now);
            osc2.stop(now + 0.4);

        } else if (type === 'pop') {
            // 點擊音效
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);

        } else if (type === 'success') {
            // 成功/分享音效
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.setValueAtTime(800, now + 0.1);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        }
    };

    const drawFortune = () => {
        playSound('magic');
        const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
        setFortune(randomFortune);
        setIsFlipped(true);
        createParticles();
    };

    const createParticles = () => {
        const newParticles = Array.from({ length: 25 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            size: Math.random() * 10 + 5 + 'px',
            delay: Math.random() * 2 + 's'
        }));
        setParticles(newParticles);
    };

    return (
        <div className="min-h-screen bg-[#fff5f5] flex items-center justify-center p-4 font-sans text-slate-800 overflow-hidden relative">
            {/* 溫暖的背景裝飾 */}
            <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] bg-pink-200/40 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] bg-orange-100/50 blur-[100px] rounded-full"></div>

            <div className="max-w-md w-full relative z-10">
                <div className={`relative transition-all duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`} style={{ perspective: '1200px' }}>

                    {/* 正面 */}
                    <div className={`bg-white/80 backdrop-blur-xl border-4 border-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(255,182,193,0.3)] backface-hidden ${isFlipped ? 'invisible' : 'visible'}`}>
                        <div className="flex justify-center mb-6">
                            <div className="bg-pink-100 p-4 rounded-full">
                                <Beer className="text-pink-500 w-10 h-10 animate-bounce" />
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-pink-500 font-bold tracking-[0.2em] mb-2 uppercase text-sm">Welcome 2026</p>
                            <h1 className="text-6xl font-black mb-6 italic text-transparent bg-clip-text bg-gradient-to-br from-pink-500 to-orange-400">
                                2026
                            </h1>
                            <h2 className="text-2xl font-bold mb-4 text-slate-700 leading-tight">
                                新的一年，<br />也要一起開開心心！
                            </h2>

                            <p className="text-slate-500 mb-8 leading-relaxed font-medium">
                                辛苦了！這一年我們都要更好。<br />點擊下方按鈕，測測你的年度運勢 ✨
                            </p>

                            <button
                                onClick={drawFortune}
                                className="w-full bg-gradient-to-r from-pink-500 to-orange-400 hover:scale-105 active:scale-95 text-white font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 group text-lg"
                            >
                                <Gift size={24} className="group-hover:rotate-12 transition-transform" />
                                開啟我的 2026 好運氣
                            </button>
                        </div>
                    </div>

                    {/* 背面 */}
                    <div className={`absolute inset-0 bg-white border-4 border-pink-100 rounded-[2.5rem] p-10 shadow-2xl backface-hidden flex flex-col items-center justify-center text-center transition-all duration-700 ${isFlipped ? 'visible rotate-y-180' : 'invisible'}`}>
                        {fortune && (
                            <>
                                <div className="mb-6 relative">
                                    <div className="w-24 h-24 bg-gradient-to-br from-pink-50 to-orange-50 rounded-3xl flex items-center justify-center border-2 border-pink-100 shadow-inner">
                                        {React.cloneElement(fortune.icon, { size: 50 })}
                                    </div>
                                    <div className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-sm">LUCKY</div>
                                </div>

                                <p className="text-pink-400 font-bold mb-1 uppercase tracking-widest text-sm">2026 你將會...</p>
                                <h3 className="text-4xl font-black text-slate-800 mb-4">{fortune.title}</h3>
                                <div className="w-16 h-1.5 bg-gradient-to-r from-pink-300 to-orange-300 rounded-full mb-6"></div>
                                <p className="text-slate-600 text-lg mb-8 leading-relaxed font-medium px-2">
                                    「{fortune.desc}」
                                </p>

                                <div className="flex gap-4 w-full">
                                    <button
                                        onClick={() => {
                                            playSound('pop');
                                            setIsFlipped(false);
                                        }}
                                        className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-400 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 font-bold"
                                    >
                                        <RefreshCw size={18} /> 重抽
                                    </button>
                                    <button
                                        className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 font-bold"
                                        onClick={() => {
                                            playSound('success');
                                            const btn = document.activeElement;
                                            const originalText = btn.innerHTML;
                                            btn.innerHTML = '已截圖分享 ✨';
                                            setTimeout(() => btn.innerHTML = originalText, 2000);
                                        }}
                                    >
                                        <Send size={18} /> 分享
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* 底部 */}
                <div className="mt-8 text-center px-4">
                    <p className="text-pink-300 font-medium text-sm">建誠聯合會計師事務所 祝你新年快樂 ✨</p>
                    <p className="text-slate-300 text-[10px] mt-2 leading-tight uppercase tracking-widest">
                        May your 2026 be as wonderful as you are.
                    </p>
                </div>
            </div>

            {/* 裝飾碎片 */}
            {particles.map(p => (
                <div
                    key={p.id}
                    className="absolute bg-pink-400/20 rounded-full pointer-events-none animate-pulse"
                    style={{
                        left: p.left,
                        top: p.top,
                        width: p.size,
                        height: p.size,
                        animationDelay: p.delay
                    }}
                />
            ))}

            <style dangerouslySetInnerHTML={{
                __html: `
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}} />
        </div>
    );
};

export default App;
