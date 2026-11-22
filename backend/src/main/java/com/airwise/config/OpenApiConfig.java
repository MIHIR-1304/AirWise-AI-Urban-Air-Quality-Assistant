package com.airwise.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI airwiseOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("AIRWISE AI — REST API")
                        .description("Urban Air Quality Assistant & Personalization Engine API documentation.")
                        .version("1.0.0")
                        .contact(new Contact().name("AirWise Engineering").email("dev@airwise.ai"))
                        .license(new License().name("Apache 2.0").url("https://airwise.ai/license")))
                .addSecurityItem(new SecurityRequirement().addList("BearerAuth"))
                .components(new Components()
                        .addSecuritySchemes("BearerAuth", new SecurityScheme()
                                .name("BearerAuth")
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }
}
