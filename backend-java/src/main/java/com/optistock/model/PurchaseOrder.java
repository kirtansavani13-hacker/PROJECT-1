package com.optistock.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "purchase_orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrder {

    @Id
    private String id;
    private String skuId;
    private String skuTitle;
    private String supplierName;
    private Integer unitsOrdered;
    private Double unitCost;
    private Double totalAmount;
    private String status; // DRAFT, ISSUED, IN_TRANSIT, RECEIVED
    private String orderDate;
    private String expectedDelivery;
    private String destinationWarehouse;
}
