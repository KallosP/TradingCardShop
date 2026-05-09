export default function ErrorBanner({ message }) {
  if (!message) return null
  return (
    <div className="bg-red-600/20 border border-red-600/40 rounded-xl p-4">
      <p className="text-red-400 text-xs">{message}</p>
    </div>
  )
}