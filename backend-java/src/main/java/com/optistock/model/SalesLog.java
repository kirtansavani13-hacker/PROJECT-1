package com.optistock.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "sales_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalesLog {

    @Id
    private String id;
    private String skuId;
    private String skuTitle;
    private String channel;
    private Integer unitsSold;
    private Double revenue;
    private String date;
}
