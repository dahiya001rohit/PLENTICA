"""Tests for plentica.resource_allocator."""

import pytest
from plentica.models import FarmProfile, Season, SoilType, WaterSource, WeatherProfile
from plentica.crop_data import CROPS
from plentica.crop_recommender import recommend_crops
from plentica.resource_allocator import allocate_resources


def _farm(**kwargs):
    defaults = dict(
        area_hectares=5.0,
        soil_type=SoilType.LOAM,
        water_source=WaterSource.MIXED,
        water_availability_mm=600,
        budget=50000,
        labor_days=200,
        season=Season.KHARIF,
    )
    defaults.update(kwargs)
    return FarmProfile(**defaults)


def _weather(**kwargs):
    defaults = dict(rainfall_mm=300, temperature_avg_c=28, humidity_pct=60)
    defaults.update(kwargs)
    return WeatherProfile(**defaults)


def _ranked(farm, weather, top_n=5):
    return recommend_crops(farm, weather, CROPS, top_n=top_n)


class TestAllocateResources:
    def test_returns_list(self):
        farm, weather = _farm(), _weather()
        ranked = _ranked(farm, weather)
        result = allocate_resources(farm, weather, ranked)
        assert isinstance(result, list)

    def test_total_area_does_not_exceed_farm_area(self):
        farm, weather = _farm(area_hectares=4.0), _weather()
        ranked = _ranked(farm, weather)
        allocs = allocate_resources(farm, weather, ranked)
        total = sum(a.area_hectares for a in allocs)
        assert total <= farm.area_hectares + 1e-6

    def test_total_water_does_not_exceed_available(self):
        farm = _farm(water_availability_mm=400, area_hectares=3.0)
        weather = _weather(rainfall_mm=0)
        ranked = _ranked(farm, weather)
        allocs = allocate_resources(farm, weather, ranked)
        # water used (net irrigation) should not exceed total available water
        total_water = sum(
            max(0.0, a.crop.water_requirement_mm - min(weather.rainfall_mm, a.crop.water_requirement_mm))
            * a.area_hectares
            for a in allocs
        )
        available = farm.water_availability_mm * farm.area_hectares
        assert total_water <= available + 1e-6

    def test_total_budget_not_exceeded(self):
        farm, weather = _farm(budget=10000), _weather()
        ranked = _ranked(farm, weather)
        allocs = allocate_resources(farm, weather, ranked)
        total_cost = sum(a.estimated_cost for a in allocs)
        assert total_cost <= farm.budget + 1e-6

    def test_total_labor_not_exceeded(self):
        farm, weather = _farm(labor_days=50), _weather()
        ranked = _ranked(farm, weather)
        allocs = allocate_resources(farm, weather, ranked)
        total_labor = sum(a.crop.labor_days_per_hectare * a.area_hectares for a in allocs)
        assert total_labor <= farm.labor_days + 1e-6

    def test_empty_ranked_returns_empty(self):
        farm, weather = _farm(), _weather()
        assert allocate_resources(farm, weather, []) == []

    def test_allocations_non_negative_area(self):
        farm, weather = _farm(), _weather()
        ranked = _ranked(farm, weather)
        allocs = allocate_resources(farm, weather, ranked)
        for alloc in allocs:
            assert alloc.area_hectares >= 0

    def test_min_allocation_respected(self):
        farm, weather = _farm(), _weather()
        ranked = _ranked(farm, weather)
        min_ha = 0.5
        allocs = allocate_resources(farm, weather, ranked, min_allocation_ha=min_ha)
        for alloc in allocs:
            assert alloc.area_hectares >= min_ha - 1e-6
