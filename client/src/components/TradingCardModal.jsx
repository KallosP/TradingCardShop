import backendURL from '../constants/url-constants'

export default function TradingCardModal({ selectedCard, onClose }) {
  if (!selectedCard) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-3 sm:p-4">
      {/* Wrapper */}
      <div className="relative w-full max-w-3xl">

        {/* Close Button — inside wrapper, above card, safe on all screen sizes */}
        <button
          onClick={onClose}
          className="absolute right-2 top-2 z-50 rounded-full border border-yellow-500/20 bg-slate-900/90 p-2 text-gray-400 transition-all hover:border-yellow-500/40 hover:text-white sm:-right-3 sm:-top-3"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Card */}
        <div className="relative w-full max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-3xl border-2 border-yellow-500/40 bg-gradient-to-br from-slate-900 via-slate-950 to-black shadow-2xl shadow-yellow-500/10">
          <div className="grid grid-cols-1 gap-6 p-4 pt-12 sm:grid-cols-2 sm:gap-8 sm:p-8 sm:pt-8 items-stretch">
            {/* Left Side - Trading Card */}
            <div className="flex flex-col items-center">
              <div className="group relative w-full max-w-sm overflow-hidden rounded-2xl border-[3px] border-yellow-500 bg-slate-950 shadow-lg shadow-yellow-500/20 transition-transform duration-300 hover:scale-[1.02]">
                <div className="relative rounded-2xl bg-slate-950 overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-yellow-500/20 bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-3">
                    <h2 className="line-clamp-1 text-lg font-bold tracking-wide text-yellow-400">
                      {selectedCard.title}
                    </h2>
                  </div>

                  {/* Image */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-slate-900">
                    <img
                      src={`${backendURL}${selectedCard.imageUrl}`}
                      alt={selectedCard.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Details */}
            <div className="flex flex-col h-full justify-between gap-5">
              {/* Seller */}
              <div className="rounded-xl border border-yellow-500/10 bg-slate-900/70 p-5">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-yellow-500">
                  Seller
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-yellow-700 text-sm font-bold text-slate-900">
                    {selectedCard.ownerId?.username?.[0]?.toUpperCase()}
                  </div>
                  <p className="font-medium text-white">
                    {selectedCard.ownerId?.username}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="rounded-xl border border-yellow-500/10 bg-slate-900/70 p-5 h-64 flex flex-col">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-yellow-500">
                  Description
                </p>
                <div className="flex-1 overflow-y-auto pr-2">
                  <p className="text-gray-300 leading-relaxed break-words">
                    {selectedCard.description}
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center justify-center">
                <div className="rounded-xl border border-yellow-500/20 bg-gradient-to-b from-slate-900/80 to-slate-900/60 px-6 py-4 shadow-md shadow-yellow-500/10">
                  <div className="flex items-center gap-3">
                    <span className="text-md font-semibold tracking-wider text-yellow-500 uppercase">
                      Price
                    </span>
                    <span className="h-5 w-[1px] bg-yellow-500/50" />
                    <span className="text-2xl font-bold text-yellow-300">
                      ${selectedCard.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}