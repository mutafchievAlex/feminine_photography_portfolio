package com.feminine.api.infrastructure.storage;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class LocalImageStorageServiceTest {

    @TempDir
    Path tempDir;

    @Test
    void storeShouldPersistFileAndReturnAbsolutePath() throws IOException {
        LocalImageStorageService service = new LocalImageStorageService(tempDir.toString());
        service.init();

        byte[] payload = "hello".getBytes();
        String storedPath;
        try (ByteArrayInputStream inputStream = new ByteArrayInputStream(payload)) {
            storedPath = service.store(inputStream, "sample.jpg", "image/jpeg");
        }

        Path savedFile = Path.of(storedPath);
        assertTrue(savedFile.startsWith(tempDir));
        assertArrayEquals(payload, Files.readAllBytes(savedFile));
    }

    @Test
    void deleteShouldRemoveStoredFile() throws IOException {
        LocalImageStorageService service = new LocalImageStorageService(tempDir.toString());
        service.init();

        String storedPath;
        try (ByteArrayInputStream inputStream = new ByteArrayInputStream("payload".getBytes())) {
            storedPath = service.store(inputStream, "image.png", "image/png");
        }

        Path savedFile = Path.of(storedPath);
        assertTrue(Files.exists(savedFile));

        service.delete(storedPath);

        assertTrue(Files.notExists(savedFile));
    }

    @Test
    void resolvePathShouldNormalizeRelativeInput() {
        LocalImageStorageService service = new LocalImageStorageService(tempDir.toString());
        service.init();

        Path resolved = service.resolvePath("../" + tempDir.getFileName() + "/example");
        assertEquals(tempDir.resolve("example"), resolved);
    }
}
