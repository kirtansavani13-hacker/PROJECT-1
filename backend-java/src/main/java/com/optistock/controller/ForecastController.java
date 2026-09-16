package com.optistock.controller;

import com.optistock.model.Product;
import com.optistock.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/forecast")
@CrossOrigin(origins = "*")
public class ForecastController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public Map<String, Object> getForecast(
            @RequestParam(defaultValue = "30") Integer horizon,
            @RequestParam(defaultValue = "1.25") Double seasonality
    ) {
        List<Product> products = productRepository.findAll();
        List<Map<String, Object>> forecastList = new ArrayList<>();

        for (Product p : products) {
            int leadTime = (p.getLeadTimeDays() != null && p.getLeadTimeDays() > 0) ? p.getLeadTimeDays() : 7;
            int baseDailyDemand = (int) Math.round((p.getReorderPoint() / (double) leadTime) * 0.85);
            int forecastedDemand = (int) Math.round(baseDailyDemand * horizon * p.getGrowthFactor() * seasonality);
            int confidenceScore = 88 + new Random().nextInt(10);
            int daysUntilStockout = Math.max(1, (int) Math.round(p.getCurrentStock() / (double) Math.max(1, baseDailyDemand * p.getGrowthFactor())));
            int recommendedReorderQty = Math.max(0, forecastedDemand + p.getSafetyStock() - p.getCurrentStock());

            Map<String, Object> item = new HashMap<>();
            item.put("skuId", p.getId());
            item.put("skuTitle", p.getTitle());
            item.put("category", p.getCategory());
            item.put("currentStock", p.getCurrentStock());
            item.put("safetyStock", p.getSafetyStock());
            item.put("baseDailyDemand", baseDailyDemand);
            item.put("forecastedDemand", forecastedDemand);
            item.put("confidenceScore", confidenceScore);
            item.put("daysUntilStockout", daysUntilStockout);
            item.put("recommendedReorderQty", recommendedReorderQty);
            item.put("growthTrend", "+" + Math.round((p.getGrowthFactor() - 1.0) * 100) + "%");
            item.put("status", daysUntilStockout <= leadTime ? "IMMINENT_STOCKOUT" : (daysUntilStockout <= 15 ? "LOW_BUFFER" : "HEALTHY"));

            forecastList.add(item);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("horizonDays", horizon);
        response.put("seasonalityMultiplier", seasonality);
        response.put("forecasts", forecastList);

        return response;
    }
}
