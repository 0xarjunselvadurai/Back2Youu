import { useState } from 'react';
import { useRouter } from 'next/router';
import QRCode from 'qrcode.react';

const QRScanner = () => {
  const [qrData, setQrData] = useState('');
  const router = useRouter();

  const handleScan = (data) => {
    if (data) {
      setQrData(data);
      const tagNumber = data.split('/').pop(); // Assuming the QR code contains the URL
      fetch(`/api/tags/${tagNumber}`)
        .then(response => response.json())
        .then(tag => {
          if (tag.tag_activate) {
            router.push(`/return/${tagNumber}`);
          } else {
            router.push('/activate');
          }
        })
        .catch(error => {
          console.error('Error fetching tag data:', error);
        });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Scan QR Code</h1>
      <QRCode value="back2you/scan" size={256} />
      <input
        type="text"
        value={qrData}
        onChange={(e) => setQrData(e.target.value)}
        placeholder="Scan or enter QR code data"
        className="mt-4 p-2 border border-gray-300 rounded"
      />
      <button
        onClick={() => handleScan(qrData)}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Process QR Code
      </button>
    </div>
  );
};

export default QRScanner;