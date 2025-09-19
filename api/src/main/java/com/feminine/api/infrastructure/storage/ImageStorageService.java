package com.feminine.api.infrastructure.storage;

import java.io.InputStream;

/**
 * Abstraction over the underlying image storage provider. Implementations
 * store image binaries and return a public URL or path that can be persisted
 * alongside the Photo entity.
 */
public interface ImageStorageService {

    /**
     * Persist the provided image stream using the given metadata and return the
     * public URL or path to the stored asset.
     *
     * @param inputStream binary payload of the image
     * @param fileName    original file name supplied by the client
     * @param contentType content type reported for the upload
     * @return public URL or path pointing to the stored image
     */
    String store(InputStream inputStream, String fileName, String contentType);

    /**
     * Delete the image referenced by the supplied URL/path if it exists. The
     * operation is idempotent and implementations should swallow underlying
     * provider specific exceptions after logging them.
     *
     * @param imageUrl stored image URL or path (can be {@code null})
     */
    void delete(String imageUrl);
}
