import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) return;

    setUploading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64File = reader.result;

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: base64File,
          fileName: file.name,
          fileType: file.type,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setImageUrl(data.url);
      } else {
        console.error(data.error);
      }
      setUploading(false);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>
      <h1>Upload Image to S3</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {imageUrl && <img src={imageUrl} alt="Uploaded Image" />}
    </div>
  );
}
