import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { bookingService } from '../../../services/bookingService';
import { useLanguage } from '../../../hooks/useLanguage';

const ITEMS_PER_PAGE = 10;

export default function AllBookingsModal({ isOpen, onClose }) {
  const { t } = useLanguage();
  const [bookings, setBookings] = useState([]);
  const [displayedBookings, setDisplayedBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all bookings
  useEffect(() => {
    if (isOpen) {
      loadBookings();
    }
  }, [isOpen]);

  // Update displayed bookings when page changes
  useEffect(() => {
    const startIdx = 0;
    const endIdx = (currentPage + 1) * ITEMS_PER_PAGE;
    setDisplayedBookings(bookings.slice(startIdx, endIdx));
  }, [bookings, currentPage]);

  const loadBookings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await bookingService.getAllBookings();
      // Sort by date descending (newest first)
      const sorted = (data || []).sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setBookings(sorted);
      setCurrentPage(0);
    } catch (err) {
      console.error('Error loading bookings:', err);
      setError(err.message || 'Грешка при зареждане на резервации');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const hasMore = displayedBookings.length < bookings.length;

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
    const date = new Date(dateString);
    return date.toLocaleDateString('bg-BG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('bg-BG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
                className="relative w-full max-w-6xl bg-white rounded-xl shadow-2xl"
              >
                {/* Header */}
                <div className="sticky top-0 z-10 bg-white border-b border-gray-200 rounded-t-xl px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-heading font-semibold text-sophisticated-dark">
                        Всички резервации
                      </h2>
                      <p className="text-sm text-hierarchy-secondary mt-1">
                        Общо {bookings.length} резервации
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="Затвори"
                    >
                      <Icon name="X" size={24} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
                  {isLoading ? (
                    // Loading state
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse">
                          <div className="h-32 bg-gray-200 rounded-lg"></div>
                        </div>
                      ))}
                    </div>
                  ) : error ? (
                    // Error state
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <div className="flex items-center space-x-3">
                        <Icon name="AlertTriangle" size={24} className="text-red-600" />
                        <div>
                          <h4 className="text-red-800 font-medium">Грешка при зареждане</h4>
                          <p className="text-red-600 text-sm mt-1">{error}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={loadBookings}
                        className="mt-4"
                      >
                        <Icon name="RefreshCw" size={16} className="mr-2" />
                        Опитай отново
                      </Button>
                    </div>
                  ) : bookings.length === 0 ? (
                    // Empty state
                    <div className="text-center py-12">
                      <Icon name="Calendar" size={64} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-hierarchy-secondary text-lg">
                        Няма налични резервации
                      </p>
                    </div>
                  ) : (
                    // Bookings list
                    <div className="space-y-4">
                      {displayedBookings.map((booking, index) => (
                        <motion.div
                          key={booking.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border border-border rounded-lg p-5 hover:shadow-md transition-shadow bg-surface-elevation"
                        >
                          <div className="flex items-start justify-between">
                            {/* Left side - Main info */}
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h3 className="text-lg font-sophisticated font-semibold text-sophisticated-dark">
                                  {booking.clientName || booking.fullName}
                                </h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                                  {getStatusLabel(booking.status)}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2 text-hierarchy-secondary">
                                  <Icon name="Camera" size={16} className="text-accent" />
                                  <span className="font-medium">Тип:</span>
                                  <span>{getSessionTypeLabel(booking.sessionType)}</span>
                                </div>

                                <div className="flex items-center gap-2 text-hierarchy-secondary">
                                  <Icon name="Calendar" size={16} className="text-accent" />
                                  <span className="font-medium">Дата:</span>
                                  <span>{formatDate(booking.preferredDate || booking.eventDate)}</span>
                                </div>

                                <div className="flex items-center gap-2 text-hierarchy-secondary">
                                  <Icon name="Mail" size={16} className="text-accent" />
                                  <span className="font-medium">Имейл:</span>
                                  <span className="truncate">{booking.clientEmail || booking.email}</span>
                                </div>

                                {booking.phone && (
                                  <div className="flex items-center gap-2 text-hierarchy-secondary">
                                    <Icon name="Phone" size={16} className="text-accent" />
                                    <span className="font-medium">Телефон:</span>
                                    <span>{booking.phone}</span>
                                  </div>
                                )}

                                {booking.location && (
                                  <div className="flex items-center gap-2 text-hierarchy-secondary">
                                    <Icon name="MapPin" size={16} className="text-accent" />
                                    <span className="font-medium">Локация:</span>
                                    <span>{booking.location}</span>
                                  </div>
                                )}

                                {booking.totalAmount && (
                                  <div className="flex items-center gap-2 text-hierarchy-secondary">
                                    <Icon name="DollarSign" size={16} className="text-accent" />
                                    <span className="font-medium">Сума:</span>
                                    <span>{booking.totalAmount} лв</span>
                                  </div>
                                )}
                              </div>

                              {/* Additional details */}
                              {(booking.vision || booking.specialRequests) && (
                                <div className="mt-3 pt-3 border-t border-border">
                                  {booking.vision && (
                                    <div className="mb-2">
                                      <span className="text-xs font-medium text-hierarchy-secondary">Визия:</span>
                                      <p className="text-sm text-sophisticated-dark mt-1">{booking.vision}</p>
                                    </div>
                                  )}
                                  {booking.specialRequests && (
                                    <div>
                                      <span className="text-xs font-medium text-hierarchy-secondary">Специални изисквания:</span>
                                      <p className="text-sm text-sophisticated-dark mt-1">{booking.specialRequests}</p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Right side - Timestamp */}
                            <div className="ml-4 text-right flex-shrink-0">
                              <div className="text-xs text-hierarchy-secondary">
                                Създадена на
                              </div>
                              <div className="text-sm font-medium text-sophisticated-dark mt-1">
                                {formatDateTime(booking.createdAt)}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer with Load More button */}
                {!isLoading && !error && hasMore && (
                  <div className="sticky bottom-0 bg-white border-t border-gray-200 rounded-b-xl px-6 py-4">
                    <Button
                      variant="default"
                      fullWidth
                      onClick={loadMore}
                      className="bg-gradient-to-r from-accent to-secondary hover:shadow-medium"
                    >
                      <Icon name="ChevronDown" size={20} className="mr-2" />
                      Виж следващите {Math.min(ITEMS_PER_PAGE, bookings.length - displayedBookings.length)}
                      <span className="ml-2 text-xs opacity-75">
                        ({displayedBookings.length} от {bookings.length})
                      </span>
                    </Button>
                  </div>
                )}

                {/* Show "All loaded" message */}
                {!isLoading && !error && !hasMore && bookings.length > ITEMS_PER_PAGE && (
                  <div className="sticky bottom-0 bg-white border-t border-gray-200 rounded-b-xl px-6 py-4">
                    <div className="text-center text-sm text-hierarchy-secondary">
                      <Icon name="Check" size={16} className="inline-block mr-2" />
                      Всички резервации са заредени
                    </div>
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
