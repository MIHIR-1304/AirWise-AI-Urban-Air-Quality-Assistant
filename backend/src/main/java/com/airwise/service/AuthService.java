package com.airwise.service;

import com.airwise.config.JwtTokenProvider;
import com.airwise.dto.AuthDtos.*;
import com.airwise.entity.User;
import com.airwise.entity.UserPreference;
import com.airwise.exception.BadRequestException;
import com.airwise.exception.ResourceNotFoundException;
import com.airwise.repository.UserPreferenceRepository;
import com.airwise.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserPreferenceRepository userPreferenceRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered: " + request.getEmail());
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role("USER")
                .persona(request.getPersona() != null ? request.getPersona() : "WORKING_PROFESSIONAL")
                .build();

        user = userRepository.save(user);

        UserPreference preference = UserPreference.builder()
                .user(user)
                .defaultCity(request.getDefaultCity() != null ? request.getDefaultCity() : "Jamshedpur")
                .defaultLat(22.8046)
                .defaultLon(86.2029)
                .build();
        userPreferenceRepository.save(preference);

        String token = tokenProvider.generateToken(user.getEmail(), user.getId(), user.getRole());

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .persona(user.getPersona())
                .defaultCity(preference.getDefaultCity())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        String token = tokenProvider.generateToken(user.getEmail(), user.getId(), user.getRole());

        String defaultCity = "Jamshedpur";
        if (user.getPreferences() != null && user.getPreferences().getDefaultCity() != null) {
            defaultCity = user.getPreferences().getDefaultCity();
        }

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .persona(user.getPersona())
                .defaultCity(defaultCity)
                .build();
    }

    public UserProfileDto getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        UserPreference pref = userPreferenceRepository.findByUserId(user.getId())
                .orElse(null);

        UserPreferenceDto prefDto = null;
        if (pref != null) {
            prefDto = UserPreferenceDto.builder()
                    .defaultCity(pref.getDefaultCity())
                    .defaultLat(pref.getDefaultLat())
                    .defaultLon(pref.getDefaultLon())
                    .hasInfants(pref.getHasInfants())
                    .hasElderly(pref.getHasElderly())
                    .hasRespiratoryIssues(pref.getHasRespiratoryIssues())
                    .preferredCommute(pref.getPreferredCommute())
                    .notifySmogAlerts(pref.getNotifySmogAlerts())
                    .notifyMorningBriefing(pref.getNotifyMorningBriefing())
                    .notifyPurifierReminders(pref.getNotifyPurifierReminders())
                    .build();
        }

        return UserProfileDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .persona(user.getPersona())
                .preferences(prefDto)
                .build();
    }

    @Transactional
    public UserProfileDto updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName());
        }
        if (request.getPersona() != null && !request.getPersona().isBlank()) {
            user.setPersona(request.getPersona());
        }
        userRepository.save(user);

        if (request.getPreferences() != null) {
            UserPreference pref = userPreferenceRepository.findByUserId(user.getId())
                    .orElse(UserPreference.builder().user(user).build());

            UserPreferenceDto p = request.getPreferences();
            if (p.getDefaultCity() != null) pref.setDefaultCity(p.getDefaultCity());
            if (p.getDefaultLat() != null) pref.setDefaultLat(p.getDefaultLat());
            if (p.getDefaultLon() != null) pref.setDefaultLon(p.getDefaultLon());
            if (p.getHasInfants() != null) pref.setHasInfants(p.getHasInfants());
            if (p.getHasElderly() != null) pref.setHasElderly(p.getHasElderly());
            if (p.getHasRespiratoryIssues() != null) pref.setHasRespiratoryIssues(p.getHasRespiratoryIssues());
            if (p.getPreferredCommute() != null) pref.setPreferredCommute(p.getPreferredCommute());
            if (p.getNotifySmogAlerts() != null) pref.setNotifySmogAlerts(p.getNotifySmogAlerts());
            if (p.getNotifyMorningBriefing() != null) pref.setNotifyMorningBriefing(p.getNotifyMorningBriefing());
            if (p.getNotifyPurifierReminders() != null) pref.setNotifyPurifierReminders(p.getNotifyPurifierReminders());

            userPreferenceRepository.save(pref);
        }

        return getUserProfile(email);
    }
}
