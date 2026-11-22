package com.airwise.controller;

import com.airwise.dto.AuthDtos.*;
import com.airwise.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "User profile and personal preferences")
@SecurityRequirement(name = "BearerAuth")
public class UserController {

    private final AuthService authService;

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile and air quality preferences")
    public ResponseEntity<UserProfileDto> getCurrentUser(Authentication authentication) {
        return ResponseEntity.ok(authService.getUserProfile(authentication.getName()));
    }

    @PutMapping("/me")
    @Operation(summary = "Update current user profile and preferences")
    public ResponseEntity<UserProfileDto> updateProfile(
            Authentication authentication,
            @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(authService.updateProfile(authentication.getName(), request));
    }
}
