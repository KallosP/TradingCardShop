import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import backendURL from "../constants/url-constants";

export default function CreateCardPage() {
 const [formData, setFormData] = useState({
  title: '',
  description: '',
  price: ''
 })
 const [imagePreview, setImagePreview] = useState(null)
 const [imageFile, setImageFile] = useState(null)
 const [errors, setErrors] = useState({})
 const [isLoading, setIsLoading] = useState(false)
 const navigate = useNavigate()
 const token = localStorage.getItem("token")
 const user = JSON.parse(localStorage.getItem("user"))

 const validateForm = () => {
  const newErrors = {}

  if (!formData.title.trim()) {
   newErrors.title = 'Card title is required'
  } else if (formData.title.length < 3) {
   newErrors.title = 'Title must be at least 3 characters'
  } else if (formData.title.length > 100) {
   newErrors.title = 'Title must be less than 100 characters'
  }

  if (!formData.description.trim()) {
   newErrors.description = 'Description is required'
  } else if (formData.description.length < 10) {
   newErrors.description = 'Description must be at least 10 characters'
  } else if (formData.description.length > 500) {
   newErrors.description = 'Description must be less than 500 characters'
  }

  if (!formData.price) {
   newErrors.price = 'Price is required'
  } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
   newErrors.price = 'Please enter a valid price'
  } else if (parseFloat(formData.price) > 999999) {
   newErrors.price = 'Price is too high'
  }

  if (!imagePreview) {
   newErrors.image = 'Card image is required'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
 }

 const handleInputChange = (e) => {
  const { name, value } = e.target
  setFormData((prev) => ({
   ...prev,
   [name]: value
  }))
  if (errors[name]) {
   setErrors((prev) => ({
    ...prev,
    [name]: ''
   }))
  }
 }

 const handleImageChange = (e) => {
  const file = e.target.files?.[0]
  if (file) {
   const reader = new FileReader()
   reader.onloadend = () => {
    setImagePreview(reader.result)
    setImageFile(file)
   }
   reader.readAsDataURL(file)
   if (errors.image) {
    setErrors((prev) => ({
     ...prev,
     image: ''
    }))
   }
  }
 }

 const handleDragOver = (e) => {
  e.preventDefault()
  e.currentTarget.classList.add('border-yellow-500', 'bg-yellow-500/5')
 }

 const handleDragLeave = (e) => {
  e.currentTarget.classList.remove('border-yellow-500', 'bg-yellow-500/5')
 }

 const handleDrop = (e) => {
  e.preventDefault()
  e.currentTarget.classList.remove('border-yellow-500', 'bg-yellow-500/5')
  const file = e.dataTransfer.files?.[0]
  if (file) {
   const reader = new FileReader()
   reader.onloadend = () => {
    setImagePreview(reader.result)
   }
   reader.readAsDataURL(file)
  }
 }

 const handlePublish = async (e) => {
  e.preventDefault()

  if (!validateForm()) {
   return
  }

  setIsLoading(true)

  try {
    const formDataToSend = new FormData()
    formDataToSend.append('title', formData.title)
    formDataToSend.append('description', formData.description)
    formDataToSend.append('price', formData.price)
    formDataToSend.append('image', imageFile)
   
    const response = await fetch(`${backendURL}/cards`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'POST',
      body: formDataToSend
    })
   
    if (!response.ok) throw new Error('Failed to create card')

   console.log('Card published:', formData)
   navigate('/marketplace')
  } catch (error) {
   console.error('Error publishing card:', error)
   setErrors({ submit: 'Failed to publish card. Please try again.' })
  } finally {
   setIsLoading(false)
  }
 }

 const handleCancel = () => {
  navigate('/marketplace')
 }

 const removeImage = () => {
  setImagePreview(null)
  if (errors.image) {
   setErrors((prev) => ({
    ...prev,
    image: ''
   }))
  }
 }

 return (
  <div className="min-h-screen bg-slate-950">
   {/* Header Section */}
   <div className="border-b border-yellow-600/20 py-8 sm:py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
     <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">Create a Card</h1>
     <p className="text-gray-400 text-base sm:text-lg">
      Design your card and publish it to the marketplace.
     </p>
    </div>
   </div>

   {/* Main Content */}
   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
     {/* Left Column - Image Upload & Preview */}
     <div className="space-y-8">
      {/* Upload Area */}
      <div>
       <label className="block text-white font-semibold text-lg mb-4">Card Image *</label>
       {imagePreview ? (
        <div className="relative">
         <img
          src={imagePreview}
          alt="Preview"
          className="w-full aspect-square object-cover rounded-lg border-3 border-yellow-600/80"
         />
         <button
          type="button"
          onClick={removeImage}
          disabled={isLoading}
          className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 disabled:bg-red-500 text-white p-2 rounded-lg transition-colors"
          title="Remove image">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
           />
          </svg>
         </button>
        </div>
       ) : (
        <label
         onDragOver={handleDragOver}
         onDragLeave={handleDragLeave}
         onDrop={handleDrop}
         className="block border-2 border-dashed border-yellow-600/40 rounded-lg p-8 text-center cursor-pointer hover:border-yellow-500 hover:bg-yellow-500/5 transition-all duration-200">
         <svg
          className="w-12 h-12 mx-auto text-yellow-600/60 mb-3"
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
         <p className="text-gray-300 font-medium mb-1">Click or drop an image here</p>
         <p className="text-gray-500 text-sm mb-2">PNG or JPG</p>
         <input
          type="file"
          accept=".png,.jpg"
          onChange={handleImageChange}
          disabled={isLoading}
          className="hidden"
         />
        </label>
       )}

       {errors.image && <p className="text-red-500 text-sm mt-2">{errors.image}</p>}
      </div>

      {/* Live Preview */}
      {imagePreview && (
       <div>
        <h3 className="text-white font-semibold text-lg mb-4">LIVE PREVIEW</h3>
        <div className="relative w-full aspect-video sm:aspect-square max-w-xs">
         {/* Card Frame with Gold Border */}
         <div
          className="absolute inset-0 border-4 border-yellow-600 rounded-xl"
          style={{
           background: 'linear-gradient(135deg, #b8860b 0%, #ffd700 50%, #b8860b 100%)',
           padding: '4px'
          }}>
          <div className="w-full h-full bg-slate-900 rounded-lg overflow-hidden relative">
           {/* Card Content */}
           <img src={imagePreview} alt="Card preview" className="w-full h-full object-cover" />

           {/* Price Badge */}
           {formData.price && (
            <div className="absolute top-3 right-3 bg-yellow-600 text-slate-900 px-3 py-1 rounded-lg font-bold text-sm border-2 border-yellow-500">
             ${parseFloat(formData.price).toFixed(2)}
            </div>
           )}

           {/* Title at Bottom */}
           <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-4">
            {formData.title && (
             <h4 className="text-yellow-400 font-bold text-lg line-clamp-2">
              {formData.title.toUpperCase()}
             </h4>
            )}
           </div>
          </div>
         </div>
        </div>
       </div>
      )}
     </div>

     {/* Right Column - Form */}
     <div>
      <form onSubmit={handlePublish} className="space-y-6">
       {/* Submit Error */}
       {errors.submit && (
        <div className="bg-red-950/50 border border-red-700 text-red-400 px-4 py-3 rounded-lg text-sm">
         {errors.submit}
        </div>
       )}

       {/* Title Field */}
       <div>
        <label htmlFor="title" className="block text-white font-semibold mb-2">
         Title <span className="text-red-500">*</span>
        </label>
        <input
         type="text"
         id="title"
         name="title"
         value={formData.title}
         onChange={handleInputChange}
         placeholder="Enter card title"
         disabled={isLoading}
         maxLength={100}
         className={`w-full px-4 py-3 bg-slate-900 border-2 rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all ${
          errors.title
           ? 'border-red-500 focus:border-red-500'
           : 'border-yellow-600/30 focus:border-yellow-500'
         }`}
        />
        <div className="flex items-center justify-between mt-2">
         {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
         <p
          className={`text-sm ml-auto ${formData.title.length > 90 ? 'text-yellow-500' : 'text-gray-500'}`}>
          {formData.title.length} / 100
         </p>
        </div>
       </div>

       {/* Description Field */}
       <div>
        <label htmlFor="description" className="block text-white font-semibold mb-2">
         Description <span className="text-red-500">*</span>
        </label>
        <textarea
         id="description"
         name="description"
         value={formData.description}
         onChange={handleInputChange}
         placeholder="Describe your card..."
         disabled={isLoading}
         maxLength={500}
         rows={6}
         className={`w-full px-4 py-3 bg-slate-900 border-2 rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all resize-none ${
          errors.description
           ? 'border-red-500 focus:border-red-500'
           : 'border-yellow-600/30 focus:border-yellow-500'
         }`}
        />
        <div className="flex items-center justify-between mt-2">
         {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
         <p
          className={`text-sm ml-auto ${formData.description.length > 450 ? 'text-yellow-500' : 'text-gray-500'}`}>
          {formData.description.length} / 500
         </p>
        </div>
       </div>

       {/* Price Field */}
       <div>
        <label htmlFor="price" className="block text-white font-semibold mb-2">
         Price USD <span className="text-red-500">*</span>
        </label>
        <div className="relative">
         <span className="absolute left-4 top-3 text-gray-400 font-semibold text-lg">$</span>
         <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          placeholder="0.00"
          disabled={isLoading}
          step="0.01"
          min="0"
          max="999999"
          className={`w-full pl-8 pr-4 py-3 bg-slate-900 border-2 rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all ${
           errors.price
            ? 'border-red-500 focus:border-red-500'
            : 'border-yellow-600/30 focus:border-yellow-500'
          }`}
         />
        </div>
        {errors.price && <p className="text-red-500 text-sm mt-2">{errors.price}</p>}
       </div>

       {/* Action Buttons */}
       <div className="flex gap-3 pt-6">
        <button
         type="submit"
         disabled={isLoading}
         className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 disabled:from-yellow-700 disabled:to-yellow-600 text-slate-900 font-bold rounded-lg transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed">
         {isLoading ? (
          <>
            {/* TOOD: add reusable spinning/loading circle component */}
           Publishing...
          </>
         ) : (
          <div>
           Publish Card
          </div>
         )}
        </button>
       </div>
      </form>
     </div>
    </div>
   </div>
  </div>
 )
}
