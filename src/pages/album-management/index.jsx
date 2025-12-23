import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { albumService } from '../../services/albumService';
import AlbumCard from './components/AlbumCard';
import AlbumModal from './components/AlbumModal';
import PhotoUploadModal from './components/PhotoUploadModal';
import BulkMetadataEditor from './components/BulkMetadataEditor';
import AlbumTemplateModal from './components/AlbumTemplateModal';
import PhotoReorderModal from './components/PhotoReorderModal';
import { Helmet } from 'react-helmet';

export default function AlbumManagement() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showBulkEditor, setShowBulkEditor] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [albumPhotos, setAlbumPhotos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadAlbums();
  }, []);

  const loadAlbums = async () => {
    try {
      setLoading(true);
      const data = await albumService?.getAll();
      setAlbums(data);
      setError('');
    } catch (err) {
      setError(err?.message || 'Failed to load albums');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlbum = () => {
    setSelectedAlbum(null);
    setShowAlbumModal(true);
  };

  const handleEditAlbum = (album) => {
    setSelectedAlbum(album);
    setShowAlbumModal(true);
  };

  const handleDeleteAlbum = async (albumId) => {
    if (!window.confirm('Are you sure you want to delete this album?')) return;

    try {
      await albumService?.delete(albumId);
      await loadAlbums();
    } catch (err) {
      setError(err?.message || 'Failed to delete album');
    }
  };

  const handleSaveAlbum = async (albumData) => {
    try {
      let result;
      if (selectedAlbum) {
        await albumService?.update(selectedAlbum?.id, albumData);
      } else {
        result = await albumService?.create(albumData);
      }
      setShowAlbumModal(false);
      await loadAlbums();
      return result;
    } catch (err) {
      throw err;
    }
  };

  const handleManagePhotos = (album) => {
    navigate(`/admin/albums/${album?.id}/photos`);
  };

  const handleBulkEdit = async (album) => {
    try {
      const albumData = await albumService?.getById(album?.id);
      setSelectedAlbum(album);
      setAlbumPhotos(albumData?.photos || []);
      setShowBulkEditor(true);
    } catch (err) {
      setError(err?.message || 'Failed to load album photos');
    }
  };

  const handleSaveBulkMetadata = async (updates) => {
    try {
      await albumService?.bulkUpdatePhotoMetadata(updates);
      setShowBulkEditor(false);
      await loadAlbums();
    } catch (err) {
      throw err;
    }
  };

  const handleCreateFromTemplate = () => {
    setShowTemplateModal(true);
  };

  const handleSelectTemplate = async (templateId, customData) => {
    try {
      await albumService?.createFromTemplate(templateId, customData);
      setShowTemplateModal(false);
      await loadAlbums();
    } catch (err) {
      throw err;
    }
  };

  const handleReorderPhotos = async (album) => {
    try {
      const albumData = await albumService?.getById(album?.id);
      setSelectedAlbum(album);
      setAlbumPhotos(albumData?.photos || []);
      setShowReorderModal(true);
    } catch (err) {
      setError(err?.message || 'Failed to load album photos');
    }
  };

  const handleSavePhotoOrder = async (photoOrders) => {
    try {
      await albumService?.reorderPhotos(selectedAlbum?.id, photoOrders);
      setShowReorderModal(false);
      await loadAlbums();
    } catch (err) {
      throw err;
    }
  };

  const filteredAlbums = albums?.filter(album => {
    const matchesSearch = album?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                          album?.clientName?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesFilter = filterType === 'all' || album?.sessionType === filterType;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading albums...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Album Management | Elena Rose Photography</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Album Management</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Create and organize photography albums with metadata and photos
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleCreateFromTemplate}
                  className="inline-flex items-center px-4 py-2 border border-indigo-600 text-base font-medium rounded-lg text-indigo-600 bg-white hover:bg-indigo-50 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                  Use Template
                </button>
                <button
                  onClick={handleCreateAlbum}
                  className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create New Album
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Albums
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e?.target?.value)}
                  placeholder="Search by title or client name..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Session Type
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e?.target?.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
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
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
              <p className="font-medium">Error</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          {/* Albums Grid */}
          {filteredAlbums?.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No albums found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterType !== 'all' ?'Try adjusting your search or filter criteria' :'Get started by creating your first album'}
              </p>
              {!searchTerm && filterType === 'all' && (
                <div className="mt-6 flex justify-center gap-3">
                  <button
                    onClick={handleCreateFromTemplate}
                    className="inline-flex items-center px-4 py-2 border border-indigo-600 text-sm font-medium rounded-md text-indigo-600 hover:bg-indigo-50"
                  >
                    Use Template
                  </button>
                  <button
                    onClick={handleCreateAlbum}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Create Album
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAlbums?.map((album) => (
                <AlbumCard
                  key={album?.id}
                  album={album}
                  onEdit={() => handleEditAlbum(album)}
                  onDelete={() => handleDeleteAlbum(album?.id)}
                  onManagePhotos={() => handleManagePhotos(album)}
                  onBulkEdit={() => handleBulkEdit(album)}
                  onReorder={() => handleReorderPhotos(album)}
                />
              ))}
            </div>
          )}

          {/* Album Count */}
          <div className="mt-6 text-center text-sm text-gray-500">
            Showing {filteredAlbums?.length} of {albums?.length} albums
          </div>
        </div>

        {/* Modals */}
        {showAlbumModal && (
          <AlbumModal
            album={selectedAlbum}
            onClose={() => setShowAlbumModal(false)}
            onSave={handleSaveAlbum}
          />
        )}

        {showPhotoModal && (
          <PhotoUploadModal
            albumId={selectedAlbum?.id}
            onClose={() => setShowPhotoModal(false)}
            onUploadComplete={loadAlbums}
          />
        )}

        {showBulkEditor && (
          <BulkMetadataEditor
            photos={albumPhotos}
            onSave={handleSaveBulkMetadata}
            onClose={() => setShowBulkEditor(false)}
          />
        )}

        {showTemplateModal && (
          <AlbumTemplateModal
            onSelect={handleSelectTemplate}
            onClose={() => setShowTemplateModal(false)}
          />
        )}

        {showReorderModal && (
          <PhotoReorderModal
            photos={albumPhotos}
            onSave={handleSavePhotoOrder}
            onClose={() => setShowReorderModal(false)}
          />
        )}
      </div>
    </>
  );
}