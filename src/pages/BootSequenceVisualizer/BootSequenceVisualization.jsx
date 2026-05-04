import React, { useState, useEffect, useRef } from "react";

export default function BootSequenceVisualization() {
  const [bootStage, setBootStage] = useState(0);
  const [isBooting, setIsBooting] = useState(false);
  const [bootSpeed, setBootSpeed] = useState(2000); // ms between stages
  const [showDetails, setShowDetails] = useState(true);
  const [bootLog, setBootLog] = useState([]);
  const logEndRef = useRef(null);

  // Define boot sequence stages
  const bootStages = [
    {
      name: "Power On",
      description:
        "Electricity flows to the system and the power supply performs a self-test.",
      details:
        "When a computer is powered on, the power supply performs a self-test. If successful, it sends a signal to the CPU to start the boot process. The system clock starts ticking, providing the basic timing for all computer operations.",
      logs: [
        "Power good signal received",
        "System clock initialized",
        "CPU reset line deactivated",
      ],
    },
    {
      name: "POST (Power-On Self-Test)",
      description:
        "The system performs hardware checks and initializes components.",
      details:
        "The POST checks the CPU, memory, and other essential hardware components. It ensures that everything is functioning correctly before handing control over to the bootloader. If any critical component fails, an error message or beep code is generated.",
      logs: [
        "POST started",
        "Checking CPU...",
        "CPU check passed",
        "Checking RAM...",
        "Found 8192MB RAM",
        "RAM check passed",
        "Checking video card...",
        "Video card check passed",
        "POST completed successfully",
      ],
    },
    {
      name: "BIOS/UEFI Initialization",
      description: "Firmware initializes and tests hardware components.",
      details:
        "The BIOS (Basic Input/Output System) or UEFI (Unified Extensible Firmware Interface) is firmware stored in non-volatile memory. It performs the Power-On Self-Test (POST) which checks if essential hardware components are working properly. It also sets up interrupt handlers and device drivers for basic devices like the keyboard, display, and storage.",
      logs: [
        "POST initiated",
        "Checking CPU...",
        "CPU check passed",
        "Memory check...",
        "Found 8192MB RAM",
        "Memory check passed",
        "Initializing keyboard controller",
        "Initializing display adapter",
        "BIOS/UEFI date: 04/14/2025",
      ],
    },
    {
      name: "Bootloader",
      description: "A small program that loads the operating system kernel.",
      details:
        "After the BIOS/UEFI has initialized the hardware, it looks for bootable devices in the order specified in the boot sequence configuration. When found, it loads the bootloader (like GRUB for Linux) from the boot sector. The bootloader's primary responsibility is to load the OS kernel into memory and pass control to it. Modern bootloaders often present a menu allowing users to select between different operating systems or kernel versions.",
      logs: [
        "Searching for bootable devices...",
        "Bootable device found: SATA0",
        "Loading GRUB bootloader...",
        "GRUB 2.06 initialized",
        "Reading partition table...",
        "Found Linux partition at /dev/sda2",
        "Loading Linux kernel...",
      ],
    },
    {
      name: "Kernel Initialization",
      description:
        "The OS kernel loads into memory and initializes core components.",
      details:
        "The kernel is the core of the operating system. During initialization, it sets up memory management, process management, device drivers, and other essential services. It identifies and configures hardware, sets up the scheduler, and establishes the virtual file system. The kernel allocates memory regions for itself and creates initial data structures needed for system operation.",
      logs: [
        "Linux kernel 6.2.0 loading...",
        "Decompressing kernel...",
        "Kernel loaded at 0x100000",
        "Initializing memory management subsystem",
        "Detecting CPU features...",
        "SMP: 8 cores detected",
        "Initializing process scheduler",
        "Setting up interrupt controllers",
        "Initializing device drivers",
      ],
    },
    {
      name: "Device Detection & Driver Loading",
      description:
        "Hardware devices are detected and appropriate drivers loaded.",
      details:
        "The kernel probes for hardware devices using various methods like PCI enumeration. When devices are found, corresponding drivers are loaded. Modern systems use plug-and-play to automatically configure devices. This process sets up the hardware so it can be used by the operating system and applications.",
      logs: [
        "PCI bus enumeration...",
        "Found PCI device: VGA compatible controller",
        "Loading graphics driver 'amdgpu'",
        "Found PCI device: Network controller",
        "Loading network driver 'iwlwifi'",
        "Found PCI device: SATA controller",
        "Loading storage driver 'ahci'",
        "Found USB controllers",
        "Loading USB drivers",
        "Initializing sound system",
      ],
    },
    {
      name: "Mounting File Systems",
      description:
        "File systems are checked and mounted to make storage accessible.",
      details:
        "The kernel mounts the root file system specified by the bootloader. This is typically read-only initially for integrity checks. After verification, it's remounted as read-write. Other file systems listed in /etc/fstab are then mounted. Temporary file systems like /proc, /sys, and /dev are created in memory to provide interfaces to kernel data structures, hardware, and device files.",
      logs: [
        "Mounting root filesystem...",
        "Checking filesystem integrity...",
        "Root filesystem clean",
        "Remounting / as read-write",
        "Mounting /proc filesystem",
        "Mounting /sys",
        "Mounting /dev",
        "Mounting additional filesystems from /etc/fstab",
      ],
    },
    {
      name: "Init Process",
      description:
        "The first user-space process starts and manages system initialization.",
      details:
        "The kernel starts the first user-space process, traditionally called 'init' (PID 1). In modern systems, this might be systemd, SysV init, or other init systems. This process is responsible for bringing the system to the desired runlevel or target state. It starts essential system services according to configuration files, such as networking, logging, and the display manager.",
      logs: [
        "Starting init process (PID 1)...",
        "systemd 254 initializing...",
        "Reading unit configuration files",
        "Starting early boot services...",
        "Starting syslog service...",
        "Starting udev device manager...",
        "Applying network configuration...",
        "Starting system services",
      ],
    },
    {
      name: "User Interface",
      description:
        "A graphical or command-line interface starts, allowing user interaction.",
      details:
        "The final stage of booting depends on the system configuration. For desktop systems, a display manager starts, presenting a graphical login screen. For servers, this might be a text-based login prompt. Once the user authenticates, their preferred environment (like GNOME, KDE, or a terminal) is loaded, and the system is ready for use.",
      logs: [
        "Starting display manager...",
        "Loading X.Org Server",
        "Starting GNOME Display Manager",
        "Initializing desktop environment",
        "System startup complete",
        "Welcome to Linux! Please login:",
      ],
    },
  ];

  useEffect(() => {
    if (isBooting && bootStage < bootStages.length - 1) {
      const timer = setTimeout(() => {
        // Add transition animation class to the current stage indicator
        const stageElement = document.getElementById(`boot-stage-${bootStage}`);
        if (stageElement) {
          stageElement.classList.add("scale-110");
          setTimeout(() => {
            setBootStage((prev) => prev + 1);
            // Add log entries for the new stage
            setBootLog((prev) => [...prev, ...bootStages[bootStage + 1].logs]);
            setTimeout(() => {
              stageElement.classList.remove("scale-110");
            }, 300);
          }, 700);
        } else {
          setBootStage((prev) => prev + 1);
          setBootLog((prev) => [...prev, ...bootStages[bootStage + 1].logs]);
        }
      }, bootSpeed);
      return () => clearTimeout(timer);
    } else if (bootStage === bootStages.length - 1) {
      setIsBooting(false);
    }
  }, [bootStage, isBooting, bootSpeed]);

  const startBoot = () => {
    setBootStage(0);
    setBootLog([...bootStages[0].logs]);
    setIsBooting(true);
  };

  const resetBoot = () => {
    setBootStage(0);
    setBootLog([]);
    setIsBooting(false);
  };

  const skipToStage = (index) => {
    setBootStage(index);

    // Collect all logs up to this stage
    let allLogs = [];
    for (let i = 0; i <= index; i++) {
      allLogs = [...allLogs, ...bootStages[i].logs];
    }
    setBootLog(allLogs);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Boot Sequence Visualization
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mb-6">
            <div className="md:w-1/2">
              <h2 className="text-xl font-semibold mb-4">Controls</h2>

              <div className="space-y-4">
                <div className="flex space-x-2">
                  <button
                    onClick={startBoot}
                    disabled={isBooting}
                    className={`px-4 py-2 rounded-md ${
                      isBooting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    Start Boot Sequence
                  </button>

                  <button
                    onClick={() => setIsBooting(false)}
                    disabled={!isBooting}
                    className={`px-4 py-2 rounded-md ${
                      !isBooting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-yellow-600 hover:bg-yellow-700 text-white"
                    }`}
                  >
                    Pause
                  </button>

                  <button
                    onClick={resetBoot}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                  >
                    Reset
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Simulation Speed
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Fast</span>
                    <input
                      type="range"
                      min="500"
                      max="4000"
                      step="500"
                      value={bootSpeed}
                      onChange={(e) => setBootSpeed(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <span className="text-sm">Slow</span>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showDetails"
                    checked={showDetails}
                    onChange={() => setShowDetails(!showDetails)}
                    className="mr-2"
                  />
                  <label htmlFor="showDetails">
                    Show Detailed Explanations
                  </label>
                </div>
              </div>

              {/* Jump to specific boot stage */}
              <div className="mt-4">
                <h3 className="font-medium mb-2">Jump to Stage:</h3>
                <div className="flex flex-wrap gap-2">
                  {bootStages.map((stage, index) => (
                    <button
                      key={index}
                      onClick={() => skipToStage(index)}
                      className={`px-2 py-1 text-xs rounded ${
                        bootStage === index
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {index + 1}. {stage.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:w-1/2">
              <h2 className="text-xl font-semibold mb-4">Boot Log</h2>
              <div className="bg-black text-green-400 font-mono p-4 rounded-md h-64 overflow-y-auto text-sm">
                {bootLog.map((log, index) => (
                  <div key={index} className="mb-1">
                    &gt; {log}
                  </div>
                ))}
                <div ref={logEndRef} />
              </div>
            </div>
          </div>

          {/* Boot progress bar */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Boot Progress</h2>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                style={{
                  width: `${(bootStage / (bootStages.length - 1)) * 100}%`,
                }}
              ></div>
            </div>
            <div className="text-center text-sm">
              Stage {bootStage + 1} of {bootStages.length}:{" "}
              {bootStages[bootStage].name}
            </div>
          </div>

          {/* Visual representation of boot stages */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Boot Process Visualization
            </h2>
            <div className="flex items-center mb-8 overflow-x-auto py-4 relative">
              {/* Connecting timeline */}
              <div className="absolute top-1/2 left-0 h-1 bg-gray-300 w-full -z-10 transform -translate-y-1/2"></div>
              <div
                className="absolute top-1/2 left-0 h-1 bg-green-500 -z-10 transform -translate-y-1/2 transition-all duration-500"
                style={{
                  width: `${(bootStage / (bootStages.length - 1)) * 100}%`,
                }}
              ></div>

              {bootStages.map((stage, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 flex flex-col items-center mx-4 ${
                    index <= bootStage ? "" : "opacity-30"
                  }`}
                  style={{
                    width: `${100 / bootStages.length}%`,
                    minWidth: "100px",
                  }}
                >
                  <div
                    id={`boot-stage-${index}`}
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-transform duration-700 ${
                      index < bootStage
                        ? "bg-green-500 text-white"
                        : index === bootStage
                        ? "bg-blue-600 text-white animate-pulse"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="text-center text-xs max-w-[100px]">
                    {stage.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add these buttons below the existing controls */}
          <div className="flex justify-center space-x-4 mt-4">
            <button
              onClick={() => bootStage > 0 && skipToStage(bootStage - 1)}
              disabled={bootStage === 0 || isBooting}
              className={`px-4 py-2 rounded-md flex items-center ${
                bootStage === 0 || isBooting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Previous Stage
            </button>

            <button
              onClick={() =>
                bootStage < bootStages.length - 1 && skipToStage(bootStage + 1)
              }
              disabled={bootStage === bootStages.length - 1 || isBooting}
              className={`px-4 py-2 rounded-md flex items-center ${
                bootStage === bootStages.length - 1 || isBooting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Next Stage
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Current stage details */}
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Current Stage: {bootStages[bootStage].name}
            </h2>
            <p className="mb-4">{bootStages[bootStage].description}</p>

            {showDetails && (
              <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                <h3 className="font-semibold mb-2">Detailed Explanation</h3>
                <p className="text-sm">{bootStages[bootStage].details}</p>
              </div>
            )}
          </div>
        </div>

        {/* Hardware components active during this stage */}
        <div className="mt-6 bg-gray-50 p-4 rounded-md border border-gray-200">
          <h3 className="font-semibold mb-3">Active Hardware Components</h3>
          <div className="flex flex-wrap gap-3">
            {(() => {
              // Define which components are active at each stage
              const activeComponents = {
                0: ["PSU", "Motherboard", "CPU"], // Power On
                1: ["PSU", "Motherboard", "CPU", "RAM", "ROM"], // BIOS/UEFI
                2: ["PSU", "Motherboard", "CPU", "RAM", "Storage"], // Bootloader
                3: ["PSU", "Motherboard", "CPU", "RAM", "Storage"], // Kernel Init
                4: [
                  "PSU",
                  "Motherboard",
                  "CPU",
                  "RAM",
                  "Storage",
                  "PCI Devices",
                ], // Device Detection
                5: [
                  "PSU",
                  "Motherboard",
                  "CPU",
                  "RAM",
                  "Storage",
                  "PCI Devices",
                ], // File Systems
                6: [
                  "PSU",
                  "Motherboard",
                  "CPU",
                  "RAM",
                  "Storage",
                  "PCI Devices",
                  "System Services",
                ], // Init
                7: [
                  "PSU",
                  "Motherboard",
                  "CPU",
                  "RAM",
                  "Storage",
                  "PCI Devices",
                  "System Services",
                  "Display",
                ], // UI
                8: [
                  "PSU",
                  "Motherboard",
                  "CPU",
                  "RAM",
                  "Storage",
                  "PCI Devices",
                  "System Services",
                  "Display",
                ], // Final Stage
              };

              return (activeComponents[bootStage] || []).map((component, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {component}
                </span>
              ));
            })()}
          </div>
        </div>

        {/* Common boot issues section */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3">
            Common Boot Issues at this Stage
          </h3>
          <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
            {(() => {
              const issues = {
                0: {
                  // Power On
                  problem: "No Power / System Won't Start",
                  solution:
                    "Check power supply, connections, and motherboard. Try resetting CMOS by removing the battery.",
                },
                1: {
                  // BIOS/UEFI
                  problem: "POST Errors / Beep Codes",
                  solution:
                    "Consult motherboard manual for beep code meanings. Common fixes include reseating RAM or checking hardware connections.",
                },
                2: {
                  // Bootloader
                  problem: "BOOTMGR is missing / GRUB Error",
                  solution:
                    "Boot from recovery media and repair bootloader. For Linux, use a live CD to reinstall GRUB.",
                },
                3: {
                  // Kernel
                  problem: "Kernel Panic / Blue Screen",
                  solution:
                    "Boot in safe mode or recovery mode. Check for hardware compatibility issues or recent changes.",
                },
                4: {
                  // Device Detection
                  problem: "Hardware Not Detected",
                  solution:
                    "Update or reinstall drivers. Check BIOS/UEFI settings for disabled devices.",
                },
                5: {
                  // File Systems
                  problem: "Cannot mount filesystem / Corrupt filesystem",
                  solution:
                    "Run fsck (Linux) or CHKDSK (Windows) to check and repair file system.",
                },
                6: {
                  // Init Process
                  problem: "Hanging on startup services",
                  solution:
                    "Boot in verbose mode to identify problematic service. Use systemctl or service commands to disable it.",
                },
                7: {
                  // User Interface
                  problem: "Black screen after boot / GUI doesn't start",
                  solution:
                    "Check graphics drivers. Try booting to text mode and reconfiguring display settings.",
                },
                8: {
                  // Final Stage
                  problem: "System Crashes / Freezes",
                  solution:
                    "Check for overheating, hardware failures, or driver issues. Boot in safe mode to troubleshoot.",
                },
              };

              const issue = issues[bootStage];
              return (
                <div>
                  <p className="font-medium text-yellow-800">{issue.problem}</p>
                  <p className="mt-1 text-sm text-yellow-700">
                    Solution: {issue.solution}
                  </p>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Educational content about boot sequence */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">
            About the Boot Sequence
          </h2>
          <p className="mb-4">
            The boot sequence is the process that happens from the moment you
            press the power button until the operating system is fully loaded
            and ready for use. Understanding this process helps diagnose startup
            problems and explains how the complex layers of a computer system
            are initialized in the correct order.
          </p>

          <h3 className="font-semibold mt-4 mb-2">
            Key Concepts in System Booting
          </h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="font-medium">BIOS vs. UEFI:</span> Traditional
              BIOS is being replaced by UEFI, which offers more features like
              secure boot, support for larger disks, and a more flexible pre-OS
              environment.
            </li>
            <li>
              <span className="font-medium">Boot Loader:</span> A small program
              that loads the operating system kernel. Common bootloaders include
              GRUB for Linux and the Windows Boot Manager.
            </li>
            <li>
              <span className="font-medium">Kernel:</span> The core of the
              operating system that manages hardware resources and provides
              essential services to applications.
            </li>
            <li>
              <span className="font-medium">Init Systems:</span> The first
              process started by the kernel (PID 1) that starts and manages all
              other processes. Examples include systemd, SysV init, and OpenRC.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
