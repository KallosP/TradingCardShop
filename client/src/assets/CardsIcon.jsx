export default function CardsIcon() {
 return (
    <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {/* Card behind (offset up-right) */}
        <rect x="6" y="1" width="16" height="20" rx="2" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="currentColor" className="text-slate-950" />
        <rect x="6" y="1" width="16" height="20" rx="2" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        {/* Front card — filled to mask what's behind */}
        <rect x="2" y="4" width="16" height="20" rx="2" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="currentColor" className="text-slate-950" />
        {/* Front card outline */}
        <rect x="2" y="4" width="16" height="20" rx="2" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        {/* Image placeholder area */}
        <rect x="5" y="7" width="10" height="7" rx="1" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        {/* Text lines */}
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 17h10" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 20h6" />
    </svg>
 )

}
