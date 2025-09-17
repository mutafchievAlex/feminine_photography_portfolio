package com.feminine.api.health;

import io.agroal.api.AgroalDataSource;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.health.HealthCheck;
import org.eclipse.microprofile.health.HealthCheckResponse;
import org.eclipse.microprofile.health.Readiness;

import java.sql.Connection;
import java.sql.SQLException;

@Readiness
@ApplicationScoped
public class DatabaseHealthCheck implements HealthCheck {

    @Inject
    AgroalDataSource dataSource;

    @Override
    public HealthCheckResponse call() {
        try (Connection connection = dataSource.getConnection()) {
            return HealthCheckResponse.up("database");
        } catch (SQLException e) {
            return HealthCheckResponse.down("database").withData("error", e.getMessage()).build();
        }
    }
}
