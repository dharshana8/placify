package com.placify.service;

import com.placify.model.*;
import com.placify.repository.*;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ExcelService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public String processExcel(MultipartFile file, Department department) throws IOException {
        Workbook workbook = new XSSFWorkbook(file.getInputStream());
        int imported = 0, skipped = 0;

        for (int i = 0; i < workbook.getNumberOfSheets(); i++) {
            Sheet sheet = workbook.getSheetAt(i);
            Row header = sheet.getRow(0);
            if (header == null) continue;

            Map<String, Integer> colIndex = new HashMap<>();
            for (Cell cell : header) {
                colIndex.put(cell.getStringCellValue().trim().toLowerCase(), cell.getColumnIndex());
            }

            for (int r = 1; r <= sheet.getLastRowNum(); r++) {
                Row row = sheet.getRow(r);
                if (row == null) continue;

                String email = getCellValue(row, colIndex.get("email"));
                String name = getCellValue(row, colIndex.get("name"));
                if (email == null || email.isBlank()) { skipped++; continue; }

                if (userRepository.existsByEmail(email)) { skipped++; continue; }

                User user = User.builder()
                        .name(name != null ? name : "Student")
                        .email(email)
                        .password(passwordEncoder.encode("Placify@123"))
                        .role(User.Role.STUDENT)
                        .build();
                user = userRepository.save(user);

                String cgpaStr = getCellValue(row, colIndex.get("cgpa"));
                String rollNo = getCellValue(row, colIndex.get("roll") != null ? colIndex.get("roll") : colIndex.get("rollnumber"));
                String skillsStr = getCellValue(row, colIndex.get("skills"));

                Student student = Student.builder()
                        .user(user)
                        .department(department)
                        .rollNumber(rollNo)
                        .cgpa(cgpaStr != null ? parseDouble(cgpaStr) : null)
                        .skills(skillsStr != null ? Arrays.asList(skillsStr.split(",")) : new ArrayList<>())
                        .build();
                studentRepository.save(student);
                imported++;
            }
        }
        workbook.close();
        return "Imported: " + imported + ", Skipped (duplicates/invalid): " + skipped;
    }

    private String getCellValue(Row row, Integer colIdx) {
        if (colIdx == null || row == null) return null;
        Cell cell = row.getCell(colIdx);
        if (cell == null) return null;
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue().trim();
            case NUMERIC -> String.valueOf(cell.getNumericCellValue());
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            default -> null;
        };
    }

    private Double parseDouble(String val) {
        try { return Double.parseDouble(val.trim()); } catch (Exception e) { return null; }
    }
}
