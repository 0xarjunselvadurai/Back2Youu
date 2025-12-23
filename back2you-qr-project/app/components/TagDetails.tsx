import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const TagDetails = () => {
  const router = useRouter();
  const { tag_number } = router.query;
  const [tagDetails, setTagDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tag_number) {
      fetch(`/api/tags/${tag_number}`)
        .then((response) => response.json())
        .then((data) => {
          setTagDetails(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching tag details:', error);
          setLoading(false);
        });
    }
  }, [tag_number]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!tagDetails) {
    return <div>No tag details found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-2">{tagDetails.tag_category}</h2>
      <p className="text-gray-700">{tagDetails.tag_description}</p>
    </div>
  );
};

export default TagDetails;