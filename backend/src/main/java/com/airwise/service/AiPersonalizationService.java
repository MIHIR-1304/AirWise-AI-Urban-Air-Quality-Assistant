package com.airwise.service;

import com.airwise.dto.AiDtos.*;
import com.airwise.entity.ChatMessage;
import com.airwise.entity.ChatSession;
import com.airwise.entity.User;
import com.airwise.repository.ChatMessageRepository;
import com.airwise.repository.ChatSessionRepository;
import com.airwise.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiPersonalizationService {

    @Value("${airwise.gemini.api-key:}")
    private String geminiApiKey;

    @Value("${airwise.gemini.api-url:https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent}")
    private String geminiApiUrl;

    private final ChatSessionRepository chatSessionRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestTemplate restTemplate = new RestTemplate();

    public ChatResponse handleChat(String userEmail, ChatRequest request) {
        Long sessionId = request.getSessionId();
        ChatSession session = null;

        if (sessionId != null) {
            session = chatSessionRepository.findById(sessionId).orElse(null);
        }

        if (session == null && userEmail != null) {
            User user = userRepository.findByEmail(userEmail).orElse(null);
            session = ChatSession.builder()
                    .user(user)
                    .title("Consultation: " + (request.getCity() != null ? request.getCity() : "Air Advisory"))
                    .build();
            session = chatSessionRepository.save(session);
        }

        // Save incoming user message
        if (session != null) {
            ChatMessage userMsg = ChatMessage.builder()
                    .session(session)
                    .senderRole("USER")
                    .messageContent(request.getMessage())
                    .aqiContext(request.getAqi())
                    .locationContext(request.getCity())
                    .build();
            chatMessageRepository.save(userMsg);
        }

        // Attempt Gemini API invocation if key is present
        String aiReply = null;
        String attribution = "AirWise Clinical Environmental Engine";
        List<String> suggestedFollowUps = new ArrayList<>();

        if (geminiApiKey != null && !geminiApiKey.trim().isBlank()) {
            try {
                aiReply = callGemini(request);
                attribution = "Gemini 1.5 Flash AI Engine";
            } catch (Exception ex) {
                log.warn("Gemini API call failed or timed out. Falling back to local intelligence engine: {}", ex.getMessage());
            }
        }

        // Fallback or primary rule-based response
        if (aiReply == null || aiReply.isBlank()) {
            aiReply = generateExpertHeuristicReply(request);
            attribution = "AirWise Smart Environmental Engine";
        }

        // Thoroughly sanitize reply to eliminate any asterisk symbols
        aiReply = sanitizeAiReply(aiReply);

        suggestedFollowUps = generateFollowUps(request.getMessage(), request.getAqi());

        // Save assistant message
        if (session != null) {
            ChatMessage assistantMsg = ChatMessage.builder()
                    .session(session)
                    .senderRole("ASSISTANT")
                    .messageContent(aiReply)
                    .aqiContext(request.getAqi())
                    .locationContext(request.getCity())
                    .build();
            chatMessageRepository.save(assistantMsg);
        }

        return ChatResponse.builder()
                .sessionId(session != null ? session.getId() : null)
                .reply(aiReply)
                .senderRole("ASSISTANT")
                .suggestedFollowUps(suggestedFollowUps)
                .timestamp(LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm")))
                .sourceAttribution(attribution)
                .build();
    }

    public PersonalizedGuidanceResponse getPersonalizedGuidance(RecommendationRequest req) {
        int aqi = req.getAqi() != null ? req.getAqi() : 140;
        String persona = req.getPersona() != null ? req.getPersona().toUpperCase() : "WORKING_PROFESSIONAL";
        boolean hasRespiratory = Boolean.TRUE.equals(req.getHasRespiratoryIssues());
        boolean hasInfants = Boolean.TRUE.equals(req.getHasInfants());

        String headline;
        String risk;
        String morning;
        String commute;
        String indoor;
        String evening;
        String mask;
        String diet;
        List<String> bullets = new ArrayList<>();

        if (aqi <= 50) {
            headline = "Clean Atmospheric Conditions — Full Outdoor Freedom";
            risk = "LOW";
            morning = "Ideal window for strenuous outdoor running, cycling, or jogging. Zero cardiovascular particulate hazard.";
            commute = "Active transit (cycling or walking) is strongly recommended to reduce vehicle emissions.";
            indoor = "Open all cross-ventilation windows to flush indoor carbon dioxide and VOC buildup.";
            evening = "Great conditions for outdoor dining, sports, or leisure walks with family.";
            mask = "Not required under present atmospheric readings.";
            diet = "Standard hydration; normal outdoor routine.";
            bullets.add("Optimal outdoor respiratory clearance.");
            bullets.add("Zero particulate smog trap detected.");
        } else if (aqi <= 100) {
            headline = "Moderate Air Quality — Prudent Routine Advised";
            risk = "MODERATE";
            morning = "Outdoor exercise is generally fine, but avoid exercising within 100m of busy traffic intersections.";
            commute = "Public metro or bus preferred; keep car windows closed during slow traffic.";
            indoor = "Ventilate between 12:00 PM and 3:00 PM when solar convection has dispersed ground smog.";
            evening = "Outdoor walking is acceptable; keep intense sprint sessions moderate.";
            mask = hasRespiratory ? "Keep a cloth or surgical mask handy in case of localized dust." : "Optional for general public.";
            diet = "Stay well hydrated to keep respiratory mucous membranes moist.";
            bullets.add("Light background particulate presence.");
            bullets.add("Midday hours offer the safest ambient air.");
        } else if (aqi <= 200) {
            headline = "Elevated Smog Warning — Active Protection Protocol";
            risk = "HIGH";
            morning = persona.contains("ATHLETE") ? "Shift high-intensity cardio indoors. Outdoor morning smog is concentrated near ground level." : "Avoid morning park walks before 9:00 AM; inversion layer traps particulate matter.";
            commute = "Use underground metro corridors or AC carpool with internal air recirculation mode turned ON.";
            indoor = "Keep windows firmly shut. Run HEPA air purifier on Medium-to-High speed in primary occupied rooms.";
            evening = "Limit outdoor exposure to essential trips only. Exercise indoors using bodyweight or treadmill.";
            mask = "Certified N95 or KN95 respirator strongly advised for any outdoor travel exceeding 15 minutes.";
            diet = "Increase antioxidant-rich intake (vitamin C, ginger, warm turmeric water) to mitigate systemic oxidative stress.";
            bullets.add("Fine PM2.5 can penetrate alveolar tissue.");
            bullets.add("Ground temperature inversion traps emissions between 6:00 AM and 9:00 AM.");
            if (hasRespiratory || hasInfants) {
                bullets.add("Vulnerable household members should avoid opening balcony or exterior doors.");
            }
        } else {
            headline = "Severe Smog Emergency — Maximum Inhalation Defense";
            risk = "SEVERE";
            morning = "Strictly avoid any outdoor physical activity. Indoor HEPA sealed sanctuary is mandatory.";
            commute = "Work from home if permitted. If commuting is unavoidable, wear a tightly fitted N95 respirator and travel via air-filtered public transit.";
            indoor = "Maintain a sealed clean-room environment. Purifiers must run continuously on Turbo/High mode. Place damp towels beneath exterior door gaps.";
            evening = "Do not go outdoors for recreation or sports. Keep children and senior citizens in purified bedrooms.";
            mask = "Strictly mandatory N95 / FFP2 mask with active seal check. Avoid standard cloth masks as they filter less than 20% of sub-micron PM2.5.";
            diet = "Warm saline gargles, steam inhalation, and high fluid intake to assist airway ciliary clearance.";
            bullets.add("Hazardous particulate concentrations pose acute cardiovascular and pulmonary strain.");
            bullets.add("High ambient VOC and PM2.5 levels detected.");
            bullets.add("Zero outdoor physical exercise permitted.");
        }

        return PersonalizedGuidanceResponse.builder()
                .headline(headline)
                .summary(String.format("Tailored air quality guidance for %s in %s (Current AQI: %d).",
                        persona.replace("_", " ").toLowerCase(), req.getCity() != null ? req.getCity() : "your area", aqi))
                .exposureRiskLevel(risk)
                .morningRoutine(morning)
                .commuteStrategy(commute)
                .indoorAirStrategy(indoor)
                .eveningRoutine(evening)
                .maskRecommendation(mask)
                .dietAndHydrationTip(diet)
                .rationaleBullets(bullets)
                .sourceAttribution("AirWise Environmental Intelligence Protocol")
                .build();
    }

    private String callGemini(ChatRequest request) {
        String url = geminiApiUrl + "?key=" + geminiApiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String systemPrompt = "You are AIRWISE AI, an authoritative, science-backed urban air quality and lifestyle assistant. "
                + "User city: " + (request.getCity() != null ? request.getCity() : "Unknown") + ". "
                + "Current AQI: " + (request.getAqi() != null ? request.getAqi() : 150) + ". "
                + "User Persona: " + (request.getPersona() != null ? request.getPersona() : "General") + ". "
                + "Has Infants: " + Boolean.TRUE.equals(request.getHasInfants()) + ", Has Elderly: " + Boolean.TRUE.equals(request.getHasElderly()) + ", Respiratory Issues: " + Boolean.TRUE.equals(request.getHasRespiratoryIssues()) + ". "
                + "Instructions: Provide structured, practical, empathetic advice on outdoor activities, commute safety, indoor ventilation, mask recommendations, and daily schedule adaptations. "
                + "CRITICAL FORMATTING INSTRUCTION: Do NOT use any asterisks (*) or double asterisks (**) anywhere in your response. Do not use asterisks for bolding, italics, or bullet points. Use clean section titles, bullet points starting with a bullet symbol (•) or numbers, and clean text without asterisks. "
                + "Do NOT give medical diagnoses. Distinguish real sensor measurements from suggestions. Keep answers concise, actionable, and formatted cleanly.";

        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of("role", "user", "parts", List.of(
                                Map.of("text", systemPrompt + "\n\nUser Question: " + request.getMessage())
                        ))
                )
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            try {
                JsonNode root = objectMapper.readTree(response.getBody());
                JsonNode candidates = root.path("candidates");
                if (candidates.isArray() && !candidates.isEmpty()) {
                    return candidates.get(0).path("content").path("parts").get(0).path("text").asText();
                }
            } catch (Exception e) {
                log.error("Failed to parse Gemini response", e);
            }
        }
        return null;
    }

    private String generateExpertHeuristicReply(ChatRequest req) {
        String query = req.getMessage().toLowerCase();
        int aqi = req.getAqi() != null ? req.getAqi() : 160;
        String city = req.getCity() != null ? req.getCity() : "your location";

        if (query.contains("running") || query.contains("run") || query.contains("jog") || query.contains("exercise") || query.contains("workout")) {
            if (aqi <= 75) {
                return "Safe for Outdoor Running\n\n"
                        + "Current AQI in " + city + " is " + aqi + " (Good to Moderate).\n\n"
                        + "• Recommendation: Outdoor running is safe and encouraged.\n"
                        + "• Best Window: Morning between 6:30 AM and 8:30 AM is optimal.\n"
                        + "• Tip: Choose park tracks away from high-traffic roadways to avoid localized vehicular NO2.";
            } else if (aqi <= 150) {
                return "Exercise with Caution\n\n"
                        + "Current AQI in " + city + " is " + aqi + " (Unhealthy for Sensitive Groups).\n\n"
                        + "• Recommendation: Reduce high-intensity interval training outdoors. Switch to steady, low-impact brisk walking or indoor gym workouts.\n"
                        + "• Timing: Midday between 1:00 PM and 3:30 PM is safer than early morning when cold air traps particulates.\n"
                        + "• Warning: If you experience throat irritation or shortness of breath, cease outdoor exercise immediately.";
            } else {
                return "Avoid Outdoor Running Today\n\n"
                        + "Current AQI in " + city + " is " + aqi + " (Severe Smog / Unhealthy).\n\n"
                        + "• Physical Impact: During cardio, minute ventilation increases 10x to 15x. Running in this air deposits microscopic PM2.5 and black carbon directly into your bronchial passages.\n"
                        + "• Recommended Alternative: Treadmill run, indoor cycling, or bodyweight strength workouts inside an air-purified room.\n"
                        + "• Mask Note: Do not attempt high-cardio running while wearing an N95 mask, as it restricts airflow and increases cardiac strain.";
            }
        }

        if (query.contains("ventilate") || query.contains("window") || query.contains("open") || query.contains("fresh air")) {
            if (aqi > 150) {
                return "Keep Windows Sealed\n\n"
                        + "Outdoor AQI is " + aqi + ". Opening windows right now will rapidly fill your living space with toxic PM2.5.\n\n"
                        + "• Action: Keep all windows and balcony sliding doors tightly closed.\n"
                        + "• Indoor CO2 Management: If your room feels stuffy, run an internal fan or air purifier on high speed. Only do a rapid 5-minute crack-ventilation between 2:00 PM - 3:00 PM if solar warming has temporarily lowered surface PM2.5.\n"
                        + "• Sealing: Use weather-stripping or damp towels along door bottoms to stop toxic drafts.";
            } else {
                return "Controlled Ventilation is Safe\n\n"
                        + "Outdoor AQI is " + aqi + ".\n\n"
                        + "• Optimal Window: Open windows between 12:30 PM and 4:00 PM for 20-30 minutes for a complete fresh air exchange.\n"
                        + "• Purifier Strategy: Turn on your HEPA purifier 15 minutes after closing windows to scrub any settling fine dust.";
            }
        }

        if (query.contains("family") || query.contains("children") || query.contains("kids") || query.contains("senior") || query.contains("elderly")) {
            return "Family & Vulnerable Member Protection Plan (AQI: " + aqi + ")\n\n"
                    + "Children and senior citizens breathe more air relative to their body weight, making them acutely vulnerable to atmospheric pollution.\n\n"
                    + "1. Schools & Outdoor Play: Children should not have outdoor sports or recess when AQI exceeds 150.\n"
                    + "2. Bedroom Clean Zones: Establish at least one primary room (typically the bedroom) as a sealed clean air haven with a running HEPA filter.\n"
                    + "3. School Commute: Ensure children wear child-sized N95 masks during auto, bus, or walking commutes.\n"
                    + "4. Hydration: Warm fluids and saline nasal sprays help soothe inflamed nasal mucosa.";
        }

        if (query.contains("mask") || query.contains("n95") || query.contains("cloth")) {
            return "Respiratory Mask Selection Guide\n\n"
                    + "• Cloth / Surgical Masks: Ineffective against PM2.5 smog. They filter less than 20% of sub-micron particles and leak along the sides.\n"
                    + "• Certified N95 / FFP2: Highly effective. Filters at least 95% of airborne particles down to 0.3 microns when fitted with a tight seal.\n"
                    + "• Fit Test: Pinch the metal nose wire firmly over your nose bridge. When you inhale deeply, the mask should collapse slightly toward your face without air escaping into your eyes.";
        }

        if (query.contains("commute") || query.contains("travel") || query.contains("metro") || query.contains("car")) {
            return "Smog-Resilient Commute Strategy\n\n"
                    + "• Best Mode: Underground Metro / Subway. Stations and train coaches utilize industrial HVAC filtration with lower PM2.5 concentrations.\n"
                    + "• If Driving: Turn cabin air circulation to INTERNAL RECIRCULATION mode. Never draw exterior air into your vents in stop-and-go traffic.\n"
                    + "• Two-wheelers & Walking: Highest particulate exposure. A tightly fitted N95 mask is essential.";
        }

        // Generic comprehensive air health response
        return "Air Quality Analysis for " + city + " (AQI: " + aqi + ")\n\n"
                + "Based on live atmospheric monitoring:\n\n"
                + "• Condition: Currently categorised as " + AirQualityService.getAqiCategory(aqi) + ".\n"
                + "• Outdoor Safety: Limit non-essential outdoor exertion, especially during morning temperature inversions.\n"
                + "• Indoor Environment: Keep HEPA air purifiers active. Seal leaky window gaps.\n"
                + "• Commute Protocol: Opt for enclosed transit (Metro/carpool with recirculation) and carry a certified N95 respirator.\n\n"
                + "Note: AirWise AI provides environmental guidance based on meteorological data and public health frameworks, not formal medical diagnoses.";
    }

    public static String sanitizeAiReply(String raw) {
        if (raw == null) return "";
        String cleaned = raw;
        // Strip markdown header hashes (### Title -> Title)
        cleaned = cleaned.replaceAll("(?m)^#{1,6}\\s+", "");
        // Remove bold double asterisks (**text** -> text)
        cleaned = cleaned.replaceAll("\\*\\*([^*]+)\\*\\*", "$1");
        // Remove italic single asterisks (*text* -> text)
        cleaned = cleaned.replaceAll("\\*([^*]+)\\*", "$1");
        // Replace asterisk bullet points (* Item -> • Item)
        cleaned = cleaned.replaceAll("(?m)^\\s*\\*\\s+", "• ");
        // Replace hyphen bullet points (- Item -> • Item)
        cleaned = cleaned.replaceAll("(?m)^\\s*-\\s+", "• ");
        // Strip any remaining stray asterisk characters
        cleaned = cleaned.replace("*", "");
        return cleaned.trim();
    }

    private List<String> generateFollowUps(String message, Integer aqi) {
        return List.of(
                "Is it safe to go running or walking today?",
                "When is the best time to open windows today?",
                "What type of mask is best for winter smog?",
                "How can I set up an indoor clean-air zone?"
        );
    }
}
