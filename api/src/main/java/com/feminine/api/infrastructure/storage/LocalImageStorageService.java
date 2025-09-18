package com.feminine.api.infrastructure.storage;

import io.quarkus.arc.profile.UnlessBuildProfile;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.UUID;

/**
 * Stores uploaded images on the local filesystem. Activated for every profile
 * except {@code prod} where the S3 backed implementation is used.
 */
@ApplicationScoped
@UnlessBuildProfile("prod")
public class LocalImageStorageService implements ImageStorageService {

    private static final Logger LOGGER = Logger.getLogger(LocalImageStorageService.class);

    private final Path storageRoot;

    public LocalImageStorageService(@ConfigProperty(name = "app.storage.local.path") String storagePath) {
        this.storageRoot = Paths.get(storagePath).toAbsolutePath().normalize();
    }

    @PostConstruct
    void init() {
        try {
            Files.createDirectories(storageRoot);
        } catch (IOException e) {
            throw new ImageStorageException("Failed to create image storage directory: " + storageRoot, e);
        }
    }

    @Override
    public String store(InputStream inputStream, String fileName, String contentType) {
        String key = generateFileName(fileName);
        Path target = storageRoot.resolve(key).normalize();
        try (InputStream stream = inputStream) {
            Files.createDirectories(target.getParent());
            Files.copy(stream, target, StandardCopyOption.REPLACE_EXISTING);
            return target.toAbsolutePath().toString().replace('\\', '/');
        } catch (IOException e) {
            throw new ImageStorageException("Failed to store image on local filesystem", e);
        }
    }

    @Override
    public void delete(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) {
            return;
        }
        try {
            Path storedPath = toStoredPath(imageUrl);
            Files.deleteIfExists(storedPath);
        } catch (Exception e) {
            LOGGER.warnf(e, "Failed to delete stored image %s", imageUrl);
        }
    }

    private Path toStoredPath(String imageUrl) {
        Path candidate;
        try {
            candidate = Paths.get(imageUrl);
        } catch (Exception ex) {
            candidate = Paths.get(imageUrl.replaceFirst("^[a-zA-Z]+://", ""));
        }
        if (!candidate.isAbsolute()) {
            candidate = storageRoot.resolve(candidate).normalize();
        }
        if (!candidate.startsWith(storageRoot)) {
            throw new ImageStorageException("Resolved image path is outside the configured storage directory");
        }
        return candidate;
    }

    private String generateFileName(String fileName) {
        String extension = extractExtension(fileName);
        return UUID.randomUUID() + extension;
    }

    private String extractExtension(String fileName) {
        if (fileName == null || fileName.isBlank()) {
            return "";
        }
        int lastDot = fileName.lastIndexOf('.');
        if (lastDot == -1 || lastDot == fileName.length() - 1) {
            return "";
        }
        return fileName.substring(lastDot).toLowerCase(Locale.ROOT);
    }
}
