package com.feminine.api.service;

import com.feminine.api.domain.Booking;
import com.feminine.api.domain.Inquiry;
import com.feminine.api.domain.PhotographerProfile;
import io.quarkus.mailer.Mail;
import io.quarkus.mailer.Mailer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock
    Mailer mailer;

    EmailService emailService;

    @BeforeEach
    void setUp() {
        emailService = new EmailService(mailer, "no-reply@test", "");
    }

    @Test
    void sendNewInquiryNotificationShouldTargetPhotographer() {
        Inquiry inquiry = new Inquiry();
        PhotographerProfile photographer = new PhotographerProfile();
        photographer.setEmail("photographer@test");
        photographer.setFullName("Pro Photographer");
        inquiry.setPhotographer(photographer);
        inquiry.setClientName("Client");
        inquiry.setClientEmail("client@test");
        inquiry.setMessage("Hello there");

        emailService.sendNewInquiryNotification(inquiry);

        ArgumentCaptor<Mail> captor = ArgumentCaptor.forClass(Mail.class);
        verify(mailer).send(captor.capture());
        Mail mail = captor.getValue();
        assertTrue(mail.getTo().contains("photographer@test"));
        assertEquals("client@test", mail.getReplyTo());
    }

    @Test
    void sendBookingMessageShouldCopyPhotographerWhenRequested() {
        Booking booking = new Booking();
        booking.setClientEmail("client@test");
        PhotographerProfile photographer = new PhotographerProfile();
        photographer.setEmail("photographer@test");
        photographer.setFullName("Pro Photographer");
        booking.setPhotographer(photographer);

        emailService.sendBookingMessage(booking, "Subject", "Body", true);

        ArgumentCaptor<Mail> captor = ArgumentCaptor.forClass(Mail.class);
        verify(mailer).send(captor.capture());
        Mail mail = captor.getValue();
        assertTrue(mail.getTo().contains("client@test"));
        assertTrue(mail.getCc().contains("photographer@test"));
    }

    @Test
    void recordInquiryInboundShouldSetReplyToSender() {
        Inquiry inquiry = new Inquiry();
        PhotographerProfile photographer = new PhotographerProfile();
        photographer.setEmail("photographer@test");
        inquiry.setPhotographer(photographer);

        emailService.recordInquiryInbound(inquiry, "client@test", "Re: Hello", "Follow up message");

        ArgumentCaptor<Mail> captor = ArgumentCaptor.forClass(Mail.class);
        verify(mailer).send(captor.capture());
        Mail mail = captor.getValue();
        assertEquals("client@test", mail.getReplyTo());
    }
}
