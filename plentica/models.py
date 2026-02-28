"""
Plentica – Smart Farm Resource Optimization
Data models for farm profiles, crops, weather, and optimization results.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import List, Optional


class SoilType(str, Enum):
    CLAY = "clay"
    LOAM = "loam"
    SANDY = "sandy"
    SILTY = "silty"
    CLAY_LOAM = "clay_loam"


class Season(str, Enum):
    KHARIF = "kharif"      # June–November (monsoon)
    RABI = "rabi"          # November–April (winter)
    ZAID = "zaid"          # April–June (summer)
    YEAR_ROUND = "year_round"


class WaterSource(str, Enum):
    RAIN = "rain"
    IRRIGATION = "irrigation"
    MIXED = "mixed"


@dataclass
class FarmProfile:
    """Describes a farmer's land, resources, and constraints."""

    area_hectares: float
    soil_type: SoilType
    water_source: WaterSource
    water_availability_mm: float    # total water available per season (mm over area)
    budget: float                   # total budget in currency units
    labor_days: int                 # total available labor-days for the season
    season: Season

    def __post_init__(self) -> None:
        if self.area_hectares <= 0:
            raise ValueError("area_hectares must be positive")
        if self.water_availability_mm < 0:
            raise ValueError("water_availability_mm cannot be negative")
        if self.budget < 0:
            raise ValueError("budget cannot be negative")
        if self.labor_days < 0:
            raise ValueError("labor_days cannot be negative")


@dataclass
class WeatherProfile:
    """Current-season environmental conditions."""

    rainfall_mm: float          # expected seasonal rainfall
    temperature_avg_c: float    # average temperature (°C)
    humidity_pct: float         # average relative humidity (0–100)
    frost_risk: bool = False

    def __post_init__(self) -> None:
        if not (0 <= self.humidity_pct <= 100):
            raise ValueError("humidity_pct must be between 0 and 100")


@dataclass
class Crop:
    """Represents a crop with its agronomic and economic properties."""

    name: str
    water_requirement_mm: float     # mm of water required per season per hectare
    growing_days: int               # days from sowing to harvest
    yield_per_hectare: float        # tons per hectare under normal conditions
    market_price_per_ton: float     # market price per ton (currency units)
    fertilizer_cost_per_hectare: float   # cost of fertilizer per hectare
    labor_days_per_hectare: float   # labor-days needed per hectare
    suitable_soils: List[SoilType]
    suitable_seasons: List[Season]
    min_temperature_c: float = 5.0
    max_temperature_c: float = 45.0
    seed_cost_per_hectare: float = 0.0

    @property
    def gross_revenue_per_hectare(self) -> float:
        return self.yield_per_hectare * self.market_price_per_ton

    @property
    def variable_cost_per_hectare(self) -> float:
        return self.fertilizer_cost_per_hectare + self.seed_cost_per_hectare

    @property
    def net_profit_per_hectare(self) -> float:
        return self.gross_revenue_per_hectare - self.variable_cost_per_hectare


@dataclass
class CropAllocation:
    """A recommended allocation of land to a specific crop."""

    crop: Crop
    area_hectares: float
    water_required_mm: float        # total water for this allocation
    estimated_yield_tons: float
    estimated_revenue: float
    estimated_cost: float
    estimated_profit: float
    reasoning: str = ""

    @classmethod
    def from_crop_and_area(cls, crop: Crop, area: float, reasoning: str = "") -> "CropAllocation":
        water = crop.water_requirement_mm * area
        yield_t = crop.yield_per_hectare * area
        revenue = crop.gross_revenue_per_hectare * area
        cost = crop.variable_cost_per_hectare * area
        profit = crop.net_profit_per_hectare * area
        return cls(
            crop=crop,
            area_hectares=area,
            water_required_mm=water,
            estimated_yield_tons=yield_t,
            estimated_revenue=revenue,
            estimated_cost=cost,
            estimated_profit=profit,
            reasoning=reasoning,
        )


