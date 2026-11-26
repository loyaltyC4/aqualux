"use client";

import { useState } from "react";

function Num({
  id, label, value, onChange, unit, step = 0.5, min = 0,
}: { id: string; label: string; value: number; onChange: (n: number) => void; unit: string; step?: number; min?: number }) {
  return (
    <label htmlFor={id} className="flex flex-col gap-1.5 text-sm font-medium text-[var(--aq-ink)]">
      {label}
      <span className="flex items-center gap-2">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          step={step}
          value={Number.isFinite(value) ? value : ""}
          onChange={(e) => onChange(Number(e.target.value))}
          className="aq-spec w-full rounded-lg border border-[var(--aq-line)] bg-white px-3 py-2 text-base"
        />
        <span className="w-10 text-[var(--aq-muted)]">{unit}</span>
      </span>
    </label>
  );
}

function Toggle({ on, onClick, a, b }: { on: boolean; onClick: () => void; a: string; b: string }) {
  return (
    <button type="button" onClick={onClick}
      className="rounded-full border border-[var(--aq-line)] px-3.5 py-1.5 text-sm text-[var(--aq-ink)] hover:border-[#2f6a37]">
      {on ? a : b}
    </button>
  );
}

function Shell({ inputs, result }: { inputs: React.ReactNode; result: React.ReactNode }) {
  return (
    <div className="grid gap-8 rounded-2xl border border-[var(--aq-line)] bg-white p-6 md:grid-cols-[1.1fr_0.9fr] md:p-8">
      <div className="flex flex-col gap-5">{inputs}</div>
      <div className="flex flex-col justify-between rounded-xl bg-[var(--aq-raised)] p-6" aria-live="polite">{result}</div>
    </div>
  );
}

const f1 = (n: number) => (Number.isFinite(n) ? n.toFixed(1) : "–");
const f0 = (n: number) => (Number.isFinite(n) ? Math.round(n).toString() : "–");

/** Rectangular or cylindrical tank volume. Inputs are outer dimensions. */
export function VolumeCalculator() {
  const [cm, setCm] = useState(false);
  const [round, setRound] = useState(false);
  const [l, setL] = useState(30);
  const [w, setW] = useState(12);
  const [h, setH] = useState(16);
  const toCm = cm ? 1 : 2.54;
  const litres = round
    ? Math.PI * Math.pow((l * toCm) / 2, 2) * h * toCm / 1000
    : (l * toCm * w * toCm * h * toCm) / 1000;
  const u = cm ? "cm" : "in";
  return (
    <Shell
      inputs={<>
        <div className="flex flex-wrap gap-2">
          <Toggle on={round} onClick={() => setRound(!round)} a="Rectangular tank" b="Round (cylinder) tank" />
          <Toggle on={cm} onClick={() => setCm(!cm)} a="Use inches" b="Use cm" />
        </div>
        <Num id="vl" label={round ? "Diameter" : "Length"} value={l} onChange={setL} unit={u} />
        {!round && <Num id="vw" label="Front to back" value={w} onChange={setW} unit={u} />}
        <Num id="vh" label="Height" value={h} onChange={setH} unit={u} />
      </>}
      result={<>
        <div>
          <p className="text-sm text-[var(--aq-muted)]">Glass volume</p>
          <p className="aq-spec mt-1 text-5xl font-medium tracking-tight">{f1(litres / 3.785)} gal</p>
          <p className="mt-1 text-sm text-[var(--aq-muted)]">{f0(litres)} litres · {f1(litres / 4.546)} UK gal</p>
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div><dt className="text-[var(--aq-muted)]">Water after substrate and decor</dt>
            <dd className="aq-spec mt-0.5 text-lg">≈ {f1((litres * 0.85) / 3.785)} gal / {f0(litres * 0.85)} L</dd></div>
          <div><dt className="text-[var(--aq-muted)]">Weight of that water</dt>
            <dd className="aq-spec mt-0.5 text-lg">{f0(litres * 0.85)} kg / {f0(litres * 0.85 * 2.2046)} lb</dd></div>
        </dl>
        <p className="mt-6 text-xs leading-relaxed text-[var(--aq-muted)]">
          Outer dimensions overstate the volume slightly because of glass thickness. The 15% allowance for
          substrate, rock and wood is a rule of thumb; dose medication on the real water volume.
        </p>
      </>}
    />
  );
}

/** CO2 from KH and pH: CO2 (ppm) = 3 × KH (dKH) × 10^(7 − pH). */
export function Co2Calculator() {
  const [kh, setKh] = useState(4);
  const [ph, setPh] = useState(6.6);
  const ppm = 3 * kh * Math.pow(10, 7 - ph);
  const band = !Number.isFinite(ppm) ? "" : ppm < 15 ? "Low for a high-tech planted tank" : ppm <= 35 ? "In the usual 20–30 ppm planted-tank range" : ppm <= 45 ? "High: watch the fish at lights-on" : "Dangerously high for fish";
  const targetPh = 7 - Math.log10(30 / (3 * kh));
  return (
    <Shell
      inputs={<>
        <Num id="kh" label="Carbonate hardness (KH)" value={kh} onChange={setKh} unit="dKH" step={0.5} />
        <Num id="ph" label="pH with CO2 running" value={ph} onChange={setPh} unit="pH" step={0.1} />
        <p className="text-sm text-[var(--aq-muted)]">Measure pH at the end of the CO2 period, when it is at its lowest.</p>
      </>}
      result={<>
        <div>
          <p className="text-sm text-[var(--aq-muted)]">Dissolved CO2</p>
          <p className="aq-spec mt-1 text-5xl font-medium tracking-tight">{f0(ppm)} ppm</p>
          <p className="mt-1 text-sm text-[var(--aq-muted)]">{band}</p>
        </div>
        <dl className="mt-6 text-sm">
          <dt className="text-[var(--aq-muted)]">pH that gives ~30 ppm at this KH</dt>
          <dd className="aq-spec mt-0.5 text-lg">{Number.isFinite(targetPh) ? targetPh.toFixed(2) : "–"}</dd>
        </dl>
        <p className="mt-6 text-xs leading-relaxed text-[var(--aq-muted)]">
          The KH/pH table assumes carbonate is the only buffer. Phosphate buffers, tannins from wood and
          active soils throw it off, which is why a drop checker filled with 4 dKH reference solution is the
          better day-to-day check.
        </p>
      </>}
    />
  );
}

