package com.optistock.controller;

import com.optistock.model.Product;
import com.optistock.model.PurchaseOrder;
import com.optistock.repository.ProductRepository;
import com.optistock.repository.PurchaseOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/purchase-orders")
@CrossOrigin(origins = "*")
public class PurchaseOrderController {

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<PurchaseOrder> getAllOrders() {
        return purchaseOrderRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<PurchaseOrder> createPO(@RequestBody PurchaseOrder po) {
        if (po.getId() == null || po.getId().isBlank()) {
            po.setId("PO-2026-" + (1000 + new Random().nextInt(9000)));
        }
        po.setStatus("ISSUED");
        po.setOrderDate(LocalDate.now().toString());
        po.setExpectedDelivery(LocalDate.now().plusDays(7).toString());

        Optional<Product> skuOpt = productRepository.findById(po.getSkuId());
        if (skuOpt.isPresent()) {
            Product sku = skuOpt.get();
            po.setSkuTitle(sku.getTitle());
            if (po.getSupplierName() == null) po.setSupplierName(sku.getSupplier());
            if (po.getUnitCost() == null) po.setUnitCost(Math.round(sku.getUnitPrice() * 0.6 * 100.0) / 100.0);
            if (po.getDestinationWarehouse() == null) po.setDestinationWarehouse(sku.getWarehouse());
        }

        po.setTotalAmount(po.getUnitsOrdered() * po.getUnitCost());

        PurchaseOrder saved = purchaseOrderRepository.save(po);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/receive")
    public ResponseEntity<PurchaseOrder> receivePO(@PathVariable String id) {
        return purchaseOrderRepository.findById(id).map(po -> {
            po.setStatus("RECEIVED");
            Optional<Product> skuOpt = productRepository.findById(po.getSkuId());
            if (skuOpt.isPresent()) {
                Product sku = skuOpt.get();
                sku.setCurrentStock(sku.getCurrentStock() + po.getUnitsOrdered());
                sku.setStatus("OPTIMAL");
                productRepository.save(sku);
            }
            PurchaseOrder saved = purchaseOrderRepository.save(po);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }
}
