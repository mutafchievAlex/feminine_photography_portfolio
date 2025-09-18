package com.feminine.api.infrastructure.storage;

import java.io.InputStream;

/**
 * Abstraction for storing and deleting photo assets.
 */
public interface ImageStorageService {

    /**
     * Persist the provided binary stream and return a URL identifying the stored asset.
     *
     * @param inputStream the stream containing the image payload
     * @param fileName the original filename submitted by the client
     * @param contentType the declared MIME type of the uploaded image
     * @return the URL pointing to the stored image
     */
    String store(InputStream inputStream, String fileName, String contentType);

    /**
     * Remove the stored asset represented by the provided URL.
     *
     * @param imageUrl the URL previously returned by {@link #store(InputStream, String, String)}
     */
    void delete(String imageUrl);
}
