import React, { useState } from 'react';

export default function BulkMetadataEditor({ photos, onSave, onClose }) {
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [bulkCaption, setBulkCaption] = useState('');
  const [bulkIsFeatured, setBulkIsFeatured] = useState(false);

  const handleSelectPhoto = (photoId) => {
    setSelectedPhotos(prev => 
      prev?.includes(photoId) 
        ? prev?.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPhotos?.length === photos?.length) {
      setSelectedPhotos([]);
    } else {
      setSelectedPhotos(photos?.map(p => p?.id));
    }
  };

  const handleApplyBulkEdit = async () => {
    if (selectedPhotos?.length === 0) {
      alert('Please select at least one photo');
      return;
    }

    const updates = selectedPhotos?.map(id => ({
      id,
      caption: bulkCaption,
      isFeatured: bulkIsFeatured
    }));

    try {
      await onSave(updates);
      onClose();
    } catch (error) {
      alert('Failed to update photos: ' + error?.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Bulk Metadata Editor</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Bulk Edit Controls */}
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Apply to Selected Photos</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Caption
                </label>
                <input
                  type="text"
                  value={bulkCaption}
                  onChange={(e) => setBulkCaption(e?.target?.value)}
                  placeholder="Enter caption for selected photos..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="bulkFeatured"
                  checked={bulkIsFeatured}
                  onChange={(e) => setBulkIsFeatured(e?.target?.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="bulkFeatured" className="ml-2 text-sm text-gray-700">
                  Mark as featured
                </label>
              </div>
            </div>
          </div>

          {/* Photo Selection */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleSelectAll}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                {selectedPhotos?.length === photos?.length ? 'Deselect All' : 'Select All'}
              </button>
              <span className="text-sm text-gray-600">
                {selectedPhotos?.length} of {photos?.length} photos selected
              </span>
            </div>
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {photos?.map((photo) => (
              <div
                key={photo?.id}
                className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                  selectedPhotos?.includes(photo?.id)
                    ? 'border-indigo-500 ring-2 ring-indigo-500' :'border-transparent hover:border-gray-300'
                }`}
                onClick={() => handleSelectPhoto(photo?.id)}
              >
                <img
                  src={photo?.thumbnailUrl || photo?.imageUrl}
                  alt={photo?.altText || photo?.title}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                  {selectedPhotos?.includes(photo?.id) && (
                    <div className="bg-indigo-600 rounded-full p-2">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                  <p className="text-white text-xs truncate">{photo?.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApplyBulkEdit}
            disabled={selectedPhotos?.length === 0}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Apply to {selectedPhotos?.length} Photo{selectedPhotos?.length !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  );
}