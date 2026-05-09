import { useState } from 'react'
import backendURL from '../constants/url-constants'
import SubmitButton from './SubmitButton'
import ImageUpload from './ImageUpload'
import validateCardForm from '../utils/validateCardForm'
import Modal from './Modal'
import ErrorBanner from './ErrorBanner'

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-3 sm:p-4">
      {/* Wrapper */}
      <Modal onClose={onClose} closeDisabled={isSaving} maxWidth="max-w-3xl">
        <form onSubmit={handleSubmit} className="relative p-4 pt-12 sm:p-8 sm:pt-8 space-y-5">

          {/* Image */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-yellow-500 mb-3">
              Card Image
            </label>
            <ImageUpload
              imagePreview={imagePreview}
              onImageChange={handleImageChange}
              onRemove={() => { setImagePreview(null); setImageFile(null) }}
              isLoading={isSaving}
              error={errors.image}
            />
          </div>

          {/* Title */}
          <div className="rounded-xl border border-yellow-500/10 bg-slate-900/70 p-5">
            <label className="block text-xs font-bold uppercase tracking-wider text-yellow-500 mb-3">
              Title
            </label>
            <input
              type="text" name="title" value={formData.title}
              onChange={handleInputChange} disabled={isSaving}
              className="w-full bg-slate-800/80 border border-yellow-500/20 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none transition-colors disabled:opacity-50"
            />
            {errors.title && <p className="text-red-500 text-xs mt-2">{errors.title}</p>}
            <p className="text-gray-500 text-xs mt-2">{formData.title.length}/100</p>
          </div>

          {/* Description */}
          <div className="rounded-xl border border-yellow-500/10 bg-slate-900/70 p-5">
            <label className="block text-xs font-bold uppercase tracking-wider text-yellow-500 mb-3">
              Description
            </label>
            <textarea
              name="description" value={formData.description}
              onChange={handleInputChange} disabled={isSaving} rows="4"
              className="w-full bg-slate-800/80 border border-yellow-500/20 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none transition-colors disabled:opacity-50 resize-none"
            />
            {errors.description && <p className="text-red-500 text-xs mt-2">{errors.description}</p>}
            <p className="text-gray-500 text-xs mt-2">{formData.description.length}/500</p>
          </div>

          {/* Price */}
          <div className="rounded-xl border border-yellow-500/10 bg-slate-900/70 p-5">
            <label className="block text-xs font-bold uppercase tracking-wider text-yellow-500 mb-3">
              Price (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-400 text-sm font-semibold">$</span>
              <input
                type="number" name="price" value={formData.price}
                onChange={handleInputChange} disabled={isSaving}
                placeholder="0.00" step="0.01" min="0"
                className="w-full bg-slate-800/80 border border-yellow-500/20 rounded-lg pl-6 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none transition-colors disabled:opacity-50"
              />
            </div>
            {errors.price && <p className="text-red-500 text-xs mt-2">{errors.price}</p>}
          </div>

          <ErrorBanner message={errors.submit} />

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <SubmitButton isLoading={isSaving} fullWidth={false} loadingLabel="Saving..." label="Save Changes" />
            <button
              type="button" onClick={onClose} disabled={isSaving}
              className="flex-1 bg-slate-800/80 hover:bg-slate-700 disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded-lg border border-yellow-500/10 transition-colors disabled:cursor-not-allowed text-sm sm:text-base">
              Cancel
            </button>
          </div>
        </form>
      </Modal>
  </div>
  )
}