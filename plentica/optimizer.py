"""
Plentica Optimizer – main facade that ties crop recommendation,
resource allocation, and irrigation scheduling together.
"""

from __future__ import annotations

from typing import List, Optional

from plentica.crop_data import CROPS
from plentica.crop_recommender import recommend_crops
from plentica.irrigation_optimizer import build_irrigation_schedules
from plentica.models import Crop, FarmProfile, ResourcePlan, WeatherProfile
from plentica.resource_allocator import allocate_resources


def optimize(
    farm: FarmProfile,
    weather: WeatherProfile,
    crop_pool: Optional[List[Crop]] = None,
    top_n_crops: int = 5,
    min_allocation_ha: float = 0.1,
) -> ResourcePlan:
    """
    Run the full Plentica optimization pipeline and return a ResourcePlan.

    Parameters
    ----------
    farm : FarmProfile
        Farmer's land, resources, and season.
    weather : WeatherProfile
        Environmental conditions for the season.
    crop_pool : list of Crop, optional
        Crops to consider.  Defaults to the built-in crop database.
    top_n_crops : int
        Number of top crops to consider for allocation (default 5).
    min_allocation_ha : float
        Minimum plot size in hectares (default 0.1).

    Returns
    -------
    ResourcePlan with full allocation, irrigation schedule, and advisory.
    """
    if crop_pool is None:
        crop_pool = CROPS

    plan = ResourcePlan(farm=farm, weather=weather)

    # ── Step 1: Recommend suitable crops ────────────────────────────────────
    ranked = recommend_crops(farm, weather, crop_pool, top_n=top_n_crops)

    if not ranked:
        plan.warnings.append(
            "No suitable crops found for the given farm and weather conditions. "
            "Consider adjusting season, soil amendment, or water availability."
        )
        plan.unallocated_area = farm.area_hectares
        return plan

    # ── Step 2: Allocate resources ───────────────────────────────────────────
    allocations = allocate_resources(
        farm, weather, ranked, min_allocation_ha=min_allocation_ha
    )
    plan.allocations = allocations

    # ── Step 3: Build irrigation schedules ──────────────────────────────────
    plan.irrigation_schedules = build_irrigation_schedules(allocations, farm, weather)

    # ── Step 4: Compute aggregate totals ────────────────────────────────────
    plan.total_area_allocated = sum(a.area_hectares for a in allocations)
    # Use irrigation water (after rain contribution) for the water budget comparison
    plan.total_water_used_mm = sum(
        s.irrigation_water_mm for s in plan.irrigation_schedules
    )
    plan.total_budget_used = sum(a.estimated_cost for a in allocations)
    plan.total_labor_days_used = sum(
        a.crop.labor_days_per_hectare * a.area_hectares for a in allocations
    )
    plan.total_estimated_revenue = sum(a.estimated_revenue for a in allocations)
    plan.total_estimated_cost = sum(a.estimated_cost for a in allocations)
    plan.total_estimated_profit = sum(a.estimated_profit for a in allocations)
    plan.unallocated_area = max(0.0, farm.area_hectares - plan.total_area_allocated)

    # ── Step 5: Generate warnings and recommendations ────────────────────────
    _add_warnings_and_recommendations(plan, farm, weather)

    return plan


def _add_warnings_and_recommendations(
    plan: ResourcePlan,
    farm: FarmProfile,
    weather: WeatherProfile,
) -> None:
    """Append advisory messages to the plan."""

    water_usage_pct = (
        plan.total_water_used_mm / (farm.water_availability_mm * farm.area_hectares) * 100
        if farm.water_availability_mm * farm.area_hectares > 0
        else 0
    )
    budget_usage_pct = (
        plan.total_budget_used / farm.budget * 100 if farm.budget > 0 else 0
    )
    labor_usage_pct = (
        plan.total_labor_days_used / farm.labor_days * 100 if farm.labor_days > 0 else 0
    )

    if water_usage_pct > 90:
        plan.warnings.append(
            f"Water usage is at {water_usage_pct:.0f}% of available supply. "
            "Consider drought-tolerant crops or drip irrigation."
        )
    if budget_usage_pct > 90:
        plan.warnings.append(
            f"Budget usage is at {budget_usage_pct:.0f}%. "
            "Monitor input costs carefully."
        )
    if labor_usage_pct > 90:
        plan.warnings.append(
            f"Labor demand is at {labor_usage_pct:.0f}% of available days. "
            "Consider mechanization for labor-intensive tasks."
        )
    if plan.unallocated_area > 0.05:
        plan.warnings.append(
            f"{plan.unallocated_area:.2f} ha could not be allocated due to resource "
            "constraints (water, budget, or labor). "
            "Increase resources or choose lower-input crops."
        )

    if weather.frost_risk:
        plan.recommendations.append(
            "Frost risk detected — use frost-hardy varieties and consider row covers."
        )

    avg_irrigation_saving = (
        sum(s.efficiency_gain_pct for s in plan.irrigation_schedules)
        / len(plan.irrigation_schedules)
        if plan.irrigation_schedules
        else 0
    )
    if avg_irrigation_saving > 0:
        plan.recommendations.append(
            f"Scheduled irrigation saves ~{avg_irrigation_saving:.0f}% water "
            "compared to unmanaged irrigation."
        )

    if len(plan.allocations) > 1:
        plan.recommendations.append(
            "Crop diversification reduces income risk from price volatility or "
            "pest/disease outbreaks."
        )

    roi = (
        plan.total_estimated_profit / plan.total_estimated_cost * 100
        if plan.total_estimated_cost > 0
        else 0
    )
    if roi > 0:
        plan.recommendations.append(
            f"Estimated return on investment: {roi:.0f}% for this season."
        )
