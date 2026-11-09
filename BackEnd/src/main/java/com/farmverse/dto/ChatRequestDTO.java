package com.farmverse.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRequestDTO {

    @NotBlank(message = "Question is required")
    private String question;

    private String crop;
    private String location;
    private String language;
}
