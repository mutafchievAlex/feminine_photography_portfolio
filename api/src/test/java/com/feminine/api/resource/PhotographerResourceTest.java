package com.feminine.api.resource;

import com.feminine.api.config.PostgresResource;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.junit.QuarkusTestResource;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.ValidatableResponse;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.notNullValue;

@QuarkusTest
@QuarkusTestResource(PostgresResource.class)
class PhotographerResourceTest {

    @BeforeAll
    static void setup() {
        RestAssured.enableLoggingOfRequestAndResponseIfValidationFails();
    }

    @Test
    void shouldListSeededPhotographers() {
        given()
                .when().get("/api/v1/photographers")
                .then()
                .statusCode(200)
                .body("size()", greaterThan(0));
    }

    @Test
    void shouldCreateUpdateAndDeletePhotographer() {
        Map<String, Object> payload = Map.of(
                "fullName", "Test Photographer",
                "bio", "Creates stunning test imagery.",
                "email", "test.photographer@example.com",
                "phone", "+1-555-3333",
                "location", "Seattle, WA",
                "startingPrice", BigDecimal.valueOf(2500),
                "specialties", Set.of("Test Shoots", "Editorial")
        );

        ValidatableResponse creationResponse = given()
                .contentType(ContentType.JSON)
                .body(payload)
                .when()
                .post("/api/v1/photographers")
                .then()
                .statusCode(201)
                .body("id", notNullValue());

        String id = creationResponse.extract().path("id");
        UUID photographerId = UUID.fromString(id);

        given()
                .when()
                .get("/api/v1/photographers/" + photographerId)
                .then()
                .statusCode(200)
                .body("fullName", notNullValue());

        payload = Map.of(
                "fullName", "Updated Photographer",
                "bio", "Updated bio",
                "email", "test.photographer@example.com",
                "phone", "+1-555-4444",
                "location", "Seattle, WA",
                "startingPrice", BigDecimal.valueOf(2800),
                "specialties", Set.of("Editorial")
        );

        given()
                .contentType(ContentType.JSON)
                .body(payload)
                .when()
                .put("/api/v1/photographers/" + photographerId)
                .then()
                .statusCode(200)
                .body("fullName", notNullValue());

        given()
                .when()
                .delete("/api/v1/photographers/" + photographerId)
                .then()
                .statusCode(204);
    }
}
