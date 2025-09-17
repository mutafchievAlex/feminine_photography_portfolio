package com.feminine.api.service;

import com.feminine.api.audit.Audited;
import com.feminine.api.domain.Booking;
import com.feminine.api.domain.BookingStatus;
import com.feminine.api.dto.BookingRequest;
import com.feminine.api.dto.BookingResponse;
import com.feminine.api.mapper.BookingMapper;
import com.feminine.api.repository.BookingRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@ApplicationScoped
public class BookingService {

    @Inject
    BookingRepository bookingRepository;

    @Inject
    PhotographerService photographerService;

    @Inject
    BookingMapper bookingMapper;

    @Audited
    @Transactional
    public BookingResponse create(BookingRequest request) {
        Booking booking = bookingMapper.toEntity(request);
        booking.setPhotographer(photographerService.findEntity(request.getPhotographerId()));
        bookingRepository.persist(booking);
        return bookingMapper.toResponse(booking);
    }

    public List<BookingResponse> listByPhotographer(UUID photographerId) {
        return bookingRepository.findByPhotographer(photographerId).stream()
                .map(bookingMapper::toResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse get(UUID id) {
        return bookingMapper.toResponse(findBooking(id));
    }

    @Audited
    @Transactional
    public BookingResponse update(UUID id, BookingRequest request) {
        Booking booking = findBooking(id);
        if (!booking.getPhotographer().getId().equals(request.getPhotographerId())) {
            booking.setPhotographer(photographerService.findEntity(request.getPhotographerId()));
        }
        bookingMapper.updateEntity(request, booking);
        return bookingMapper.toResponse(booking);
    }

    @Audited
    @Transactional
    public BookingResponse updateStatus(UUID id, BookingStatus status, String contractUrl) {
        Booking booking = findBooking(id);
        booking.setStatus(status);
        if (contractUrl != null && !contractUrl.isBlank()) {
            booking.setContractUrl(contractUrl);
        }
        return bookingMapper.toResponse(booking);
    }

    @Audited
    @Transactional
    public void delete(UUID id) {
        Booking booking = findBooking(id);
        bookingRepository.delete(booking);
    }

    public long countUpcomingConfirmed(UUID photographerId, LocalDate from) {
        return bookingRepository.countUpcomingConfirmed(photographerId, from);
    }

    public Booking findBooking(UUID id) {
        return bookingRepository.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Booking not found: " + id));
    }
}
