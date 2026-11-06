"use client";

import { useState } from "react";

/**
 * Range input with live readout. Adapted from the 21st.dev Halaska UI
 * "Slider" (native range variant): same structure (label, track filled to the
 * value with a linear-gradient, tabular mono readout), restyled with Tailwind
 * and the moss accent instead of the kit's inline violet tokens.
 */
function Slider({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (n: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-[var(--aq-ink)]">
        {label}
      </label>
      <div className="flex items-center gap-4">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-1 flex-1 cursor-pointer appearance-none rounded-full accent-[#2f6a37]"
          style={{
            background: `linear-gradient(to right, #2f6a37 ${pct}%, rgba(15,29,24,0.12) ${pct}%)`,
          }}
        />
        <span className="aq-spec w-20 text-right text-sm text-[var(--aq-ink)]">
          {value} {unit}
        </span>
      </div>
    </div>
  );
}

const PRESETS: { label: string; dims: [number, number] }[] = [
  { label: "10 gal", dims: [20, 10] },
  { label: "20 long", dims: [30, 12] },
  { label: "29 gal", dims: [30, 12] },
  { label: "40 breeder", dims: [36, 18] },
  { label: "55 gal", dims: [48, 13] },
  { label: "60P", dims: [23.6, 11.8] },
];

const CUIN_TO_L = 0.016387;

export function SubstrateCalculator({
  initial = [20, 10] as [number, number],
}) {
  const [length, setLength] = useState(initial[0]);
  const [width, setWidth] = useState(initial[1]);
  const [front, setFront] = useState(2);
  const [back, setBack] = useState(3.5);

  const avg = (front + back) / 2;
  const litres = length * width * avg * CUIN_TO_L;
  const soilKg = litres * 1.0;
  const sandKg = litres * 1.5;

  return (
    <div className="grid gap-8 rounded-2xl border border-[var(--aq-line)] bg-white p-6 md:grid-cols-[1.1fr_0.9fr] md:p-8">
      <div className="flex flex-col gap-6">
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Tank presets"
        >
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => {
                setLength(p.dims[0]);
                setWidth(p.dims[1]);
              }}
              className="rounded-full border border-[var(--aq-line)] px-3.5 py-1.5 text-sm text-[var(--aq-ink)] transition-colors hover:border-[#2f6a37] hover:text-[#2f6a37] active:scale-[0.98]"
            >
              {p.label}
            </button>
          ))}
        </div>
        <Slider
          id="len"
          label="Tank length"
          value={length}
          min={10}
          max={72}
          step={0.5}
          unit="in"
          onChange={setLength}
        />
        <Slider
          id="wid"
          label="Front to back"
          value={width}
          min={6}
          max={24}
          step={0.5}
          unit="in"
          onChange={setWidth}
        />
        <Slider
          id="front"
          label="Depth at the front glass"
          value={front}
          min={1}
          max={4}
          step={0.5}
          unit="in"
          onChange={setFront}
        />
        <Slider
          id="back"
          label="Depth at the back glass"
          value={back}
          min={1}
          max={6}
          step={0.5}
          unit="in"
          onChange={setBack}
        />
      </div>
      <div
        className="flex flex-col justify-between rounded-xl bg-[var(--aq-raised)] p-6"
        aria-live="polite"
      >
        <div>
          <p className="text-sm text-[var(--aq-muted)]">You need about</p>
          <p className="aq-spec mt-1 text-5xl font-medium tracking-tight">
            {Math.round(litres)} L
          </p>
          <p className="mt-1 text-sm text-[var(--aq-muted)]">
            of substrate ({(litres / 3.785).toFixed(1)} US gal by volume)
          </p>
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-[var(--aq-muted)]">Aqua soil</dt>
            <dd className="aq-spec mt-0.5 text-lg">
              {Math.round(soilKg)} kg / {Math.round(soilKg * 2.2)} lb
            </dd>
          </div>
          <div>
            <dt className="text-[var(--aq-muted)]">Sand or gravel</dt>
            <dd className="aq-spec mt-0.5 text-lg">
              {Math.round(sandKg)} kg / {Math.round(sandKg * 2.2)} lb
            </dd>
          </div>
        </dl>
        <p className="mt-6 text-xs leading-relaxed text-[var(--aq-muted)]">
          Uses outer dimensions and an average of the front and back depth. Aqua
          soil is about 1.0 kg per litre, sand about 1.5 kg per litre.
        </p>
      </div>
    </div>
  );
}
