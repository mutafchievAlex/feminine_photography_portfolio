import React, { useState, useEffect } from 'react';
import { albumService } from '../../../services/albumService';

export default function AlbumModal({ album, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sessionType: 'wedding',
    clientName: '',
    sessionDate: '',
    location: '',
    isPublished: false
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (album) {
      setFormData({
        title: album?.title || '',
        description: album?.description || '',
        sessionType: album?.sessionType || 'wedding',
        clientName: album?.clientName || '',
        sessionDate: album?.sessionDate || '',
        location: album?.location || '',
        isPublished: album?.isPublished || false
      });
    }
  }, [album]);

  const handleFileSelect = (e) => {
    const files = Array.from(e?.target?.files || []);
    
    if (files?.length === 0) return;

    // Validate file types
    const validFiles = files?.filter(file => {
      const isImage = file?.type?.startsWith('image/');
      if (!isImage) {
        setError(`${file?.name} is not a valid image file`);
      }
      return isImage;
    });

    if (validFiles?.length === 0) return;

    setSelectedFiles(prev => [...prev, ...validFiles]);

    // Create previews
    validFiles?.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreviews(prev => [...prev, {
          file: file,
          preview: reader?.result,
          title: file?.name?.replace(/\.[^/.]+$/, ''),
          altText: '',
          description: '',
          caption: '',
          isFeatured: false
        }]);
      };
      reader?.readAsDataURL(file);
    });

    setError('');
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles(prev => prev?.filter((_, i) => i !== index));
    setFilePreviews(prev => prev?.filter((_, i) => i !== index));
  };

  const handlePhotoMetadataChange = (index, field, value) => {
    setFilePreviews(prev => prev?.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!formData?.title?.trim()) {
      setError('Album title is required');
      return;
    }

    if (!album && selectedFiles?.length === 0) {
      setError('Please add at least one photo to create an album');
      return;
    }

    try {
      setSaving(true);
      setError('');

      let albumId;

      // Create or update album
      if (album) {
        await onSave(formData);
        albumId = album?.id;
      } else {
        const newAlbum = await onSave(formData);
        albumId = newAlbum?.id;
      }

      // Upload photos if any selected
      if (selectedFiles?.length > 0 && albumId) {
        setUploading(true);
        
        for (let i = 0; i < selectedFiles?.length; i++) {
          const file = selectedFiles?.[i];
          const preview = filePreviews?.[i];
          
          const photoData = {
            title: preview?.title || file?.name,
            altText: preview?.altText || `Photo from ${formData?.title}`,
            description: preview?.description || '',
            caption: preview?.caption || '',
            category: formData?.sessionType || 'weddings',
            isFeatured: preview?.isFeatured || false,
            displayOrder: i
          };

          await albumService?.addPhotoToAlbum(albumId, photoData, file);
        }
      }

      onClose();
    } catch (err) {
      setError(err?.message || 'Failed to save album');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-900">
            {album ? 'Edit Album' : 'Create New Album'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={saving || uploading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-800 mr-3"></div>
                <p className="text-sm font-medium">Uploading photos... Please wait.</p>
              </div>
            </div>
          )}

          {/* Album Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Album Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData?.title}
              onChange={handleChange}
              required
              disabled={saving || uploading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="e.g., Sarah & Michael Wedding"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData?.description}
              onChange={handleChange}
              rows={3}
              disabled={saving || uploading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Brief description of the photo session..."
            />
          </div>

          {/* Session Type and Client Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Type
              </label>
              <select
                name="sessionType"
                value={formData?.sessionType}
                onChange={handleChange}
                disabled={saving || uploading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="wedding">Wedding</option>
                <option value="maternity">Maternity</option>
                <option value="family">Family</option>
                <option value="engagement">Engagement</option>
                <option value="individual">Individual</option>
                <option value="corporate">Corporate</option>
                <option value="newborn">Newborn</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Name
              </label>
              <input
                type="text"
                name="clientName"
                value={formData?.clientName}
                onChange={handleChange}
                disabled={saving || uploading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Client or couple names"
              />
            </div>
          </div>

          {/* Session Date and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Date
              </label>
              <input
                type="date"
                name="sessionDate"
                value={formData?.sessionDate}
                onChange={handleChange}
                disabled={saving || uploading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData?.location}
                onChange={handleChange}
                disabled={saving || uploading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Venue or location"
              />
            </div>
          </div>

          {/* Photo Upload Section */}
          {!album && (
            <div className="border-t pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Photos *
              </label>
              <div className="mt-2">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={saving || uploading}
                  />
                </label>
              </div>

              {/* Photo Previews */}
              {filePreviews?.length > 0 && (
                <div className="mt-4 space-y-4 max-h-96 overflow-y-auto">
                  <p className="text-sm font-medium text-gray-700">
                    Selected Photos ({filePreviews?.length})
                  </p>
                  {filePreviews?.map((item, index) => (
                    <div key={index} className="flex gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <img
                        src={item?.preview}
                        alt={item?.title}
                        className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={item?.title}
                          onChange={(e) => handlePhotoMetadataChange(index, 'title', e?.target?.value)}
                          placeholder="Photo title"
                          disabled={saving || uploading}
                          className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100"
                        />
                        <input
                          type="text"
                          value={item?.altText}
                          onChange={(e) => handlePhotoMetadataChange(index, 'altText', e?.target?.value)}
                          placeholder="Alt text (describe the photo)"
                          disabled={saving || uploading}
                          className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={item?.isFeatured}
                            onChange={(e) => handlePhotoMetadataChange(index, 'isFeatured', e?.target?.checked)}
                            disabled={saving || uploading}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          />
                          <label className="text-sm text-gray-600">Set as featured photo</label>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        disabled={saving || uploading}
                        className="text-red-500 hover:text-red-700 disabled:opacity-50"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Published Status */}
          <div className="border-t pt-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isPublished"
                checked={formData?.isPublished}
                onChange={handleChange}
                disabled={saving || uploading}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 disabled:opacity-50"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">
                Publish album (make visible in public gallery)
              </label>
            </div>
            <p className="ml-6 mt-1 text-xs text-gray-500">
              Published albums will appear in the gallery page for visitors to view
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={saving || uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center"
              disabled={saving || uploading}
            >
              {saving || uploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {uploading ? 'Uploading...' : 'Saving...'}
                </>
              ) : (
                album ? 'Update Album' : 'Create Album'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}