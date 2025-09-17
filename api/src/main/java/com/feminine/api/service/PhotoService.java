package com.feminine.api.service;

import com.feminine.api.audit.Audited;
import com.feminine.api.domain.Album;
import com.feminine.api.domain.Photo;
import com.feminine.api.dto.PhotoRequest;
import com.feminine.api.dto.PhotoResponse;
import com.feminine.api.infrastructure.storage.ImageStorageService;
import com.feminine.api.mapper.PhotoMapper;
import com.feminine.api.repository.PhotoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

import java.io.InputStream;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@ApplicationScoped
public class PhotoService {

    @Inject
    PhotoRepository photoRepository;

    @Inject
    AlbumService albumService;

    @Inject
    PhotoMapper photoMapper;

    @Inject
    ImageStorageService imageStorageService;

    @Audited
    @Transactional
    public PhotoResponse create(PhotoRequest request, InputStream inputStream, String fileName, String contentType) {
        Photo photo = photoMapper.toEntity(request);
        Album album = albumService.findAlbum(request.getAlbumId());
        photo.setAlbum(album);
        String imageUrl = imageStorageService.store(inputStream, fileName, contentType);
        photo.setImageUrl(imageUrl);
        photoRepository.persist(photo);
        return photoMapper.toResponse(photo);
    }

    public List<PhotoResponse> listByAlbum(UUID albumId) {
        return photoRepository.findByAlbum(albumId).stream()
                .map(photoMapper::toResponse)
                .collect(Collectors.toList());
    }

    public PhotoResponse get(UUID id) {
        return photoMapper.toResponse(findPhoto(id));
    }

    @Audited
    @Transactional
    public PhotoResponse update(UUID id, PhotoRequest request) {
        Photo photo = findPhoto(id);
        if (!photo.getAlbum().getId().equals(request.getAlbumId())) {
            Album album = albumService.findAlbum(request.getAlbumId());
            photo.setAlbum(album);
        }
        photoMapper.updateEntity(request, photo);
        return photoMapper.toResponse(photo);
    }

    @Audited
    @Transactional
    public void updateImage(UUID id, InputStream inputStream, String fileName, String contentType) {
        Photo photo = findPhoto(id);
        imageStorageService.delete(photo.getImageUrl());
        String imageUrl = imageStorageService.store(inputStream, fileName, contentType);
        photo.setImageUrl(imageUrl);
    }

    @Audited
    @Transactional
    public void delete(UUID id) {
        Photo photo = findPhoto(id);
        imageStorageService.delete(photo.getImageUrl());
        photoRepository.delete(photo);
    }

    public Photo findPhoto(UUID id) {
        return photoRepository.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Photo not found: " + id));
    }
}
