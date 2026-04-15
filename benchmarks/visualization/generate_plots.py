"""
Lighthouse benchmark charts — React vs Next.js
Usage:
    python charts.py                          # looks for react-benchmark.json / nextjs-benchmark.json
    python charts.py --react path/to/r.json --nextjs path/to/n.json
    python charts.py --out ./charts           # output directory
"""

import argparse
import json
import sys
from pathlib import Path

import matplotlib

matplotlib.use("Agg")

import matplotlib.patches as mpatches
import matplotlib.pyplot as plt
import matplotlib.ticker as ticker
import numpy as np

matplotlib.rcParams["font.family"] = "monospace"

# ─── config ──────────────────────────────────────────────────────────────────

METRICS = [
    ("largest-contentful-paint", "Largest Contentful Paint", "LCP"),
    ("first-contentful-paint", "First Contentful Paint", "FCP"),
    ("speed-index", "Speed Index", "SI"),
    ("total-blocking-time", "Total Blocking Time", "TBT"),
    ("max-potential-fid", "Max Potential FID", "FID"),
    ("cumulative-layout-shift", "Cumulative Layout Shift", "CLS"),
    ("interactive", "Time to Interactive", "TTI"),
    ("server-response-time", "Server Response Time", "TTFB"),
]

# ms thresholds for score bands (green / yellow / red)
THRESHOLDS = {
    "largest-contentful-paint": (2500, 4000),
    "first-contentful-paint": (1800, 3000),
    "speed-index": (3400, 5800),
    "total-blocking-time": (200, 600),
    "max-potential-fid": (100, 300),
    "cumulative-layout-shift": (0.1, 0.25),
    "interactive": (3800, 7300),
    "server-response-time": (600, 1500),
}

# whether the metric is in ms (True) or unitless (False)
IS_MS = {k: k != "cumulative-layout-shift" for k, *_ in METRICS}

REACT_COLOR = "#e05c5c"
NEXTJS_COLOR = "#4c9be8"
BAND_ALPHA = 0.07
BG = "#0f1117"
PANEL = "#181c24"
GRID = "#2a2f3d"
TEXT = "#d0d6e8"
TEXT_DIM = "#6b7280"

# ─── helpers ─────────────────────────────────────────────────────────────────


def load(path: str) -> dict:
    with open(path) as f:
        return json.load(f)


def profiles_from(data: dict) -> list[dict]:
    return data["profiles"]


def extract(
    profiles: list[dict], metric: str
) -> tuple[list[str], list[float], list[float]]:
    labels, means, stddevs = [], [], []
    for p in profiles:
        s = p["stats"].get(metric, {})
        mean = s.get("mean")
        stddev = s.get("stddev") or 0
        if mean is None:
            mean = 0
        labels.append(p["label"])
        means.append(mean)
        stddevs.append(stddev)
    return labels, means, stddevs


def smart_fmt(v: float, is_ms: bool) -> str:
    if not is_ms:
        return f"{v:.3f}"
    if v >= 10_000:
        return f"{v / 1000:.1f}s"
    if v >= 1000:
        return f"{v / 1000:.2f}s"
    return f"{v:.0f}ms"


def fmt_axis(ax, is_ms: bool):
    def _fmt(x, _):
        return smart_fmt(x, is_ms)

    ax.yaxis.set_major_formatter(ticker.FuncFormatter(_fmt))


def add_threshold_bands(ax, metric: str, ymax: float):
    if metric not in THRESHOLDS:
        return
    g, r = THRESHOLDS[metric]
    ax.axhspan(0, g, alpha=BAND_ALPHA, color="#22c55e", zorder=0)
    ax.axhspan(g, r, alpha=BAND_ALPHA, color="#f59e0b", zorder=0)
    ax.axhspan(r, ymax, alpha=BAND_ALPHA, color="#ef4444", zorder=0)
    ax.axhline(g, color="#22c55e", linewidth=0.6, linestyle="--", alpha=0.35, zorder=1)
    ax.axhline(r, color="#ef4444", linewidth=0.6, linestyle="--", alpha=0.35, zorder=1)


# ─── per-metric chart (mean line + stddev band) ───────────────────────────────


