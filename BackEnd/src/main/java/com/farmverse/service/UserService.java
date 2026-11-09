package com.farmverse.service;

import com.farmverse.dto.UserRequestDTO;
import com.farmverse.dto.UserResponseDTO;
import java.util.List;

public interface UserService {

    UserResponseDTO createUser(UserRequestDTO userRequestDTO);

    List<UserResponseDTO> getAllUsers();

    UserResponseDTO getUserById(Long id);

    UserResponseDTO updateUser(Long id, UserRequestDTO userRequestDTO);

    void deleteUser(Long id);
}