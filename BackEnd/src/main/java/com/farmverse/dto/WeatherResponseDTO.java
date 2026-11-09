package com.farmverse.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeatherResponseDTO {

    private String location;
    private String resolvedLocation; // what WeatherAPI actually matched your input to

    // Current conditions
    private double currentTemp;
    private String currentCondition;   // e.g. "Clear", "Rain", "Thunderstorm"
    private String currentIcon;        // emoji, e.g. "☀️"
    private int currentHumidity;

    // Tomorrow's outlook
    private double tomorrowHigh;
    private double tomorrowLow;
    private int tomorrowRainChance;    // 0-100 %
    private String tomorrowCondition;
    private String tomorrowIcon;

    // Multi-day outlook for the farm detail view. How many days actually come
    // back depends on the weather provider's plan (free tiers are often capped
    // at 3 days) -- the frontend renders whatever length this list is, rather
    // than assuming a fixed count like 5.
    private java.util.List<DailyForecast> dailyForecast;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DailyForecast {
        private String date;       // yyyy-MM-dd
        private String dayLabel;   // e.g. "Mon", "Tomorrow", "Today"
        private double high;
        private double low;
        private int rainChance;
        private String condition;
        private String icon;
    }
}
