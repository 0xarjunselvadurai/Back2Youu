import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function ActivatePage() {
  const [tagNumber, setTagNumber] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleActivate = async (e) => {
    e.preventDefault();
    setError('');

    // Simulate an API call to activate the tag
    const response = await fetch('/api/tags/activate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tag_number: tagNumber }),
    });

    if (response.ok) {
      router.push(`/return/${tagNumber}`);
    } else {
      setError('Failed to activate tag. Please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Activate Your Tag</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleActivate}>
          <div className="mb-4">
            <label htmlFor="tagNumber" className="block text-gray-700 mb-2">Tag Number</label>
            <input
              type="text"
              id="tagNumber"
              value={tagNumber}
              onChange={(e) => setTagNumber(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-800 transition"
          >
            Activate Tag
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account? <Link href="/auth/signin" className="text-blue-500">Sign In</Link>
        </p>
      </div>
    </main>
  );
}