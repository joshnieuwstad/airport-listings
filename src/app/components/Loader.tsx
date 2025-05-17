export default function Loader() {
    return (
        <div className="flex flex-col items-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-ts-green border-t-transparent"></div>
            <span className="mt-2 text-sm text-gray-500">Loading flights...</span>
        </div>
    )
}