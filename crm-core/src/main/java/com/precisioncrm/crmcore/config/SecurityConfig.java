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
                .csrf(csrf -> csrf.disable()) // Disable CSRF for simple API usage
                .authorizeHttpRequests((requests) -> requests
                        .requestMatchers("/api/public/**").permitAll()
                        .anyRequest().authenticated()
                )
                .httpBasic(org.springframework.security.config.Customizer.withDefaults()); // Enable Basic Auth

        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        // Defining users as per requirements
        UserDetails user1 = User.withUsername("Jesse@precisionsourcemanagement.com")
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
