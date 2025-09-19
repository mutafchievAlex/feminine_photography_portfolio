package com.feminine.api.infrastructure.storage;

import io.quarkus.arc.profile.IfBuildProfile;
import jakarta.annotation.PreDestroy;
import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.util.Locale;
import java.util.UUID;

/**
 * Amazon S3 backed {@link ImageStorageService} that is activated for the prod
 * build profile.
 */
@ApplicationScoped
@IfBuildProfile("prod")
public class S3ImageStorageService implements ImageStorageService {

    private static final Logger LOGGER = Logger.getLogger(S3ImageStorageService.class);

    private final S3Client s3Client;
    private final String bucket;
    private final String prefix;
    private final Region region;
    private final URI endpointOverride;

    public S3ImageStorageService(
            @ConfigProperty(name = "app.storage.s3.bucket") String bucket,
            @ConfigProperty(name = "app.storage.s3.prefix", defaultValue = "uploads") String prefix,
            @ConfigProperty(name = "app.storage.s3.region", defaultValue = "us-east-1") String region,
            @ConfigProperty(name = "app.storage.s3.endpoint-override", defaultValue = "") String endpointOverride) {
        if (bucket == null || bucket.isBlank()) {
            throw new ImageStorageException("S3 bucket must be configured via app.storage.s3.bucket");
        }
        this.bucket = bucket;
        this.prefix = normalizePrefix(prefix);
        this.region = Region.of(region);
        if (endpointOverride != null && !endpointOverride.isBlank()) {
            this.endpointOverride = URI.create(endpointOverride);
        } else {
            this.endpointOverride = null;
        }
        this.s3Client = createClient(this.region, this.endpointOverride);
    }

    private S3Client createClient(Region region, URI endpointOverride) {
        S3Client.Builder builder = S3Client.builder().region(region);
        if (endpointOverride != null) {
            builder.endpointOverride(endpointOverride);
        }
        return builder.build();
    }

    @Override
    public String store(InputStream inputStream, String fileName, String contentType) {
        String key = buildObjectKey(fileName);
        byte[] payload;
        try (InputStream stream = inputStream) {
            payload = stream.readAllBytes();
        } catch (IOException e) {
            throw new ImageStorageException("Failed to read image payload for upload", e);
        }

        PutObjectRequest.Builder requestBuilder = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key);
        if (contentType != null && !contentType.isBlank()) {
            requestBuilder.contentType(contentType);
        }
        try {
            s3Client.putObject(requestBuilder.build(), RequestBody.fromBytes(payload));
        } catch (S3Exception e) {
            throw new ImageStorageException("Failed to upload image to S3", e);
        }
        return buildPublicUrl(key);
    }

    @Override
    public void delete(String imageUrl) {
        String key = extractKey(imageUrl);
        if (key == null || key.isBlank()) {
            return;
        }
        try {
            s3Client.deleteObject(DeleteObjectRequest.builder().bucket(bucket).key(key).build());
        } catch (S3Exception e) {
            LOGGER.warnf(e, "Failed to delete S3 object %s from bucket %s", key, bucket);
        }
    }

    @PreDestroy
    void close() {
        s3Client.close();
    }

    private String buildObjectKey(String fileName) {
        String cleanPrefix = prefix;
        String extension = extractExtension(fileName);
        String generatedName = UUID.randomUUID() + extension;
        if (cleanPrefix.isEmpty()) {
            return generatedName;
        }
        return cleanPrefix + "/" + generatedName;
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

    private String normalizePrefix(String prefix) {
        if (prefix == null || prefix.isBlank()) {
            return "";
        }
        String trimmed = prefix.trim();
        while (trimmed.startsWith("/")) {
            trimmed = trimmed.substring(1);
        }
        while (trimmed.endsWith("/")) {
            trimmed = trimmed.substring(0, trimmed.length() - 1);
        }
        return trimmed;
    }

    private String buildPublicUrl(String key) {
        if (endpointOverride != null) {
            String base = endpointOverride.toString();
            if (base.endsWith("/")) {
                base = base.substring(0, base.length() - 1);
            }
            return base + "/" + key;
        }
        return "https://" + bucket + ".s3." + region.id() + ".amazonaws.com/" + key;
    }

    private String extractKey(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) {
            return null;
        }
        if (!imageUrl.contains("://")) {
            return imageUrl;
        }
        int start = imageUrl.indexOf("://") + 3;
        int slash = imageUrl.indexOf('/', start);
        if (slash == -1 || slash == imageUrl.length() - 1) {
            return null;
        }
        return imageUrl.substring(slash + 1);
    }
}
