package com.feminine.api.dto;

import com.feminine.api.domain.InquiryStatus;
import jakarta.validation.constraints.NotNull;

public class InquiryStatusUpdateRequest {

    @NotNull
    private InquiryStatus status;

    public InquiryStatus getStatus() {
        return status;
    }

    public void setStatus(InquiryStatus status) {
        this.status = status;
    }
}
