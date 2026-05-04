import React, { useState, useEffect } from "react";

export default function ContiguousMemoryAllocation() {
  const [algorithm, setAlgorithm] = useState("first-fit");
  const [memoryBlocks, setMemoryBlocks] = useState("100, 500, 200, 300, 600");
  const [processes, setProcesses] = useState("212, 417, 112, 426");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [nextFitPointer, setNextFitPointer] = useState(0);

  const algorithmDescriptions = {
    "first-fit":
      "Allocates each process to the first memory block that is large enough to accommodate it.",
    "best-fit":
      "Allocates each process to the smallest memory block that can fit the process.",
    "worst-fit":
      "Allocates each process to the largest memory block available.",
    "next-fit":
      "Similar to First-fit, but starts searching from the position of the last allocation.",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    try {
      // Parse input values
      const blockSizes = memoryBlocks
        .split(",")
        .map((size) => parseInt(size.trim()));
      const processSizes = processes
        .split(",")
        .map((size) => parseInt(size.trim()));

      // Validate inputs
      if (blockSizes.some(isNaN) || blockSizes.some((size) => size <= 0)) {
        setError("Please enter valid memory block sizes (positive integers)");
        return;
      }

      if (processSizes.some(isNaN) || processSizes.some((size) => size <= 0)) {
        setError("Please enter valid process sizes (positive integers)");
        return;
      }

      // Execute the selected allocation algorithm
      let allocationResult;
      switch (algorithm) {
        case "first-fit":
          allocationResult = firstFit(blockSizes, processSizes);
          break;
        case "best-fit":
          allocationResult = bestFit(blockSizes, processSizes);
          break;
        case "worst-fit":
          allocationResult = worstFit(blockSizes, processSizes);
          break;
        case "next-fit":
          allocationResult = nextFit(blockSizes, processSizes);
          break;
        default:
          setError("Invalid algorithm selected");
          return;
      }

      setResult(allocationResult);
    } catch (err) {
      setError("An error occurred: " + err.message);
    }
  };

  const firstFit = (blockSizes, processSizes) => {
    const allocation = new Array(processSizes.length).fill(-1);
    const remainingSpace = [...blockSizes];
    const fragmentation = new Array(blockSizes.length).fill(0);

    // For each process, find the first suitable block
    for (let i = 0; i < processSizes.length; i++) {
      for (let j = 0; j < blockSizes.length; j++) {
        if (remainingSpace[j] >= processSizes[i]) {
          // Allocate this block
          allocation[i] = j;
          remainingSpace[j] -= processSizes[i];
          fragmentation[j] = remainingSpace[j];
          break;
        }
      }
    }

    return {
      allocation,
      blockSizes,
      processSizes,
      remainingSpace,
      fragmentation,
      unallocated: allocation.filter((a) => a === -1).length,
    };
  };

  const bestFit = (blockSizes, processSizes) => {
    const allocation = new Array(processSizes.length).fill(-1);
    const remainingSpace = [...blockSizes];
    const fragmentation = new Array(blockSizes.length).fill(0);

    // For each process, find the best fitting block
    for (let i = 0; i < processSizes.length; i++) {
      let bestBlockIndex = -1;

      for (let j = 0; j < blockSizes.length; j++) {
        if (remainingSpace[j] >= processSizes[i]) {
          if (
            bestBlockIndex === -1 ||
            remainingSpace[j] < remainingSpace[bestBlockIndex]
          ) {
            bestBlockIndex = j;
          }
        }
      }

      if (bestBlockIndex !== -1) {
        allocation[i] = bestBlockIndex;
        remainingSpace[bestBlockIndex] -= processSizes[i];
        fragmentation[bestBlockIndex] = remainingSpace[bestBlockIndex];
      }
    }

    return {
      allocation,
      blockSizes,
      processSizes,
      remainingSpace,
      fragmentation,
      unallocated: allocation.filter((a) => a === -1).length,
    };
  };

  const worstFit = (blockSizes, processSizes) => {
    const allocation = new Array(processSizes.length).fill(-1);
    const remainingSpace = [...blockSizes];
    const fragmentation = new Array(blockSizes.length).fill(0);

    // For each process, find the worst fitting block (largest)
    for (let i = 0; i < processSizes.length; i++) {
      let worstBlockIndex = -1;

      for (let j = 0; j < blockSizes.length; j++) {
        if (remainingSpace[j] >= processSizes[i]) {
          if (
            worstBlockIndex === -1 ||
            remainingSpace[j] > remainingSpace[worstBlockIndex]
          ) {
            worstBlockIndex = j;
          }
        }
      }

      if (worstBlockIndex !== -1) {
        allocation[i] = worstBlockIndex;
        remainingSpace[worstBlockIndex] -= processSizes[i];
        fragmentation[worstBlockIndex] = remainingSpace[worstBlockIndex];
      }
    }

    return {
      allocation,
      blockSizes,
      processSizes,
      remainingSpace,
      fragmentation,
      unallocated: allocation.filter((a) => a === -1).length,
    };
  };

  const nextFit = (blockSizes, processSizes) => {
	const allocation = new Array(processSizes.length).fill(-1);
	const remainingSpace = [...blockSizes];
	const fragmentation = new Array(blockSizes.length).fill(0);
	
	// If nextFitPointer is outside valid range, reset to 0
	// This handles the case when block sizes change between allocations
	let lastAllocated = 0;
  
	// For each process, find the next suitable block
	for (let i = 0; i < processSizes.length; i++) {
	  let j = lastAllocated;
	  let startingPoint = j;
	  let allocated = false;
  
	  do {
		if (remainingSpace[j] >= processSizes[i]) {
		  allocation[i] = j;
		  remainingSpace[j] -= processSizes[i];
		  fragmentation[j] = remainingSpace[j];
		  lastAllocated = j;
		  allocated = true;
		  break;
		}
  
		// Move to the next block, wrapping around if needed
		j = (j + 1) % blockSizes.length;
	  } while (j !== startingPoint);
  
	  // If we couldn't allocate after checking all blocks
	  if (!allocated) {
		allocation[i] = -1; // Process couldn't be allocated
	  }
	}
  
	// Update the next fit pointer for future allocations
	setNextFitPointer(lastAllocated);
  
	return {
	  allocation,
	  blockSizes,
	  processSizes,
	  remainingSpace,
	  fragmentation,
	  unallocated: allocation.filter((a) => a === -1).length,
	};
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Contiguous Memory Allocation Simulator
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Algorithm
              </label>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="first-fit">First-Fit</option>
                <option value="best-fit">Best-Fit</option>
                <option value="worst-fit">Worst-Fit</option>
                <option value="next-fit">Next-Fit</option>
              </select>
              <p className="mt-2 text-sm text-gray-600">
                {algorithmDescriptions[algorithm]}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Memory Block Sizes (comma-separated)
              </label>
              <input
                type="text"
                value={memoryBlocks}
                onChange={(e) => setMemoryBlocks(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., 100, 500, 200, 300, 600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Process Sizes (comma-separated)
              </label>
              <input
                type="text"
                value={processes}
                onChange={(e) => setProcesses(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., 212, 417, 112, 426"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Allocate Memory
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Allocation Results</h2>

              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr>
                      <th className="border p-2">Process</th>
                      <th className="border p-2">Size</th>
                      <th className="border p-2">Allocated Block</th>
                      <th className="border p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.processSizes.map((size, index) => (
                      <tr
                        key={index}
                        className={
                          result.allocation[index] === -1
                            ? "bg-red-50"
                            : "bg-green-50"
                        }
                      >
                        <td className="border p-2">P{index}</td>
                        <td className="border p-2">{size}</td>
                        <td className="border p-2">
                          {result.allocation[index] !== -1
                            ? `Block ${result.allocation[index]}`
                            : "Not Allocated"}
                        </td>
                        <td className="border p-2">
                          {result.allocation[index] !== -1
                            ? "Allocated"
                            : "Waiting"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">
                  Memory Blocks Status
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr>
                        <th className="border p-2">Block</th>
                        <th className="border p-2">Original Size</th>
                        <th className="border p-2">Remaining Space</th>
                        <th className="border p-2">Internal Fragmentation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.blockSizes.map((size, index) => (
                        <tr key={index}>
                          <td className="border p-2">Block {index}</td>
                          <td className="border p-2">{size}</td>
                          <td className="border p-2">
                            {result.remainingSpace[index]}
                          </td>
                          <td className="border p-2">
                            {result.fragmentation[index]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Summary</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Total Processes: {result.processSizes.length}</li>
                  <li>
                    Successfully Allocated:{" "}
                    {result.processSizes.length - result.unallocated}
                  </li>
                  <li>Failed to Allocate: {result.unallocated}</li>
                  <li>
                    Total Internal Fragmentation:{" "}
                    {result.fragmentation.reduce((sum, val) => sum + val, 0)}
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">
                  Memory Visualization
                </h3>
                <div className="flex flex-row gap-2 overflow-x-auto py-4">
                  {result.blockSizes.map((size, blockIndex) => {
                    // Find processes allocated to this block
                    const allocatedProcesses = result.allocation
                      .map((block, procIndex) =>
                        block === blockIndex ? procIndex : -1
                      )
                      .filter((proc) => proc !== -1);

                    const totalAllocated = allocatedProcesses.reduce(
                      (sum, procIndex) => sum + result.processSizes[procIndex],
                      0
                    );

                    const blockWidth = Math.max(
                      80,
                      (size / Math.max(...result.blockSizes)) * 200
                    );

                    return (
                      <div
                        key={blockIndex}
                        className="flex-shrink-0 relative border border-gray-400 rounded"
                        style={{ width: `${blockWidth}px`, height: "180px" }}
                      >
                        {/* Block header */}
                        <div className="absolute top-0 left-0 w-full text-xs text-center bg-gray-200 p-1 border-b border-gray-400 h-[1/10]">
                          Block {blockIndex} ({size})
                        </div>

                        {/* Block content - allocated processes */}
                        <div className="absolute top-5 left-0 w-full bottom-0 flex flex-col h-[9/10]">
                          {allocatedProcesses.map((procIndex, idx) => {
                            const procSize = result.processSizes[procIndex];
                            const height = (procSize / size) * 100;

                            return (
                              <div
                                key={procIndex}
                                className="w-full bg-green-500 text-white text-center flex items-center justify-center border-b border-gray-100"
                                style={{ height: `${height}%` }}
                              >
                                <span className="text-xs">
                                  P{procIndex} ({procSize})
                                </span>
                              </div>
                            );
                          })}

                          {/* Fragmentation space */}
                          {result.fragmentation[blockIndex] > 0 && (
                            <div
                              className="w-full bg-gray-400 text-white text-center flex items-center justify-center"
                              style={{
                                height: `${
                                  (result.fragmentation[blockIndex] / size) *
                                  100
                                }%`,
                              }}
                            >
                              <span className="text-xs">
                                Free ({result.fragmentation[blockIndex]})
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
