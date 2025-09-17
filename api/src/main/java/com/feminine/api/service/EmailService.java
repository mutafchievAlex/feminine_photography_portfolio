package com.feminine.api.service;

import com.feminine.api.domain.Booking;
import com.feminine.api.domain.Inquiry;
import io.quarkus.mailer.Mail;
import io.quarkus.mailer.Mailer;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;

import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@ApplicationScoped
public class EmailService {

    private static final Logger LOGGER = Logger.getLogger(EmailService.class);
    private static final DateTimeFormatter INSTANT_FORMATTER = DateTimeFormatter.ISO_INSTANT;

    private final Mailer mailer;
    private final String notificationsFrom;
    private final Optional<String> notificationCopy;

    @Inject
    public EmailService(Mailer mailer,
                        @ConfigProperty(name = "mail.notifications.from", defaultValue = "no-reply@feminine-portfolio.test") String notificationsFrom,
                        @ConfigProperty(name = "mail.notifications.copy", defaultValue = "") String notificationCopy) {
        this.mailer = mailer;
        this.notificationsFrom = notificationsFrom == null ? "no-reply@feminine-portfolio.test" : notificationsFrom;
        this.notificationCopy = Optional.ofNullable(notificationCopy)
                .map(String::trim)
                .filter(value -> !value.isEmpty());
    }

    public void sendNewInquiryNotification(Inquiry inquiry) {
        if (inquiry == null || inquiry.getPhotographer() == null) {
            return;
        }
        String recipient = inquiry.getPhotographer().getEmail();
        if (isBlank(recipient)) {
            LOGGER.debug("Skipping inquiry notification because photographer email is missing");
            return;
        }
        String subject = String.format("New inquiry from %s", valueOrFallback(inquiry.getClientName(), "a potential client"));
        String body = """
                Hello %s,

                You received a new inquiry from %s (%s).

                Desired event time: %s

                Message:
                %s

                You can reply directly to this email to contact the client.
                """.formatted(
                valueOrFallback(inquiry.getPhotographer().getFullName(), "there"),
                valueOrFallback(inquiry.getClientName(), "a potential client"),
                valueOrFallback(inquiry.getClientEmail(), "unknown address"),
                formatInstant(inquiry.getDesiredEventAt()),
                valueOrFallback(inquiry.getMessage(), "(no message provided)"));

        Mail mail = prepareMail(recipient, subject, body);
        if (!isBlank(inquiry.getClientEmail())) {
            mail.setReplyTo(inquiry.getClientEmail());
        }
        safeSend(mail, "new inquiry", recipient);
    }

    public void sendInquiryAcknowledgement(Inquiry inquiry) {
        if (inquiry == null) {
            return;
        }
        String recipient = inquiry.getClientEmail();
        if (isBlank(recipient)) {
            LOGGER.debug("Skipping inquiry acknowledgement because client email is missing");
            return;
        }
        String subject = "We received your inquiry";
        String body = """
                Hi %s,

                Thank you for reaching out to %s. We'll review your message and respond shortly.

                Summary of your inquiry:
                Desired event time: %s
                Message: %s

                If you have additional details to share, simply reply to this email.
                """.formatted(
                valueOrFallback(inquiry.getClientName(), "there"),
                inquiry.getPhotographer() != null ? valueOrFallback(inquiry.getPhotographer().getFullName(), "our team") : "our team",
                formatInstant(inquiry.getDesiredEventAt()),
                valueOrFallback(inquiry.getMessage(), "(no message provided)"));

        Mail mail = prepareMail(recipient, subject, body);
        if (inquiry.getPhotographer() != null && !isBlank(inquiry.getPhotographer().getEmail())) {
            mail.setReplyTo(inquiry.getPhotographer().getEmail());
        }
        safeSend(mail, "inquiry acknowledgement", recipient);
    }

