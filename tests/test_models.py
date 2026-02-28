"""Tests for plentica.models – data model validation."""

import pytest
from plentica.models import (
    CropAllocation,
    FarmProfile,
    Season,
    SoilType,
    WaterSource,
    WeatherProfile,
)
from plentica.crop_data import CROPS, CROP_BY_NAME


class TestFarmProfile:
    def _valid(self, **overrides):
        defaults = dict(
            area_hectares=5.0,
            soil_type=SoilType.LOAM,
            water_source=WaterSource.MIXED,
            water_availability_mm=500,
            budget=50000,
            labor_days=100,
            season=Season.KHARIF,
        )
        defaults.update(overrides)
        return FarmProfile(**defaults)

    def test_valid_creation(self):
        farm = self._valid()
        assert farm.area_hectares == 5.0
        assert farm.soil_type == SoilType.LOAM

    def test_negative_area_raises(self):
        with pytest.raises(ValueError, match="area_hectares"):
            self._valid(area_hectares=-1.0)

    def test_zero_area_raises(self):
        with pytest.raises(ValueError, match="area_hectares"):
            self._valid(area_hectares=0.0)

    def test_negative_water_raises(self):
        with pytest.raises(ValueError, match="water_availability_mm"):
            self._valid(water_availability_mm=-10)

    def test_negative_budget_raises(self):
        with pytest.raises(ValueError, match="budget"):
            self._valid(budget=-1)

    def test_negative_labor_raises(self):
        with pytest.raises(ValueError, match="labor_days"):
            self._valid(labor_days=-5)


class TestWeatherProfile:
    def test_valid_creation(self):
        w = WeatherProfile(rainfall_mm=300, temperature_avg_c=28, humidity_pct=60)
        assert w.humidity_pct == 60

    def test_humidity_over_100_raises(self):
        with pytest.raises(ValueError, match="humidity_pct"):
            WeatherProfile(rainfall_mm=300, temperature_avg_c=28, humidity_pct=101)

    def test_humidity_negative_raises(self):
        with pytest.raises(ValueError, match="humidity_pct"):
            WeatherProfile(rainfall_mm=300, temperature_avg_c=28, humidity_pct=-1)


class TestCropProperties:
    def test_gross_revenue(self):
        rice = CROP_BY_NAME["Rice"]
        assert rice.gross_revenue_per_hectare == rice.yield_per_hectare * rice.market_price_per_ton

    def test_variable_cost(self):
        rice = CROP_BY_NAME["Rice"]
        assert rice.variable_cost_per_hectare == (
            rice.fertilizer_cost_per_hectare + rice.seed_cost_per_hectare
        )

    def test_net_profit(self):
        rice = CROP_BY_NAME["Rice"]
        expected = rice.gross_revenue_per_hectare - rice.variable_cost_per_hectare
        assert rice.net_profit_per_hectare == expected


class TestCropAllocation:
    def test_from_crop_and_area(self):
        wheat = CROP_BY_NAME["Wheat"]
        alloc = CropAllocation.from_crop_and_area(wheat, 2.0, reasoning="test")
        assert alloc.area_hectares == 2.0
        assert alloc.estimated_yield_tons == wheat.yield_per_hectare * 2.0
        assert alloc.estimated_profit == wheat.net_profit_per_hectare * 2.0
        assert alloc.reasoning == "test"


class TestCropDatabase:
    def test_all_crops_have_valid_data(self):
        for crop in CROPS:
            assert crop.water_requirement_mm > 0
            assert crop.yield_per_hectare > 0
            assert crop.market_price_per_ton > 0
            assert crop.growing_days > 0
            assert len(crop.suitable_soils) > 0
            assert len(crop.suitable_seasons) > 0

    def test_crop_by_name_lookup(self):
        assert "Wheat" in CROP_BY_NAME
        assert "Rice" in CROP_BY_NAME
        assert CROP_BY_NAME["Maize"].name == "Maize"
