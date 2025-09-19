package com.feminine.api.mapper;

import com.feminine.api.domain.PhotographerProfile;
import com.feminine.api.dto.PhotographerProfileRequest;
import com.feminine.api.dto.PhotographerProfileResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "cdi")
public interface PhotographerMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "albums", ignore = true)
    @Mapping(target = "inquiries", ignore = true)
    @Mapping(target = "bookings", ignore = true)
    @Mapping(target = "rating", ignore = true)
    PhotographerProfile toEntity(PhotographerProfileRequest request);

    @Mapping(target = "rating", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "albums", ignore = true)
    @Mapping(target = "inquiries", ignore = true)
    @Mapping(target = "bookings", ignore = true)
    void updateEntity(PhotographerProfileRequest request, @MappingTarget PhotographerProfile entity);

    PhotographerProfileResponse toResponse(PhotographerProfile profile);
}
