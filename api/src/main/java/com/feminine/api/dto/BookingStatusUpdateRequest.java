package com.feminine.api.dto;

import com.feminine.api.domain.BookingStatus;
import jakarta.validation.constraints.NotNull;

public class BookingStatusUpdateRequest {

    @NotNull
    private BookingStatus status;

    private String contractUrl;

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public String getContractUrl() {
        return contractUrl;
    }

    public void setContractUrl(String contractUrl) {
        this.contractUrl = contractUrl;
    }
}
