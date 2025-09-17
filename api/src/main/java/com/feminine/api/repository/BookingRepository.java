package com.feminine.api.repository;

import com.feminine.api.domain.Booking;
import com.feminine.api.domain.BookingStatus;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class BookingRepository implements PanacheRepository<Booking> {

    public List<Booking> findByPhotographer(UUID photographerId) {
        return list("photographer.id", photographerId);
    }

    public long countUpcomingConfirmed(UUID photographerId, LocalDate from) {
        return count("photographer.id = ?1 and status = ?2 and eventDate >= ?3",
                photographerId, BookingStatus.CONFIRMED, from);
    }
}
