package com.farmverse.repository;

import com.farmverse.entity.Crop;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CropRepository extends JpaRepository<Crop, Long> {

    // Loads farm + farm's owner in the same query instead of two extra
    // queries per crop row (fixes the N+1 problem slowing down "View Crops").
    // Ordered newest-first, so a freshly added crop appears at the top.
    @Query("SELECT c FROM Crop c JOIN FETCH c.farm f JOIN FETCH f.owner ORDER BY c.cropId DESC")
    List<Crop> findAllWithFarmAndOwner();
}