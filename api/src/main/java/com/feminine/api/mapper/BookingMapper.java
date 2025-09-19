package com.feminine.api.mapper;

import com.feminine.api.domain.Booking;
import com.feminine.api.dto.BookingRequest;
import com.feminine.api.dto.BookingResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "cdi")
public interface BookingMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "photographer", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "contractUrl", ignore = true)
    @Mapping(target = "lastPhotographerMessage", ignore = true)
    @Mapping(target = "lastClientMessage", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    Booking toEntity(BookingRequest request);

    @Mapping(target = "photographer", ignore = true)
    @Mapping(target = "lastPhotographerMessage", ignore = true)
    @Mapping(target = "lastClientMessage", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "contractUrl", ignore = true)
    void updateEntity(BookingRequest request, @MappingTarget Booking booking);

    @Mapping(target = "photographerId", source = "photographer.id")
    BookingResponse toResponse(Booking booking);
}
