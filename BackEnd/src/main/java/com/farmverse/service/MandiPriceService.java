package com.farmverse.service;

import com.farmverse.dto.MandiPriceResponseDTO;
import java.util.List;

public interface MandiPriceService {
    List<MandiPriceResponseDTO> getPrices(String state, String commodity, String district);
}