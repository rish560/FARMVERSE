package com.farmverse.service;

import com.farmverse.dto.WeatherResponseDTO;

public interface WeatherService {
    WeatherResponseDTO getWeather(String location);
}
