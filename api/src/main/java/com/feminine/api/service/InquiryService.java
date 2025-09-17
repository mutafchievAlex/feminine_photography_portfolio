package com.feminine.api.service;

import com.feminine.api.audit.Audited;
import com.feminine.api.domain.Inquiry;
import com.feminine.api.domain.InquiryStatus;
import com.feminine.api.dto.InquiryRequest;
import com.feminine.api.dto.InquiryResponse;
import com.feminine.api.mapper.InquiryMapper;
import com.feminine.api.repository.InquiryRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@ApplicationScoped
public class InquiryService {

    @Inject
    InquiryRepository inquiryRepository;

    @Inject
    PhotographerService photographerService;

    @Inject
    InquiryMapper inquiryMapper;

    @Audited
    @Transactional
    public InquiryResponse create(InquiryRequest request) {
        Inquiry inquiry = inquiryMapper.toEntity(request);
        inquiry.setPhotographer(photographerService.findEntity(request.getPhotographerId()));
        inquiryRepository.persist(inquiry);
        return inquiryMapper.toResponse(inquiry);
    }

    public List<InquiryResponse> listByPhotographer(UUID photographerId) {
        return inquiryRepository.findByPhotographer(photographerId).stream()
                .map(inquiryMapper::toResponse)
                .collect(Collectors.toList());
    }

    public InquiryResponse get(UUID id) {
        return inquiryMapper.toResponse(findInquiry(id));
    }

    @Audited
    @Transactional
    public InquiryResponse update(UUID id, InquiryRequest request) {
        Inquiry inquiry = findInquiry(id);
        if (!inquiry.getPhotographer().getId().equals(request.getPhotographerId())) {
            inquiry.setPhotographer(photographerService.findEntity(request.getPhotographerId()));
        }
        inquiryMapper.updateEntity(request, inquiry);
        return inquiryMapper.toResponse(inquiry);
    }

    @Audited
    @Transactional
    public InquiryResponse updateStatus(UUID id, InquiryStatus status) {
        Inquiry inquiry = findInquiry(id);
        inquiry.setStatus(status);
        if (status == InquiryStatus.RESPONDED) {
            inquiry.setRespondedAt(Instant.now());
        }
        return inquiryMapper.toResponse(inquiry);
    }

    @Audited
    @Transactional
    public void delete(UUID id) {
        Inquiry inquiry = findInquiry(id);
        inquiryRepository.delete(inquiry);
    }

    public Inquiry findInquiry(UUID id) {
        return inquiryRepository.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Inquiry not found: " + id));
    }
}
