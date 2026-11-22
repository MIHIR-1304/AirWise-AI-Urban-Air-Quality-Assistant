package com.airwise.dto;

import com.airwise.entity.UserPreference;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

public class AuthDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RegisterRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;

        @NotBlank(message = "Full name is required")
        private String fullName;

        private String persona;
        private String defaultCity;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LoginRequest {
        @NotBlank(message = "Email is required")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AuthResponse {
        private String token;
        @Builder.Default
        private String type = "Bearer";
        private Long userId;
        private String email;
        private String fullName;
        private String role;
        private String persona;
        private String defaultCity;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserProfileDto {
        private Long id;
        private String email;
        private String fullName;
        private String role;
        private String persona;
        private UserPreferenceDto preferences;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserPreferenceDto {
        private String defaultCity;
        private Double defaultLat;
        private Double defaultLon;
        private Boolean hasInfants;
        private Boolean hasElderly;
        private Boolean hasRespiratoryIssues;
        private String preferredCommute;
        private Boolean notifySmogAlerts;
        private Boolean notifyMorningBriefing;
        private Boolean notifyPurifierReminders;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateProfileRequest {
        private String fullName;
        private String persona;
        private UserPreferenceDto preferences;
    }
}
