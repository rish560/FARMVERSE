package com.farmverse.service;

import com.farmverse.dto.FarmRequestDTO;
import com.farmverse.dto.FarmResponseDTO;
import java.util.List;

public interface FarmService {

    FarmResponseDTO createFarm(FarmRequestDTO farmRequestDTO);

    List<FarmResponseDTO> getAllFarms();

    FarmResponseDTO getFarmById(Long id);

    FarmResponseDTO updateFarm(Long id, FarmRequestDTO farmRequestDTO);

    void deleteFarm(Long id);
}