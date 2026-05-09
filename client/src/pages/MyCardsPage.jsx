import { useState, useEffect } from 'react'
import backendURL from '../constants/url-constants'
import HeaderSection from '../components/HeaderSection'
import EditCardModal from '../components/EditCardModal'
import TradingCard from '../components/TradingCard'
import LoadingState from '../components/LoadingState'
import TrashIcon from '../assets/TrashIcon'
import EditIcon from '../assets/EditIcon'

export default function MyCardsPage() {
  const [listings, setListings] = useState([])
  const [collection, setCollection] = useState([])
  const [activeTab, setActiveTab] = useState('listings')
  const [editingCard, setEditingCard] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchUserCards = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${backendURL}/cards/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await response.json()
        setListings(data.listings)
        setCollection(data.collection)
      } catch (error) {
        console.error('Failed to fetch cards:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUserCards()
  }, [])

  const handleCloseModal = () => setEditingCard(null)
  const handleSaved = (updatedCard) => {
    setListings((prev) => prev.map((c) => c._id === updatedCard._id ? updatedCard : c))
  }

  const handleDelete = async (cardId) => {
    if (!window.confirm('Are you sure you want to delete this card?')) return

    try {
      const response = await fetch(`${backendURL}/cards/${cardId}`, {
        headers: { Authorization: `Bearer ${token}` },
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete card')
      setListings((prev) => prev.filter((card) => card._id !== cardId))
    } catch (err) {
      alert('Something went wrong deleting your card: ', err)
    }
  }

  const handleRelist = async (cardId) => {
    try {
      const response = await fetch(`${backendURL}/cards/${cardId}/relist`, {
        headers: { Authorization: `Bearer ${token}` },
        method: 'PATCH'
      })
      if (!response.ok) throw new Error('Failed to relist card')
      const relistedCard = await response.json()
      // Remove from collection, add to listings
      setCollection((prev) => prev.filter((c) => c._id !== cardId))
      setListings((prev) => [...prev, relistedCard])
      setActiveTab('listings')
    } catch (err) {
      alert('Something went wrong relisting your card.')
    }
  }

  const tabClass = (tab) =>
    `px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
      activeTab === tab
        ? 'bg-yellow-500 text-slate-950 shadow-md shadow-yellow-500/30'
        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`

  const emptyState = (message, sub) => (
    <div className="border border-yellow-600/30 rounded-lg p-12 text-center bg-slate-900/50">
      <h3 className="text-lg font-semibold text-white mb-2">{message}</h3>
      <p className="text-gray-400">{sub}</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-950">
      <HeaderSection title="My Cards" description="View and manage your trading cards" />

      {/* {<StatsGrid ... />} */}

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="inline-flex gap-2 rounded-full border border-slate-800 bg-slate-900/80 p-2">
          <button className={tabClass('listings')} onClick={() => setActiveTab('listings')}>
            My Listings
            {listings.length > 0 && (
              <span className="ml-2 text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
                {listings.length}
              </span>
            )}
          </button>
          <button className={tabClass('collection')} onClick={() => setActiveTab('collection')}>
            My Collection
            {collection.length > 0 && (
              <span className="ml-2 text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
                {collection.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <LoadingState loadingMsg="Loading your cards..." />
        ) : activeTab === 'listings' ? (
          listings.length === 0 ? (
            emptyState('No listings yet', 'Create a card to start selling!')
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((card) => (
                <div key={card._id} className="group rounded-xl transition-shadow duration-300">
                  <TradingCard card={card} displayMore={false} />
                  <div className="p-4 bg-gradient-to-t rounded-xl from-slate-950 via-slate-950/80 to-transparent">
                    <div className="flex gap-2 pt-3 border-t border-yellow-600/20">
                      <button
                        onClick={() => setEditingCard(card)}
                        className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-yellow-600/20 px-3 py-2 text-sm font-medium text-yellow-400 hover:bg-yellow-600/30 transition-colors">
                        <EditIcon />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(card._id)}
                        className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-red-600/20 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-600/30 transition-colors">
                        <TrashIcon />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          collection.length === 0 ? (
            emptyState('No cards in your collection', 'Purchase cards from the marketplace!')
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {collection.map((card) => (
                <div key={card._id} className="group rounded-xl transition-shadow duration-300">
                  <TradingCard card={card} displayMore={false} />
                  <div className="p-4 bg-gradient-to-t rounded-xl from-slate-950 via-slate-950/80 to-transparent">
                    <div className="flex gap-2 pt-3 border-t border-yellow-600/20">
                      <button
                        onClick={() => handleRelist(card._id)}
                        className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-yellow-600/20 px-3 py-2 text-sm font-medium text-yellow-400 hover:bg-yellow-600/30 transition-colors">
                        Relist on Marketplace
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

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