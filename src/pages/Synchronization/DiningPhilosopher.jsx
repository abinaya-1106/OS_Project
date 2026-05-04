import React, { useState, useEffect } from 'react';
import { Pause, Play, RefreshCw } from 'lucide-react';

// Philosopher states
const THINKING = 'thinking';
const HUNGRY = 'hungry';
const EATING = 'eating';

const DiningPhilosopher = () => {
  const [numPhilosophers] = useState(5);
  const [philosophers, setPhilosophers] = useState([]);
  const [forks, setForks] = useState([]);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [logs, setLogs] = useState([]);

  // Initialize philosophers and forks
  useEffect(() => {
    resetSimulation();
  }, [numPhilosophers]);

  const resetSimulation = () => {
    setRunning(false);
    
    const newPhilosophers = Array(numPhilosophers).fill().map((_, i) => ({
      id: i,
      state: THINKING,
      thinkingTime: Math.floor(Math.random() * 5) + 3,
      eatingTime: Math.floor(Math.random() * 3) + 2,
      timeLeft: Math.floor(Math.random() * 5) + 3,
      cycles: 0,
      totalEatingTime: 0,
      heldForks: []
    }));
    
    const newForks = Array(numPhilosophers).fill().map((_, i) => ({
      id: i,
      inUse: false,
      heldBy: null
    }));
    
    setPhilosophers(newPhilosophers);
    setForks(newForks);
    setLogs([{ message: "Simulation initialized", time: new Date().toLocaleTimeString() }]);
  };

  // Main simulation loop
  useEffect(() => {
    if (!running) return;
    
    const timer = setInterval(() => {
      setPhilosophers(currentPhilosophers => {
        const newPhilosophers = [...currentPhilosophers];
        
        newPhilosophers.forEach((philosopher, index) => {
          // Decrement time left
          philosopher.timeLeft = Math.max(0, philosopher.timeLeft - 1);
          
          // Handle state transitions
          if (philosopher.timeLeft === 0) {
            if (philosopher.state === THINKING) {
              // Philosopher becomes hungry
              philosopher.state = HUNGRY;
              philosopher.timeLeft = 999; // Will wait until gets forks
              addLog(`Philosopher ${index} is hungry and waiting for forks`);
            } else if (philosopher.state === EATING) {
              // Philosopher finishes eating and returns to thinking
              philosopher.state = THINKING;
              philosopher.timeLeft = philosopher.thinkingTime;
              philosopher.cycles += 1;
              philosopher.totalEatingTime += philosopher.eatingTime;
              
              // Release forks
              setForks(currentForks => {
                const newForks = [...currentForks];
                
                philosopher.heldForks.forEach(forkId => {
                  newForks[forkId].inUse = false;
                  newForks[forkId].heldBy = null;
                });
                
                addLog(`Philosopher ${index} finished eating and released forks ${philosopher.heldForks.join(' and ')}`);
                philosopher.heldForks = [];
                return newForks;
              });
            }
          }
        });
        
        // Try to allocate forks to hungry philosophers
        newPhilosophers.forEach((philosopher, index) => {
          if (philosopher.state === HUNGRY) {
            tryToEat(index);
          }
        });
        
        return newPhilosophers;
      });
    }, 1000 / speed);
    
    return () => clearInterval(timer);
  }, [running, speed, numPhilosophers]);

  const tryToEat = (philosopherId) => {
    // Philosopher i takes fork i and (i+1)%numPhilosophers
    const leftFork = (numPhilosophers+philosopherId-1)% numPhilosophers;
    const rightFork = philosopherId;
    
    setForks(currentForks => {
      // Check if both forks are available
      if (!currentForks[leftFork].inUse && !currentForks[rightFork].inUse) {
        const newForks = [...currentForks];
        
        // Acquire both forks at the same time
        newForks[leftFork].inUse = true;
        newForks[leftFork].heldBy = philosopherId;
        newForks[rightFork].inUse = true;
        newForks[rightFork].heldBy = philosopherId;
        
        // Update philosopher state to eating
        setPhilosophers(currentPhilosophers => {
          const newPhilosophers = [...currentPhilosophers];
          const philosopher = newPhilosophers[philosopherId];
          philosopher.state = EATING;
          philosopher.timeLeft = philosopher.eatingTime;
          philosopher.heldForks = [leftFork, rightFork];
          return newPhilosophers;
        });
        
        addLog(`Philosopher ${philosopherId} acquired forks ${leftFork} and ${rightFork} and is eating`);
        return newForks;
      }
      return currentForks;
    });
  };

  const addLog = (message) => {
    setLogs(currentLogs => {
      const newLogs = [
        { message, time: new Date().toLocaleTimeString() },
        ...currentLogs
      ].slice(0, 10);
      return newLogs;
    });
  };

  // Helper function to calculate positions
  const getPosition = (index, total, radius, type) => {
    const angle = (index * 2 * Math.PI / total) - Math.PI / 2;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    
    if (type === 'philosopher') {
      return { x: 50 + x, y: 50 + y };
    } else if (type === 'fork') {
      // Position forks between philosophers
      const nextAngle = ((index + 0.5) * 2 * Math.PI / total) - Math.PI / 2;
      const nextX = (radius - 5) * Math.cos(nextAngle);
      const nextY = (radius - 5) * Math.sin(nextAngle);
      return { x: 50 + nextX, y: 50 + nextY };
    }
  };

  // Get state color based on state (updated color theme)
  const getStateColor = (state) => {
    switch(state) {
      case THINKING: return 'bg-indigo-600';
      case HUNGRY: return 'bg-amber-500';
      case EATING: return 'bg-emerald-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 to-indigo-50 p-8 font-sans">
      <div className="w-full max-w-4xl mx-auto p-6 rounded-xl bg-white shadow-xl">
        <div className="flex flex-col items-center space-y-8">
          {/* Header with updated styling */}
          <div className="w-full text-center mb-4">
            <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-indigo-700 to-cyan-600 text-transparent bg-clip-text pb-2">
              Dining Philosophers Simulation
            </h1>
            <div className="h-1 w-48 mx-auto bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-full"></div>
          </div>
          
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            <button 
              onClick={() => setRunning(!running)} 
              className={`flex items-center px-6 py-3 ${running ? 'bg-amber-500' : 'bg-cyan-600'} text-white rounded-lg hover:opacity-90 transition-all shadow-md font-medium`}
            >
              {running ? <><Pause size={16} className="mr-2" /> Pause</> : <><Play size={16} className="mr-2" /> Start</>}
            </button>
            
            <button 
              onClick={resetSimulation} 
              className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:opacity-90 transition-all shadow-md font-medium"
            >
              <RefreshCw size={16} className="mr-2" /> Reset
            </button>
            
            <div className="flex items-center space-x-3">
              <span className="font-medium text-gray-700">Speed:</span>
              <input 
                type="range" 
                min="0.5" 
                max="3" 
                step="0.5" 
                value={speed} 
                onChange={(e) => setSpeed(parseFloat(e.target.value))} 
                className="w-32 accent-indigo-600"
              />
              <span className="font-medium text-indigo-700">{speed}x</span>
            </div>
          </div>
          
          {/* Visualization with updated styling */}
          <div className="relative w-96 h-96 border-4 border-indigo-200 rounded-full shadow-xl bg-gradient-to-br from-slate-50 to-indigo-50">
            {/* Table */}
            <div className="absolute inset-0 m-auto w-40 h-40 bg-gradient-to-r from-amber-100 to-amber-200 rounded-full flex items-center justify-center shadow-inner">
              <span className="text-sm text-amber-800 font-bold">TABLE</span>
            </div>
            
            {/* Philosophers */}
            {philosophers.map((philosopher, index) => {
              const pos = getPosition(index, numPhilosophers, 35, 'philosopher');
              return (
                <div 
                  key={`philosopher-${index}`}
                  className={`absolute w-16 h-16 rounded-full ${getStateColor(philosopher.state)} flex items-center justify-center text-white font-bold -ml-8 -mt-8 border-2 border-white shadow-lg transition-all duration-300`}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-xl">{index}</span>
                  </div>
                  
                  {philosopher.state === EATING && (
                    <div className="absolute -top-6 text-xs bg-black text-white px-2 py-1 rounded-full">
                      {philosopher.timeLeft}s
                    </div>
                  )}
                </div>
              );
            })}
            
            {/* Forks */}
            {forks.map((fork, index) => {
              const pos = getPosition(index, numPhilosophers, 22, 'fork');
              const rotation = 45 + (index * (360/numPhilosophers));
              return (
                <div 
                  key={`fork-${index}`}
                  className={`absolute w-8 h-2 bg-gray-800 -ml-4 -mt-1 rounded-full transition-opacity duration-300 ${fork.inUse ? 'opacity-40' : 'opacity-90'}`}
                  style={{ 
                    left: `${pos.x}%`, 
                    top: `${pos.y}%`,
                    transform: `rotate(${rotation}deg)`
                  }}
                >
                  <span className="absolute -ml-1 -mt-4 text-xs text-gray-700 font-bold">{index}</span>
                </div>
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-8 bg-white p-4 rounded-lg shadow-md border border-indigo-100">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-indigo-600 mr-2 rounded-full shadow-sm"></div>
              <span className="font-medium">Thinking</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-amber-500 mr-2 rounded-full shadow-sm"></div>
              <span className="font-medium">Hungry</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-emerald-500 mr-2 rounded-full shadow-sm"></div>
              <span className="font-medium">Eating</span>
            </div>
          </div>
          
          {/* Statistics and logs */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Philosopher stats */}
            <div className="border border-indigo-200 rounded-lg p-5 bg-white shadow-md">
              <h3 className="font-bold mb-3 text-indigo-700 text-lg border-b pb-2 border-indigo-100">Philosopher Statistics</h3>
              <div className="space-y-3">
                {philosophers.map((philosopher, index) => (
                  <div key={`stats-${index}`} className="flex justify-between items-center py-2 border-b border-indigo-50 last:border-b-0">
                    <span className="font-medium">Philosopher {index}:</span>
                    <span className="bg-indigo-50 px-3 py-1 rounded-lg font-medium text-indigo-700">{philosopher.cycles} cycles completed</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Logs */}
            <div className="border border-cyan-200 rounded-lg p-5 bg-white shadow-md">
              <h3 className="font-bold mb-3 text-cyan-700 text-lg border-b pb-2 border-cyan-100">Activity Log</h3>
              <div className="h-64 overflow-y-auto flex flex-col">
                {logs.length === 0 ? (
                  <p className="text-gray-500 italic">No activity recorded yet</p>
                ) : (
                  logs.map((log, index) => (
                    <div key={`log-${index}`} className="text-sm py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-cyan-600 text-xs font-medium">{log.time}</span>: {log.message}
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

export default DiningPhilosopher;