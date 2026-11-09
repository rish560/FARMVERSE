package com.farmverse.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterResponseDTO {

    private String message;
    private Long id;
    private String fullName;
    private String username;
    private String email;
    private String phoneNumber;
    private String role;
    private LocalDateTime createdAt;
}