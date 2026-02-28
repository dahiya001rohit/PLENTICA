"""
Crop Recommender – filters and ranks crops suitable for given farm conditions.
"""

from __future__ import annotations

from typing import List, Tuple

from plentica.models import Crop, FarmProfile, Season, SoilType, WaterSource, WeatherProfile


def _is_soil_compatible(crop: Crop, soil: SoilType) -> bool:
    return soil in crop.suitable_soils


def _is_season_compatible(crop: Crop, season: Season) -> bool:
    return season in crop.suitable_seasons or Season.YEAR_ROUND in crop.suitable_seasons


def _is_temperature_compatible(crop: Crop, weather: WeatherProfile) -> bool:
    return crop.min_temperature_c <= weather.temperature_avg_c <= crop.max_temperature_c


def _has_sufficient_water(crop: Crop, farm: FarmProfile, weather: WeatherProfile) -> bool:
    """Check whether water is available at the per-hectare level."""
    net_irrigation_need = max(0.0, crop.water_requirement_mm - weather.rainfall_mm)
    if farm.water_source == WaterSource.RAIN:
        # Rain-fed: only rainfall is available
        return weather.rainfall_mm >= crop.water_requirement_mm
    # Irrigation or mixed: farm has some water budget per hectare
    available_per_ha = farm.water_availability_mm
    return net_irrigation_need <= available_per_ha


def score_crop(crop: Crop, farm: FarmProfile, weather: WeatherProfile) -> float:
    """
    Score a crop for the given farm/weather profile.
    Higher is better.  Uses a weighted combination of:
      - net profit per hectare (normalised)
      - water efficiency (profit per mm of water)
      - frost-risk penalty
    """
    if weather.frost_risk and crop.min_temperature_c > 0:
        # Penalise frost-sensitive crops (those that cannot survive below 0 °C)
        profit = crop.net_profit_per_hectare * 0.5
    else:
        profit = crop.net_profit_per_hectare

    water_efficiency = profit / max(crop.water_requirement_mm, 1)
    # Combine profit and water efficiency with equal weight
    return 0.5 * profit + 0.5 * water_efficiency * 1000


def recommend_crops(
    farm: FarmProfile,
    weather: WeatherProfile,
    crop_pool: List[Crop],
    top_n: int = 5,
) -> List[Tuple[Crop, float, str]]:
    """
    Filter and rank crops for a farm/weather combination.

    Returns a list of (crop, score, reason) tuples, sorted best-first,
    limited to top_n entries.
    """
    results: List[Tuple[Crop, float, str]] = []

    for crop in crop_pool:
        reasons: List[str] = []
        skip = False

        if not _is_soil_compatible(crop, farm.soil_type):
            skip = True
        if not _is_season_compatible(crop, farm.season):
            skip = True
        if not _is_temperature_compatible(crop, weather):
            skip = True
        if not _has_sufficient_water(crop, farm, weather):
            reasons.append("marginal water availability")

        if skip:
            continue

        score = score_crop(crop, farm, weather)

        # Build human-readable reason
        reason_parts = [
            f"suits {farm.soil_type.value} soil",
            f"{farm.season.value} season",
            f"profit {crop.net_profit_per_hectare:,.0f}/ha",
        ]
        if reasons:
            reason_parts.append(f"note: {', '.join(reasons)}")
        reason = "; ".join(reason_parts)

        results.append((crop, score, reason))

    results.sort(key=lambda x: x[1], reverse=True)
    return results[:top_n]
