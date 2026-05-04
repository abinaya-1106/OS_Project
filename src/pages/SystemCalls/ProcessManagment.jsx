import React, { useState, useEffect } from "react";
import ReactFlow, { Handle, Position } from "reactflow";
import "reactflow/dist/style.css";
import { motion } from "framer-motion";

// Enhanced node component with better labeling
const ProcessNode = ({ data }) => (
	<motion.div
		initial={{ opacity: 0, scale: 0.5 }}
		animate={{ opacity: 1, scale: 1 }}
		transition={{ duration: 0.5 }}
		className={`w-32 h-32 flex flex-col items-center justify-center border-2 rounded-full backdrop-blur-md bg-white bg-opacity-90 shadow-lg ${
			data.isActive ? "border-red-500 border-4" : "border-blue-500"
		}`}
	>
		<p className="text-sm font-bold">{data.name}</p>
		<p className="text-sm font-semibold">PID: {data.pid}</p>
		{data.ppid && <p className="text-xs">PPID: {data.ppid}</p>}
		{data.isActive && (
			<motion.div
				className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs shadow-lg"
				animate={{ scale: [1, 1.2, 1] }}
				transition={{ repeat: Infinity, duration: 1.5 }}
			>
				!
			</motion.div>
		)}
		<Handle type="target" position={Position.Top} />
		<Handle type="source" position={Position.Bottom} />
	</motion.div>
);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Function to calculate tree layout
const calculateTreeLayout = (processTree) => {
	// Create a map of parent to children
	const parentToChildren = {};
	processTree.forEach((process) => {
		if (process.ppid) {
			if (!parentToChildren[process.ppid]) {
				parentToChildren[process.ppid] = [];
			}
			parentToChildren[process.ppid].push(process.id);
		}
	});

	// Calculate node positions using a recursive function
	const nodePositions = {};
	const horizontalSpacing = 180;
	const verticalSpacing = 200;

	// Start with root at center
	nodePositions["1"] = { x: 400, y: 100 };

	// Position children recursively
	const positionChildren = (parentId, level) => {
		const children = parentToChildren[parentId] || [];
		if (children.length === 0) return;

		// Calculate width needed for this set of children
		const width = (children.length - 1) * horizontalSpacing;
		const startX = nodePositions[parentId].x - width / 2;

		children.forEach((childId, index) => {
			nodePositions[childId] = {
				x: startX + index * horizontalSpacing,
				y: nodePositions[parentId].y + verticalSpacing,
			};
			positionChildren(childId, level + 1);
		});
	};

	positionChildren("1", 1);
	return nodePositions;
};

const createProcess = async (
	parentId,
	processTree,
	processId,
	setNodes,
	setEdges,
	setActiveLine,
	lineNumber
) => {
	let newPid = ++processId;
	let name = `Process ${newPid}`;
	processTree.push({
		id: String(newPid),
		pid: String(newPid),
		ppid: parentId,
		name,
	});

	// Calculate tree layout
	const nodePositions = calculateTreeLayout(processTree);

	setActiveLine({ text: `fork() -> Creating ${name}`, lineNumber });
	await delay(500);
	setNodes((prev) => [
		...prev.map((node) => ({
			...node,
			data: { ...node.data, isActive: false },
			// Update positions for existing nodes
			position: nodePositions[node.id] || node.position,
		})),
		{
			id: String(newPid),
			type: "processNode",
			position: nodePositions[String(newPid)] || {
				x: 250,
				y: 200 + processTree.length * 80,
			},
			data: {
				pid: newPid,
				ppid: parentId,
				name,
				isActive: true,
			},
		},
	]);
	setEdges((prev) => [
		...prev,
		{
			id: `e${parentId}-${newPid}`,
			source: String(parentId),
			target: String(newPid),
			style: { stroke: "#3b82f6", strokeWidth: 2 },
			animated: true,
		},
	]);

	return { newPid, processId };
};

