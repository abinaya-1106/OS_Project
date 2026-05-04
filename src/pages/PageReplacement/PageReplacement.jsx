import React, { useState } from "react";

export default function PageReplacement() {
  const [algorithm, setAlgorithm] = useState("FIFO");
  const [pageString, setPageString] = useState("");
  const [frameCount, setFrameCount] = useState(3);
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState({ hits: 0, faults: 0, hitRate: 0, missRate: 0 });
  const [beladyResults1, setBeladyResults1] = useState([]);
  const [beladyResults2, setBeladyResults2] = useState([]);
  const [beladySummary1, setBeladySummary1] = useState({ hits: 0, faults: 0 });
  const [beladySummary2, setBeladySummary2] = useState({ hits: 0, faults: 0 });
  const [showResults, setShowResults] = useState(false);

  // 1) NEW: Style string for a pastel, modern vibe
  const styleString = `
    /* Page fills viewport with pastel background */
    html, body {
      margin: 0;
      padding: 0;
      min-height: 100vh;
      background: #f3f8fe;  /* Light pastel background */
      font-family: 'Poppins', sans-serif;
      color: #333;
      overflow-y: auto;
    }

    /* Outer container that centers content and uses a card style */
    .pr-outer {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      align-items: center;
      justify-content: flex-start;
      padding: 2rem;
    }

    /* Card container with white background, shadow, and rounded corners */
    .pr-container {
      width: 100%;
      max-width: 1000px;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.12);
      padding: 2rem;
    }

    /* Title styling */
    .pr-container h2 {
      text-align: center;
      color: #333;
      font-size: 1.8rem;
      margin-bottom: 2rem;
    }

    /* Controls row */
    .pr-controls {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.5rem;
    }
    .pr-controls label {
      font-weight: 600;
      font-size: 0.95rem;
    }

    /* The select, input, and button are bigger now */
    .pr-controls select,
    .pr-controls input {
      padding: 0.7rem 1rem;
      font-size: 1rem;
      border: 1px solid #ccc;
      border-radius: 8px;
      outline: none;
      color: #333;
      background: #f9f9f9;
      transition: border-color 0.2s;
    }
    .pr-controls input[type="number"] {
      max-width: 5rem;
      text-align: center;
    }
    .pr-controls select:focus,
    .pr-controls input:focus {
      border-color: #a0c4ff; /* Subtle pastel highlight */
    }

    /* Buttons */
    .pr-controls button {
      background-color: #3d5afe;
      border: none;
      border-radius: 8px;
      color: #fff;
      font-weight: bold;
      font-size: 1rem;
      padding: 0.7rem 1.2rem;
      cursor: pointer;
      transition: background-color 0.3s, transform 0.2s;
    }
    .pr-controls button:hover {
      background-color: #2c47cc;
      transform: translateY(-1px);
    }

    /* Results area with a sub-card style */
    .pr-results {
      background: #fafafa;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      padding: 1rem;
      margin-top: 2rem;
    }
    .pr-results h4 {
      margin-bottom: 1rem;
      font-size: 1.2rem;
      color: #444;
    }
    .pr-results h5 {
      margin-top: 1rem;
      margin-bottom: 0.5rem;
      font-size: 1rem;
      color: #444;
    }

    /* Tables */
    .pr-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1rem;
    }
    .pr-table th,
    .pr-table td {
      border: 1px solid #ddd;
      padding: 0.6rem;
      text-align: center;
      color: #333;
      font-size: 0.95rem;
    }
    .pr-table th {
      background-color: #f3f8fe;
      font-weight: 600;
    }

    /* Hit & Miss highlighting */
    .hit {
      color: #388e3c;   /* greenish */
      font-weight: 600;
    }
    .miss {
      color: #d32f2f;   /* red */
      font-weight: 600;
    }

    /* Summary block */
    .pr-summary {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-top: 1rem;
      justify-content: center;
    }
    .pr-summary span {
      background: #fdfdfd;
      border: 1px solid #ececec;
      border-radius: 8px;
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
      box-shadow: 0 0 5px rgba(0,0,0,0.07);
    }
  `;

  /** 
   * Existing code logic for 
   * - parsePages,
   * - validateFrameCount,
   * - reset,
   * - FIFO/Optimal/LRU/MRU/Belady sim
   * - handleVisualize
   * all remains unchanged!
   */

  // Parse pages from input, allow spaces or commas, only digits 0-9
  const parsePages = () => {
    const matches = pageString.match(/\d+/g);
    if (!matches) {
      alert("No valid page numbers found. Use space- or comma-separated integers 0-9.");
      return [];
    }
    const pages = matches.map(Number);
    if (pages.length > 20) {
      alert("Maximum 20 pages allowed");
      return [];
    }
    if (pages.some((p) => p < 0 || p > 9)) {
      alert("Page numbers must be between 0 and 9");
      return [];
    }
    return pages;
  };

  const validateFrameCount = (count) => {
    if (isNaN(count) || count < 1) {
      alert("Frame count must be at least 1");
      return false;
    }
    if (count > 10) {
      alert("Frame count cannot exceed 10");
      return false;
    }
    return true;
  };

  const reset = () => {
    setPageString("");
    setFrameCount(3);
    setResults([]);
    setSummary({ hits: 0, faults: 0, hitRate: 0, missRate: 0 });
    setBeladyResults1([]);
    setBeladyResults2([]);
    setBeladySummary1({ hits: 0, faults: 0 });
    setBeladySummary2({ hits: 0, faults: 0 });
    setShowResults(false);
  };

  // FIFO simulation
  const fifoSim = (pages, frames) => {
    let f = Array(frames).fill(-1);
    let hits = 0, faults = 0;
    const rows = [];
    pages.forEach((p) => {
      const hit = f.includes(p);
      if (hit) hits++;
      else {
        faults++;
        if (f.includes(-1)) f[f.indexOf(-1)] = p;
        else {
          f.shift();
          f.push(p);
        }
      }
      rows.push({ page: p, frames: [...f], isHit: hit });
    });
    return {
      rows,
      summary: {
        hits,
        faults,
        hitRate: (hits / pages.length) * 100,
        missRate: (faults / pages.length) * 100,
      },
    };
  };

  // Optimal simulation
  const optimalSim = (pages, frames) => {
    let f = Array(frames).fill(-1);
    let hits = 0, faults = 0;
    const rows = [];
    pages.forEach((p, idx) => {
      const hit = f.includes(p);
      if (hit) hits++;
      else {
        faults++;
        if (f.includes(-1)) {
          f[f.indexOf(-1)] = p;
        } else {
          const future = f.map((v) => {
            const next = pages.slice(idx + 1).indexOf(v);
            return next === -1 ? Infinity : next;
          });
          const pos = future.indexOf(Math.max(...future));
          f[pos] = p;
        }
      }
      rows.push({ page: p, frames: [...f], isHit: hit });
    });
    return {
      rows,
      summary: {
        hits,
        faults,
        hitRate: (hits / pages.length) * 100,
        missRate: (faults / pages.length) * 100,
      },
    };
  };

  // LRU simulation
  const lruSim = (pages, frames) => {
    let f = Array(frames).fill(-1);
    let time = Array(frames).fill(0);
    let counter = 0;
    let hits = 0, faults = 0;
    const rows = [];
    pages.forEach((p) => {
      counter++;
      const hit = f.includes(p);
      if (hit) {
        hits++;
        time[f.indexOf(p)] = counter;
      } else {
        faults++;
        if (f.includes(-1)) {
          const pos = f.indexOf(-1);
          f[pos] = p;
          time[pos] = counter;
        } else {
          const lru = time.indexOf(Math.min(...time));
          f[lru] = p;
          time[lru] = counter;
        }
      }
      rows.push({ page: p, frames: [...f], isHit: hit });
    });
    return {
      rows,
      summary: {
        hits,
        faults,
        hitRate: (hits / pages.length) * 100,
        missRate: (faults / pages.length) * 100,
      },
    };
  };

  // MRU simulation
  const mruSim = (pages, frames) => {
    let f = Array(frames).fill(-1);
    let time = Array(frames).fill(0);
    let counter = 0;
    let hits = 0, faults = 0;
    const rows = [];
    pages.forEach((p) => {
      counter++;
      const hit = f.includes(p);
      if (hit) {
        hits++;
        time[f.indexOf(p)] = counter;
      } else {
        faults++;
        if (f.includes(-1)) {
          const pos = f.indexOf(-1);
          f[pos] = p;
          time[pos] = counter;
        } else {
          const mru = time.indexOf(Math.max(...time));
          f[mru] = p;
          time[mru] = counter;
        }
      }
      rows.push({ page: p, frames: [...f], isHit: hit });
    });
    return {
      rows,
      summary: {
        hits,
        faults,
        hitRate: (hits / pages.length) * 100,
        missRate: (faults / pages.length) * 100,
      },
    };
  };

  // Belady's anomaly using FIFO
  const beladySim = (pages, frames) => {
    return {
      sim1: fifoSim(pages, frames),
      sim2: fifoSim(pages, frames + 1),
    };
  };

  const handleVisualize = () => {
    if (!validateFrameCount(frameCount)) return;
    const pages = parsePages();
    if (!pages.length) return;
    setShowResults(true);
    let sim;
    switch (algorithm) {
      case "FIFO":
        sim = fifoSim(pages, frameCount);
        setResults(sim.rows);
        setSummary(sim.summary);
        break;
      case "Optimal":
        sim = optimalSim(pages, frameCount);
        setResults(sim.rows);
        setSummary(sim.summary);
        break;
      case "LRU":
        sim = lruSim(pages, frameCount);
        setResults(sim.rows);
        setSummary(sim.summary);
        break;
      case "MRU":
        sim = mruSim(pages, frameCount);
        setResults(sim.rows);
        setSummary(sim.summary);
        break;
      case "Belady": {
        const { sim1, sim2 } = beladySim(pages, frameCount);
        setBeladyResults1(sim1.rows);
        setBeladySummary1(sim1.summary);
        setBeladyResults2(sim2.rows);
        setBeladySummary2(sim2.summary);
        break;
      }
      default:
        break;
    }
  };

  return (
    <>
      <style>{styleString}</style>
      <div className="pr-outer">
        <div className="pr-container">
          <h2>Page Replacement Simulator</h2>
          <div className="pr-controls">
            <label>Algorithm:</label>
            <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
              <option>FIFO</option>
              <option>Optimal</option>
              <option>LRU</option>
              <option>MRU</option>
              <option>Belady</option>
            </select>

            <label>Pages:</label>
            <input
              type="text"
              value={pageString}
              onChange={(e) => setPageString(e.target.value)}
              placeholder="e.g. 7 0 1 2 0 3"
            />

            <label>Frames:</label>
            <input
              type="number"
              value={frameCount}
              onChange={(e) => setFrameCount(parseInt(e.target.value, 10))}
              min="1"
            />

            <button onClick={handleVisualize}>Visualize</button>
            <button onClick={reset}>Reset</button>
          </div>

          {showResults && algorithm !== "Belady" && (
            <div className="pr-results">
              <h4>Visualization</h4>
              <table className="pr-table">
                <thead>
                  <tr>
                    <th>Page</th>
                    {Array.from({ length: frameCount }).map((_, i) => (
                      <th key={i}>F{i + 1}</th>
                    ))}
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i}>
                      <td>{r.page}</td>
                      {r.frames.map((f, j) => (
                        <td key={j}>{f === -1 ? "-" : f}</td>
                      ))}
                      <td className={r.isHit ? "hit" : "miss"}>
                        {r.isHit ? "Hit" : "Miss"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pr-summary">
                <span><strong>Faults:</strong> {summary.faults}</span>
                <span><strong>Hits:</strong> {summary.hits}</span>
                <span><strong>Miss Rate:</strong> {summary.missRate.toFixed(2)}%</span>
                <span><strong>Hit Rate:</strong> {summary.hitRate.toFixed(2)}%</span>
              </div>
            </div>
          )}

          {showResults && algorithm === "Belady" && (
            <div className="pr-results">
              <h4>Belady's Anomaly (FIFO)</h4>
              <div>
                <h5>Frames = {frameCount}</h5>
                <table className="pr-table">
                  <thead>
                    <tr>
                      <th>Page</th>
                      {Array.from({ length: frameCount }).map((_, i) => (
                        <th key={i}>F{i + 1}</th>
                      ))}
                      <th>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {beladyResults1.map((r, i) => (
                      <tr key={i}>
                        <td>{r.page}</td>
                        {r.frames.map((f, j) => (
                          <td key={j}>{f === -1 ? "-" : f}</td>
                        ))}
                        <td className={r.isHit ? "hit" : "miss"}>
                          {r.isHit ? "Hit" : "Miss"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="pr-summary">
                  <span><strong>Faults:</strong> {beladySummary1.faults}</span>
                  <span><strong>Hits:</strong> {beladySummary1.hits}</span>
                </div>
              </div>

              <div>
                <h5>Frames = {frameCount + 1}</h5>
                <table className="pr-table">
                  <thead>
                    <tr>
                      <th>Page</th>
                      {Array.from({ length: frameCount + 1 }).map((_, i) => (
                        <th key={i}>F{i + 1}</th>
                      ))}
                      <th>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {beladyResults2.map((r, i) => (
                      <tr key={i}>
                        <td>{r.page}</td>
                        {r.frames.map((f, j) => (
                          <td key={j}>{f === -1 ? "-" : f}</td>
                        ))}
                        <td className={r.isHit ? "hit" : "miss"}>
                          {r.isHit ? "Hit" : "Miss"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="pr-summary">
                  <span><strong>Faults:</strong> {beladySummary2.faults}</span>
                  <span><strong>Hits:</strong> {beladySummary2.hits}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
