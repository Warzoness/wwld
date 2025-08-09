package com.gateway.service;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.*;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class UploadService {

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            // ✅ Tạo thư mục uploads trong thư mục làm việc hiện tại
            String uploadDir = Paths.get("uploads").toAbsolutePath().toString();
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            // ✅ Đặt tên file duy nhất
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, fileName);

            // ✅ Lưu file
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // ✅ Trả về đường dẫn truy cập (đường dẫn tĩnh Spring Boot sẽ cấu hình ở WebConfig)
            return ResponseEntity.ok("/uploads/" + fileName);
        } catch (Exception e) {
            e.printStackTrace(); // ❗ THÊM DÒNG NÀY để biết lỗi gì nếu ảnh không lưu
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Upload thất bại");
        }
    }
}
