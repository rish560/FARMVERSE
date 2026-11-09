package com.farmverse.repository;

import com.farmverse.entity.Farm;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface FarmRepository extends JpaRepository<Farm, Long> {

    // Loads the owner in the same query instead of one extra query per farm
    // (avoids the classic N+1 problem that was slowing down "View Farms").
    // Ordered newest-first, so a freshly added farm appears at the top.
    @Query("SELECT f FROM Farm f JOIN FETCH f.owner ORDER BY f.farmId DESC")
    List<Farm> findAllWithOwner();
}