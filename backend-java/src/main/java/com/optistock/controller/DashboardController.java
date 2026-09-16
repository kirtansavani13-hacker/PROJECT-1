package com.optistock.controller;

import com.optistock.model.Product;
import com.optistock.model.PurchaseOrder;
import com.optistock.model.SalesLog;
import com.optistock.repository.AlertRepository;
import com.optistock.repository.ProductRepository;
import com.optistock.repository.PurchaseOrderRepository;
import com.optistock.repository.SalesLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    @Autowired
    private SalesLogRepository salesLogRepository;

    @Autowired
    private AlertRepository alertRepository;

    @GetMapping("/summary")
    public Map<String, Object> getSummary() {
        List<Product> products = productRepository.findAll();
        List<PurchaseOrder> pos = purchaseOrderRepository.findAll();
        List<SalesLog> sales = salesLogRepository.findAll();

        int totalSKUs = products.size();
        long criticalCount = products.stream().filter(p -> p.getCurrentStock() <= p.getSafetyStock()).count();
        double totalStockValue = products.stream().mapToDouble(p -> p.getCurrentStock() * p.getUnitPrice()).sum();
        double pendingPOValue = pos.stream().filter(p -> !"RECEIVED".equalsIgnoreCase(p.getStatus())).mapToDouble(PurchaseOrder::getTotalAmount).sum();
        double recentSalesTotal = sales.stream().mapToDouble(SalesLog::getRevenue).sum();

        int totalForecasted30DayDemand = products.stream().mapToInt(p -> {
            int leadTime = p.getLeadTimeDays() != null ? p.getLeadTimeDays() : 7;
            double dailyAvg = (p.getReorderPoint() / (double) leadTime) * p.getGrowthFactor();
            return (int) Math.round(dailyAvg * 30 * 1.25);
        }).sum();

        Map<String, Object> response = new HashMap<>();
        response.put("totalSKUs", totalSKUs);
        response.put("criticalCount", criticalCount);
        response.put("totalStockValue", totalStockValue);
        response.put("pendingPOValue", pendingPOValue);
        response.put("totalForecasted30DayDemand", totalForecasted30DayDemand);
        response.put("activeAlertsCount", alertRepository.findByStatus("ACTIVE").size());
        response.put("recentSalesTotal", recentSalesTotal);

        return response;
    }
}