const parseJSCode = async (code, setNodes, setEdges, setActiveLine) => {
	if (!code.trim()) {
		setNodes([]);
		setEdges([]);
		setActiveLine({
			text: "Enter code to visualize process tree",
			lineNumber: null,
		});
		return;
	}

	let lines = code.split("\n");
	let processTree = [{ id: "1", pid: "1", ppid: null, name: "Root Process" }];
	let processId = 1;
	let parentStack = ["1"];

	setNodes([
		{
			id: "1",
			type: "processNode",
			position: { x: 400, y: 100 },
			data: {
				pid: "1",
				ppid: null,
				name: "Root Process",
				isActive: true,
			},
		},
	]);
	setEdges([]);

	for (let i = 0; i < lines.length; i++) {
		let line = lines[i].trim();
		if (!line) continue;

		setActiveLine({ text: line, lineNumber: i + 1 });

		// Highlight the active node
		setNodes((prev) =>
			prev.map((node) => ({
				...node,
				data: {
					...node.data,
					isActive: node.id === parentStack[parentStack.length - 1],
				},
			}))
		);

		await delay(1000);

		if (line.startsWith("fork()")) {
			let { newPid } = await createProcess(
				parentStack[parentStack.length - 1],
				processTree,
				processId,
				setNodes,
				setEdges,
				setActiveLine,
				i + 1
			);
			parentStack.push(String(newPid));
			processId = newPid;
		} else if (line.startsWith("exit()")) {
			const exitingProcess = parentStack.pop();
			setActiveLine({
				text: `exit() -> Process ${exitingProcess} terminated`,
				lineNumber: i + 1,
			});

			// Mark the exiting process as inactive
			setNodes((prev) =>
				prev.map((node) => {
					if (node.id === exitingProcess) {
						return {
							...node,
							data: {
								...node.data,
								isActive: false,
							},
							style: {
								opacity: 0.5,
							},
						};
					}
					return node;
				})
			);

			await delay(500);
		} else if (line.startsWith("wait()")) {
			setActiveLine({
				text: `wait() -> Process ${
					parentStack[parentStack.length - 1]
				} waiting`,
				lineNumber: i + 1,
			});
			await delay(1000);
		}
	}

	setActiveLine({ text: "Execution Complete", lineNumber: null });
};

// Sample code examples
// Sample code examples
const sampleCodes = [
	{
		name: "Simple Chain",
		description: "Creates a linear chain of processes",
		code: "fork()\nfork()\nfork()\nexit()",
	},
	{
		name: "Binary Tree",
		description: "Creates a balanced binary tree structure",
		code: "fork()\nfork()\nexit()\nfork()\nfork()\nexit()",
	},
	{
		name: "Process Siblings",
		description: "Parent creates multiple child processes",
		code: "fork()\nexit()\nfork()\nexit()\nfork()\nexit()",
	},
	{
		name: "Deep Process Tree",
		description: "Creates a deep hierarchical process tree",
		code: "fork()\nfork()\nfork()\nexit()\nwait()\nfork()\nexit()",
	},
	{
		name: "Complex Hierarchy",
		description: "Multiple levels with waiting and termination",
		code: "fork()\nfork()\nwait()\nexit()\nfork()\nfork()\nexit()\nwait()\nexit()",
	},
	{
		name: "Asymmetric Binary Tree",
		description: "Creates an unbalanced tree with conditional branches",
		code: "fork()\nif (getpid() % 2 == 0) {\n  fork()\n  fork()\n} else {\n  fork()\n}\nexit()",
	},
	{
		name: "Process Groups with Depth Control",
		description: "Different behavior based on parent process ID",
		code: "fork()\nif (getppid() == 1) {\n  fork()\n  fork()\n} else {\n  fork()\n  wait()\n  exit()\n}",
	},
	{
		name: "Conditional Process Synchronization",
		description: "Processes wait or exit based on their ID",
		code: "fork()\nif (getpid() % 2 == 0) {\n  wait()\n  fork()\n} else {\n  fork()\n  exit()\n}\nwait()",
	},
	{
		name: "Advanced Process Hierarchy",
		description: "Complex nested conditions create diverse process trees",
		code: "fork()\nif (getpid() % 3 == 0) {\n  fork()\n  if (getppid() > 3) {\n    fork()\n    wait()\n  }\n  exit()\n} else {\n  wait()\n  fork()\n}\nexit()",
	},
	{
		name: "Multi-Level Waiting Tree",
		description: "Creates a tree with strategic process synchronization",
		code: "fork()\nwait()\nif (getppid() == 1) {\n  fork()\n  fork()\n} else {\n  fork()\n}\nif (getpid() % 2 == 0) {\n  wait()\n} else {\n  exit()\n}",
	},
];

