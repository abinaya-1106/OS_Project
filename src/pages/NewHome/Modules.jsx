import React from "react";
import { useNavigate, Routes, Route, useLocation } from "react-router-dom";
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
	ArrowLeft,
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

const projects = [
	{
		name: "System Calls",
		component: SystemCalls,
		builtBy: ["S Ashwin"],
		icon: <Terminal className="w-10 h-10" />,
		path: "/system-calls",
		description: "Interactive demonstration of common system calls",
	},
	{
		name: "Banker's Algorithm",
		component: BankersAlgorithm,
		builtBy: ["Raju Kumar"],
		icon: <Lock className="w-10 h-10" />,
		path: "/bankers-algorithm",
		description:
			"Deadlock avoidance algorithm that tests for resource allocation safety",
	},
	{
		name: "Boot Sequence Visualization",
		component: BootSequenceVisualization,
		builtBy: ["R Shiva Kumar"],
		icon: <Power className="w-10 h-10" />,
		path: "/boot-sequence",
		description: "Visualize the OS boot sequence from BIOS to kernel loading",
	},
	{
		name: "Contiguous Memory Allocation",
		component: ContiguousMemoryAllocation,
		builtBy: ["R Shiva KUmar"],
		icon: <Layers className="w-10 h-10" />,
		path: "/contiguous-memory-allocation",
		description:
			"Simulate first-fit, best-fit, and worst-fit memory allocation strategies",
	},
	{
		name: "Linux Root File System",
		component: LinuxRootFileSystem,
		builtBy: ["Shanjiv A"],
		icon: <FileText className="w-10 h-10" />,
		path: "/linux-root-filesystem",
		description: "Interactive visualization of Linux directory structure",
	},
	{
		name: "CPU Scheduling",
		component: CpuScheduling,
		builtBy: ["Shreyas Lal"],
		icon: <Cpu className="w-10 h-10" />,
		path: "/cpu-scheduling",
		description:
			"Visualize FCFS, SJF, Priority, and Round Robin scheduling algorithms",
	},
	{
		name: "Disk Scheduling",
		component: DiskScheduling,
		builtBy: ["Sanjay S Bhat"],
		icon: <HardDrive className="w-10 h-10" />,
		path: "/disk-scheduling",
		description:
			"Explore FCFS, SSTF, SCAN, and C-SCAN disk scheduling algorithms",
	},

	{
		name: "Memory Management",
		component: MemoryManagement,
		builtBy: ["Sugavasi Lalitha"],
		icon: <Grid className="w-10 h-10" />,
		path: "/memory-management",
		description:
			"Simulate paging and segmentation memory management techniques",
	},
	{
		name: "Page Replacement",
		component: PageReplacement,
		builtBy: ["S A Abinaya"],
		icon: <Activity className="w-10 h-10" />,
		path: "/page-replacement",
		description: "Compare FIFO, LRU, MRU, LFU and Optimal page replacement algorithms",
	},

	{
		name: "File Allocation",
		component: FileAllocation,
		builtBy: ["Swaraj"],
		icon: <FileCog className="w-10 h-10" />,
		path: "/file-allocation",
		description:
			"Simulate contiguous, linked, and indexed file allocation methods",
	},
	{
		name: "Synchronization",
		component: SyncHome,
		builtBy: ["Shashank"],
		icon: <Database className="w-10 h-10" />,
		path: "/synchronization",
		description: "Explore process synchronization mechanisms and solutions",
	},
];

// Module List Component - Shows all available modules
const ModulesList = () => {
	const navigate = useNavigate();

	return (
		<div className="max-w-7xl mx-auto">
			<h2 className="text-3xl font-bold mb-6 text-purple-300">
				Operating System Modules
			</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-[200px]">
				{projects.map((project, index) => (
					<div
						key={index}
						className="flex flex-col items-center bg-gradient-to-br from-purple-900 to-indigo-900 p-6 rounded-lg shadow-lg cursor-pointer group border border-purple-500 backdrop-blur-sm transition-all hover:scale-105"
						onClick={() => navigate(project.path)}
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
							{project.description}
						</div>
						<div className="mt-4 px-3 py-1 bg-purple-600 text-white rounded-full text-xs">
							View Module
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

// Module Detail Component - Renders a specific module
const ModuleDetail = ({ project }) => {
	const navigate = useNavigate();

	return (
		<div className="text-white max-w-7xl mx-auto">
			{/* Back to All Modules Button */}
			<button
				className="mb-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-500 transition-colors"
				onClick={() => navigate("/modules")}
			>
				Back to All Modules
			</button>

			{/* Module Header */}
			<div className="mb-6 p-4 bg-gradient-to-r from-purple-900 to-indigo-900 rounded-lg backdrop-blur-sm">
				<div className="flex items-center space-x-4">
					<div className="p-3 bg-purple-700 rounded-full">{project.icon}</div>
					<div>
						<h2 className="text-xl font-bold">{project.name}</h2>
						<p className="text-purple-300">By: {project.builtBy.join(", ")}</p>
						<p className="mt-2">{project.description}</p>
					</div>
				</div>
			</div>

			{/* Active Project Component */}
			<div className="bg-gray-800 p-6 rounded-lg border border-purple-500">
				<project.component />
			</div>
		</div>
	);
};

const ModulesPage = () => {
	const navigate = useNavigate();
	const location = useLocation();

	// Function to handle back button click
	const handleBack = () => {
		if (location.pathname !== "/modules") {
			navigate("/modules");
		} else {
			navigate("/");
		}
	};

	return (
		<div
			className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-6"
			style={{
				backgroundImage: `url("https://www.apple.com/v/macbook-air/l/images/overview/macos_bg__ge2ns7km2fue_large_2x.jpg")`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
				backgroundAttachment: "fixed",
			}}
		>
			{/* Header with back button */}
			<div className="flex items-center mb-8">
				<button
					onClick={handleBack}
					className="bg-purple-700 hover:bg-purple-600 text-white p-2 rounded-full mr-4"
				>
					<ArrowLeft size={24} />
				</button>
				<h1 className="text-4xl font-bold text-purple-300">
					OS Simulator Modules
				</h1>
			</div>

			{/* Routes for module pages */}
			<Routes>
				<Route path="/" element={<ModulesList />} />

				{projects.map((project, index) => (
					<Route
						key={index}
						path={project.path.replace("/modules", "")}
						element={<ModuleDetail project={project} />}
					/>
				))}
			</Routes>
		</div>
	);
};

export default ModulesPage;
