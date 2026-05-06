import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
} from "lucide-react";

// Initial projects array with original creator names
const projects = [
	{
		name: "Boot Sequence Visualization",

		builtBy: ["Shanjiv A"],
		icon: <Power className="w-6 h-6" />,
		path: "/boot-sequence",
		description:
			"Step-by-step visualization of system startup from power-on to user interface",
		algorithms:
			"BIOS initialization, bootloader execution, kernel loading, service initialization",
	},
	{
		name: "Banker's Algorithm",

		builtBy: ["Raju Kumar"],
		icon: <Lock className="w-6 h-6" />,
		path: "/bankers-algorithm",
		description:
			"Resource allocation and deadlock avoidance algorithm simulation",
		algorithms:
			"Safety algorithm, resource-request algorithm, deadlock detection",
	},
	{
		name: "Contiguous Memory Allocation",

		builtBy: ["R Shiva Kumar"],
		icon: <Layers className="w-6 h-6" />,
		path: "/contiguous-memory-allocation",
		description:
			"Visual comparison of memory allocation strategies to understand fragmentation",
		algorithms: "First-fit, best-fit, worst-fit memory allocation strategies",
	},
	{
		name: "CPU Scheduling",

		builtBy: ["Shreyas Lal"],
		icon: <Cpu className="w-6 h-6" />,
		path: "/cpu-scheduling",
		description:
			"Interactive simulation of different CPU scheduling policies with metrics",
		algorithms:
			"FCFS, SJF, Priority, Round Robin, Multilevel Queue, Multilevel Feedback Queue",
	},
	{
		name: "Disk Scheduling",

		builtBy: ["Sanjay S Bhat"],
		icon: <HardDrive className="w-6 h-6" />,
		path: "/disk-scheduling",
		description:
			"Visualization of disk head movement under different scheduling approaches",
		algorithms: "FCFS, SSTF, SCAN, C-SCAN, LOOK and C-LOOK algorithms",
	},
	{
		name: "Linux Root File System (File Organization)",

		builtBy: ["Shanjiv A"],
		icon: <FileText className="w-6 h-6" />,
		path: "/linux-root-filesystem",
		description:
			"Navigate through the Linux file system hierarchy with explanations",
		algorithms: "Directory traversal, inode management, permission control",
	},
	{
		name: "Memory Management",

		builtBy: ["Sugavasi Lalitha"],
		icon: <Grid className="w-6 h-6" />,
		path: "/memory-management",
		description:
			"Interactive visualization of virtual memory, paging, and segmentation",
		algorithms: "Page table management, TLB operation, segmentation addressing",
	},
	{
		name: "Page Replacement",

		builtBy: ["S A Abinaya"],
		icon: <Activity className="w-6 h-6" />,
		path: "/page-replacement",
		description:
			"Compare page replacement algorithms with customizable page reference strings",
		algorithms: "FIFO, LRU, Optimal, MRU, LFU",
	},
	{
		name: "System Calls",

		builtBy: ["S Ashwin"],
		icon: <Terminal className="w-6 h-6" />,
		path: "/system-calls",
		description:
			"Interactive exploration of the system call interface and execution flow",
		algorithms:
			"Trap mechanism, kernel mode transition, system call table lookup",
	},
	{
		name: "File Allocation",

		builtBy: ["Swaraj"],
		icon: <FileCog className="w-6 h-6" />,
		path: "/file-allocation",
		description:
			"Compare different file allocation methods with visual representation",
		algorithms: "Contiguous, linked, indexed, and FAT-based allocation",
	},
	{
		name: "Synchronization",

		builtBy: ["Shashank"],
		icon: <Database className="w-6 h-6" />,
		path: "/synchronization",
		description:
			"Visualize process synchronization mechanisms and race condition prevention",
		algorithms:
			"Mutex, binary/counting semaphores, monitors, readers-writers problem",
	},
];

