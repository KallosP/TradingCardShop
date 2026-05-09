import { useState } from 'react'
import backendURL from '../constants/url-constants'
import Modal from './Modal'
import { useNavigate } from 'react-router-dom'
import getUserBalance from '../utils/getUserBalance'

export default function TradingCardModal({ selectedCard, onClose, userId, onPurchase }) {
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [purchaseError, setPurchaseError] = useState(null)
  const [purchased, setPurchased] = useState(false)
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const isOwnCard = selectedCard?.ownerId?._id === userId 

  if (!selectedCard) return null

  const handleBuy = async () => {
    setIsPurchasing(true)
    setPurchaseError(null)
    try {
      const response = await fetch(`${backendURL}/cards/${selectedCard._id}/buy`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        // Include price in request body for validation/prevent stale data issues on server side
        body: JSON.stringify({ price: selectedCard.price }) 
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.message || 'Purchase failed')

      setPurchased(true)

      getUserBalance() // Update user's balance after purchase

    } catch (err) {
      setPurchaseError(err.message)
    } finally {
      setIsPurchasing(false)
    }
  }

  function handleClose() {
    setPurchaseError(null);
    onClose();
    // Refresh page after purchase to update listings (remove purchased card)
    if(purchased){
      window.location.reload();
    }
  }

  return (
    <Modal onClose={handleClose} maxWidth="max-w-4xl">
      <div className="grid grid-cols-1 gap-6 p-4 pt-12 sm:grid-cols-2 sm:gap-8 sm:p-8 sm:pt-8 items-stretch">
        {/* Left Side - Trading Card */}
        <div className="flex flex-col items-center">
          <div className="group relative w-full max-w-sm overflow-hidden rounded-2xl border-[3px] border-yellow-500 bg-slate-950 card-float">
            <div className="relative rounded-1xl bg-slate-950 overflow-hidden">
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
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-yellow-500">Seller</p>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-yellow-700 text-sm font-bold text-slate-900">
                {selectedCard.ownerId?.username?.[0]?.toUpperCase()}
              </div>
              <p className="font-medium text-white">{selectedCard.ownerId?.username}</p>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-xl border border-yellow-500/10 bg-slate-900/70 p-5 h-64 flex flex-col">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-yellow-500">Description</p>
            <div className="flex-1 overflow-y-auto pr-2">
              <p className="text-gray-300 leading-relaxed break-words">{selectedCard.description}</p>
            </div>
          </div>

        {/* Price + Buy */}
        {!isOwnCard && (
          <div className="flex flex-col gap-2">
            {purchaseError && (
              <div className="rounded-xl border border-red-600/40 bg-red-600/20 px-4 py-3">
                <p className="text-red-400 text-xs text-center">{purchaseError}</p>
              </div>
            )}
            {purchased ? (
              <div className="rounded-xl border border-green-500/40 bg-green-500/10 px-6 py-4 text-center">
                <p className="text-green-400 font-semibold">Purchase Successful!</p>
                <p className="text-green-400/70 text-xs mt-1">This card is now in your collection.</p>
              </div>
            ) : (
                <button
                  onClick={handleBuy}
                  disabled={isPurchasing}
                  className="w-full rounded-xl border border-yellow-500/20 bg-gradient-to-b from-yellow-500 to-yellow-600 px-6 py-4 shadow-md hover:border-yellow-500/60 hover:from-yellow-400 hover:to-yellow-500 hover:shadow-yellow-500/30 hover:scale-[1.03] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-md font-semibold tracking-wider text-slate-950 uppercase">
                      {isPurchasing ? 'Processing...' : 'Buy Now'}
                    </span>
                    <span className="h-5 w-[1px] bg-slate-950/50" />
                    <span className="text-2xl font-bold text-slate-950">${selectedCard.price.toFixed(2)}</span>
                  </div>
                </button>
            )}
          </div>
        )}

        {/* Price only — shown when it's the user's own card */}
        {isOwnCard && (
          <div className="flex">
            <div className="w-full rounded-xl border border-yellow-500/20 bg-gradient-to-b from-slate-900/80 to-slate-900/60 px-6 py-4 shadow-md shadow-yellow-500/10">
              <div className="flex items-center justify-center gap-3">
                <span className="text-md font-semibold tracking-wider text-yellow-500 uppercase">Your Listing</span>
                <span className="h-5 w-[1px] bg-yellow-500/50" />
                <span className="text-2xl font-bold text-yellow-300">${selectedCard.price.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        </div>
      </div>
    </Modal>
  )
}