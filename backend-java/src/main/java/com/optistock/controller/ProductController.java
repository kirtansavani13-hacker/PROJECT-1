package com.optistock.controller;

import com.optistock.model.Product;
import com.optistock.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<Product> getAllProducts(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search
    ) {
        List<Product> products = productRepository.findAll();

        if (status != null && !status.equalsIgnoreCase("ALL")) {
            products = products.stream().filter(p -> p.getStatus().equalsIgnoreCase(status)).toList();
        }
        if (category != null && !category.equalsIgnoreCase("ALL")) {
            products = products.stream().filter(p -> p.getCategory().equalsIgnoreCase(category)).toList();
        }
        if (search != null && !search.isBlank()) {
            String term = search.toLowerCase();
            products = products.stream().filter(p -> 
                p.getTitle().toLowerCase().contains(term) || p.getId().toLowerCase().contains(term)
            ).toList();
        }

        return products;
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        if (product.getId() == null || product.getId().isBlank()) {
            product.setId("SKU-D2C-" + (100 + new Random().nextInt(900)));
        }
        if (product.getStatus() == null) {
            product.setStatus(product.getCurrentStock() <= product.getSafetyStock() ? "CRITICAL" : "OPTIMAL");
        }
        if (product.getGrowthFactor() == null) {
            product.setGrowthFactor(1.10);
        }
        Product saved = productRepository.save(product);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable String id, @RequestBody Product updates) {
        return productRepository.findById(id).map(p -> {
            if (updates.getCurrentStock() != null) p.setCurrentStock(updates.getCurrentStock());
            if (updates.getSafetyStock() != null) p.setSafetyStock(updates.getSafetyStock());
            if (updates.getReorderPoint() != null) p.setReorderPoint(updates.getReorderPoint());
            if (updates.getUnitPrice() != null) p.setUnitPrice(updates.getUnitPrice());
            if (updates.getTitle() != null) p.setTitle(updates.getTitle());
            
            // Recalculate status
            if (p.getCurrentStock() <= 0) p.setStatus("STOCKOUT");
            else if (p.getCurrentStock() <= p.getSafetyStock()) p.setStatus("CRITICAL");
            else if (p.getCurrentStock() <= p.getReorderPoint()) p.setStatus("LOW_STOCK");
            else p.setStatus("OPTIMAL");

            Product saved = productRepository.save(p);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }
}
