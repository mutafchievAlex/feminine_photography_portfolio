import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import { useLanguage } from '../../../hooks/useLanguage';

const BookingForm = ({ onSubmit, isSubmitting }) => {
  const { t } = useLanguage();
  
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
    { value: 'wedding', label: t('sessionWedding') },
    { value: 'maternity', label: t('sessionMaternity') },
    { value: 'family', label: t('sessionFamily') },
    { value: 'engagement', label: t('sessionEngagement') },
    { value: 'individual', label: t('sessionIndividual') },
    { value: 'corporate', label: t('sessionCorporate') },
    { value: 'newborn', label: t('sessionNewborn') },
    { value: 'other', label: t('sessionOther') }
  ];

  const locationOptions = [
    { value: 'studio', label: t('locationStudio') },
    { value: 'outdoor', label: t('locationOutdoor') },
    { value: 'home', label: t('locationHome') },
    { value: 'venue', label: t('locationVenue') },
    { value: 'flexible', label: t('locationFlexible') }
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
      newErrors.fullName = `${t('errorRequired')} ${t('fullName')?.toLowerCase()}`;
    }

    if (!formData?.email?.trim()) {
      newErrors.email = `${t('errorRequired')} ${t('emailAddress')?.toLowerCase()}`;
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = t('errorInvalidEmail');
    }

    if (!formData?.phone?.trim()) {
      newErrors.phone = `${t('errorRequired')} ${t('phoneNumber')?.toLowerCase()}`;
    }

    if (!formData?.sessionType) {
      newErrors.sessionType = t('errorSelectType');
    }

    if (!formData?.preferredDate) {
      newErrors.preferredDate = t('errorSelectDate');
    }

    if (!formData?.agreedToTerms) {
      newErrors.agreedToTerms = t('errorAcceptTerms');
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
          {t('bookConsultationTitle')}
        </h3>
        <p className="text-sophisticated text-hierarchy-secondary">
          {t('bookConsultationSubtitle')}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h4 className="text-sophisticated font-medium text-sophisticated-dark">
            {t('personalInformation')}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('fullName')}
              type="text"
              placeholder={t('enterYourName')}
              value={formData?.fullName}
              onChange={(e) => handleInputChange('fullName', e?.target?.value)}
              error={errors?.fullName}
              required
            />

            <Input
              label={t('emailAddress')}
              type="email"
              placeholder="your@email.com"
              value={formData?.email}
              onChange={(e) => handleInputChange('email', e?.target?.value)}
              error={errors?.email}
              required
            />
          </div>

          <Input
            label={t('phoneNumber')}
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
            {t('sessionDetails')}
          </h4>

          <Select
            label={t('sessionType')}
            placeholder={t('selectSessionType')}
            options={sessionTypeOptions}
            value={formData?.sessionType}
            onChange={(value) => handleInputChange('sessionType', value)}
            error={errors?.sessionType}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('preferredDate')}
              type="date"
              value={formData?.preferredDate}
              onChange={(e) => handleInputChange('preferredDate', e?.target?.value)}
              error={errors?.preferredDate}
              min={new Date()?.toISOString()?.split('T')?.[0]}
              required
            />

            <Input
              label={t('alternativeDate')}
              type="date"
              value={formData?.alternateDate}
              onChange={(e) => handleInputChange('alternateDate', e?.target?.value)}
              min={new Date()?.toISOString()?.split('T')?.[0]}
            />
          </div>

          <Select
            label={t('preferredLocation')}
            placeholder={t('selectLocation')}
            options={locationOptions}
            value={formData?.location}
            onChange={(value) => handleInputChange('location', value)}
          />
        </div>

        {/* Vision & Inspiration */}
        <div className="space-y-4">
          <h4 className="text-sophisticated font-medium text-sophisticated-dark">
            {t('yourVision')}
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-sophisticated text-sophisticated-dark mb-2">
                {t('tellMeYourVision')}
              </label>
              <textarea
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                rows="4"
                placeholder={t('describePhotoshoot')}
                value={formData?.vision}
                onChange={(e) => handleInputChange('vision', e?.target?.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-sophisticated text-sophisticated-dark mb-2">
                {t('whatDrewYou')}
              </label>
              <textarea
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                rows="3"
                placeholder={t('shareInspiration')}
                value={formData?.inspiration}
                onChange={(e) => handleInputChange('inspiration', e?.target?.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-sophisticated text-sophisticated-dark mb-2">
                {t('specialRequests')}
              </label>
              <textarea
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                rows="3"
                placeholder={t('specialRequestsPlaceholder')}
                value={formData?.specialRequests}
                onChange={(e) => handleInputChange('specialRequests', e?.target?.value)}
              />
            </div>
          </div>
        </div>

        {/* Terms and Consent */}
        <div className="space-y-4 pt-4 border-t border-border">
          <Checkbox
            label={t('agreeToTerms')}
            checked={formData?.agreedToTerms}
            onChange={(e) => handleInputChange('agreedToTerms', e?.target?.checked)}
            error={errors?.agreedToTerms}
            required
          />

          <Checkbox
            label={t('receiveNews')}
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
              t('submitting')
            ) : (
              <>
                <Icon name="Calendar" size={20} className="mr-2" />
                {t('bookConsultationTitle')}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;