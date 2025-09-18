package com.feminine.api.infrastructure.storage;

import io.quarkus.arc.properties.UnlessBuildProperty;
import jakarta.annotation.PreDestroy;
import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.core.exception.SdkException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetUrlRequest;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Locale;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

/**
 * Amazon S3 backed implementation of {@link ImageStorageService}.
 */
@ApplicationScoped
@UnlessBuildProperty(name = "app.storage.s3.bucket", stringValue = "")
public class S3ImageStorageService implements ImageStorageService {

    private final S3Client s3Client;
    private final String bucket;
    private final String prefix;

    public S3ImageStorageService(
            @ConfigProperty(name = "app.storage.s3.bucket") String bucket,
            @ConfigProperty(name = "app.storage.s3.prefix") Optional<String> prefix,
            @ConfigProperty(name = "app.storage.s3.region") String region,
            @ConfigProperty(name = "app.storage.s3.endpoint-override") Optional<String> endpointOverride
    ) {
        this.bucket = Objects.requireNonNull(bucket, "bucket");
        if (this.bucket.isBlank()) {
            throw new IllegalStateException("S3 bucket name must be provided when enabling S3 storage");
        }
        this.prefix = sanitizePrefix(prefix.orElse("uploads"));
        S3Client.Builder builder = S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(DefaultCredentialsProvider.create());
        endpointOverride.filter(s -> !s.isBlank()).ifPresent(url -> builder.endpointOverride(URI.create(url)));
        this.s3Client = builder.build();
    }

    @Override
    public String store(InputStream inputStream, String fileName, String contentType) {
        Objects.requireNonNull(inputStream, "inputStream");
        String key = buildObjectKey(fileName, contentType);
        byte[] payload = toByteArray(inputStream);
        PutObjectRequest.Builder requestBuilder = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key);
        if (contentType != null && !contentType.isBlank()) {
            requestBuilder.contentType(contentType);
        }
        s3Client.putObject(requestBuilder.build(), RequestBody.fromBytes(payload));
        return s3Client.utilities().getUrl(GetUrlRequest.builder().bucket(bucket).key(key).build()).toString();
    }

    @Override
    public void delete(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) {
            return;
        }
        String key = extractKey(imageUrl);
        if (key == null || key.isBlank()) {
            return;
        }
        try {
            s3Client.deleteObject(DeleteObjectRequest.builder().bucket(bucket).key(key).build());
        } catch (NoSuchKeyException e) {
            // Ignore missing objects to keep delete idempotent
        } catch (SdkException e) {
            throw new IllegalStateException("Failed to delete S3 object " + key, e);
        }
    }

    @PreDestroy
    void close() {
        s3Client.close();
    }

    private String buildObjectKey(String fileName, String contentType) {
        String extension = extractExtension(fileName, contentType);
        StringBuilder key = new StringBuilder();
        if (!prefix.isEmpty()) {
            key.append(prefix).append('/');
        }
        key.append(UUID.randomUUID());
        if (!extension.isBlank()) {
            key.append('.').append(extension);
        }
        return key.toString();
    }

    private String extractExtension(String fileName, String contentType) {
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
        return extension.replaceAll("[^A-Za-z0-9]", "").toLowerCase(Locale.ROOT);
    }

    private String sanitizePrefix(String value) {
        String trimmed = value == null ? "" : value.trim();
        if (trimmed.startsWith("/")) {
            trimmed = trimmed.substring(1);
        }
        if (trimmed.endsWith("/")) {
            trimmed = trimmed.substring(0, trimmed.length() - 1);
        }
        return trimmed;
    }

    private byte[] toByteArray(InputStream inputStream) {
        try {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            inputStream.transferTo(outputStream);
            return outputStream.toByteArray();
        } catch (IOException e) {
            throw new IllegalStateException("Failed to read image stream", e);
        }
    }

    private String extractKey(String imageUrl) {
        if (imageUrl.startsWith("s3://")) {
            String withoutScheme = imageUrl.substring("s3://".length());
            int firstSlash = withoutScheme.indexOf('/');
            if (firstSlash < 0) {
                return null;
            }
            return withoutScheme.substring(firstSlash + 1);
        }
        try {
            URI uri = new URI(imageUrl);
            String path = uri.getPath();
            if (path == null || path.isBlank()) {
                return null;
            }
            if (path.startsWith("/")) {
                path = path.substring(1);
            }
            if (path.startsWith(bucket + "/")) {
                return path.substring(bucket.length() + 1);
            }
            return path;
        } catch (URISyntaxException e) {
            return imageUrl;
        }
    }
}
