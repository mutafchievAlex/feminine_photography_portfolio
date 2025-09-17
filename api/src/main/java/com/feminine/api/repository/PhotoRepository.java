package com.feminine.api.repository;

import com.feminine.api.domain.Photo;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class PhotoRepository implements PanacheRepository<Photo> {

    public List<Photo> findByAlbum(UUID albumId) {
        return list("album.id", albumId);
    }
}
