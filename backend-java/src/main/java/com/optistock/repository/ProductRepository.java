package com.optistock.repository;

import com.optistock.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
    List<Product> findByStatus(String status);
    List<Product> findByCategory(String category);
}
