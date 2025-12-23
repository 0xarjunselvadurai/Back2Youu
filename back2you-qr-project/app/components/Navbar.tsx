import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">
          Back2You
        </div>
        <div className="space-x-4">
          <Link href="/" className="text-gray-300 hover:text-white">Home</Link>
          <Link href="/shop" className="text-gray-300 hover:text-white">Shop</Link>
          <Link href="/about" className="text-gray-300 hover:text-white">About</Link>
          <Link href="/news-feed" className="text-gray-300 hover:text-white">Blog</Link>
          <Link href="/auth/signin" className="text-gray-300 hover:text-white">Sign In</Link>
        </div>
      </div>
    </nav>
  );
}