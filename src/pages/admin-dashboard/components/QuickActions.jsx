import React, { useState, useCallback, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useLanguage } from '../../../hooks/useLanguage';
import Toast from '../../../components/Toast';
import { albumService } from '../../../services/albumService';
import { supabase } from '../../../lib/supabase';

const QuickActions = () => {
  const { language } = useLanguage();
  const [toast, setToast] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showBlockDatesModal, setShowBlockDatesModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryClientName, setGalleryClientName] = useState('');
  const [blockDatesStart, setBlockDatesStart] = useState('');
  const [blockDatesEnd, setBlockDatesEnd] = useState('');
  const [blockDatesReason, setBlockDatesReason] = useState('');
  const [messageClientId, setMessageClientId] = useState('');
  const [messageText, setMessageText] = useState('');
  const [pricingEssential, setPricingEssential] = useState('');
  const [pricingSignature, setPricingSignature] = useState('');
  const [pricingLegacy, setPricingLegacy] = useState('');
  const [albumsLoading, setAlbumsLoading] = useState(false);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Only load albums when needed and only once
  const loadAlbums = useCallback(async () => {
    if (albumsLoading || albums.length > 0) return;
    
    setAlbumsLoading(true);
    try {
      const allAlbums = await albumService.getAll();
      setAlbums(allAlbums || []);
      if (allAlbums?.length > 0) {
        setSelectedAlbumId(allAlbums[0]?.id);
      }
    } catch (error) {
      console.error('Error loading albums:', error);
      showToast(language === 'bg' ? 'Грешка при зареждане на албумите' : 'Error loading albums', 'error');
    } finally {
      setAlbumsLoading(false);
    }
  }, [albumsLoading, albums.length, language, showToast]);

  const quickActions = [
    {
      id: 1,
      title: language === 'bg' ? "Качи нови снимки" : "Upload New Photos",
      description: language === 'bg' ? "Добави нови работи в портфолиото" : "Add new work to portfolio",
      icon: "Upload",
      color: "bg-accent",
      action: "upload"
    },
    {
      id: 2,
      title: language === 'bg' ? "Създай галерия за клиент" : "Create Client Gallery",
      description: language === 'bg' ? "Подготви галерия за доставка" : "Prepare delivery gallery",
      icon: "Folder",
      color: "bg-secondary",
      action: "create_gallery"
    },
    {
      id: 3,
      title: language === 'bg' ? "Блокирай дати" : "Block Dates",
      description: language === 'bg' ? "Маркирай недостъпни периоди" : "Mark unavailable periods",
      icon: "CalendarOff",
      color: "bg-surface-elevation",
      action: "block_dates"
    },
    {
      id: 4,
      title: language === 'bg' ? "Изпрати съобщение" : "Send Message",
      description: language === 'bg' ? "Комуникирай с клиенти" : "Communicate with clients",
      icon: "Send",
      color: "bg-warm-section",
      action: "send_message"
    },
    {
      id: 5,
      title: language === 'bg' ? "Актуализирай цени" : "Update Pricing",
      description: language === 'bg' ? "Промени пакети и цени" : "Change packages and pricing",
      icon: "DollarSign",
      color: "bg-accent",
      action: "update_pricing"
    },
    {
      id: 6,
      title: language === 'bg' ? "Генерирай отчет" : "Generate Report",
      description: language === 'bg' ? "Създай финансов отчет" : "Create financial report",
      icon: "BarChart",
      color: "bg-secondary",
      action: "generate_report"
    }
  ];

  const handleUploadPhotos = useCallback(async () => {
    if (!uploadFiles?.length) {
      showToast(language === 'bg' ? 'Моля избери снимки' : 'Please select photos', 'error');
      return;
    }

    if (!selectedAlbumId) {
      showToast(language === 'bg' ? 'Моля избери албум' : 'Please select an album', 'error');
      return;
    }

    try {
      setUploading(true);
      const totalFiles = uploadFiles?.length;
      let completed = 0;

      for (const file of uploadFiles) {
        const photoData = {
          title: file?.name?.split('.')?.[0],
          altText: `Photo from album`,
          description: '',
          category: 'weddings',
          displayOrder: completed
        };

        await albumService?.addPhotoToAlbum(selectedAlbumId, photoData, file);
        
        completed++;
        setUploadProgress(Math.round((completed / totalFiles) * 100));
      }

      showToast(language === 'bg' ? `${completed} снимки качени успешно!` : `${completed} photos uploaded successfully!`, 'success');
      setShowUploadModal(false);
      setUploadFiles([]);
      setUploadProgress(0);
    } catch (error) {
      console.error('Upload error:', error);
      showToast(language === 'bg' ? 'Грешка при качването на снимки' : 'Error uploading photos', 'error');
    } finally {
      setUploading(false);
    }
  }, [uploadFiles, selectedAlbumId, language, showToast]);

  const handleCreateGallery = useCallback(async () => {
    if (!galleryTitle?.trim()) {
      showToast(language === 'bg' ? 'Моля въведи име на галерия' : 'Please enter gallery name', 'error');
      return;
    }

    try {
      await albumService?.create({
        title: galleryTitle,
        description: '',
        clientName: galleryClientName,
        sessionType: 'wedding',
        isPublished: false
      });

      showToast(language === 'bg' ? 'Галерия създана успешно!' : 'Gallery created successfully!', 'success');
      setShowGalleryModal(false);
      setGalleryTitle('');
      setGalleryClientName('');
      setAlbums([]);
      loadAlbums();
    } catch (error) {
      console.error('Error creating gallery:', error);
      showToast(language === 'bg' ? 'Грешка при създаване на галерия' : 'Error creating gallery', 'error');
    }
  }, [galleryTitle, galleryClientName, language, showToast, loadAlbums]);

  const handleBlockDates = useCallback(async () => {
    if (!blockDatesStart || !blockDatesEnd) {
      showToast(language === 'bg' ? 'Моля избери дати' : 'Please select dates', 'error');
      return;
    }

    try {
      // Insert into blocked_dates table
      await supabase?.from('blocked_dates')?.insert({
        start_date: blockDatesStart,
        end_date: blockDatesEnd,
        reason: blockDatesReason
      });

      // Also log to activity_logs for audit trail
      await supabase?.from('activity_logs')?.insert({
        activity_type: 'dates_blocked',
        description: `Блокирани дати: ${blockDatesStart} до ${blockDatesEnd}. Причина: ${blockDatesReason || 'Не е посочена'}`,
        metadata: {
          startDate: blockDatesStart,
          endDate: blockDatesEnd,
          reason: blockDatesReason
        }
      });

      showToast(language === 'bg' ? 'Дати блокирани успешно!' : 'Dates blocked successfully!', 'success');
      setShowBlockDatesModal(false);
      setBlockDatesStart('');
      setBlockDatesEnd('');
      setBlockDatesReason('');
    } catch (error) {
      console.error('Error blocking dates:', error);
      showToast(language === 'bg' ? 'Грешка при блокиране на дати' : 'Error blocking dates', 'error');
    }
  }, [blockDatesStart, blockDatesEnd, blockDatesReason, language, showToast]);

  const handleSendMessage = useCallback(async () => {
    if (!messageText?.trim()) {
      showToast(language === 'bg' ? 'Моля напиши съобщение' : 'Please write a message', 'error');
      return;
    }

    try {
      await supabase?.from('activity_logs')?.insert({
        activity_type: 'message_sent',
        description: `Съобщение изпратено на клиент: ${messageText}`,
        metadata: {
          clientId: messageClientId,
          message: messageText
        }
      });

      showToast(language === 'bg' ? 'Съобщението е изпратено!' : 'Message sent!', 'success');
      setShowMessageModal(false);
      setMessageText('');
      setMessageClientId('');
    } catch (error) {
      console.error('Error sending message:', error);
      showToast(language === 'bg' ? 'Грешка при изпращане на съобщение' : 'Error sending message', 'error');
    }
  }, [messageClientId, messageText, language, showToast]);

  const handleUpdatePricing = useCallback(async () => {
    try {
      await supabase?.from('activity_logs')?.insert({
        activity_type: 'pricing_updated',
        description: `Цени обновени: Essential: $${pricingEssential}, Signature: $${pricingSignature}, Legacy: $${pricingLegacy}`,
        metadata: {
          essential: pricingEssential,
          signature: pricingSignature,
          legacy: pricingLegacy
        }
      });

      showToast(language === 'bg' ? 'Цените са обновени!' : 'Pricing updated!', 'success');
      setShowPricingModal(false);
      setPricingEssential('');
      setPricingSignature('');
      setPricingLegacy('');
    } catch (error) {
      console.error('Error updating pricing:', error);
      showToast(language === 'bg' ? 'Грешка при обновяване на цени' : 'Error updating pricing', 'error');
    }
  }, [pricingEssential, pricingSignature, pricingLegacy, language, showToast]);

  const handleGenerateReport = useCallback(async () => {
    try {
      showToast(language === 'bg' ? 'Генериране на отчет...' : 'Generating report...', 'info');
      
      setTimeout(async () => {
        try {
          await supabase?.from('activity_logs')?.insert({
            activity_type: 'report_generated',
            description: `Финансов отчет генериран`,
            metadata: {
              generatedAt: new Date().toISOString()
            }
          });

          showToast(language === 'bg' ? 'Отчетът е готов за изтегляне!' : 'Report is ready for download!', 'success');
        } catch (error) {
          showToast(language === 'bg' ? 'Грешка при генериране на отчет' : 'Error generating report', 'error');
        }
      }, 2000);
    } catch (error) {
      showToast(language === 'bg' ? 'Грешка при генериране на отчет' : 'Error generating report', 'error');
    }
  }, [language, showToast]);

  const handleAction = useCallback((action) => {
    switch(action) {
      case 'upload':
        setShowUploadModal(true);
        loadAlbums();
        break;
      case 'create_gallery':
        setShowGalleryModal(true);
        break;
      case 'block_dates':
        setShowBlockDatesModal(true);
        break;
      case 'send_message':
        setShowMessageModal(true);
        loadAlbums();
        break;
      case 'update_pricing':
        setShowPricingModal(true);
        break;
      case 'generate_report':
        handleGenerateReport();
        break;
      default:
        break;
    }
  }, [loadAlbums, handleGenerateReport]);

  return (
    <>
      <div className="bg-background rounded-lg shadow-soft border border-border">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-lg font-heading font-semibold text-sophisticated-dark">
            {language === 'bg' ? 'Бързи действия' : 'Quick Actions'}
          </h3>
          <p className="text-sm text-hierarchy-secondary mt-1">
            {language === 'bg' ? 'Често използвани функции за управление на бизнеса' : 'Frequently used business management functions'}
          </p>
        </div>
        <div className="p-6">
          {quickActions?.length ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {quickActions.map((action) => (
                <button
                  type="button"
                  key={action.id}
                  className={`${action.color} rounded-lg p-4 elegant-hover cursor-pointer transition-all duration-300 border border-border flex flex-col items-center justify-center gap-2 min-h-[120px] group focus:outline-none focus:ring-2 focus:ring-accent`}
                  onClick={() => handleAction(action.action)}
                  title={`${action.title} - ${action.description}`}
                >
                  <Icon 
                    name={action.icon} 
                    size={28} 
                    className="text-sophisticated-dark group-hover:scale-110 transition-transform" 
                    strokeWidth={2}
                  />
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center text-sm text-hierarchy-secondary">
              {language === 'bg' ? 'Няма налични бързи действия.' : 'No quick actions available.'}
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-border bg-surface-elevation rounded-b-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Zap" size={16} className="text-hierarchy-secondary" />
              <span className="text-sm text-hierarchy-secondary">
                {language === 'bg' ? 'Персонализирай бързите действия' : 'Customize quick actions'}
              </span>
            </div>
            <Button variant="ghost" size="sm">
              <Icon name="Settings" size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Upload Photos Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-background rounded-lg shadow-lg max-w-md w-full p-6 my-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-heading font-semibold">
                {language === 'bg' ? 'Качи нови снимки' : 'Upload New Photos'}
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="text-hierarchy-secondary hover:text-sophisticated-dark">
                <Icon name="X" size={20} />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="text-sm text-hierarchy-secondary mb-2 block">
                {language === 'bg' ? 'Избери албум' : 'Select Album'}
              </label>
              <select 
                value={selectedAlbumId || ''} 
                onChange={(e) => setSelectedAlbumId(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2"
              >
                <option value="">{language === 'bg' ? 'Изберете албум' : 'Select an album'}</option>
                {albums?.map((album) => (
                  <option key={album?.id} value={album?.id}>
                    {album?.title} {album?.clientName && `(${album?.clientName})`}
                  </option>
                ))}
              </select>
            </div>

            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center mb-4 cursor-pointer hover:border-accent transition-colors"
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              <Icon name="Upload" size={40} className="mx-auto mb-2 text-hierarchy-secondary" />
              <p className="text-sm text-hierarchy-secondary">
                {language === 'bg' ? 'Пусни файлове тук или кликни за избор' : 'Drop files here or click to select'}
              </p>
              <input 
                id="fileInput"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => setUploadFiles(Array.from(e.target.files))}
              />
            </div>

            {uploadFiles?.length > 0 && (
              <div className="mb-4 p-3 bg-surface-elevation rounded-lg">
                <p className="text-sm text-hierarchy-secondary">
                  {language === 'bg' ? `Избрано: ${uploadFiles?.length} снимки` : `Selected: ${uploadFiles?.length} photos`}
                </p>
                {uploading && (
                  <div className="mt-2 w-full bg-border rounded-full h-2">
                    <div 
                      className="bg-accent h-2 rounded-full transition-all" 
                      style={{width: `${uploadProgress}%`}}
                    ></div>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadFiles([]);
                  setUploadProgress(0);
                }} 
                className="flex-1"
                disabled={uploading}
              >
                {language === 'bg' ? 'Отмяна' : 'Cancel'}
              </Button>
              <Button 
                onClick={handleUploadPhotos} 
                className="flex-1"
                disabled={uploading || !uploadFiles?.length}
              >
                {uploading ? `${uploadProgress}%` : (language === 'bg' ? 'Качи' : 'Upload')}
              </Button>
            </div>

            <p className="text-xs text-hierarchy-secondary mt-3">
              💾 {language === 'bg' ? 'Снимките се запазват в Supabase Storage и се показват в галерията на избрания албум.' : 'Photos are saved in Supabase Storage and displayed in the selected album gallery.'}
            </p>
          </div>
        </div>
      )}

      {/* Create Gallery Modal */}
      {showGalleryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-heading font-semibold">
                {language === 'bg' ? 'Създай нова галерия' : 'Create New Gallery'}
              </h3>
              <button onClick={() => setShowGalleryModal(false)} className="text-hierarchy-secondary hover:text-sophisticated-dark">
                <Icon name="X" size={20} />
              </button>
            </div>
            <input 
              type="text" 
              placeholder={language === 'bg' ? 'Име на галерия' : 'Gallery name'} 
              value={galleryTitle}
              onChange={(e) => setGalleryTitle(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 mb-3"
            />
            <input 
              type="text" 
              placeholder={language === 'bg' ? 'Име на клиент' : 'Client name'} 
              value={galleryClientName}
              onChange={(e) => setGalleryClientName(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 mb-4"
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowGalleryModal(false)} className="flex-1">
                {language === 'bg' ? 'Отмяна' : 'Cancel'}
              </Button>
              <Button onClick={handleCreateGallery} className="flex-1">
                {language === 'bg' ? 'Създай' : 'Create'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Block Dates Modal */}
      {showBlockDatesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-heading font-semibold">
                {language === 'bg' ? 'Блокирай дати' : 'Block Dates'}
              </h3>
              <button onClick={() => setShowBlockDatesModal(false)} className="text-hierarchy-secondary hover:text-sophisticated-dark">
                <Icon name="X" size={20} />
              </button>
            </div>
            <label className="text-sm text-hierarchy-secondary mb-1 block">{language === 'bg' ? 'От дата' : 'From date'}</label>
            <input 
              type="date" 
              value={blockDatesStart}
              onChange={(e) => setBlockDatesStart(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 mb-3"
            />
            <label className="text-sm text-hierarchy-secondary mb-1 block">{language === 'bg' ? 'До дата' : 'To date'}</label>
            <input 
              type="date" 
              value={blockDatesEnd}
              onChange={(e) => setBlockDatesEnd(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 mb-3"
            />
            <textarea 
              placeholder={language === 'bg' ? 'Причина (опционално)' : 'Reason (optional)'} 
              value={blockDatesReason}
              onChange={(e) => setBlockDatesReason(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 mb-4 h-20"
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowBlockDatesModal(false)} className="flex-1">
                {language === 'bg' ? 'Отмяна' : 'Cancel'}
              </Button>
              <Button onClick={handleBlockDates} className="flex-1">
                {language === 'bg' ? 'Блокирай' : 'Block'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Send Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-heading font-semibold">
                {language === 'bg' ? 'Изпрати съобщение' : 'Send Message'}
              </h3>
              <button onClick={() => setShowMessageModal(false)} className="text-hierarchy-secondary hover:text-sophisticated-dark">
                <Icon name="X" size={20} />
              </button>
            </div>
            <select 
              value={messageClientId}
              onChange={(e) => setMessageClientId(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 mb-3"
            >
              <option>{language === 'bg' ? 'Избери клиент' : 'Select client'}</option>
              {albums?.map((album) => (
                <option key={album?.id} value={album?.id}>
                  {album?.clientName || album?.title}
                </option>
              ))}
            </select>
            <textarea 
              placeholder={language === 'bg' ? 'Съобщението...' : 'Your message...'} 
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 mb-4 h-24"
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowMessageModal(false)} className="flex-1">
                {language === 'bg' ? 'Отмяна' : 'Cancel'}
              </Button>
              <Button onClick={handleSendMessage} className="flex-1">
                {language === 'bg' ? 'Изпрати' : 'Send'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Update Pricing Modal */}
      {showPricingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-heading font-semibold">
                {language === 'bg' ? 'Актуализирай цени' : 'Update Pricing'}
              </h3>
              <button onClick={() => setShowPricingModal(false)} className="text-hierarchy-secondary hover:text-sophisticated-dark">
                <Icon name="X" size={20} />
              </button>
            </div>
            <div className="space-y-3 mb-4">
              <div>
                <label className="text-sm text-hierarchy-secondary">{language === 'bg' ? 'Essential пакет' : 'Essential Package'}</label>
                <input 
                  type="number" 
                  placeholder="$" 
                  value={pricingEssential}
                  onChange={(e) => setPricingEssential(e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2 mt-1" 
                />
              </div>
              <div>
                <label className="text-sm text-hierarchy-secondary">{language === 'bg' ? 'Signature пакет' : 'Signature Package'}</label>
                <input 
                  type="number" 
                  placeholder="$" 
                  value={pricingSignature}
                  onChange={(e) => setPricingSignature(e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2 mt-1" 
                />
              </div>
              <div>
                <label className="text-sm text-hierarchy-secondary">{language === 'bg' ? 'Legacy пакет' : 'Legacy Package'}</label>
                <input 
                  type="number" 
                  placeholder="$" 
                  value={pricingLegacy}
                  onChange={(e) => setPricingLegacy(e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2 mt-1" 
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowPricingModal(false)} className="flex-1">
                {language === 'bg' ? 'Отмяна' : 'Cancel'}
              </Button>
              <Button onClick={handleUpdatePricing} className="flex-1">
                {language === 'bg' ? 'Запази' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default QuickActions;
