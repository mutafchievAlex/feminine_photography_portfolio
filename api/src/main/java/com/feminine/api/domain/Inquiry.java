package com.feminine.api.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "inquiries")
public class Inquiry extends BaseEntity {

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "photographer_id")
    private PhotographerProfile photographer;

    @Column(name = "client_name", nullable = false)
    private String clientName;

    @Column(name = "client_email", nullable = false)
    private String clientEmail;

    @Column(length = 2048)
    private String message;

    @Column(name = "last_photographer_message", length = 2048)
    private String lastPhotographerMessage;

    @Column(name = "last_client_message", length = 2048)
    private String lastClientMessage;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InquiryStatus status = InquiryStatus.NEW;

    @Column(name = "desired_event_at")
    private Instant desiredEventAt;

    @Column(name = "responded_at")
    private Instant respondedAt;

    public PhotographerProfile getPhotographer() {
        return photographer;
    }

    public void setPhotographer(PhotographerProfile photographer) {
        this.photographer = photographer;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public String getClientEmail() {
        return clientEmail;
    }

    public void setClientEmail(String clientEmail) {
        this.clientEmail = clientEmail;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getLastPhotographerMessage() {
        return lastPhotographerMessage;
    }

    public void setLastPhotographerMessage(String lastPhotographerMessage) {
        this.lastPhotographerMessage = lastPhotographerMessage;
    }

    public String getLastClientMessage() {
        return lastClientMessage;
    }

    public void setLastClientMessage(String lastClientMessage) {
        this.lastClientMessage = lastClientMessage;
    }

    public InquiryStatus getStatus() {
        return status;
    }

    public void setStatus(InquiryStatus status) {
        this.status = status;
    }

    public Instant getDesiredEventAt() {
        return desiredEventAt;
    }

    public void setDesiredEventAt(Instant desiredEventAt) {
        this.desiredEventAt = desiredEventAt;
    }

    public Instant getRespondedAt() {
        return respondedAt;
    }

    public void setRespondedAt(Instant respondedAt) {
        this.respondedAt = respondedAt;
    }
}
