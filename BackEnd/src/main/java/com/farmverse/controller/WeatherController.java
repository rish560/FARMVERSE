package com.farmverse.controller;

import com.farmverse.dto.WeatherResponseDTO;
import com.farmverse.service.WeatherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/weather")
@RequiredArgsConstructor
public class WeatherController {

    private final WeatherService weatherService;

    @GetMapping
    public ResponseEntity<WeatherResponseDTO> getWeather(@RequestParam String location) {
        return ResponseEntity.ok(weatherService.getWeather(location));
    }
}
