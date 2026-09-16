package com.optistock.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    private String id;
    private String title;
    private String category;
    private Integer currentStock;
    private Integer safetyStock;
    private Integer reorderPoint;
    private Double unitPrice;
    private Integer leadTimeDays;
    private String warehouse;
    private String status; // OPTIMAL, LOW_STOCK, CRITICAL, OVERSTOCKED
    private Double growthFactor;
    private String supplier;
}
