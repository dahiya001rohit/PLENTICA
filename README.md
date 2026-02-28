# PLENTICA
Plentica is a smart farm resource optimization system that helps farmers make data-driven decisions for crop allocation, irrigation, and resource management using environmental and economic parameters.

## Features

- **Crop Recommendation** – filters and ranks crops by soil type, season, temperature range, and water availability; prioritises the highest profit-per-hectare options.
- **Resource Allocation** – greedily allocates land across multiple crops while respecting water, budget, and labour constraints, ensuring no constraint is violated.
- **Irrigation Scheduling** – calculates the net irrigation water needed (after rainfall), divides it into evenly-spaced events, and estimates water savings compared to unmanaged flood irrigation.
- **Explainable Recommendations** – every allocation and advisory note is accompanied by a plain-language reason so farmers understand *why* a decision was made.
- **Built-in Crop Database** – 12 common crops (Rice, Wheat, Maize, Cotton, Soybean, Mustard, Chickpea, Sunflower, Groundnut, Tomato, Vegetables, Sugarcane) with agronomic and economic defaults that can be customised.

## Quick Start

### Install

```bash
pip install -e .
```

### Run the interactive CLI

```bash
plentica
# or
python -m plentica.cli
```

You will be prompted for:
- Farm details (area, soil type, season, water source, water availability, budget, labour days)
- Weather conditions (rainfall, average temperature, humidity, frost risk)

The system then prints a full **Farm Resource Optimization Plan** including crop allocations, an irrigation schedule, and actionable recommendations.

### Use as a library

```python
from plentica import optimize, FarmProfile, WeatherProfile, Season, SoilType, WaterSource

farm = FarmProfile(
    area_hectares=5.0,
    soil_type=SoilType.LOAM,
    water_source=WaterSource.MIXED,
    water_availability_mm=500,
    budget=50_000,
    labor_days=150,
    season=Season.KHARIF,
)
weather = WeatherProfile(
    rainfall_mm=350,
    temperature_avg_c=28,
    humidity_pct=65,
)
plan = optimize(farm, weather)
print(plan.summary())
```

## Project Structure

```
plentica/
├── __init__.py           – public API
├── models.py             – data models (FarmProfile, Crop, ResourcePlan, …)
├── crop_data.py          – built-in crop database
├── crop_recommender.py   – filters & ranks crops for a farm/weather profile
├── irrigation_optimizer.py – builds per-crop irrigation schedules
├── resource_allocator.py – greedy land allocation respecting all constraints
├── optimizer.py          – main pipeline facade
└── cli.py                – interactive command-line interface
tests/
├── test_models.py
├── test_crop_recommender.py
├── test_irrigation_optimizer.py
├── test_resource_allocator.py
└── test_optimizer.py
```

## Running Tests

```bash
pip install pytest
pytest
```

