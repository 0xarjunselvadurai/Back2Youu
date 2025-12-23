'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import TagDetails from '@/app/components/TagDetails';

export default function TagPage() {
  const router = useRouter();
  const { tag_number } = router.query;
  const [tagData, setTagData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (tag_number) {
      fetch(`/api/tags/${tag_number}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch tag data');
          }
          return response.json();
        })
        .then((data) => {
          setTagData(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [tag_number]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!tagData) {
    return <div>No tag data found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tag Details</h1>
      <TagDetails 
        category={tagData.tag_category} 
        description={tagData.tag_description} 
      />
    </div>
  );
}