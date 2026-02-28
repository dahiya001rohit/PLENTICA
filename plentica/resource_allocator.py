"""
Resource Allocator – allocates farm land across recommended crops while
respecting water, budget, and labor constraints.

Uses a greedy profit-maximisation approach:
  1. Rank candidate crops by net profit per hectare.
  2. Allocate as much land as possible to the top crop, subject to all
     constraints.
  3. Repeat for remaining crops until land is exhausted or no more viable
     crops remain.
"""

from __future__ import annotations

from typing import List, Tuple

from plentica.models import Crop, CropAllocation, FarmProfile, WeatherProfile


def _max_area_for_crop(
    crop: Crop,
    farm: FarmProfile,
    weather: WeatherProfile,
    remaining_area: float,
    remaining_water: float,
    remaining_budget: float,
    remaining_labor: float,
) -> float:
    """
    Return the maximum area (ha) that can be allocated to *crop* given
    the remaining resources.

    Water constraint uses net irrigation need (after rain contribution).
    """
    # Water: net irrigation requirement per hectare
    rain_mm = min(weather.rainfall_mm, crop.water_requirement_mm)
    net_water_per_ha = max(0.0, crop.water_requirement_mm - rain_mm)

    # Compute per-hectare limits
    limits = [remaining_area]

    if net_water_per_ha > 0:
        limits.append(remaining_water / net_water_per_ha)

    if crop.variable_cost_per_hectare > 0:
        limits.append(remaining_budget / crop.variable_cost_per_hectare)

    if crop.labor_days_per_hectare > 0:
        limits.append(remaining_labor / crop.labor_days_per_hectare)

    return max(0.0, min(limits))


def allocate_resources(
    farm: FarmProfile,
    weather: WeatherProfile,
    ranked_crops: List[Tuple[Crop, float, str]],
    min_allocation_ha: float = 0.1,
) -> List[CropAllocation]:
    """
    Greedily allocate farm land to crops, respecting all constraints.

    Parameters
    ----------
    farm : FarmProfile
    weather : WeatherProfile
    ranked_crops : list of (crop, score, reason) sorted best-first
    min_allocation_ha : minimum plot size to allocate (avoids tiny slivers)

    Returns
    -------
    List of CropAllocation objects.
    """
    remaining_area = farm.area_hectares
    # Water budget: total available irrigation water (rain handled per crop)
    remaining_water = farm.water_availability_mm * farm.area_hectares
    remaining_budget = farm.budget
    remaining_labor = float(farm.labor_days)

    allocations: List[CropAllocation] = []

    for crop, _score, reason in ranked_crops:
        if remaining_area < min_allocation_ha:
            break

        max_area = _max_area_for_crop(
            crop,
            farm,
            weather,
            remaining_area,
            remaining_water,
            remaining_budget,
            remaining_labor,
        )

        if max_area < min_allocation_ha:
            continue

        # Allocate the maximum feasible area for this crop
        area = min(max_area, remaining_area)
        alloc = CropAllocation.from_crop_and_area(crop, round(area, 4), reasoning=reason)
        allocations.append(alloc)

        # Deduct resources consumed
        rain_mm = min(weather.rainfall_mm, crop.water_requirement_mm)
        net_water_per_ha = max(0.0, crop.water_requirement_mm - rain_mm)
        remaining_area -= area
        remaining_water -= net_water_per_ha * area
        remaining_budget -= crop.variable_cost_per_hectare * area
        remaining_labor -= crop.labor_days_per_hectare * area

    return allocations
