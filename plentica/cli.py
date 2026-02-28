"""
Plentica CLI – interactive command-line tool for farm resource optimization.

Usage:
    python -m plentica.cli
    # or after installation:
    plentica
"""

from __future__ import annotations

import sys


def _prompt(label: str, default: str = "") -> str:
    suffix = f" [{default}]" if default else ""
    value = input(f"  {label}{suffix}: ").strip()
    return value if value else default


def _prompt_float(label: str, default: float) -> float:
    while True:
        raw = _prompt(label, str(default))
        try:
            return float(raw)
        except ValueError:
            print(f"    Please enter a number (e.g. {default}).")


def _prompt_int(label: str, default: int) -> int:
    while True:
        raw = _prompt(label, str(default))
        try:
            return int(raw)
        except ValueError:
            print(f"    Please enter an integer (e.g. {default}).")


def _choose(label: str, options: list[str], default: str) -> str:
    opts_str = " | ".join(options)
    while True:
        raw = _prompt(f"{label} ({opts_str})", default)
        if raw in options:
            return raw
        print(f"    Invalid choice. Please enter one of: {opts_str}")


def run() -> None:
    """Entry point for the Plentica CLI."""
    # Late import so the module is importable without running the CLI
    from plentica.models import FarmProfile, Season, SoilType, WaterSource, WeatherProfile
    from plentica.optimizer import optimize

    print()
    print("=" * 60)
    print("         PLENTICA – Smart Farm Resource Optimizer")
    print("=" * 60)
    print()
    print("Enter your farm details below (press Enter to accept defaults).")
    print()

    # ── Farm profile ──────────────────────────────────────────────────────────
    print("── Farm Profile ─────────────────────────────────────────")
    area = _prompt_float("Farm area (hectares)", 5.0)

    soil_raw = _choose(
        "Soil type",
        [s.value for s in SoilType],
        SoilType.LOAM.value,
    )
    soil = SoilType(soil_raw)

    season_raw = _choose(
        "Season",
        [s.value for s in Season if s != Season.YEAR_ROUND],
        Season.KHARIF.value,
    )
    season = Season(season_raw)

    water_src_raw = _choose(
        "Water source",
        [w.value for w in WaterSource],
        WaterSource.MIXED.value,
    )
    water_source = WaterSource(water_src_raw)

    water_avail = _prompt_float("Available water per hectare (mm/season)", 500.0)
    budget = _prompt_float("Total budget (currency units)", 50000.0)
    labor = _prompt_int("Available labor (days for the season)", 100)

    # ── Weather profile ───────────────────────────────────────────────────────
    print()
    print("── Weather / Environment ────────────────────────────────")
    rainfall = _prompt_float("Expected seasonal rainfall (mm)", 400.0)
    temp = _prompt_float("Average temperature (°C)", 28.0)
    humidity = _prompt_float("Average humidity (%)", 60.0)
    frost_raw = _choose("Frost risk?", ["yes", "no"], "no")
    frost = frost_raw == "yes"

    # ── Run optimizer ─────────────────────────────────────────────────────────
    print()
    print("Running optimization …")
    print()

    try:
        farm = FarmProfile(
            area_hectares=area,
            soil_type=soil,
            water_source=water_source,
            water_availability_mm=water_avail,
            budget=budget,
            labor_days=labor,
            season=season,
        )
        weather = WeatherProfile(
            rainfall_mm=rainfall,
            temperature_avg_c=temp,
            humidity_pct=humidity,
            frost_risk=frost,
        )
        plan = optimize(farm, weather)
        print(plan.summary())
    except ValueError as exc:
        print(f"Error: {exc}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    run()
