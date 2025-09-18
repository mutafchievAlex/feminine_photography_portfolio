export const SUCCESS_TOAST_DURATION = 5000;
export const DEFAULT_BOOKING_ERROR_MESSAGE =
  'Възникна грешка при изпращане на резервацията. Моля, опитайте отново. / Unable to submit the booking. Please try again.';

export const normalizeFieldKey = (rawField) => {
  if (!rawField || typeof rawField !== 'string') {
    return null;
  }

  const segments = rawField.split('.').filter(Boolean);
  const field = segments.length ? segments[segments.length - 1] : rawField;

  const fieldMap = {
    clientName: 'fullName',
    clientEmail: 'email',
    clientPhone: 'phone',
    eventDate: 'preferredDate',
    selectedDate: 'preferredDate',
    photographerId: 'photographerId',
  };

  return fieldMap[field] || field;
};

const coerceMessage = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean).join(' ').trim();
  }

  if (typeof value === 'string') {
    return value.trim();
  }

  if (value && typeof value === 'object') {
    return (
      value.message ||
      value.detail ||
      value.error ||
      value.reason ||
      value.description ||
      ''
    ).toString().trim();
  }

  return '';
};

export const parseBookingErrors = (error) => {
  const fieldErrors = {};
  let formError = '';

  const tryAssignFieldError = (field, message) => {
    const normalizedField = normalizeFieldKey(field);
    if (!normalizedField) {
      return false;
    }

    const messageText = coerceMessage(message);
    if (!messageText) {
      return false;
    }

    fieldErrors[normalizedField] = fieldErrors[normalizedField]
      ? `${fieldErrors[normalizedField]} ${messageText}`
      : messageText;
    return true;
  };

  const responseData = error?.response?.data;

  if (responseData) {
    if (Array.isArray(responseData?.violations)) {
      responseData.violations.forEach((violation) => {
        const handled = tryAssignFieldError(
          violation?.field || violation?.propertyPath,
          violation?.message || violation?.detail
        );

        if (!handled && violation?.message) {
          formError = formError || violation.message;
        }
      });
    }

    if (responseData?.errors) {
      if (Array.isArray(responseData.errors)) {
        responseData.errors.forEach((item) => {
          if (typeof item === 'string') {
            formError = formError || item;
            return;
          }

          const handled = tryAssignFieldError(
            item?.field || item?.propertyPath,
            item?.message || item?.error || item?.detail
          );

          if (!handled && (item?.message || item?.error)) {
            formError = formError || item?.message || item?.error;
          }
        });
      } else if (typeof responseData.errors === 'object') {
        Object.entries(responseData.errors).forEach(([field, value]) => {
          const handled = tryAssignFieldError(field, value);
          if (!handled) {
            const fallbackMessage = coerceMessage(value);
            if (fallbackMessage) {
              formError = formError || fallbackMessage;
            }
          }
        });
      }
    }

    if (!formError) {
      formError =
        coerceMessage(responseData?.message) ||
        coerceMessage(responseData?.error) ||
        '';
    }
  } else if (error?.message) {
    formError = error.message;
  }

  return {
    fieldErrors,
    formError,
  };
};

export const createSubmitHandler = ({
  submitBookingFn,
  getSelectedDate,
  setIsSubmitting,
  setSubmissionError,
  setServerErrors,
  setShowSuccessMessage,
  successTimeoutRef,
  parseErrors = parseBookingErrors,
  defaultErrorMessage = DEFAULT_BOOKING_ERROR_MESSAGE,
  setTimeoutFn = setTimeout,
  clearTimeoutFn = clearTimeout,
} = {}) => {
  if (typeof submitBookingFn !== 'function') {
    throw new Error('submitBookingFn is required');
  }

  const timeoutRef = successTimeoutRef || { current: null };

  return async (formData = {}) => {
    setIsSubmitting?.(true);
    setSubmissionError?.('');
    setServerErrors?.({});

    try {
      const selectedDateFromState =
        typeof getSelectedDate === 'function' ? getSelectedDate() : undefined;
      const selectedDate = formData.selectedDate || selectedDateFromState;
      const result = await submitBookingFn({ ...formData, selectedDate });

      setShowSuccessMessage?.(true);

      if (timeoutRef.current) {
        clearTimeoutFn(timeoutRef.current);
      }

      timeoutRef.current = setTimeoutFn(() => {
        setShowSuccessMessage?.(false);
        timeoutRef.current = null;
      }, SUCCESS_TOAST_DURATION);

      return result;
    } catch (caughtError) {
      if (timeoutRef.current) {
        clearTimeoutFn(timeoutRef.current);
        timeoutRef.current = null;
      }

      const { fieldErrors, formError } = parseErrors(caughtError);

      if (fieldErrors && Object.keys(fieldErrors).length > 0) {
        setServerErrors?.(fieldErrors);
      }

      setSubmissionError?.(formError || defaultErrorMessage);
      setShowSuccessMessage?.(false);

      return undefined;
    } finally {
      setIsSubmitting?.(false);
    }
  };
};

export default {
  createSubmitHandler,
  normalizeFieldKey,
  parseBookingErrors,
  SUCCESS_TOAST_DURATION,
  DEFAULT_BOOKING_ERROR_MESSAGE,
};
