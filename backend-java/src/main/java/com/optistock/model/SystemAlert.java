package com.optistock.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "system_alerts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SystemAlert {

    @Id
    private String id;
    private String skuId;
    private String severity; // CRITICAL, HIGH, MEDIUM
    private String type;
    private String title;
    private String description;
    private String recommendedAction;
    private String createdAt;
    private String status; // ACTIVE, RESOLVED
}
