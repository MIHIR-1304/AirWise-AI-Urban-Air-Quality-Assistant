package com.airwise.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

/**
 * Production DataSource configuration.
 * Automatically normalizes cloud-native database connection strings
 * (e.g., Render/Heroku postgresql:// or postgres://) into standard
 * JDBC-compliant URLs (jdbc:postgresql://...) and extracts credentials if embedded.
 */
@Configuration
@Profile("prod")
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${spring.datasource.url:}")
    private String rawUrl;

    @Value("${spring.datasource.username:}")
    private String defaultUsername;

    @Value("${spring.datasource.password:}")
    private String defaultPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        String url = rawUrl;
        String username = defaultUsername;
        String password = defaultPassword;

        if (url != null && !url.isBlank()) {
            if (url.startsWith("postgres://") || url.startsWith("postgresql://")) {
                try {
                    String uriString = url.startsWith("postgres://")
                            ? "postgresql://" + url.substring("postgres://".length())
                            : url;
                    URI uri = new URI(uriString);

                    // Always extract credentials from cloud connection URL if present
                    if (uri.getUserInfo() != null && !uri.getUserInfo().isBlank()) {
                        String[] userInfo = uri.getUserInfo().split(":", 2);
                        String extractedUser = URLDecoder.decode(userInfo[0], StandardCharsets.UTF_8);
                        String extractedPass = userInfo.length > 1
                                ? URLDecoder.decode(userInfo[1], StandardCharsets.UTF_8)
                                : null;

                        if (extractedUser != null && !extractedUser.isBlank()) {
                            username = extractedUser;
                        }
                        if (extractedPass != null && !extractedPass.isBlank()) {
                            password = extractedPass;
                        }
                    }

                    int port = uri.getPort() != -1 ? uri.getPort() : 5432;
                    String path = uri.getPath();
                    url = "jdbc:postgresql://" + uri.getHost() + ":" + port + path;
                    log.info("Normalized cloud database URL for JDBC: jdbc:postgresql://{}:{}{}, user: {}",
                            uri.getHost(), port, path, username);
                } catch (Exception e) {
                    log.warn("Could not parse cloud database URI; prepending 'jdbc:': {}", e.getMessage());
                    if (!url.startsWith("jdbc:")) {
                        url = "jdbc:" + url;
                    }
                }
            } else if (!url.startsWith("jdbc:")) {
                url = "jdbc:" + url;
            }
        }

        return DataSourceBuilder.create()
                .url(url)
                .username(username)
                .password(password)
                .driverClassName("org.postgresql.Driver")
                .build();
    }
}
