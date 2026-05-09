export default function validateCardForm(formData, imagePreview, requireImage = false) {
  const errors = {}

  if (!formData.title.trim()) errors.title = 'Title is required'
  else if (formData.title.length < 3) errors.title = 'Title must be at least 3 characters'
  else if (formData.title.length > 100) errors.title = 'Title must be less than 100 characters'

  if (!formData.description.trim()) errors.description = 'Description is required'
  else if (formData.description.length < 10) errors.description = 'Description must be at least 10 characters'
  else if (formData.description.length > 500) errors.description = 'Description must be less than 500 characters'

  if (!formData.price) errors.price = 'Price is required'
  else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) errors.price = 'Please enter a valid price'
  else if (parseFloat(formData.price) > 999999) errors.price = 'Price is too high'

  if (requireImage && !imagePreview) errors.image = 'Card image is required'

  return errors
}