package lk.oshanh.debitmanager.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
               .allowedOrigins("http://localhost:3000", "http://localhost:5173", "https://www.oshanh.live")
               .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
               .allowedHeaders(
                   "Authorization",
                   "Content-Type",
                   "Accept",
                   "Origin",
                   "X-Requested-With",
                   "Access-Control-Request-Method",
                   "Access-Control-Request-Headers"
               )
               .exposedHeaders("Authorization")
               .allowCredentials(true)
               .maxAge(3600);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String uploadDir = System.getProperty("user.dir") + "/backend/uploads";
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadDir + "/");
    }
}
