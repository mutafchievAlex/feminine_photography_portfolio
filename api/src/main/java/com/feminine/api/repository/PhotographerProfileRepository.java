package com.feminine.api.repository;

import com.feminine.api.domain.PhotographerProfile;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class PhotographerProfileRepository implements PanacheRepository<PhotographerProfile> {
}
