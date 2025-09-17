package com.feminine.api.mapper;

import com.feminine.api.domain.Album;
import com.feminine.api.dto.AlbumRequest;
import com.feminine.api.dto.AlbumResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "cdi")
public interface AlbumMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "photographer", ignore = true)
    @Mapping(target = "photos", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    Album toEntity(AlbumRequest request);

    @Mapping(target = "photographer", ignore = true)
    @Mapping(target = "photos", ignore = true)
    void updateEntity(AlbumRequest request, @MappingTarget Album album);

    @Mapping(target = "photographerId", source = "photographer.id")
    @Mapping(target = "photoCount", expression = "java(album.getPhotos() != null ? album.getPhotos().size() : 0)")
    AlbumResponse toResponse(Album album);
}
