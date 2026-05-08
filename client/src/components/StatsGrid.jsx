import CardsIcon from "../assets/CardsIcon"
import MoneyIcon from "../assets/MoneyIcon"

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
            <CardsIcon />
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
            <MoneyIcon />
        </div>
        </div>
        </div>
        </div>
    )
}