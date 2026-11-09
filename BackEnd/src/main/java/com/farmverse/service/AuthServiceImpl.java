package com.farmverse.service;

import com.farmverse.dto.LoginRequestDTO;
import com.farmverse.dto.LoginResponseDTO;
import com.farmverse.dto.RegisterRequestDTO;
import com.farmverse.dto.RegisterResponseDTO;
import com.farmverse.entity.Role;
import com.farmverse.entity.User;
import com.farmverse.exception.BadRequestException;
import com.farmverse.exception.ConflictException;
import com.farmverse.exception.UnauthorizedException;
import com.farmverse.repository.UserRepository;
import com.farmverse.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Override
    @Transactional
    public RegisterResponseDTO register(RegisterRequestDTO registerRequestDTO) {
        if (registerRequestDTO.getConfirmPassword() != null && !registerRequestDTO.getConfirmPassword().isEmpty()) {
            if (!registerRequestDTO.getPassword().equals(registerRequestDTO.getConfirmPassword())) {
                throw new BadRequestException("Password and confirm password do not match");
            }
        }

        String rawRole = registerRequestDTO.getRole();
        if (!Role.isValid(rawRole)) {
            throw new BadRequestException("Invalid role. Allowed roles: ADMIN, FARM_MANAGER, GUEST");
        }
        String normalizedRole = Role.normalize(rawRole);

        if (userRepository.findByEmail(registerRequestDTO.getEmail()).isPresent()) {
            throw new ConflictException("Email already exists");
        }

        String fullName = registerRequestDTO.getFullName() != null && !registerRequestDTO.getFullName().trim().isEmpty()
                ? registerRequestDTO.getFullName().trim()
                : (registerRequestDTO.getUsername() != null && !registerRequestDTO.getUsername().trim().isEmpty()
                        ? registerRequestDTO.getUsername().trim()
                        : registerRequestDTO.getEmail().trim());

        String username = registerRequestDTO.getUsername() != null && !registerRequestDTO.getUsername().trim().isEmpty()
                ? registerRequestDTO.getUsername().trim()
                : fullName;

        User user = User.builder()
                .fullName(fullName)
                .username(username)
                .email(registerRequestDTO.getEmail().trim())
                .phoneNumber(registerRequestDTO.getPhoneNumber())
                .password(passwordEncoder.encode(registerRequestDTO.getPassword()))
                .role(normalizedRole)
                .build();

        User savedUser = userRepository.save(user);

        return RegisterResponseDTO.builder()
                .message("User registered successfully")
                .id(savedUser.getId())
                .fullName(savedUser.getFullName())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .phoneNumber(savedUser.getPhoneNumber())
                .role(savedUser.getRole())
                .createdAt(savedUser.getCreatedAt())
                .build();
    }

    @Override
    public LoginResponseDTO login(LoginRequestDTO loginRequestDTO) {
        User user = userRepository.findByEmail(loginRequestDTO.getEmail())
            .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequestDTO.getEmail(), loginRequestDTO.getPassword()));
        } catch (Exception exception) {
            throw new UnauthorizedException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        return LoginResponseDTO.builder()
                .token(token)
                .role(user.getRole())
                .id(user.getId())
                .fullName(user.getFullName() != null ? user.getFullName() : user.getUsername())
                .username(user.getUsername())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .build();
    }
}