package com.feminine.api.resource;

import com.feminine.api.dto.BookingRequest;
import com.feminine.api.dto.BookingResponse;
import com.feminine.api.dto.BookingStatusUpdateRequest;
import com.feminine.api.service.BookingService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.util.List;
import java.util.UUID;

@Path("/api/v1")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Bookings", description = "Manage bookings")
public class BookingResource {

    @Inject
    BookingService bookingService;

    @GET
    @Path("/photographers/{photographerId}/bookings")
    @Operation(summary = "List bookings for a photographer")
    public List<BookingResponse> listByPhotographer(@PathParam("photographerId") UUID photographerId) {
        return bookingService.listByPhotographer(photographerId);
    }

    @POST
    @Path("/bookings")
    @Operation(summary = "Create a booking")
    public Response create(@Valid BookingRequest request) {
        BookingResponse response = bookingService.create(request);
        return Response.status(Response.Status.CREATED).entity(response).build();
    }

    @GET
    @Path("/bookings/{id}")
    @Operation(summary = "Get a booking")
    public BookingResponse get(@PathParam("id") UUID id) {
        return bookingService.get(id);
    }

    @PUT
    @Path("/bookings/{id}")
    @Operation(summary = "Update a booking")
    public BookingResponse update(@PathParam("id") UUID id, @Valid BookingRequest request) {
        return bookingService.update(id, request);
    }

    @POST
    @Path("/bookings/{id}/status")
    @Operation(summary = "Update booking status")
    public BookingResponse updateStatus(@PathParam("id") UUID id, @Valid BookingStatusUpdateRequest request) {
        return bookingService.updateStatus(id, request.getStatus(), request.getContractUrl());
    }

    @DELETE
    @Path("/bookings/{id}")
    @Operation(summary = "Delete a booking")
    public Response delete(@PathParam("id") UUID id) {
        bookingService.delete(id);
        return Response.noContent().build();
    }
}
