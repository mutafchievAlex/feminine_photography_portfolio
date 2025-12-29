import React, { useState, useEffect } from 'react';
import { albumService } from '../../../services/albumService';

export default function AlbumTemplateModal({ onClose, onSelect }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [heroExists, setHeroExists] = useState(false);
  const [customData, setCustomData] = useState({
    title: '',
    clientName: '',
    sessionDate: new Date()?.toISOString()?.split('T')?.[0],
    location: '',
    description: ''
  });

  useEffect(() => {
    loadTemplates();
    checkHeroAlbum();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await albumService?.getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkHeroAlbum = async () => {
    try {
      const hero = await albumService?.getHeroAlbum();
      setHeroExists(!!hero);
    } catch (error) {
      console.error('Failed to check hero album:', error);
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setCustomData(prev => ({
      ...prev,
      title: template?.name,
      description: template?.description
    }));
  };

  const handleCreate = async () => {
    if (!selectedTemplate) {
      alert('Please select a template');
      return;
    }

    if (selectedTemplate?.id === 'hero-carousel') {
      // Hero template doesn't require client name
      if (!customData?.title) {
        alert('Please fill in the album title');
        return;
      }
      if (heroExists) {
        alert('A Hero album already exists. You can only have one Hero Carousel album. Please delete the existing one first.');
        return;
      }
    } else {
      // Other templates require both title and client name
      if (!customData?.title || !customData?.clientName) {
        alert('Please fill in required fields');
        return;
      }
    }

    try {
      await onSelect(selectedTemplate?.id, customData);
      onClose();
    } catch (error) {
      alert('Failed to create album: ' + error?.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Choose Album Template</h2>
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
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading templates...</p>
            </div>
          ) : (
            <>
              {/* Template Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {templates?.map((template) => (
                  <div
                    key={template?.id}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      template?.id === 'hero-carousel' && heroExists
                        ? 'border-gray-300 bg-gray-50 cursor-not-allowed opacity-60'
                        : 'cursor-pointer'
                    } ${
                      selectedTemplate?.id === template?.id
                        ? 'border-indigo-500 bg-indigo-50' :'border-gray-200 hover:border-indigo-300'
                    }`}
                    onClick={() => {
                      if (template?.id === 'hero-carousel' && heroExists) return;
                      handleTemplateSelect(template);
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900">{template?.name}</h3>
                        {template?.isSpecial && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
                            Special
                          </span>
                        )}
                      </div>
                      {selectedTemplate?.id === template?.id && (
                        <svg className="w-6 h-6 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{template?.description}</p>
                    {template?.warning && (
                      <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                        ⚠️ {template?.warning}
                      </div>
                    )}
                    {template?.id === 'hero-carousel' && heroExists && (
                      <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800">
                        ✓ Hero Carousel already exists
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="px-2 py-1 bg-gray-100 rounded">{template?.sessionType}</span>
                      <span>{template?.photoCount} photos capacity</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Custom Data Form */}
              {selectedTemplate && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Customize Your Album</h3>
                  <div className="space-y-4">
                    {selectedTemplate?.id === 'hero-carousel' ? (
                      // Hero template - simplified form
                      <div>
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                          <p className="text-sm text-blue-800">
                            <strong>ℹ️ Hero Carousel Setup:</strong> This special album will automatically appear on your homepage hero section. All photos will be published automatically and displayed in a rotating carousel.
                          </p>
                        </div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Album Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={customData?.title}
                          disabled
                          placeholder="Hero"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                        />
                        <p className="text-xs text-gray-500 mt-2">The title will automatically be set to "Hero"</p>
                      </div>
                    ) : (
                      // Other templates - full form
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Album Title <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={customData?.title}
                              onChange={(e) => setCustomData(prev => ({ ...prev, title: e?.target?.value }))}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Client Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={customData?.clientName}
                              onChange={(e) => setCustomData(prev => ({ ...prev, clientName: e?.target?.value }))}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Session Date
                            </label>
                            <input
                              type="date"
                              value={customData?.sessionDate}
                              onChange={(e) => setCustomData(prev => ({ ...prev, sessionDate: e?.target?.value }))}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Location
                            </label>
                            <input
                              type="text"
                              value={customData?.location}
                              onChange={(e) => setCustomData(prev => ({ ...prev, location: e?.target?.value }))}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                          </label>
                          <textarea
                            value={customData?.description}
                            onChange={(e) => setCustomData(prev => ({ ...prev, description: e?.target?.value }))}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={
              !selectedTemplate || 
              !customData?.title || 
              (selectedTemplate?.id !== 'hero-carousel' && !customData?.clientName) ||
              (selectedTemplate?.id === 'hero-carousel' && heroExists)
            }
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Create Album from Template
          </button>
        </div>
      </div>
    </div>
  );
}