package com.feminine.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class InboundEmailRequest {

    @NotBlank
    @Email
    @Size(max = 254)
    private String from;

    @NotBlank
    @Size(max = 150)
    private String subject;

    @NotBlank
    @Size(max = 4000)
    private String body;

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }
}
