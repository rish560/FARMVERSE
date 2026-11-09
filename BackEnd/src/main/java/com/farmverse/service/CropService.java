package com.farmverse.service;

import com.farmverse.dto.CropRequestDTO;
import com.farmverse.dto.CropResponseDTO;
import java.util.List;

public interface CropService {

    CropResponseDTO createCrop(CropRequestDTO cropRequestDTO);

    List<CropResponseDTO> getAllCrops();

    CropResponseDTO getCropById(Long id);

    CropResponseDTO updateCrop(Long id, CropRequestDTO cropRequestDTO);

    void deleteCrop(Long id);
}