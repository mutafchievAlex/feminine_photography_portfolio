package com.feminine.api.mapper;

import com.feminine.api.domain.Inquiry;
import com.feminine.api.dto.InquiryRequest;
import com.feminine.api.dto.InquiryResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "cdi")
public interface InquiryMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "photographer", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "respondedAt", ignore = true)
    @Mapping(target = "lastPhotographerMessage", ignore = true)
    @Mapping(target = "lastClientMessage", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    Inquiry toEntity(InquiryRequest request);

    @Mapping(target = "photographer", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "respondedAt", ignore = true)
    @Mapping(target = "lastPhotographerMessage", ignore = true)
    @Mapping(target = "lastClientMessage", ignore = true)
    void updateEntity(InquiryRequest request, @MappingTarget Inquiry inquiry);

    @Mapping(target = "photographerId", source = "photographer.id")
    InquiryResponse toResponse(Inquiry inquiry);
}
