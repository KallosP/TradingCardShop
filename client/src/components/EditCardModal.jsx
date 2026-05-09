import { useState } from 'react'
import backendURL from '../constants/url-constants'
import SubmitButton from './SubmitButton'
import ImageUpload from './ImageUpload'
import validateCardForm from '../utils/validateCardForm'

export default function EditCardModal({ editingCard, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: editingCard.title,
    description: editingCard.description,
    price: editingCard.price.toString()
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState({})

  const token = localStorage.getItem('token')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result)
      reader.readAsDataURL(file)
      setImageFile(file)
    }
  }

  const validate = () => {
    const newErrors = validateCardForm(formData, imagePreview, false)
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsSaving(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('price', formData.price)
      if (imageFile) formDataToSend.append('image', imageFile)

      const response = await fetch(`${backendURL}/cards/${editingCard._id}`, {
        headers: { Authorization: `Bearer ${token}` },
        method: 'PUT',
        body: formDataToSend
      })

      if (!response.ok) throw new Error('Failed to update card')

      const updatedCard = await response.json()
      onSave(updatedCard)
      onClose()
    } catch (error) {
      console.error('Error updating card:', error)
      setErrors({ submit: 'Failed to save changes. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-slate-900 border border-yellow-600/30 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-yellow-600/20 px-4 sm:px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-white">Edit Card</h2>
          <button onClick={onClose} disabled={isSaving} className="text-gray-400 hover:text-white disabled:opacity-50 transition-colors">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
          <label className="block text-sm font-semibold text-gray-300 mb-3">Card Image <span className="text-red-500">*</span></label>
          <ImageUpload
            imagePreview={imagePreview}
            onImageChange={handleImageChange}
            onRemove={() => { setImagePreview(null); setImageFile(null) }}
            isLoading={isSaving}
            error={errors.image}
          />
            
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Title <span className="text-red-500">*</span></label>
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} disabled={isSaving}
              className="w-full bg-slate-800 border border-yellow-600/30 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none transition-colors disabled:opacity-50" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            <p className="text-gray-500 text-xs mt-1">{formData.title.length}/100</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Description <span className="text-red-500">*</span></label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} disabled={isSaving} rows="4"
              className="w-full bg-slate-800 border border-yellow-600/30 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none transition-colors disabled:opacity-50 resize-none" />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            <p className="text-gray-500 text-xs mt-1">{formData.description.length}/500</p>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Price (USD) <span className="text-red-500">*</span></label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-400 text-sm font-semibold">$</span>
              <input type="number" name="price" value={formData.price} onChange={handleInputChange} disabled={isSaving}
                placeholder="0.00" step="0.01" min="0"
                className="w-full bg-slate-800 border border-yellow-600/30 rounded-lg pl-6 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none transition-colors disabled:opacity-50" />
            </div>
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </div>

          {/* Submit error */}
          {errors.submit && (
            <div className="bg-red-600/20 border border-red-600/40 rounded-lg p-3">
              <p className="text-red-400 text-xs">{errors.submit}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <SubmitButton isLoading={isSaving} fullWidth={false} loadingLabel="Saving..." label="Save Changes" />
            <button type="button" onClick={onClose} disabled={isSaving}
              className="flex-1 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-800/50 text-white font-bold py-2.5 px-4 rounded-lg transition-colors disabled:cursor-not-allowed text-sm sm:text-base">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}