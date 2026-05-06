import { useState, useEffect, useRef } from "react";

const FRAME_COUNT = 3;

function computeFIFO(pages, frames) {
  const steps = [];
  let queue = [];
  let faults = 0;
  for (let i = 0; i < pages.length; i++) {
    const p = pages[i];
    const hit = queue.includes(p);
    const prevQueue = [...queue];
    let evicted = null;
    if (!hit) {
      faults++;
      if (queue.length < frames) {
        queue.push(p);
      } else {
        evicted = queue.shift();
        queue.push(p);
      }
    }
    steps.push({ page: p, hit, frames: [...queue], evicted, faults, prevFrames: prevQueue });
  }
  return steps;
}

function computeLRU(pages, frames) {
  const steps = [];
  let cache = [];
  let faults = 0;
  for (let i = 0; i < pages.length; i++) {
    const p = pages[i];
    const hit = cache.includes(p);
    const prevCache = [...cache];
    let evicted = null;
    if (!hit) {
      faults++;
      if (cache.length < frames) {
        cache.push(p);
      } else {
        evicted = cache.shift();
        cache.push(p);
      }
    } else {
      cache = cache.filter(x => x !== p);
      cache.push(p);
    }
    steps.push({ page: p, hit, frames: [...cache], evicted, faults, prevFrames: prevCache });
  }
  return steps;
}

function computeMRU(pages, frames) {
  const steps = [];
  let cache = [];
  let faults = 0;
  for (let i = 0; i < pages.length; i++) {
    const p = pages[i];
    const hit = cache.includes(p);
    const prevCache = [...cache];
    let evicted = null;
    if (!hit) {
      faults++;
      if (cache.length < frames) {
        cache.push(p);
      } else {
        evicted = cache[cache.length - 1];
        cache[cache.length - 1] = p;
      }
    } else {
      cache = cache.filter(x => x !== p);
      cache.push(p);
    }
    steps.push({ page: p, hit, frames: [...cache], evicted, faults, prevFrames: prevCache });
  }
  return steps;
}

function computeLFU(pages, frames) {
  const steps = [];
  let cache = [];
  let freq = {};
  let faults = 0;
  for (let i = 0; i < pages.length; i++) {
    const p = pages[i];
    const hit = cache.includes(p);
    const prevCache = [...cache];
    let evicted = null;
    if (!hit) {
      faults++;
      freq[p] = (freq[p] || 0) + 1;
      if (cache.length < frames) {
        cache.push(p);
      } else {
        let minFreq = Infinity;
        let minIdx = 0;
        for (let j = 0; j < cache.length; j++) {
          const f = freq[cache[j]] || 0;
          if (f < minFreq) { minFreq = f; minIdx = j; }
        }
        evicted = cache[minIdx];
        delete freq[evicted];
        cache[minIdx] = p;
      }
    } else {
      freq[p] = (freq[p] || 0) + 1;
    }
    steps.push({ page: p, hit, frames: [...cache], evicted, faults, prevFrames: prevCache });
  }
  return steps;
}

function computeOptimal(pages, frames) {
  const steps = [];
  let cache = [];
  let faults = 0;
  for (let i = 0; i < pages.length; i++) {
    const p = pages[i];
    const hit = cache.includes(p);
    const prevCache = [...cache];
    let evicted = null;
    if (!hit) {
      faults++;
      if (cache.length < frames) {
        cache.push(p);
      } else {
        const future = cache.map(pg => {
          const idx = pages.slice(i + 1).indexOf(pg);
          return idx === -1 ? Infinity : idx;
        });
        const maxIdx = future.indexOf(Math.max(...future));
        evicted = cache[maxIdx];
        cache[maxIdx] = p;
      }
    }
    steps.push({ page: p, hit, frames: [...cache], evicted, faults, prevFrames: prevCache });
  }
  return steps;
}

const DEFAULT_PAGES = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2];

