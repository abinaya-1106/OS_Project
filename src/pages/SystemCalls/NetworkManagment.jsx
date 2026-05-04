import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
	Server,
	Network,
	Play,
	Pause,
	RefreshCw,
	ArrowRight,
	ChevronRight,
} from "lucide-react";

export default function NetworkSystemCallsSimulator() {
	const [activeTab, setActiveTab] = useState("tcp");
	const [isRunning, setIsRunning] = useState(false);
	const [currentStep, setCurrentStep] = useState(0);
	const [speed, setSpeed] = useState(2);
	const [packetPosition, setPacketPosition] = useState(0);
	const [packetDirection, setPacketDirection] = useState("right");
	const [clientLogs, setClientLogs] = useState([]);
	const [serverLogs, setServerLogs] = useState([]);
	const [showCode, setShowCode] = useState(false);
	const [packetType, setPacketType] = useState("");

	const protocols = {
		tcp: {
			name: "TCP Connection",
			steps: [
				{
					name: "socket()",
					description: "Create an endpoint for communication",
					code: "int sockfd = socket(AF_INET, SOCK_STREAM, 0);",
					actor: "client",
					packetType: "",
					clientLog: "Creating TCP socket with socket()",
					serverLog: "",
				},
				{
					name: "socket()",
					description: "Create server socket",
					code: "int sockfd = socket(AF_INET, SOCK_STREAM, 0);",
					actor: "server",
					packetType: "",
					clientLog: "",
					serverLog: "Creating TCP socket with socket()",
				},
				{
					name: "bind()",
					description: "Bind server socket to an address",
					code: "bind(sockfd, (struct sockaddr*)&server_addr, sizeof(server_addr));",
					actor: "server",
					packetType: "",
					clientLog: "",
					serverLog: "Binding socket to address (port 8080)",
				},
				{
					name: "listen()",
					description: "Mark socket as passive socket",
					code: "listen(sockfd, 5);",
					actor: "server",
					packetType: "",
					clientLog: "",
					serverLog: "Listening for incoming connections (backlog: 5)",
				},
				{
					name: "connect()",
					description: "Initiate connection to server",
					code: "connect(sockfd, (struct sockaddr*)&server_addr, sizeof(server_addr));",
					actor: "client",
					packetType: "SYN",
					packetDirection: "right",
					clientLog: "Initiating connection to server at 192.168.1.10:8080",
					serverLog: "Received SYN packet from 192.168.1.5:49152",
				},
				{
					name: "accept()",
					description: "Accept client connection",
					code: "int new_socket = accept(sockfd, (struct sockaddr*)&client_addr, &addr_size);",
					actor: "server",
					packetType: "SYN-ACK",
					packetDirection: "left",
					clientLog: "Received SYN-ACK from server",
					serverLog: "Accepting connection from 192.168.1.5:49152",
				},
				{
					name: "connect() completes",
					description: "Connection established",
					code: "// connect() system call completes",
					actor: "client",
					packetType: "ACK",
					packetDirection: "right",
					clientLog: "Sending ACK, connection established",
					serverLog: "Received ACK, connection established",
				},
				{
					name: "write()/send()",
					description: "Send data to server",
					code: "send(sockfd, message, strlen(message), 0);",
					actor: "client",
					packetType: "DATA",
					packetDirection: "right",
					clientLog: 'Sending data: "Hello Server!" (16 bytes)',
					serverLog: "Connection ready to receive data",
				},
				{
					name: "read()/recv()",
					description: "Receive data from client",
					code: "recv(new_socket, buffer, sizeof(buffer), 0);",
					actor: "server",
					packetType: "ACK",
					packetDirection: "left",
					clientLog: "Server received our data",
					serverLog: 'Received data: "Hello Server!" (16 bytes)',
				},
				{
					name: "write()/send()",
					description: "Send response to client",
					code: "send(new_socket, response, strlen(response), 0);",
					actor: "server",
					packetType: "DATA",
					packetDirection: "left",
					clientLog: "Waiting for server response",
					serverLog: 'Sending response: "Hello Client!" (16 bytes)',
				},
				{
					name: "read()/recv()",
					description: "Receive response from server",
					code: "recv(sockfd, buffer, sizeof(buffer), 0);",
					actor: "client",
					packetType: "ACK",
					packetDirection: "right",
					clientLog: 'Received response: "Hello Client!" (16 bytes)',
					serverLog: "Client acknowledged our response",
				},
				{
					name: "close()",
					description: "Close client socket",
					code: "close(sockfd);",
					actor: "client",
					packetType: "FIN",
					packetDirection: "right",
					clientLog: "Closing connection",
					serverLog: "Received connection close request (FIN)",
				},
				{
					name: "close()",
					description: "Close server socket",
					code: "close(new_socket);",
					actor: "server",
					packetType: "FIN-ACK",
					packetDirection: "left",
					clientLog: "Received server close acknowledgment",
					serverLog: "Closing connection to client",
				},
			],
		},
		udp: {
			name: "UDP Communication",
			steps: [
				{
					name: "socket()",
					description: "Create a UDP socket",
					code: "int sockfd = socket(AF_INET, SOCK_DGRAM, 0);",
					actor: "client",
					packetType: "",
					clientLog: "Creating UDP socket with socket()",
					serverLog: "",
				},
				{
					name: "socket()",
					description: "Create server UDP socket",
					code: "int sockfd = socket(AF_INET, SOCK_DGRAM, 0);",
					actor: "server",
					packetType: "",
					clientLog: "",
					serverLog: "Creating UDP socket with socket()",
				},
				{
					name: "bind()",
					description: "Bind server socket to an address",
					code: "bind(sockfd, (struct sockaddr*)&server_addr, sizeof(server_addr));",
					actor: "server",
					packetType: "",
					clientLog: "",
					serverLog: "Binding UDP socket to address (port 8080)",
				},
				{
					name: "sendto()",
					description: "Send data to a specific address",
					code: "sendto(sockfd, message, strlen(message), 0, (struct sockaddr*)&server_addr, sizeof(server_addr));",
					actor: "client",
					packetType: "DATAGRAM",
					packetDirection: "right",
					clientLog: 'Sending datagram: "Hello UDP Server!" (20 bytes)',
					serverLog: "",
				},
				{
					name: "recvfrom()",
					description: "Receive data from socket",
					code: "recvfrom(sockfd, buffer, sizeof(buffer), 0, (struct sockaddr*)&client_addr, &addr_size);",
					actor: "server",
					packetType: "",
					packetDirection: "",
					clientLog: "",
					serverLog:
						'Received datagram: "Hello UDP Server!" from 192.168.1.5:49152',
				},
				{
					name: "sendto()",
					description: "Send response back to client",
					code: "sendto(sockfd, response, strlen(response), 0, (struct sockaddr*)&client_addr, sizeof(client_addr));",
					actor: "server",
					packetType: "DATAGRAM",
					packetDirection: "left",
					clientLog: "",
					serverLog: 'Sending response: "Hello UDP Client!" (20 bytes)',
				},
				{
					name: "recvfrom()",
					description: "Receive response from server",
					code: "recvfrom(sockfd, buffer, sizeof(buffer), 0, NULL, NULL);",
					actor: "client",
					packetType: "",
					packetDirection: "",
					clientLog:
						'Received response: "Hello UDP Client!" from 192.168.1.10:8080',
					serverLog: "",
				},
				{
					name: "close()",
					description: "Close client socket",
					code: "close(sockfd);",
					actor: "client",
					packetType: "",
					packetDirection: "",
					clientLog: "Closing UDP socket",
					serverLog: "",
				},
				{
					name: "close()",
					description: "Close server socket",
					code: "close(sockfd);",
					actor: "server",
					packetType: "",
					packetDirection: "",
					clientLog: "",
					serverLog: "Closing UDP socket",
				},
			],
		},
		http: {
			name: "HTTP Request",
			steps: [
				{
					name: "socket()",
					description: "Create a TCP socket",
					code: "int sockfd = socket(AF_INET, SOCK_STREAM, 0);",
					actor: "client",
					packetType: "",
					clientLog: "Creating TCP socket for HTTP connection",
					serverLog: "",
				},
				{
					name: "socket()",
					description: "Create server socket",
					code: "int sockfd = socket(AF_INET, SOCK_STREAM, 0);",
					actor: "server",
					packetType: "",
					clientLog: "",
					serverLog: "Creating TCP socket for HTTP server",
				},
				{
					name: "bind()",
					description: "Bind server socket to port 80",
					code: "bind(sockfd, (struct sockaddr*)&server_addr, sizeof(server_addr));",
					actor: "server",
					packetType: "",
					clientLog: "",
					serverLog: "Binding HTTP server to port 80",
				},
				{
					name: "listen()",
					description: "Start listening for connections",
					code: "listen(sockfd, 10);",
					actor: "server",
					packetType: "",
					clientLog: "",
					serverLog: "HTTP server listening for connections",
				},
				{
					name: "connect()",
					description: "Connect to HTTP server",
					code: "connect(sockfd, (struct sockaddr*)&server_addr, sizeof(server_addr));",
					actor: "client",
					packetType: "SYN",
					packetDirection: "right",
					clientLog: "Connecting to HTTP server at example.com:80",
					serverLog: "Received connection request from client",
				},
				{
					name: "accept()",
					description: "Accept client connection",
					code: "int client_sock = accept(sockfd, (struct sockaddr*)&client_addr, &addr_size);",
					actor: "server",
					packetType: "SYN-ACK",
					packetDirection: "left",
					clientLog: "Connection established with HTTP server",
					serverLog: "Accepting client connection",
				},
				{
					name: "connection established",
					description: "TCP handshake complete",
					code: "// TCP handshake completed",
					actor: "client",
					packetType: "ACK",
					packetDirection: "right",
					clientLog: "TCP handshake complete, ready to send HTTP request",
					serverLog: "TCP connection established with client",
				},
				{
					name: "write()",
					description: "Send HTTP GET request",
					code: 'write(sockfd, "GET / HTTP/1.1\\r\\nHost: example.com\\r\\n\\r\\n", strlen(request));',
					actor: "client",
					packetType: "HTTP GET",
					packetDirection: "right",
					clientLog: "Sending HTTP GET request for /",
					serverLog: "",
				},
				{
					name: "read()",
					description: "Server reads HTTP request",
					code: "read(client_sock, buffer, sizeof(buffer));",
					actor: "server",
					packetType: "",
					packetDirection: "",
					clientLog: "",
					serverLog: "Received HTTP GET request for /",
				},
				{
					name: "write()",
					description: "Send HTTP response",
					code: 'write(client_sock, "HTTP/1.1 200 OK\\r\\n\\r\\n<html>...</html>", strlen(response));',
					actor: "server",
					packetType: "HTTP 200",
					packetDirection: "left",
					clientLog: "",
					serverLog: "Sending HTTP 200 OK response with content",
				},
				{
					name: "read()",
					description: "Read HTTP response",
					code: "read(sockfd, buffer, sizeof(buffer));",
					actor: "client",
					packetType: "",
					packetDirection: "",
					clientLog: "Received HTTP 200 OK response with 1024 bytes",
					serverLog: "",
				},
				{
					name: "close()",
					description: "Close client connection",
					code: "close(sockfd);",
					actor: "client",
					packetType: "FIN",
					packetDirection: "right",
					clientLog: "Closing HTTP connection",
					serverLog: "",
				},
				{
					name: "close()",
					description: "Close server socket",
					code: "close(client_sock);",
					actor: "server",
					packetType: "FIN-ACK",
					packetDirection: "left",
					clientLog: "",
					serverLog: "Closing connection to client",
				},
			],
		},
	};

	useEffect(() => {
		let interval;
		if (isRunning) {
			interval = setInterval(() => {
				handleNextStep();
			}, 3000 / speed);
		}
		return () => clearInterval(interval);
	}, [isRunning, currentStep, activeTab, speed]);

	// Animate packet position
	useEffect(() => {
		if (isRunning || packetPosition > 0) {
			const currentPacketDirection =
				protocols[activeTab].steps[currentStep]?.packetDirection || "right";
			setPacketDirection(currentPacketDirection);

			const packetAnimation = setInterval(() => {
				setPacketPosition((prev) => {
					if (prev >= 100) return 100;
					return prev + 3 * speed;
				});
			}, 50);
			return () => clearInterval(packetAnimation);
		}
	}, [isRunning, speed, currentStep, activeTab]);

	const handleStart = () => {
		setIsRunning(!isRunning);
		if (!isRunning && currentStep >= protocols[activeTab].steps.length - 1) {
			handleReset();
		}
	};

	const handleReset = () => {
		setIsRunning(false);
		setCurrentStep(0);
		setClientLogs([]);
		setServerLogs([]);
		setPacketPosition(0);
		setPacketType("");
	};

	const handleNextStep = () => {
		if (currentStep >= protocols[activeTab].steps.length - 1) {
			setIsRunning(false);
			return;
		}

		const nextStep = currentStep + 1;
		setCurrentStep(nextStep);

		// Add log entries
		const step = protocols[activeTab].steps[nextStep];

		if (step.clientLog) {
			setClientLogs((prev) => [step.clientLog, ...prev].slice(0, 10));
		}

		if (step.serverLog) {
			setServerLogs((prev) => [step.serverLog, ...prev].slice(0, 10));
		}

		// Set packet type for animation
		setPacketType(step.packetType || "");

		// Reset packet position for animation
		setPacketPosition(0);
	};

	const handleTabChange = (tab) => {
		setActiveTab(tab);
		handleReset();
	};

	const getPacketColor = (type) => {
		switch (type) {
			case "SYN":
				return "bg-blue-500";
			case "SYN-ACK":
				return "bg-purple-500";
			case "ACK":
				return "bg-green-500";
			case "DATA":
				return "bg-yellow-500";
			case "FIN":
				return "bg-red-500";
			case "FIN-ACK":
				return "bg-red-400";
			case "DATAGRAM":
				return "bg-indigo-500";
			case "HTTP GET":
				return "bg-orange-500";
			case "HTTP 200":
				return "bg-emerald-500";
			default:
				return "bg-gray-500";
		}
	};

	return (
		<div className="bg-gray-700 backdrop-blur-lg p-6 rounded-lg shadow-xl px-48 pb-32 ">
			<h1 className="text-2xl font-bold mb-4 text-blue-200">
				Network System Calls Simulator
			</h1>

			{/* Protocol Tabs */}
			<div className="flex mb-6 bg-gray-300 bg-opacity-70 rounded-lg overflow-hidden">
				{Object.keys(protocols).map((protocol) => (
					<button
						key={protocol}
						className={`px-4 py-2 flex-1 ${
							activeTab === protocol
								? "bg-blue-600 text-white"
								: "bg-transparent text-gray-700"
						}`}
						onClick={() => handleTabChange(protocol)}
					>
						{protocols[protocol].name}
					</button>
				))}
			</div>

			{/* Simulation Area */}
			<div className="flex flex-col gap-6 mb-6">
				{/* Visualization */}
				<div className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm p-4 rounded-lg shadow border border-gray-200">
					<h2 className="text-lg font-bold mb-3 flex items-center">
						<span>Visualization</span>
						<div className="ml-auto text-sm text-gray-700">
							Step {currentStep + 1} of {protocols[activeTab].steps.length}
						</div>
					</h2>

					<div className="h-64 bg-gray-100 rounded-lg flex items-center justify-around relative">
						{/* Client */}
						<div className="text-center w-1/4">
							<div
								className={`bg-blue-100 p-4 rounded-lg shadow-md inline-block ${
									protocols[activeTab].steps[currentStep]?.actor === "client"
										? "ring-2 ring-blue-500"
										: ""
								}`}
							>
								<Network className="h-12 w-12 text-blue-600" />
								<div className="mt-2 text-sm font-semibold">Client</div>
								<div className="mt-1 text-xs text-gray-500">192.168.1.5</div>
							</div>
						</div>

						{/* Network */}
						<div className="flex-1 mx-4 h-2 bg-gray-300 relative">
							{(isRunning || packetPosition > 0) && packetType && (
								<motion.div
									className="absolute top-1/2 transform -translate-y-1/2"
									style={{
										left:
											packetDirection === "right"
												? `${packetPosition}%`
												: `${100 - packetPosition}%`,
										transition: "left 0.1s linear",
									}}
								>
									<div className="relative">
										<motion.div
											className={`h-8 w-8 ${getPacketColor(
												packetType
											)} rounded-full shadow-lg flex items-center justify-center`}
											initial={{ scale: 0.8 }}
											animate={{ scale: 1.1 }}
											transition={{
												repeat: Infinity,
												duration: 0.8,
												repeatType: "mirror",
											}}
										>
											{packetDirection === "right" ? (
												<ChevronRight className="h-5 w-5 text-white" />
											) : (
												<ChevronLeft className="h-5 w-5 text-white" />
											)}
										</motion.div>
										<div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-semibold bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap">
											{packetType}
										</div>
									</div>
								</motion.div>
							)}
						</div>

						{/* Server */}
						<div className="text-center w-1/4">
							<div
								className={`bg-purple-100 p-4 rounded-lg shadow-md inline-block ${
									protocols[activeTab].steps[currentStep]?.actor === "server"
										? "ring-2 ring-purple-500"
										: ""
								}`}
							>
								<Server className="h-12 w-12 text-purple-600" />
								<div className="mt-2 text-sm font-semibold">Server</div>
								<div className="mt-1 text-xs text-gray-500">192.168.1.10</div>
							</div>
						</div>
					</div>

					{/* Progress Bar */}
					<div className="mt-4">
						<div className="h-2 bg-gray-200 rounded-full overflow-hidden">
							<div
								className="h-full bg-blue-600 transition-all duration-300"
								style={{
									width: `${
										(currentStep / (protocols[activeTab].steps.length - 1)) *
										100
									}%`,
								}}
							></div>
						</div>
					</div>
				</div>

				{/* Current Step Details & Controls */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
					{/* Current Step Details */}
					<div className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm p-4 rounded-lg shadow border border-gray-200 lg:col-span-2">
						<h2 className="text-lg font-bold mb-3">Current System Call</h2>
						<div className="bg-gray-100 p-4 rounded-lg">
							<div className="flex items-center mb-2">
								<div
									className={`w-3 h-3 rounded-full mr-2 ${
										protocols[activeTab].steps[currentStep]?.actor === "client"
											? "bg-blue-500"
											: "bg-purple-500"
									}`}
								></div>
								<span className="text-sm font-medium text-gray-600">
									{protocols[activeTab].steps[currentStep]?.actor === "client"
										? "Client"
										: "Server"}{" "}
									Action
								</span>
							</div>

							<h3 className="text-xl font-bold text-blue-700">
								{protocols[activeTab].steps[currentStep]?.name || ""}
							</h3>
							<p className="text-gray-600 mb-4">
								{protocols[activeTab].steps[currentStep]?.description || ""}
							</p>

							{/* Code display */}
							<div className="mt-2">
								<div className="flex items-center justify-between">
									<button
										className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
										onClick={() => setShowCode(!showCode)}
									>
										{showCode ? "Hide Code" : "Show Code"}
										<ArrowDown
											className={`ml-1 h-4 w-4 transform transition-transform ${
												showCode ? "rotate-180" : ""
											}`}
										/>
									</button>
								</div>

								{showCode && (
									<div className="mt-3 bg-gray-800 text-green-400 p-3 rounded font-mono text-sm overflow-x-auto">
										{protocols[activeTab].steps[currentStep]?.code || ""}
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Controls */}
					<div className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm p-4 rounded-lg shadow border border-gray-200">
						<h2 className="text-lg font-bold mb-3">Controls</h2>
						<div className="flex flex-col gap-3">
							<div className="flex gap-2">
								<button
									onClick={handleStart}
									className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 ${
										isRunning
											? "bg-amber-600 hover:bg-amber-700"
											: "bg-green-600 hover:bg-green-700"
									} text-white`}
								>
									{isRunning ? (
										<Pause className="h-4 w-4" />
									) : (
										<Play className="h-4 w-4" />
									)}
									{isRunning ? "Pause" : "Auto Play"}
								</button>

								<button
									onClick={handleReset}
									className="flex-1 py-2 rounded-lg flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white"
								>
									<RefreshCw className="h-4 w-4" />
									Reset
								</button>
							</div>

							<button
								onClick={handleNextStep}
								disabled={
									isRunning ||
									currentStep >= protocols[activeTab].steps.length - 1
								}
								className={`py-3 rounded-lg flex items-center justify-center gap-2 ${
									isRunning ||
									currentStep >= protocols[activeTab].steps.length - 1
										? "bg-gray-400 cursor-not-allowed"
										: "bg-blue-600 hover:bg-blue-700"
								} text-white`}
							>
								Next Step
								<ArrowRight className="h-4 w-4" />
							</button>

							<div className="flex items-center gap-2 mt-2">
								<div className="text-sm font-medium">Speed:</div>
								<select
									value={speed}
									onChange={(e) => setSpeed(Number(e.target.value))}
									className="flex-1 border border-gray-300 rounded p-1"
									disabled={isRunning}
								>
									<option value="1">Slow</option>
									<option value="2">Normal</option>
									<option value="4">Fast</option>
								</select>
							</div>
						</div>
					</div>
				</div>

				{/* Client and Server Logs */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Client Logs */}
					<div className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm p-4 rounded-lg shadow border border-gray-200">
						<h2 className="text-lg font-bold mb-3 flex items-center">
							<div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
							Client Logs
						</h2>
						<div className="h-52 overflow-y-auto bg-black bg-opacity-90 rounded-lg p-3">
							{clientLogs.length === 0 ? (
								<div className="text-gray-500 text-sm italic">
									No client logs yet.
								</div>
							) : (
								clientLogs.map((log, index) => (
									<div
										key={`client-${index}`}
										className="text-blue-400 font-mono text-sm mb-1"
									>
										{`> ${log}`}
									</div>
								))
							)}
						</div>
					</div>

					{/* Server Logs */}
					<div className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm p-4 rounded-lg shadow border border-gray-200">
						<h2 className="text-lg font-bold mb-3 flex items-center">
							<div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
							Server Logs
						</h2>
						<div className="h-52 overflow-y-auto bg-black bg-opacity-90 rounded-lg p-3">
							{serverLogs.length === 0 ? (
								<div className="text-gray-500 text-sm italic">
									No server logs yet.
								</div>
							) : (
								serverLogs.map((log, index) => (
									<div
										key={`server-${index}`}
										className="text-purple-400 font-mono text-sm mb-1"
									>
										{`> ${log}`}
									</div>
								))
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Description */}
			<div className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm p-4 rounded-lg shadow border border-gray-200">
				<h2 className="text-lg font-bold mb-2">About Network System Calls</h2>
				<p className="text-gray-700">
					This simulator demonstrates the sequence of system calls used in
					network programming, showing both client and server sides. The
					visualization highlights key protocol features like the TCP three-way
					handshake (SYN, SYN-ACK, ACK) and connection termination sequence.
				</p>
				<div className="mt-4 text-sm text-gray-600 grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="flex items-center">
						<div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
						<span>SYN: Initial connection request</span>
					</div>
					<div className="flex items-center">
						<div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div>
						<span>SYN-ACK: Connection acknowledgment</span>
					</div>
					<div className="flex items-center">
						<div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
						<span>ACK: Acknowledgment packet</span>
					</div>
					<div className="flex items-center">
						<div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
						<span>DATA: Data transfer packet</span>
					</div>
					<div className="flex items-center">
						<div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
						<span>FIN: Connection termination</span>
					</div>
					<div className="flex items-center">
						<div className="w-4 h-4 rounded-full bg-indigo-500 mr-2"></div>
						<span>DATAGRAM: UDP datagram packet</span>
					</div>
				</div>
			</div>
		</div>
	);
}

function ChevronLeft(props) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<path d="m15 18-6-6 6-6" />
		</svg>
	);
}

function ArrowDown(props) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<path d="M12 5v14" />
			<path d="m19 12-7 7-7-7" />
		</svg>
	);
}
