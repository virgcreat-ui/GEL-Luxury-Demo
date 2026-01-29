
import React, { useState, useEffect } from "react";
import { generateMagicImage, AspectRatio } from "../services/geminiService";
import { t, Lang } from "../i18n";

interface MagicViewProps {
  lang: Lang;
  onBack: () => void;
}

export default function MagicView({ lang, onBack }: MagicViewProps) {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("");

  const messages = [
    t(lang, "magic_loading_1"),
    t(lang, "magic_loading_2"),
    t(lang, "magic_loading_3"),
  ];

  useEffect(() => {
    let interval: any;
    if (loading) {
      let i = 0;
      setLoadingMessage(messages[0]);
      interval = setInterval(() => {
        i = (i + 1) % messages.length;
        setLoadingMessage(messages[i]);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [loading, lang]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResultImage(null);
    try {
      const img = await generateMagicImage(prompt, aspectRatio);
      setResultImage(img);
    } catch (error) {
      console.error(error);
      alert("The magic lens is a bit foggy. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white font-sans overflow-y-auto pb-10">
      <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-10 transition-all">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="h-10 w-10 rounded-full border border-neutral-200 bg-white font-black shadow-sm flex items-center justify-center hover:bg-neutral-50 hover:shadow-md transition-all">‹</button>
          <div className="text-xl font-black uppercase tracking-tight">{t(lang, "magic_title")}</div>
        </div>
        <div className="text-2xl animate-pulse">✨</div>
      </div>

      <div className="p-6 space-y-8">
        {!resultImage && !loading && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-black text-white p-8 rounded-3xl shadow-xl shadow-blue-900/20">
              <h3 className="text-3xl font-black uppercase tracking-tighter leading-none mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Elite Capture</h3>
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest leading-relaxed">
                Describe a scene, and our AI will render a high-quality travel photograph in the LGE signature aesthetic.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-2">Creative Prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. A sunset cocktail on a rooftop bar overlooking the Eiffel Tower..."
                  className="w-full h-40 rounded-3xl border border-neutral-200 p-6 font-medium text-lg outline-none bg-neutral-50 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner resize-none"
                />
              </div>

              <div className="space-y-3">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-2">Composition</div>
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide px-2">
                  {(["1:1", "3:4", "4:3", "9:16", "16:9"] as AspectRatio[]).map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => setAspectRatio(ratio)}
                      className={`flex-shrink-0 px-6 py-4 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all border ${aspectRatio === ratio
                        ? "bg-black text-white border-black shadow-lg"
                        : "bg-white text-neutral-400 border-neutral-200 hover:border-neutral-300"
                        }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!prompt.trim()}
                className={`w-full h-20 rounded-3xl font-black uppercase text-sm tracking-[0.3em] shadow-lg transition-all active:scale-95 ${prompt.trim()
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1"
                  : "bg-neutral-100 text-neutral-300 cursor-not-allowed shadow-none"
                  }`}
              >
                Render Magic
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-32 space-y-10 animate-in fade-in duration-700">
            <div className="relative">
              <div className="w-32 h-32 border-[8px] border-[#FFE400] border-t-black rounded-full animate-spin shadow-xl"></div>
              <div className="absolute inset-0 flex items-center justify-center text-4xl animate-pulse">✨</div>
            </div>
            <div className="text-center space-y-3">
              <div className="text-2xl font-black uppercase tracking-tighter text-black animate-bounce">{loadingMessage}</div>
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">PRO PHOTO ENGINE v2.5</div>
            </div>
          </div>
        )}

        {resultImage && !loading && (
          <div className="space-y-8 animate-in zoom-in-95 duration-500">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 bg-black">
              <img src={resultImage} alt="Generated" className="w-full h-auto block" />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setResultImage(null)}
                className="flex-1 h-16 rounded-2xl border border-neutral-200 bg-white font-bold uppercase text-[10px] tracking-widest shadow-sm hover:bg-neutral-50 transition-all"
              >
                Discard
              </button>
              <button
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = resultImage;
                  link.download = `lge_elite_${Date.now()}.png`;
                  link.click();
                }}
                className="flex-1 h-16 rounded-2xl bg-black text-white font-bold uppercase text-[10px] tracking-widest shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                Save Photo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
