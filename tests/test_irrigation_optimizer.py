"""Tests for plentica.irrigation_optimizer."""

import pytest
from plentica.models import FarmProfile, Season, SoilType, WaterSource, WeatherProfile
from plentica.crop_data import CROP_BY_NAME
from plentica.models import CropAllocation
from plentica.irrigation_optimizer import schedule_irrigation, build_irrigation_schedules


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


class TestScheduleIrrigation:
    def _wheat_alloc(self, area=2.0):
        return CropAllocation.from_crop_and_area(CROP_BY_NAME["Wheat"], area)

    def test_returns_irrigation_schedule(self):
        from plentica.models import IrrigationSchedule
        sched = schedule_irrigation(self._wheat_alloc(), _farm(), _weather())
        assert isinstance(sched, IrrigationSchedule)

    def test_crop_name_matches(self):
        sched = schedule_irrigation(self._wheat_alloc(), _farm(), _weather())
        assert sched.crop_name == "Wheat"

    def test_area_matches(self):
        sched = schedule_irrigation(self._wheat_alloc(area=3.0), _farm(), _weather())
        assert sched.area_hectares == 3.0

    def test_rain_fed_has_zero_or_low_irrigation(self):
        # High-rainfall scenario: crop water req fully met by rain
        wheat = CROP_BY_NAME["Wheat"]  # water_requirement_mm = 400
        alloc = CropAllocation.from_crop_and_area(wheat, 2.0)
        sched = schedule_irrigation(
            alloc,
            _farm(water_source=WaterSource.RAIN),
            _weather(rainfall_mm=600),  # 600 mm > 400 mm requirement
        )
        # irrigation should be zero or minimal
        assert sched.irrigation_water_mm == pytest.approx(0.0, abs=1.0)

    def test_irrigation_events_positive_when_water_needed(self):
        wheat = CROP_BY_NAME["Wheat"]  # 400 mm req; rainfall = 100 mm
        alloc = CropAllocation.from_crop_and_area(wheat, 1.0)
        sched = schedule_irrigation(
            alloc,
            _farm(water_source=WaterSource.IRRIGATION),
            _weather(rainfall_mm=0),
        )
        assert sched.irrigation_events >= 1

    def test_efficiency_gain_non_negative(self):
        alloc = self._wheat_alloc()
        sched = schedule_irrigation(alloc, _farm(), _weather())
        assert sched.efficiency_gain_pct >= 0.0


class TestBuildIrrigationSchedules:
    def test_returns_one_schedule_per_allocation(self):
        allocs = [
            CropAllocation.from_crop_and_area(CROP_BY_NAME["Wheat"], 2.0),
            CropAllocation.from_crop_and_area(CROP_BY_NAME["Mustard"], 1.0),
        ]
        scheds = build_irrigation_schedules(allocs, _farm(), _weather())
        assert len(scheds) == 2

    def test_empty_allocations(self):
        scheds = build_irrigation_schedules([], _farm(), _weather())
        assert scheds == []
