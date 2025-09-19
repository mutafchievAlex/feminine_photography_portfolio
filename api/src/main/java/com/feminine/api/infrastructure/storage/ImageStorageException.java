package com.feminine.api.infrastructure.storage;

/**
 * Runtime exception thrown when image storage operations cannot be completed.
 */
public class ImageStorageException extends RuntimeException {

    public ImageStorageException(String message) {
        super(message);
    }

    public ImageStorageException(String message, Throwable cause) {
        super(message, cause);
    }
}
