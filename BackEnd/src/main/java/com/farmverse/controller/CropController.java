package com.farmverse.controller;

import com.farmverse.dto.CropRequestDTO;
import com.farmverse.dto.CropResponseDTO;
import com.farmverse.service.CropService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/crops")
@RequiredArgsConstructor
public class CropController {

    private final CropService cropService;

    @PostMapping
    public ResponseEntity<CropResponseDTO> createCrop(@Valid @RequestBody CropRequestDTO cropRequestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cropService.createCrop(cropRequestDTO));
    }

    @GetMapping
    public ResponseEntity<List<CropResponseDTO>> getAllCrops() {
        return ResponseEntity.ok(cropService.getAllCrops());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CropResponseDTO> getCropById(@PathVariable Long id) {
        return ResponseEntity.ok(cropService.getCropById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CropResponseDTO> updateCrop(@PathVariable Long id,
                                                      @Valid @RequestBody CropRequestDTO cropRequestDTO) {
        return ResponseEntity.ok(cropService.updateCrop(id, cropRequestDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCrop(@PathVariable Long id) {
        cropService.deleteCrop(id);
        return ResponseEntity.noContent().build();
    }
}