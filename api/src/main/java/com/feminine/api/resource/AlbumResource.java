package com.feminine.api.resource;

import com.feminine.api.dto.AlbumRequest;
import com.feminine.api.dto.AlbumResponse;
import com.feminine.api.service.AlbumService;
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
@Tag(name = "Albums", description = "Manage albums")
public class AlbumResource {

    @Inject
    AlbumService albumService;

    @GET
    @Path("/photographers/{photographerId}/albums")
    @Operation(summary = "List albums for a photographer")
    public List<AlbumResponse> listByPhotographer(@PathParam("photographerId") UUID photographerId) {
        return albumService.listByPhotographer(photographerId);
    }

    @POST
    @Path("/albums")
    @Operation(summary = "Create an album")
    public Response create(@Valid AlbumRequest request) {
        AlbumResponse response = albumService.create(request);
        return Response.status(Response.Status.CREATED).entity(response).build();
    }

    @GET
    @Path("/albums/{id}")
    @Operation(summary = "Get an album")
    public AlbumResponse get(@PathParam("id") UUID id) {
        return albumService.get(id);
    }

    @PUT
    @Path("/albums/{id}")
    @Operation(summary = "Update an album")
    public AlbumResponse update(@PathParam("id") UUID id, @Valid AlbumRequest request) {
        return albumService.update(id, request);
    }

    @DELETE
    @Path("/albums/{id}")
    @Operation(summary = "Delete an album")
    public Response delete(@PathParam("id") UUID id) {
        albumService.delete(id);
        return Response.noContent().build();
    }
}
