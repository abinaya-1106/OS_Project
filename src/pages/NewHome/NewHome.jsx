import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Cpu,
	Database,
	HardDrive,
	FileText,
	Layers,
	Activity,
	Lock,
	Terminal,
	Grid,
	FileCog,
	Power,
	GitBranch,
	Users,
	Code,
	Star,
	ExternalLink,
	X,
	Folder,
	Users2,
	Github,
	Info,
} from "lucide-react";

// Import all project components
import BootSequenceVisualization from "../BootSequenceVisualizer/BootSequenceVisualization";
import BankersAlgorithm from "../BankersAlgorithm/BankersAlgorithm";
import ContiguousMemoryAllocation from "../ContiguousMemoryAllocation/ContiguousMemoryAllocation";
import CpuScheduling from "../CpuScheduling/CpuScheduling";
import DiskScheduling from "../DiskScheduling/DiskScheduling";
import FileAllocation from "../FileAllocation/FileAllocation";
import FileOrganization from "../FileOrganization/FileOrganization";
import MemoryManagement from "../MemoryManagement/MemoryManagement";
import PageReplacement from "../PageReplacement/PageReplacement";
import SystemCalls from "../SystemCalls/ProcessManagment";
import LinuxRootFileSystem from "../LinuxRootFileSystem/LinuxRootFileSystem";
import SyncHome from "../Synchronization/Home";

// Team Members Data
const teamMembers = [
	{
		name: "Sahil Mengji",
		role: "Developer",
		modules: [
			"Project Setup",
			"System Calls",
			"Network Calls",
			"Home Page & Navigation",
		],
	},
	{
		name: "Shanjiv A",
		role: "Developer",
		modules: [
			"Boot Sequence Visualization",
			"Contiguous Memory Allocation",
			"Linux Root File System",
		],
	},
	{ name: "Sai Samanyu", role: "Developer", modules: ["Banker's Algorithm"] },
	{ name: "Shreyas Lal", role: "Developer", modules: ["CPU Scheduling"] },
	{ name: "Sanjay S Bhat", role: "Developer", modules: ["Disk Scheduling"] },
	{
		name: "Sugavasi Lalitha",
		role: "Developer",
		modules: ["Memory Management"],
	},
	{
		name: "Sarth Santosh Shah",
		role: "Developer",
		modules: ["Page Replacement"],
	},
	{ name: "Swaraj", role: "Developer", modules: ["File Allocation"] },
	{ name: "Shashank", role: "Developer", modules: ["Synchronization"] },
];

const projects = [
	{
		name: "Boot Sequence Visualization",
		component: BootSequenceVisualization,
		builtBy: ["Shanjiv A"],
		icon: <Power className="w-10 h-10" />,
		description: "Visualize the OS boot sequence from BIOS to kernel loading",
	},
	{
		name: "Banker's Algorithm",
		component: BankersAlgorithm,
		builtBy: ["Sai Samanyu"],
		icon: <Lock className="w-10 h-10" />,
		description:
			"Deadlock avoidance algorithm that tests for resource allocation safety",
	},
	{
		name: "Contiguous Memory Allocation",
		component: ContiguousMemoryAllocation,
		builtBy: ["Shanjiv A"],
		icon: <Layers className="w-10 h-10" />,
		description:
			"Simulate first-fit, best-fit, and worst-fit memory allocation strategies",
	},
	{
		name: "CPU Scheduling",
		component: CpuScheduling,
		builtBy: ["Shreyas Lal"],
		icon: <Cpu className="w-10 h-10" />,
		description:
			"Visualize FCFS, SJF, Priority, and Round Robin scheduling algorithms",
	},
	{
		name: "Disk Scheduling",
		component: DiskScheduling,
		builtBy: ["Sanjay S Bhat"],
		icon: <HardDrive className="w-10 h-10" />,
		description:
			"Explore FCFS, SSTF, SCAN, and C-SCAN disk scheduling algorithms",
	},
	{
		name: "Linux Root File System",
		component: LinuxRootFileSystem,
		builtBy: ["Shanjiv A"],
		icon: <FileText className="w-10 h-10" />,
		description: "Interactive visualization of Linux directory structure",
	},
	{
		name: "Memory Management",
		component: MemoryManagement,
		builtBy: ["Sugavasi Lalitha"],
		icon: <Grid className="w-10 h-10" />,
		description:
			"Simulate paging and segmentation memory management techniques",
	},
	{
		name: "Page Replacement",
		component: PageReplacement,
		builtBy: ["Sarth Santosh Shah"],
		icon: <Cpu className="w-10 h-10" />,
		description: "Compare FIFO, LRU, and Optimal page replacement algorithms",
	},
	{
		name: "System Calls",
		component: SystemCalls,
		builtBy: ["Sahil Mengji"],
		icon: <Terminal className="w-10 h-10" />,
		description: "Interactive demonstration of common system calls",
	},
	{
		name: "File Allocation",
		component: FileAllocation,
		builtBy: ["Swaraj"],
		icon: <FileCog className="w-6 h-6" />,
		description:
			"Simulate contiguous, linked, and indexed file allocation methods",
	},
	{
		name: "Synchronization",
		component: SyncHome,
		builtBy: ["Shashank"],
		icon: <Database className="w-6 h-6" />,
		description: "Explore process synchronization mechanisms and solutions",
	},
];

