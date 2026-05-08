
export default function HeaderSection({ title, description }) {
 return (
  <div className="border-b border-yellow-600/20 py-8 sm:py-12">
   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">{title}</h1>
    <p className="text-gray-400 text-base sm:text-lg">{description}</p>
   </div>
  </div>
 )
}