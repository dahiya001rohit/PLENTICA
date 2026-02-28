"""Tests for plentica.crop_recommender."""

import pytest
from plentica.models import FarmProfile, Season, SoilType, WaterSource, WeatherProfile
from plentica.crop_data import CROPS
from plentica.crop_recommender import recommend_crops, score_crop


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
    defaults = dict(rainfall_mm=400, temperature_avg_c=28, humidity_pct=60)
    defaults.update(kwargs)
    return WeatherProfile(**defaults)


class TestRecommendCrops:
    def test_returns_list(self):
        results = recommend_crops(_farm(), _weather(), CROPS)
        assert isinstance(results, list)

    def test_returns_at_most_top_n(self):
        results = recommend_crops(_farm(), _weather(), CROPS, top_n=3)
        assert len(results) <= 3

    def test_sorted_by_score_descending(self):
        results = recommend_crops(_farm(), _weather(), CROPS, top_n=5)
        scores = [r[1] for r in results]
        assert scores == sorted(scores, reverse=True)

    def test_soil_filtering(self):
        # Clay soil — Rice should appear
        results = recommend_crops(
            _farm(soil_type=SoilType.CLAY, season=Season.KHARIF),
            _weather(),
            CROPS,
        )
        names = [r[0].name for r in results]
        assert "Rice" in names

    def test_season_filtering_rabi(self):
        results = recommend_crops(
            _farm(season=Season.RABI),
            _weather(rainfall_mm=150, temperature_avg_c=15),
            CROPS,
        )
        names = [r[0].name for r in results]
        # Wheat is a classic Rabi crop
        assert "Wheat" in names
        # Rice is Kharif — must not appear in Rabi recommendations
        assert "Rice" not in names

    def test_temperature_filtering(self):
        # Very low temperature — frost-hardy crops only
        results = recommend_crops(
            _farm(season=Season.RABI),
            _weather(temperature_avg_c=6, rainfall_mm=100),
            CROPS,
        )
        for crop, _, _ in results:
            assert crop.min_temperature_c <= 6 <= crop.max_temperature_c

    def test_empty_pool_returns_empty(self):
        assert recommend_crops(_farm(), _weather(), []) == []

    def test_reason_is_string(self):
        results = recommend_crops(_farm(), _weather(), CROPS, top_n=3)
        for _, _, reason in results:
            assert isinstance(reason, str)


class TestScoreCrop:
    def test_score_positive(self):
        from plentica.crop_data import CROP_BY_NAME
        wheat = CROP_BY_NAME["Wheat"]
        farm = _farm(season=Season.RABI)
        weather = _weather(temperature_avg_c=15, rainfall_mm=200)
        assert score_crop(wheat, farm, weather) > 0

    def test_frost_risk_reduces_score(self):
        from plentica.crop_data import CROP_BY_NAME
        maize = CROP_BY_NAME["Maize"]
        farm = _farm()
        weather_no_frost = _weather()
        weather_frost = _weather(frost_risk=True)
        score_no_frost = score_crop(maize, farm, weather_no_frost)
        score_with_frost = score_crop(maize, farm, weather_frost)
        # Frost penalty should reduce the score
        assert score_with_frost < score_no_frost
