import { useState } from "react";

export default function ConcurrencySimulations() {
	// Animation states
	const [hoverCard, setHoverCard] = useState(null);

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white p-6">
			<div className="max-w-4xl mx-auto">
				<header className="text-center py-12">
					<h1 className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
						Concurrency Simulations
					</h1>
					<p className="text-xl text-blue-200 mt-4">
						Interactive visualizations of classic concurrency problems in
						computer science
					</p>
				</header>

				<main className="my-12">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{/* Dining Philosophers Card */}
						<div
							className={`relative overflow-hidden rounded-xl transition-all duration-300 transform ${
								hoverCard === "dining" ? "scale-105" : ""
							}`}
							onMouseEnter={() => setHoverCard("dining")}
							onMouseLeave={() => setHoverCard(null)}
						>
							<div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-900 opacity-90"></div>
							<div className="relative p-6 z-10 h-full flex flex-col">
								<div className="flex-1">
									<div className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center mb-4">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-8 w-8 text-blue-900"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
											/>
										</svg>
									</div>
									<h2 className="text-2xl font-bold mb-2">
										Dining Philosophers
									</h2>
									<p className="text-blue-200 mb-6">
										A classic problem that illustrates deadlock and resource
										allocation challenges in concurrent systems.
									</p>
								</div>
								<button
									className="w-full bg-white text-blue-900 py-3 rounded-lg font-bold hover:bg-blue-100 transition-colors"
									onClick={() =>
										(window.location.href = "/synchronization/dining")
									}
								>
									Run Simulation
								</button>
							</div>
						</div>

						{/* Reader-Writer Card */}
						<div
							className={`relative overflow-hidden rounded-xl transition-all duration-300 transform ${
								hoverCard === "reader" ? "scale-105" : ""
							}`}
							onMouseEnter={() => setHoverCard("reader")}
							onMouseLeave={() => setHoverCard(null)}
						>
							<div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-900 opacity-90"></div>
							<div className="relative p-6 z-10 h-full flex flex-col">
								<div className="flex-1">
									<div className="w-16 h-16 bg-purple-400 rounded-full flex items-center justify-center mb-4">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-8 w-8 text-purple-900"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
											/>
										</svg>
									</div>
									<h2 className="text-2xl font-bold mb-2">Reader-Writer</h2>
									<p className="text-purple-200 mb-6">
										Demonstrates concurrent access to a shared resource with
										multiple readers and exclusive writers.
									</p>
								</div>
								<button
									className="w-full bg-white text-purple-900 py-3 rounded-lg font-bold hover:bg-purple-100 transition-colors"
									onClick={() =>
										(window.location.href = "/synchronization/reader")
									}
								>
									Run Simulation
								</button>
							</div>
						</div>

						{/* Producer-Consumer Card */}
						<div
							className={`relative overflow-hidden rounded-xl transition-all duration-300 transform ${
								hoverCard === "producer" ? "scale-105" : ""
							}`}
							onMouseEnter={() => setHoverCard("producer")}
							onMouseLeave={() => setHoverCard(null)}
						>
							<div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-teal-900 opacity-90"></div>
							<div className="relative p-6 z-10 h-full flex flex-col">
								<div className="flex-1">
									<div className="w-16 h-16 bg-teal-400 rounded-full flex items-center justify-center mb-4">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-8 w-8 text-teal-900"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
											/>
										</svg>
									</div>
									<h2 className="text-2xl font-bold mb-2">Producer-Consumer</h2>
									<p className="text-teal-200 mb-6">
										Shows coordination between processes producing items and
										others consuming from a shared buffer.
									</p>
								</div>
								<button
									className="w-full bg-white text-teal-900 py-3 rounded-lg font-bold hover:bg-teal-100 transition-colors"
									onClick={() =>
										(window.location.href = "/synchronization/producer")
									}
								>
									Run Simulation
								</button>
							</div>
						</div>
					</div>
				</main>

				<footer className="py-8 text-center text-blue-300 border-t border-blue-800">
					<p className="text-lg">
						Explore fundamental concurrency concepts through interactive
						simulations
					</p>
					<p className="mt-2 text-sm text-blue-400">
						Developed for Computer Science Education
					</p>
				</footer>
			</div>
		</div>
	);
}
