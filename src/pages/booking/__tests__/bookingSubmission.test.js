import { describe, expect, it, vi } from 'bun:test';

import {
  createSubmitHandler,
  parseBookingErrors,
  SUCCESS_TOAST_DURATION,
} from '../bookingSubmission';

const collectCallArgs = (mockFn) => mockFn.mock.calls.map((call) => call[0]);

describe('booking submission orchestration', () => {
  it('submits booking data, resets errors and schedules success timeout', async () => {
    const submitBookingFn = vi
      .fn()
      .mockResolvedValue({ id: 'booking-123', status: 'confirmed' });
    const setIsSubmitting = vi.fn();
    const setSubmissionError = vi.fn();
    const setServerErrors = vi.fn();
    const setShowSuccessMessage = vi.fn();
    const clearTimeoutFn = vi.fn();
    const setTimeoutFn = vi.fn((callback, delay) => {
      expect(delay).toBe(SUCCESS_TOAST_DURATION);
      scheduledCallback = callback;
      return 'timeout-id';
    });
    const successTimeoutRef = { current: 'previous-timeout' };
    let scheduledCallback = () => {};

    const handleSubmit = createSubmitHandler({
      submitBookingFn,
      getSelectedDate: () => '2025-01-15',
      setIsSubmitting,
      setSubmissionError,
      setServerErrors,
      setShowSuccessMessage,
      successTimeoutRef,
      setTimeoutFn,
      clearTimeoutFn,
    });

    const result = await handleSubmit({
      fullName: 'Test User',
      email: 'test@example.com',
      phone: '+359123456789',
    });

    expect(submitBookingFn).toHaveBeenCalledWith(
      expect.objectContaining({
        fullName: 'Test User',
        email: 'test@example.com',
        phone: '+359123456789',
        selectedDate: '2025-01-15',
      })
    );

    expect(collectCallArgs(setIsSubmitting)).toEqual([true, false]);
    expect(collectCallArgs(setSubmissionError)).toEqual(['']);
    expect(collectCallArgs(setServerErrors)).toEqual([{}]);
    expect(setShowSuccessMessage).toHaveBeenCalledWith(true);
    expect(clearTimeoutFn).toHaveBeenCalledWith('previous-timeout');
    expect(successTimeoutRef.current).toBe('timeout-id');
    expect(typeof scheduledCallback).toBe('function');

    // simulate auto-dismiss of the success toast
    scheduledCallback();
    expect(setShowSuccessMessage).toHaveBeenLastCalledWith(false);
    expect(successTimeoutRef.current).toBeNull();
    expect(result).toEqual({ id: 'booking-123', status: 'confirmed' });
  });

  it('captures backend validation errors and exposes form level feedback', async () => {
    const validationError = {
      response: {
        data: {
          message: 'Validation failed',
          errors: [
            { field: 'clientEmail', message: 'Email format is invalid on the server' },
            { field: 'eventDate', message: 'Selected date is unavailable' },
          ],
        },
      },
    };

    const submitBookingFn = vi.fn(async () => {
      throw validationError;
    });
    const setIsSubmitting = vi.fn();
    const setSubmissionError = vi.fn();
    const setServerErrors = vi.fn();
    const setShowSuccessMessage = vi.fn();
    const clearTimeoutFn = vi.fn();
    const setTimeoutFn = vi.fn();
    const successTimeoutRef = { current: 'timeout-handle' };

    const handleSubmit = createSubmitHandler({
      submitBookingFn,
      getSelectedDate: () => '2025-02-14',
      setIsSubmitting,
      setSubmissionError,
      setServerErrors,
      setShowSuccessMessage,
      successTimeoutRef,
      setTimeoutFn,
      clearTimeoutFn,
    });

    const result = await handleSubmit({
      fullName: 'Error Case',
      email: 'bad-email',
      phone: '+359987654321',
    });

    expect(result).toBeUndefined();
    expect(setTimeoutFn).not.toHaveBeenCalled();
    expect(clearTimeoutFn).toHaveBeenCalledWith('timeout-handle');
    expect(successTimeoutRef.current).toBeNull();

    expect(collectCallArgs(setIsSubmitting)).toEqual([true, false]);
    expect(collectCallArgs(setSubmissionError)).toEqual(['', 'Validation failed']);
    expect(setShowSuccessMessage).toHaveBeenCalledWith(false);

    expect(setServerErrors.mock.calls[0][0]).toEqual({});
    expect(setServerErrors.mock.calls[1][0]).toEqual({
      email: 'Email format is invalid on the server',
      preferredDate: 'Selected date is unavailable',
    });
  });
});

describe('parseBookingErrors', () => {
  it('normalizes heterogeneous backend responses', () => {
    const errorPayload = {
      response: {
        data: {
          errors: {
            clientPhone: ['Phone is required'],
            extra: 'Generic issue',
          },
          violations: [
            { propertyPath: 'clientName', message: 'Name is missing' },
            { propertyPath: 'nested.selectedDate', detail: 'Selected date invalid' },
          ],
        },
      },
    };

    const { fieldErrors, formError } = parseBookingErrors(errorPayload);

    expect(fieldErrors).toEqual({
      phone: 'Phone is required',
      fullName: 'Name is missing',
      preferredDate: 'Selected date invalid',
      extra: 'Generic issue',
    });
    expect(formError).toBe('');
  });

  it('falls back to default message when nothing is provided', async () => {
    const emptyError = { message: '' };
    const { fieldErrors, formError } = parseBookingErrors(emptyError);

    expect(fieldErrors).toEqual({});
    expect(formError).toBe('');

    const handler = createSubmitHandler({
      submitBookingFn: vi.fn().mockRejectedValue(new Error('Network down')),
      getSelectedDate: () => undefined,
      setSubmissionError: vi.fn(),
      setServerErrors: vi.fn(),
      setShowSuccessMessage: vi.fn(),
    });

    const resultPromise = handler({});
    await expect(resultPromise).resolves.toBeUndefined();
  });
});
