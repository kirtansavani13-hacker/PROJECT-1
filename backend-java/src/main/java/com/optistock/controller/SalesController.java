package com.optistock.controller;

import com.optistock.model.Product;
import com.optistock.model.SalesLog;
import com.optistock.repository.ProductRepository;
import com.optistock.repository.SalesLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = "*")
public class SalesController {

    @Autowired
    private SalesLogRepository salesLogRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<SalesLog> getAllSales() {
        return salesLogRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<SalesLog> createSale(@RequestBody SalesLog sale) {
        if (sale.getId() == null || sale.getId().isBlank()) {
            sale.setId("SL-" + (1000 + new Random().nextInt(9000)));
        }
        if (sale.getDate() == null || sale.getDate().isBlank()) {
            sale.setDate(LocalDate.now().toString());
        }

        Optional<Product> skuOpt = productRepository.findById(sale.getSkuId());
        if (skuOpt.isPresent()) {
            Product sku = skuOpt.get();
            sale.setSkuTitle(sku.getTitle());
            if (sale.getRevenue() == null || sale.getRevenue() <= 0) {
                sale.setRevenue(sku.getUnitPrice() * sale.getUnitsSold());
            }
            // Update stock
            sku.setCurrentStock(Math.max(0, sku.getCurrentStock() - sale.getUnitsSold()));
            productRepository.save(sku);
        }

        SalesLog saved = salesLogRepository.save(sale);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }
}
