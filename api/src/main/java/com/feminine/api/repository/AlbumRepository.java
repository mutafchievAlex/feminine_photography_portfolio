package com.feminine.api.repository;

import com.feminine.api.domain.Album;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class AlbumRepository implements PanacheRepository<Album> {

    public List<Album> findByPhotographer(UUID photographerId) {
        return list("photographer.id", photographerId);
    }
}
