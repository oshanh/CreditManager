package lk.oshanh.credimanage.controller;

import jakarta.servlet.http.HttpServletRequest;
import lk.oshanh.credimanage.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
public class FileController {

    //private final String uploadDir = System.getProperty("user.dir") + "/uploads";
    private final String uploadDir ="/uploads";

    private final JwtTokenProvider tokenProvider;

    @GetMapping("/{type}/{filename:.+}")
    public ResponseEntity<Resource> serveFile(
            @PathVariable String type,
            @PathVariable String filename,
            Authentication authentication,
            HttpServletRequest request) {
        try {
            // Check authentication through Spring Security or token in query
            String token = request.getParameter("token");
            if (authentication == null && (token == null || !tokenProvider.validateToken(token))) {
                return ResponseEntity.status(401).build();
            }

            Path filePath = Paths.get(uploadDir, type, filename);
            System.out.println(filePath.toString());
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                String contentType = determineContentType(filename);

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }

    private String determineContentType(String filename) {
        if (filename.toLowerCase().endsWith(".jpg") || filename.toLowerCase().endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (filename.toLowerCase().endsWith(".png")) {
            return "image/png";
        } else if (filename.toLowerCase().endsWith(".gif")) {
            return "image/gif";
        } else {
            return "application/octet-stream";
        }
    }
} 