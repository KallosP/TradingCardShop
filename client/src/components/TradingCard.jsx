import backendURL from '../constants/url-constants'

export default function TradingCard({ card, onClick, displayMore = false }) {
 return (
  <div className={`group ${displayMore ? 'cursor-pointer' : ''} relative`} onClick={onClick}>
   {/* Card Container */}
   <div className={`relative rounded-lg border-2 border-yellow-600/80 overflow-hidden transition-all duration-300 hover:border-yellow-400 bg-slate-900`}>
    {/* Card Image */}
    <div className="relative w-full aspect-square overflow-hidden bg-slate-800">
     <img
      src={`${backendURL}${card.imageUrl}`}
      alt={card.title}
      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
     />

     {/* Price Badge */}
     <div className="absolute top-3 right-3 bg-yellow-600 text-slate-900 px-3 py-1 rounded-lg font-bold text-sm border border-yellow-500">
      ${card.price.toFixed(2)}
     </div>
    </div>

    {/* Card Info */}
    <div className="p-4 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent">
     {/* Title */}
     <h3 className="text-white font-bold text-lg mb-1 line-clamp-1 group-hover:text-yellow-400 transition-colors">
      {card.title}
     </h3>

     {/* Description */}
     <p className="text-gray-400 text-sm mb-3 line-clamp-1">{card.description}</p>

     {/* Seller Info */}
    {displayMore && (
     <div className="flex items-center gap-2 pt-3 border-t border-yellow-600/20">
      <div className="w-7 h-7 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-full flex items-center justify-center text-slate-900 font-bold text-xs flex-shrink-0">
       {card.ownerId.username[0].toUpperCase()}
      </div>

      <div className="min-w-0 flex-1">
       <p className="text-gray-500 text-xs">by {card.ownerId.username}</p>
      </div>
     </div>
    )}
    </div>
   </div>
  </div>
 )
}
