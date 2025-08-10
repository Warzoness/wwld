package com.gateway.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.Data;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/cloudinary")
public class CloudinaryService {
    private final Cloudinary cloudinary;

    // DÙNG CHO DEMO
    private static final String API_KEY = "156696369873978";
    private static final String CLOUD_NAME = "dnfypskjn";
    private static final String API_SECRET = "UENZ-YQ0_Ap1U-aUbXXqT0gqMd4";
    private static final String DEFAULT_FOLDER = "wwld";

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    @PostMapping("/sign")
    public Map<String, Object> sign(@RequestBody SignRequest req) {
        long timestamp = Instant.now().getEpochSecond();

        Map<String, Object> params = ObjectUtils.asMap(
                "timestamp", timestamp,
                "folder", (req.getFolder() != null && !req.getFolder().isBlank())
                        ? req.getFolder() : DEFAULT_FOLDER
                // có thể thêm "public_id", "context", "transformation", ...
        );

        String signature = cloudinary.apiSignRequest(params, API_SECRET);

        Map<String, Object> res = new HashMap<>();
        res.put("timestamp", timestamp);
        res.put("signature", signature);
        res.put("apiKey", API_KEY);
        res.put("cloudName", CLOUD_NAME);
        res.put("folder", params.get("folder"));
        return res;
    }

    @Data
    public static class SignRequest {
        private String folder;
    }
}
