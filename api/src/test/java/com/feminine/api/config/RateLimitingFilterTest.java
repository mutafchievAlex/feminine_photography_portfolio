package com.feminine.api.config;

import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.MultivaluedMap;
import jakarta.ws.rs.core.UriInfo;
import org.junit.jupiter.api.Test;

import java.net.URI;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class RateLimitingFilterTest {

    @Test
    void shouldThrottleAfterCapacityExceeded() {
        RateLimitingFilter filter = new RateLimitingFilter(1, "PT1M");
        ContainerRequestContext context = mock(ContainerRequestContext.class);
        UriInfo uriInfo = mock(UriInfo.class);
        MultivaluedMap<String, String> headers = mock(MultivaluedMap.class);

        when(context.getUriInfo()).thenReturn(uriInfo);
        when(uriInfo.getPath()).thenReturn("api/v1/test");
        when(uriInfo.getRequestUri()).thenReturn(URI.create("http://localhost/api/v1/test"));
        when(context.getHeaderString("X-Forwarded-For")).thenReturn("127.0.0.1");
        when(context.getHeaderString("X-Real-IP")).thenReturn(null);
        when(context.getHeaders()).thenReturn(headers);
        when(headers.getFirst("X-Real-IP")).thenReturn(null);
        doNothing().when(context).abortWith(org.mockito.ArgumentMatchers.any());

        filter.filter(context);
        verify(context, never()).abortWith(org.mockito.ArgumentMatchers.any());

        filter.filter(context);
        verify(context, times(1)).abortWith(org.mockito.ArgumentMatchers.any());
    }
}
