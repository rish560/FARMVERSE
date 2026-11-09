package com.farmverse.service;

import com.farmverse.dto.LoginRequestDTO;
import com.farmverse.dto.LoginResponseDTO;
import com.farmverse.dto.RegisterRequestDTO;
import com.farmverse.dto.RegisterResponseDTO;

public interface AuthService {

    RegisterResponseDTO register(RegisterRequestDTO registerRequestDTO);

    LoginResponseDTO login(LoginRequestDTO loginRequestDTO);
}