def plot_metric(
    ax, labels, r_means, r_stddevs, n_means, n_stddevs, metric: str, title: str
):
    x = np.arange(len(labels))
    is_ms = IS_MS[metric]
    ymax = max(max(r_means), max(n_means)) * 1.35 or 1

    add_threshold_bands(ax, metric, ymax)

    # stddev bands
    ax.fill_between(
        x,
        np.array(r_means) - np.array(r_stddevs),
        np.array(r_means) + np.array(r_stddevs),
        alpha=0.18,
        color=REACT_COLOR,
        zorder=2,
    )
    ax.fill_between(
        x,
        np.array(n_means) - np.array(n_stddevs),
        np.array(n_means) + np.array(n_stddevs),
        alpha=0.18,
        color=NEXTJS_COLOR,
        zorder=2,
    )

    # mean lines
    ax.plot(
        x,
        r_means,
        "o-",
        color=REACT_COLOR,
        linewidth=2,
        markersize=6,
        markerfacecolor=BG,
        markeredgewidth=2,
        zorder=4,
        label="React",
    )
    ax.plot(
        x,
        n_means,
        "s-",
        color=NEXTJS_COLOR,
        linewidth=2,
        markersize=6,
        markerfacecolor=BG,
        markeredgewidth=2,
        zorder=4,
        label="Next.js",
    )

    # stddev tick caps
    for xi, (rm, rs, nm, ns) in enumerate(zip(r_means, r_stddevs, n_means, n_stddevs)):
        for color, mean, std in [(REACT_COLOR, rm, rs), (NEXTJS_COLOR, nm, ns)]:
            if std > 0:
                ax.vlines(
                    xi,
                    mean - std,
                    mean + std,
                    colors=color,
                    linewidth=1.2,
                    alpha=0.6,
                    zorder=3,
                )

    # styling
    ax.set_facecolor(PANEL)
    ax.set_xlim(-0.5, len(labels) - 0.5)
    ax.set_ylim(0, ymax)
    ax.set_xticks(x)
    ax.set_xticklabels(labels, rotation=28, ha="right", fontsize=7.5, color=TEXT_DIM)
    fmt_axis(ax, is_ms)
    ax.tick_params(axis="y", labelsize=8, labelcolor=TEXT_DIM, colors=GRID)
    ax.tick_params(axis="x", colors=GRID)
    ax.set_title(title, fontsize=10, fontweight="bold", color=TEXT, pad=8)
    ax.grid(axis="y", color=GRID, linewidth=0.5, zorder=0)
    ax.spines[:].set_color(GRID)

    # value annotations on last profile (most interesting extreme)
    last = len(labels) - 1
    for color, means in [(REACT_COLOR, r_means), (NEXTJS_COLOR, n_means)]:
        v = means[last]
        ax.annotate(
            smart_fmt(v, is_ms),
            xy=(last, v),
            xytext=(4, 4),
            textcoords="offset points",
            fontsize=7,
            color=color,
            alpha=0.85,
        )


# ─── summary comparison bar chart ─────────────────────────────────────────────


def plot_summary(ax, profiles_r, profiles_n):
    """
    Normalised score: for each metric, how does React compare to Next.js?
    Bar = React mean / Next.js mean  (>1 means React is slower / worse)
    """
    metric_labels = [abbr for _, _, abbr in METRICS]
    profile_labels = [p["label"] for p in profiles_r]
    n_profiles = len(profile_labels)
    n_metrics = len(METRICS)

    ratios = np.zeros((n_profiles, n_metrics))
    for pi, (pr, pn) in enumerate(zip(profiles_r, profiles_n)):
        for mi, (key, *_) in enumerate(METRICS):
            rm = pr["stats"].get(key, {}).get("mean") or 0
            nm = pn["stats"].get(key, {}).get("mean") or 0
            if nm > 0 and rm > 0:
                ratios[pi, mi] = rm / nm
            else:
                ratios[pi, mi] = 1.0

    # heatmap
    im = ax.imshow(
        ratios,
        aspect="auto",
        cmap="RdYlGn_r",
        vmin=0.7,
        vmax=1.5,
        interpolation="nearest",
    )

    ax.set_xticks(range(n_metrics))
    ax.set_xticklabels(metric_labels, fontsize=9, color=TEXT)
    ax.set_yticks(range(n_profiles))
    ax.set_yticklabels(profile_labels, fontsize=8, color=TEXT_DIM)
    ax.set_title(
        "React / Next.js ratio  (green = React faster, red = React slower)",
        fontsize=10,
        fontweight="bold",
        color=TEXT,
        pad=10,
    )
    ax.tick_params(colors=GRID)
    ax.spines[:].set_color(GRID)

    # cell values
    for i in range(n_profiles):
        for j in range(n_metrics):
            v = ratios[i, j]
            color = "white" if v > 1.3 or v < 0.8 else "#111"
            ax.text(
                j,
                i,
                f"{v:.2f}",
                ha="center",
                va="center",
                fontsize=7.5,
                color=color,
                fontweight="bold",
            )

    cbar = plt.colorbar(im, ax=ax, fraction=0.025, pad=0.02)
    cbar.ax.tick_params(labelsize=7, colors=TEXT_DIM)
    cbar.outline.set_edgecolor(GRID)
    cbar.ax.yaxis.set_tick_params(color=GRID)