const SystemCalls = () => {
	const [nodes, setNodes] = useState([]);
	const [edges, setEdges] = useState([]);
	const [code, setCode] = useState("");
	const [activeLine, setActiveLine] = useState({
		text: "Enter code to visualize",
		lineNumber: null,
	});
	const [showTheory, setShowTheory] = useState(false);
	const [showSampleSelector, setShowSampleSelector] = useState(false);

	const nodeTypes = {
		processNode: ProcessNode,
	};

	const handleCodeChange = (e) => {
		setCode(e.target.value);
	};

	const handleRunCode = () => {
		parseJSCode(code, setNodes, setEdges, setActiveLine);
	};

	const handleSampleSelect = (sampleCode) => {
		setCode(sampleCode);
		setShowSampleSelector(false);
	};

	// Add fit view effect when nodes change
	useEffect(() => {
		// This is just a placeholder to remind us that ReactFlow has automatic fitView
		// which we enable in the ReactFlow component below
	}, [nodes]);

	return (
		<div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white min-h-screen p-6">
			<div className="max-w-6xl mx-auto">
				<header className="mb-12 text-center">
					<div className="inline-block p-2 px-6 mb-4 bg-blue-500 bg-opacity-20 backdrop-blur-lg rounded-full">
						<h1 className="text-4xl font-bold text-white">
							Process Management System Calls
						</h1>
					</div>
					<p className="text-xl text-blue-200">
						Understanding how operating systems manage processes through system
						calls
					</p>
				</header>

				{/* Theory Section Toggle Button */}
				<div className="mb-6 text-center">
					<button
						onClick={() => setShowTheory(!showTheory)}
						className="px-6 py-3 bg-blue-600 bg-opacity-40 backdrop-blur-md rounded-full text-white hover:bg-opacity-60 transition-all border border-blue-400 border-opacity-30"
					>
						{showTheory
							? "Hide Theory"
							: "Show Theory on Process Management System Calls"}
					</button>
				</div>

				{/* Theory Section */}
				{showTheory && (
					<motion.section
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						transition={{ duration: 0.5 }}
						className="mb-12 backdrop-blur-md bg-white bg-opacity-10 rounded-xl shadow-2xl p-8 border border-white border-opacity-20"
					>
						<h2 className="text-3xl font-semibold mb-6 text-white">
							Process Control System Calls
						</h2>

						<div className="space-y-6">
							<div className="backdrop-blur-sm bg-white bg-opacity-5 p-6 rounded-lg border border-white border-opacity-10">
								<h3 className="text-2xl font-medium text-blue-300 mb-3">
									Process Creation
								</h3>
								<p className="text-gray-300 mb-4">
									Process creation system calls allow the operating system to
									create new processes. The primary system calls are:
								</p>
								<div className="space-y-3">
									<div>
										<h4 className="text-xl font-medium text-blue-100">
											fork()
										</h4>
										<p className="text-gray-300 pl-4">
											Creates an exact copy of the calling process. After
											fork(), there are two identical processes: the parent and
											the child. The child process receives a copy of the
											parent's address space, and both processes continue
											execution from the point where fork() returns. The return
											value of fork() differs: zero for the child process and
											the child's PID for the parent.
										</p>
									</div>
									<div>
										<h4 className="text-xl font-medium text-blue-100">
											exec()
										</h4>
										<p className="text-gray-300 pl-4">
											Replaces the current process image with a new process
											image. This system call is typically used after a fork()
											to run a different program. The exec() family of functions
											(execl, execv, execle, execve, execlp, execvp) overlays
											the calling process with the specified program.
										</p>
									</div>
								</div>
							</div>

							<div className="backdrop-blur-sm bg-white bg-opacity-5 p-6 rounded-lg border border-white border-opacity-10">
								<h3 className="text-2xl font-medium text-green-300 mb-3">
									Process Termination
								</h3>
								<div className="space-y-3">
									<div>
										<h4 className="text-xl font-medium text-green-100">
											exit()
										</h4>
										<p className="text-gray-300 pl-4">
											Terminates the calling process and returns a status value
											to the parent process. The exit() system call deallocates
											resources, closes open files, and notifies the parent
											process of termination. When a process exits, it enters a
											"zombie" state until the parent acknowledges its
											termination via wait() or waitpid().
										</p>
									</div>
									<div>
										<h4 className="text-xl font-medium text-green-100">
											abort()
										</h4>
										<p className="text-gray-300 pl-4">
											Causes abnormal process termination. Unlike exit(), which
											performs a graceful shutdown, abort() generates a SIGABRT
											signal that causes the process to terminate immediately
											and typically produces a core dump.
										</p>
									</div>
								</div>
							</div>

							<div className="backdrop-blur-sm bg-white bg-opacity-5 p-6 rounded-lg border border-white border-opacity-10">
								<h3 className="text-2xl font-medium text-purple-300 mb-3">
									Process Synchronization
								</h3>
								<div className="space-y-3">
									<div>
										<h4 className="text-xl font-medium text-purple-100">
											wait()
										</h4>
										<p className="text-gray-300 pl-4">
											Suspends execution of the calling process until one of its
											child processes terminates. The wait() system call returns
											the PID of the terminated child and collects the exit
											status, allowing the parent to properly handle child
											termination and prevent zombie processes from consuming
											system resources.
										</p>
									</div>
									<div>
										<h4 className="text-xl font-medium text-purple-100">
											waitpid()
										</h4>
										<p className="text-gray-300 pl-4">
											A more flexible version of wait() that allows waiting for
											a specific child process. The waitpid() system call can be
											configured to be non-blocking and provides options to wait
											for specific children or any child process.
										</p>
									</div>
								</div>
							</div>

							<div className="backdrop-blur-sm bg-white bg-opacity-5 p-6 rounded-lg border border-white border-opacity-10">
								<h3 className="text-2xl font-medium text-yellow-300 mb-3">
									Process Control & Information
								</h3>
								<div className="space-y-3">
									<div>
										<h4 className="text-xl font-medium text-yellow-100">
											getpid() & getppid()
										</h4>
										<p className="text-gray-300 pl-4">
											getpid() returns the process ID of the calling process,
											while getppid() returns the parent process ID. These
											system calls are useful for process identification and
											logging.
										</p>
									</div>
									<div>
										<h4 className="text-xl font-medium text-yellow-100">
											nice()
										</h4>
										<p className="text-gray-300 pl-4">
											Changes the priority of a process. The nice() system call
											modifies the scheduling priority, allowing processes to
											adjust their CPU allocation relative to other processes.
										</p>
									</div>
									<div>
										<h4 className="text-xl font-medium text-yellow-100">
											kill()
										</h4>
										<p className="text-gray-300 pl-4">
											Sends a signal to a process or process group. The kill()
											system call can be used for inter-process communication or
											to terminate processes by sending specific signals (e.g.,
											SIGTERM, SIGKILL).
										</p>
									</div>
								</div>
							</div>
						</div>
					</motion.section>
				)}

				<div className="flex flex-col lg:flex-row h-[calc(100vh-200px)] gap-6">
					<div className="flex-1 flex flex-col">
						<div className="flex-[0.9] w-full backdrop-blur-md bg-white bg-opacity-10 rounded-xl shadow-2xl overflow-hidden mb-6 border border-white border-opacity-20">
							<div className="flex">
								{/* Code editor area */}
								<div className="flex-1 p-4">
									<div className="flex items-center justify-between mb-4">
										<h2 className="text-xl font-semibold text-blue-300">
											Process Control Simulator
										</h2>
										<div className="flex gap-2">
											<button
												onClick={() =>
													setShowSampleSelector(!showSampleSelector)
												}
												className="px-4 py-2 bg-purple-600 bg-opacity-50 backdrop-blur-sm text-white rounded-lg hover:bg-opacity-70 transition-all border border-purple-400 border-opacity-30"
											>
												{showSampleSelector ? "Hide Samples" : "Show Samples"}
											</button>
											<button
												onClick={handleRunCode}
												className="px-6 py-2 bg-blue-600 bg-opacity-50 backdrop-blur-sm text-white rounded-lg hover:bg-opacity-70 transition-all border border-blue-400 border-opacity-30"
											>
												Run Code
											</button>
										</div>
									</div>

									{/* Sample Code Selector */}
									{showSampleSelector && (
										<motion.div
											initial={{ opacity: 0, height: 0 }}
											animate={{ opacity: 1, height: "auto" }}
											transition={{ duration: 0.3 }}
											className="mb-4 backdrop-blur-sm bg-white bg-opacity-5 p-4 rounded-lg border border-white border-opacity-10 overflow-scroll"
										>
											<h3 className="text-lg font-medium text-purple-300 mb-3">
												Sample Process Trees
											</h3>
											<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 h-[600px]">
												{sampleCodes.map((sample, idx) => (
													<div
														key={idx}
														onClick={() => handleSampleSelect(sample.code)}
														className="p-3 bg-gray-800 bg-opacity-50 rounded-lg border border-white border-opacity-10 cursor-pointer hover:bg-opacity-70 transition-all"
													>
														<h4 className="text-md font-medium text-blue-300">
															{sample.name}
														</h4>
														<p className="text-xs text-gray-400 mb-2">
															{sample.description}
														</p>
														<div className="text-xs font-mono text-gray-300 bg-gray-900 bg-opacity-50 p-2 rounded overflow-hidden">
															{sample.code.split("\n").map((line, i) => (
																<div key={i}>{line}</div>
															))}
														</div>
													</div>
												))}
											</div>
										</motion.div>
									)}

									<div className="border border-white border-opacity-20 rounded-lg overflow-hidden backdrop-blur-sm">
										<div className="flex">
											{/* Line numbers */}
											<div className="bg-gray-800 bg-opacity-50 p-2 text-right text-gray-400 pr-3 font-mono">
												{code.split("\n").map((_, i) => (
													<div
														key={i}
														className={`${
															activeLine.lineNumber === i + 1
																? "bg-yellow-500 bg-opacity-30 text-white"
																: ""
														}`}
													>
														{i + 1}
													</div>
												))}
												{!code && <div>1</div>}
											</div>

											{/* Code input */}
											<textarea
												value={code}
												placeholder="Enter code with fork(), exit(), wait() commands..."
												onChange={handleCodeChange}
												className="flex-1 p-2 font-mono outline-none resize-none h-[400px] overflow-auto bg-gray-900 bg-opacity-70 text-gray-200"
												spellCheck="false"
											/>
										</div>
									</div>
								</div>
							</div>

							{/* Execution status */}
							<div className="bg-gray-900 bg-opacity-80 text-white p-4 flex items-center border-t border-white border-opacity-10">
								<div className="w-3 h-3 rounded-full mr-3 bg-green-500 animate-pulse"></div>
								<span className="font-mono mr-2">
									{activeLine.lineNumber !== null
										? `Line ${activeLine.lineNumber}:`
										: "Status:"}
								</span>
								<span
									className={`font-mono ${
										activeLine.text.includes("Execution Complete")
											? "text-green-400"
											: "text-yellow-300"
									}`}
								>
									{activeLine.text}
								</span>
							</div>
						</div>
						<div className="mt-2 text-gray-300 text-sm backdrop-blur-sm bg-white bg-opacity-5 p-6 rounded-lg border border-white border-opacity-10">
							<h3 className="font-semibold mb-3 text-blue-300">
								Available Commands:
							</h3>
							<ul className="space-y-2">
								<li className="flex items-center">
									<div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
									<code className="bg-gray-800 bg-opacity-50 px-2 py-1 rounded mr-2">
										fork()
									</code>
									<span>Creates a new child process from current process</span>
								</li>
								<li className="flex items-center">
									<div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
									<code className="bg-gray-800 bg-opacity-50 px-2 py-1 rounded mr-2">
										exit()
									</code>
									<span>Terminates the current process</span>
								</li>
								<li className="flex items-center">
									<div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
									<code className="bg-gray-800 bg-opacity-50 px-2 py-1 rounded mr-2">
										wait()
									</code>
									<span>Current process waits for children to terminate</span>
								</li>
							</ul>
							<p className="mt-4 text-gray-400">
								Example:{" "}
								<code className="bg-gray-800 bg-opacity-50 px-2 py-1 rounded">
									fork(); fork(); exit();
								</code>
							</p>
						</div>
					</div>
					{/* Visualization area */}
					<div className="flex-1 h-full rounded-xl backdrop-blur-md bg-gradient-to-br from-gray-800 to-blue-900 bg-opacity-30 overflow-hidden border border-white border-opacity-20 shadow-2xl">
						<ReactFlow
							nodes={nodes}
							edges={edges}
							nodeTypes={nodeTypes}
							fitView
							fitViewOptions={{ padding: 0.2 }}
							minZoom={0.2}
							maxZoom={1.5}
							attributionPosition="bottom-right"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SystemCalls;
