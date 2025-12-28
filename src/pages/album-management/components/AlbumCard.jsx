import React, { useState, useRef } from 'react';
import { AppImage } from '../../../components/AppImage';
import { albumService } from '../../../services/albumService';

export default function AlbumCard({ album, onEdit, onDelete, onManagePhotos, onBulkEdit, onReorder }) {
  const [showMenu, setShowMenu] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const menuRef = useRef(null);

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getSessionTypeLabel = (type) => {
    const labels = {
      wedding: 'Wedding',
      maternity: 'Maternity',
      family: 'Family',
      engagement: 'Engagement',
      individual: 'Individual',
      corporate: 'Corporate',
      newborn: 'Newborn',
      other: 'Other'
    };
    return labels?.[type] || type;
  };

  const coverImage = album?.featuredPhoto?.imageUrl || album?.featuredPhoto?.thumbnailUrl || '/assets/images/no_image.png';

  const handleTogglePublish = async (e) => {
    e?.stopPropagation();
    setPublishing(true);
    try {
      await albumService?.update(album?.id, {
        ...album,
        isPublished: !album?.isPublished
      });
      window.location?.reload();
    } catch (err) {
      alert(`Failed to ${album?.isPublished ? 'unpublish' : 'publish'} album: ${err?.message}`);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-visible">
      {/* Cover Image */}
      <div className="relative h-48 bg-gray-200">
        <AppImage
          src={coverImage}
          alt={album?.title || 'Album cover'}
          className="w-full h-full object-cover"
        />
        {album?.isPublished ? (
          <span className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded">
            Published
          </span>
        ) : (
          <span className="absolute top-2 right-2 px-2 py-1 bg-gray-500 text-white text-xs font-medium rounded">
            Draft
          </span>
        )}
      </div>
      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {album?.title}
        </h3>
        
        {album?.clientName && (
          <p className="text-sm text-gray-600 mb-2">
            Client: {album?.clientName}
          </p>
        )}

        <div className="flex items-center gap-2 mt-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            album?.isPublished 
              ? 'bg-green-100 text-green-800' :'bg-gray-100 text-gray-800'
          }`}>
            {album?.isPublished ? (
              <>
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Published
              </>
            ) : (
              <>
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                Draft
              </>
            )}
          </span>
          <span className="text-xs text-gray-500">
            {album?.photoCount || 0} photos
          </span>
        </div>

        {album?.sessionDate && (
          <p className="text-xs text-gray-500 mb-3">
            {formatDate(album?.sessionDate)}
          </p>
        )}

        {album?.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {album?.description}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={(e) => {
              e?.stopPropagation();
              onManagePhotos?.();
            }}
            className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Photos
          </button>

          <button
            onClick={handleTogglePublish}
            disabled={publishing}
            className={`flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors disabled:opacity-50 ${
              album?.isPublished
                ? 'border border-orange-300 text-orange-700 bg-white hover:bg-orange-50' :'border border-green-300 text-green-700 bg-white hover:bg-green-50'
            }`}
          >
            {publishing ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            ) : (
              <>
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {album?.isPublished ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  )}
                </svg>
                {album?.isPublished ? 'Unpublish' : 'Publish'}
              </>
            )}
          </button>

          <button
            onClick={onBulkEdit}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            title="Bulk Edit Metadata"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          <button
            onClick={onReorder}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            title="Reorder Photos"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onEdit();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Edit Album
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onDelete();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete Album
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}