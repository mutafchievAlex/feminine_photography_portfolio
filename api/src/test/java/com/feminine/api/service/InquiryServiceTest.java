package com.feminine.api.service;

import com.feminine.api.domain.Inquiry;
import com.feminine.api.domain.InquiryStatus;
import com.feminine.api.domain.PhotographerProfile;
import com.feminine.api.dto.InboundEmailRequest;
import com.feminine.api.dto.InquiryRequest;
import com.feminine.api.dto.InquiryResponse;
import com.feminine.api.dto.OutboundEmailRequest;
import com.feminine.api.mapper.InquiryMapper;
import com.feminine.api.repository.InquiryRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class InquiryServiceTest {

    @Mock
    InquiryRepository inquiryRepository;

    @Mock
    PhotographerService photographerService;

    @Mock
    InquiryMapper inquiryMapper;

    @Mock
    EmailService emailService;

    @InjectMocks
    InquiryService inquiryService;

    @Test
    void createShouldPersistAndSendNotifications() {
        UUID photographerId = UUID.randomUUID();
        InquiryRequest request = new InquiryRequest();
        request.setPhotographerId(photographerId);
        request.setClientName("Client");
        request.setClientEmail("client@test");
        Inquiry inquiry = new Inquiry();
        PhotographerProfile photographer = new PhotographerProfile();
        photographer.setId(photographerId);
        inquiry.setPhotographer(photographer);
        InquiryResponse response = new InquiryResponse();

        when(inquiryMapper.toEntity(request)).thenReturn(inquiry);
        when(photographerService.findEntity(photographerId)).thenReturn(photographer);
        when(inquiryMapper.toResponse(inquiry)).thenReturn(response);

        InquiryResponse result = inquiryService.create(request);

        verify(inquiryRepository).persist(inquiry);
        verify(emailService).sendInquiryAcknowledgement(inquiry);
        verify(emailService).sendNewInquiryNotification(inquiry);
        assertSame(response, result);
    }

    @Test
    void sendResponseShouldUpdateInquiryAndTriggerEmail() {
        UUID id = UUID.randomUUID();
        Inquiry inquiry = new Inquiry();
        OutboundEmailRequest request = new OutboundEmailRequest();
        request.setSubject("Subject");
        request.setBody("Body");
        request.setCopyPhotographer(true);
        InquiryResponse response = new InquiryResponse();

        when(inquiryRepository.findByIdOptional(id)).thenReturn(Optional.of(inquiry));
        when(inquiryMapper.toResponse(inquiry)).thenReturn(response);

        InquiryResponse result = inquiryService.sendResponse(id, request);

        verify(emailService).sendInquiryResponse(inquiry, "Subject", "Body", true);
        assertEquals(InquiryStatus.RESPONDED, inquiry.getStatus());
        assertEquals("Body", inquiry.getLastPhotographerMessage());
        assertNotNull(inquiry.getRespondedAt());
        assertSame(response, result);
    }

    @Test
    void recordClientReplyShouldStoreMessageAndResetStatus() {
        UUID id = UUID.randomUUID();
        Inquiry inquiry = new Inquiry();
        inquiry.setStatus(InquiryStatus.RESPONDED);
        inquiry.setRespondedAt(Instant.now());
        InboundEmailRequest request = new InboundEmailRequest();
        request.setFrom("client@test");
        request.setSubject("Subject");
        request.setBody("Body");
        InquiryResponse response = new InquiryResponse();

        when(inquiryRepository.findByIdOptional(id)).thenReturn(Optional.of(inquiry));
        when(inquiryMapper.toResponse(inquiry)).thenReturn(response);

        InquiryResponse result = inquiryService.recordClientReply(id, request);

        verify(emailService).recordInquiryInbound(inquiry, "client@test", "Subject", "Body");
        assertEquals("Body", inquiry.getLastClientMessage());
        assertEquals(InquiryStatus.IN_PROGRESS, inquiry.getStatus());
        assertNull(inquiry.getRespondedAt());
        assertSame(response, result);
    }
}