// Desktop folders
const desktopFolders = [
	{ name: "Modules", icon: <Folder className="w-12 h-12" />, type: "modules" },
	{
		name: "Team Details",
		icon: <Users2 className="w-12 h-12" />,
		type: "team",
	},
	{ name: "Source Code", icon: <Github className="w-12 h-12" />, type: "code" },
	{ name: "About", icon: <Info className="w-12 h-12" />, type: "about" },
];

// Draggable Window Component
const DraggableWindow = ({
	children,
	title,
	isOpen,
	onClose,
	initialPosition = { x: 100, y: 100 },
}) => {
	const [position, setPosition] = useState(initialPosition);
	const [isDragging, setIsDragging] = useState(false);
	const windowRef = useRef(null);

	const handleDragStart = (e) => {
		const { clientX, clientY } = e.touches ? e.touches[0] : e;
		const rect = windowRef.current.getBoundingClientRect();
		const offsetX = clientX - rect.left;
		const offsetY = clientY - rect.top;

		const handleDrag = (moveEvent) => {
			const { clientX: moveX, clientY: moveY } = moveEvent.touches
				? moveEvent.touches[0]
				: moveEvent;
			setPosition({
				x: moveX - offsetX,
				y: moveY - offsetY,
			});
		};

		const handleDragEnd = () => {
			document.removeEventListener("mousemove", handleDrag);
			document.removeEventListener("mouseup", handleDragEnd);
			document.removeEventListener("touchmove", handleDrag);
			document.removeEventListener("touchend", handleDragEnd);
			setIsDragging(false);
		};

		document.addEventListener("mousemove", handleDrag);
		document.addEventListener("mouseup", handleDragEnd);
		document.addEventListener("touchmove", handleDrag);
		document.addEventListener("touchend", handleDragEnd);
		setIsDragging(true);
	};

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.8 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.8 }}
			className="absolute drop-shadow-2xl backdrop-blur-sm bg-opacity-95 bg-gradient-to-br from-purple-900 to-gray-900 rounded-lg shadow-lg w-3/4 mx-6 h-5/6 overflow-hidden"
			style={{
				left: position.x,
				top: position.y,
				zIndex: isDragging ? 50 : 10,
				backdropFilter: "blur(10px)",
			}}
			ref={windowRef}
		>
			{/* Window Header */}
			<div
				className="flex items-center justify-between bg-gradient-to-r from-purple-800 to-indigo-900 text-white px-4 py-2 rounded-t-lg cursor-move"
				onMouseDown={handleDragStart}
				onTouchStart={handleDragStart}
			>
				<div className="flex items-center space-x-2">
					<div className="w-3 h-3 rounded-full bg-red-500"></div>
					<div className="w-3 h-3 rounded-full bg-yellow-500"></div>
					<div className="w-3 h-3 rounded-full bg-green-500"></div>
					<span className="ml-4 font-bold">{title}</span>
				</div>
				<button
					className="w-6 h-6 bg-red-500 rounded-full hover:bg-red-600 flex items-center justify-center"
					onClick={onClose}
				>
					<X className="p-1" />
				</button>
			</div>

			{/* Window Content */}
			<div className="p-6 h-[calc(100%-3rem)] overflow-y-auto">{children}</div>
		</motion.div>
	);
};

