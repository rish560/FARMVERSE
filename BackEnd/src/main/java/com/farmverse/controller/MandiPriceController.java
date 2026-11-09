package com.farmverse.controller;

import com.farmverse.dto.MandiPriceResponseDTO;
import com.farmverse.service.MandiPriceService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/mandi")
@RequiredArgsConstructor
public class MandiPriceController {

    private final MandiPriceService mandiPriceService;

    @GetMapping("/prices")
    public ResponseEntity<List<MandiPriceResponseDTO>> getPrices(
            @RequestParam String state,
            @RequestParam String commodity,
            @RequestParam(required = false) String district) {
        return ResponseEntity.ok(mandiPriceService.getPrices(state, commodity, district));
    }
}
