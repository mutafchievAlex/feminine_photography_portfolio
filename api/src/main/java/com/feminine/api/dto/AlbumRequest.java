package com.feminine.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.UUID;

public class AlbumRequest {

    @NotNull
    private UUID photographerId;

    @NotBlank
    private String title;

    @Size(max = 1024)
    private String description;

    private LocalDate eventDate;

    private String coverImageUrl;

    public UUID getPhotographerId() {
        return photographerId;
    }

    public void setPhotographerId(UUID photographerId) {
        this.photographerId = photographerId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }

    public String getCoverImageUrl() {
        return coverImageUrl;
    }

    public void setCoverImageUrl(String coverImageUrl) {
        this.coverImageUrl = coverImageUrl;
    }
}
