import React from 'react';
import Icon from '../../../components/AppIcon';

export default function ManagePhotosModal({ album, photos, loading, onClose, onAddPhotos, onReorder, onDeletePhoto }) {
  if (!album) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Album</p>
            <h2 className="text-2xl font-bold text-gray-900 mt-1">{album?.title || 'Album'}</h2>
            <p className="text-sm text-gray-500 mt-1">ID: {album?.id}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onReorder}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Icon name="GripVertical" size={18} />
              <span>Подреди снимки</span>
            </button>
            <button
              onClick={onAddPhotos}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Icon name="Plus" size={18} />
              <span>Добави снимки</span>
            </button>
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

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-gray-600">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600" />
                <span>Зареждаме снимките...</span>
              </div>
            </div>
          ) : photos?.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-300 rounded-lg p-12 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                <Icon name="Image" size={22} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Няма добавени снимки</h3>
              <p className="text-sm text-gray-600 mt-1">Добавете снимки, за да започнете да подреждате албума.</p>
              <button
                onClick={onAddPhotos}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Icon name="Upload" size={18} />
                <span>Качи снимки</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {photos?.map((photo) => (
                <div key={photo?.id} className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                  <img
                    src={photo?.thumbnailUrl || photo?.imageUrl}
                    alt={photo?.altText || photo?.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-3">
                    <p className="text-sm font-semibold text-gray-900 truncate">{photo?.title || 'Без заглавие'}</p>
                    {photo?.caption && (
                      <p className="text-xs text-gray-500 mt-1 overflow-hidden text-ellipsis whitespace-nowrap">{photo?.caption}</p>
                    )}
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button
                      onClick={() => onDeletePhoto(photo?.id)}
                      className="bg-white/90 text-red-600 hover:bg-red-50 rounded-full p-2 shadow"
                    >
                      <Icon name="Trash2" size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 bg-white px-6 py-4 text-sm text-gray-600 flex items-center justify-between">
          <span>{photos?.length || 0} снимки в този албум</span>
          <span className="text-gray-400">Затворете прозореца, когато сте готови</span>
        </div>
      </div>
    </div>
  );
}
