package com.optistock.config;

import com.optistock.model.Product;
import com.optistock.model.PurchaseOrder;
import com.optistock.model.SalesLog;
import com.optistock.model.SystemAlert;
import com.optistock.repository.AlertRepository;
import com.optistock.repository.ProductRepository;
import com.optistock.repository.PurchaseOrderRepository;
import com.optistock.repository.SalesLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    @Autowired
    private SalesLogRepository salesLogRepository;

    @Autowired
    private AlertRepository alertRepository;

    @Override
    public void run(String... args) throws Exception {
        // Seed Products
        productRepository.saveAll(List.of(
            new Product("SKU-D2C-101", "Kashmiri Saffron Premium 1g", "Gourmet & Spices", 45, 120, 200, 650.0, 10, "BLR-FC-01 (Bengaluru)", "STOCKOUT_RISK", 1.25, "Valley Spices Pvt Ltd"),
            new Product("SKU-D2C-102", "Cold Pressed Virgin Coconut Oil 1L", "Wellness & Oils", 680, 300, 450, 480.0, 5, "BHW-FC-02 (Bhiwandi)", "OPTIMAL", 1.10, "Kerala Organics"),
            new Product("SKU-D2C-103", "Ayurvedic Hair Vitalizer Serum 100ml", "Personal Care", 18, 150, 250, 890.0, 7, "DEL-FC-03 (Gurugram)", "CRITICAL", 1.45, "HerbCraft Labs"),
            new Product("SKU-D2C-104", "Organic A2 Desi Cow Ghee 500ml", "Dairy & Essentials", 1250, 400, 600, 750.0, 4, "BHW-FC-02 (Bhiwandi)", "OPTIMAL", 1.05, "Gir Gaushala Producer Co"),
            new Product("SKU-D2C-105", "Matcha Green Tea Ceremonial Grade 100g", "Beverages", 92, 100, 160, 1200.0, 14, "BLR-FC-01 (Bengaluru)", "LOW_STOCK", 1.15, "Nippon Tea Exports"),
            new Product("SKU-D2C-106", "Raw Wildflower Forest Honey 500g", "Gourmet & Spices", 2100, 500, 800, 390.0, 6, "DEL-FC-03 (Gurugram)", "OVERSTOCKED", 0.95, "Himalayan Bee Keepers"),
            new Product("SKU-D2C-107", "Active Charcoal Clay Face Mask 150g", "Personal Care", 240, 200, 350, 450.0, 8, "BHW-FC-02 (Bhiwandi)", "LOW_STOCK", 1.30, "HerbCraft Labs")
        ));

        // Seed Sales Logs
        salesLogRepository.saveAll(List.of(
            new SalesLog("SL-9901", "SKU-D2C-101", "Kashmiri Saffron Premium 1g", "Amazon", 42, 27300.0, "2026-09-12"),
            new SalesLog("SL-9902", "SKU-D2C-103", "Ayurvedic Hair Vitalizer Serum 100ml", "Shopify", 65, 57850.0, "2026-09-12"),
            new SalesLog("SL-9903", "SKU-D2C-102", "Cold Pressed Virgin Coconut Oil 1L", "Flipkart", 88, 42240.0, "2026-09-12"),
            new SalesLog("SL-9904", "SKU-D2C-104", "Organic A2 Desi Cow Ghee 500ml", "Amazon", 110, 82500.0, "2026-09-11")
        ));

        // Seed Purchase Orders
        purchaseOrderRepository.saveAll(List.of(
            new PurchaseOrder("PO-2026-0881", "SKU-D2C-103", "Ayurvedic Hair Vitalizer Serum 100ml", "HerbCraft Labs", 500, 520.0, 260000.0, "IN_TRANSIT", "2026-09-08", "2026-09-15", "DEL-FC-03 (Gurugram)"),
            new PurchaseOrder("PO-2026-0882", "SKU-D2C-101", "Kashmiri Saffron Premium 1g", "Valley Spices Pvt Ltd", 300, 410.0, 123000.0, "ISSUED", "2026-09-10", "2026-09-20", "BLR-FC-01 (Bengaluru)")
        ));

        // Seed Alerts
        alertRepository.saveAll(List.of(
            new SystemAlert("ALT-1001", "SKU-D2C-103", "CRITICAL", "STOCKOUT_IMMINENT", "Critical Stockout Risk (2 Days Left)", "Current stock (18 units) will deplete within 48 hours based on recent 1.45x sales surge on Shopify.", "Expedite PO-2026-0881 or initiate air freight dispatch.", Instant.now().toString(), "ACTIVE"),
            new SystemAlert("ALT-1002", "SKU-D2C-101", "HIGH", "REORDER_POINT_REACHED", "Reorder Point Breached", "Stock (45 units) fallen below reorder threshold (200 units). Upcoming Diwali surge predicted.", "Issue pending PO-2026-0882 to Valley Spices.", Instant.now().toString(), "ACTIVE")
        ));

        System.out.println(">>> OptiStock AI Seed Data Loaded into Spring Boot Database!");
    }
}