/** Heater size by tank volume and how far the tank sits above room temperature. */
export function HeaterCalculator() {
  const [litresMode, setLitresMode] = useState(false);
  const [vol, setVol] = useState(29);
  const [diff, setDiff] = useState(10);
  const gal = litresMode ? vol / 3.785 : vol;
  // Common rule-of-thumb bands, watts per US gallon by temperature rise in °F.
  const wpg = diff <= 5 ? 2.5 : diff <= 10 ? 3.5 : diff <= 15 ? 5 : 6;
  const watts = gal * wpg;
  const sizes = [25, 50, 75, 100, 150, 200, 300];
  const pick = sizes.find((s) => s >= watts);
  const twin = Math.ceil(watts / 2 / 25) * 25;
  return (
    <Shell
      inputs={<>
        <Toggle on={litresMode} onClick={() => setLitresMode(!litresMode)} a="Use gallons" b="Use litres" />
        <Num id="hv" label="Tank volume" value={vol} onChange={setVol} unit={litresMode ? "L" : "gal"} step={1} />
        <Num id="hd" label="Degrees above room temperature" value={diff} onChange={setDiff} unit="°F" step={1} />
        <p className="text-sm text-[var(--aq-muted)]">Tropical tanks run at 76–80°F. In a 68°F room that is a 10°F rise.</p>
      </>}
      result={<>
        <div>
          <p className="text-sm text-[var(--aq-muted)]">Heater power</p>
          <p className="aq-spec mt-1 text-5xl font-medium tracking-tight">{f0(watts)} W</p>
          <p className="mt-1 text-sm text-[var(--aq-muted)]">about {wpg} W per gallon for a {diff}°F rise</p>
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div><dt className="text-[var(--aq-muted)]">One heater</dt><dd className="aq-spec mt-0.5 text-lg">{pick ? `${pick} W` : "Use two"}</dd></div>
          <div><dt className="text-[var(--aq-muted)]">Or two heaters of</dt><dd className="aq-spec mt-0.5 text-lg">{Number.isFinite(twin) ? `${twin} W each` : "–"}</dd></div>
        </dl>
        <p className="mt-6 text-xs leading-relaxed text-[var(--aq-muted)]">
          A rule of thumb, not a guarantee: glass lids, room drafts and where the heater sits all matter. Two
          smaller heaters spread heat better and limit the damage if one sticks on.
        </p>
      </>}
    />
  );
}

/** Percentage of water to change to bring nitrate down, from the dilution formula. */
export function WaterChangeCalculator() {
  const [litresMode, setLitresMode] = useState(false);
  const [vol, setVol] = useState(29);
  const [now, setNow] = useState(40);
  const [target, setTarget] = useState(20);
  const [tap, setTap] = useState(0);
  const pct = now > tap ? ((now - target) / (now - tap)) * 100 : NaN;
  const valid = Number.isFinite(pct) && pct > 0 && pct <= 100;
  const unit = litresMode ? "L" : "gal";
  const amount = valid ? (vol * pct) / 100 : NaN;
  const afterFive = tap + (now - tap) * Math.pow(0.5, 1);
  return (
    <Shell
      inputs={<>
        <Toggle on={litresMode} onClick={() => setLitresMode(!litresMode)} a="Use gallons" b="Use litres" />
        <Num id="wv" label="Water volume" value={vol} onChange={setVol} unit={unit} step={1} />
        <Num id="wn" label="Nitrate now" value={now} onChange={setNow} unit="ppm" step={5} />
        <Num id="wt" label="Nitrate you want" value={target} onChange={setTarget} unit="ppm" step={5} />
        <Num id="wp" label="Nitrate in your tap water" value={tap} onChange={setTap} unit="ppm" step={1} />
      </>}
      result={<>
        <div>
          <p className="text-sm text-[var(--aq-muted)]">Change about</p>
          <p className="aq-spec mt-1 text-5xl font-medium tracking-tight">{valid ? `${Math.round(pct)}%` : "–"}</p>
          <p className="mt-1 text-sm text-[var(--aq-muted)]">{valid ? `${f1(amount)} ${unit} of the water` : "Check the numbers: the target must be below the current level."}</p>
        </div>
        <dl className="mt-6 text-sm">
          <dt className="text-[var(--aq-muted)]">A 50% change leaves nitrate at</dt>
          <dd className="aq-spec mt-0.5 text-lg">{f0(afterFive)} ppm</dd>
        </dl>
        <p className="mt-6 text-xs leading-relaxed text-[var(--aq-muted)]">
          Dilution formula: percent = (current − target) ÷ (current − tap). It assumes the new water is mixed in
          fully. Large changes in one go are hard on fish; match temperature and use a dechlorinator, and for a
          big drop split it over two changes a day apart.
        </p>
      </>}
    />
  );
}
