package com.farmverse.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponseDTO {

    private String token;
    private String role;
    private Long id;
    private String fullName;
    private String username;
    private String email;
    private String phoneNumber;
}