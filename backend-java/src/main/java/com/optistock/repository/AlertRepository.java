package com.optistock.repository;

import com.optistock.model.SystemAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<SystemAlert, String> {
    List<SystemAlert> findByStatus(String status);
}
