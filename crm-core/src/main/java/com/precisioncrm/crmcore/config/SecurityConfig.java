package com.precisioncrm.crmcore.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable()) // Disable CSRF for simple API usage
                .authorizeHttpRequests((requests) -> requests
                        .requestMatchers("/api/public/**").permitAll()
                        .anyRequest().authenticated()
                )
                .httpBasic(org.springframework.security.config.Customizer.withDefaults()); // Enable Basic Auth

        return http.build();
    }

    @Bean
    public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
        org.springframework.web.cors.CorsConfiguration configuration = new org.springframework.web.cors.CorsConfiguration();
        configuration.setAllowedOrigins(java.util.Arrays.asList(
            "http://localhost:5173", 
            "https://crm-frontend.onrender.com", 
            "https://www.psmtechstaffing.com"
        ));
        configuration.setAllowedMethods(java.util.Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(java.util.Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);
        org.springframework.web.cors.UrlBasedCorsConfigurationSource source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public UserDetailsService userDetailsService() {
        // Defining users as per requirements
        UserDetails user1 = User.withUsername("jesse@precisionsourcemanagement.com")
                .password("{noop}Staffpass1!")
                .roles("RECRUITER", "ADMIN")
                .build();

        UserDetails user2 = User.withUsername("dianeb@precisionsourcemanagement.com")
                .password("{noop}Staffpass1!")
                .roles("RECRUITER")
                .build();
        
        UserDetails user3 = User.withUsername("kassandra@precisionsourcemanagement.com")
                .password("{noop}Staffpass1!")
                .roles("RECRUITER")
                .build();

        return new InMemoryUserDetailsManager(user1, user2, user3);
    }
}
