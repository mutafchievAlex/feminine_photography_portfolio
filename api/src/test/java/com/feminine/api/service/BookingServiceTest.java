package com.feminine.api.service;

import com.feminine.api.domain.Booking;
import com.feminine.api.domain.BookingStatus;
import com.feminine.api.domain.PhotographerProfile;
import com.feminine.api.dto.BookingRequest;
import com.feminine.api.dto.BookingResponse;
import com.feminine.api.dto.InboundEmailRequest;
import com.feminine.api.dto.OutboundEmailRequest;
import com.feminine.api.mapper.BookingMapper;
import com.feminine.api.repository.BookingRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    BookingRepository bookingRepository;

    @Mock
    PhotographerService photographerService;

    @Mock
    BookingMapper bookingMapper;

    @Mock
    EmailService emailService;

    @InjectMocks
    BookingService bookingService;

    @Test
    void createShouldPersistAndSendNotifications() {
        UUID photographerId = UUID.randomUUID();
        BookingRequest request = new BookingRequest();
        request.setPhotographerId(photographerId);
        Booking booking = new Booking();
        PhotographerProfile photographer = new PhotographerProfile();
        photographer.setId(photographerId);
        booking.setPhotographer(photographer);
        BookingResponse response = new BookingResponse();

        when(bookingMapper.toEntity(request)).thenReturn(booking);
        when(photographerService.findEntity(photographerId)).thenReturn(photographer);
        when(bookingMapper.toResponse(booking)).thenReturn(response);

        BookingResponse result = bookingService.create(request);

        verify(bookingRepository).persist(booking);
        verify(emailService).sendBookingAcknowledgement(booking);
        verify(emailService).sendNewBookingNotification(booking);
        assertSame(response, result);
    }

    @Test
    void sendMessageShouldUpdateBookingAndTriggerEmail() {
        UUID id = UUID.randomUUID();
        Booking booking = new Booking();
        OutboundEmailRequest request = new OutboundEmailRequest();
        request.setSubject("Subject");
        request.setBody("Body");
        request.setCopyPhotographer(true);
        BookingResponse response = new BookingResponse();

        when(bookingRepository.findByIdOptional(id)).thenReturn(Optional.of(booking));
        when(bookingMapper.toResponse(booking)).thenReturn(response);

        BookingResponse result = bookingService.sendMessage(id, request);

        verify(emailService).sendBookingMessage(booking, "Subject", "Body", true);
        assertEquals("Body", booking.getLastPhotographerMessage());
        assertSame(response, result);
    }

    @Test
    void recordClientMessageShouldStoreBody() {
        UUID id = UUID.randomUUID();
        Booking booking = new Booking();
        InboundEmailRequest request = new InboundEmailRequest();
        request.setFrom("client@test");
        request.setSubject("Subject");
        request.setBody("Body");
        BookingResponse response = new BookingResponse();

        when(bookingRepository.findByIdOptional(id)).thenReturn(Optional.of(booking));
        when(bookingMapper.toResponse(booking)).thenReturn(response);

        BookingResponse result = bookingService.recordClientMessage(id, request);

        verify(emailService).recordBookingInbound(booking, "client@test", "Subject", "Body");
        assertEquals("Body", booking.getLastClientMessage());
        assertSame(response, result);
    }

    @Test
    void updateStatusShouldSendNotification() {
        UUID id = UUID.randomUUID();
        Booking booking = new Booking();
        BookingResponse response = new BookingResponse();

        when(bookingRepository.findByIdOptional(id)).thenReturn(Optional.of(booking));
        when(bookingMapper.toResponse(booking)).thenReturn(response);

        BookingResponse result = bookingService.updateStatus(id, BookingStatus.CONFIRMED, "contract.pdf");

        verify(emailService).sendBookingStatusUpdate(booking);
        assertEquals(BookingStatus.CONFIRMED, booking.getStatus());
        assertEquals("contract.pdf", booking.getContractUrl());
        assertSame(response, result);
    }
}