const ALGO_META = {
  FIFO: {
    desc: "Evicts the page loaded earliest.",
    border: "border-blue-500",
    text: "text-blue-400",
    badge: "bg-blue-900 text-blue-200",
    infoBg: "bg-blue-950 border-blue-800",
  },
  LRU: {
    desc: "Evicts the least recently used page.",
    border: "border-violet-500",
    text: "text-violet-400",
    badge: "bg-violet-900 text-violet-200",
    infoBg: "bg-violet-950 border-violet-800",
  },
  MRU: {
    desc: "Evicts the most recently used page.",
    border: "border-orange-500",
    text: "text-orange-400",
    badge: "bg-orange-900 text-orange-200",
    infoBg: "bg-orange-950 border-orange-800",
  },
  LFU: {
    desc: "Evicts the least frequently used page.",
    border: "border-pink-500",
    text: "text-pink-400",
    badge: "bg-pink-900 text-pink-200",
    infoBg: "bg-pink-950 border-pink-800",
  },
  Optimal: {
    desc: "Evicts the page unused furthest in future. (Theoretical best)",
    border: "border-emerald-500",
    text: "text-emerald-400",
    badge: "bg-emerald-900 text-emerald-200",
    infoBg: "bg-emerald-950 border-emerald-800",
  },
};

const COMPUTE_MAP = {
  FIFO: computeFIFO,
  LRU: computeLRU,
  MRU: computeMRU,
  LFU: computeLFU,
  Optimal: computeOptimal,
};

const ALL_ALGOS = ["FIFO", "LRU", "MRU", "LFU", "Optimal"];

function FrameCell({ value, isNew, isEmpty }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current || !isNew) return;
    ref.current.animate(
      [
        { transform: "scale(0.6) translateY(-10px)", opacity: 0 },
        { transform: "scale(1.15) translateY(0)", opacity: 1 },
        { transform: "scale(1)", opacity: 1 },
      ],
      { duration: 380, easing: "cubic-bezier(0.34,1.56,0.64,1)" }
    );
  }, [value, isNew]);

  return (
    <div
      ref={ref}
      className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold border transition-all duration-300 ${
        isEmpty
          ? "border-dashed border-gray-600 bg-gray-900 text-gray-600"
          : isNew
          ? "border-green-400 bg-green-900/40 text-green-200"
          : "border-gray-600 bg-gray-800 text-gray-200"
      }`}
    >
      {isEmpty ? "—" : value}
    </div>
  );
}

function StepCard({ step, index, isCurrent, algo, frameCount, isRevealed }) {
  const meta = ALGO_META[algo];
  const cardRef = useRef(null);

  useEffect(() => {
    if (isCurrent && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [isCurrent]);

  useEffect(() => {
    if (isRevealed && cardRef.current) {
      cardRef.current.animate(
        [
          { opacity: 0, transform: "translateY(16px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 300, easing: "ease-out", fill: "forwards" }
      );
    }
  }, [isRevealed]);

  const frameDisplay = Array.from({ length: frameCount }, (_, i) => {
    const val = step.frames[i];
    return val !== undefined ? val : null;
  });

  return (
    <div
      ref={cardRef}
      className={`flex-shrink-0 flex flex-col items-center gap-1 p-2 rounded-xl border transition-all duration-300 ${
        isCurrent
          ? `${meta.border} border-2 bg-gray-800 shadow-lg`
          : "border-gray-700 bg-gray-900"
      }`}
      style={{ minWidth: 64, opacity: isRevealed ? 1 : 0 }}
    >
      <div className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${meta.badge}`}>
        P{step.page}
      </div>
      <div
        className={`text-xs font-bold px-1.5 py-0.5 rounded ${
          step.hit ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"
        }`}
      >
        {step.hit ? "HIT" : "MISS"}
      </div>
      <div className="flex flex-col gap-1 mt-1">
        {frameDisplay.map((val, fi) => (
          <FrameCell
            key={fi}
            value={val}
            isNew={!step.hit && val === step.page}
            isEmpty={val === null}
          />
        ))}
      </div>
    </div>
  );
}

