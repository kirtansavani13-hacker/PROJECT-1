package com.optistock.repository;

import com.optistock.model.SalesLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SalesLogRepository extends JpaRepository<SalesLog, String> {
}
