import React, { useState, useEffect } from 'react';
import { Pause, Play, RefreshCw, Plus, Minus, FileText, Edit, Book, Database, PenTool, Clock, Activity } from 'lucide-react';

const ReaderWriter = () => {
  const [numReaders, setNumReaders] = useState(3);
  const [numWriters, setNumWriters] = useState(2);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [logs, setLogs] = useState([]);
  const [readerPriority, setReaderPriority] = useState(true);
  const [database, setDatabase] = useState({
    content: "Initial database content",
    version: 1,
    activeReaders: 0,
    activeWriter: null,
    waitingReaders: [],
    waitingWriters: [],
    readerStats: Array(3).fill(0),
    writerStats: Array(2).fill(0),
    lastUpdateTime: new Date().toLocaleTimeString(),
    busyReaders: [],  // Track readers currently reading
    busyWriters: []   // Track writers currently writing
  });

  // Initialize
  useEffect(() => {
    resetSimulation();
  }, [numReaders, numWriters]);

  const resetSimulation = () => {
    setRunning(false);
    setDatabase({
      content: "Initial database content",
      version: 1,
      activeReaders: 0,
      activeWriter: null,
      waitingReaders: [],
      waitingWriters: [],
      readerStats: Array(numReaders).fill(0),
      writerStats: Array(numWriters).fill(0),
      lastUpdateTime: new Date().toLocaleTimeString(),
      busyReaders: [],
      busyWriters: []
    });
    setLogs([{ message: "Simulation initialized", time: new Date().toLocaleTimeString() }]);
  };

  const addLog = (message) => {
    setLogs(currentLogs => {
      const newLogs = [
        { message, time: new Date().toLocaleTimeString() },
        ...currentLogs
      ].slice(0, 15);
      return newLogs;
    });
  };

  // Main simulation loop
  useEffect(() => {
    if (!running) return;
    
    const timer = setInterval(() => {
      setDatabase(db => {
        const newDb = { ...db };
        
        // Process any active writer finishing
        if (newDb.activeWriter !== null) {
          if (Math.random() < 0.3) { // 30% chance to finish
            // Update content
            newDb.content = `Content updated by Writer ${newDb.activeWriter} at ${new Date().toLocaleTimeString()}`;
            newDb.version++;
            newDb.lastUpdateTime = new Date().toLocaleTimeString();
            
            // Update stats
            const newWriterStats = [...newDb.writerStats];
            newWriterStats[newDb.activeWriter] += 1;
            newDb.writerStats = newWriterStats;
            
            // Remove from busy writers
            newDb.busyWriters = newDb.busyWriters.filter(w => w !== newDb.activeWriter);
            
            addLog(`Writer ${newDb.activeWriter} finished writing. Database at version ${newDb.version}`);
            newDb.activeWriter = null;
          }
        }
        
        // Process any active readers finishing
        if (newDb.activeReaders > 0) {
          const readersToFinish = Math.min(
            Math.floor(Math.random() * newDb.activeReaders * 0.3) + (Math.random() < 0.1 ? 1 : 0),
            newDb.activeReaders
          );
          
          if (readersToFinish > 0) {
            // Remove random readers from busy list
            const finishedReaders = [];
            for (let i = 0; i < readersToFinish; i++) {
              if (newDb.busyReaders.length > 0) {
                const idx = Math.floor(Math.random() * newDb.busyReaders.length);
                finishedReaders.push(newDb.busyReaders[idx]);
                newDb.busyReaders.splice(idx, 1);
              }
            }
            
            newDb.activeReaders -= readersToFinish;
            addLog(`${readersToFinish} readers finished reading. ${newDb.activeReaders} still reading.`);
          }
        }
        
        // Process waiting queue if no active writer
        if (newDb.activeWriter === null) {
          const shouldProcessWriters = !readerPriority || 
                                      (newDb.waitingWriters.length > 0 && Math.random() < 0.5);
          
          if (shouldProcessWriters && newDb.waitingWriters.length > 0 && newDb.activeReaders === 0) {
            // Start next writer
            const nextWriter = newDb.waitingWriters.shift();
            newDb.activeWriter = nextWriter;
            newDb.busyWriters.push(nextWriter);
            addLog(`Writer ${nextWriter} started writing.`);
          } else if (newDb.waitingReaders.length > 0) {
            // Start readers (max 2 at a time)
            const readersToStart = Math.min(newDb.waitingReaders.length, 2);
            for (let i = 0; i < readersToStart; i++) {
              const reader = newDb.waitingReaders.shift();
              newDb.activeReaders++;
              newDb.busyReaders.push(reader);
              
              // Update stats
              const newReaderStats = [...newDb.readerStats];
              newReaderStats[reader] += 1;
              newDb.readerStats = newReaderStats;
              
              addLog(`Reader ${reader} started reading. Total readers: ${newDb.activeReaders}`);
            }
          }
        }
        
        // Generate new requests only from available processes
        const allProcesses = [
          ...newDb.busyReaders,
          ...newDb.busyWriters,
          ...newDb.waitingReaders,
          ...newDb.waitingWriters
        ];
        
        // Available readers not currently busy or waiting
        const availableReaders = Array(numReaders).fill().map((_, i) => i)
          .filter(r => !allProcesses.includes(r));
        
        // Available writers not currently busy or waiting  
        const availableWriters = Array(numWriters).fill().map((_, i) => i)
          .filter(w => !allProcesses.includes(w));
        
        // Generate new reader requests
        if (availableReaders.length > 0 && Math.random() < 0.15) {
          const reader = availableReaders[Math.floor(Math.random() * availableReaders.length)];
          if (newDb.waitingReaders.length < numReaders * 2) {
            newDb.waitingReaders.push(reader);
            addLog(`Reader ${reader} requested access.`);
          }
        }
        
        // Generate new writer requests
        if (availableWriters.length > 0 && Math.random() < 0.15) {
          const writer = availableWriters[Math.floor(Math.random() * availableWriters.length)];
          if (newDb.waitingWriters.length < numWriters) {
            newDb.waitingWriters.push(writer);
            addLog(`Writer ${writer} requested access.`);
          }
        }
        
        return newDb;
      });
    }, 1000 / speed);
    
    return () => clearInterval(timer);
  }, [running, speed, numReaders, numWriters, readerPriority]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-cyan-50 to-sky-50 p-8" style={{fontFamily: "'Montserrat', sans-serif"}}>
      <div className="w-full max-w-4xl mx-auto p-6 rounded-xl bg-white shadow-lg">
        <div className="flex flex-col items-center space-y-6">
          {/* Header */}
          <div className="w-full text-center mb-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-center bg-gradient-to-r from-cyan-600 to-blue-600 text-transparent bg-clip-text pb-2" style={{fontFamily: "'Poppins', sans-serif"}}>
              Reader-Writer Concurrency
            </h1>
            <div className="h-1 w-40 mx-auto bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
          </div>
          
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-4 bg-slate-50 p-4 rounded-xl shadow-sm w-full">
            <button 
              onClick={() => setRunning(!running)} 
              className={`flex items-center px-4 py-2 ${running ? 'bg-rose-500' : 'bg-cyan-600'} text-white rounded-lg hover:opacity-90 transition-all shadow-md font-medium`}
              style={{letterSpacing: "0.5px"}}
            >
              {running ? <><Pause size={16} className="mr-2" /> Pause</> : <><Play size={16} className="mr-2" /> Start</>}
            </button>
            
            <button 
              onClick={resetSimulation} 
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:opacity-90 transition-all shadow-md font-medium"
              style={{letterSpacing: "0.5px"}}
            >
              <RefreshCw size={16} className="mr-2" /> Reset
            </button>
            
            <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow-sm">
              <Clock size={16} className="text-cyan-600" />
              <span className="text-slate-700">Speed:</span>
              <input 
                type="range" 
                min="0.5" 
                max="3" 
                step="0.5" 
                value={speed} 
                onChange={(e) => setSpeed(parseFloat(e.target.value))} 
                className="w-24"
              />
              <span className="font-medium text-slate-800">{speed}x</span>
            </div>
            
            <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow-sm">
              <Activity size={16} className="text-cyan-600" />
              <span className="text-slate-700">Priority:</span>
              <button 
                onClick={() => setReaderPriority(true)} 
                className={`px-3 py-1 rounded-lg transition-all ${readerPriority ? 'bg-cyan-600 text-white shadow-md' : 'bg-slate-200'}`}
                style={{letterSpacing: "0.3px"}}
              >
                Readers
              </button>
              <button 
                onClick={() => setReaderPriority(false)} 
                className={`px-3 py-1 rounded-lg transition-all ${!readerPriority ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-200'}`}
                style={{letterSpacing: "0.3px"}}
              >
                Writers
              </button>
            </div>
          </div>
          
          <div className="flex w-full justify-center gap-8">
            {/* Reader controls */}
            <div className="flex items-center space-x-2 bg-cyan-50 px-4 py-2 rounded-lg shadow-md">
              <Book size={16} className="text-cyan-600" />
              <span className="text-cyan-700 font-medium">Readers:</span>
              <button 
                onClick={() => setNumReaders(Math.max(1, numReaders - 1))}
                className="p-1 bg-cyan-100 rounded-full hover:bg-cyan-200 text-cyan-700"
                disabled={numReaders <= 1}
              >
                <Minus size={16} />
              </button>
              <span className="w-6 text-center font-bold text-cyan-700">{numReaders}</span>
              <button 
                onClick={() => setNumReaders(Math.min(5, numReaders + 1))}
                className="p-1 bg-cyan-100 rounded-full hover:bg-cyan-200 text-cyan-700"
                disabled={numReaders >= 5}
              >
                <Plus size={16} />
              </button>
            </div>
            
            {/* Writer controls */}
            <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg shadow-md">
              <PenTool size={16} className="text-blue-600" />
              <span className="text-blue-700 font-medium">Writers:</span>
              <button 
                onClick={() => setNumWriters(Math.max(1, numWriters - 1))}
                className="p-1 bg-blue-100 rounded-full hover:bg-blue-200 text-blue-700"
                disabled={numWriters <= 1}
              >
                <Minus size={16} />
              </button>
              <span className="w-6 text-center font-bold text-blue-700">{numWriters}</span>
              <button 
                onClick={() => setNumWriters(Math.min(5, numWriters + 1))}
                className="p-1 bg-blue-100 rounded-full hover:bg-blue-200 text-blue-700"
                disabled={numWriters >= 5}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          
          {/* Visualization */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left side - Database and access visualization */}
            <div className="flex flex-col gap-4">
              {/* Database */}
              <div className="border border-slate-200 rounded-lg p-4 bg-white shadow-md">
                <h3 className="font-semibold flex items-center mb-2 text-cyan-700" style={{letterSpacing: "0.3px"}}>
                  <Database size={16} className="mr-2" /> Database (v{database.version})
                </h3>
                <div className="p-3 bg-gradient-to-r from-cyan-50 to-blue-50 border border-slate-200 rounded-md min-h-16 shadow-inner font-mono text-sm">
                  {database.content}
                </div>
                <div className="text-sm text-blue-600 mt-2 flex items-center">
                  <Clock size={14} className="mr-1" /> Last updated: {database.lastUpdateTime}
                </div>
              </div>
              
              {/* Current Access */}
              <div className="border border-slate-200 rounded-lg p-4 bg-white shadow-md">
                <h3 className="font-semibold mb-3 text-cyan-700" style={{letterSpacing: "0.3px"}}>Current Access</h3>
                
                {/* Active readers */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2 flex items-center text-cyan-700">
                    <Book size={14} className="mr-1" /> Active Readers: {database.activeReaders}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {database.busyReaders.length > 0 ? (
                      database.busyReaders.map((reader, i) => (
                        <div key={`active-reader-${i}`} className="px-3 py-1 bg-cyan-100 border border-cyan-200 rounded-lg shadow-sm font-medium">
                          <Book size={14} className="inline mr-1" /> Reader {reader}
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-400">No active readers</span>
                    )}
                  </div>
                </div>
                
                {/* Active writer */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2 flex items-center text-blue-700">
                    <PenTool size={14} className="mr-1" /> Active Writer:
                  </h4>
                  <div className="flex">
                    {database.activeWriter !== null ? (
                      <div className="px-3 py-1 bg-blue-100 border border-blue-200 rounded-lg shadow-sm font-medium">
                        <Edit size={14} className="inline mr-1" /> Writer {database.activeWriter}
                      </div>
                    ) : (
                      <span className="text-slate-400">No active writer</span>
                    )}
                  </div>
                </div>
                
                {/* Waiting */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center text-cyan-700">
                      <Clock size={14} className="mr-1" /> Waiting Readers:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {database.waitingReaders.length > 0 ? (
                        database.waitingReaders.map((reader, i) => (
                          <div key={`waiting-reader-${i}`} className="px-2 py-1 bg-cyan-50 border border-cyan-200 rounded-md text-sm shadow-sm font-medium">
                            R{reader}
                          </div>
                        ))
                      ) : (
                        <span className="text-slate-400 italic text-sm">None waiting</span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center text-blue-700">
                      <Clock size={14} className="mr-1" /> Waiting Writers:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {database.waitingWriters.length > 0 ? (
                        database.waitingWriters.map((writer, i) => (
                          <div key={`waiting-writer-${i}`} className="px-2 py-1 bg-blue-50 border border-blue-200 rounded-md text-sm shadow-sm font-medium">
                            W{writer}
                          </div>
                        ))
                      ) : (
                        <span className="text-slate-400 italic text-sm">None waiting</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side - Statistics and log */}
            <div className="flex flex-col gap-4">
              {/* Statistics */}
              <div className="border border-slate-200 rounded-lg p-4 bg-white shadow-md">
                <h3 className="font-semibold mb-3 text-cyan-700 flex items-center" style={{letterSpacing: "0.3px"}}>
                  <Activity size={16} className="mr-2" /> Statistics
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Reader stats */}
                  <div className="bg-cyan-50 p-3 rounded-lg">
                    <h4 className="text-sm font-medium mb-2 text-cyan-700 flex items-center">
                      <Book size={14} className="mr-1" /> Reader Access Count:
                    </h4>
                    <div className="space-y-1">
                      {database.readerStats.map((count, i) => (
                        <div key={`reader-stat-${i}`} className="flex justify-between text-sm py-1 border-b border-cyan-100 last:border-b-0">
                          <span className="font-medium">Reader {i}:</span>
                          <span className="font-mono bg-cyan-100 px-2 py-1 rounded-md">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Writer stats */}
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="text-sm font-medium mb-2 text-blue-700 flex items-center">
                      <PenTool size={14} className="mr-1" /> Writer Access Count:
                    </h4>
                    <div className="space-y-1">
                      {database.writerStats.map((count, i) => (
                        <div key={`writer-stat-${i}`} className="flex justify-between text-sm py-1 border-b border-blue-100 last:border-b-0">
                          <span className="font-medium">Writer {i}:</span>
                          <span className="font-mono bg-blue-100 px-2 py-1 rounded-md">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-slate-200">
                  <div className="text-sm">
                    <span className="font-medium text-cyan-700">Database versions:</span> {database.version}
                  </div>
                  <div className="text-sm mt-1">
                    <span className="font-medium text-cyan-700">Priority mode:</span> {readerPriority ? 
                      <span className="bg-cyan-100 px-2 py-1 rounded-md text-cyan-700 font-medium">Reader Priority</span> : 
                      <span className="bg-blue-100 px-2 py-1 rounded-md text-blue-700 font-medium">Writer Priority</span>}
                  </div>
                </div>
              </div>
              
              {/* Logs */}
              <div className="border border-slate-200 rounded-lg p-4 bg-white shadow-md">
                <h3 className="font-semibold mb-2 text-cyan-700 flex items-center" style={{letterSpacing: "0.3px"}}>
                  <FileText size={16} className="mr-2" /> Activity Log
                </h3>
                <div className="h-60 overflow-y-auto flex flex-col bg-slate-50 p-2 rounded-lg shadow-inner">
                  {logs.length === 0 ? (
                    <p className="text-slate-500 italic">No activity recorded yet</p>
                  ) : (
                    logs.map((log, index) => (
                      <div key={`log-${index}`} className="text-sm py-1 px-2 border-b border-slate-200 last:border-b-0 hover:bg-slate-100 rounded-md transition-colors font-light">
                        <span className="text-blue-600 text-xs font-medium">{log.time}</span>: {log.message}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-6 bg-slate-50 p-3 rounded-lg shadow-sm w-full">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-cyan-500 mr-2 rounded-md shadow-sm"></div>
              <span className="font-medium">Reader</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-blue-500 mr-2 rounded-md shadow-sm"></div>
              <span className="font-medium">Writer</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-500 mr-2 rounded-md shadow-sm"></div>
              <span className="font-medium">Database</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReaderWriter;