import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import backendURL from "../constants/url-constants";
import HeaderSection from '../components/HeaderSection'
import SubmitButton from '../components/SubmitButton';
import TrashIcon from '../assets/TrashIcon';
import ImageIcon from '../assets/ImageIcon';
import ImageUpload from '../components/ImageUpload';
import validateCardForm from '../utils/validateCardForm';
import ErrorBanner from '../components/ErrorBanner';

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
  const newErrors = validateCardForm(formData, imagePreview, true)
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4">
     {/* Left Column - Image Upload & Preview */}
      {/* Upload Area */}
      <div className="rounded-xl h-full border border-yellow-500/10 bg-slate-900/70 p-5">
       <label className="block text-white font-semibold text-lg mb-4">Card Image <span className="text-red-500">*</span></label>
       <div className="flex-1">
        <ImageUpload
          imagePreview={imagePreview}
          onImageChange={handleImageChange}
          onRemove={removeImage}
          isLoading={isLoading}
          error={errors.image}
        />

       </div>
      </div>

     {/* Right Column - Form */}
     <div className="rounded-xl border border-yellow-500/10 bg-slate-900/70 p-5">
      <form onSubmit={handlePublish} className="space-y-6">
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
         className={`w-full px-4 py-3 bg-slate-900 border-2 rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors ${
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
         className={`w-full px-4 py-3 bg-slate-900 border-2 rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors resize-none ${
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
          className={`w-full pl-8 pr-4 py-3 bg-slate-900 border-2 rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors ${
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

        <ErrorBanner message={errors.submit} />
      </form>
     </div>
    </div>
   </div>
  </div>
 )
}
