import React, { useEffect, useState, useRef } from "react";
import { Play, Pause, RefreshCw, Plus, Minus, ReceiptRussianRubleIcon } from "lucide-react";
const ProducerConsumers = () => {
    const [bufferSize, setBufferSize] = useState(5);
    const [queue, setQueue] = useState([]);
    const [producers, setProducers] = useState(1);
    const [consumers, setConsumers] = useState(1);
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState({ produced: 0, consumed: 0 });
    const [running, setRunning] = useState(true);
    const [speed, setSpeed] = useState(1);
  
    const bufferLockRef = useRef(false);
    const itemId = useRef(1);
    const intervalsRef = useRef([]);
  
    const addLog = (message) => {
      setLogs((prevLogs) => [{
        message,
        time: new Date().toLocaleTimeString()
      }, ...prevLogs.slice(0, 9)]);
    };
  
    const produce = (producer) => {
      if (bufferLockRef.current) return;
      bufferLockRef.current = true;
  
      setQueue((prevQueue) => {
        if (prevQueue.length < bufferSize) {
          const item = { id: itemId.current++, producer };
          addLog(`Producer ${producer} produced item ${item.id}`);
          setStats((prev) => ({ ...prev, produced: prev.produced + 1 }));
          return [...prevQueue, item];
        } else {
          addLog(`Producer ${producer} tried to produce but buffer full`);
          return prevQueue;
        }
      });
  
      bufferLockRef.current = false;
    };
  
    const consume = (consumer) => {
      if (bufferLockRef.current) return;
      bufferLockRef.current = true;
    
      setQueue((prevQueue) => {
        if (prevQueue.length > 0) {
          const randomIndex = Math.floor(Math.random() * prevQueue.length);
          const item = prevQueue[randomIndex];
    
          const newQueue = [...prevQueue.slice(0, randomIndex), ...prevQueue.slice(randomIndex + 1)];
          
          addLog(`Consumer ${consumer} consumed item ${item.id}`);
          setStats((prev) => ({ ...prev, consumed: prev.consumed + 1 }));
          return newQueue;
        } else {
          addLog(`Consumer ${consumer} tried to consume but buffer empty`);
          return prevQueue;
        }
      });
    
      bufferLockRef.current = false;
    };
  
    const resetSimulation = () => {
      setRunning(false);
      setQueue([]);
      setLogs([{ message: "Simulation initialized", time: new Date().toLocaleTimeString() }]);
      setStats({ produced: 0, consumed: 0 });
      itemId.current = 1;
    };
  
    useEffect(() => {
      if (!running) {
        intervalsRef.current.forEach(clearInterval);
        intervalsRef.current = [];
        return;
      }
  
      intervalsRef.current.forEach(clearInterval);
      intervalsRef.current = [];
  
      for (let i = 1; i <= producers; i++) {
        const interval = setInterval(() => produce(i), (1000 + Math.random() * 5000) / speed);
        intervalsRef.current.push(interval);
      }
  
      for (let i = 1; i <= consumers; i++) {
        const interval = setInterval(() => consume(i), (1200 + Math.random() * 5000) / speed);
        intervalsRef.current.push(interval);
      }
  
      return () => {
        intervalsRef.current.forEach(clearInterval);
        intervalsRef.current = [];
      };
    }, [producers, consumers, bufferSize, running, speed]);
  
    const getProducerColor = (id) => {
      const colors = [
        'bg-indigo-600', 'bg-cyan-600', 'bg-emerald-600', 
        'bg-violet-600', 'bg-fuchsia-600', 'bg-rose-600'
      ];
      return colors[(id - 1) % colors.length];
    };
  
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 to-blue-900 p-4 md:p-8 font-sans">
        <div className="w-full max-w-5xl mx-auto p-6 rounded-2xl bg-slate-800 bg-opacity-80 shadow-2xl">
          <div className="flex flex-col items-center space-y-8">
            {/* Header with modern styling */}
            <div className="w-full text-center mb-4">
              <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-cyan-400 to-violet-400 text-transparent bg-clip-text pb-2">
                Producer-Consumer Simulator
              </h1>
              <div className="h-1 w-40 mx-auto bg-gradient-to-r from-cyan-400 to-violet-400 rounded-full"></div>
            </div>
            
            {/* Controls with updated styling */}
            <div className="flex flex-wrap items-center justify-center gap-6">
              <button 
                onClick={() => setRunning(!running)} 
                className={`flex items-center px-6 py-3 ${running ? 'bg-amber-500' : 'bg-emerald-500'} text-white rounded-lg hover:opacity-90 transition-opacity shadow-lg font-medium`}
              >
                {running ? <><Pause size={16} className="mr-2" /> Pause</> : <><Play size={16} className="mr-2" /> Start</>}
              </button>
              
              <button 
                onClick={resetSimulation} 
                className="flex items-center px-6 py-3 bg-violet-600 text-white rounded-lg hover:opacity-90 transition-opacity shadow-lg font-medium"
              >
                <RefreshCw size={16} className="mr-2" /> Reset
              </button>
              
              <div className="flex items-center space-x-3 bg-slate-700 px-4 py-2 rounded-lg">
                <span className="text-slate-200">Speed:</span>
                <input 
                  type="range" 
                  min="0.5" 
                  max="3" 
                  step="0.5" 
                  value={speed} 
                  onChange={(e) => setSpeed(parseFloat(e.target.value))} 
                  className="w-24"
                />
                <span className="text-cyan-300 font-medium">{speed}x</span>
              </div>
            </div>
  
            {/* Settings Controls with updated styling */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              <div className="flex flex-col items-center p-4 bg-slate-700 rounded-xl shadow-lg border border-slate-600">
                <h3 className="font-bold text-cyan-300 mb-3">Buffer Size</h3>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setBufferSize(Math.max(1, bufferSize - 1))}
                    className="bg-cyan-600 text-white p-2 rounded-lg shadow-md hover:bg-cyan-700 transition"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-2xl font-bold w-10 text-center text-white">{bufferSize}</span>
                  <button 
                    onClick={() => setBufferSize(bufferSize + 1)}
                    className="bg-cyan-600 text-white p-2 rounded-lg shadow-md hover:bg-cyan-700 transition"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col items-center p-4 bg-slate-700 rounded-xl shadow-lg border border-slate-600">
                <h3 className="font-bold text-indigo-300 mb-3">Producers</h3>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setProducers(Math.max(1, producers - 1))}
                    className="bg-indigo-600 text-white p-2 rounded-lg shadow-md hover:bg-indigo-700 transition"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-2xl font-bold w-10 text-center text-white">{producers}</span>
                  <button 
                    onClick={() => setProducers(producers + 1)}
                    className="bg-indigo-600 text-white p-2 rounded-lg shadow-md hover:bg-indigo-700 transition"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col items-center p-4 bg-slate-700 rounded-xl shadow-lg border border-slate-600">
                <h3 className="font-bold text-emerald-300 mb-3">Consumers</h3>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setConsumers(Math.max(1, consumers - 1))}
                    className="bg-emerald-600 text-white p-2 rounded-lg shadow-md hover:bg-emerald-700 transition"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-2xl font-bold w-10 text-center text-white">{consumers}</span>
                  <button 
                    onClick={() => setConsumers(consumers + 1)}
                    className="bg-emerald-600 text-white p-2 rounded-lg shadow-md hover:bg-emerald-700 transition"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Visualization Container with updated styling */}
            <div className="w-full flex flex-col items-center space-y-6">
              {/* Producer visualization */}
              <div className="w-full flex flex-wrap items-center justify-center gap-4 pb-4">
                <h3 className="w-full text-center font-bold text-indigo-300 mb-2 text-lg">Producers</h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {Array.from({ length: producers }).map((_, i) => (
                    <div 
                      key={`producer-${i+1}`}
                      className={`${getProducerColor(i+1)} w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold shadow-lg transform hover:scale-105 transition`}
                    >
                      P{i+1}
                    </div>
                  ))}
                </div>
                {/* Arrows pointing down */}
                <div className="w-full flex justify-center mt-2">
                  <div className="w-0 h-0 border-l-8 border-r-8 border-t-12 border-solid border-l-transparent border-r-transparent border-t-indigo-400"></div>
                </div>
              </div>
              
              {/* Rectangular Buffer visualization */}
              <div className="w-full border-4 border-slate-600 rounded-2xl p-6 shadow-xl bg-gradient-to-r from-slate-800 to-slate-700">
                <div className="flex flex-col items-center">
                  <h3 className="text-2xl font-bold text-center mb-6 text-cyan-300">Buffer ({queue.length}/{bufferSize})</h3>
                  
                  <div className="grid grid-cols-5 gap-4 w-full max-w-4xl mx-auto">
                    {Array.from({ length: bufferSize }).map((_, index) => {
                      const itemAtPosition = index < queue.length ? queue[index] : null;
                      
                      return (
                        <div 
                          key={`slot-${index}`}
                          className={`aspect-square rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                            itemAtPosition ? getProducerColor(itemAtPosition.producer) : 'bg-slate-600'
                          } border ${itemAtPosition ? 'border-white' : 'border-slate-500'}`}
                        >
                          {itemAtPosition ? (
                            <span className="text-2xl text-white font-bold">{itemAtPosition.id}</span>
                          ) : (
                            <span className="text-slate-400 font-medium">Empty</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {/* Consumer visualization */}
              <div className="w-full flex flex-wrap items-center justify-center gap-4 pt-4">
                {/* Arrows pointing down */}
                <div className="w-full flex justify-center mb-2">
                  <div className="w-0 h-0 border-l-8 border-r-8 border-t-12 border-solid border-l-transparent border-r-transparent border-t-emerald-400" style={{ transform: 'rotate(180deg)' }}></div>
                </div>
                <h3 className="w-full text-center font-bold text-emerald-300 mb-2 text-lg">Consumers</h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {Array.from({ length: consumers }).map((_, i) => (
                    <div 
                      key={`consumer-${i+1}`}
                      className="bg-emerald-600 w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold shadow-lg transform hover:scale-105 transition"
                    >
                      C{i+1}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Legend with updated styling */}
            <div className="flex flex-wrap justify-center gap-6 bg-slate-700 p-4 rounded-xl shadow-lg">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-indigo-600 mr-2 rounded-lg shadow-sm"></div>
                <span className="text-slate-200">Producer</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-emerald-600 mr-2 rounded-lg shadow-sm"></div>
                <span className="text-slate-200">Consumer</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-violet-600 mr-2 rounded-lg shadow-sm"></div>
                <span className="text-slate-200">Buffer Item</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-slate-600 mr-2 rounded-lg shadow-sm"></div>
                <span className="text-slate-200">Empty Slot</span>
              </div>
            </div>
            
            {/* Statistics and logs with updated styling */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Stats */}
              <div className="border-2 border-slate-600 rounded-xl p-5 bg-slate-700 shadow-lg">
                <h3 className="font-bold mb-4 text-cyan-300 text-lg">Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-600">
                    <span className="font-medium text-slate-200">Items Produced:</span>
                    <span className="bg-indigo-900 px-3 py-1 rounded-lg text-indigo-200 font-medium">{stats.produced}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-600">
                    <span className="font-medium text-slate-200">Items Consumed:</span>
                    <span className="bg-emerald-900 px-3 py-1 rounded-lg text-emerald-200 font-medium">{stats.consumed}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-600">
                    <span className="font-medium text-slate-200">Current Buffer Size:</span>
                    <span className="bg-violet-900 px-3 py-1 rounded-lg text-violet-200 font-medium">{queue.length}/{bufferSize}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-600">
                    <span className="font-medium text-slate-200">Buffer Usage:</span>
                    <div className="w-32 bg-slate-800 rounded-full h-5">
                      <div className="bg-cyan-600 h-5 rounded-full" style={{ width: `${(queue.length / bufferSize) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Logs */}
              <div className="border-2 border-slate-600 rounded-xl p-5 bg-slate-700 shadow-lg">
                <h3 className="font-bold mb-4 text-cyan-300 text-lg">Activity Log</h3>
                <div className="h-64 overflow-y-auto flex flex-col pr-2 scrollbar-thin">
                  {logs.length === 0 ? (
                    <p className="text-slate-400 italic">No activity recorded yet</p>
                  ) : (
                    logs.map((log, index) => (
                      <div key={`log-${index}`} className="text-sm py-2 px-3 border-b border-slate-600 last:border-b-0 hover:bg-slate-800 transition-colors rounded">
                        <span className="text-cyan-400 text-xs font-medium">{log.time}</span>: <span className="text-slate-200">{log.message}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default ProducerConsumers;