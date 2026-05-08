import { useState, useEffect } from 'react'
import backendURL from '../constants/url-constants'

export default function MarketplacePage() {
 const [cards, setCards] = useState([])
 const [isLoading, setIsLoading] = useState(true)
 const [activeFilter, setActiveFilter] = useState('all')
 
 // TODO: use volumes to have image URLs persist in docker? (they are deleted on every rerun,
 //  but kept in the database which causes invalid url paths)

 // Placeholder data - replace with API call
 const placeholderCards = [
  {
   id: 1,
   title: 'Radiant Paladin',
   description: 'A beacon of hope in the darkest times.',
   price: 12.0,
   image: 'https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=600&h=600&fit=crop',
   seller: 'guardian@realm.gg',
   sellerAvatar: 'G'
  },
  {
   id: 2,
   title: 'Sylvan Enchantress',
   description: 'She speaks the language of the wild.',
   price: 12.0,
   image: 'https://images.unsplash.com/photo-1578066994444-cf1b12d4e85f?w=600&h=600&fit=crop',
   seller: 'flora@wilds.io',
   sellerAvatar: 'F'
  },
  {
   id: 3,
   title: 'Void Archon',
   description: 'Beyond reality, beyond control.',
   price: 12.0,
   image: 'https://images.unsplash.com/photo-1578588285163-f1e8bde5b2d3?w=600&h=600&fit=crop',
   seller: 'voidwalker@abyss.art',
   sellerAvatar: 'V'
  },
  {
   id: 4,
   title: 'Skybound Bastion',
   description: 'A fortress that defies gravity.',
   price: 12.0,
   image: 'https://images.unsplash.com/photo-1578587348244-efebf9ab33e2?w=600&h=600&fit=crop',
   seller: 'aeris@skydock.io',
   sellerAvatar: 'A'
  },
  {
   id: 5,
   title: 'Frostfang Drake',
   description: 'Born from ice, feared by all.',
   price: 12.0,
   image: 'https://images.unsplash.com/photo-1578595986299-e1e99e843b20?w=600&h=600&fit=crop',
   seller: 'glacia@frosthold.net',
   sellerAvatar: 'G'
  },
  {
   id: 6,
   title: 'Neon Reclaimer',
   description: 'The future belongs to the restless.',
   price: 12.0,
   image: 'https://images.unsplash.com/photo-1578587348244-efebf9ab33e2?w=600&h=600&fit=crop',
   seller: 'byte@neoncity.dev',
   sellerAvatar: 'B'
  },
  {
   id: 7,
   title: 'Infernal Overlord',
   description: 'All will kneel before the flame.',
   price: 12.0,
   image: 'https://images.unsplash.com/photo-1578058279087-65f32e43e968?w=600&h=600&fit=crop',
   seller: 'malgos@shadereaIm.com',
   sellerAvatar: 'M'
  },
  {
   id: 8,
   title: 'Chronomancer',
   description: 'Master of moments, maker of fate.',
   price: 12.0,
   image: 'https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=600&h=600&fit=crop',
   seller: 'tempus@eternity.co',
   sellerAvatar: 'T'
  }
 ]

 // Fetch cards from backend - placeholder function
 useEffect(() => {
  const fetchCards = async () => {
   try {
    setIsLoading(true)
    const response = await fetch(`${backendURL}/card`);
    if (!response.ok) {
      throw new Error("Failed to fetch cards")
    }

    const data = await response.json();
    console.log(data)
    setCards(data);
    console.log(cards)
   } catch (error) {
    console.error('Failed to fetch cards:', error)
   } finally {
    setIsLoading(false)
   }
  }

  fetchCards()
 }, [])

 //const filterButtons = [
 // { id: 'all', label: 'All' },
 // { id: 'new', label: 'New', icon: '✨' },
 // { id: 'trending', label: 'Trending', icon: '🔥' },
 // { id: 'price', label: 'Price low-high', icon: '⬆️' }
 //]

 return (
  <div className="min-h-screen bg-slate-950 pt-0">
   {/* Header Section */}
   <div className="border-b border-yellow-600/20 py-8 sm:py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
     <h1 className="text-4xl sm:text-5xl font-bold text-white">Marketplace</h1>

     {/* Filter Buttons */}
     {/*<div className="flex flex-wrap gap-3">
      {filterButtons.map((btn) => (
       <button
        key={btn.id}
        onClick={() => setActiveFilter(btn.id)}
        className={`px-4 sm:px-6 py-2 rounded-full font-medium text-sm sm:text-base transition-all flex items-center gap-2 border-2 ${
         activeFilter === btn.id
          ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400'
          : 'border-yellow-600/30 text-gray-300 hover:border-yellow-500/50 hover:text-yellow-300'
        }`}>
        {btn.icon && <span>{btn.icon}</span>}
        {btn.label}
       </button>
      ))}
     </div>*/}
    </div>
   </div>

   {/* Main Content */}
   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    {isLoading ? (
     /* Loading State */
     <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-4">
       <svg
        className="animate-spin h-12 w-12 text-yellow-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24">
        <circle
         className="opacity-25"
         cx="12"
         cy="12"
         r="10"
         stroke="currentColor"
         strokeWidth="4"></circle>
        <path
         className="opacity-75"
         fill="currentColor"
         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
       </svg>
       <p className="text-gray-400">Loading cards...</p>
      </div>
     </div>
    ) : cards.length === 0 ? (
     /* Empty State */
     <div className="border border-yellow-600/30 rounded-lg p-12 text-center bg-slate-900/50">
      <svg
       className="w-16 h-16 mx-auto text-yellow-600/30 mb-4"
       fill="none"
       stroke="currentColor"
       viewBox="0 0 24 24">
       <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4"
       />
      </svg>
      <h3 className="text-lg font-semibold text-white mb-2">No cards available</h3>
      <p className="text-gray-400">Check back soon for new trading cards!</p>
     </div>
    ) : (
     /* Cards Grid */
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
       <div key={card.id} className="group cursor-pointer relative">
        {/* Card Container with Gold Border */}
        <div className="relative rounded-xl border-3 border-yellow-600/80 overflow-hidden hover:border-yellow-500 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20 bg-slate-900">
         {/* Card Image */}
         <div className="relative w-full aspect-square overflow-hidden bg-slate-800">
          <img
          // access the image at it's url
           src={`${backendURL}${card.imageUrl}`}
           alt={card.title}
           className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />

          {/* Price Badge - Top Right */}
          <div className="absolute top-3 right-3 bg-yellow-600 text-slate-900 px-3 py-1 rounded-lg font-bold text-sm border border-yellow-500">
           ${card.price.toFixed(2)}
          </div>
         </div>

         {/* Card Info - Bottom Section */}
         <div className="p-4 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent">
          {/* Title */}
          <h3 className="text-white font-bold text-lg mb-1 line-clamp-1 group-hover:text-yellow-400 transition-colors">
           {card.title}
          </h3>

          {/* Description */}
          <p className="text-gray-400 text-sm mb-3 line-clamp-1">{card.description}</p>

          {/* Seller Info */}
          <div className="flex items-center gap-2 pt-3 border-t border-yellow-600/20">
           <div className="w-7 h-7 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-full flex items-center justify-center text-slate-900 font-bold text-xs flex-shrink-0">
            {card.sellerAvatar}
           </div>
           <div className="min-w-0 flex-1">
            <p className="text-gray-500 text-xs">by {card.seller}</p>
           </div>
          </div>
         </div>
        </div>
       </div>
      ))}
     </div>
    )}
   </div>
  </div>
 )
}
