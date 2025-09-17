package com.feminine.api.resource;

import com.feminine.api.dto.PhotographerProfileRequest;
import com.feminine.api.dto.PhotographerProfileResponse;
import com.feminine.api.service.PhotographerService;
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

@Path("/api/v1/photographers")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Photographers", description = "Manage photographer profiles")
public class PhotographerResource {

    @Inject
    PhotographerService photographerService;

    @GET
    @Operation(summary = "List photographer profiles")
    public List<PhotographerProfileResponse> list() {
        return photographerService.listAll();
    }

    @POST
    @Operation(summary = "Create a photographer profile")
    public Response create(@Valid PhotographerProfileRequest request) {
        PhotographerProfileResponse created = photographerService.create(request);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @GET
    @Path("{id}")
    @Operation(summary = "Get a photographer profile")
    public PhotographerProfileResponse get(@PathParam("id") UUID id) {
        return photographerService.get(id);
    }

    @PUT
    @Path("{id}")
    @Operation(summary = "Update a photographer profile")
    public PhotographerProfileResponse update(@PathParam("id") UUID id, @Valid PhotographerProfileRequest request) {
        return photographerService.update(id, request);
    }

    @DELETE
    @Path("{id}")
    @Operation(summary = "Delete a photographer profile")
    public Response delete(@PathParam("id") UUID id) {
        photographerService.delete(id);
        return Response.noContent().build();
    }
}
