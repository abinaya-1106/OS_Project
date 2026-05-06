// TeamPage.js

import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users } from "lucide-react";

// Team Members Data - same as in NewHome
// Same projects array from NewHome
const teamMembers = [
	{
		name: "S Ashwin",
		role: "Developer",
		modules: [
			"System Calls",
			"Network Calls",
			],
	},
	{
		name: "R Shiva Kumar",
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
		name: "S A Abinaya",
		role: "Developer",
		modules: ["Page Replacement"],
	},
	{ name: "Swaraj", role: "Developer", modules: ["File Allocation"] },
	{ name: "Shashank", role: "Developer", modules: ["Synchronization"] },
];

const TeamPage = () => {
	const navigate = useNavigate();

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
				<h1 className="text-4xl font-bold text-purple-300">Development Team</h1>
			</div>

			{/* Team content */}
			<div className="max-w-7xl mx-auto">
				<div className="mb-8">
					<div className="flex items-center space-x-3 mb-4">
						<Users size={24} className="text-purple-400" />
						<h2 className="text-2xl font-bold text-purple-300">
							Meet Our Team
						</h2>
					</div>
					<p className="text-lg text-gray-300">
						Our talented team of developers worked together to create this
						comprehensive OS simulation platform, each contributing their
						expertise to different modules.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  pb-[200px]">
					{teamMembers.map((member, index) => (
						<div
							key={index}
							className="bg-gradient-to-br from-purple-900 to-indigo-900 p-6 rounded-lg shadow-lg border border-purple-500 hover:scale-105 transition-transform"
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
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default TeamPage;
