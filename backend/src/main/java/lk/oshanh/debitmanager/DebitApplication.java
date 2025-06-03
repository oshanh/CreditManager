package lk.oshanh.debitmanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DebitApplication {

    public static void main(String[] args) {
        SpringApplication.run(DebitApplication.class, args);
    }

}
