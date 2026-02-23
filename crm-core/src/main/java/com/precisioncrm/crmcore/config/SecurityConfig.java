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
        public org.springframework.security.web.csrf.CookieCsrfTokenRepository csrfTokenRepository() {
                org.springframework.security.web.csrf.CookieCsrfTokenRepository repository = org.springframework.security.web.csrf.CookieCsrfTokenRepository
                                .withHttpOnlyFalse();
                repository.setCookieCustomizer(cookie -> cookie.sameSite("None").secure(true));
                return repository;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .csrf(csrf -> csrf
                                                .csrfTokenRepository(csrfTokenRepository())
                                                .csrfTokenRequestHandler(
                                                                new org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler()))
                                .addFilterAfter(new CsrfCookieFilter(),
                                                org.springframework.security.web.authentication.www.BasicAuthenticationFilter.class)
                                .authorizeHttpRequests((requests) -> requests
                                                .requestMatchers("/", "/error", "/api/public/**",
                                                                "/api/candidates/parse",
                                                                "/api/candidates/debug-connection", "/api/dashboard",
                                                                "/api/dashboard/**",
                                                                "/api/job-orders", "/api/job-orders/**",
                                                                "/api/clients", "/api/clients/**")
                                                .permitAll()
                                                .requestMatchers("/api/notifications/**").authenticated()
                                                // showing
                                                // intent,
                                                // though
                                                // anyRequest
                                                // covers it
                                                .anyRequest().authenticated())
                                .httpBasic(org.springframework.security.config.Customizer.withDefaults()); // Enable
                                                                                                           // Basic Auth

                return http.build();
        }

        @Bean
        public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
                org.springframework.web.cors.CorsConfiguration configuration = new org.springframework.web.cors.CorsConfiguration();
                configuration.setAllowedOrigins(java.util.Arrays.asList(
                                "http://localhost:5173",
                                "https://crm-frontend.onrender.com",
                                "https://www.psmtechstaffing.com",
                                "https://psmtechstaffing.com"));
                configuration.setAllowedMethods(java.util.Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                configuration.setAllowedHeaders(java.util.Arrays.asList("Authorization", "Content-Type", "X-XSRF-TOKEN",
                                "X-Requested-With"));
                configuration.setExposedHeaders(java.util.Arrays.asList("X-XSRF-TOKEN"));
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

                return new org.springframework.security.provisioning.InMemoryUserDetailsManager(user1, user2, user3);
        }

        private static final class CsrfCookieFilter extends org.springframework.web.filter.OncePerRequestFilter {
                @Override
                protected void doFilterInternal(jakarta.servlet.http.HttpServletRequest request,
                                jakarta.servlet.http.HttpServletResponse response,
                                jakarta.servlet.FilterChain filterChain)
                                throws jakarta.servlet.ServletException, java.io.IOException {
                        org.springframework.security.web.csrf.CsrfToken csrfToken = (org.springframework.security.web.csrf.CsrfToken) request
                                        .getAttribute(org.springframework.security.web.csrf.CsrfToken.class.getName());
                        if (null != csrfToken.getHeaderName()) {
                                response.setHeader(csrfToken.getHeaderName(), csrfToken.getToken());
                        }
                        filterChain.doFilter(request, response);
                }
        }
}
