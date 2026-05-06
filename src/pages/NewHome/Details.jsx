// DetailsPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Code, Info, Github, Star } from "lucide-react";

const DetailsPage = () => {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState("about"); // 'about' or 'code'

	// Render about content - same as renderAboutContent from NewHome
	const renderAboutContent = () => {
		return (
			<div className="text-white max-w-5xl mx-auto">
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

	// Render source code content - same as renderCodeContent from NewHome
	const renderCodeContent = () => {
		return (
			<div className="text-white max-w-5xl mx-auto">
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
								<span>https://github.com/abinaya-1106/OS_Project</span>
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
							git clone https://github.com/abinaya-1106/OS_Project
						</div>
					</div>

					<div className="mt-6 bg-gray-800 p-4 rounded-lg">
						<h4 className="font-semibold mb-2">Contributors</h4>
						<div className="flex flex-wrap gap-2">
							<div className="flex items-center space-x-2 bg-gray-900 px-3 py-2 rounded-lg">
								<Star className="w-4 h-4 text-yellow-400" />
								<span>Sahil Mengji</span>
							</div>
							<div className="flex items-center space-x-2 bg-gray-900 px-3 py-2 rounded-lg">
								<Star className="w-4 h-4 text-yellow-400" />
								<span>Shanjiv A</span>
							</div>
							<div className="flex items-center space-x-2 bg-gray-900 px-3 py-2 rounded-lg">
								<Star className="w-4 h-4 text-yellow-400" />
								<span>S Ashwin</span>
							</div>
							{/* Add more contributors */}
						</div>
					</div>
				</div>
			</div>
		);
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
					onClick={() => navigate("/")}
					className="bg-purple-700 hover:bg-purple-600 text-white p-2 rounded-full mr-4"
				>
					<ArrowLeft size={24} />
				</button>
				<h1 className="text-4xl font-bold text-purple-300">Project Details</h1>
			</div>

			{/* Tab navigation */}
			<div className="max-w-5xl mx-auto mb-6">
				<div className="flex border-b border-purple-500">
					<button
						className={`py-3 px-6 ${
							activeTab === "about"
								? "bg-purple-800 text-white font-medium"
								: "bg-transparent text-purple-300"
						} rounded-t-lg flex items-center space-x-2`}
						onClick={() => setActiveTab("about")}
					>
						<Info size={18} />
						<span>About</span>
					</button>
					<button
						className={`py-3 px-6 ${
							activeTab === "code"
								? "bg-purple-800 text-white font-medium"
								: "bg-transparent text-purple-300"
						} rounded-t-lg flex items-center space-x-2`}
						onClick={() => setActiveTab("code")}
					>
						<Code size={18} />
						<span>Source Code</span>
					</button>
				</div>
			</div>

			{/* Content based on active tab */}
			{activeTab === "about" ? renderAboutContent() : renderCodeContent()}
		</div>
	);
};

export default DetailsPage;
