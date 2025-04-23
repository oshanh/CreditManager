package lk.oshanh.credit.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/login")
public class TestController {
    @GetMapping
    public String test() {
        return "Backend is up and running";
    }
}
