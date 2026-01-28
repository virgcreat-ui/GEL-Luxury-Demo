
import React from "react";

export default function RoundTile({
  title,
  subtitle,
  imageUrl,
  onClick,
}: {
  title: string;
  subtitle?: string;
  imageUrl: string;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="group w-full text-left focus:outline-none transition-transform active:scale-95">
      <div className="relative aspect-square w-full overflow-hidden rounded-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-2 border-black/5 group-hover:border-[#FFE400] transition-colors">
        <img src={imageUrl} alt={title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <div className="text-xl font-black text-white uppercase tracking-tighter leading-none drop-shadow-md">
            {title}
          </div>
          {subtitle ? (
            <div className="mt-2 text-[10px] font-bold text-[#FFE400] uppercase tracking-widest drop-shadow-md">
              {subtitle}
            </div>
          ) : null}
        </div>
      </div>
    </button>
  );
}