# ─── stddev-only chart ────────────────────────────────────────────────────────


def plot_stddev_comparison(ax, profiles_r, profiles_n, metric_key: str, title: str):
    """
    Bar chart showing stddev side by side — stability comparison.
    """
    labels = [p["label"] for p in profiles_r]
    r_std = [p["stats"].get(metric_key, {}).get("stddev") or 0 for p in profiles_r]
    n_std = [p["stats"].get(metric_key, {}).get("stddev") or 0 for p in profiles_n]
    is_ms = IS_MS[metric_key]

    x = np.arange(len(labels))
    width = 0.38

    bars_r = ax.bar(
        x - width / 2,
        r_std,
        width,
        color=REACT_COLOR,
        alpha=0.82,
        label="React",
        zorder=3,
    )
    bars_n = ax.bar(
        x + width / 2,
        n_std,
        width,
        color=NEXTJS_COLOR,
        alpha=0.82,
        label="Next.js",
        zorder=3,
    )

    for bars in (bars_r, bars_n):
        for bar in bars:
            h = bar.get_height()
            if h > 0:
                ax.text(
                    bar.get_x() + bar.get_width() / 2,
                    h + h * 0.04,
                    smart_fmt(h, is_ms),
                    ha="center",
                    va="bottom",
                    fontsize=6.5,
                    color=TEXT_DIM,
                    rotation=45,
                )

    ax.set_facecolor(PANEL)
    ax.set_xticks(x)
    ax.set_xticklabels(labels, rotation=28, ha="right", fontsize=7.5, color=TEXT_DIM)
    fmt_axis(ax, is_ms)
    ax.tick_params(axis="y", labelsize=8, labelcolor=TEXT_DIM, colors=GRID)
    ax.tick_params(axis="x", colors=GRID)
    ax.set_title(
        f"σ stability — {title}", fontsize=10, fontweight="bold", color=TEXT, pad=8
    )
    ax.grid(axis="y", color=GRID, linewidth=0.5, zorder=0)
    ax.spines[:].set_color(GRID)


def plot_gaussian(ax, mean, std, color, label, is_ms):
    if std == 0:
        return

    x = np.linspace(mean - 4 * std, mean + 4 * std, 200)
    y = (1 / (std * np.sqrt(2 * np.pi))) * np.exp(-0.5 * ((x - mean) / std) ** 2)

    ax.plot(x, y, color=color, linewidth=2, label=label)
    ax.fill_between(x, y, alpha=0.15, color=color)


def is_valid(mean, std):
    return mean is not None and std is not None and std > 0


def plot_metric_distribution(ax, r_mean, r_std, n_mean, n_std, metric, title):
    is_ms = IS_MS[metric]

    r_ok = is_valid(r_mean, r_std)
    n_ok = is_valid(n_mean, n_std)

    # ❗ jeśli oba brak → skip
    if not r_ok and not n_ok:
        ax.set_facecolor(PANEL)
        ax.text(
            0.5,
            0.5,
            "No data",
            ha="center",
            va="center",
            color=TEXT_DIM,
            transform=ax.transAxes,
        )
        ax.set_title(title, color=TEXT_DIM)
        ax.axis("off")
        return

    # tylko React
    if r_ok:
        plot_gaussian(ax, r_mean, r_std, REACT_COLOR, "React", is_ms)
        ax.axvline(r_mean, color=REACT_COLOR, linestyle="--", alpha=0.7)

    # tylko Next
    if n_ok:
        plot_gaussian(ax, n_mean, n_std, NEXTJS_COLOR, "Next.js", is_ms)
        ax.axvline(n_mean, color=NEXTJS_COLOR, linestyle="--", alpha=0.7)

    ax.set_facecolor(PANEL)
    ax.set_title(title, fontsize=10, fontweight="bold", color=TEXT)
    ax.grid(color=GRID, linewidth=0.5)
    ax.spines[:].set_color(GRID)
    ax.tick_params(colors=TEXT_DIM)


