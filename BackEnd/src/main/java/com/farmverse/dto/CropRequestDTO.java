package com.farmverse.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CropRequestDTO {

    @NotBlank(message = "Crop name is required")
    private String cropName;

    private String season;

    private String stage;

    private String health;

    private String expectedYield;

    private LocalDate plantingDate;

    private String status;

    @NotNull(message = "Farm ID is required")
    private Long farmId;
}