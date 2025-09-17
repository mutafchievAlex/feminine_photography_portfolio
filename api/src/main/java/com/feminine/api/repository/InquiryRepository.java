package com.feminine.api.repository;

import com.feminine.api.domain.Inquiry;
import com.feminine.api.domain.InquiryStatus;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class InquiryRepository implements PanacheRepository<Inquiry> {

    public List<Inquiry> findByPhotographer(UUID photographerId) {
        return list("photographer.id", photographerId);
    }

    public long countOpenInquiries(UUID photographerId) {
        return count("photographer.id = ?1 and status in ?2", photographerId,
                List.of(InquiryStatus.NEW, InquiryStatus.IN_PROGRESS));
    }
}