// Team members data based on the initial project creators
const teamMembers = [
	{
		name: "R Shiva Kumar",
		role: "Core Systems Developer",
		contributions:
			"Boot sequence visualization, contiguous memory allocation, Linux root file system",
		image: "/api/placeholder/120/120",
		github: "https://github.com/Shiv9936A",
	},
	{
		name: "Raju Kumar",
		role: "Security Algorithms Specialist",
		contributions: "Banker's algorithm implementation and deadlock avoidance",
		image: "/api/placeholder/120/120",
		github: "https://github.com/Raju-Kumar-9",
	},
	{
		name: "Shreyas Lal",
		role: "Process Management Engineer",
		contributions: "CPU scheduling algorithms and performance metrics",
		image: "/api/placeholder/120/120",
		github: "https://github.com/shreyaslal",
	},
	{
		name: "Sanjay S Bhat",
		role: "Storage Systems Expert",
		contributions: "Disk scheduling algorithm implementation and optimization",
		image: "/api/placeholder/120/120",
		github: "https://github.com/sanjaysbhat",
	},
	{
		name: "Sugavasi Lalitha",
		role: "Memory Management Specialist",
		contributions: "Virtual memory systems and address translation",
		image: "/api/placeholder/120/120",
		github: "https://github.com/sugavasil",
	},
	{
		name: "S A Abinaya",
		role: "Cache Algorithm Developer",
		contributions: "Page replacement algorithms and simulation frameworks",
		image: "/api/placeholder/120/120",
		github: "https://github.com/abinaya-1106",
	},
	{
		name: "S Ashwin",
		role: "Kernel Interface Developer",
		contributions:
			"System calls implementation and user-kernel mode transitions",
		image: "/api/placeholder/120/120",
		github: "https://github.com/sahilmengji",
	},
	{
		name: "Swaraj",
		role: "File Systems Engineer",
		contributions: "File allocation strategies and storage optimization",
		image: "/api/placeholder/120/120",
		github: "https://github.com/swaraj",
	},
	{
		name: "Shashank",
		role: "Concurrency Control Specialist",
		contributions: "Process synchronization and race condition prevention",
		image: "/api/placeholder/120/120",
		github: "https://github.com/shashank",
	},
];

// Animation variants
const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
};

const itemVariants = {
	hidden: { y: 20, opacity: 0 },
	visible: {
		y: 0,
		opacity: 1,
		transition: {
			type: "spring",
			stiffness: 100,
		},
	},
};

