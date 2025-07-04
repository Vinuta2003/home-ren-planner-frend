import { Search } from "lucide-react";

export default function PageNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 px-4">
      <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center max-w-md w-full border border-blue-100">
        <div className="bg-blue-100 rounded-full p-4 mb-4">
          <Search className="text-blue-600" size={40} />
        </div>
        <h1 className="text-3xl font-bold text-blue-900 mb-2 text-center">404 - Page Not Found</h1>
        <p className="text-gray-600 mb-6 text-center">
          Sorry, the page you are looking for does not exist.<br />
          It might have been moved or deleted.
        </p>
        <a
          href="/"
          className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition"
        >
          Go to Home
        </a>
      </div>
    </div>
  );
} 