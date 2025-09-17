package com.feminine.api.dto;

import com.feminine.api.domain.BookingStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public class BookingResponse {

    private UUID id;
    private UUID photographerId;
    private String clientName;
    private String clientEmail;
    private LocalDate eventDate;
    private String location;
    private String lastPhotographerMessage;
    private String lastClientMessage;
    private BookingStatus status;
    private String contractUrl;
    private BigDecimal totalAmount;
    private Instant createdAt;
    private Instant updatedAt;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

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

    public LocalDate getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
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

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public String getContractUrl() {
        return contractUrl;
    }

    public void setContractUrl(String contractUrl) {
        this.contractUrl = contractUrl;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
