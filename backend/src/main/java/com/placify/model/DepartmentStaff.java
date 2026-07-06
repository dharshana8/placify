package com.placify.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "department_staff")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepartmentStaff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "dept_id", nullable = true)
    private Department department;

    private String designation;
}
