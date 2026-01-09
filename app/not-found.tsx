import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <h2 className="text-4xl font-bold mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-8">Could not find requested resource</p>
      <Link 
        href="/"
        className="px-6 py-3 bg-bn-red text-white rounded hover:bg-red-700 transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