const Home = () => {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 text-gray-800">
			{/* Hero Section */}
			<motion.div
				className="pt-20 pb-16 px-6 max-w-6xl mx-auto text-center"
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
			>
				<motion.div
					className="inline-block mb-6 p-2 bg-blue-100 rounded-full"
					initial={{ scale: 0.8, rotate: -10 }}
					animate={{ scale: 1, rotate: 0 }}
					transition={{ duration: 0.5, type: "spring" }}
				>
					<Cpu className="w-10 h-10 text-blue-600" />
				</motion.div>
				<motion.h1
					className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
					initial={{ scale: 0.8 }}
					animate={{ scale: 1 }}
					transition={{ duration: 0.5 }}
				>
					Operating System Laboratories
				</motion.h1>
				<motion.p
					className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3 }}
				>
					Interactive simulations and visualizations of core operating system
					concepts and algorithms to enhance your understanding of computer
					systems fundamentals.
				</motion.p>
				<motion.div
					className="flex justify-center space-x-4"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.5 }}
				>
					<motion.button
						className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						Explore Simulations
					</motion.button>
					<motion.button
						className="bg-transparent border-2 border-blue-600 text-blue-600 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-blue-50 transition-colors"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						View Source <GitBranch className="inline ml-1 w-4 h-4" />
					</motion.button>
				</motion.div>
			</motion.div>

			{/* Terminal-like Animated Banner */}
			<motion.div
				className="py-10 bg-gray-900 text-green-400 overflow-hidden relative"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.6 }}
			>
				<div className="max-w-6xl mx-auto px-6">
					<div className="flex items-center space-x-3 mb-4">
						<div className="w-3 h-3 rounded-full bg-red-500"></div>
						<div className="w-3 h-3 rounded-full bg-yellow-500"></div>
						<div className="w-3 h-3 rounded-full bg-green-500"></div>
						<div className="text-xs text-gray-400 ml-2">bash ~ OSLabs</div>
					</div>
					<motion.div
						className="font-mono text-sm leading-loose"
						initial={{ x: -20, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						transition={{ delay: 0.8, duration: 0.5 }}
					>
						<p className="mb-1">
							<span className="text-blue-400">$</span> sudo initialize
							operating_systems_lab
						</p>
						<p className="mb-1">[INFO] Loading kernel modules...</p>
						<p className="mb-1">
							[INFO] Initializing memory management subsystem...
						</p>
						<p className="mb-1">[INFO] Starting process scheduler...</p>
						<p>
							<span className="text-yellow-400">System ready</span> - All
							subsystems initialized successfully
						</p>
					</motion.div>
				</div>
			</motion.div>

			{/* Features Section */}
			<motion.div
				className="py-16 bg-white shadow-sm"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.5 }}
			>
				<div className="max-w-6xl mx-auto px-6">
					<h2 className="text-3xl font-bold mb-10 text-center">
						Why Explore These Simulations?
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-10">
						<motion.div
							className="flex flex-col items-center text-center p-6 bg-blue-50 rounded-xl"
							whileHover={{ y: -5 }}
						>
							<div className="bg-blue-100 p-4 rounded-full mb-4">
								<Code className="w-8 h-8 text-blue-600" />
							</div>
							<h3 className="text-xl font-semibold mb-2">
								Interactive Learning
							</h3>
							<p className="text-gray-600">
								Visualize complex algorithms and see how they work in real-time
								with adjustable parameters and step-by-step execution.
							</p>
						</motion.div>
						<motion.div
							className="flex flex-col items-center text-center p-6 bg-purple-50 rounded-xl"
							whileHover={{ y: -5 }}
						>
							<div className="bg-purple-100 p-4 rounded-full mb-4">
								<Terminal className="w-8 h-8 text-purple-600" />
							</div>
							<h3 className="text-xl font-semibold mb-2">
								Practical Implementation
							</h3>
							<p className="text-gray-600">
								See the code behind each concept and understand how theoretical
								principles translate to practical system implementations.
							</p>
						</motion.div>
						<motion.div
							className="flex flex-col items-center text-center p-6 bg-green-50 rounded-xl"
							whileHover={{ y: -5 }}
						>
							<div className="bg-green-100 p-4 rounded-full mb-4">
								<Star className="w-8 h-8 text-green-600" />
							</div>
							<h3 className="text-xl font-semibold mb-2">
								Expert Contributions
							</h3>
							<p className="text-gray-600">
								Each module is built by specialists in operating systems,
								ensuring accuracy and educational value across all simulations.
							</p>
						</motion.div>
					</div>
				</div>
			</motion.div>

			{/* Team Members Section - Using the creators from initial projects array */}
			<div className="py-16 px-6 max-w-6xl mx-auto">
				<h2 className="text-3xl font-bold mb-4 text-center">
					Meet the Kernel Team
				</h2>
				<p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
					Our multidisciplinary team brings together expertise in operating
					systems design, algorithm optimization, and interactive learning to
					create comprehensive simulations.
				</p>

				<motion.div
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
					variants={containerVariants}
					initial="hidden"
					animate="visible"
				>
					{teamMembers.map((member, index) => (
						<motion.div
							key={index}
							variants={itemVariants}
							className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
							whileHover={{ y: -5 }}
						>
							<div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-600">
								<div className="bg-white p-6 rounded-t-lg">
									<div className="flex items-center mb-4">
										<img
											src={member.image}
											alt={member.name}
											className="w-16 h-16 rounded-full object-cover mr-4"
										/>
										<div>
											<h3 className="font-bold text-lg">{member.name}</h3>
											<p className="text-blue-600">{member.role}</p>
										</div>
									</div>
									<div className="bg-gray-50 p-4 rounded-lg mb-4">
										<h4 className="text-sm font-semibold text-gray-500 mb-2">
											CONTRIBUTIONS:
										</h4>
										<p className="text-gray-700">{member.contributions}</p>
									</div>
									<a
										href={member.github}
										className="text-sm flex items-center text-gray-500 hover:text-blue-600"
										target="_blank"
										rel="noopener noreferrer"
									>
										<GitBranch className="w-4 h-4 mr-1" /> GitHub Profile
										<ExternalLink className="w-3 h-3 ml-1" />
									</a>
								</div>
							</div>
						</motion.div>
					))}
				</motion.div>
			</div>

			{/* Projects Grid - Using the original creators */}
			<div className="py-16 px-6 max-w-6xl mx-auto bg-gray-50 rounded-2xl">
				<h2 className="text-3xl font-bold mb-4 text-center">
					OS Simulation Modules
				</h2>
				<p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
					Explore our collection of interactive operating system simulations
					designed to help you understand key concepts through hands-on
					visualization and experimentation.
				</p>

				<motion.div
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
					variants={containerVariants}
					initial="hidden"
					animate="visible"
				>
					{projects.map((project, index) => (
						<motion.div key={index} variants={itemVariants}>
							<Link to={project.path}>
								<motion.div
									className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full"
									whileHover={{
										y: -8,
										backgroundColor: "#f8fafc",
										boxShadow:
											"0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
									}}
								>
									<div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600">
										<div className="bg-white rounded-lg p-6">
											<div className="flex justify-center mb-4 text-blue-600">
												{project.icon}
											</div>
											<h3 className="text-xl font-bold mb-3 text-center text-gray-800">
												{project.name}
											</h3>
											<p className="text-gray-600 text-center text-sm mb-4">
												{project.description}
											</p>
											<div className="bg-blue-50 p-3 rounded-lg mb-3">
												<h4 className="text-xs font-semibold text-blue-600 mb-1">
													ALGORITHMS:
												</h4>
												<p className="text-gray-700 text-sm">
													{project.algorithms}
												</p>
											</div>
											<div className="flex items-center justify-center text-xs text-gray-500">
												<Users className="w-3 h-3 mr-1" />
												<span>Built by: {project.builtBy.join(", ")}</span>
											</div>
										</div>
									</div>
								</motion.div>
							</Link>
						</motion.div>
					))}
				</motion.div>
			</div>

			{/* Call to Action */}
			<motion.div
				className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.8 }}
			>
				<div className="max-w-4xl mx-auto px-6">
					<motion.div
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ delay: 1, duration: 0.5 }}
						className="mb-6"
					>
						<Terminal className="w-16 h-16 inline-block" />
					</motion.div>
					<h2 className="text-3xl font-bold mb-4">
						Ready to Master Operating Systems?
					</h2>
					<p className="text-xl mb-8 opacity-90">
						Dive into our interactive projects and strengthen your understanding
						of key concepts through hands-on experience.
					</p>
					<div className="flex flex-col sm:flex-row justify-center gap-4">
						<motion.button
							className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-blue-50 transition-colors"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							Get Started
						</motion.button>
						<motion.button
							className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-white hover:bg-opacity-10 transition-colors"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							View Documentation
						</motion.button>
					</div>
				</div>
			</motion.div>

			{/* Footer */}
			<div className="py-10 bg-gray-800 text-gray-400">
				<div className="max-w-6xl mx-auto px-6">
					<div className="flex flex-col md:flex-row justify-between items-center mb-8">
						<div className="flex items-center mb-4 md:mb-0">
							<Cpu className="w-6 h-6 mr-2 text-blue-400" />
							<span className="text-white font-bold text-lg">OS Labs</span>
						</div>
						<div className="flex space-x-4">
							<a
								href="#"
								className="text-gray-400 hover:text-white transition-colors"
							>
								Documentation
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-white transition-colors"
							>
								GitHub
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-white transition-colors"
							>
								Contribute
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-white transition-colors"
							>
								Contact
							</a>
						</div>
					</div>
					<div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
						<p>
							© {new Date().getFullYear()} Operating System Laboratories. All
							rights reserved.
						</p>
						<p className="mt-2 md:mt-0">
							Built with <span className="text-red-400">♥</span> by the Kernel
							Team
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
