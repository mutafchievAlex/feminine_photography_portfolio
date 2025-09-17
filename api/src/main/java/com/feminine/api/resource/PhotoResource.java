package com.feminine.api.resource;

import com.feminine.api.dto.PhotoRequest;
import com.feminine.api.dto.PhotoResponse;
import com.feminine.api.dto.PhotoUploadForm;
import com.feminine.api.service.PhotoService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.InternalServerErrorException;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import org.jboss.resteasy.reactive.MultipartForm;
import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.multipart.FileUpload;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.util.List;
import java.util.UUID;

@Path("/api/v1")
@Produces(MediaType.APPLICATION_JSON)
@Tag(name = "Photos", description = "Manage photos")
public class PhotoResource {

    @Inject
    PhotoService photoService;

    @GET
    @Path("/albums/{albumId}/photos")
    @Operation(summary = "List photos for an album")
    public List<PhotoResponse> listByAlbum(@PathParam("albumId") UUID albumId) {
        return photoService.listByAlbum(albumId);
    }

    @POST
    @Path("/photos")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Operation(summary = "Upload a photo")
    public Response upload(@Valid @MultipartForm PhotoUploadForm form) {
        FileUpload fileUpload = form.getFile();
        try (InputStream inputStream = Files.newInputStream(fileUpload.uploadedFile())) {
            PhotoRequest request = buildRequest(form);
            PhotoResponse response = photoService.create(request, inputStream, fileUpload.fileName(), fileUpload.contentType());
            return Response.status(Response.Status.CREATED).entity(response).build();
        } catch (IOException e) {
            throw new InternalServerErrorException("Failed to process uploaded image", e);
        }
    }

    @GET
    @Path("/photos/{id}")
    @Operation(summary = "Get a photo")
    public PhotoResponse get(@PathParam("id") UUID id) {
        return photoService.get(id);
    }

    @PUT
    @Path("/photos/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Operation(summary = "Update photo metadata")
    public PhotoResponse update(@PathParam("id") UUID id, @Valid PhotoRequest request) {
        return photoService.update(id, request);
    }

    @POST
    @Path("/photos/{id}/image")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Operation(summary = "Replace photo image")
    public Response replaceImage(@PathParam("id") UUID id, @RestForm FileUpload fileUpload) {
        try (InputStream inputStream = Files.newInputStream(fileUpload.uploadedFile())) {
            photoService.updateImage(id, inputStream, fileUpload.fileName(), fileUpload.contentType());
            return Response.noContent().build();
        } catch (IOException e) {
            throw new InternalServerErrorException("Failed to process uploaded image", e);
        }
    }

    @DELETE
    @Path("/photos/{id}")
    @Operation(summary = "Delete a photo")
    public Response delete(@PathParam("id") UUID id) {
        photoService.delete(id);
        return Response.noContent().build();
    }

    private PhotoRequest buildRequest(PhotoUploadForm form) {
        PhotoRequest request = new PhotoRequest();
        request.setAlbumId(form.getAlbumId());
        request.setTitle(form.getTitle());
        request.setDescription(form.getDescription());
        request.setTags(form.getTags());
        request.setFeatured(form.isFeatured());
        return request;
    }
}