@dataclass
class IrrigationSchedule:
    """Water management plan for an allocated crop."""

    crop_name: str
    area_hectares: float
    total_water_mm: float           # total water needed
    irrigation_water_mm: float      # water to be supplied via irrigation
    rain_contribution_mm: float     # rainfall contribution
    irrigation_events: int          # number of irrigation sessions
    water_per_event_mm: float       # water per irrigation event
    efficiency_gain_pct: float      # estimated water saving vs. unmanaged (%)
    notes: str = ""


@dataclass
class ResourcePlan:
    """Comprehensive farm resource allocation and optimization plan."""

    farm: FarmProfile
    weather: WeatherProfile
    allocations: List[CropAllocation] = field(default_factory=list)
    irrigation_schedules: List[IrrigationSchedule] = field(default_factory=list)
    total_area_allocated: float = 0.0
    total_water_used_mm: float = 0.0
    total_budget_used: float = 0.0
    total_labor_days_used: float = 0.0
    total_estimated_revenue: float = 0.0
    total_estimated_cost: float = 0.0
    total_estimated_profit: float = 0.0
    unallocated_area: float = 0.0
    warnings: List[str] = field(default_factory=list)
    recommendations: List[str] = field(default_factory=list)

    def summary(self) -> str:
        lines = [
            "=" * 60,
            "        PLENTICA – FARM RESOURCE OPTIMIZATION PLAN",
            "=" * 60,
            f"  Farm area       : {self.farm.area_hectares:.2f} ha",
            f"  Season          : {self.farm.season.value}",
            f"  Soil type       : {self.farm.soil_type.value}",
            f"  Water source    : {self.farm.water_source.value}",
            f"  Available water : {self.farm.water_availability_mm:.0f} mm/ha"
            f"  ({self.farm.water_availability_mm * self.farm.area_hectares:.0f} mm total)",
            f"  Budget          : {self.farm.budget:,.0f}",
            f"  Labor available : {self.farm.labor_days} days",
            "",
            "── CROP ALLOCATIONS ──────────────────────────────────",
        ]

        for alloc in self.allocations:
            lines.append(
                f"  {alloc.crop.name:<20} {alloc.area_hectares:.2f} ha"
                f"  |  Yield: {alloc.estimated_yield_tons:.1f} t"
                f"  |  Profit: {alloc.estimated_profit:,.0f}"
            )
            if alloc.reasoning:
                lines.append(f"    ↳ {alloc.reasoning}")

        lines += [
            "",
            "── IRRIGATION SCHEDULE ───────────────────────────────",
        ]
        for sched in self.irrigation_schedules:
            lines.append(
                f"  {sched.crop_name:<20} Irrigate {sched.irrigation_events}× "
                f"({sched.water_per_event_mm:.0f} mm/event)"
                f"  |  Save ~{sched.efficiency_gain_pct:.0f}%"
            )
            if sched.notes:
                lines.append(f"    ↳ {sched.notes}")

        lines += [
            "",
            "── SUMMARY ───────────────────────────────────────────",
            f"  Area allocated  : {self.total_area_allocated:.2f} / {self.farm.area_hectares:.2f} ha",
            f"  Water used      : {self.total_water_used_mm:.0f} mm irrigation"
            f" / {self.farm.water_availability_mm * self.farm.area_hectares:.0f} mm available",
            f"  Budget used     : {self.total_budget_used:,.0f} / {self.farm.budget:,.0f}",
            f"  Labor used      : {self.total_labor_days_used:.0f} / {self.farm.labor_days} days",
            f"  Est. revenue    : {self.total_estimated_revenue:,.0f}",
            f"  Est. cost       : {self.total_estimated_cost:,.0f}",
            f"  Est. profit     : {self.total_estimated_profit:,.0f}",
        ]

        if self.warnings:
            lines += ["", "── WARNINGS ──────────────────────────────────────────"]
            for w in self.warnings:
                lines.append(f"  ⚠  {w}")

        if self.recommendations:
            lines += ["", "── RECOMMENDATIONS ───────────────────────────────────"]
            for r in self.recommendations:
                lines.append(f"  ✔  {r}")

        lines.append("=" * 60)
        return "\n".join(lines)
