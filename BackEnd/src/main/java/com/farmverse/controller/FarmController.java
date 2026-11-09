package com.farmverse.controller;

import com.farmverse.dto.FarmRequestDTO;
import com.farmverse.dto.FarmResponseDTO;
import com.farmverse.service.FarmService;
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
@RequestMapping("/api/farms")
@RequiredArgsConstructor
public class FarmController {

    private final FarmService farmService;

    @PostMapping
    public ResponseEntity<FarmResponseDTO> createFarm(@Valid @RequestBody FarmRequestDTO farmRequestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(farmService.createFarm(farmRequestDTO));
    }

    @GetMapping
    public ResponseEntity<List<FarmResponseDTO>> getAllFarms() {
        return ResponseEntity.ok(farmService.getAllFarms());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FarmResponseDTO> getFarmById(@PathVariable Long id) {
        return ResponseEntity.ok(farmService.getFarmById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FarmResponseDTO> updateFarm(@PathVariable Long id,
                                                      @Valid @RequestBody FarmRequestDTO farmRequestDTO) {
        return ResponseEntity.ok(farmService.updateFarm(id, farmRequestDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFarm(@PathVariable Long id) {
        farmService.deleteFarm(id);
        return ResponseEntity.noContent().build();
    }
}