import { useEffect } from 'react'

export default function Modal({ onClose, closeDisabled = false, children, maxWidth = 'max-w-2xl' }) {
    // Disable background scrolling when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden' // prevents background from scrolling
        return () => {
            document.body.style.overflow = '' // restore normal scrolling when modal is closed
        }
    }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-3 sm:p-4">
      {/* Wrapper */}
      <div className={`relative w-full ${maxWidth}`}>

        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={closeDisabled}
          className="absolute right-2 top-2 z-50 rounded-full border border-yellow-500/20 bg-slate-900/90 p-2 text-gray-400 transition-all hover:border-yellow-500/40 hover:text-white disabled:opacity-50 sm:-right-3 sm:-top-3"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Card */}
        <div className="relative w-full max-h-[95vh] overflow-y-auto overflow-x-hidden rounded-3xl border-2 border-yellow-500/40 bg-gradient-to-br from-slate-900 via-slate-950 to-black shadow-2xl shadow-yellow-500/10 [background-image:radial-gradient(circle_at_bottom_right,rgba(234,179,8,0.15),transparent_10%),linear-gradient(to_bottom_right,#0f172a,#020617,#000000)]">
          {/* Decorative Glow */}
          <div className="pointer-events-none" />
          {/* Content */}
          <div className="relative">
            {children}
          </div>
        </div>

      </div>
    </div>
  )
}