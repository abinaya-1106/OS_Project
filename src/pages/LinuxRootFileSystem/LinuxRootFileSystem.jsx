import React, { useState, useEffect } from "react";

export default function LinuxRootFilesystem() {
  const [selectedDirectory, setSelectedDirectory] = useState("/");
  const [showDetails, setShowDetails] = useState(true);
  const [viewMode, setViewMode] = useState("hierarchy"); // "hierarchy" or "table"
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedPath, setHighlightedPath] = useState(null);

  // Define Linux filesystem directories and their metadata
  const filesystemStructure = {
    "/": {
      description:
        "Root directory - the starting point of the filesystem hierarchy",
      contents: [
        "bin",
        "boot",
        "dev",
        "etc",
        "home",
        "lib",
        "media",
        "mnt",
        "opt",
        "proc",
        "root",
        "run",
        "sbin",
        "srv",
        "sys",
        "tmp",
        "usr",
        "var",
      ],
      permissions: "drwxr-xr-x",
      owner: "root",
      group: "root",
      details:
        "The root directory is the top-level directory in the Linux filesystem. All other directories, files, and mount points branch from this root. It's represented by a forward slash (/).",
    },
    "/bin": {
      description:
        "Essential user binaries (programs) required for system recovery and repair",
      contents: [
        "bash",
        "cat",
        "chmod",
        "cp",
        "date",
        "echo",
        "ls",
        "mkdir",
        "mount",
        "ps",
        "rm",
      ],
      permissions: "drwxr-xr-x",
      owner: "root",
      group: "root",
      details:
        "The /bin directory contains essential command binaries that need to be available in single-user mode. These commands are required for basic system functionality, even when only the root partition is mounted.",
    },
    "/boot": {
      description: "Boot loader files, kernel, and initial RAM disk images",
      contents: [
        "config-5.15.0",
        "grub",
        "initrd.img-5.15.0",
        "vmlinuz-5.15.0",
      ],
      permissions: "drwxr-xr-x",
      owner: "root",
      group: "root",
      details:
        "The /boot directory contains files needed by the boot loader (like GRUB) to boot the system. This includes kernel images, initial RAM disks, and boot loader configuration files.",
    },
    "/dev": {
      description: "Device files representing hardware components",
      contents: [
        "sda",
        "sda1",
        "sda2",
        "tty",
        "null",
        "random",
        "zero",
        "cdrom",
      ],
      permissions: "drwxr-xr-x",
      owner: "root",
      group: "root",
      details:
        "The /dev directory contains special files representing devices. In Linux, hardware devices are treated as files, allowing programs to interact with them using standard file I/O operations. These are created and managed by the udev system.",
    },
    "/etc": {
      description: "System configuration files",
      contents: [
        "fstab",
        "hostname",
        "hosts",
        "passwd",
        "shadow",
        "group",
        "sudoers",
        "network",
        "ssh",
      ],
      permissions: "drwxr-xr-x",
      owner: "root",
      group: "root",
      details:
        "The /etc directory contains configuration files for the system. These text files control the operation of programs and services. The name comes from 'etcetera' as it was originally a place for files that didn't belong elsewhere.",
    },
    "/home": {
      description: "User home directories",
      contents: ["user1", "user2"],
      permissions: "drwxr-xr-x",
      owner: "root",
      group: "root",
      details:
        "The /home directory contains the personal directories for regular users. Each user typically has a subdirectory named after their username where they store personal files and user-specific configuration files.",
    },
    "/lib": {
      description: "Essential shared libraries and kernel modules",
      contents: ["modules", "libc.so.6", "ld-linux.so.2"],
      permissions: "drwxr-xr-x",
      owner: "root",
      group: "root",
      details:
        "The /lib directory contains essential shared libraries needed for the binaries in /bin and /sbin, as well as modules for the kernel. These libraries are critical for the basic functionality of the system.",
    },
    "/media": {
      description: "Mount point for removable media",
      contents: ["cdrom", "usb"],
      permissions: "drwxr-xr-x",
      owner: "root",
      group: "root",
      details:
        "The /media directory is used as a mount point for removable media such as USB drives, CD-ROMs, and other storage devices. Modern systems automatically mount devices here when they're connected.",
    },
    "/mnt": {
      description: "Mount point for temporarily mounted filesystems",
      contents: [],
      permissions: "drwxr-xr-x",
      owner: "root",
      group: "root",
      details:
        "The /mnt directory is used for temporarily mounting filesystems. System administrators often use this location when manually mounting storage devices or network shares.",
    },
    "/opt": {
      description: "Optional application software packages",
      contents: ["google", "mozilla", "spotify"],
      permissions: "drwxr-xr-x",
      owner: "root",
      group: "root",
      details:
        "The /opt directory is reserved for the installation of add-on application software packages. Programs installed here typically keep all their files in a single subdirectory structure, making them easy to manage.",
    },
    "/proc": {
      description: "Virtual filesystem for kernel and process information",
      contents: ["cpuinfo", "meminfo", "version", "1", "2", "3"],
      permissions: "dr-xr-xr-x",
      owner: "root",
      group: "root",
      details:
        "The /proc directory is a virtual filesystem that provides a mechanism for the kernel to send information to processes. It doesn't contain actual files but runtime system information (e.g. system memory, devices mounted, hardware configuration, etc).",
    },
    "/root": {
      description: "Home directory for the root user",
      contents: [".bashrc", ".profile"],
      permissions: "drwx------",
      owner: "root",
      group: "root",
      details:
        "The /root directory is the home directory for the root user. It's separate from the regular users' home directories in /home for security reasons and to ensure it's available even if /home is on a separate partition.",
    },
    "/run": {
      description: "Run-time variable data since last boot",
      contents: ["lock", "user", "systemd"],
      permissions: "drwxr-xr-x",
      owner: "root",
      group: "root",
      details:
        "The /run directory contains runtime data for processes started since the last boot. This includes process IDs (PIDs), locks, and other data that doesn't need to persist across reboots.",
    },
    "/sbin": {
      description: "System binaries for essential system administration tasks",
      contents: [
        "init",
        "fsck",
        "ifconfig",
        "mkfs",
        "modprobe",
        "reboot",
        "shutdown",
      ],
      permissions: "drwxr-xr-x",
      owner: "root",
      group: "root",
      details:
        "The /sbin directory contains essential system binaries used for system maintenance and administrative tasks. These commands are primarily intended for use by the system administrator and require root privileges to execute.",
    },
    "/srv": {
      description: "Data for services provided by the system",
      contents: ["www", "ftp"],
      permissions: "drwxr-xr-x",
      owner: "root",
      group: "root",
      details:
        "The /srv directory contains data for services offered by the system. For example, a web server might store its files in /srv/www, or an FTP server might use /srv/ftp. This helps organize service data separately from the programs themselves.",
    },
    "/sys": {
      description: "Virtual filesystem for hardware device information",
      contents: ["block", "bus", "class", "devices", "firmware"],
      permissions: "drwxr-xr-x",
      owner: "root",
      group: "root",
      details:
        "The /sys directory is a virtual filesystem that exposes kernel device information and allows for management of devices. It provides a view of the system's hardware topology and allows for device configuration. Like /proc, it's not part of the persistent filesystem.",
    },
    "/tmp": {
      description: "Temporary files that are cleared on reboot",
      contents: [],
      permissions: "drwxrwxrwt",
      owner: "root",
      group: "root",
      details:
        "The /tmp directory is used for temporary files created by programs. Files in this directory are typically deleted when the system reboots or according to system policies. Any user can create files here, but cannot delete files owned by other users.",
    },
    "/usr": {
      description: "User utilities and applications (multi-user tools)",
      contents: ["bin", "include", "lib", "local", "sbin", "share", "src"],
      permissions: "drwxr-xr-x",
      owner: "root",
      group: "root",
      details:
        "The /usr directory contains the majority of user utilities and applications. It has a similar structure to the root directory, with /usr/bin containing non-essential command binaries, /usr/lib for libraries, etc. Historically, it was used for user home directories (hence the name).",
    },
    "/var": {
      description: "Variable data files that change during system operation",
      contents: ["cache", "log", "mail", "spool", "tmp", "www"],
      permissions: "drwxr-xr-x",
      owner: "root",
      group: "root",
      details:
        "The /var directory contains files whose content is expected to change during normal operation, such as logs, spool files, and temporary e-mail files. It often contains large directories and is sometimes mounted as a separate filesystem.",
    },
  };

  // Process relationship connections (what process uses which directory)
  const processRelationships = [
    {
      process: "systemd (PID 1)",
      directory: "/",
      description: "Init process that manages all other processes",
    },
    {
      process: "bash",
      directory: "/bin",
      description: "Command shell that executes from /bin/bash",
    },
    {
      process: "kernel",
      directory: "/boot",
      description: "System loads kernel image from this directory during boot",
    },
    {
      process: "udevd",
      directory: "/dev",
      description: "Device manager that populates the /dev directory",
    },
    {
      process: "sshd",
      directory: "/etc",
      description: "SSH server reads configuration from /etc/ssh",
    },
    {
      process: "user sessions",
      directory: "/home",
      description: "User processes store data and configurations here",
    },
    {
      process: "almost everything",
      directory: "/lib",
      description: "Nearly all processes use shared libraries from here",
    },
    {
      process: "mount",
      directory: "/media",
      description: "Mounting process for removable devices",
    },
    {
      process: "mount",
      directory: "/mnt",
      description: "Manual filesystem mounting",
    },
    {
      process: "third-party apps",
      directory: "/opt",
      description: "Optional software runs from this location",
    },
    {
      process: "all processes",
      directory: "/proc",
      description: "Kernel exposes process information here",
    },
    {
      process: "admin commands",
      directory: "/root",
      description: "Root user's home for administrative tasks",
    },
    {
      process: "systemd",
      directory: "/run",
      description: "Early boot processes store runtime data here",
    },
    {
      process: "system utilities",
      directory: "/sbin",
      description: "Admin tools run from this directory",
    },
    {
      process: "web server",
      directory: "/srv",
      description: "Services like Apache serve content from here",
    },
    {
      process: "kernel",
      directory: "/sys",
      description: "Interface for kernel to export device information",
    },
    {
      process: "various",
      directory: "/tmp",
      description: "Programs store temporary working files here",
    },
    {
      process: "applications",
      directory: "/usr",
      description: "User applications and data",
    },
    {
      process: "logging",
      directory: "/var",
      description: "System logs and variable data stored here",
    },
  ];

  // Search functionality
  useEffect(() => {
    if (searchQuery) {
      const results = Object.keys(filesystemStructure).filter(
        (path) =>
          path.toLowerCase().includes(searchQuery.toLowerCase()) ||
          filesystemStructure[path].description
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );

      if (results.length > 0) {
        setHighlightedPath(results[0]);
        setSelectedDirectory(results[0]);
      } else {
        setHighlightedPath(null);
      }
    } else {
      setHighlightedPath(null);
    }
  }, [searchQuery]);

  // Function to render directory tree
  const renderDirectoryTree = (basePath = "/", depth = 0) => {
    if (depth > 1) return null; // Limit depth to avoid too much nesting

    const directoryInfo = filesystemStructure[basePath];
    if (!directoryInfo) return null;

    return (
      <div key={basePath} className={`ml-${depth * 4}`}>
        <button
          className={`flex items-center py-1 px-2 rounded text-left w-full ${
            selectedDirectory === basePath
              ? "bg-blue-100 font-medium"
              : "hover:bg-gray-100"
          } ${highlightedPath === basePath ? "ring-2 ring-blue-500" : ""}`}
          onClick={() => setSelectedDirectory(basePath)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1 text-yellow-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
              clipRule="evenodd"
            />
          </svg>
          {basePath === "/" ? "/ (root)" : basePath.split("/").pop()}
        </button>

        {depth < 1 &&
          directoryInfo.contents.map((item) => {
            const fullPath =
              basePath === "/" ? `/${item}` : `${basePath}/${item}`;
            if (filesystemStructure[fullPath]) {
              return renderDirectoryTree(fullPath, depth + 1);
            }
            return null;
          })}
      </div>
    );
  };

  // Function to render file/directory details based on permissions string
  const renderPermissions = (perms) => {
    if (!perms || perms.length !== 10) return null;

    const typeMap = {
      d: "Directory",
      "-": "File",
      l: "Link",
      c: "Character Device",
      b: "Block Device",
      s: "Socket",
      p: "Named Pipe",
    };

    const type = typeMap[perms[0]] || "Unknown";

    return (
      <div className="flex flex-col space-y-2">
        <div className="text-sm">
          <span className="font-semibold">Type:</span> {type}
        </div>
        <div className="grid grid-cols-3 text-sm gap-1">
          <div className="text-center border rounded px-2 py-1">
            <div className="font-semibold">Owner</div>
            <div
              className={`${
                perms[1] === "r" ? "text-green-600" : "text-red-600"
              }`}
            >
              Read: {perms[1] === "r" ? "Yes" : "No"}
            </div>
            <div
              className={`${
                perms[2] === "w" ? "text-green-600" : "text-red-600"
              }`}
            >
              Write: {perms[2] === "w" ? "Yes" : "No"}
            </div>
            <div
              className={`${
                perms[3] === "x" ? "text-green-600" : "text-red-600"
              }`}
            >
              Execute: {perms[3] === "x" ? "Yes" : "No"}
            </div>
          </div>
          <div className="text-center border rounded px-2 py-1">
            <div className="font-semibold">Group</div>
            <div
              className={`${
                perms[4] === "r" ? "text-green-600" : "text-red-600"
              }`}
            >
              Read: {perms[4] === "r" ? "Yes" : "No"}
            </div>
            <div
              className={`${
                perms[5] === "w" ? "text-green-600" : "text-red-600"
              }`}
            >
              Write: {perms[5] === "w" ? "Yes" : "No"}
            </div>
            <div
              className={`${
                perms[6] === "x" ? "text-green-600" : "text-red-600"
              }`}
            >
              Execute: {perms[6] === "x" ? "Yes" : "No"}
            </div>
          </div>
          <div className="text-center border rounded px-2 py-1">
            <div className="font-semibold">Others</div>
            <div
              className={`${
                perms[7] === "r" ? "text-green-600" : "text-red-600"
              }`}
            >
              Read: {perms[7] === "r" ? "Yes" : "No"}
            </div>
            <div
              className={`${
                perms[8] === "w" ? "text-green-600" : "text-red-600"
              }`}
            >
              Write: {perms[8] === "w" ? "Yes" : "No"}
            </div>
            <div
              className={`${
                perms[9] === "x" ? "text-green-600" : "text-red-600"
              }`}
            >
              Execute: {perms[9] === "x" ? "Yes" : "No"}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render the related processes that interact with the selected directory
  const renderProcessRelationships = () => {
    const relatedProcesses = processRelationships.filter(
      (rel) => rel.directory === selectedDirectory
    );

    if (relatedProcesses.length === 0) return null;

    return (
      <div className="mt-4">
        <h3 className="font-semibold text-lg mb-2">
          Processes That Interact With This Directory
        </h3>
        <div className="bg-gray-50 p-3 rounded-md border">
          {relatedProcesses.map((rel, idx) => (
            <div key={idx} className="mb-2 last:mb-0">
              <div className="font-semibold">{rel.process}</div>
              <div className="text-sm text-gray-700">{rel.description}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Linux Root Filesystem Simulator
        </h1>

        <div className="mb-6 bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-700">
            The Linux filesystem follows the Filesystem Hierarchy Standard
            (FHS), organizing directories in a structured way. Each directory
            has a specific purpose, and understanding this structure is
            essential for Linux system administration. Explore the directories
            below to learn about their roles, contents, and permissions.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex">
            <input
              type="text"
              placeholder="Search for directories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="bg-gray-200 px-4 rounded-r hover:bg-gray-300"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Directory Navigation Panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Directory Structure</h2>
            <div className="overflow-auto max-h-96">
              {renderDirectoryTree()}
            </div>
          </div>

          {/* Directory Details Panel */}
          <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
            {selectedDirectory && filesystemStructure[selectedDirectory] && (
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  {selectedDirectory === "/"
                    ? "/ (Root Directory)"
                    : selectedDirectory}
                </h2>
                <div className="mb-4 text-gray-700">
                  {filesystemStructure[selectedDirectory].description}
                </div>

                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showDetails"
                      checked={showDetails}
                      onChange={() => setShowDetails(!showDetails)}
                      className="mr-2"
                    />
                    <label htmlFor="showDetails" className="text-sm">
                      Show Detailed Explanations
                    </label>
                  </div>
                </div>

                {showDetails && (
                  <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-4">
                    <h3 className="font-semibold mb-2">Detailed Explanation</h3>
                    <p className="text-sm">
                      {filesystemStructure[selectedDirectory].details}
                    </p>
                  </div>
                )}

                <h3 className="font-semibold text-lg mb-2">
                  Directory Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-3 rounded-md border">
                    <div>
                      <span className="font-semibold">Permissions:</span>{" "}
                      {filesystemStructure[selectedDirectory].permissions}
                    </div>
                    <div>
                      <span className="font-semibold">Owner:</span>{" "}
                      {filesystemStructure[selectedDirectory].owner}
                    </div>
                    <div>
                      <span className="font-semibold">Group:</span>{" "}
                      {filesystemStructure[selectedDirectory].group}
                    </div>
                  </div>
                  <div>
                    {renderPermissions(
                      filesystemStructure[selectedDirectory].permissions
                    )}
                  </div>
                </div>

                <h3 className="font-semibold text-lg mb-2">Contents</h3>
                <div className="bg-gray-50 p-2 rounded-md border overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 text-left">Name</th>
                        <th className="p-2 text-left">Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filesystemStructure[selectedDirectory].contents.map(
                        (item, index) => {
                          const fullPath =
                            selectedDirectory === "/"
                              ? `/${item}`
                              : `${selectedDirectory}/${item}`;
                          const isDirectory =
                            filesystemStructure[fullPath] !== undefined;
                          return (
                            <tr key={index} className="border-t">
                              <td className="p-2">
                                {isDirectory ? (
                                  <button
                                    onClick={() =>
                                      setSelectedDirectory(fullPath)
                                    }
                                    className="flex items-center text-blue-600 hover:underline"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4 mr-1 text-yellow-500"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    {item}
                                  </button>
                                ) : (
                                  <span className="flex items-center">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4 mr-1 text-gray-500"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    {item}
                                  </span>
                                )}
                              </td>
                              <td className="p-2">
                                {isDirectory ? "Directory" : "File"}
                              </td>
                            </tr>
                          );
                        }
                      )}
                      {filesystemStructure[selectedDirectory].contents
                        .length === 0 && (
                        <tr>
                          <td colSpan="2" className="p-2 text-gray-500 italic">
                            Empty directory
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {renderProcessRelationships()}
              </div>
            )}
          </div>
        </div>

        {/* Educational Content */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            About the Linux Filesystem
          </h2>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">
              The Filesystem Hierarchy Standard (FHS)
            </h3>
            <p className="mb-4">
              The Linux filesystem follows the Filesystem Hierarchy Standard
              (FHS), which defines the directory structure and contents in
              Unix-like operating systems. This standard ensures consistency
              across different Linux distributions, making it easier for users
              and software developers to navigate the filesystem.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Key Concepts</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="font-medium">Everything is a file:</span> In
                Linux, all devices, directories, and system resources are
                treated as files, allowing for a consistent interface.
              </li>
              <li>
                <span className="font-medium">Root filesystem:</span> The entire
                filesystem starts at the root (/), with all other directories
                branching from it, creating a tree-like structure.
              </li>
              <li>
                <span className="font-medium">Mount points:</span> Directories
                where additional file systems (from partitions, USB drives,
                network shares) can be attached to the main filesystem tree.
              </li>
              <li>
                <span className="font-medium">File permissions:</span> Every
                file and directory has associated permissions that define who
                can read, write, or execute them, creating a robust security
                model.
              </li>
              <li>
                <span className="font-medium">Virtual filesystems:</span>{" "}
                Special directories like /proc and /sys that don't exist on disk
                but provide interfaces to kernel data structures and hardware
                information.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Command Line Navigation</h3>
            <div className="bg-gray-800 text-green-400 font-mono p-4 rounded-md text-sm mb-2">
              <div># Navigate to a directory</div>
              <div>cd /etc</div>
              <div>&nbsp;</div>
              <div># List directory contents</div>
              <div>ls -la</div>
              <div>&nbsp;</div>
              <div># Show current directory</div>
              <div>pwd</div>
              <div>&nbsp;</div>
              <div># View file contents</div>
              <div>cat /etc/hostname</div>
            </div>
            <p className="text-sm text-gray-600">
              These basic commands allow you to navigate and interact with the
              Linux filesystem structure from the terminal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
