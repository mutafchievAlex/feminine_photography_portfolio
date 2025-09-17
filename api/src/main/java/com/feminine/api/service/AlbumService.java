package com.feminine.api.service;

import com.feminine.api.audit.Audited;
import com.feminine.api.domain.Album;
import com.feminine.api.domain.PhotographerProfile;
import com.feminine.api.dto.AlbumRequest;
import com.feminine.api.dto.AlbumResponse;
import com.feminine.api.mapper.AlbumMapper;
import com.feminine.api.repository.AlbumRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@ApplicationScoped
public class AlbumService {

    @Inject
    AlbumRepository albumRepository;

    @Inject
    PhotographerService photographerService;

    @Inject
    AlbumMapper albumMapper;

    @Audited
    @Transactional
    public AlbumResponse create(AlbumRequest request) {
        Album album = albumMapper.toEntity(request);
        PhotographerProfile photographer = photographerService.findEntity(request.getPhotographerId());
        album.setPhotographer(photographer);
        albumRepository.persist(album);
        return albumMapper.toResponse(album);
    }

    public List<AlbumResponse> listByPhotographer(UUID photographerId) {
        return albumRepository.findByPhotographer(photographerId).stream()
                .map(albumMapper::toResponse)
                .collect(Collectors.toList());
    }

    public AlbumResponse get(UUID id) {
        return albumMapper.toResponse(findAlbum(id));
    }

    @Audited
    @Transactional
    public AlbumResponse update(UUID id, AlbumRequest request) {
        Album album = findAlbum(id);
        if (!album.getPhotographer().getId().equals(request.getPhotographerId())) {
            PhotographerProfile photographer = photographerService.findEntity(request.getPhotographerId());
            album.setPhotographer(photographer);
        }
        albumMapper.updateEntity(request, album);
        return albumMapper.toResponse(album);
    }

    @Audited
    @Transactional
    public void delete(UUID id) {
        Album album = findAlbum(id);
        albumRepository.delete(album);
    }

    public Album findAlbum(UUID id) {
        return albumRepository.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Album not found: " + id));
    }
}
