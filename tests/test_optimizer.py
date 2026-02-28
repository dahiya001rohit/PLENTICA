"""Integration tests for plentica.optimizer (end-to-end pipeline)."""

import pytest
from plentica.models import FarmProfile, Season, SoilType, WaterSource, WeatherProfile, ResourcePlan
from plentica.optimizer import optimize


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


class TestOptimize:
    def test_returns_resource_plan(self):
        plan = optimize(_farm(), _weather())
        assert isinstance(plan, ResourcePlan)

    def test_plan_has_allocations(self):
        plan = optimize(_farm(), _weather())
        assert len(plan.allocations) > 0

    def test_plan_has_irrigation_schedules(self):
        plan = optimize(_farm(), _weather())
        assert len(plan.irrigation_schedules) == len(plan.allocations)

    def test_total_area_not_exceeded(self):
        farm = _farm(area_hectares=4.0)
        plan = optimize(farm, _weather())
        assert plan.total_area_allocated <= farm.area_hectares + 1e-6

    def test_summary_is_string(self):
        plan = optimize(_farm(), _weather())
        summary = plan.summary()
        assert isinstance(summary, str)
        assert "PLENTICA" in summary

    def test_rabi_season(self):
        farm = _farm(season=Season.RABI, soil_type=SoilType.LOAM)
        weather = _weather(temperature_avg_c=15, rainfall_mm=150)
        plan = optimize(farm, weather)
        names = [a.crop.name for a in plan.allocations]
        # At least one Rabi-compatible crop should be recommended
        assert len(names) > 0
        # All allocated crops must be valid for Rabi or year-round
        from plentica.models import Season as S
        for alloc in plan.allocations:
            compatible = (
                S.RABI in alloc.crop.suitable_seasons
                or S.YEAR_ROUND in alloc.crop.suitable_seasons
            )
            assert compatible, f"{alloc.crop.name} is not a Rabi/year-round crop"

    def test_no_suitable_crops_returns_plan_with_warning(self):
        # Extreme temperature that no crop can tolerate
        farm = _farm()
        weather = _weather(temperature_avg_c=55)  # too hot for all crops
        plan = optimize(farm, weather)
        assert len(plan.allocations) == 0
        assert len(plan.warnings) > 0

    def test_profit_is_positive(self):
        plan = optimize(_farm(), _weather())
        assert plan.total_estimated_profit > 0

    def test_custom_crop_pool(self):
        from plentica.crop_data import CROP_BY_NAME
        pool = [CROP_BY_NAME["Maize"]]
        farm = _farm(season=Season.KHARIF, soil_type=SoilType.LOAM)
        plan = optimize(farm, _weather(), crop_pool=pool)
        assert len(plan.allocations) == 1
        assert plan.allocations[0].crop.name == "Maize"

    def test_very_limited_budget_restricts_allocation(self):
        farm = _farm(budget=100)  # very small budget
        plan = optimize(farm, _weather())
        # Almost nothing should be allocated
        assert plan.total_area_allocated < farm.area_hectares

    def test_frost_risk_flag_adds_recommendation(self):
        farm = _farm(season=Season.RABI)
        weather = _weather(temperature_avg_c=12, rainfall_mm=100, frost_risk=True)
        plan = optimize(farm, weather)
        assert any("frost" in r.lower() for r in plan.recommendations)
