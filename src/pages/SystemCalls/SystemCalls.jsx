import React from "react";
import { useNavigate } from "react-router-dom";

export default function SystemCalls() {
	const navigate = useNavigate();

	const handleNavigation = (path) => {
		navigate(path);
	};

	return (
		<div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen p-6">
			<div className="max-w-6xl mx-auto">
				<header className="mb-12 text-center">
					<div className="inline-block p-2 px-6 mb-4 bg-blue-500 bg-opacity-20 backdrop-blur-lg rounded-full">
						<h1 className="text-4xl font-bold text-white">System Calls</h1>
					</div>
					<p className="text-xl text-blue-200">
						Understanding the interface between user programs and the operating
						system
					</p>
				</header>

				<section className="mb-12 backdrop-blur-md bg-white bg-opacity-10 rounded-xl shadow-2xl p-8 border border-white border-opacity-20">
					<h2 className="text-3xl font-semibold mb-6 text-white">
						What are System Calls?
					</h2>
					<p className="mb-4 text-gray-200 text-lg">
						System calls are the programmatic way in which a computer program
						requests a service from the kernel of the operating system. They
						provide an interface between a process and the operating system,
						allowing user-level programs to request services from the operating
						system kernel.
					</p>
					<p className="mb-4 text-gray-200 text-lg">
						System calls are essential because user programs cannot directly
						access hardware resources. Instead, they must request the operating
						system to perform operations on their behalf through system calls,
						which operate in kernel mode with higher privileges.
					</p>
				</section>

				<section className="mb-12 backdrop-blur-md bg-white bg-opacity-10 rounded-xl shadow-2xl p-8 border border-white border-opacity-20">
					<h2 className="text-3xl font-semibold mb-6 text-white">
						Types of System Calls
					</h2>
					<div className="grid md:grid-cols-2 gap-6">
						<div className="backdrop-blur-sm bg-white bg-opacity-5 p-6 rounded-lg border border-white border-opacity-10 hover:bg-opacity-10 transition-all">
							<h3 className="text-2xl font-medium text-blue-300">
								1. Process Management
							</h3>
							<p className="text-gray-300">
								Handles process creation, termination, loading, execution, and
								process attributes. Examples include fork(), exec(), exit(), and
								wait().
							</p>
						</div>

						<div className="backdrop-blur-sm bg-white bg-opacity-5 p-6 rounded-lg border border-white border-opacity-10 hover:bg-opacity-10 transition-all">
							<h3 className="text-2xl font-medium text-green-300">
								2. Memory Management
							</h3>
							<p className="text-gray-300">
								Allocates and deallocates memory space, and manages memory
								protection. Examples include malloc(), free(), and mmap().
							</p>
						</div>

						<div className="backdrop-blur-sm bg-white bg-opacity-5 p-6 rounded-lg border border-white border-opacity-10 hover:bg-opacity-10 transition-all">
							<h3 className="text-2xl font-medium text-yellow-300">
								3. File Management
							</h3>
							<p className="text-gray-300">
								Creates, deletes, opens, closes, reads, and writes files.
								Examples include open(), close(), read(), and write().
							</p>
						</div>

						<div className="backdrop-blur-sm bg-white bg-opacity-5 p-6 rounded-lg border border-white border-opacity-10 hover:bg-opacity-10 transition-all">
							<h3 className="text-2xl font-medium text-purple-300">
								4. Device Management
							</h3>
							<p className="text-gray-300">
								Requests and releases devices, and handles device attributes.
								Examples include ioctl() and read/write operations on device
								files.
							</p>
						</div>

						<div className="backdrop-blur-sm bg-white bg-opacity-5 p-6 rounded-lg border border-white border-opacity-10 hover:bg-opacity-10 transition-all">
							<h3 className="text-2xl font-medium text-pink-300">
								5. Information Maintenance
							</h3>
							<p className="text-gray-300">
								Transfers information between user programs and the operating
								system. Examples include time(), date(), and getpid().
							</p>
						</div>

						<div className="backdrop-blur-sm bg-white bg-opacity-5 p-6 rounded-lg border border-white border-opacity-10 hover:bg-opacity-10 transition-all">
							<h3 className="text-2xl font-medium text-red-300">
								6. Communication
							</h3>
							<p className="text-gray-300">
								Creates and manages communication channels between processes.
								Examples include pipe(), socket(), and message queues.
							</p>
						</div>
					</div>
				</section>

				<h2 className="text-3xl font-semibold mb-6 text-white text-center">
					Explore System Call Modules
				</h2>
				<div className="grid md:grid-cols-3 gap-8 mb-12">
					{/* Process Management Card */}
					<div
						className="backdrop-blur-lg bg-gradient-to-br from-blue-600 to-blue-900 bg-opacity-70 rounded-xl overflow-hidden cursor-pointer transform transition hover:scale-105 shadow-xl border border-blue-500 border-opacity-40"
						onClick={() => handleNavigation("/process-management")}
					>
						<div className="p-6 backdrop-blur-sm">
							<h3 className="text-2xl font-semibold text-white mb-2">
								Process Management
							</h3>
							<div className="w-16 h-1 bg-blue-300 mb-4"></div>
							<p className="text-blue-100 mb-6">
								Learn about system calls related to process creation,
								termination, and control.
							</p>
							<button className="w-full px-4 py-3 bg-blue-900 bg-opacity-50 backdrop-blur-sm text-white rounded-lg hover:bg-opacity-70 transition-all border border-blue-400 border-opacity-30">
								Explore
							</button>
						</div>
					</div>

					{/* Memory Management Card */}
					<div
						className="backdrop-blur-lg bg-gradient-to-br from-green-600 to-green-900 bg-opacity-70 rounded-xl overflow-hidden cursor-pointer transform transition hover:scale-105 shadow-xl border border-green-500 border-opacity-40"
						onClick={() => handleNavigation("/memory-management-calls")}
					>
						<div className="p-6 backdrop-blur-sm">
							<h3 className="text-2xl font-semibold text-white mb-2">
								Memory Management
							</h3>
							<div className="w-16 h-1 bg-green-300 mb-4"></div>
							<p className="text-green-100 mb-6">
								Discover system calls for memory allocation, mapping, and
								protection.
							</p>
							<button className="w-full px-4 py-3 bg-green-900 bg-opacity-50 backdrop-blur-sm text-white rounded-lg hover:bg-opacity-70 transition-all border border-green-400 border-opacity-30">
								Explore
							</button>
						</div>
					</div>

					{/* Network Management Card */}
					<div
						className="backdrop-blur-lg bg-gradient-to-br from-purple-600 to-purple-900 bg-opacity-70 rounded-xl overflow-hidden cursor-pointer transform transition hover:scale-105 shadow-xl border border-purple-500 border-opacity-40"
						onClick={() => handleNavigation("/network-management")}
					>
						<div className="p-6 backdrop-blur-sm">
							<h3 className="text-2xl font-semibold text-white mb-2">
								Network Management
							</h3>
							<div className="w-16 h-1 bg-purple-300 mb-4"></div>
							<p className="text-purple-100 mb-6">
								Explore system calls for network communication, sockets, and
								protocols.
							</p>
							<button className="w-full px-4 py-3 bg-purple-900 bg-opacity-50 backdrop-blur-sm text-white rounded-lg hover:bg-opacity-70 transition-all border border-purple-400 border-opacity-30">
								Explore
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
