
export default function StatsGrid({ totalCards, totalValue, totalViews }) {
    return (
        <div className="grid grid-cols-1 mt-8 sm:grid-cols-2 gap-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Total Cards */}
        <div className="rounded-lg border border-yellow-600/20 bg-slate-900/50 p-4 sm:p-6">
        <div className="flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-gray-400 mb-1">TOTAL CARDS</p>
            <p className="text-3xl sm:text-4xl font-bold text-white">{totalCards}</p>
        </div>
        <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-500">
            <svg
            className="h-6 w-6 sm:h-7 sm:w-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
            </svg>
        </div>
        </div>
        </div>

        {/* Total Value */}
        <div className="rounded-lg border border-yellow-600/20 bg-slate-900/50 p-4 sm:p-6">
        <div className="flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-gray-400 mb-1">TOTAL VALUE</p>
            <p className="text-3xl sm:text-4xl font-bold text-white">${totalValue.toFixed(2)}</p>
        </div>
        <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-500">
            <svg
            className="h-6 w-6 sm:h-7 sm:w-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
            </svg>
        </div>
        </div>
        </div>
        </div>
    )
}