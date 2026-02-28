"""
Irrigation Optimizer – calculates water requirements and schedules
irrigation events to minimise wastage.
"""

from __future__ import annotations

from typing import List

from plentica.models import (
    CropAllocation,
    FarmProfile,
    IrrigationSchedule,
    WaterSource,
    WeatherProfile,
)

# Scheduled irrigation reduces water need by ~15% vs. unmanaged flood irrigation.
# This factor represents the efficiency multiplier when scheduled irrigation
# is used instead of unmanaged flood irrigation.
_SCHEDULED_EFFICIENCY_FACTOR = 0.85   # 15% saving over ad-hoc irrigation
_MIN_IRRIGATION_EVENT_MM = 30         # minimum meaningful irrigation per event


def _rain_contribution(
    crop_water_req_mm: float, rainfall_mm: float, water_source: WaterSource
) -> float:
    """Estimate how much rainfall can substitute for irrigation water."""
    if water_source == WaterSource.IRRIGATION:
        # Purely irrigated farm — no credit for rainfall in planning
        return 0.0
    # Rain-fed or mixed: rainfall contributes, capped at crop requirement
    return min(rainfall_mm, crop_water_req_mm)


def schedule_irrigation(
    allocation: CropAllocation,
    farm: FarmProfile,
    weather: WeatherProfile,
) -> IrrigationSchedule:
    """
    Build an irrigation schedule for a single crop allocation.

    The schedule calculates:
      - how much rain contributes vs. how much must be irrigated
      - number of irrigation events spaced evenly over growing season
      - estimated water saving compared to unmanaged flood irrigation
    """
    crop = allocation.crop
    rain_mm = _rain_contribution(
        crop.water_requirement_mm, weather.rainfall_mm, farm.water_source
    )

    net_irrigation_mm = max(0.0, crop.water_requirement_mm - rain_mm)
    # Apply scheduling efficiency — scheduled irrigation wastes less water
    scheduled_irrigation_mm = net_irrigation_mm * _SCHEDULED_EFFICIENCY_FACTOR

    # Divide into irrigation events roughly once every 10–14 days during
    # the growing season.  Use 12-day intervals as the default.
    interval_days = 12
    n_events = max(1, round(crop.growing_days / interval_days))
    # Only irrigate if there is actually irrigation water needed
    if scheduled_irrigation_mm < _MIN_IRRIGATION_EVENT_MM:
        n_events = 0 if farm.water_source == WaterSource.RAIN else 1

    water_per_event = (
        scheduled_irrigation_mm / n_events if n_events > 0 else 0.0
    )

    # Efficiency gain vs. unmanaged (no scheduling, full water_requirement used)
    unmanaged_irrigation = net_irrigation_mm
    if unmanaged_irrigation > 0:
        saved = unmanaged_irrigation - scheduled_irrigation_mm
        efficiency_gain_pct = (saved / unmanaged_irrigation) * 100
    else:
        efficiency_gain_pct = 0.0

    notes_parts = []
    if rain_mm > 0:
        notes_parts.append(f"rainfall covers {rain_mm:.0f} mm")
    if n_events == 0:
        notes_parts.append("rain-fed: no irrigation required")
    notes = "; ".join(notes_parts)

    return IrrigationSchedule(
        crop_name=crop.name,
        area_hectares=allocation.area_hectares,
        total_water_mm=crop.water_requirement_mm * allocation.area_hectares,
        irrigation_water_mm=scheduled_irrigation_mm * allocation.area_hectares,
        rain_contribution_mm=rain_mm * allocation.area_hectares,
        irrigation_events=n_events,
        water_per_event_mm=water_per_event,
        efficiency_gain_pct=efficiency_gain_pct,
        notes=notes,
    )


def build_irrigation_schedules(
    allocations: List[CropAllocation],
    farm: FarmProfile,
    weather: WeatherProfile,
) -> List[IrrigationSchedule]:
    """Build irrigation schedules for all crop allocations."""
    return [schedule_irrigation(a, farm, weather) for a in allocations]
