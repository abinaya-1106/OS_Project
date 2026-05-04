import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import "./index.css";

import Home from "./pages/Home/Home.jsx";
import Navbar from "./components/Navbar";

// OS Concepts Pages
import BankersAlgorithm from "./pages/BankersAlgorithm/BankersAlgorithm";
import ContiguousMemoryAllocation from "./pages/ContiguousMemoryAllocation/ContiguousMemoryAllocation";
import CpuScheduling from "./pages/CpuScheduling/CpuScheduling";
import DiskScheduling from "./pages/DiskScheduling/DiskScheduling";
import FileAllocation from "./pages/FileAllocation/FileAllocation";
import FileOrganization from "./pages/FileOrganization/FileOrganization";
import MemoryManagement from "./pages/MemoryManagement/MemoryManagement";
import PageReplacement from "./pages/PageReplacement/PageReplacement";
import SystemCalls from "./pages/SystemCalls/SystemCalls";
import ProcessManagment from "./pages/SystemCalls/ProcessManagment";
import ManagmentCalls from "./pages/SystemCalls/MemoryManagment";
import NetworkCalls from "./pages/SystemCalls/NetworkManagment";
// Synchronization (Nested under /synchronization)
import SyncHome from "./pages/Synchronization/Home";
import ProducerConsumers from "./pages/Synchronization/ProducerConsumer";
import ReaderWriter from "./pages/Synchronization/ReaderWriter";
import DiningPhilosopher from "./pages/Synchronization/DiningPhilosopher";

// Other Visualizations
import BootSequenceVisualization from "./pages/BootSequenceVisualizer/BootSequenceVisualization";
import LinuxRootFileSystem from "./pages/LinuxRootFileSystem/LinuxRootFileSystem";

import NewHome from "./pages/NewHome/NewHome";
import ModulesPage from "./pages/NewHome/Modules";
import TeamPage from "./pages/NewHome/Team";
import DetailsPage from "./pages/NewHome/Details";

export default function App() {
	return (
		<>
			<Navbar />
			<Routes>
				<Route path="/new-home" element={<Home />} />
				<Route path="/" element={<NewHome />} />
				<Route path="/modules" element={<ModulesPage />} />
				<Route path="/team" element={<TeamPage />} />
				<Route path="/details" element={<DetailsPage />} />
				<Route path="/bankers-algorithm" element={<BankersAlgorithm />} />
				<Route
					path="/contiguous-memory-allocation"
					element={<ContiguousMemoryAllocation />}
				/>
				<Route path="/cpu-scheduling" element={<CpuScheduling />} />
				<Route path="/disk-scheduling" element={<DiskScheduling />} />
				<Route path="/file-allocation" element={<FileAllocation />} />
				<Route path="/file-organization" element={<FileOrganization />} />
				<Route path="/memory-management" element={<MemoryManagement />} />
				<Route path="/page-replacement" element={<PageReplacement />} />
				<Route path="/system-calls" element={<SystemCalls />} />
				<Route path="/process-management" element={<ProcessManagment />} />
				<Route path="/memory-management-calls" element={<ManagmentCalls />} />
				<Route path="/network-management" element={<NetworkCalls />} />
				<Route path="/boot-sequence" element={<BootSequenceVisualization />} />
				<Route
					path="/linux-root-filesystem"
					element={<LinuxRootFileSystem />}
				/>

				{/* 🔁 Nested Synchronization Routes */}
				<Route
					path="/synchronization"
					element={
						<div className="w-full h-screen">
							<Outlet />
						</div>
					}
				>
					<Route index element={<SyncHome />} />
					<Route path="producer" element={<ProducerConsumers />} />
					<Route path="reader" element={<ReaderWriter />} />
					<Route path="dining" element={<DiningPhilosopher />} />
				</Route>
			</Routes>
		</>
	);
}
