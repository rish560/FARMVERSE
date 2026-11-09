package com.farmverse.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MandiPriceResponseDTO {
    private String state;
    private String district;
    private String market;
    private String commodity;
    private String variety;
    private String arrivalDate;
    private double minPrice;   // Rs per quintal, as published by the government dataset
    private double maxPrice;
    private double modalPrice;
}
