package com.optistock;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class OptiStockApplication {
    public static void main(String[] args) {
        SpringApplication.run(OptiStockApplication.class, args);
        System.out.println("OptiStock AI Java Spring Boot Backend Server started on port 5000!");
    }
}
