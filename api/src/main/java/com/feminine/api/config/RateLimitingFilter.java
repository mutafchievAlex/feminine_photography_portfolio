package com.feminine.api.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Bucket4j;
import io.github.bucket4j.Refill;
import jakarta.annotation.Priority;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Provider
@Priority(Priorities.AUTHENTICATION + 1)
@ApplicationScoped
public class RateLimitingFilter implements ContainerRequestFilter {

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();
    private final long capacity;
    private final Duration refillDuration;

    public RateLimitingFilter(
            @ConfigProperty(name = "app.rate-limit.capacity", defaultValue = "120") long capacity,
            @ConfigProperty(name = "app.rate-limit.refill-duration", defaultValue = "PT1M") String refillDuration
    ) {
        this.capacity = capacity;
        this.refillDuration = Duration.parse(refillDuration);
    }

    @Override
    public void filter(ContainerRequestContext requestContext) {
        if (!requestContext.getUriInfo().getPath().startsWith("api/")) {
            return;
        }
        String key = resolveKey(requestContext);
        Bucket bucket = buckets.computeIfAbsent(key, k -> Bucket4j.builder()
                .addLimit(Bandwidth.classic(capacity, Refill.greedy(capacity, this.refillDuration)))
                .build());
        if (!bucket.tryConsume(1)) {
            requestContext.abortWith(Response.status(Response.Status.TOO_MANY_REQUESTS)
                    .entity("Rate limit exceeded")
                    .build());
        }
    }

    private String resolveKey(ContainerRequestContext requestContext) {
        String forwardedFor = requestContext.getHeaderString("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }
        String realIp = requestContext.getHeaderString("X-Real-IP");
        if (realIp != null && !realIp.isBlank()) {
            return realIp;
        }
        String host = requestContext.getUriInfo().getRequestUri().getHost();
        return host != null ? host : "default";
    }
}
