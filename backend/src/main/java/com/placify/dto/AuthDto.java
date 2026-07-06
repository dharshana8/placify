package com.placify.dto;

import com.placify.model.User;
import lombok.Data;
import java.util.List;

public class AuthDto {

    @Data
    public static class RegisterRequest {
        private String name;
        private String email;
        private String password;
        private User.Role role;
        private String departmentName;
        private String companyName;
        private String rollNumber;
    }

    @Data
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Data
    public static class AuthResponse {
        private String token;
        private String role;
        private String name;
        private Long userId;
        private Long profileId;

        public AuthResponse(String token, String role, String name, Long userId, Long profileId) {
            this.token = token;
            this.role = role;
            this.name = name;
            this.userId = userId;
            this.profileId = profileId;
        }
    }
}
