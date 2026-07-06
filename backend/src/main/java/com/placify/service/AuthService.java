package com.placify.service;

import com.placify.dto.AuthDto.*;
import com.placify.model.*;
import com.placify.repository.*;
import com.placify.security.JwtUtil;
import com.placify.security.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final DepartmentRepository departmentRepository;
    private final DepartmentStaffRepository staffRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(req.getRole())
                .build();
        user = userRepository.save(user);

        Long profileId = null;

        switch (req.getRole()) {
            case STUDENT -> {
                Department dept = null;
                if (req.getDepartmentName() != null) {
                    dept = departmentRepository.findByName(req.getDepartmentName()).orElse(null);
                }
                Student student = Student.builder().user(user).department(dept).build();
                student = studentRepository.save(student);
                profileId = student.getId();
            }
            case COMPANY -> {
                Company company = Company.builder()
                        .user(user)
                        .companyName(req.getCompanyName() != null ? req.getCompanyName() : req.getName())
                        .build();
                company = companyRepository.save(company);
                profileId = company.getId();
            }
            case DEPARTMENT -> {
                String deptName = req.getDepartmentName() != null && !req.getDepartmentName().isBlank()
                        ? req.getDepartmentName() : "General";
                Department dept = departmentRepository.findByName(deptName)
                        .orElseGet(() -> departmentRepository.save(
                                Department.builder().name(deptName).build()));
                DepartmentStaff staff = DepartmentStaff.builder().user(user).department(dept).build();
                staff = staffRepository.save(staff);
                profileId = staff.getId();
            }
            case ADMIN -> profileId = user.getId();
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails, user.getRole().name());
        return new AuthResponse(token, user.getRole().name(), user.getName(), user.getId(), profileId);
    }

    public AuthResponse login(LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long profileId = switch (user.getRole()) {
            case STUDENT -> studentRepository.findByUserId(user.getId()).map(Student::getId).orElse(null);
            case COMPANY -> companyRepository.findByUserId(user.getId()).map(Company::getId).orElse(null);
            case DEPARTMENT -> staffRepository.findByUserId(user.getId()).map(DepartmentStaff::getId).orElse(null);
            case ADMIN -> user.getId();
        };

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails, user.getRole().name());
        return new AuthResponse(token, user.getRole().name(), user.getName(), user.getId(), profileId);
    }
}
