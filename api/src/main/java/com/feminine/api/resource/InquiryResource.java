package com.feminine.api.resource;

import com.feminine.api.dto.InboundEmailRequest;
import com.feminine.api.dto.InquiryRequest;
import com.feminine.api.dto.InquiryResponse;
import com.feminine.api.dto.InquiryStatusUpdateRequest;
import com.feminine.api.dto.OutboundEmailRequest;
import com.feminine.api.service.InquiryService;
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
@Tag(name = "Inquiries", description = "Manage inquiries")
public class InquiryResource {

    @Inject
    InquiryService inquiryService;

    @GET
    @Path("/photographers/{photographerId}/inquiries")
    @Operation(summary = "List inquiries for a photographer")
    public List<InquiryResponse> listByPhotographer(@PathParam("photographerId") UUID photographerId) {
        return inquiryService.listByPhotographer(photographerId);
    }

    @POST
    @Path("/inquiries")
    @Operation(summary = "Create an inquiry")
    public Response create(@Valid InquiryRequest request) {
        InquiryResponse response = inquiryService.create(request);
        return Response.status(Response.Status.CREATED).entity(response).build();
    }

    @GET
    @Path("/inquiries/{id}")
    @Operation(summary = "Get an inquiry")
    public InquiryResponse get(@PathParam("id") UUID id) {
        return inquiryService.get(id);
    }

    @PUT
    @Path("/inquiries/{id}")
    @Operation(summary = "Update an inquiry")
    public InquiryResponse update(@PathParam("id") UUID id, @Valid InquiryRequest request) {
        return inquiryService.update(id, request);
    }

    @POST
    @Path("/inquiries/{id}/status")
    @Operation(summary = "Update inquiry status")
    public InquiryResponse updateStatus(@PathParam("id") UUID id, @Valid InquiryStatusUpdateRequest request) {
        return inquiryService.updateStatus(id, request.getStatus());
    }

    @POST
    @Path("/inquiries/{id}/messages/outbound")
    @Operation(summary = "Send an email response for an inquiry")
    public InquiryResponse sendResponse(@PathParam("id") UUID id, @Valid OutboundEmailRequest request) {
        return inquiryService.sendResponse(id, request);
    }

    @POST
    @Path("/inquiries/{id}/messages/inbound")
    @Operation(summary = "Record an inbound inquiry email")
    public InquiryResponse recordInbound(@PathParam("id") UUID id, @Valid InboundEmailRequest request) {
        return inquiryService.recordClientReply(id, request);
    }

    @DELETE
    @Path("/inquiries/{id}")
    @Operation(summary = "Delete an inquiry")
    public Response delete(@PathParam("id") UUID id) {
        inquiryService.delete(id);
        return Response.noContent().build();
    }
}
