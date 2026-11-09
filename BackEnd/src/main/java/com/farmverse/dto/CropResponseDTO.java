package com.farmverse.dto;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CropResponseDTO {

    private Long cropId;
    private String cropName;
    private String season;
    private String stage;
    private String health;
    private String expectedYield;
    private LocalDate plantingDate;
    private String status;
    private Long farmId;
    private String farmName;
    private String farmerName;
}