    public void sendInquiryResponse(Inquiry inquiry, String subject, String body, boolean copyPhotographer) {
        if (inquiry == null) {
            return;
        }
        String recipient = inquiry.getClientEmail();
        if (isBlank(recipient)) {
            LOGGER.debug("Skipping inquiry response because client email is missing");
            return;
        }
        Mail mail = prepareMail(recipient, subject, body);
        if (copyPhotographer && inquiry.getPhotographer() != null && !isBlank(inquiry.getPhotographer().getEmail())) {
            mail.addCc(inquiry.getPhotographer().getEmail());
        }
        if (inquiry.getPhotographer() != null && !isBlank(inquiry.getPhotographer().getEmail())) {
            mail.setReplyTo(inquiry.getPhotographer().getEmail());
        }
        safeSend(mail, "inquiry response", recipient);
    }

    public void recordInquiryInbound(Inquiry inquiry, String from, String subject, String body) {
        if (inquiry == null || inquiry.getPhotographer() == null) {
            return;
        }
        String recipient = inquiry.getPhotographer().getEmail();
        if (isBlank(recipient)) {
            LOGGER.debug("Skipping inbound inquiry notification because photographer email is missing");
            return;
        }
        String mailSubject = "Client replied: " + valueOrFallback(subject, "New message");
        String mailBody = """
                A client replied to your conversation.

                From: %s
                Inquiry: %s

                Message:
                %s
                """.formatted(
                valueOrFallback(from, "unknown sender"),
                inquiry.getId(),
                valueOrFallback(body, "(no content)"));

        Mail mail = prepareMail(recipient, mailSubject, mailBody);
        if (!isBlank(from)) {
            mail.setReplyTo(from);
        }
        safeSend(mail, "inquiry inbound", recipient);
    }

    public void sendNewBookingNotification(Booking booking) {
        if (booking == null || booking.getPhotographer() == null) {
            return;
        }
        String recipient = booking.getPhotographer().getEmail();
        if (isBlank(recipient)) {
            LOGGER.debug("Skipping booking notification because photographer email is missing");
            return;
        }
        String subject = String.format("New booking request from %s", valueOrFallback(booking.getClientName(), "a client"));
        String body = """
                Hello %s,

                A new booking request was submitted by %s (%s).

                Event date: %s
                Location: %s
                Package total: %s

                Sign in to review the request and update its status.
                """.formatted(
                valueOrFallback(booking.getPhotographer().getFullName(), "there"),
                valueOrFallback(booking.getClientName(), "a client"),
                valueOrFallback(booking.getClientEmail(), "unknown address"),
                booking.getEventDate() != null ? booking.getEventDate() : "TBD",
                valueOrFallback(booking.getLocation(), "TBD"),
                booking.getTotalAmount() != null ? booking.getTotalAmount() : "TBD");

        Mail mail = prepareMail(recipient, subject, body);
        if (!isBlank(booking.getClientEmail())) {
            mail.setReplyTo(booking.getClientEmail());
        }
        safeSend(mail, "booking notification", recipient);
    }

    public void sendBookingAcknowledgement(Booking booking) {
        if (booking == null) {
            return;
        }
        String recipient = booking.getClientEmail();
        if (isBlank(recipient)) {
            LOGGER.debug("Skipping booking acknowledgement because client email is missing");
            return;
        }
        String subject = "We received your booking request";
        String body = """
                Hi %s,

                Thank you for booking with %s. We'll confirm the details shortly.

                Event date: %s
                Location: %s

                You can reply to this email if anything changes.
                """.formatted(
                valueOrFallback(booking.getClientName(), "there"),
                booking.getPhotographer() != null ? valueOrFallback(booking.getPhotographer().getFullName(), "our team") : "our team",
                booking.getEventDate() != null ? booking.getEventDate() : "TBD",
                valueOrFallback(booking.getLocation(), "TBD"));

        Mail mail = prepareMail(recipient, subject, body);
        if (booking.getPhotographer() != null && !isBlank(booking.getPhotographer().getEmail())) {
            mail.setReplyTo(booking.getPhotographer().getEmail());
        }
        safeSend(mail, "booking acknowledgement", recipient);
    }

