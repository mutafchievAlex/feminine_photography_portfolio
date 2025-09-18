package com.feminine.api.service;

import com.feminine.api.domain.Album;
import com.feminine.api.domain.Photo;
import com.feminine.api.dto.PhotoRequest;
import com.feminine.api.dto.PhotoResponse;
import com.feminine.api.infrastructure.storage.ImageStorageService;
import com.feminine.api.mapper.PhotoMapper;
import com.feminine.api.repository.PhotoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PhotoServiceTest {

    @Mock
    PhotoRepository photoRepository;

    @Mock
    AlbumService albumService;

    @Mock
    PhotoMapper photoMapper;

    @Mock
    ImageStorageService imageStorageService;

    @InjectMocks
    PhotoService photoService;

    PhotoRequest request;
    Photo photo;
    Album album;

    @BeforeEach
    void setUp() {
        request = new PhotoRequest();
        UUID albumId = UUID.randomUUID();
        request.setAlbumId(albumId);
        request.setTitle("Sample");
        photo = new Photo();
        album = new Album();
        album.setId(albumId);
    }

    @Test
    void createShouldPersistPhotoWithStoredImageUrl() {
        PhotoResponse response = new PhotoResponse();
        when(photoMapper.toEntity(request)).thenReturn(photo);
        when(albumService.findAlbum(request.getAlbumId())).thenReturn(album);
        when(imageStorageService.store(any(InputStream.class), eq("upload.png"), eq("image/png")))
                .thenReturn("stored/url");
        when(photoMapper.toResponse(photo)).thenReturn(response);

        InputStream inputStream = new ByteArrayInputStream("image".getBytes());
        PhotoResponse result = photoService.create(request, inputStream, "upload.png", "image/png");
        assertSame(response, result);

        verify(photoRepository).persist(photo);
        assertSame(album, photo.getAlbum());
        assertEquals("stored/url", photo.getImageUrl());
    }

    @Test
    void updateImageShouldReplaceStoredAsset() {
        UUID photoId = UUID.randomUUID();
        photo.setImageUrl("old/url");
        when(photoRepository.findByIdOptional(photoId)).thenReturn(Optional.of(photo));
        when(imageStorageService.store(any(InputStream.class), eq("new.jpg"), eq("image/jpeg")))
                .thenReturn("new/url");

        InputStream inputStream = new ByteArrayInputStream("new data".getBytes());
        photoService.updateImage(photoId, inputStream, "new.jpg", "image/jpeg");

        verify(imageStorageService).delete("old/url");
        assertEquals("new/url", photo.getImageUrl());
    }

    @Test
    void deleteShouldRemovePhotoAndStoredAsset() {
        UUID photoId = UUID.randomUUID();
        photo.setImageUrl("stored/url");
        when(photoRepository.findByIdOptional(photoId)).thenReturn(Optional.of(photo));

        photoService.delete(photoId);

        verify(imageStorageService).delete("stored/url");
        verify(photoRepository).delete(photo);
        verifyNoMoreInteractions(imageStorageService);
    }
}
