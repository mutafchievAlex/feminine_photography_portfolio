package com.feminine.api.service;

import com.feminine.api.audit.Audited;
import com.feminine.api.domain.PhotographerProfile;
import com.feminine.api.dto.PhotographerProfileRequest;
import com.feminine.api.dto.PhotographerProfileResponse;
import com.feminine.api.mapper.PhotographerMapper;
import com.feminine.api.repository.PhotographerProfileRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@ApplicationScoped
public class PhotographerService {

    @Inject
    PhotographerProfileRepository repository;

    @Inject
    PhotographerMapper mapper;

    @Audited
    @Transactional
    public PhotographerProfileResponse create(PhotographerProfileRequest request) {
        PhotographerProfile entity = mapper.toEntity(request);
        repository.persist(entity);
        return mapper.toResponse(entity);
    }

    public List<PhotographerProfileResponse> listAll() {
        return repository.listAll().stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }

    public PhotographerProfileResponse get(UUID id) {
        return mapper.toResponse(findEntity(id));
    }

    @Audited
    @Transactional
    public PhotographerProfileResponse update(UUID id, PhotographerProfileRequest request) {
        PhotographerProfile entity = findEntity(id);
        mapper.updateEntity(request, entity);
        return mapper.toResponse(entity);
    }

    @Audited
    @Transactional
    public void delete(UUID id) {
        PhotographerProfile entity = findEntity(id);
        repository.delete(entity);
    }

    public PhotographerProfile findEntity(UUID id) {
        return repository.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Photographer profile not found: " + id));
    }
}
