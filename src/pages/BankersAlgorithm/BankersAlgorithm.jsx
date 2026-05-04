  import React, { useState } from 'react';

  const BankersAlgorithm = () => {
    const [numProcesses, setNumProcesses] = useState('5');
    const [numResources, setNumResources] = useState('3');
    const [available, setAvailable] = useState('');
    const [max, setMax] = useState('');
    const [allocation, setAllocation] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      setError('');
      
      try {
        // Parse input values
        const processes = parseInt(numProcesses);
        const resources = parseInt(numResources);
        
        // Parse available resources
        const availableArray = available.split(',').map(num => parseInt(num.trim()));
        
        // Parse max matrix
        const maxMatrix = parseMatrix(max, processes, resources);
        
        // Parse allocation matrix
        const allocationMatrix = parseMatrix(allocation, processes, resources);
        
        // Validate inputs
        if (availableArray.length !== resources) {
          throw new Error('Available resources must match number of resource types');
        }
        
        if (maxMatrix.length !== processes || maxMatrix[0].length !== resources) {
          throw new Error('Max matrix dimensions must match number of processes and resources');
        }
        
        if (allocationMatrix.length !== processes || allocationMatrix[0].length !== resources) {
          throw new Error('Allocation matrix dimensions must match number of processes and resources');
        }
        
        // Calculate need matrix
        const needMatrix = calculateNeedMatrix(maxMatrix, allocationMatrix);
        
        // Check if system is in safe state
        const { isSafe, safeSequence } = checkSafeState(availableArray, allocationMatrix, needMatrix);
        
        setResult({
          isSafe,
          safeSequence,
          needMatrix,
          available: availableArray,
          max: maxMatrix,
          allocation: allocationMatrix
        });
      } catch (err) {
        setError(err.message);
      }
    };

    const parseMatrix = (input, rows, cols) => {
      const matrix = [];
      const rowsArray = input.split('\n');
      
      for (let i = 0; i < rows; i++) {
        if (i >= rowsArray.length) {
          throw new Error(`Missing row ${i + 1} in matrix`);
        }
        
        const row = rowsArray[i].split(',').map(num => parseInt(num.trim()));
        if (row.length !== cols) {
          throw new Error(`Row ${i + 1} must have ${cols} values`);
        }
        
        matrix.push(row);
      }
      
      return matrix;
    };

    const calculateNeedMatrix = (max, allocation) => {
      return max.map((row, i) => 
        row.map((val, j) => val - allocation[i][j])
      );
    };

    const checkSafeState = (available, allocation, need) => {
      const work = [...available];
      const finish = new Array(allocation.length).fill(false);
      const safeSequence = [];
      
      while (true) {
        let found = false;
        
        for (let i = 0; i < need.length; i++) {
          if (!finish[i] && need[i].every((val, j) => val <= work[j])) {
            // Process can be completed
            for (let j = 0; j < work.length; j++) {
              work[j] += allocation[i][j];
            }
            finish[i] = true;
            safeSequence.push(i);
            found = true;
            break;
          }
        }
        
        if (!found) {
          break;
        }
      }
      
      const isSafe = finish.every(val => val);
      return { isSafe, safeSequence };
    };

    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Banker's Algorithm</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">About Banker's Algorithm</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  A deadlock occurs in an operating system when two or more processes are unable to proceed because each is waiting for resources held by the other. This creates a circular wait condition where no process can make progress. Deadlock avoidance is a technique that ensures the system never enters an unsafe state where deadlock could occur.
                </p>
                <p>
                  Banker's Algorithm is a deadlock avoidance algorithm used in operating systems to ensure that resource allocation
                  doesn't lead to a deadlock state. It works by simulating the allocation of resources to processes and checking
                  if the system remains in a safe state. A safe state is one where there exists at least one sequence of process
                  execution where all processes can complete their execution without getting stuck waiting for resources.
                </p>
                <p>
                  The algorithm uses three main matrices:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><span className="font-medium">Available:</span> Shows the number of available resources of each type</li>
                  <li><span className="font-medium">Max:</span> Shows the maximum demand of each process for each resource type</li>
                  <li><span className="font-medium">Allocation:</span> Shows the number of resources of each type currently allocated to each process</li>
                </ul>
                <p>
                  It then calculates a Need matrix (Max - Allocation) to determine what resources each process still needs.
                  The system is considered safe if there exists a sequence of processes where each process can get its needed
                  resources from the available resources plus those released by previously completed processes.
                </p>
                <p className="font-medium">
                  Key Features of Deadlock Avoidance:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Processes must declare their maximum resource needs in advance</li>
                  <li>System checks if granting a request would lead to an unsafe state</li>
                  <li>Requests are only granted if they maintain system safety</li>
                  <li>If a request would lead to an unsafe state, the process must wait</li>
                </ul>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Processes
                  </label>
                  <input
                    type="number"
                    value={numProcesses}
                    onChange={(e) => setNumProcesses(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Resource Types
                  </label>
                  <input
                    type="number"
                    value={numResources}
                    onChange={(e) => setNumResources(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Resources (comma-separated)
                </label>
                <input
                  type="text"
                  value={available}
                  onChange={(e) => setAvailable(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., 3,3,2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Matrix (one row per line, comma-separated)
                </label>
                <textarea
                  value={max}
                  onChange={(e) => setMax(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={numProcesses}
                  placeholder="e.g., 7,5,3&#10;3,2,2&#10;9,0,2&#10;2,2,2&#10;4,3,3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Allocation Matrix (one row per line, comma-separated)
                </label>
                <textarea
                  value={allocation}
                  onChange={(e) => setAllocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={numProcesses}
                  placeholder="e.g., 0,1,0&#10;2,0,0&#10;3,0,2&#10;2,1,1&#10;0,0,2"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Check Safety
              </button>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}

            {result && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Results</h2>
                <div className="space-y-4">
                  <div className="p-4 rounded-md" style={{ backgroundColor: result.isSafe ? '#d1fae5' : '#fee2e2' }}>
                    <p className="font-medium">
                      System is {result.isSafe ? 'Safe' : 'Unsafe'}
                    </p>
                    {result.isSafe && (
                      <p className="mt-2">
                        Safe Sequence: {result.safeSequence.map(p => `P${p}`).join(' → ')}
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Need Matrix:</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border">
                        <thead>
                          <tr>
                            <th className="border px-4 py-2">Process</th>
                            {Array.from({ length: result.needMatrix[0].length }).map((_, i) => (
                              <th key={i} className="border px-4 py-2">R{i}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {result.needMatrix.map((row, i) => (
                            <tr key={i}>
                              <td className="border px-4 py-2">P{i}</td>
                              {row.map((val, j) => (
                                <td key={j} className="border px-4 py-2">{val}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  export default BankersAlgorithm;
