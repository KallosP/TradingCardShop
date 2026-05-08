import LoadingIcon from './LoadingIcon'
export default function LoadingState({ loadingMsg }) {
    return (
     <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-4">
        <LoadingIcon />
        <p className="text-gray-400">{loadingMsg}</p>
      </div>
     </div>
    )
}