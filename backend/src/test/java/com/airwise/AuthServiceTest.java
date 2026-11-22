package com.airwise;

import com.airwise.config.JwtTokenProvider;
import com.airwise.dto.AuthDtos.*;
import com.airwise.entity.User;
import com.airwise.entity.UserPreference;
import com.airwise.exception.BadRequestException;
import com.airwise.repository.UserPreferenceRepository;
import com.airwise.repository.UserRepository;
import com.airwise.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserPreferenceRepository userPreferenceRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthService authService;

    @Test
    void testRegisterSuccess() {
        RegisterRequest req = RegisterRequest.builder()
                .email("test@airwise.ai")
                .password("secret123")
                .fullName("Test User")
                .persona("STUDENT")
                .defaultCity("London")
                .build();

        when(userRepository.existsByEmail("test@airwise.ai")).thenReturn(false);
        when(passwordEncoder.encode("secret123")).thenReturn("encoded_pass");

        User savedUser = User.builder()
                .id(10L)
                .email("test@airwise.ai")
                .fullName("Test User")
                .role("USER")
                .persona("STUDENT")
                .build();

        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(tokenProvider.generateToken(anyString(), anyLong(), anyString())).thenReturn("mock_jwt_token");

        AuthResponse resp = authService.register(req);

        assertNotNull(resp);
        assertEquals("test@airwise.ai", resp.getEmail());
        assertEquals("mock_jwt_token", resp.getToken());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testRegisterDuplicateEmailThrowsException() {
        RegisterRequest req = RegisterRequest.builder()
                .email("existing@airwise.ai")
                .password("secret123")
                .fullName("Existing User")
                .build();

        when(userRepository.existsByEmail("existing@airwise.ai")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(req));
        verify(userRepository, never()).save(any(User.class));
    }
}
