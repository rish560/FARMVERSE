package com.farmverse.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "farms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Farm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "farm_id")
    private Long farmId;

    @Column(name = "farm_name", nullable = false, length = 150)
    private String farmName;

    @Column(name = "farmer_name", length = 150)
    private String farmerName;

    @Column(nullable = false, length = 255)
    private String location;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal area;

    @Column(name = "area_unit", length = 50)
    private String areaUnit;

    @Column(name = "water_source", length = 100)
    private String waterSource;

    @Column(name = "current_crop", length = 150)
    private String currentCrop;

    @Column(name = "sowing_date")
    private java.time.LocalDate sowingDate;

    @Column(name = "harvesting_date")
    private java.time.LocalDate harvestingDate;

    @Column(length = 50)
    private String status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @OneToMany(mappedBy = "farm")
    @Builder.Default
    private List<Crop> crops = new ArrayList<>();
}