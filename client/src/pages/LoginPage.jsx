import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import backendURL from '../constants/url-constants'

export default function LoginPage() {
 const [isLogin, setIsLogin] = useState(true)
 const [formData, setFormData] = useState({
  email: '',
  password: '',
  confirmPassword: '',
  username: ''
 })
 const [errors, setErrors] = useState({})
 const [isLoading, setIsLoading] = useState(false)
 const navigate = useNavigate()

 const validateEmail = (email) => {
  // Regex for email input validation.
  // follows format: example@domain.com
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
 }

 // Check for/set input errors
 const validateForm = () => {
  const newErrors = {}

  // Add email error to newErrors if found
  if (!formData.email.trim()) {
   newErrors.email = 'Email is required'
  } else if (!validateEmail(formData.email)) {
   newErrors.email = 'Please enter a valid email'
  }

  // Add password error to newErrors if found
  if (!formData.password.trim()) {
   newErrors.password = 'Password is required'
  } else if (formData.password.length < 6) {
   newErrors.password = 'Password must be at least 6 characters'
  }

  // Sign up form
  if (!isLogin) {
   // Add username error to newErrors if found
   if (!formData.username.trim()) {
    newErrors.username = 'Username is required'
   }
   // Add confirmPassword error to newErrors if found
   if (!formData.confirmPassword.trim()) {
    newErrors.confirmPassword = 'Please confirm your password'
   } else if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = 'Passwords do not match'
   }
  }

  setErrors(newErrors)
  // Return True if any new errors found, False otherwise
  return Object.keys(newErrors).length === 0
 }

 // Updates the corresponding form field dynamically based on the input's
 // `name` attribute, while preserving the rest of the form data (...prev).
 // Also clears the error message for that field once the user starts typing again.
 const handleInputChange = (e) => {
  // name,value are built-in properties of the HTML input element e.target
  const { name, value } = e.target
  // update corresponding formData field (e.g. [name] = email, value = userInputString)
  setFormData((prev) => ({
   ...prev,
   [name]: value
  }))
  // Clear error for this field when user starts typing
  if (errors[name]) {
   setErrors((prev) => ({
    ...prev,
    [name]: ''
   }))
  }
 }

 async function submitAuth(creds, endpoint) {
  const response = await fetch(`${backendURL}${endpoint}`, {
   method: 'POST',
   headers: {
    'Content-Type': 'application/json'
   },
   body: JSON.stringify(creds)
  })

  if (!response.ok) {
   const error = new Error('Authentication failed')
   error.status = response.status
   throw error
  }

  const data = await response.json()
  return data
 }

 const handleSubmit = async (e) => {
  // Avoid unwanted reload
  e.preventDefault()

  // Break if any errors are found in input fields of form
  if (!validateForm()) {
   return
  }

  setIsLoading(true)
  setErrors({})

  try {
   const creds = isLogin
    ? { email: formData.email, password: formData.password }
    : {
       username: formData.username,
       email: formData.email,
       password: formData.password
      }

   const endpoint = isLogin ? '/login' : '/signup'
   const payload = await submitAuth(creds, endpoint)

   localStorage.setItem('token', payload.token)
   localStorage.setItem(
    'user',
    JSON.stringify({
     id: payload.userId,
     email: payload.email,
     name: payload.username
    })
   )

   navigate('/marketplace')
  } catch (error) {
   console.log('status', error.status)
   if (error.status === 409) {
    setErrors({ email: 'A user with this email already exists' })
   } else {
    setErrors({
     email: 'Invalid credentials',
     password: 'Invalid credentials'
    })
   }
   console.error(`${isLogin ? 'Login' : 'Signup'} failed:`, error.message)
  } finally {
   setIsLoading(false)
  }
 }

 // Toggles between sign in/create account form
 // and refreshes form data/errors
 const toggleMode = () => {
  setIsLogin(!isLogin)
  setFormData({
   email: '',
   password: '',
   confirmPassword: '',
   username: ''
  })
  setErrors({})
 }

 return (
  <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-8">
   <div className="w-full max-w-md">
    {/* Card Container */}
    <div className="bg-slate-900 border border-yellow-600/20 rounded-2xl p-6 sm:p-8">
     {/* Header */}
     <div className="mb-8 text-center">
      <div className="text-4xl sm:text-5xl font-bold tracking-[0.2em] text-yellow-500 mb-4">
       TCS
      </div>
      <p className="text-gray-400 text-sm">Trading Card Shop</p>
     </div>

     {/* Form */}
     <form onSubmit={handleSubmit} className="space-y-4">
      {/* Username Field - Signup Only */}
      {!isLogin && (
       <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
         Username
        </label>
        <input
         type="text"
         id="username"
         name="username"
         value={formData.username}
         onChange={handleInputChange}
         className={`w-full px-4 py-2.5 rounded-lg border transition-colors focus:outline-none text-white placeholder-gray-500 ${
          errors.username
           ? 'border-red-500/50 bg-slate-800 focus:border-red-500'
           : 'border-yellow-600/30 bg-slate-800 focus:border-yellow-500'
         }`}
         placeholder="Choose a username"
         disabled={isLoading}
        />
        {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
       </div>
      )}

      {/* Email Field */}
      <div>
       <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
        Email Address
       </label>
       <input
        type="email"
        id="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        className={`w-full px-4 py-2.5 rounded-lg border transition-colors focus:outline-none text-white placeholder-gray-500 ${
         errors.email
          ? 'border-red-500/50 bg-slate-800 focus:border-red-500'
          : 'border-yellow-600/30 bg-slate-800 focus:border-yellow-500'
        }`}
        placeholder="you@example.com"
        disabled={isLoading}
       />
       {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      {/* Password Field */}
      <div>
       <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
        Password
       </label>
       <input
        type="password"
        id="password"
        name="password"
        value={formData.password}
        onChange={handleInputChange}
        className={`w-full px-4 py-2.5 rounded-lg border transition-colors focus:outline-none text-white placeholder-gray-500 ${
         errors.password
          ? 'border-red-500/50 bg-slate-800 focus:border-red-500'
          : 'border-yellow-600/30 bg-slate-800 focus:border-yellow-500'
        }`}
        placeholder="••••••••"
        disabled={isLoading}
       />
       {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
      </div>

      {/* Confirm Password - Signup Only */}
      {!isLogin && (
       <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
         Confirm Password
        </label>
        <input
         type="password"
         id="confirmPassword"
         name="confirmPassword"
         value={formData.confirmPassword}
         onChange={handleInputChange}
         className={`w-full px-4 py-2.5 rounded-lg border transition-colors focus:outline-none text-white placeholder-gray-500 ${
          errors.confirmPassword
           ? 'border-red-500/50 bg-slate-800 focus:border-red-500'
           : 'border-yellow-600/30 bg-slate-800 focus:border-yellow-500'
         }`}
         placeholder="••••••••"
         disabled={isLoading}
        />
        {errors.confirmPassword && (
         <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
        )}
       </div>
      )}

      {/* Submit Button */}
      <button
       type="submit"
       disabled={isLoading}
       className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-600/50 text-slate-950 font-bold py-2.5 rounded-lg transition-colors mt-6 disabled:cursor-not-allowed">
       {isLoading ? (
        <span className="flex items-center justify-center">
         <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-950"
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
         Processing...
        </span>
       ) : isLogin ? (
        'Sign In'
       ) : (
        'Create Account'
       )}
      </button>
     </form>

     {/* Divider */}
     <div className="my-6 relative">
      <div className="absolute inset-0 flex items-center">
       <div className="w-full border-t border-yellow-600/20"></div>
      </div>
      <div className="relative flex justify-center text-sm">
       <span className="px-2 bg-slate-900 text-gray-400">
        {isLogin ? 'New here?' : 'Already have an account?'}
       </span>
      </div>
     </div>

     {/* Toggle Button */}
     <button
      type="button"
      onClick={toggleMode}
      disabled={isLoading}
      className="w-full border-2 border-yellow-600/30 hover:border-yellow-500 text-gray-300 hover:text-yellow-400 font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
      {isLogin ? 'Create an account' : 'Sign in instead'}
     </button>
    </div>
   </div>
  </div>
 )
}
