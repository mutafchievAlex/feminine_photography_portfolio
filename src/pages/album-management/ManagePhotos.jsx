import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { albumService } from '../../services/albumService';
import PhotoUploadModal from './components/PhotoUploadModal';
import PhotoReorderModal from './components/PhotoReorderModal';

export default function ManagePhotos() {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [showReorder, setShowReorder] = useState(false);

  useEffect(() => {
    loadAlbum();
  }, [albumId]);

  const loadAlbum = async () => {
    try {
      setLoading(true);
      const data = await albumService.getById(albumId);
      setAlbum(data);
      setPhotos(data?.photos || []);
    } catch (err) {
      alert('Failed to load album: ' + (err?.message || err));
      navigate('/album-management');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhoto = async (albumPhotoId) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;
    try {
      await albumService.removePhotoFromAlbum(albumPhotoId);
      await loadAlbum();
    } catch (err) {
      alert('Failed to delete photo: ' + (err?.message || err));
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Manage Photos — {album?.title}</h1>
            <p className="text-sm text-gray-600">Album ID: {album?.id}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowReorder(true)} className="px-4 py-2 border rounded">Reorder Photos</button>
            <button onClick={() => setShowUpload(true)} className="px-4 py-2 bg-indigo-600 text-white rounded">Add Photos</button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {photos?.map((p) => (
            <div key={p?.id} className="relative rounded overflow-hidden border">
              <img src={p?.thumbnailUrl || p?.imageUrl} alt={p?.altText || p?.title} className="w-full h-36 object-cover" />
              <div className="p-2">
                <p className="text-xs font-medium truncate">{p?.title}</p>
                <p className="text-xs text-gray-500">{p?.caption}</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-2">
                <button onClick={() => handleDeletePhoto(p?.id)} className="bg-white p-1 rounded text-red-600 hover:bg-red-50">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showUpload && (
        <PhotoUploadModal albumId={albumId} onClose={() => { setShowUpload(false); loadAlbum(); }} onUploadComplete={loadAlbum} />
      )}

      {showReorder && (
        <PhotoReorderModal photos={photos} onSave={async (orders) => { await albumService.reorderPhotos(albumId, orders); setShowReorder(false); await loadAlbum(); }} onClose={() => setShowReorder(false)} />
      )}
    </div>
  );
}
