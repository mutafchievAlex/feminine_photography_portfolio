package com.feminine.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.UUID;

public class InquiryRequest {

    @NotNull
    private UUID photographerId;

    @NotBlank
    private String clientName;

    @NotBlank
    @Email
    private String clientEmail;

    @Size(max = 2048)
    private String message;

    private Instant desiredEventAt;

    public UUID getPhotographerId() {
        return photographerId;
    }

    public void setPhotographerId(UUID photographerId) {
        this.photographerId = photographerId;
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

    public Instant getDesiredEventAt() {
        return desiredEventAt;
    }

    public void setDesiredEventAt(Instant desiredEventAt) {
        this.desiredEventAt = desiredEventAt;
    }
}
