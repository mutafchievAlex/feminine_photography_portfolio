package com.feminine.api.infrastructure.storage;

import io.quarkus.arc.properties.IfBuildProperty;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.InvalidPathException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;

/**
 * Local filesystem-backed implementation of {@link ImageStorageService}.
 */
@ApplicationScoped
@IfBuildProperty(name = "app.storage.s3.bucket", stringValue = "", enableIfMissing = true)
public class LocalImageStorageService implements ImageStorageService {

    private final Path storageDirectory;

    public LocalImageStorageService(@ConfigProperty(name = "app.storage.local.path") String storagePath) {
        this.storageDirectory = Paths.get(Objects.requireNonNull(storagePath, "storagePath")).toAbsolutePath().normalize();
    }

    @PostConstruct
    void init() {
        try {
            Files.createDirectories(storageDirectory);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to initialize local image storage directory: " + storageDirectory, e);
        }
    }

    @Override
    public String store(InputStream inputStream, String fileName, String contentType) {
        Objects.requireNonNull(inputStream, "inputStream");
        String extension = resolveExtension(fileName, contentType);
        String generatedName = UUID.randomUUID().toString();
        if (!extension.isBlank()) {
            generatedName = generatedName + "." + extension;
        }
        Path destination = storageDirectory.resolve(generatedName);
        try {
            Files.createDirectories(destination.getParent());
            Files.copy(inputStream, destination, StandardCopyOption.REPLACE_EXISTING);
            return destination.toString();
        } catch (IOException e) {
            throw new IllegalStateException("Failed to store image %s".formatted(fileName), e);
        }
    }

    @Override
    public void delete(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) {
            return;
        }
        Path filePath = resolvePath(imageUrl);
        try {
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to delete image " + imageUrl, e);
        }
    }

    Path resolvePath(String imageUrl) {
        try {
            if (imageUrl.startsWith("file:")) {
                Path path = Paths.get(URI.create(imageUrl));
                return validatePath(path);
            }
            Path path = Paths.get(imageUrl);
            if (!path.isAbsolute()) {
                path = storageDirectory.resolve(path);
            }
            return validatePath(path);
        } catch (InvalidPathException | IllegalArgumentException e) {
            throw new IllegalStateException("Image URL does not point to a valid local path: " + imageUrl, e);
        }
    }

    private Path validatePath(Path candidate) {
        Path normalized = candidate.normalize();
        if (!normalized.startsWith(storageDirectory)) {
            throw new IllegalStateException("Attempt to access file outside storage directory: " + normalized);
        }
        return normalized;
    }

    private String resolveExtension(String fileName, String contentType) {
        if (fileName != null) {
            int dot = fileName.lastIndexOf('.');
            if (dot >= 0 && dot < fileName.length() - 1) {
                return sanitizeExtension(fileName.substring(dot + 1));
            }
        }
        if (contentType != null) {
            int slash = contentType.indexOf('/');
            if (slash >= 0 && slash < contentType.length() - 1) {
                return sanitizeExtension(contentType.substring(slash + 1));
            }
        }
        return "";
    }

    private String sanitizeExtension(String extension) {
        return extension.replaceAll("[^A-Za-z0-9]", "").toLowerCase();
    }
}
