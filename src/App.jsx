import React, { useState, useRef } from 'react';
import {
    Sparkles, Send, Gift, RefreshCw, Beer, Heart, Plane,
    Utensils, Coins, Moon, Clock, Lightbulb, ShieldCheck,
    Activity, Smile
} from 'lucide-react';
import { Experience } from './components/Experience';
import { ShareCard } from './components/ShareCard';
import html2canvas from 'html2canvas';

const App = () => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [fortune, setFortune] = useState(null);
    const [particles, setParticles] = useState([]);

    // AI Loading State
    const [isLoading, setIsLoading] = useState(false);

    // E-Card Reference and State
    const cardRef = useRef(null);
    const [userName, setUserName] = useState('');

    // 擴充後的 20 個年度好運關鍵字
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
        { title: "顏值巔峰", icon: <Sparkles className="text-rose-400" />, desc: "素顏也好看，隨便穿都時尚。2026 年你就是這條街最正/帥的！" },
        // 新增的吉祥籤 (會計師事務所風格)
        { title: "帳帳平衡", icon: <Coins className="text-green-400" />, desc: "借貸永遠平衡，報表一次過關，主管讚不絕口！" },
        { title: "審計通過", icon: <ShieldCheck className="text-blue-500" />, desc: "查帳順利無異常，所有數字都對得剛剛好，年終獎金 Double！" },
        { title: "客戶加倍", icon: <Gift className="text-pink-400" />, desc: "業績翻倍成長，客戶主動找上門，訂單接到手軟！" },
        { title: "報稅順利", icon: <Activity className="text-emerald-500" />, desc: "申報零錯誤，退稅秒到帳，稅務機關還寄感謝函給你！" },
        { title: "升官發財", icon: <Sparkles className="text-amber-500" />, desc: "升職加薪不是夢，2026 職場路一路開綠燈！" },
        { title: "貴人相助", icon: <Heart className="text-red-400" />, desc: "遇到困難總有人伸出援手，處處遇貴人，事業愛情兩得意！" },
        { title: "學業進步", icon: <Lightbulb className="text-indigo-500" />, desc: "考試運爆棚，讀什麼都記得住，證照手到擒來！" },
        { title: "家庭和樂", icon: <Smile className="text-orange-500" />, desc: "家人健康平安，相處融洽溫馨，每天都是幸福的日子！" },
    ];

    // 6 種御守風格 (參考日本御守配色)
    const omamoriStyles = [
        { name: "祈願藍", bg: "linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)", accent: "#60a5fa", knotColor: "#fbbf24" },
        { name: "合格綠", bg: "linear-gradient(135deg, #166534 0%, #14532d 100%)", accent: "#4ade80", knotColor: "#fbbf24" },
        { name: "學業藍", bg: "linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)", accent: "#7dd3fc", knotColor: "#f87171" },
        { name: "開運紅", bg: "linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)", accent: "#fca5a5", knotColor: "#fbbf24" },
        { name: "招財黃", bg: "linear-gradient(135deg, #eab308 0%, #a16207 100%)", accent: "#fef08a", knotColor: "#ef4444" },
        { name: "結緣紫", bg: "linear-gradient(135deg, #7e22ce 0%, #581c87 100%)", accent: "#c4b5fd", knotColor: "#fbbf24" },
    ];

    // Current Omamori Style State
    const [currentStyle, setCurrentStyle] = useState(omamoriStyles[3]); // Default: Red

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

    const drawFortune = async () => {
        if (isLoading) return;

        setIsLoading(true);
        playSound('magic');
        setIsFlipped(true); // 先翻轉顯示Loading

        // 隨機選一個御守風格
        const randomStyle = omamoriStyles[Math.floor(Math.random() * omamoriStyles.length)];
        setCurrentStyle(randomStyle);

        // 隨機選一個「主題」給 AI (讓每次稍微不同)
        const topics = ["今年的財運", "今年的桃花運", "今年的事業運", "今年的健康運", "今年的貴人運"];
        const topic = topics[Math.floor(Math.random() * topics.length)];

        // 預設靜態籤 (Fallback)
        const randomStatic = fortunes[Math.floor(Math.random() * fortunes.length)];

        try {
            console.log("Fetching fortune...");
            // 呼叫 Cloudflare Function
            const res = await fetch('/api/fortune', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic })
            });

            if (res.ok) {
                const data = await res.json();
                console.log("API Success", data);
                setFortune({
                    ...randomStatic, // 沿用靜態的圖標和標題風格
                    desc: data.fortune // 替換成 AI 的文字
                });
            } else {
                const errData = await res.json();
                console.error("API Error Details:", errData);
                throw new Error(errData.details || "Unknown API Error");
            }
        } catch (e) {
            console.error("AI Fetch Failed, using static", e);
            setFortune(randomStatic);
        } finally {
            createParticles();
            setIsLoading(false);
        }
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

    const handleShare = async () => {
        if (!fortune) return;
        playSound('success');

        const name = prompt("請輸入您的大名 (將顯示在賀卡上):", "幸運兒");
        // Update Ref immediately? No, prompt is synchronous but state update is async.
        // We need the DOM to update first.
        const finalName = name || "幸運兒";
        setUserName(finalName);

        // Short delay to allow React to render the name into the hidden ShareCard
        setTimeout(async () => {
            if (cardRef.current) {
                try {
                    const canvas = await html2canvas(cardRef.current, {
                        scale: 2, // Retina quality
                        backgroundColor: null,
                    });

                    const image = canvas.toDataURL("image/png");
                    const link = document.createElement('a');
                    link.href = image;
                    link.download = `2026新年好運籤-${finalName}.png`;
                    link.click();
                } catch (err) {
                    console.error("Card generation failed", err);
                    alert("製作賀卡失敗，請稍後再試！");
                }
            }
        }, 100);
    };

    return (
        <div className="min-h-screen bg-[#fff5f5] flex items-center justify-center p-4 font-sans text-slate-800 overflow-hidden relative">

            {/* 隱藏的賀卡 (用於生成圖片) */}
            <ShareCard ref={cardRef} fortune={fortune} userName={userName || "幸運兒"} />

            {/* 溫暖的背景裝飾 */}
            <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] bg-pink-200/40 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] bg-orange-100/50 blur-[100px] rounded-full"></div>

            <div className="max-w-md w-full relative z-10">
                <div className={`relative transition-all duration-700 preserve-3d h-[500px] ${isFlipped ? 'rotate-y-180' : ''}`} style={{ perspective: '1200px' }}>

                    {/* 正面 (3D Scene) */}
                    <div className={`relative w-full h-full backface-hidden ${isFlipped ? 'hidden' : 'block'}`}>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Experience onCoinClick={drawFortune} />
                        </div>
                        <div className="absolute bottom-10 left-0 right-0 text-center pointer-events-none">
                            <h1 className="text-4xl font-black mb-2 italic text-transparent bg-clip-text bg-gradient-to-br from-pink-500 to-orange-400">
                                2026
                            </h1>
                            <p className="text-pink-500 font-bold tracking-widest animate-pulse">點擊金幣抽籤</p>
                        </div>
                    </div>

                    {/* 背面 - 御守風格 (Omamori Style) */}
                    <div
                        className={`absolute inset-0 backface-hidden flex flex-col items-center text-center transition-all duration-700 ${isFlipped ? 'visible rotate-y-180' : 'invisible'}`}
                        style={{
                            clipPath: "polygon(50% 0%, 100% 15%, 100% 100%, 0% 100%, 0% 15%)", // 御守形狀
                            background: currentStyle.bg, // 動態背景色
                            boxShadow: `0 10px 25px -5px rgba(0, 0, 0, 0.5), inset 0 0 0 4px ${currentStyle.knotColor}`, // 動態內金邊
                        }}
                    >
                        {/* 御守材質紋理 (CSS Pattern) */}
                        <div className="absolute inset-4 border-2 border-dashed rounded-b-3xl z-0 pointer-events-none" style={{ borderColor: `${currentStyle.accent}50` }}></div>
                        <div className="absolute inset-0 opacity-10 pointer-events-none z-0" style={{
                            backgroundImage: `radial-gradient(${currentStyle.knotColor} 1px, transparent 1px)`,
                            backgroundSize: "12px 12px"
                        }}></div>

                        {/* 繩結 (SVG Knot) */}
                        <div className="relative z-10 w-full flex justify-center mt-6 mb-4">
                            <div className="w-16 h-16 drop-shadow-md" style={{ color: currentStyle.knotColor }}>
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                                    <path d="M12 2C13.1 2 14 2.9 14 4V6H16C17.1 6 18 6.9 18 8V10H20C21.1 10 22 10.9 22 12C22 13.1 21.1 14 20 14H18V16C18 17.1 17.1 18 16 18H14V20C14 21.1 13.1 22 12 22C10.9 22 10 21.1 10 20V18H8C6.9 18 6 17.1 6 16V14H4C2.9 14 2 13.1 2 12C2 10.9 2.9 10 4 10H6V8C6 6.9 6.9 6 8 6H10V4C10 2.9 10.9 2 12 2ZM12 6C10.9 6 10 6.9 10 8V10H8C6.9 10 6 10.9 6 12C6 13.1 6.9 14 8 14H10V16C10 17.1 10.9 18 12 18C13.1 18 14 17.1 14 16V14H16C17.1 14 18 13.1 18 12C18 10.9 17.1 10 16 10H14V8C14 6.9 13.1 6 12 6Z" fillRule="evenodd" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>


                        <div className="relative z-10 px-6 flex flex-col items-center justify-between h-full pb-8 w-full">
                            {fortune && (
                                <>
                                    <div className="mb-4 relative">
                                        <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-yellow-500/50 shadow-inner">
                                            {React.cloneElement(fortune.icon, { size: 40, className: "text-yellow-200" })}
                                        </div>
                                    </div>

                                    <div className="text-center mb-6">
                                        <p className="text-yellow-500/80 font-bold mb-1 tracking-[0.3em] text-xs">Arens CPA</p>
                                        <h3 className="text-3xl font-black text-yellow-50 mb-2" style={{ writingMode: 'horizontal-tb', letterSpacing: '0.15em' }}>
                                            {fortune.title}
                                        </h3>
                                    </div>

                                    <div className="bg-white/95 rounded-lg p-4 shadow-lg w-full mb-4 ring-2 ring-yellow-500/20">
                                        <p className="text-slate-800 text-base leading-relaxed font-serif font-medium text-left">
                                            {fortune.desc}
                                        </p>
                                    </div>

                                    <div className="flex gap-3 w-full mt-auto">
                                        <button
                                            onClick={() => {
                                                playSound('pop');
                                                setIsFlipped(false);
                                                setFortune(null);
                                            }}
                                            className="flex-1 bg-red-900/50 hover:bg-red-900/70 text-red-100 py-2 rounded-lg transition-colors flex items-center justify-center gap-1 font-bold text-sm border border-red-800"
                                        >
                                            <RefreshCw size={14} /> 重抽
                                        </button>
                                        <button
                                            className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white py-2 rounded-lg shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1 font-bold text-sm border border-yellow-400"
                                            onClick={handleShare}
                                        >
                                            <Send size={14} /> 收藏
                                        </button>
                                    </div>
                                </>
                            )}
                            {!fortune && isLoading && (
                                <div className="flex flex-col items-center animate-pulse mt-10">
                                    <Sparkles className="w-12 h-12 text-yellow-400 mb-4 animate-spin" />
                                    <p className="text-yellow-100 font-bold tracking-widest">祈福演運中...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 底部 */}
                <div className="mt-8 text-center px-4">
                    <p className="text-pink-300 font-medium text-sm">建誠聯合會計師事務所 祝你新年快樂 ✨</p>
                    <p className="text-slate-300 text-[10px] mt-2 leading-tight uppercase tracking-widest">
                        May your 2026 be as wonderful as you are. <br />
                        <span className="text-pink-200/50">v2.0 Omamori Edition</span>
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