# ─── main ─────────────────────────────────────────────────────────────────────


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--react", default="../benchmark-output/react-benchmark.json")
    parser.add_argument("--nextjs", default="../benchmark-output/nextjs-benchmark.json")
    parser.add_argument("--out", default="./plots")
    args = parser.parse_args()

    try:
        r_data = load(args.react)
        n_data = load(args.nextjs)
    except FileNotFoundError as e:
        sys.exit(f"File not found: {e}")

    profiles_r = profiles_from(r_data)
    profiles_n = profiles_from(n_data)

    # align profiles by label (in case order differs)
    n_by_id = {p["profileId"]: p for p in profiles_n}
    profiles_n_aligned = [n_by_id.get(p["profileId"], p) for p in profiles_r]

    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)

    plt.style.use("dark_background")

    # ── 1. Per-metric mean + stddev band (4×2 grid) ───────────────────────
    fig1, axes = plt.subplots(4, 2, figsize=(18, 22))
    fig1.patch.set_facecolor(BG)
    fig1.suptitle(
        "Lighthouse Metrics — React vs Next.js\nmean ± σ by device profile",
        fontsize=15,
        fontweight="bold",
        color=TEXT,
        y=0.995,
    )

    for ax, (key, title, _) in zip(axes.flat, METRICS):
        labels, r_means, r_stddevs = extract(profiles_r, key)
        _, n_means, n_stddevs = extract(profiles_n_aligned, key)
        plot_metric(ax, labels, r_means, r_stddevs, n_means, n_stddevs, key, title)

    legend_handles = [
        mpatches.Patch(color=REACT_COLOR, label="React"),
        mpatches.Patch(color=NEXTJS_COLOR, label="Next.js"),
    ]
    fig1.legend(
        handles=legend_handles,
        loc="lower center",
        ncol=2,
        framealpha=0.2,
        labelcolor=TEXT,
        fontsize=11,
        bbox_to_anchor=(0.5, -0.005),
    )
    fig1.tight_layout(rect=[0, 0.02, 1, 0.995])
    p1 = out / "01_metrics_mean_stddev.png"
    fig1.savefig(p1, dpi=150, bbox_inches="tight", facecolor=BG)
    print(f"Saved: {p1}")
    plt.close(fig1)

    # ── 2. Stddev-only bars for key metrics (2×2) ─────────────────────────
    key_metrics = [
        ("largest-contentful-paint", "LCP"),
        ("total-blocking-time", "TBT"),
        ("interactive", "TTI"),
        ("max-potential-fid", "Max FID"),
    ]
    fig2, axes2 = plt.subplots(2, 2, figsize=(16, 12))
    fig2.patch.set_facecolor(BG)
    fig2.suptitle(
        "Measurement Stability (σ) — lower is better",
        fontsize=14,
        fontweight="bold",
        color=TEXT,
        y=1.01,
    )

    for ax, (key, short) in zip(axes2.flat, key_metrics):
        plot_stddev_comparison(ax, profiles_r, profiles_n_aligned, key, short)

    fig2.legend(
        handles=legend_handles,
        loc="lower center",
        ncol=2,
        framealpha=0.2,
        labelcolor=TEXT,
        fontsize=11,
        bbox_to_anchor=(0.5, -0.01),
    )
    fig2.tight_layout()
    p2 = out / "02_stddev_stability.png"
    fig2.savefig(p2, dpi=150, bbox_inches="tight", facecolor=BG)
    print(f"Saved: {p2}")
    plt.close(fig2)

    # ── 3. React/Next.js ratio heatmap ────────────────────────────────────
    fig3, ax3 = plt.subplots(figsize=(14, 7))
    fig3.patch.set_facecolor(BG)
    ax3.set_facecolor(PANEL)
    plot_summary(ax3, profiles_r, profiles_n_aligned)
    fig3.tight_layout()
    p3 = out / "03_ratio_heatmap.png"
    fig3.savefig(p3, dpi=150, bbox_inches="tight", facecolor=BG)
    print(f"Saved: {p3}")
    plt.close(fig3)

    # ── 4. LCP deep-dive: mean bar + stddev errorbar ──────────────────────
    key = "largest-contentful-paint"
    labels, r_means, r_std = extract(profiles_r, key)
    _, n_means, n_std = extract(profiles_n_aligned, key)

    fig4, ax4 = plt.subplots(figsize=(14, 6))
    fig4.patch.set_facecolor(BG)
    ax4.set_facecolor(PANEL)

    x = np.arange(len(labels))
    width = 0.38
    ax4.bar(
        x - width / 2,
        r_means,
        width,
        color=REACT_COLOR,
        alpha=0.75,
        yerr=r_std,
        capsize=5,
        error_kw={"ecolor": REACT_COLOR, "linewidth": 1.5},
        label="React",
        zorder=3,
    )
    ax4.bar(
        x + width / 2,
        n_means,
        width,
        color=NEXTJS_COLOR,
        alpha=0.75,
        yerr=n_std,
        capsize=5,
        error_kw={"ecolor": NEXTJS_COLOR, "linewidth": 1.5},
        label="Next.js",
        zorder=3,
    )

    add_threshold_bands(ax4, key, max(max(r_means), max(n_means)) * 1.35)

    ax4.set_xticks(x)
    ax4.set_xticklabels(labels, rotation=22, ha="right", fontsize=9, color=TEXT_DIM)
    fmt_axis(ax4, IS_MS[key])
    ax4.tick_params(axis="y", labelsize=9, labelcolor=TEXT_DIM, colors=GRID)
    ax4.tick_params(axis="x", colors=GRID)
    ax4.set_title(
        "Largest Contentful Paint — mean ± σ with performance bands",
        fontsize=12,
        fontweight="bold",
        color=TEXT,
        pad=10,
    )
    ax4.grid(axis="y", color=GRID, linewidth=0.5, zorder=0)
    ax4.spines[:].set_color(GRID)
    ax4.legend(framealpha=0.2, labelcolor=TEXT, fontsize=10)

    # band labels
    g_thresh, r_thresh = THRESHOLDS[key]
    ax4.text(
        len(labels) - 0.5,
        g_thresh * 0.45,
        "GOOD",
        color="#22c55e",
        fontsize=8,
        alpha=0.7,
        ha="right",
    )
    ax4.text(
        len(labels) - 0.5,
        (g_thresh + r_thresh) / 2,
        "NEEDS IMPROVEMENT",
        color="#f59e0b",
        fontsize=8,
        alpha=0.7,
        ha="right",
    )
    ax4.text(
        len(labels) - 0.5,
        r_thresh * 1.15,
        "POOR",
        color="#ef4444",
        fontsize=8,
        alpha=0.7,
        ha="right",
    )

    fig4.tight_layout()
    p4 = out / "04_lcp_deep_dive.png"
    fig4.savefig(p4, dpi=150, bbox_inches="tight", facecolor=BG)
    print(f"Saved: {p4}")
    plt.close(fig4)

    # ── 5. Gaussian distributions (per metric, single profile) ─────────────
    for profile_idx, profile in enumerate(profiles_r):
        label = profile["label"]

        fig5, axes5 = plt.subplots(4, 2, figsize=(18, 22))
        fig5.patch.set_facecolor(BG)

        fig5.suptitle(
            f"Gaussian Distribution (mean ± σ) — profile: {label}",
            fontsize=15,
            fontweight="bold",
            color=TEXT,
        )

        for ax, (key, title, _) in zip(axes5.flat, METRICS):
            r_stats = profiles_r[profile_idx]["stats"].get(key, {})
            n_stats = profiles_n_aligned[profile_idx]["stats"].get(key, {})

            r_mean = r_stats.get("mean")
            r_std = r_stats.get("stddev")

            n_mean = n_stats.get("mean")
            n_std = n_stats.get("stddev")

            plot_metric_distribution(ax, r_mean, r_std, n_mean, n_std, key, title)

        fig5.legend(
            handles=legend_handles,
            loc="lower center",
            ncol=2,
            framealpha=0.2,
            labelcolor=TEXT,
        )

        fig5.tight_layout()

        # 🧼 sanitize filename
        safe_label = label.lower().replace(" ", "_").replace("/", "_")

        p5 = out / f"05_gaussian_{safe_label}.png"
        fig5.savefig(p5, dpi=150, bbox_inches="tight", facecolor=BG)
        print(f"Saved: {p5}")

        plt.close(fig5)

    print("\nAll charts generated ✓")


if __name__ == "__main__":
    main()
