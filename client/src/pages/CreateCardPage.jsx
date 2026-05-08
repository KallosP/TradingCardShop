import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import backendURL from "../constants/url-constants";
import HeaderSection from '../components/HeaderSection'
import SubmitButton from '../components/SubmitButton';
import TrashIcon from '../assets/TrashIcon';
import ImageIcon from '../assets/ImageIcon';

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
   <HeaderSection title="Create a Card" description="Design your card and publish it to the marketplace" />

   {/* Main Content */}
   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
     {/* Left Column - Image Upload & Preview */}
     <div className="space-y-8">
      {/* Upload Area */}
      <div>
       <label className="block text-white font-semibold text-lg mb-4">Card Image <span className="text-red-500">*</span></label>
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
            <TrashIcon />
         </button>
        </div>
       ) : (
        <label
         onDragOver={handleDragOver}
         onDragLeave={handleDragLeave}
         onDrop={handleDrop}
         className="block border-2 border-dashed border-yellow-600/40 rounded-lg p-8 text-center cursor-pointer hover:border-yellow-500 hover:bg-yellow-500/5 transition-all duration-200">
          <ImageIcon />
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
          <SubmitButton isLoading={isLoading} loadingLabel="Publishing..." label="Publish Card" />
       </div>
      </form>
     </div>
    </div>
   </div>
  </div>
 )
}