    public void sendBookingStatusUpdate(Booking booking) {
        if (booking == null) {
            return;
        }
        String recipient = booking.getClientEmail();
        if (isBlank(recipient)) {
            LOGGER.debug("Skipping booking status update because client email is missing");
            return;
        }
        String subject = String.format("Your booking is now %s", booking.getStatus());
        String body = """
                Hi %s,

                Your booking with %s is now marked as %s.
                Event date: %s
                Location: %s
                Contract: %s

                Reply to this email if you have any questions.
                """.formatted(
                valueOrFallback(booking.getClientName(), "there"),
                booking.getPhotographer() != null ? valueOrFallback(booking.getPhotographer().getFullName(), "our team") : "our team",
                booking.getStatus(),
                booking.getEventDate() != null ? booking.getEventDate() : "TBD",
                valueOrFallback(booking.getLocation(), "TBD"),
                valueOrFallback(booking.getContractUrl(), "pending"));

        Mail mail = prepareMail(recipient, subject, body);
        if (booking.getPhotographer() != null && !isBlank(booking.getPhotographer().getEmail())) {
            mail.setReplyTo(booking.getPhotographer().getEmail());
        }
        safeSend(mail, "booking status update", recipient);
    }

    public void sendBookingMessage(Booking booking, String subject, String body, boolean copyPhotographer) {
        if (booking == null) {
            return;
        }
        String recipient = booking.getClientEmail();
        if (isBlank(recipient)) {
            LOGGER.debug("Skipping booking message because client email is missing");
            return;
        }
        Mail mail = prepareMail(recipient, subject, body);
        if (copyPhotographer && booking.getPhotographer() != null && !isBlank(booking.getPhotographer().getEmail())) {
            mail.addCc(booking.getPhotographer().getEmail());
        }
        if (booking.getPhotographer() != null && !isBlank(booking.getPhotographer().getEmail())) {
            mail.setReplyTo(booking.getPhotographer().getEmail());
        }
        safeSend(mail, "booking message", recipient);
    }

    public void recordBookingInbound(Booking booking, String from, String subject, String body) {
        if (booking == null || booking.getPhotographer() == null) {
            return;
        }
        String recipient = booking.getPhotographer().getEmail();
        if (isBlank(recipient)) {
            LOGGER.debug("Skipping inbound booking notification because photographer email is missing");
            return;
        }
        String mailSubject = "Client replied about booking: " + valueOrFallback(subject, "New message");
        String mailBody = """
                A client responded regarding booking %s.

                From: %s

                Message:
                %s
                """.formatted(
                booking.getId(),
                valueOrFallback(from, "unknown sender"),
                valueOrFallback(body, "(no content)"));

        Mail mail = prepareMail(recipient, mailSubject, mailBody);
        if (!isBlank(from)) {
            mail.setReplyTo(from);
        }
        safeSend(mail, "booking inbound", recipient);
    }

    private Mail prepareMail(String to, String subject, String body) {
        Mail mail = Mail.withText(to, subject, body);
        if (!isBlank(notificationsFrom)) {
            mail.setFrom(notificationsFrom);
        }
        notificationCopy.ifPresent(mail::addBcc);
        return mail;
    }

    private void safeSend(Mail mail, String context, String recipient) {
        try {
            mailer.send(mail);
        } catch (Exception ex) {
            LOGGER.warnf(ex, "Failed to send %s email to %s", context, recipient);
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private String valueOrFallback(String value, String fallback) {
        return isBlank(value) ? fallback : value;
    }

    private String formatInstant(Instant instant) {
        return instant == null ? "TBD" : INSTANT_FORMATTER.format(instant);
    }
}
