// components/ImageUpload.jsx
import TrashIcon from '../assets/TrashIcon'
import ImageIcon from '../assets/ImageIcon'

export default function ImageUpload({ imagePreview, onImageChange, onRemove, isLoading, error }) {

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
    if (file) onImageChange({ target: { files: [file] } })
  }

  return (
    <div>
      {imagePreview ? (
        <div className="relative">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full aspect-square object-cover rounded-lg border-2 border-yellow-600/80"
          />
          <button
            type="button"
            onClick={onRemove}
            disabled={isLoading}
            className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 disabled:bg-red-500 text-white p-2 rounded-lg transition-colors"
            title="Remove image"
          >
            <TrashIcon />
          </button>
        </div>
      ) : (
        <label
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="block border-2 border-dashed border-yellow-600/40 rounded-lg p-8 text-center cursor-pointer hover:border-yellow-500 hover:bg-yellow-500/5 transition-all duration-200"
        >
          <ImageIcon />
          <p className="text-gray-300 font-medium mb-1">Click or drop an image here</p>
          <p className="text-gray-500 text-sm mb-2">PNG or JPG</p>
          <input
            type="file"
            accept=".png,.jpg,.jpeg"
            onChange={onImageChange}
            disabled={isLoading}
            className="hidden"
          />
        </label>
      )}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  )
}