import { brand } from '../../data/brand';

export default function AnnouncementBar() {
  return (
    <div className="relative z-50 overflow-hidden bg-ember text-[#fff]">
      <div className="flex whitespace-nowrap py-2 text-[11px] font-semibold uppercase tracking-luxe">
        <div className="flex animate-marquee items-center gap-16 pr-16">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="flex items-center gap-16">
              {brand.announcement}
              <span aria-hidden="true">•</span>
            </span>
          ))}
        </div>
        <div className="flex animate-marquee items-center gap-16 pr-16" aria-hidden="true">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="flex items-center gap-16">
              {brand.announcement}
              <span>•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
