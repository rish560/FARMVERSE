package com.farmverse.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FarmRequestDTO {

    @NotBlank(message = "Farm name is required")
    private String farmName;

    private String farmerName;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Area is required")
    @Positive(message = "Area must be positive")
    private BigDecimal area;

    private String areaUnit;

    private String waterSource;

    private String currentCrop;

    private java.time.LocalDate sowingDate;
    private java.time.LocalDate harvestingDate;

    private String status;

    @NotNull(message = "Owner ID is required")
    private Long ownerId;
}