function AlgoPanel({ algo, pages, frameCount, currentStep, revealedCount }) {
  const meta = ALGO_META[algo];
  const steps = COMPUTE_MAP[algo](pages, frameCount);
  const total = steps.length;
  const hits = steps.filter(s => s.hit).length;
  const faults = steps.filter(s => !s.hit).length;
  const rate = total > 0 ? ((hits / total) * 100).toFixed(0) : 0;
  const visHits = steps.slice(0, revealedCount).filter(s => s.hit).length;
  const visFaults = steps.slice(0, revealedCount).filter(s => !s.hit).length;

  return (
    <div className={`rounded-2xl border ${meta.border} bg-gray-900 flex flex-col gap-3 p-4`}>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <div className={`text-base font-bold ${meta.text}`}>{algo}</div>
          <div className="text-xs text-gray-400">{meta.desc}</div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="flex flex-col items-center bg-green-950 border border-green-800 rounded-lg px-3 py-1">
            <span className="text-lg font-bold text-green-400">{visHits}</span>
            <span className="text-xs text-green-600">Hits</span>
          </div>
          <div className="flex flex-col items-center bg-red-950 border border-red-800 rounded-lg px-3 py-1">
            <span className="text-lg font-bold text-red-400">{visFaults}</span>
            <span className="text-xs text-red-600">Faults</span>
          </div>
          <div className={`flex flex-col items-center rounded-lg px-3 py-1 border ${meta.infoBg}`}>
            <span className={`text-lg font-bold ${meta.text}`}>{rate}%</span>
            <span className="text-xs text-gray-500">Hit Rate</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto pb-1">
        <div className="flex gap-2">
          {steps.map((step, i) => (
            <StepCard
              key={i}
              step={step}
              index={i}
              isCurrent={i === currentStep}
              algo={algo}
              frameCount={frameCount}
              isRevealed={i < revealedCount}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-1 flex-wrap mt-1">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`w-5 h-5 rounded-sm text-xs flex items-center justify-center font-bold transition-all duration-200 ${
              i >= revealedCount
                ? "bg-gray-800 text-gray-700"
                : step.hit
                ? "bg-green-500 text-green-950"
                : "bg-red-500 text-red-100"
            }`}
          >
            {i < revealedCount ? (step.hit ? "H" : "F") : "·"}
          </div>
        ))}
      </div>
    </div>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap gap-3 text-xs items-center">
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-4 rounded bg-green-500" />
        <span className="text-gray-300">Hit</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-4 rounded bg-red-500" />
        <span className="text-gray-300">Fault</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-4 rounded border-2 border-green-400 bg-green-900/40" />
        <span className="text-gray-300">New page loaded</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-4 rounded border-dashed border-gray-600 bg-gray-900" />
        <span className="text-gray-300">Empty frame</span>
      </div>
    </div>
  );
}

export default function App() {
  const [pages, setPages] = useState(DEFAULT_PAGES);
  const [input, setInput] = useState(DEFAULT_PAGES.join(" "));
  const [inputError, setInputError] = useState("");
  const [currentStep, setCurrentStep] = useState(-1);
  const [revealedCount, setRevealedCount] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [frameCount, setFrameCount] = useState(FRAME_COUNT);
  const [frameInput, setFrameInput] = useState(String(FRAME_COUNT));
  const [frameInputError, setFrameInputError] = useState("");
  const [enabledAlgos, setEnabledAlgos] = useState(new Set(ALL_ALGOS));
  const intervalRef = useRef(null);

  const totalSteps = pages.length;

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setRevealedCount(prev => {
          if (prev >= totalSteps) {
            setPlaying(false);
            return prev;
          }
          setCurrentStep(prev);
          return prev + 1;
        });
      }, speed);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing, speed, totalSteps]);

  const handleReset = () => {
    setPlaying(false);
    setCurrentStep(-1);
    setRevealedCount(0);
    clearInterval(intervalRef.current);
  };

  const handlePlayPause = () => {
    if (revealedCount >= totalSteps) {
      handleReset();
      setTimeout(() => setPlaying(true), 50);
    } else {
      setPlaying(p => !p);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    const nums = e.target.value.trim().split(/[\s,]+/).map(Number);
    if (nums.some(isNaN) || nums.length < 1) {
      setInputError("Enter space/comma-separated numbers");
    } else {
      setInputError("");
      handleReset();
      setPages(nums);
    }
  };

  // Preset frame buttons
  const handleFramePreset = (f) => {
    setFrameCount(f);
    setFrameInput(String(f));
    setFrameInputError("");
    handleReset();
  };

  // Free-text frame input
  const handleFrameInputChange = (e) => {
    const val = e.target.value;
    setFrameInput(val);
    const n = parseInt(val, 10);
    if (isNaN(n) || n < 1 || n > 20) {
      setFrameInputError("Enter a number between 1 and 20");
    } else {
      setFrameInputError("");
      setFrameCount(n);
      handleReset();
    }
  };

  const toggleAlgo = (algo) => {
    setEnabledAlgos(prev => {
      const next = new Set(prev);
      if (next.has(algo) && next.size > 1) next.delete(algo);
      else next.add(algo);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 font-mono">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">

        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Page Replacement Algorithms
          </h1>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-4 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Reference string */}
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs text-gray-400 uppercase tracking-widest">Reference String</label>
              <input
                className={`bg-gray-800 border rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  inputError ? "border-red-500" : "border-gray-600"
                }`}
                value={input}
                onChange={handleInputChange}
                placeholder="e.g. 7 0 1 2 0 3 0 4 2 3"
              />
              {inputError && <p className="text-xs text-red-400">{inputError}</p>}
            </div>

            {/* Frame size: presets + custom input */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400 uppercase tracking-widest">Frame Size</label>
              <div className="flex gap-1 items-center flex-wrap">
                {[2, 3, 4, 5, 6].map(f => (
                  <button
                    key={f}
                    onClick={() => handleFramePreset(f)}
                    className={`w-9 h-9 rounded-lg text-sm font-bold transition-all active:scale-95 border ${
                      frameCount === f && !frameInputError
                        ? "bg-blue-600 border-blue-500 text-white"
                        : "bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    {f}
                  </button>
                ))}
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={frameInput}
                  onChange={handleFrameInputChange}
                  className={`w-16 h-9 rounded-lg text-sm font-mono text-white bg-gray-800 border px-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    frameInputError ? "border-red-500" : "border-gray-600"
                  }`}
                  placeholder="n"
                />
              </div>
              {frameInputError && <p className="text-xs text-red-400">{frameInputError}</p>}
            </div>
          </div>

          {/* Algorithm toggles */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 uppercase tracking-widest">Algorithms</label>
            <div className="flex gap-2 flex-wrap">
              {ALL_ALGOS.map(algo => {
                const meta = ALGO_META[algo];
                const on = enabledAlgos.has(algo);
                return (
                  <button
                    key={algo}
                    onClick={() => toggleAlgo(algo)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                      on
                        ? `${meta.border} ${meta.text} bg-gray-800`
                        : "border-gray-700 text-gray-600 bg-gray-900"
                    }`}
                  >
                    {algo}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Playback controls */}
          <div className="flex flex-wrap gap-2 items-center">
            <button
              onClick={handlePlayPause}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95 ${
                playing
                  ? "bg-yellow-600 hover:bg-yellow-500 text-white"
                  : "bg-blue-600 hover:bg-blue-500 text-white"
              }`}
            >
              {playing ? "Pause" : revealedCount >= totalSteps ? "Restart" : "Play"}
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-lg text-sm font-bold bg-gray-800 border border-gray-600 text-gray-300 hover:bg-gray-700 transition-all active:scale-95"
            >
              Reset
            </button>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-gray-500">Speed</span>
              <input
                type="range"
                min={200}
                max={1500}
                step={100}
                value={1700 - speed}
                onChange={e => setSpeed(1700 - Number(e.target.value))}
                className="w-24 accent-blue-500"
              />
              <span className="text-xs text-gray-400">{speed < 400 ? "Fast" : speed < 900 ? "Med" : "Slow"}</span>
            </div>
          </div>

          {/* Page sequence indicator */}
          <div className="flex gap-1 flex-wrap">
            {pages.map((p, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-md text-sm font-bold flex items-center justify-center transition-all duration-200 ${
                  i < revealedCount
                    ? i === currentStep
                      ? "bg-white text-gray-900 scale-110 shadow-lg shadow-white/20"
                      : "bg-gray-700 text-gray-200"
                    : "bg-gray-800 text-gray-600"
                }`}
              >
                {p}
              </div>
            ))}
          </div>

          <div className="text-xs text-gray-500">
            Step {revealedCount} / {totalSteps}
            <span className="ml-2 text-gray-600">| {frameCount} frames</span>
          </div>
        </div>

        <Legend />

        <div className="flex flex-col gap-4">
          {ALL_ALGOS.filter(a => enabledAlgos.has(a)).map(algo => (
            <AlgoPanel
              key={algo}
              algo={algo}
              pages={pages}
              frameCount={frameCount}
              currentStep={currentStep}
              revealedCount={revealedCount}
            />
          ))}
        </div>

      </div>
    </div>
  );
}