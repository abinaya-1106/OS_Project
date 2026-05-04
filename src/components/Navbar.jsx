import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {
	const [currentTime, setCurrentTime] = useState(new Date());
	const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

	// Update the time every second
	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);
		return () => clearInterval(timer);
	}, []);

	return (
		<>
			{/* Start Menu Popup */}
			{isStartMenuOpen && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 20 }}
					className="fixed bottom-12 left-2 w-64 bg-gradient-to-br from-purple-900 to-gray-900 backdrop-blur-md bg-opacity-95 rounded-lg shadow-xl border border-purple-500 z-50 overflow-hidden"
				>
					<div className="p-3 bg-gradient-to-r from-purple-800 to-indigo-900 border-b border-purple-700">
						<span className="text-white font-bold">CyberOS</span>
					</div>
					<div className="p-2">
						<motion.div
							className="flex items-center space-x-3 p-2 hover:bg-purple-800 rounded-md cursor-pointer"
							whileHover={{ scale: 1.03 }}
							whileTap={{ scale: 0.97 }}
							onClick={() => setIsStartMenuOpen(false)}
						>
							<svg className="w-5 h-5 text-purple-300" viewBox="0 0 24 24">
								<path
									fill="currentColor"
									d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"
								/>
							</svg>
							<span className="text-white">Home</span>
						</motion.div>
						<motion.div
							className="flex items-center space-x-3 p-2 hover:bg-purple-800 rounded-md cursor-pointer"
							whileHover={{ scale: 1.03 }}
							whileTap={{ scale: 0.97 }}
							onClick={() => setIsStartMenuOpen(false)}
						>
							<svg className="w-5 h-5 text-purple-300" viewBox="0 0 24 24">
								<path
									fill="currentColor"
									d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M8,13H16V15H8V13M8,17H16V19H8V17Z"
								/>
							</svg>
							<span className="text-white">Details</span>
						</motion.div>
						<motion.div
							className="flex items-center space-x-3 p-2 hover:bg-purple-800 rounded-md cursor-pointer"
							whileHover={{ scale: 1.03 }}
							whileTap={{ scale: 0.97 }}
							onClick={() => setIsStartMenuOpen(false)}
						>
							<svg className="w-5 h-5 text-purple-300" viewBox="0 0 24 24">
								<path
									fill="currentColor"
									d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"
								/>
							</svg>
							<span className="text-white">Settings</span>
						</motion.div>
					</div>
				</motion.div>
			)}

			{/* Taskbar */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="fixed bottom-0 left-0 right-0 h-12 bg-gradient-to-r from-gray-900 via-purple-900 to-indigo-900 flex items-center px-2 shadow-lg z-40 backdrop-blur-md border-t border-purple-700"
			>
				{/* Start button (Windows logo with cyber theme) */}
				<motion.button
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					className="h-10 w-10 flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-800 hover:from-purple-500 hover:to-indigo-700 mr-2 rounded-md shadow-md border border-purple-500"
					onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
				>
					<svg className="w-6 h-6 text-white" viewBox="0 0 24 24">
						<path
							fill="currentColor"
							d="M3 3H11V11H3V3M3 13H11V21H3V13M13 3H21V11H13V3M13 13H21V21H13V13Z"
						/>
					</svg>
				</motion.button>
				<Link to="/">
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="h-10 px-4 flex items-center justify-center bg-gradient-to-r from-purple-800 to-indigo-900 hover:from-purple-700 hover:to-indigo-800 mx-1 rounded-md text-white shadow-md border border-purple-600"
					>
						<svg className="w-5 h-5 mr-2 text-purple-300" viewBox="0 0 24 24">
							<path
								fill="currentColor"
								d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"
							/>
						</svg>
						<span className="text-sm font-medium">Home</span>
					</motion.button>
				</Link>
				<Link to="/Modules">
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="h-10 px-4 flex items-center justify-center bg-gradient-to-r from-purple-800 to-indigo-900 hover:from-purple-700 hover:to-indigo-800 mx-1 rounded-md text-white shadow-md border border-purple-600"
					>
						<svg className="w-5 h-5 mr-2 text-purple-300" viewBox="0 0 24 24">
							<path
								fill="currentColor"
								d="M21,8A2,2 0 0,0 19,6H5A2,2 0 0,0 3,8V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V8M19,19H5V8H19V19M9,18H6V13H9V18M13,16H10V13H13V16M17,14H14V13H17V14M9,11H6V9H9V11M13,11H10V9H13V11M17,11H14V9H17V11Z"
							/>
						</svg>
						<span className="text-sm font-medium">Modules</span>
					</motion.button>
				</Link>

				<Link to="/team">
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="h-10 px-4 flex items-center justify-center bg-gradient-to-r from-purple-800 to-indigo-900 hover:from-purple-700 hover:to-indigo-800 mx-1 rounded-md text-white shadow-md border border-purple-600"
					>
						<svg className="w-5 h-5 mr-2 text-purple-300" viewBox="0 0 24 24">
							<path
								fill="currentColor"
								d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z"
							/>
						</svg>
						<span className="text-sm font-medium">Team</span>
					</motion.button>
				</Link>
				{/* Home Page Button */}

				{/* Details Page Button */}
				<Link to="/details">
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="h-10 px-4 flex items-center justify-center bg-gradient-to-r from-purple-800 to-indigo-900 hover:from-purple-700 hover:to-indigo-800 mx-1 rounded-md text-white shadow-md border border-purple-600"
					>
						<svg className="w-5 h-5 mr-2 text-purple-300" viewBox="0 0 24 24">
							<path
								fill="currentColor"
								d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M8,13H16V15H8V13M8,17H16V19H8V17Z"
							/>
						</svg>
						<span className="text-sm font-medium">Details</span>
					</motion.button>
				</Link>

				{/* Active window indicators */}
				<div className="flex space-x-1 mx-2">
					<div className="w-1 h-4 bg-purple-400 rounded-full"></div>
					<div className="w-1 h-4 bg-purple-600 rounded-full"></div>
				</div>

				{/* Time display with cyber styling */}
				<motion.div
					whileHover={{ scale: 1.05 }}
					className="ml-auto bg-gradient-to-r from-purple-800 to-indigo-900 py-1 px-4 rounded-md text-white text-sm flex items-center justify-center shadow-md border border-purple-600"
				>
					<svg className="w-4 h-4 mr-2 text-purple-300" viewBox="0 0 24 24">
						<path
							fill="currentColor"
							d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"
						/>
					</svg>
					<span className="font-mono">
						{currentTime.toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
						})}
					</span>
				</motion.div>

				{/* System tray */}
				<motion.div
					whileHover={{ scale: 1.05 }}
					className="ml-2 bg-gradient-to-r from-purple-800 to-indigo-900 h-8 px-2 rounded-md flex items-center space-x-2 shadow-md border border-purple-600"
				>
					<svg className="w-4 h-4 text-purple-300" viewBox="0 0 24 24">
						<path
							fill="currentColor"
							d="M12,21L15.6,16.2C14.6,15.45 13.35,15 12,15C10.65,15 9.4,15.45 8.4,16.2L12,21M12,3C7.95,3 4.21,4.34 1.2,6.6L3,9C5.5,7.12 8.62,6 12,6C15.38,6 18.5,7.12 21,9L22.8,6.6C19.79,4.34 16.05,3 12,3M12,9C9.3,9 6.81,9.89 4.8,11.4L6.6,13.8C8.1,12.67 9.97,12 12,12C14.03,12 15.9,12.67 17.4,13.8L19.2,11.4C17.19,9.89 14.7,9 12,9Z"
						/>
					</svg>
					<svg className="w-4 h-4 text-purple-300" viewBox="0 0 24 24">
						<path
							fill="currentColor"
							d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z"
						/>
					</svg>
					<svg className="w-4 h-4 text-purple-300" viewBox="0 0 24 24">
						<path
							fill="currentColor"
							d="M16,17H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z"
						/>
					</svg>
				</motion.div>
			</motion.div>
		</>
	);
}
