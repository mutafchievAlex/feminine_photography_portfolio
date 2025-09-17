package com.feminine.api.dto;

import java.time.LocalDate;
import java.util.UUID;

public class AlbumResponse {

    private UUID id;
    private UUID photographerId;
    private String title;
    private String description;
    private LocalDate eventDate;
    private String coverImageUrl;
    private int photoCount;

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

    public int getPhotoCount() {
        return photoCount;
    }

    public void setPhotoCount(int photoCount) {
        this.photoCount = photoCount;
    }
}
