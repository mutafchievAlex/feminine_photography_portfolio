package com.feminine.api.config;

import io.quarkus.test.common.QuarkusTestResourceLifecycleManager;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.utility.DockerImageName;

import java.util.HashMap;
import java.util.Map;

public class PostgresResource implements QuarkusTestResourceLifecycleManager {

    private static final DockerImageName IMAGE = DockerImageName.parse("postgres:16-alpine");
    private PostgreSQLContainer<?> container;

    @Override
    public Map<String, String> start() {
        container = new PostgreSQLContainer<>(IMAGE)
                .withDatabaseName("feminine_test")
                .withUsername("test")
                .withPassword("test");
        container.start();
        Map<String, String> config = new HashMap<>();
        config.put("quarkus.datasource.jdbc.url", container.getJdbcUrl());
        config.put("quarkus.datasource.username", container.getUsername());
        config.put("quarkus.datasource.password", container.getPassword());
        return config;
    }

    @Override
    public void stop() {
        if (container != null) {
            container.stop();
        }
    }
}
