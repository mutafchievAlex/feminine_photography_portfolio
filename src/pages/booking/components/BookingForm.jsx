import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const BookingForm = ({ onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    sessionType: '',
    preferredDate: '',
    alternateDate: '',
    location: '',
    vision: '',
    inspiration: '',
    specialRequests: '',
    agreedToTerms: false,
    marketingConsent: false
  });

  const [errors, setErrors] = useState({});

  const sessionTypeOptions = [
    { value: 'wedding', label: 'Сватбена фотосесия / Wedding Photography' },
    { value: 'maternity', label: 'Бременност / Maternity Session' },
    { value: 'family', label: 'Семейна / Family Portrait' },
    { value: 'engagement', label: 'Годеж / Engagement Session' },
    { value: 'individual', label: 'Индивидуална / Individual Portrait' },
    { value: 'corporate', label: 'Корпоративна / Corporate Headshots' },
    { value: 'newborn', label: 'Новородено / Newborn Session' },
    { value: 'other', label: 'Друго / Other' }
  ];

  const locationOptions = [
    { value: 'studio', label: 'Студио / Studio' },
    { value: 'outdoor', label: 'На открито / Outdoor Location' },
    { value: 'home', label: 'У дома / At Home' },
    { value: 'venue', label: 'Специално място / Special Venue' },
    { value: 'flexible', label: 'Гъвкаво / Flexible' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.fullName?.trim()) {
      newErrors.fullName = 'Моля въведете вашето име / Please enter your name';
    }

    if (!formData?.email?.trim()) {
      newErrors.email = 'Моля въведете имейл / Please enter email';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Невалиден имейл / Invalid email format';
    }

    if (!formData?.phone?.trim()) {
      newErrors.phone = 'Моля въведете телефон / Please enter phone number';
    }

    if (!formData?.sessionType) {
      newErrors.sessionType = 'Моля изберете тип сесия / Please select session type';
    }

    if (!formData?.preferredDate) {
      newErrors.preferredDate = 'Моля изберете дата / Please select preferred date';
    }

    if (!formData?.agreedToTerms) {
      newErrors.agreedToTerms = 'Моля приемете условията / Please accept terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="bg-surface-elevation rounded-xl shadow-soft p-6 lg:p-8">
      <div className="mb-6">
        <h3 className="text-elegant text-2xl text-sophisticated-dark mb-2">
          Резервирайте консултация / Book Consultation
        </h3>
        <p className="text-sophisticated text-hierarchy-secondary">
          Започнете вашето пътуване с безплатна консултация / Start your journey with a complimentary consultation
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h4 className="text-sophisticated font-medium text-sophisticated-dark">
            Лична информация / Personal Information
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Пълно име / Full Name"
              type="text"
              placeholder="Въведете вашето име / Enter your name"
              value={formData?.fullName}
              onChange={(e) => handleInputChange('fullName', e?.target?.value)}
              error={errors?.fullName}
              required
            />

            <Input
              label="Имейл адрес / Email Address"
              type="email"
              placeholder="your@email.com"
              value={formData?.email}
              onChange={(e) => handleInputChange('email', e?.target?.value)}
              error={errors?.email}
              required
            />
          </div>

          <Input
            label="Телефон / Phone Number"
            type="tel"
            placeholder="+359 XXX XXX XXX"
            value={formData?.phone}
            onChange={(e) => handleInputChange('phone', e?.target?.value)}
            error={errors?.phone}
            required
          />
        </div>

        {/* Session Details */}
        <div className="space-y-4">
          <h4 className="text-sophisticated font-medium text-sophisticated-dark">
            Детайли за сесията / Session Details
          </h4>

          <Select
            label="Тип фотосесия / Session Type"
            placeholder="Изберете тип сесия / Select session type"
            options={sessionTypeOptions}
            value={formData?.sessionType}
            onChange={(value) => handleInputChange('sessionType', value)}
            error={errors?.sessionType}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Предпочитана дата / Preferred Date"
              type="date"
              value={formData?.preferredDate}
              onChange={(e) => handleInputChange('preferredDate', e?.target?.value)}
              error={errors?.preferredDate}
              min={new Date()?.toISOString()?.split('T')?.[0]}
              required
            />

            <Input
              label="Алтернативна дата / Alternative Date"
              type="date"
              value={formData?.alternateDate}
              onChange={(e) => handleInputChange('alternateDate', e?.target?.value)}
              min={new Date()?.toISOString()?.split('T')?.[0]}
            />
          </div>

          <Select
            label="Предпочитано място / Preferred Location"
            placeholder="Изберете място / Select location"
            options={locationOptions}
            value={formData?.location}
            onChange={(value) => handleInputChange('location', value)}
          />
        </div>

        {/* Vision & Inspiration */}
        <div className="space-y-4">
          <h4 className="text-sophisticated font-medium text-sophisticated-dark">
            Вашата визия / Your Vision
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-sophisticated text-sophisticated-dark mb-2">
                Разкажете ми за вашата визия / Tell me about your vision
              </label>
              <textarea
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                rows="4"
                placeholder="Опишете как си представяте фотосесията... / Describe how you envision the photoshoot..."
                value={formData?.vision}
                onChange={(e) => handleInputChange('vision', e?.target?.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-sophisticated text-sophisticated-dark mb-2">
                Какво ви привлече в моята работа? / What drew you to my work?
              </label>
              <textarea
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                rows="3"
                placeholder="Споделете какво ви вдъхнови... / Share what inspired you..."
                value={formData?.inspiration}
                onChange={(e) => handleInputChange('inspiration', e?.target?.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-sophisticated text-sophisticated-dark mb-2">
                Специални заявки / Special Requests
              </label>
              <textarea
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                rows="3"
                placeholder="Има ли нещо специално, което искате да включим... / Is there anything special you'd like to include..."
                value={formData?.specialRequests}
                onChange={(e) => handleInputChange('specialRequests', e?.target?.value)}
              />
            </div>
          </div>
        </div>

        {/* Terms and Consent */}
        <div className="space-y-4 pt-4 border-t border-border">
          <Checkbox
            label="Съгласявам се с условията за ползване и политиката за поверителност / I agree to the terms of service and privacy policy"
            checked={formData?.agreedToTerms}
            onChange={(e) => handleInputChange('agreedToTerms', e?.target?.checked)}
            error={errors?.agreedToTerms}
            required
          />

          <Checkbox
            label="Желая да получавам новини и вдъхновение за фотография / I'd like to receive photography news and inspiration"
            checked={formData?.marketingConsent}
            onChange={(e) => handleInputChange('marketingConsent', e?.target?.checked)}
          />
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <Button
            type="submit"
            variant="default"
            size="lg"
            fullWidth
            loading={isSubmitting}
            className="bg-gradient-to-r from-accent to-secondary text-sophisticated-dark hover:shadow-medium pulse-cta"
          >
            {isSubmitting ? (
              'Изпращане... / Submitting...'
            ) : (
              <>
                <Icon name="Calendar" size={20} className="mr-2" />
                Резервирайте консултация / Book Consultation
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;