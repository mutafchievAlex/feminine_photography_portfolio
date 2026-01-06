import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { useLanguage } from '../../../hooks/useLanguage';
import { bookingService } from '../../../services/bookingService';
import { sanitizeInput, validateBookingForm } from '../../../utils/security';

export default function BookingManagementModal({ isOpen, booking, onClose, onStatusChanged }) {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingNotes, setEditingNotes] = useState('');
  const [editingData, setEditingData] = useState({
    fullName: '',
    email: '',
    phone: '',
    sessionType: '',
    location: '',
    preferredDate: '',
    alternateDate: '',
    vision: '',
    specialRequests: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  // Update form when booking changes
  useEffect(() => {
    if (booking && isOpen) {
      setEditingNotes(booking?.adminNotes || '');
      setEditingData({
        fullName: booking?.fullName || '',
        email: booking?.email || '',
        phone: booking?.phone || '',
        sessionType: booking?.sessionType || '',
        location: booking?.location || '',
        preferredDate: booking?.preferredDate || '',
        alternateDate: booking?.alternateDate || '',
        vision: booking?.vision || '',
        specialRequests: booking?.specialRequests || ''
      });
      setMessage('');
    }
  }, [booking, isOpen]);

  if (!booking) return null;

  const handleInputChange = (field, value) => {
    setEditingData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateChanges = () => {
    const newErrors = {};
    
    if (!editingData.fullName?.trim()) {
      newErrors.fullName = 'Име е задължително';
    }
    if (!editingData.email?.trim()) {
      newErrors.email = 'Имейл е задължителен';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editingData.email)) {
      newErrors.email = 'Невалидна имейл адреса';
    }
    if (!editingData.phone?.trim()) {
      newErrors.phone = 'Телефон е задължителен';
    }
    if (!editingData.preferredDate) {
      newErrors.preferredDate = 'Дата е задължителна';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveChanges = async () => {
    if (!validateChanges()) return;

    setIsSubmitting(true);
    try {
      const sanitizedData = {
        ...editingData,
        fullName: sanitizeInput(editingData.fullName),
        email: sanitizeInput(editingData.email),
        phone: sanitizeInput(editingData.phone),
        location: sanitizeInput(editingData.location),
        vision: sanitizeInput(editingData.vision),
        specialRequests: sanitizeInput(editingData.specialRequests),
        adminNotes: sanitizeInput(editingNotes)
      };

      // Update booking with new data
      await bookingService.updateBookingWithDetails(booking.id, sanitizedData);
      
      setMessage('✓ Резервацията е актуализирана успешно');
      setTimeout(() => {
        onStatusChanged?.();
        onClose?.();
      }, 1500);
    } catch (error) {
      console.error('Error updating booking:', error);
      setErrors({ submit: 'Грешка при актуализиране на резервацията' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setIsSubmitting(true);
    try {
      await bookingService.updateStatus(booking.id, newStatus, editingNotes);
      
      const statusMessages = {
        confirmed: '✓ Резервацията е потвърдена',
        completed: '✓ Резервацията е завършена',
        cancelled: '✓ Резервацията е отказана'
      };
      
      setMessage(statusMessages[newStatus] || 'Статусът е актуализиран');
      setTimeout(() => {
        onStatusChanged?.();
        onClose?.();
      }, 1500);
    } catch (error) {
      console.error('Error updating status:', error);
      setErrors({ submit: 'Грешка при актуализиране на статус' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      confirmed: 'bg-green-100 text-green-800 border-green-300',
      completed: 'bg-blue-100 text-blue-800 border-blue-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300'
    };
    return colors?.[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Чакащо',
      confirmed: 'Потвърдено',
      completed: 'Завършено',
      cancelled: 'Отказано'
    };
    return labels?.[status] || status;
  };

  const getSessionTypeLabel = (type) => {
    const labels = {
      wedding: 'Сватба',
      maternity: 'Бременност',
      family: 'Семейна',
      engagement: 'Годеж',
      individual: 'Индивидуална',
      corporate: 'Корпоративна',
      newborn: 'Новородено',
      other: 'Друго'
    };
    return labels?.[type] || type;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl"
              >
                {/* Header */}
                <div className="sticky top-0 z-10 bg-white border-b border-gray-200 rounded-t-xl px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-heading font-semibold text-sophisticated-dark">
                        Управление на резервация
                      </h2>
                      <p className="text-sm text-hierarchy-secondary mt-1">
                        {editingData.fullName} - {getSessionTypeLabel(booking.sessionType)}
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      disabled={isSubmitting}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                      aria-label="Затвори"
                    >
                      <Icon name="X" size={24} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
                  {message ? (
                    <div className="text-center py-8">
                      <Icon name="Check" size={48} className="mx-auto text-green-600 mb-4" />
                      <p className="text-lg text-sophisticated-dark">{message}</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Current Status Badge */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-border">
                        <div>
                          <p className="text-sm font-medium text-hierarchy-secondary">Текущ статус</p>
                          <p className="text-sm text-sophisticated-dark mt-1">
                            Резервацията е {getStatusLabel(booking.status).toLowerCase()}
                          </p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                          {getStatusLabel(booking.status)}
                        </span>
                      </div>

                      {/* Error Messages */}
                      {errors.submit && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                          <Icon name="AlertTriangle" size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                          <p className="text-red-800 text-sm">{errors.submit}</p>
                        </div>
                      )}

                      {/* Client Information Section */}
                      <div>
                        <h3 className="text-lg font-sophisticated font-semibold text-sophisticated-dark mb-4">
                          Информация за клиента
                        </h3>
                        <div className="space-y-4">
                          <Input
                            label="Име"
                            value={editingData.fullName}
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                            error={errors.fullName}
                            icon="User"
                            disabled={isSubmitting}
                          />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                              label="Имейл"
                              type="email"
                              value={editingData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              error={errors.email}
                              icon="Mail"
                              disabled={isSubmitting}
                            />
                            <Input
                              label="Телефон"
                              value={editingData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              error={errors.phone}
                              icon="Phone"
                              disabled={isSubmitting}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Booking Details Section */}
                      <div>
                        <h3 className="text-lg font-sophisticated font-semibold text-sophisticated-dark mb-4">
                          Детайли на резервацията
                        </h3>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-sophisticated text-sophisticated-dark mb-2 block">
                                <Icon name="Camera" size={16} className="inline-block mr-2" />
                                Тип фотосесия
                              </label>
                              <select
                                value={editingData.sessionType}
                                onChange={(e) => handleInputChange('sessionType', e.target.value)}
                                disabled={isSubmitting}
                                className="w-full px-4 py-3 rounded-lg border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                              >
                                <option value="">Избери тип</option>
                                <option value="wedding">Сватба</option>
                                <option value="maternity">Бременност</option>
                                <option value="family">Семейна</option>
                                <option value="engagement">Годеж</option>
                                <option value="individual">Индивидуална</option>
                                <option value="corporate">Корпоративна</option>
                                <option value="newborn">Новородено</option>
                                <option value="other">Друго</option>
                              </select>
                            </div>
                            <Input
                              label="Локация"
                              value={editingData.location}
                              onChange={(e) => handleInputChange('location', e.target.value)}
                              error={errors.location}
                              icon="MapPin"
                              disabled={isSubmitting}
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                              label="Предпочитана дата"
                              type="date"
                              value={formatDate(editingData.preferredDate)}
                              onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                              error={errors.preferredDate}
                              icon="Calendar"
                              disabled={isSubmitting}
                            />
                            <Input
                              label="Алтернативна дата"
                              type="date"
                              value={formatDate(editingData.alternateDate)}
                              onChange={(e) => handleInputChange('alternateDate', e.target.value)}
                              icon="Calendar"
                              disabled={isSubmitting}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-sophisticated text-sophisticated-dark mb-2 block">
                              <Icon name="Camera" size={16} className="inline-block mr-2" />
                              Визия
                            </label>
                            <textarea
                              value={editingData.vision}
                              onChange={(e) => handleInputChange('vision', e.target.value)}
                              placeholder="Опиши визията за фотосесията..."
                              className="w-full px-4 py-3 rounded-lg border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none"
                              rows="3"
                              disabled={isSubmitting}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-sophisticated text-sophisticated-dark mb-2 block">
                              <Icon name="MessageSquare" size={16} className="inline-block mr-2" />
                              Специални изисквания
                            </label>
                            <textarea
                              value={editingData.specialRequests}
                              onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                              placeholder="Дополнителни забележки..."
                              className="w-full px-4 py-3 rounded-lg border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none"
                              rows="3"
                              disabled={isSubmitting}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Admin Notes Section */}
                      <div>
                        <h3 className="text-lg font-sophisticated font-semibold text-sophisticated-dark mb-4">
                          Административни бележки
                        </h3>
                        <textarea
                          value={editingNotes}
                          onChange={(e) => setEditingNotes(e.target.value)}
                          placeholder="Вътрешни бележки за администратора..."
                          className="w-full px-4 py-3 rounded-lg border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none"
                          rows="3"
                          disabled={isSubmitting}
                        />
                      </div>

                      {/* Status Actions */}
                      {booking.status === 'pending' && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-sm text-blue-800 mb-3 font-medium">
                            <Icon name="Info" size={16} className="inline-block mr-2" />
                            Кои действия желаеш да предприемеш?
                          </p>
                          <div className="space-y-2">
                            <Button
                              variant="default"
                              fullWidth
                              onClick={() => handleStatusChange('confirmed')}
                              disabled={isSubmitting}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Icon name="Check" size={16} className="mr-2" />
                              Потвърди резервацията
                            </Button>
                            <Button
                              variant="outline"
                              fullWidth
                              onClick={() => handleStatusChange('cancelled')}
                              disabled={isSubmitting}
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              <Icon name="X" size={16} className="mr-2" />
                              Откажи резервацията
                            </Button>
                          </div>
                        </div>
                      )}

                      {booking.status === 'confirmed' && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                          <p className="text-sm text-purple-800 mb-3 font-medium">
                            <Icon name="CheckCircle" size={16} className="inline-block mr-2" />
                            Резервацията е потвърдена
                          </p>
                          <Button
                            variant="outline"
                            fullWidth
                            onClick={() => handleStatusChange('completed')}
                            disabled={isSubmitting}
                            className="border-blue-300 text-blue-600 hover:bg-blue-50"
                          >
                            <Icon name="CheckSquare" size={16} className="mr-2" />
                            Отбележи като завършена
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer */}
                {!message && (
                  <div className="sticky bottom-0 bg-white border-t border-gray-200 rounded-b-xl px-6 py-4 flex gap-3">
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={onClose}
                      disabled={isSubmitting}
                    >
                      Отмени
                    </Button>
                    <Button
                      variant="default"
                      fullWidth
                      onClick={handleSaveChanges}
                      isLoading={isSubmitting}
                      className="bg-gradient-to-r from-accent to-secondary hover:shadow-medium"
                    >
                      <Icon name="Save" size={16} className="mr-2" />
                      Запази изменения
                    </Button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
