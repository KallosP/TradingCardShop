import { useState, useEffect } from 'react'
import backendURL from '../constants/url-constants'
import HeaderSection from '../components/HeaderSection'
import EditCardModal from '../components/EditCardModal'
import TradingCard from '../components/TradingCard'
import StatsGrid from '../components/StatsGrid'
import LoadingState from '../components/LoadingState'

export default function MyCardsPage() {
  const [cards, setCards] = useState([])
  const [editingCard, setEditingCard] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))

 useEffect(() => {
  const fetchUserCards = async () => {
   try {
    setIsLoading(true)
    const response = await fetch(`${backendURL}/cards/me`, {
     headers: { Authorization: `Bearer ${token}` }
    })
    const data = await response.json()
    setCards(data)
   } catch (error) {
    console.error('Failed to fetch cards:', error)
   } finally {
    setIsLoading(false)
   }
  }

  fetchUserCards()
 }, [])

  // Calculate stats
  const totalCards = cards.length
  const totalValue = cards.reduce((sum, card) => sum + (card.price || 0), 0)
  const totalViews = cards.reduce((sum, card) => sum + (card.views || 0), 0)

  const handleCloseModal = () => setEditingCard(null)
  const handleSaved = (updatedCard) => {
    setCards((prev) => prev.map((c) => c._id === updatedCard._id ? updatedCard : c))
  }

 const handleDelete = async (cardId) => {
    if (!window.confirm('Are you sure you want to delete this card?')) {
      return;
    }

    try{
      const response = await fetch(`${backendURL}/cards/${cardId}`, {
        headers: {Authorization: `Bearer ${token}`},
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete card')
        
      setCards((prevCards) =>
        prevCards.filter((card) => card._id !== cardId)
      );
      
    } catch (err){
      alert("Something went wrong deleting your card: ", err)
    }

 }

 return (
  <div className="min-h-screen bg-slate-950 pt-0">
    {/* Header Section */}
    <HeaderSection title="My Cards" description="View and modify your trading cards" />

    <StatsGrid totalCards={totalCards} totalValue={totalValue} totalViews={totalViews} />

   {/* Main Content */}
   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    {isLoading ? (
      <LoadingState loadingMsg="Loading your cards..."/>
    ) : cards.length === 0 ? (
     /* Empty State */
     <div className="border border-yellow-600/30 rounded-lg p-12 text-center bg-slate-900/50">
      <h3 className="text-lg font-semibold text-white mb-2">No cards yet</h3>
      <p className="text-gray-400">Start creating trading cards to see them here!</p>
     </div>
    ) : (
     /* Cards Grid */
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
       <div key={card._id} className="group hover:shadow-lg hover:shadow-yellow-500/20 rounded-xl  transition-shadow duration-300 ">
          <TradingCard card={card} displayMore={false} />
          {/* Card Info */}
          <div className="p-4 bg-gradient-to-t rounded-xl from-slate-950 via-slate-950/80 to-transparent">
            {/* Action Buttons */}
            <div className="flex gap-2 pt-3 border-t border-yellow-600/20">
            <button
              onClick={() => setEditingCard(card)}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-yellow-600/20 px-3 py-2 text-sm font-medium text-yellow-400 hover:bg-yellow-600/30 transition-colors">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
              </svg>
              Edit
            </button>
            <button
              onClick={() => handleDelete(card._id)}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-red-600/20 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-600/30 transition-colors">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
              </svg>
              Delete
            </button>
            </div>
          </div>
       </div>
      ))}
     </div>
    )}
   </div>

   {/* Edit Modal */}
   {editingCard && (
    <EditCardModal
      editingCard={editingCard}
      onClose={handleCloseModal}
      onSave={handleSaved}
    />
   )}
  </div>
 )
}
