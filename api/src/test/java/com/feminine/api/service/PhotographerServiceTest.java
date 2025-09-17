package com.feminine.api.service;

import com.feminine.api.domain.PhotographerProfile;
import com.feminine.api.dto.PhotographerProfileRequest;
import com.feminine.api.dto.PhotographerProfileResponse;
import com.feminine.api.mapper.PhotographerMapper;
import com.feminine.api.repository.PhotographerProfileRepository;
import jakarta.ws.rs.NotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PhotographerServiceTest {

    @Mock
    PhotographerProfileRepository repository;

    @Mock
    PhotographerMapper mapper;

    @InjectMocks
    PhotographerService service;

    @Test
    void createShouldPersistAndReturnResponse() {
        PhotographerProfileRequest request = new PhotographerProfileRequest();
        PhotographerProfile entity = new PhotographerProfile();
        PhotographerProfileResponse response = new PhotographerProfileResponse();

        when(mapper.toEntity(request)).thenReturn(entity);
        when(mapper.toResponse(entity)).thenReturn(response);

        PhotographerProfileResponse result = service.create(request);

        verify(repository).persist(entity);
        assertSame(response, result);
    }

    @Test
    void listAllShouldMapEntities() {
        PhotographerProfile entity = new PhotographerProfile();
        PhotographerProfileResponse response = new PhotographerProfileResponse();
        when(repository.listAll()).thenReturn(List.of(entity));
        when(mapper.toResponse(entity)).thenReturn(response);

        List<PhotographerProfileResponse> responses = service.listAll();

        assertEquals(List.of(response), responses);
    }

    @Test
    void findEntityShouldThrowWhenMissing() {
        UUID id = UUID.randomUUID();
        when(repository.findByIdOptional(id)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> service.findEntity(id));
    }
}
