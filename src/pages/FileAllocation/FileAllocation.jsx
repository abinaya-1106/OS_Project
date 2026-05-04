import React, { useState, useEffect } from "react";

export default function FileAllocation() {
  const [algorithm, setAlgorithm] = useState("sequential");
  const [diskSize, setDiskSize] = useState(1000);
  const [blockSize, setBlockSize] = useState(100);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [files, setFiles] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [error, setError] = useState("");
  const [emptyBlocks, setEmptyBlocks] = useState(0);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [nextFileId, setNextFileId] = useState(0); // Unique counter for file IDs
  const [indexes, setIndexes] = useState({});

  const algorithmDescriptions = {
    "sequential": "Allocates contiguous blocks for each file. Simple but can lead to external fragmentation.",
    "linked": "Allocates blocks anywhere on disk and links them together. No external fragmentation but requires extra space for links.",
    "indexed": "Uses an index block to store pointers to all blocks of a file. Good for random access but requires an extra block for the index.",
    "inode": "Uses an inode structure to store file metadata and block pointers. Supports direct, indirect, and double indirect blocks.",
  };

  useEffect(() => {
    initializeBlocks();
  }, [diskSize, blockSize]);

  const initializeBlocks = () => {
    const totalBlocks = Math.floor(diskSize / blockSize);
    setBlocks(Array(totalBlocks).fill().map(() => ({ 
      allocated: false, 
      fileId: null, 
      next: null 
    })));
    setEmptyBlocks(totalBlocks);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    try {
      const size = parseInt(fileSize);
      if (isNaN(size) || size <= 0) {
        setError("Please enter a valid file size");
        return;
      }

      if (!fileName.trim()) {
        setError("Please enter a file name");
        return;
      }

      const requiredBlocks = Math.ceil(size / blockSize);
      
      if (requiredBlocks > emptyBlocks) {
        setError("Not enough space available");
        return;
      }

      let allocation;
      switch (algorithm) {
        case "sequential":
          allocation = allocateSequential(requiredBlocks);
          break;
        case "linked":
          allocation = allocateLinked(requiredBlocks);
          break;
        case "indexed":
          allocation = allocateIndexed(requiredBlocks);
          break;
        case "inode":
          allocation = allocateInode(requiredBlocks);
          break;
        default:
          setError("Invalid algorithm selected");
          return;
      }

      if (!allocation.success) {
        setError(allocation.error);
        return;
      }

      const fileId = nextFileId;
      const fileColor = getRandomColor();
      
      const newFile = {
        id: fileId,
        name: fileName,
        size: size,
        blocks: allocation.blocks,
        color: fileColor,
        type: algorithm,
        indexBlock: allocation.indexBlock,
        indirectBlocks: allocation.indirectBlocks,
        indirectData: allocation.indirectData || []
      };

      // Update the nextFileId counter
      setNextFileId(nextFileId + 1);
      
      // Update files state
      setFiles(prevFiles => [...prevFiles, newFile]);
      setFileName("");
      setFileSize("");
      setEmptyBlocks(prev => prev - requiredBlocks - (allocation.indexBlock !== undefined ? 1 : 0) 
        - (allocation.indirectBlocks?.single ? 1 : 0)
        - (allocation.indirectBlocks?.double ? 1 : 0));
      
      // Update blocks state
      setBlocks(prevBlocks => {
        const newBlocks = [...prevBlocks];
        allocation.blocks.forEach((blockIndex, i) => {
          newBlocks[blockIndex] = {
            ...newBlocks[blockIndex],
            allocated: true,
            fileId: fileId,
            next: algorithm === "linked" ? (i < allocation.blocks.length - 1 ? allocation.blocks[i + 1] : null) : null
          };
        });

        if (allocation.indexBlock !== undefined) {
          newBlocks[allocation.indexBlock] = {
            allocated: true,
            fileId: fileId,
            isIndex: true
          };
        }

        if (allocation.indirectBlocks?.single) {
          newBlocks[allocation.indirectBlocks.single] = {
            allocated: true,
            fileId: fileId,
            isInodeIndirect: true
          };
        }

        if (allocation.indirectBlocks?.double) {
          newBlocks[allocation.indirectBlocks.double] = {
            allocated: true,
            fileId: fileId,
            isInodeIndirect: true,
            isDoubleIndirect: true
          };
        }

        return newBlocks;
      });

      setIndexes(prev => ({
        ...prev,
        [fileId]: allocation.blocks
      }));
    } catch (err) {
      setError("An error occurred: " + err.message);
    }
  };

  const allocateSequential = (requiredBlocks) => {
    let startBlock = -1;
    let consecutiveBlocks = 0;

    for (let i = 0; i < blocks.length; i++) {
      if (!blocks[i].allocated) {
        if (startBlock === -1) startBlock = i;
        consecutiveBlocks++;
        
        if (consecutiveBlocks === requiredBlocks) {
          return {
            success: true,
            blocks: Array.from({ length: requiredBlocks }, (_, index) => startBlock + index)
          };
        }
      } else {
        startBlock = -1;
        consecutiveBlocks = 0;
      }
    }

    return {
      success: false,
      error: "Not enough contiguous space available"
    };
  };

  const allocateLinked = (requiredBlocks) => {
    const allocatedBlocks = [];
    
    for (let i = 0; i < blocks.length && allocatedBlocks.length < requiredBlocks; i++) {
      if (!blocks[i].allocated) {
        allocatedBlocks.push(i);
      }
    }

    if (allocatedBlocks.length < requiredBlocks) {
      return {
        success: false,
        error: "Not enough blocks available"
      };
    }

    return {
      success: true,
      blocks: allocatedBlocks
    };
  };

  const allocateIndexed = (requiredBlocks) => {
    // First, find a block for the index
    let indexBlock = blocks.findIndex(block => !block.allocated);
    if (indexBlock === -1) {
      return {
        success: false,
        error: "No space available for index block"
      };
    }

    const dataBlocks = [];
    let count = 0;
    
    // Then find blocks for the actual data (skipping the index block)
    for (let i = 0; i < blocks.length && count < requiredBlocks; i++) {
      if (!blocks[i].allocated && i !== indexBlock) {
        dataBlocks.push(i);
        count++;
      }
    }

    if (dataBlocks.length < requiredBlocks) {
      return {
        success: false,
        error: "Not enough blocks available for file data"
      };
    }

    return {
      success: true,
      blocks: dataBlocks,
      indexBlock: indexBlock
    };
  };

  const allocateInode = (requiredBlocks) => {
    const DIRECT_BLOCKS = 12;
    const INDIRECT_BLOCKS = Math.floor(blockSize / 4); // Assuming 4 bytes per pointer
    
    let allocation = {
      blocks: [],
      indirectBlocks: {
        single: null,
        double: null
      }
    };

    // First try to allocate direct blocks
    const directBlocksNeeded = Math.min(requiredBlocks, DIRECT_BLOCKS);
    for (let i = 0; i < blocks.length && allocation.blocks.length < directBlocksNeeded; i++) {
      if (!blocks[i].allocated) {
        allocation.blocks.push(i);
      }
    }

    // If we need more blocks, use indirect blocks
    if (requiredBlocks > DIRECT_BLOCKS) {
      // Find a block for single indirect pointer
      const singleIndirect = blocks.findIndex((block, idx) => 
        !block.allocated && !allocation.blocks.includes(idx)
      );
      
      if (singleIndirect === -1) {
        return {
          success: false,
          error: "No space for indirect block"
        };
      }
      allocation.indirectBlocks.single = singleIndirect;

      // Find blocks for the remaining data
      const remainingBlocks = requiredBlocks - DIRECT_BLOCKS;
      const indirectDataBlocks = [];
      
      for (let i = 0; i < blocks.length && indirectDataBlocks.length < remainingBlocks; i++) {
        if (!blocks[i].allocated && 
            i !== singleIndirect && 
            !allocation.blocks.includes(i)) {
          indirectDataBlocks.push(i);
        }
      }
      
      // Add the indirect data blocks to the overall blocks list
      allocation.blocks = [...allocation.blocks, ...indirectDataBlocks];
      
      // Store the indirect data blocks separately for visualization
      allocation.indirectData = indirectDataBlocks;
    }

    if (allocation.blocks.length < requiredBlocks) {
      return {
        success: false,
        error: "Not enough blocks available"
      };
    }

    return {
      success: true,
      blocks: allocation.blocks,
      indirectBlocks: allocation.indirectBlocks,
      indirectData: allocation.indirectData || []
    };
  };

  const deleteFile = (fileId) => {
    const fileIndex = files.findIndex(f => f.id === fileId);
    if (fileIndex === -1) return;
    
    const fileToDelete = files[fileIndex];

    // Create a clone of the blocks array
    const newBlocks = [...blocks];
    
    // Free the blocks used by the file
    fileToDelete.blocks.forEach(blockIndex => {
      newBlocks[blockIndex] = {
        allocated: false,
        fileId: null,
        next: null,
        isIndex: false,
        isInodeIndirect: false
      };
    });

    // Free the index block if it exists
    if (fileToDelete.indexBlock !== undefined) {
      newBlocks[fileToDelete.indexBlock] = {
        allocated: false,
        fileId: null,
        next: null,
        isIndex: false,
        isInodeIndirect: false
      };
    }

    // Free indirect blocks if they exist
    if (fileToDelete.indirectBlocks) {
      if (fileToDelete.indirectBlocks.single) {
        newBlocks[fileToDelete.indirectBlocks.single] = {
          allocated: false,
          fileId: null,
          next: null,
          isIndex: false,
          isInodeIndirect: false
        };
      }
      if (fileToDelete.indirectBlocks.double) {
        newBlocks[fileToDelete.indirectBlocks.double] = {
          allocated: false,
          fileId: null,
          next: null,
          isIndex: false,
          isInodeIndirect: false
        };
      }
    }

    // Update blocks state
    setBlocks(newBlocks);
    
    // Update files state
    const newFiles = files.filter(f => f.id !== fileId);
    setFiles(newFiles);
    
    // Update empty blocks count
    const blocksFreed = fileToDelete.blocks.length + 
      (fileToDelete.indexBlock !== undefined ? 1 : 0) +
      (fileToDelete.indirectBlocks?.single ? 1 : 0) +
      (fileToDelete.indirectBlocks?.double ? 1 : 0);
    
    setEmptyBlocks(prev => prev + blocksFreed);
    
    // Clear selection if we deleted the selected file
    if (selectedFileId === fileId) {
      setSelectedFileId(null);
    }
    
    // Clean up the indexes
    setIndexes(prev => {
      const newIndexes = {...prev};
      delete newIndexes[fileId];
      return newIndexes;
    });
  };

  const viewFileBlocks = (fileId) => {
    setSelectedFileId(fileId === selectedFileId ? null : fileId);
  };

  const getRandomColor = () => {
    // Generate a random color that's not already in use
    const letters = '0123456789ABCDEF';
    let color;
    
    do {
      color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      // Make sure this color isn't already in use by another file
    } while (files.some(file => file.color === color));
    
    return color;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          File Allocation Simulator
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
                <option value="sequential">Sequential Allocation</option>
                <option value="linked">Linked Allocation</option>
                <option value="indexed">Indexed Allocation</option>
                <option value="inode">Inode Allocation</option>
              </select>
              <p className="mt-2 text-sm text-gray-600">
                {algorithmDescriptions[algorithm]}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Disk Size (bytes)
                </label>
                <input
                  type="number"
                  value={diskSize}
                  onChange={(e) => setDiskSize(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Block Size (bytes)
                </label>
                <input
                  type="number"
                  value={blockSize}
                  onChange={(e) => setBlockSize(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  min="1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  File Name
                </label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter file name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  File Size (bytes)
                </label>
                <input
                  type="number"
                  value={fileSize}
                  onChange={(e) => setFileSize(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter file size"
                  min="1"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Allocate File
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div className="flex-container mt-8">
            {/* File Directory */}
            <div className="w-1/2 pr-4">
              <h2 className="text-xl font-semibold mb-4">File Directory</h2>
              <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="border p-2">File Name</th>
                      <th className="border p-2">Size (bytes)</th>
                      <th className="border p-2">Blocks</th>
                      <th className="border p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((file) => (
                      <tr key={file.id} className={selectedFileId === file.id ? "bg-blue-50" : ""}>
                        <td className="border p-2">{file.name}</td>
                        <td className="border p-2">{file.size}</td>
                        <td className="border p-2">{file.blocks.length}</td>
                        <td className="border p-2">
                          <button
                            onClick={() => viewFileBlocks(file.id)}
                            className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors mr-2"
                          >
                            View
                          </button>
                          <button
                            onClick={() => deleteFile(file.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Block Details */}
            <div className="w-1/2 pl-4">
              <h2 className="text-xl font-semibold mb-4">Block Details</h2>
              <div className="border rounded-lg p-4">
                {selectedFileId !== null ? (
                  <div>
                    {files.find(f => f.id === selectedFileId) ? (
                      <>
                        <h3 className="font-medium mb-2">
                          {files.find(f => f.id === selectedFileId)?.name}
                        </h3>
                        <div className="space-y-2">
                          {algorithm === "indexed" && files.find(f => f.id === selectedFileId)?.indexBlock !== undefined && (
                            <div>
                              <div className="font-medium">Index Block:</div>
                              <div className="flex items-center space-x-2">
                                <div
                                  className="w-12 h-12 rounded-md flex items-center justify-center text-sm text-white font-bold"
                                  style={{ backgroundColor: files.find(f => f.id === selectedFileId)?.color }}
                                >
                                  {files.find(f => f.id === selectedFileId)?.indexBlock}
                                </div>
                              </div>
                            </div>
                          )}
                          <div>
                            <div className="font-medium">Data Blocks:</div>
                            <div className="flex flex-wrap gap-2">
                              {indexes[selectedFileId]?.map((blockIndex, i) => (
                                <div
                                  key={`${selectedFileId}-${blockIndex}-${i}`}
                                  className="w-12 h-12 rounded-md flex items-center justify-center text-sm text-white"
                                  style={{ backgroundColor: files.find(f => f.id === selectedFileId)?.color }}
                                >
                                  {blockIndex}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-gray-500 text-center">
                        Selected file no longer exists
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-gray-500 text-center">
                    Select a file to view its block details
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Disk Blocks Visualization</h2>
            <div className="border rounded-lg p-4">
              <div className="flex flex-wrap gap-2">
                {blocks.map((block, index) => {
                  const file = files.find(f => f.id === block.fileId);
                  return (
                    <div
                      key={index}
                      className={`w-12 h-12 rounded-md flex items-center justify-center text-sm ${
                        block.allocated
                          ? "text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                      style={{
                        backgroundColor: block.allocated && file
                          ? file.color
                          : undefined,
                        border: block.isIndex 
                          ? "2px dashed white" 
                          : block.isInodeIndirect 
                            ? "2px dotted yellow" 
                            : undefined
                      }}
                    >
                      {index}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {algorithm === "linked" && files.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Linked List Visualization</h2>
              <div className="space-y-4">
                {files.map((file) => (
                  <div key={file.id} className="flex items-center space-x-2">
                    {file.blocks.map((blockIndex, i) => (
                      <React.Fragment key={`link-${file.id}-${blockIndex}-${i}`}>
                        <div
                          className="w-12 h-12 rounded-md flex items-center justify-center text-sm text-white"
                          style={{ backgroundColor: file.color }}
                        >
                          {blockIndex}
                        </div>
                        {i < file.blocks.length - 1 && (
                          <div className="text-xl">→</div>
                        )}
                      </React.Fragment>
                    ))}
                    <div className="ml-2 text-sm text-gray-600">
                      {file.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {algorithm === "indexed" && files.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Index Block Visualization</h2>
              <div className="space-y-6">
                {files.map((file) => (
                  <div key={file.id} className="space-y-2">
                    <div className="text-sm font-medium">{file.name} ({file.size} bytes - {Math.ceil(file.size/blockSize)} blocks)</div>
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-16 h-16 rounded-md flex items-center justify-center text-sm text-white font-bold"
                        style={{ backgroundColor: file.color, border: "2px dashed white" }}
                      >
                        Index
                        <br />
                        {file.indexBlock}
                      </div>
                      <div className="text-xl">→</div>
                      <div className="flex flex-wrap gap-2">
                        {file.blocks.map((blockIndex, i) => (
                          <div
                            key={`idx-${file.id}-${blockIndex}-${i}`}
                            className="w-12 h-12 rounded-md flex items-center justify-center text-sm text-white"
                            style={{ backgroundColor: file.color }}
                          >
                            {blockIndex}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {algorithm === "inode" && files.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Inode Block Visualization</h2>
              <div className="space-y-8">
                {files.map((file) => {
                  // Split blocks into direct and indirect
                  const DIRECT_BLOCKS = 12;
                  const directBlocks = file.blocks.slice(0, Math.min(DIRECT_BLOCKS, file.blocks.length));
                  const hasIndirect = file.indirectBlocks?.single !== null && file.blocks.length > DIRECT_BLOCKS;
                  
                  return (
                    <div key={file.id} className="space-y-3 border-b pb-6">
                      <div className="text-sm font-medium">{file.name} ({file.size} bytes - {Math.ceil(file.size/blockSize)} blocks)</div>
                      
                      {/* Inode Structure */}
                      <div className="flex items-start space-x-4">
                        <div 
                          className="w-28 rounded-md p-2 text-sm text-white font-medium"
                          style={{ backgroundColor: file.color }}
                        >
                          <div className="text-center border-b pb-1 mb-2">Inode</div>
                          <div className="space-y-1">
                            <div>Direct Blocks:</div>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {directBlocks.map((block, i) => (
                                <div key={i} className="text-xs bg-white bg-opacity-20 px-1 rounded">
                                  {block}
                                </div>
                              ))}
                            </div>
                            
                            {hasIndirect && (
                              <div>
                                <div>Indirect: {file.indirectBlocks.single}</div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Direct Blocks */}
                        <div className="flex-1">
                          <div className="text-xs font-medium mb-1">Direct Blocks:</div>
                          <div className="flex flex-wrap gap-2">
                            {directBlocks.map((blockIndex, i) => (
                              <div
                                key={`direct-${file.id}-${blockIndex}-${i}`}
                                className="w-10 h-10 rounded-md flex items-center justify-center text-xs text-white"
                                style={{ backgroundColor: file.color }}
                              >
                                {blockIndex}
                              </div>
                            ))}
                          </div>
                          
                          {/* Indirect Blocks */}
                          {hasIndirect && (
                            <div className="mt-4">
                              <div className="text-xs font-medium mb-1">Single Indirect Block ({file.indirectBlocks.single}) →</div>
                              <div className="flex items-center">
                                <div
                                  className="w-12 h-12 rounded-md flex items-center justify-center text-xs text-white font-bold mr-3"
                                  style={{ backgroundColor: file.color, border: "2px dotted yellow" }}
                                >
                                  {file.indirectBlocks.single}
                                </div>
                                <div className="text-xl mr-3">→</div>
                                <div className="flex flex-wrap gap-2">
                                  {file.indirectData.map((blockIndex, i) => (
                                    <div
                                      key={`indirect-${file.id}-${blockIndex}-${i}`}
                                      className="w-10 h-10 rounded-md flex items-center justify-center text-xs text-white"
                                      style={{ backgroundColor: file.color }}
                                    >
                                      {blockIndex}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