// Main component
const NewHome = () => {
	const [currentTime, setCurrentTime] = useState(new Date());
	const [showSimulator, setShowSimulator] = useState(false);
	const [activeProject, setActiveProject] = useState(null);
	const [isBooting, setIsBooting] = useState(true);
	const [bootProgress, setBootProgress] = useState(0);
	const [openWindows, setOpenWindows] = useState({});
	const [folderPositions, setFolderPositions] = useState({});

	// Initialize folder positions if not set
	useEffect(() => {
		if (Object.keys(folderPositions).length === 0) {
			const initialPositions = {};
			desktopFolders.forEach((folder, index) => {
				initialPositions[folder.type] = { x: 30, y: 100 + index * 100 };
			});
			setFolderPositions(initialPositions);
		}
	}, [folderPositions]);

	// Update the time every second
	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);
		return () => clearInterval(timer);
	}, []);

	// Boot animation
	useEffect(() => {
		if (isBooting) {
			const bootTimer = setInterval(() => {
				setBootProgress((prev) => {
					const newProgress = prev + 1;
					if (newProgress >= 100) {
						clearInterval(bootTimer);
						setTimeout(() => setIsBooting(false), 500);
						return 100;
					}
					return newProgress;
				});
			}, 20);
			return () => clearInterval(bootTimer);
		}
	}, [isBooting]);

	// Handle folder click
	const handleFolderClick = (folderType) => {
		setOpenWindows((prev) => ({
			...prev,
			[folderType]: true,
		}));
	};

	// Update folder position
	const updateFolderPosition = (folderType, newPosition) => {
		setFolderPositions((prev) => ({
			...prev,
			[folderType]: newPosition,
		}));
	};

	// Close a window
	const closeWindow = (windowType) => {
		setOpenWindows((prev) => ({
			...prev,
			[windowType]: false,
		}));
		if (windowType === "module") {
			setActiveProject(null);
		}
	};

	// Weather data (static for demo)
	const [weather, setWeather] = useState({
		temp: 25,
		description: "clear sky",
		icon: "01d",
	});

	// Render module content
	const renderModuleContent = () => {
		return activeProject ? (
			<div>
				{/* Back to All Modules Button */}
				<button
					className="mb-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-500 transition-colors"
					onClick={() => setActiveProject(null)}
				>
					Back to All Modules
				</button>

				{/* Module Header */}
				<div className="mb-6 p-4 bg-gradient-to-r from-purple-900 to-indigo-900 rounded-lg backdrop-blur-sm text-white">
					<div className="flex items-center space-x-4">
						<div className="p-3 bg-purple-700 rounded-full">
							{activeProject.icon}
						</div>
						<div>
							<h2 className="text-xl font-bold">{activeProject.name}</h2>
							<p className="text-purple-300">
								By: {activeProject.builtBy.join(", ")}
							</p>
							<p className="mt-2">{activeProject.description}</p>
						</div>
					</div>
				</div>

				{/* Active Project Component */}
				<div className="bg-gray-800 p-6 rounded-lg border border-purple-500">
					<activeProject.component />
				</div>
			</div>
		) : (
			<div className="text-white">
				<h2 className="text-2xl font-bold mb-6 text-purple-300">
					Operating System Modules
				</h2>
				<div className="grid grid-cols-2 md:grid-cols-3 gap-6">
					{projects.map((project, index) => (
						<motion.div
							key={index}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="flex flex-col items-center bg-gradient-to-br from-purple-900 to-indigo-900 p-6 rounded-lg shadow-lg cursor-pointer group border border-purple-500 backdrop-blur-sm transition-all"
							onClick={() => setActiveProject(project)}
						>
							<div className="p-4 bg-indigo-700 rounded-full mb-3">
								{project.icon}
							</div>
							<span className="text-lg font-semibold group-hover:text-purple-300 text-center">
								{project.name}
							</span>
							<span className="text-xs text-purple-300 mt-2">
								Built by: {project.builtBy.join(", ")}
							</span>
							<div className="mt-4 text-sm text-gray-300 text-center">
								{project.description.length > 60
									? project.description.substring(0, 60) + "..."
									: project.description}
							</div>
							<div className="mt-4 px-3 py-1 bg-purple-600 text-white rounded-full text-xs">
								View Module
							</div>
						</motion.div>
					))}
				</div>
			</div>
		);
	};

	// Render team details content
	const renderTeamContent = () => {
		return (
			<div className="text-white">
				<h2 className="text-2xl font-bold mb-6 text-purple-300">
					Development Team
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{teamMembers.map((member, index) => (
						<motion.div
							key={index}
							whileHover={{ scale: 1.02 }}
							className="bg-gradient-to-br from-purple-900 to-indigo-900 p-6 rounded-lg shadow-lg border border-purple-500"
						>
							<h3 className="text-xl font-bold text-white">{member.name}</h3>
							<p className="text-purple-300">{member.role}</p>
							<div className="mt-4">
								<h4 className="font-semibold text-sm text-purple-300">
									Modules Developed:
								</h4>
								<ul className="mt-2 space-y-1">
									{member.modules.map((module, idx) => (
										<li key={idx} className="flex items-center space-x-2">
											<div className="w-2 h-2 bg-purple-400 rounded-full"></div>
											<span>{module}</span>
										</li>
									))}
								</ul>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		);
	};

	// Render source code content
	const renderCodeContent = () => {
		return (
			<div className="text-white">
				<h2 className="text-2xl font-bold mb-6 text-purple-300">
					Source Code Repository
				</h2>
				<div className="bg-gradient-to-br from-purple-900 to-indigo-900 p-6 rounded-lg shadow-lg border border-purple-500">
					<div className="flex items-center space-x-4 mb-6">
						<Github className="w-10 h-10" />
						<div>
							<h3 className="text-xl font-bold">OS Simulator</h3>
							<p className="text-purple-300">
								A comprehensive collection of operating system concepts
								visualized
							</p>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
						<div className="bg-gray-800 p-4 rounded-lg">
							<h4 className="font-semibold mb-2">Repository</h4>
							<div className="flex items-center space-x-2">
								<Code className="w-4 h-4" />
								<span>https://github.com/sahil-mengji/os-project-51-60</span>
							</div>
						</div>

						<div className="bg-gray-800 p-4 rounded-lg">
							<h4 className="font-semibold mb-2">Tech Stack</h4>
							<div className="flex flex-wrap gap-2 mt-2">
								<span className="px-2 py-1 bg-purple-700 rounded-full text-xs">
									React
								</span>
								<span className="px-2 py-1 bg-purple-700 rounded-full text-xs">
									Tailwind CSS
								</span>
								<span className="px-2 py-1 bg-purple-700 rounded-full text-xs">
									Framer Motion
								</span>
								<span className="px-2 py-1 bg-purple-700 rounded-full text-xs">
									JavaScript
								</span>
							</div>
						</div>
					</div>

					<div className="bg-gray-800 p-4 rounded-lg">
						<h4 className="font-semibold mb-2">Clone Repository</h4>
						<div className="bg-gray-900 p-3 rounded font-mono text-sm">
							git clone https://github.com/sahil-mengji/os-project-51-60
						</div>
					</div>
				</div>
			</div>
		);
	};

	// Render about content
	const renderAboutContent = () => {
		return (
			<div className="text-white">
				<h2 className="text-2xl font-bold mb-6 text-purple-300">
					About OS Simulator
				</h2>
				<div className="bg-gradient-to-br from-purple-900 to-indigo-900 p-6 rounded-lg shadow-lg border border-purple-500">
					<p className="mb-4">
						The OS Simulator is an educational tool designed to help students
						and enthusiasts learn about operating system concepts through
						interactive visualizations and simulations.
					</p>

					<h3 className="text-lg font-bold mt-6 mb-3">Features</h3>
					<ul className="space-y-2">
						<li className="flex items-center space-x-3">
							<div className="w-2 h-2 bg-purple-400 rounded-full"></div>
							<span>Interactive simulations of core OS concepts</span>
						</li>
						<li className="flex items-center space-x-3">
							<div className="w-2 h-2 bg-purple-400 rounded-full"></div>
							<span>Visual representations of algorithms and processes</span>
						</li>
						<li className="flex items-center space-x-3">
							<div className="w-2 h-2 bg-purple-400 rounded-full"></div>
							<span>Step-by-step execution of OS operations</span>
						</li>
						<li className="flex items-center space-x-3">
							<div className="w-2 h-2 bg-purple-400 rounded-full"></div>
							<span>Customizable parameters for experimentation</span>
						</li>
					</ul>

					<h3 className="text-lg font-bold mt-6 mb-3">Purpose</h3>
					<p>
						This simulator was developed as an educational project to make
						complex operating system concepts more accessible and interactive.
						It serves as both a learning tool and a visualization platform for
						OS algorithms and mechanisms.
					</p>

					<div className="mt-8 p-4 bg-purple-900 bg-opacity-50 rounded-lg">
						<h3 className="text-lg font-bold mb-2">Version</h3>
						<p>OS Simulator v2.0</p>
						<p className="text-sm text-purple-300 mt-1">Released: April 2025</p>
					</div>
				</div>
			</div>
		);
	};

	// Handle rendering different window content based on type
	const renderWindowContent = (type) => {
		switch (type) {
			case "modules":
				return renderModuleContent();
			case "team":
				return renderTeamContent();
			case "code":
				return renderCodeContent();
			case "about":
				return renderAboutContent();
			default:
				return <div>Window Content</div>;
		}
	};

	// Render folders as draggable items
	const renderFolders = () => {
		return desktopFolders.map((folder, index) => {
			const position = folderPositions[folder.type] || {
				x: 30,
				y: 100 + index * 100,
			};

			return (
				<motion.div
					key={folder.type}
					drag
					dragMomentum={false}
					dragConstraints={{
						left: 0,
						right: window.innerWidth - 100,
						top: 0,
						bottom: window.innerHeight - 100,
					}}
					onDragEnd={(e, info) => {
						updateFolderPosition(folder.type, {
							x: position.x + info.offset.x,
							y: position.y + info.offset.y,
						});
					}}
					className="absolute cursor-pointer"
					style={{ left: position.x, top: position.y }}
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.95 }}
					onClick={() => handleFolderClick(folder.type)}
				>
					<div className="flex flex-col items-center space-y-2 text-white">
						<div className="p-2 bg-purple-800 bg-opacity-70 rounded-lg backdrop-blur-sm border border-purple-500">
							{folder.icon}
						</div>
						<span className="text-sm bg-gray-900 bg-opacity-70 px-2 py-1 rounded">
							{folder.name}
						</span>
					</div>
				</motion.div>
			);
		});
	};

	// Return loading screen if system is booting
	if (isBooting) {
		return (
			<div className="min-h-screen bg-black flex flex-col items-center justify-center">
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="text-center"
				>
					<div className="text-purple-500 text-4xl font-bold mb-8">
						OS Simulator
					</div>
					<div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
						<motion.div
							className="h-full bg-gradient-to-r from-purple-600 to-purple-400"
							style={{ width: `${bootProgress}%` }}
						/>
					</div>
					<div className="mt-4 text-purple-300 font-mono">
						{bootProgress < 30 && "Initializing system..."}
						{bootProgress >= 30 &&
							bootProgress < 60 &&
							"Loading kernel modules..."}
						{bootProgress >= 60 && bootProgress < 90 && "Starting services..."}
						{bootProgress >= 90 && "Launching desktop environment..."}
					</div>
					<div className="mt-8 text-gray-500 text-sm font-mono">
						{`[${bootProgress}/100]`}
					</div>
				</motion.div>
			</div>
		);
	}

	return (
		<div
			style={{
				background: `url("https://www.apple.com/v/macbook-air/l/images/overview/macos_bg__ge2ns7km2fue_large_2x.jpg")`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
				backgroundAttachment: "fixed",
			}}
			className="relative min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 overflow-hidden"
		>
			{/* Background Grid */}
			<div className="absolute inset-0 bg-grid-pattern opacity-20"></div>

			{/* Desktop Folders */}
			{renderFolders()}

			{/* OS Simulator Icon */}
			{/* <motion.div
				className="absolute flex flex-col items-center space-y-2 cursor-pointer group text-white "
				style={{ left: 30, top: 30 }}
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.95 }}
				onClick={() => setOpenWindows((prev) => ({ ...prev, modules: true }))}
			>
				<div className="p-2 bg-purple-800 bg-opacity-70 rounded-lg backdrop-blur-sm border border-purple-500">
					<Grid className="w-12 h-12 group-hover:text-purple-400" />
				</div>
				<span className="text-sm bg-gray-900 bg-opacity-70 px-2 py-1 rounded">
					OS Simulator
				</span>
			</motion.div> */}

			{/* Gnome Style Navbar */}
			<div className="fixed top-0 left-0 w-full bg-gradient-to-r from-purple-900 to-indigo-900 text-white flex items-center justify-between px-4 py-2 shadow-md z-40">
				{/* Welcome Message */}
				<div className="flex items-center space-x-2">
					<Cpu className="w-4 h-4" />
					<span>CyberOS</span>
				</div>

				{/* Date, Day, and Time */}
				<div className="text-sm flex items-center space-x-4">
					<div className="bg-purple-800 px-3 py-1 rounded-full text-xs">
						{currentTime.toLocaleDateString([], {
							weekday: "long",
							month: "short",
							day: "numeric",
						})}
					</div>
					<div className="bg-purple-800 px-3 py-1 rounded-full text-xs">
						{currentTime.toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
						})}
					</div>
				</div>

				{/* System Icons */}
				<div className="flex items-center space-x-4 text-white">
					<div className="bg-purple-800 px-2 py-1 rounded-full text-xs flex items-center">
						<Activity className="w-4 h-4 mr-1" />
						<span>{weather.temp}°C</span>
					</div>
				</div>
			</div>

			{/* Windows */}
			<AnimatePresence>
				{openWindows.modules && (
					<DraggableWindow
						title="OS Simulator Modules"
						isOpen={openWindows.modules}
						onClose={() => closeWindow("modules")}
						initialPosition={{ x: 100, y: 100 }}
					>
						{renderModuleContent()}
					</DraggableWindow>
				)}

				{openWindows.team && (
					<DraggableWindow
						title="Team Details"
						isOpen={openWindows.team}
						onClose={() => closeWindow("team")}
						initialPosition={{ x: 150, y: 120 }}
					>
						{renderTeamContent()}
					</DraggableWindow>
				)}

				{openWindows.code && (
					<DraggableWindow
						title="Source Code"
						isOpen={openWindows.code}
						onClose={() => closeWindow("code")}
						initialPosition={{ x: 200, y: 150 }}
					>
						{renderCodeContent()}
					</DraggableWindow>
				)}

				{openWindows.about && (
					<DraggableWindow
						title="About OS Simulator"
						isOpen={openWindows.about}
						onClose={() => closeWindow("about")}
						initialPosition={{ x: 250, y: 180 }}
					>
						{renderAboutContent()}
					</DraggableWindow>
				)}
			</AnimatePresence>

			{/* Right-click context menu could be added here */}
		</div>
	);
};

export default NewHome;
