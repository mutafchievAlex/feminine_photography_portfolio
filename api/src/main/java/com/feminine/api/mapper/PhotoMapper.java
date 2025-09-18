package com.feminine.api.mapper;

import com.feminine.api.domain.Photo;
import com.feminine.api.dto.PhotoRequest;
import com.feminine.api.dto.PhotoResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "cdi")
public interface PhotoMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "album", ignore = true)
    @Mapping(target = "imageUrl", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    Photo toEntity(PhotoRequest request);

    @Mapping(target = "album", ignore = true)
    @Mapping(target = "imageUrl", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    void updateEntity(PhotoRequest request, @MappingTarget Photo photo);

    @Mapping(target = "albumId", source = "album.id")
    PhotoResponse toResponse(Photo photo);
}
