import React, { useState } from "react";

const DiskScheduling = () => {
	const [algorithm, setAlgorithm] = useState("fcfs");
	const [blocks, setBlocks] = useState("");
	const [startBlock, setStartBlock] = useState("");
	const [maxSize, setMaxSize] = useState("200");
	const [direction, setDirection] = useState("right");
	const [result, setResult] = useState(null);
	const [error, setError] = useState("");

	const algorithmDescriptions = {
		fcfs: "Processes requests in the order they arrive, moving the disk head sequentially.",
		sstf: "Always moves to the nearest request, minimizing seek time but may cause starvation.",
		scan: "Moves back and forth across the disk, servicing requests along the way until reaching the end.",
		cscan:
			"Moves in one direction only, jumping to the start when reaching the end, providing uniform service.",
		look: "Similar to SCAN but only goes as far as the last request in each direction.",
		clook:
			"Similar to C-SCAN but only goes as far as the last request before jumping to the first request.",
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setError("");

		// Parse input blocks
		const blockArray = blocks.split(",").map((num) => parseInt(num.trim()));
		const start = parseInt(startBlock);
		const max = parseInt(maxSize);

		// Validate input
		if (blockArray.some(isNaN)) {
			setError("Please enter valid block numbers");
			return;
		}

		if (algorithm !== "fcfs" && isNaN(start)) {
			setError("Please enter a valid starting block number");
			return;
		}

		if (isNaN(max) || max <= 0) {
			setError("Please enter a valid maximum disk size");
			return;
		}

		// Calculate based on selected algorithm
		let sequence;
		let totalDistance;

		switch (algorithm) {
			case "fcfs":
				({ sequence, totalDistance } = fcfs(blockArray));
				break;
			case "sstf":
				({ sequence, totalDistance } = sstf(blockArray, start));
				break;
			case "scan":
				({ sequence, totalDistance } = scan(blockArray, start, max, direction));
				break;
			case "cscan":
				({ sequence, totalDistance } = cscan(
					blockArray,
					start,
					max,
					direction
				));
				break;
			case "look":
				({ sequence, totalDistance } = look(blockArray, start, direction));
				break;
			case "clook":
				({ sequence, totalDistance } = clook(blockArray, start, direction));
				break;
			default:
				setError("Invalid algorithm selected");
				return;
		}

		setResult({ sequence, totalDistance });
	};

	// Algorithm implementations
	const fcfs = (blocks) => {
		const sequence = [...blocks];
		let totalDistance = 0;
		for (let i = 1; i < sequence.length; i++) {
			totalDistance += Math.abs(sequence[i] - sequence[i - 1]);
		}
		return { sequence, totalDistance };
	};

	const sstf = (blocks, start) => {
		let sequence = [start];
		let remainingBlocks = [...blocks];
		let current = start;
		let totalDistance = 0;

		while (remainingBlocks.length > 0) {
			const distances = remainingBlocks.map((block) =>
				Math.abs(block - current)
			);
			const minIndex = distances.indexOf(Math.min(...distances));
			const nextBlock = remainingBlocks[minIndex];
			totalDistance += Math.abs(nextBlock - current);
			sequence.push(nextBlock);
			current = nextBlock;
			remainingBlocks.splice(minIndex, 1);
		}

		return { sequence, totalDistance };
	};

	const scan = (blocks, start, max, direction) => {
		// Remove the starting block from the blocks array if it exists
		const filteredBlocks = blocks.filter((block) => block !== start);
		const sortedBlocks = [...filteredBlocks].sort((a, b) => a - b);
		const sequence = [start];
		let totalDistance = 0;
		let current = start;
		let currentDirection = direction === "right" ? 1 : -1;
		let remainingBlocks = [...sortedBlocks];

		// First, move in the initial direction until we hit the end
		while (current >= 0 && current <= max) {
			// Find all blocks in the current direction
			const blocksInDirection = remainingBlocks.filter((block) =>
				currentDirection === 1 ? block > current : block < current
			);

			if (blocksInDirection.length === 0) {
				// No more blocks in this direction, move to the end
				if (currentDirection === 1) {
					totalDistance += max - current;
					current = max;
				} else {
					totalDistance += current;
					current = 0;
				}
				sequence.push(current);
				break;
			}

			// Find the next block in the current direction
			const nextBlock =
				currentDirection === 1
					? Math.min(...blocksInDirection)
					: Math.max(...blocksInDirection);

			totalDistance += Math.abs(nextBlock - current);
			current = nextBlock;
			sequence.push(current);
			remainingBlocks.splice(remainingBlocks.indexOf(current), 1);
		}

		// Now move in the opposite direction
		currentDirection *= -1;
		while (remainingBlocks.length > 0) {
			// Find all blocks in the current direction
			const blocksInDirection = remainingBlocks.filter((block) =>
				currentDirection === 1 ? block > current : block < current
			);

			if (blocksInDirection.length === 0) {
				// No more blocks in this direction, move to the end
				if (currentDirection === 1) {
					totalDistance += max - current;
					current = max;
				} else {
					totalDistance += current;
					current = 0;
				}
				sequence.push(current);
				break;
			}

			// Find the next block in the current direction
			const nextBlock =
				currentDirection === 1
					? Math.min(...blocksInDirection)
					: Math.max(...blocksInDirection);

			totalDistance += Math.abs(nextBlock - current);
			current = nextBlock;
			sequence.push(current);
			remainingBlocks.splice(remainingBlocks.indexOf(current), 1);
		}

		return { sequence, totalDistance };
	};

	const cscan = (blocks, start, max, direction) => {
		// Remove the starting block from the blocks array if it exists
		const filteredBlocks = blocks.filter((block) => block !== start);
		const sortedBlocks = [...filteredBlocks].sort((a, b) => a - b);
		const sequence = [start];
		let totalDistance = 0;
		let current = start;
		let currentDirection = direction === "right" ? 1 : -1;
		let remainingBlocks = [...sortedBlocks];

		// First, move in the initial direction until we hit the end
		while (current >= 0 && current <= max) {
			// Find all blocks in the current direction
			const blocksInDirection = remainingBlocks.filter((block) =>
				currentDirection === 1 ? block > current : block < current
			);

			if (blocksInDirection.length === 0) {
				// No more blocks in this direction, move to end and jump to start
				if (currentDirection === 1) {
					totalDistance += max - current;
					current = 0;
					sequence.push(max, 0);
				} else {
					totalDistance += current;
					current = max;
					sequence.push(0, max);
				}
				break;
			}

			// Find the next block in the current direction
			const nextBlock =
				currentDirection === 1
					? Math.min(...blocksInDirection)
					: Math.max(...blocksInDirection);

			totalDistance += Math.abs(nextBlock - current);
			current = nextBlock;
			sequence.push(current);
			remainingBlocks.splice(remainingBlocks.indexOf(current), 1);
		}

		// Now move in the same direction from the start
		while (remainingBlocks.length > 0) {
			// Find all blocks in the current direction
			const blocksInDirection = remainingBlocks.filter((block) =>
				currentDirection === 1 ? block > current : block < current
			);

			if (blocksInDirection.length === 0) {
				// No more blocks to process
				break;
			}

			// Find the next block in the current direction
			const nextBlock =
				currentDirection === 1
					? Math.min(...blocksInDirection)
					: Math.max(...blocksInDirection);

			totalDistance += Math.abs(nextBlock - current);
			current = nextBlock;
			sequence.push(current);
			remainingBlocks.splice(remainingBlocks.indexOf(current), 1);
		}

		return { sequence, totalDistance };
	};

	const look = (blocks, start, direction) => {
		// Remove the starting block from the blocks array if it exists
		const filteredBlocks = blocks.filter((block) => block !== start);
		const sortedBlocks = [...filteredBlocks].sort((a, b) => a - b);
		const sequence = [start];
		let totalDistance = 0;
		let current = start;
		let currentDirection = direction === "right" ? 1 : -1;
		let remainingBlocks = [...sortedBlocks];

		// First, move in the initial direction until we hit the last request
		while (remainingBlocks.length > 0) {
			// Find all blocks in the current direction
			const blocksInDirection = remainingBlocks.filter((block) =>
				currentDirection === 1 ? block > current : block < current
			);

			if (blocksInDirection.length === 0) {
				// No more blocks in this direction, change direction
				currentDirection *= -1;
				continue;
			}

			// Find the next block in the current direction
			const nextBlock =
				currentDirection === 1
					? Math.min(...blocksInDirection)
					: Math.max(...blocksInDirection);

			totalDistance += Math.abs(nextBlock - current);
			current = nextBlock;
			sequence.push(current);
			remainingBlocks.splice(remainingBlocks.indexOf(current), 1);
		}

		return { sequence, totalDistance };
	};

	const clook = (blocks, start, direction) => {
		// Remove the starting block from the blocks array if it exists
		const filteredBlocks = blocks.filter((block) => block !== start);
		const sortedBlocks = [...filteredBlocks].sort((a, b) => a - b);
		const sequence = [start];
		let totalDistance = 0;
		let current = start;
		let currentDirection = direction === "right" ? 1 : -1;
		let remainingBlocks = [...sortedBlocks];

		// First, move in the initial direction until we hit the last request
		while (remainingBlocks.length > 0) {
			// Find all blocks in the current direction
			const blocksInDirection = remainingBlocks.filter((block) =>
				currentDirection === 1 ? block > current : block < current
			);

			if (blocksInDirection.length === 0) {
				// No more blocks in this direction, jump to the first/last block
				if (currentDirection === 1) {
					// Jump to the smallest block
					const smallestBlock = Math.min(...remainingBlocks);
					totalDistance += Math.abs(current - smallestBlock);
					current = smallestBlock;
				} else {
					// Jump to the largest block
					const largestBlock = Math.max(...remainingBlocks);
					totalDistance += Math.abs(current - largestBlock);
					current = largestBlock;
				}
				sequence.push(current);
				remainingBlocks.splice(remainingBlocks.indexOf(current), 1);
				continue;
			}

			// Find the next block in the current direction
			const nextBlock =
				currentDirection === 1
					? Math.min(...blocksInDirection)
					: Math.max(...blocksInDirection);

			totalDistance += Math.abs(nextBlock - current);
			current = nextBlock;
			sequence.push(current);
			remainingBlocks.splice(remainingBlocks.indexOf(current), 1);
		}

		return { sequence, totalDistance };
	};

	return (
		<div className="min-h-screen bg-gray-100 py-8 px-4">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold text-center mb-8">
					Disk Scheduling Algorithms
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
								<option value="fcfs">First Come First Serve (FCFS)</option>
								<option value="sstf">Shortest Seek Time First (SSTF)</option>
								<option value="scan">SCAN</option>
								<option value="cscan">C-SCAN</option>
								<option value="look">LOOK</option>
								<option value="clook">C-LOOK</option>
							</select>
							<p className="mt-2 text-sm text-gray-600">
								{algorithmDescriptions[algorithm]}
							</p>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Block Numbers (comma-separated)
							</label>
							<input
								type="text"
								value={blocks}
								onChange={(e) => setBlocks(e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md"
								placeholder="e.g., 98, 183, 37, 122, 14, 124, 65, 67"
							/>
						</div>

						{algorithm !== "fcfs" && (
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Starting Block Number
								</label>
								<input
									type="number"
									value={startBlock}
									onChange={(e) => setStartBlock(e.target.value)}
									className="w-full px-3 py-2 border border-gray-300 rounded-md"
									placeholder="e.g., 53"
								/>
							</div>
						)}

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Maximum Disk Size
							</label>
							<input
								type="number"
								value={maxSize}
								onChange={(e) => setMaxSize(e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md"
								placeholder="e.g., 200"
							/>
						</div>

						{(algorithm === "scan" ||
							algorithm === "look" ||
							algorithm === "cscan" ||
							algorithm === "clook") && (
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Initial Direction
								</label>
								<select
									value={direction}
									onChange={(e) => setDirection(e.target.value)}
									className="w-full px-3 py-2 border border-gray-300 rounded-md"
								>
									<option value="right">Right</option>
									<option value="left">Left</option>
								</select>
							</div>
						)}

						<button
							type="submit"
							className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
						>
							Simulate
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
							<div className="space-y-2">
								<p>
									<span className="font-medium">Sequence:</span>{" "}
									{result.sequence.join(" → ")}
								</p>
								<p>
									<span className="font-medium">Total Distance:</span>{" "}
									{result.totalDistance} units
								</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default DiskScheduling;
