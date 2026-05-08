export default function SubmitButton({ isLoading, loadingLabel, label, fullWidth = true }) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className={`${fullWidth ? 'w-full' : 'flex-1'} flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 disabled:from-yellow-700 disabled:to-yellow-600 text-slate-900 font-bold rounded-lg transition-all disabled:cursor-not-allowed`}
    >
      {isLoading ? loadingLabel : label}
    </button>
  )
}