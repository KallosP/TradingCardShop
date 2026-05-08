import { useState, useEffect } from 'react'
import backendURL from '../constants/url-constants'

export default function MyCardsPage() {
 const [cards, setCards] = useState([])
 const [isLoading, setIsLoading] = useState(true)
 const [editingCard, setEditingCard] = useState(null)
 const [editFormData, setEditFormData] = useState({ title: '', description: '', price: '' })
 const [editImagePreview, setEditImagePreview] = useState(null)
 const [editImageFile, setEditImageFile] = useState(null)
 const [isSaving, setIsSaving] = useState(false)
 const [editErrors, setEditErrors] = useState({})
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

 const handleEdit = (card) => {
  setEditingCard(card)
  setEditFormData({
   title: card.title,
   description: card.description,
   price: card.price.toString()
  })
  setEditImagePreview(null)
  setEditImageFile(null)
  setEditErrors({})
 }

 const handleCloseModal = () => {
  setEditingCard(null)
  setEditFormData({ title: '', description: '', price: '' })
  setEditImagePreview(null)
  setEditImageFile(null)
  setEditErrors({})
 }

 const handleEditInputChange = (e) => {
  const { name, value } = e.target
  setEditFormData((prev) => ({
   ...prev,
   [name]: value
  }))
  if (editErrors[name]) {
   setEditErrors((prev) => ({
    ...prev,
    [name]: ''
   }))
  }
 }

 const handleEditImageChange = (e) => {
  const file = e.target.files?.[0]
  if (file) {
   const reader = new FileReader()
   reader.onloadend = () => {
    setEditImagePreview(reader.result)
    setEditImageFile(file)
   }
   reader.readAsDataURL(file)
  }
 }

 const validateEditForm = () => {
  const newErrors = {}

  if (!editFormData.title.trim()) {
   newErrors.title = 'Title is required'
  } else if (editFormData.title.length < 3) {
   newErrors.title = 'Title must be at least 3 characters'
  } else if (editFormData.title.length > 100) {
   newErrors.title = 'Title must be less than 100 characters'
  }

  if (!editFormData.description.trim()) {
   newErrors.description = 'Description is required'
  } else if (editFormData.description.length < 10) {
   newErrors.description = 'Description must be at least 10 characters'
  } else if (editFormData.description.length > 500) {
   newErrors.description = 'Description must be less than 500 characters'
  }

  if (!editFormData.price) {
   newErrors.price = 'Price is required'
  } else if (isNaN(parseFloat(editFormData.price)) || parseFloat(editFormData.price) <= 0) {
   newErrors.price = 'Please enter a valid price'
  } else if (parseFloat(editFormData.price) > 999999) {
   newErrors.price = 'Price is too high'
  }

  setEditErrors(newErrors)
  return Object.keys(newErrors).length === 0
 }

 const handleSaveEdit = async (e) => {
  e.preventDefault()

  if (!validateEditForm()) {
   return
  }

  setIsSaving(true)

  try {
    const formDataToSend = new FormData()
    formDataToSend.append('title', editFormData.title)
    formDataToSend.append('description', editFormData.description)
    formDataToSend.append('price', editFormData.price)
    if (editImageFile) {
      formDataToSend.append('image', editImageFile)
    }

    const response = await fetch(`${backendURL}/cards/${editingCard._id}`, {
      headers: { Authorization: `Bearer ${token}` },
      method: 'PUT',
      body: formDataToSend
    })

    if (!response.ok) throw new Error('Failed to update card')

    // Receive updated card info from backend
    const updatedCard = await response.json();
    // Update card with new info on frontend
    setCards((prevCards) =>
      prevCards.map((card) =>
        card._id === updatedCard._id ? updatedCard : card
      )
    );
    handleCloseModal()
  } catch (error) {
    console.error('Error updating card:', error)
    setEditErrors({ submit: 'Failed to save changes. Please try again.' })
  } finally {
    setIsSaving(false)
  }
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
   <div className="border-b border-yellow-600/20 py-8 sm:py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
     <h1 className="text-4xl sm:text-5xl font-bold text-white mb-8">My Cards</h1>

     {/* Stats Grid */}
     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

      {/* Total Views */}
      <div className="rounded-lg border border-yellow-600/20 bg-slate-900/50 p-4 sm:p-6">
       <div className="flex items-center justify-between">
        <div>
         <p className="text-sm font-medium text-gray-400 mb-1">VIEWS</p>
         <p className="text-3xl sm:text-4xl font-bold text-white">{totalViews.toLocaleString()}</p>
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
           d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
           strokeLinecap="round"
           strokeLinejoin="round"
           strokeWidth={2}
           d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
         </svg>
        </div>
       </div>
      </div>
     </div>
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
       <p className="text-gray-400">Loading your cards...</p>
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
      <h3 className="text-lg font-semibold text-white mb-2">No cards yet</h3>
      <p className="text-gray-400">Start creating trading cards to see them here!</p>
     </div>
    ) : (
     /* Cards Grid */
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
       <div key={card.id} className="group">
        {/* Card Container with Gold Border */}
        <div className="relative rounded-lg border-2 border-yellow-600/70 overflow-hidden hover:border-yellow-500 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20 bg-slate-900">
         {/* Card Image */}
         <div className="relative w-full aspect-square overflow-hidden bg-slate-800">
          <img
           src={`${backendURL}${card.imageUrl}`}
           alt={card.title}
           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Price Badge - Top Right */}
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
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{card.description}</p>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-3 border-t border-yellow-600/20">
           <button
            onClick={() => handleEdit(card)}
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
       </div>
      ))}
     </div>
    )}
   </div>

   {/* Edit Modal */}
   {editingCard && (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
     {/* Modal Container */}
     <div className="bg-slate-900 border border-yellow-600/30 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-slate-900 border-b border-yellow-600/20 px-4 sm:px-6 py-4 flex items-center justify-between">
       <h2 className="text-lg sm:text-xl font-bold text-white">Edit Card</h2>
       <button
        onClick={handleCloseModal}
        disabled={isSaving}
        className="text-gray-400 hover:text-white disabled:opacity-50 transition-colors">
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
         <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
         />
        </svg>
       </button>
      </div>

      {/* Content */}
      <form onSubmit={handleSaveEdit} className="p-4 sm:p-6 space-y-5">
       {/* Image Section */}
       <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">Card Image</label>
        {editImagePreview ? (
         <div className="relative">
          <img
           src={editImagePreview}
           alt="Preview"
           className="w-full aspect-video sm:aspect-square object-cover rounded-lg border-2 border-yellow-600/50"
          />
          <button
           type="button"
           onClick={() => {
            setEditImagePreview(null)
            setEditImageFile(null)
           }}
           disabled={isSaving}
           className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white p-1.5 rounded-lg transition-colors">
           <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
             strokeLinecap="round"
             strokeLinejoin="round"
             strokeWidth={2}
             d="M6 18L18 6M6 6l12 12"
            />
           </svg>
          </button>
         </div>
        ) : (
         <label className="block border-2 border-dashed border-yellow-600/40 rounded-lg p-4 text-center cursor-pointer hover:border-yellow-500 hover:bg-yellow-500/5 transition-colors">
          <svg
           className="h-8 w-8 mx-auto text-yellow-600/60 mb-2"
           fill="none"
           stroke="currentColor"
           viewBox="0 0 24 24">
           <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
           />
          </svg>
          <p className="text-sm text-gray-300 font-medium">Click to update image</p>
          <input
           type="file"
           accept=".png,.jpg,.jpeg"
           onChange={handleEditImageChange}
           disabled={isSaving}
           className="hidden"
          />
         </label>
        )}
       </div>

       {/* Title Input */}
       <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">Title *</label>
        <input
         type="text"
         name="title"
         value={editFormData.title}
         onChange={handleEditInputChange}
         disabled={isSaving}
         className="w-full bg-slate-800 border border-yellow-600/30 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none transition-colors disabled:opacity-50"
        />
        {editErrors.title && <p className="text-red-500 text-xs mt-1">{editErrors.title}</p>}
        <p className="text-gray-500 text-xs mt-1">{editFormData.title.length}/100</p>
       </div>

       {/* Description Input */}
       <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">Description *</label>
        <textarea
         name="description"
         value={editFormData.description}
         onChange={handleEditInputChange}
         disabled={isSaving}
         rows="4"
         className="w-full bg-slate-800 border border-yellow-600/30 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none transition-colors disabled:opacity-50 resize-none"
        />
        {editErrors.description && (
         <p className="text-red-500 text-xs mt-1">{editErrors.description}</p>
        )}
        <p className="text-gray-500 text-xs mt-1">{editFormData.description.length}/500</p>
       </div>

       {/* Price Input */}
       <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">Price (USD) *</label>
        <div className="relative">
         <span className="absolute left-3 top-2 text-gray-400 text-sm font-semibold">$</span>
         <input
          type="number"
          name="price"
          value={editFormData.price}
          onChange={handleEditInputChange}
          disabled={isSaving}
          placeholder="0.00"
          step="0.01"
          min="0"
          className="w-full bg-slate-800 border border-yellow-600/30 rounded-lg pl-6 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none transition-colors disabled:opacity-50"
         />
        </div>
        {editErrors.price && <p className="text-red-500 text-xs mt-1">{editErrors.price}</p>}
       </div>

       {/* Error Message */}
       {editErrors.submit && (
        <div className="bg-red-600/20 border border-red-600/40 rounded-lg p-3">
         <p className="text-red-400 text-xs">{editErrors.submit}</p>
        </div>
       )}

       {/* Action Buttons */}
       <div className="flex gap-3 pt-4">
        <button
         type="submit"
         disabled={isSaving}
         className="flex-1 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-600/50 text-slate-950 font-bold py-2.5 px-4 rounded-lg transition-colors disabled:cursor-not-allowed text-sm sm:text-base">
         {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
        <button
         type="button"
         onClick={handleCloseModal}
         disabled={isSaving}
         className="flex-1 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-800/50 text-white font-bold py-2.5 px-4 rounded-lg transition-colors disabled:cursor-not-allowed text-sm sm:text-base">
         Cancel
        </button>
       </div>
      </form>
     </div>
    </div>
   )}
  </div>
 )
}
