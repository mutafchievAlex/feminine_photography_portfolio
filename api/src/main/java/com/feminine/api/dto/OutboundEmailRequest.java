package com.feminine.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class OutboundEmailRequest {

    @NotBlank
    @Size(max = 150)
    private String subject;

    @NotBlank
    @Size(max = 4000)
    private String body;

    private boolean copyPhotographer = true;

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

    public boolean isCopyPhotographer() {
        return copyPhotographer;
    }

    public void setCopyPhotographer(boolean copyPhotographer) {
        this.copyPhotographer = copyPhotographer;
    }
}
