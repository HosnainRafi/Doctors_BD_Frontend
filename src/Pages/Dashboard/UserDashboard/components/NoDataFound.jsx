import { MdSearchOff } from 'react-icons/md';

export default function NoDataFound({ message = 'No data found.' }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 rounded-xl bg-purple-50 text-center">
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 mb-6">
        <MdSearchOff className="text-purple-700 text-5xl" />
      </div>
      <h2 className="text-xl md:text-2xl font-semibold text-purple-800 mb-2">
        {message}
      </h2>
      <p className="text-sm md:text-base text-purple-600 mb-6 max-w-md">
        We couldn’t find any matching data at the moment. Try refreshing the
        page or check again later.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-5 py-2 rounded-full bg-purple-700 text-white hover:bg-purple-800 transition"
      >
        Refresh
      </button>
    </div>
  );
}
