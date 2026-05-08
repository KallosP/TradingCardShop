import { useState, useEffect } from 'react'
import backendURL from '../constants/url-constants'
import LoadingIcon from '../components/LoadingIcon'
import TradingCard from '../components/TradingCard'
import TradingCardModal from '../components/TradingCardModal'

export default function MarketplacePage() {
 const [cards, setCards] = useState([])
 const [isLoading, setIsLoading] = useState(true)
 const [activeFilter, setActiveFilter] = useState('all')
 const [selectedCard, setSelectedCard] = useState(null)

 const token = localStorage.getItem('token')
 const user = JSON.parse(localStorage.getItem('user'))

 // TODO:  use volumes to have image URLs persist in docker? (they are deleted on every rerun,
 // but kept in the database which causes invalid url paths)

 // Fetch cards from backend - placeholder function
 useEffect(() => {
  const fetchCards = async () => {
   try {
    setIsLoading(true)
    const response = await fetch(`${backendURL}/cards`)
    if (!response.ok) {
     throw new Error('Failed to fetch cards')
    }

    const data = await response.json()
    setCards(data)
   } catch (error) {
    console.error('Failed to fetch cards:', error)
   } finally {
    setIsLoading(false)
   }
  }

  fetchCards()
 }, [])

 return (
  <div className="min-h-screen bg-slate-950 pt-0">
   {/* Header Section */}
   <div className="border-b border-yellow-600/20 py-8 sm:py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
     <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">Marketplace</h1>
     <p className="text-gray-400 text-base sm:text-lg">
      Browse custom trading cards created by other users
     </p>
    </div>
   </div>

   {/* Main Content */}
   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    {isLoading ? (
     /* Loading State */
     <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-4">
       <LoadingIcon />
       <p className="text-gray-400">Loading cards...</p>
      </div>
     </div>
    ) : cards.length === 0 ? (
     /* Empty State */
     <div className="border border-yellow-600/30 rounded-lg p-12 text-center bg-slate-900/50">
      <h3 className="text-lg font-semibold text-white mb-2">No cards available</h3>
      <p className="text-gray-400">Check back soon for new trading cards!</p>
     </div>
    ) : (
     /* Cards Grid */
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
       <TradingCard key={card._id} card={card} onClick={() => setSelectedCard(card)} />
      ))}
     </div>
    )}
   </div>

   {/* Card Modal */}
   <TradingCardModal selectedCard={selectedCard} onClose={() => setSelectedCard(null)} />
  </div>
 )
}
