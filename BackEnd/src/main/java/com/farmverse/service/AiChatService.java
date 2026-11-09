package com.farmverse.service;

import com.farmverse.dto.ChatRequestDTO;
import com.farmverse.dto.ChatResponseDTO;

public interface AiChatService {
    ChatResponseDTO getAdvice(ChatRequestDTO request);
}
