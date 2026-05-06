import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";

// ============================================================
// FILESYSTEM ENGINE
// ============================================================

const buildInitialFS = () => ({
  id: "root",
  name: "/",
  type: "directory",
  permissions: "drwxr-xr-x",
  owner: "root",
  group: "root",
  content: "",
  created: new Date().toISOString(),
  modified: new Date().toISOString(),
  description: "Root directory - the starting point of the filesystem hierarchy",
  details: "The root directory is the top-level directory in the Linux filesystem. All other directories, files, and mount points branch from this root. It's represented by a forward slash (/).",
  processRelationship: "systemd (PID 1) — Init process that manages all other processes",
  children: [
    {
      id: "bin", name: "bin", type: "directory", permissions: "drwxr-xr-x", owner: "root", group: "root", content: "",
      created: new Date().toISOString(), modified: new Date().toISOString(),
      description: "Essential user binaries required for system recovery",
      details: "Contains essential command binaries that need to be available in single-user mode.",
      processRelationship: "bash — Command shell that executes from /bin/bash",
      children: [
        { id: "bin-bash", name: "bash", type: "file", permissions: "-rwxr-xr-x", owner: "root", group: "root", content: "#!/bin/bash\n# GNU Bash executable", created: new Date().toISOString(), modified: new Date().toISOString(), description: "Bash shell binary", details: "", processRelationship: "", children: [] },
        { id: "bin-ls", name: "ls", type: "file", permissions: "-rwxr-xr-x", owner: "root", group: "root", content: "# ls binary", created: new Date().toISOString(), modified: new Date().toISOString(), description: "List directory contents", details: "", processRelationship: "", children: [] },
        { id: "bin-cat", name: "cat", type: "file", permissions: "-rwxr-xr-x", owner: "root", group: "root", content: "# cat binary", created: new Date().toISOString(), modified: new Date().toISOString(), description: "Concatenate files", details: "", processRelationship: "", children: [] },
        { id: "bin-cp", name: "cp", type: "file", permissions: "-rwxr-xr-x", owner: "root", group: "root", content: "# cp binary", created: new Date().toISOString(), modified: new Date().toISOString(), description: "Copy files", details: "", processRelationship: "", children: [] },
        { id: "bin-rm", name: "rm", type: "file", permissions: "-rwxr-xr-x", owner: "root", group: "root", content: "# rm binary", created: new Date().toISOString(), modified: new Date().toISOString(), description: "Remove files", details: "", processRelationship: "", children: [] },
      ]
    },
    {
      id: "boot", name: "boot", type: "directory", permissions: "drwxr-xr-x", owner: "root", group: "root", content: "",
      created: new Date().toISOString(), modified: new Date().toISOString(),
      description: "Boot loader files, kernel, and initial RAM disk images",
      details: "Contains files needed by the boot loader (like GRUB) to boot the system.",
      processRelationship: "kernel — System loads kernel image from this directory during boot",
      children: [
        { id: "boot-grub", name: "grub", type: "directory", permissions: "drwxr-xr-x", owner: "root", group: "root", content: "", created: new Date().toISOString(), modified: new Date().toISOString(), description: "GRUB bootloader config", details: "", processRelationship: "", children: [] },
        { id: "boot-vmlinuz", name: "vmlinuz-5.15.0", type: "file", permissions: "-rw-r--r--", owner: "root", group: "root", content: "# Linux kernel image", created: new Date().toISOString(), modified: new Date().toISOString(), description: "Linux kernel image", details: "", processRelationship: "", children: [] },
        { id: "boot-initrd", name: "initrd.img-5.15.0", type: "file", permissions: "-rw-r--r--", owner: "root", group: "root", content: "# Initial RAM disk", created: new Date().toISOString(), modified: new Date().toISOString(), description: "Initial RAM disk image", details: "", processRelationship: "", children: [] },
      ]
    },
    {
      id: "dev", name: "dev", type: "directory", permissions: "drwxr-xr-x", owner: "root", group: "root", content: "",
      created: new Date().toISOString(), modified: new Date().toISOString(),
      description: "Device files representing hardware components",
      details: "Contains special files representing devices. Hardware devices are treated as files.",
      processRelationship: "udevd — Device manager that populates /dev",
      children: [
        { id: "dev-sda", name: "sda", type: "file", permissions: "brw-rw----", owner: "root", group: "disk", content: "# Block device: /dev/sda", created: new Date().toISOString(), modified: new Date().toISOString(), description: "SATA disk device", details: "", processRelationship: "", children: [] },
        { id: "dev-null", name: "null", type: "file", permissions: "crw-rw-rw-", owner: "root", group: "root", content: "# Character device: /dev/null", created: new Date().toISOString(), modified: new Date().toISOString(), description: "Null device", details: "", processRelationship: "", children: [] },
        { id: "dev-tty", name: "tty", type: "file", permissions: "crw-rw-rw-", owner: "root", group: "tty", content: "# Terminal device", created: new Date().toISOString(), modified: new Date().toISOString(), description: "Terminal device", details: "", processRelationship: "", children: [] },
      ]
    },
    {
      id: "etc", name: "etc", type: "directory", permissions: "drwxr-xr-x", owner: "root", group: "root", content: "",
      created: new Date().toISOString(), modified: new Date().toISOString(),
      description: "System configuration files",
      details: "Contains configuration files for the system. These text files control the operation of programs and services.",
      processRelationship: "sshd — SSH server reads configuration from /etc/ssh",
      children: [
        { id: "etc-passwd", name: "passwd", type: "file", permissions: "-rw-r--r--", owner: "root", group: "root", content: "root:x:0:0:root:/root:/bin/bash\nstudent:x:1000:1000:Student User:/home/student:/bin/bash\nguest:x:1001:1001:Guest User:/home/guest:/bin/sh", created: new Date().toISOString(), modified: new Date().toISOString(), description: "User account info", details: "", processRelationship: "", children: [] },
        { id: "etc-shadow", name: "shadow", type: "file", permissions: "-rw-------", owner: "root", group: "shadow", content: "root:$6$hashed_password:19000:0:99999:7:::\nstudent:$6$hashed_password:19000:0:99999:7:::", created: new Date().toISOString(), modified: new Date().toISOString(), description: "Encrypted passwords", details: "", processRelationship: "", children: [] },
        { id: "etc-hostname", name: "hostname", type: "file", permissions: "-rw-r--r--", owner: "root", group: "root", content: "linux-sim", created: new Date().toISOString(), modified: new Date().toISOString(), description: "System hostname", details: "", processRelationship: "", children: [] },
        { id: "etc-hosts", name: "hosts", type: "file", permissions: "-rw-r--r--", owner: "root", group: "root", content: "127.0.0.1   localhost\n127.0.1.1   linux-sim\n::1         localhost ip6-localhost", created: new Date().toISOString(), modified: new Date().toISOString(), description: "Static host entries", details: "", processRelationship: "", children: [] },
        { id: "etc-ssh", name: "ssh", type: "directory", permissions: "drwxr-xr-x", owner: "root", group: "root", content: "", created: new Date().toISOString(), modified: new Date().toISOString(), description: "SSH config directory", details: "", processRelationship: "", children: [] },
        { id: "etc-fstab", name: "fstab", type: "file", permissions: "-rw-r--r--", owner: "root", group: "root", content: "# /etc/fstab: static file system information\n/dev/sda1  /       ext4  defaults  0 1\n/dev/sda2  none    swap  sw        0 0", created: new Date().toISOString(), modified: new Date().toISOString(), description: "Filesystem mount table", details: "", processRelationship: "", children: [] },
      ]
    },
    {
      id: "home", name: "home", type: "directory", permissions: "drwxr-xr-x", owner: "root", group: "root", content: "",
      created: new Date().toISOString(), modified: new Date().toISOString(),
      description: "User home directories",
      details: "Contains the personal directories for regular users.",
      processRelationship: "user sessions — User processes store data and configs here",
      children: [
        {
          id: "home-student", name: "student", type: "directory", permissions: "drwxr-xr-x", owner: "student", group: "student", content: "", created: new Date().toISOString(), modified: new Date().toISOString(), description: "Student home dir", details: "", processRelationship: "", children: [
            { id: "home-student-bashrc", name: ".bashrc", type: "file", permissions: "-rw-r--r--", owner: "student", group: "student", content: "# .bashrc for student\nexport PS1='student@linux-sim:\\w$ '\nalias ll='ls -la'", created: new Date().toISOString(), modified: new Date().toISOString(), description: "Bash config", details: "", processRelationship: "", children: [] },
            { id: "home-student-readme", name: "README.txt", type: "file", permissions: "-rw-r--r--", owner: "student", group: "student", content: "Welcome to the Linux Filesystem Simulator!\nExplore the filesystem, run commands, and learn Linux!", created: new Date().toISOString(), modified: new Date().toISOString(), description: "Welcome file", details: "", processRelationship: "", children: [] },
          ]
        },
        {
          id: "home-guest", name: "guest", type: "directory", permissions: "drwxr-xr-x", owner: "guest", group: "guest", content: "", created: new Date().toISOString(), modified: new Date().toISOString(), description: "Guest home dir", details: "", processRelationship: "", children: []
        }
      ]
    },
    {
      id: "lib", name: "lib", type: "directory", permissions: "drwxr-xr-x", owner: "root", group: "root", content: "",
      created: new Date().toISOString(), modified: new Date().toISOString(),
      description: "Essential shared libraries and kernel modules",
      details: "Contains essential shared libraries needed for binaries in /bin and /sbin.",
      processRelationship: "almost everything — Nearly all processes use shared libraries from here",
      children: [
        { id: "lib-modules", name: "modules", type: "directory", permissions: "drwxr-xr-x", owner: "root", group: "root", content: "", created: new Date().toISOString(), modified: new Date().toISOString(), description: "Kernel modules", details: "", processRelationship: "", children: [] },
        { id: "lib-libc", name: "libc.so.6", type: "file", permissions: "-rw-r--r--", owner: "root", group: "root", content: "# GNU C Library", created: new Date().toISOString(), modified: new Date().toISOString(), description: "GNU C Library", details: "", processRelationship: "", children: [] },
      ]
    },
    {
      id: "proc", name: "proc", type: "directory", permissions: "dr-xr-xr-x", owner: "root", group: "root", content: "",
      created: new Date().toISOString(), modified: new Date().toISOString(),
      description: "Virtual filesystem for kernel and process information",
      details: "A virtual filesystem that provides a mechanism for the kernel to send information to processes.",
      processRelationship: "all processes — Kernel exposes process information here",
      children: [
        { id: "proc-cpuinfo", name: "cpuinfo", type: "file", permissions: "-r--r--r--", owner: "root", group: "root", content: "processor\t: 0\nmodel name\t: Linux Simulator CPU @ 2.40GHz\ncpu MHz\t\t: 2400.000\ncache size\t: 6144 KB", created: new Date().toISOString(), modified: new Date().toISOString(), description: "CPU information", details: "", processRelationship: "", children: [] },
        { id: "proc-meminfo", name: "meminfo", type: "file", permissions: "-r--r--r--", owner: "root", group: "root", content: "MemTotal:       16384000 kB\nMemFree:         8192000 kB\nMemAvailable:   12288000 kB\nSwapTotal:       2097152 kB\nSwapFree:        2097152 kB", created: new Date().toISOString(), modified: new Date().toISOString(), description: "Memory information", details: "", processRelationship: "", children: [] },
        { id: "proc-version", name: "version", type: "file", permissions: "-r--r--r--", owner: "root", group: "root", content: "Linux version 5.15.0 (linux-sim@simulator) (gcc 11.3.0) #1 SMP", created: new Date().toISOString(), modified: new Date().toISOString(), description: "Kernel version", details: "", processRelationship: "", children: [] },
      ]
    },
    {
      id: "root", name: "root", type: "directory", permissions: "drwx------", owner: "root", group: "root", content: "",
      created: new Date().toISOString(), modified: new Date().toISOString(),
      description: "Home directory for the root user",
      details: "The home directory for the root user, separate from /home for security.",
      processRelationship: "admin commands — Root user home for administrative tasks",
      children: [
        { id: "root-bashrc", name: ".bashrc", type: "file", permissions: "-rw-r--r--", owner: "root", group: "root", content: "# Root's .bashrc\nexport PS1='root@linux-sim:\\w# '\n", created: new Date().toISOString(), modified: new Date().toISOString(), description: "Root bash config", details: "", processRelationship: "", children: [] },
      ]
    },
    {
      id: "sbin", name: "sbin", type: "directory", permissions: "drwxr-xr-x", owner: "root", group: "root", content: "",
      created: new Date().toISOString(), modified: new Date().toISOString(),
      description: "System binaries for essential system administration tasks",
      details: "Contains essential system binaries used for system maintenance by administrators.",
      processRelationship: "system utilities — Admin tools run from this directory",
      children: [
        { id: "sbin-init", name: "init", type: "file", permissions: "-rwxr-xr-x", owner: "root", group: "root", content: "# System init binary", created: new Date().toISOString(), modified: new Date().toISOString(), description: "Init process", details: "", processRelationship: "", children: [] },
        { id: "sbin-reboot", name: "reboot", type: "file", permissions: "-rwxr-xr-x", owner: "root", group: "root", content: "# Reboot binary", created: new Date().toISOString(), modified: new Date().toISOString(), description: "System reboot", details: "", processRelationship: "", children: [] },
      ]
    },
    {
      id: "tmp", name: "tmp", type: "directory", permissions: "drwxrwxrwt", owner: "root", group: "root", content: "",
      created: new Date().toISOString(), modified: new Date().toISOString(),
      description: "Temporary files that are cleared on reboot",
      details: "Used for temporary files created by programs. Cleared on reboot.",
      processRelationship: "various — Programs store temporary working files here",
      children: []
    },
    {
      id: "usr", name: "usr", type: "directory", permissions: "drwxr-xr-x", owner: "root", group: "root", content: "",
      created: new Date().toISOString(), modified: new Date().toISOString(),
      description: "User utilities and applications (multi-user tools)",
      details: "Contains the majority of user utilities and applications.",
      processRelationship: "applications — User applications and data",
      children: [
        { id: "usr-bin", name: "bin", type: "directory", permissions: "drwxr-xr-x", owner: "root", group: "root", content: "", created: new Date().toISOString(), modified: new Date().toISOString(), description: "User binaries", details: "", processRelationship: "", children: [] },
        { id: "usr-lib", name: "lib", type: "directory", permissions: "drwxr-xr-x", owner: "root", group: "root", content: "", created: new Date().toISOString(), modified: new Date().toISOString(), description: "User libraries", details: "", processRelationship: "", children: [] },
        { id: "usr-local", name: "local", type: "directory", permissions: "drwxr-xr-x", owner: "root", group: "root", content: "", created: new Date().toISOString(), modified: new Date().toISOString(), description: "Local software", details: "", processRelationship: "", children: [] },
        { id: "usr-share", name: "share", type: "directory", permissions: "drwxr-xr-x", owner: "root", group: "root", content: "", created: new Date().toISOString(), modified: new Date().toISOString(), description: "Architecture-independent data", details: "", processRelationship: "", children: [] },
      ]
    },
    {
      id: "var", name: "var", type: "directory", permissions: "drwxr-xr-x", owner: "root", group: "root", content: "",
      created: new Date().toISOString(), modified: new Date().toISOString(),
      description: "Variable data files that change during system operation",
      details: "Contains files expected to change during normal operation, such as logs and spool files.",
      processRelationship: "logging — System logs and variable data stored here",
      children: [
        {
          id: "var-log", name: "log", type: "directory", permissions: "drwxr-xr-x", owner: "root", group: "root", content: "", created: new Date().toISOString(), modified: new Date().toISOString(), description: "System log files", details: "", processRelationship: "", children: [
            { id: "var-log-syslog", name: "syslog", type: "file", permissions: "-rw-r-----", owner: "root", group: "adm", content: "May  6 00:00:01 linux-sim systemd[1]: Started Linux Simulator.\nMay  6 00:00:02 linux-sim kernel: Linux version 5.15.0\nMay  6 00:00:03 linux-sim sshd[234]: Server listening on 0.0.0.0 port 22.", created: new Date().toISOString(), modified: new Date().toISOString(), description: "System log", details: "", processRelationship: "", children: [] },
            { id: "var-log-auth", name: "auth.log", type: "file", permissions: "-rw-r-----", owner: "root", group: "adm", content: "May  6 00:01:00 linux-sim sshd[234]: Accepted password for student\nMay  6 00:01:01 linux-sim sudo: student : TTY=pts/0 ; USER=root", created: new Date().toISOString(), modified: new Date().toISOString(), description: "Auth log", details: "", processRelationship: "", children: [] },
          ]
        },
        { id: "var-tmp", name: "tmp", type: "directory", permissions: "drwxrwxrwt", owner: "root", group: "root", content: "", created: new Date().toISOString(), modified: new Date().toISOString(), description: "Persistent temp files", details: "", processRelationship: "", children: [] },
        { id: "var-www", name: "www", type: "directory", permissions: "drwxr-xr-x", owner: "root", group: "www-data", content: "", created: new Date().toISOString(), modified: new Date().toISOString(), description: "Web server files", details: "", processRelationship: "", children: [] },
      ]
    },
    {
      id: "opt", name: "opt", type: "directory", permissions: "drwxr-xr-x", owner: "root", group: "root", content: "",
      created: new Date().toISOString(), modified: new Date().toISOString(),
      description: "Optional application software packages",
      details: "Reserved for installation of add-on application software packages.",
      processRelationship: "third-party apps — Optional software runs from this location",
      children: []
    },
    {
      id: "media", name: "media", type: "directory", permissions: "drwxr-xr-x", owner: "root", group: "root", content: "",
      created: new Date().toISOString(), modified: new Date().toISOString(),
      description: "Mount point for removable media",
      details: "Used as a mount point for removable media such as USB drives and CD-ROMs.",
      processRelationship: "mount — Mounting process for removable devices",
      children: [
        { id: "media-cdrom", name: "cdrom", type: "directory", permissions: "drwxr-xr-x", owner: "root", group: "root", content: "", created: new Date().toISOString(), modified: new Date().toISOString(), description: "CD-ROM mount", details: "", processRelationship: "", children: [] },
        { id: "media-usb", name: "usb", type: "directory", permissions: "drwxr-xr-x", owner: "root", group: "root", content: "", created: new Date().toISOString(), modified: new Date().toISOString(), description: "USB mount", details: "", processRelationship: "", children: [] },
      ]
    },
    {
      id: "mnt", name: "mnt", type: "directory", permissions: "drwxr-xr-x", owner: "root", group: "root", content: "",
      created: new Date().toISOString(), modified: new Date().toISOString(),
      description: "Mount point for temporarily mounted filesystems",
      details: "Used for temporarily mounting filesystems by system administrators.",
      processRelationship: "mount — Manual filesystem mounting",
      children: []
    },
    {
      id: "srv", name: "srv", type: "directory", permissions: "drwxr-xr-x", owner: "root", group: "root", content: "",
      created: new Date().toISOString(), modified: new Date().toISOString(),
      description: "Data for services provided by the system",
      details: "Contains data for services offered by the system like web and FTP servers.",
      processRelationship: "web server — Services like Apache serve content from here",
      children: [
        { id: "srv-www", name: "www", type: "directory", permissions: "drwxr-xr-x", owner: "root", group: "www-data", content: "", created: new Date().toISOString(), modified: new Date().toISOString(), description: "Web content", details: "", processRelationship: "", children: [] },
      ]
    },
    {
      id: "sys", name: "sys", type: "directory", permissions: "drwxr-xr-x", owner: "root", group: "root", content: "",
      created: new Date().toISOString(), modified: new Date().toISOString(),
      description: "Virtual filesystem for hardware device information",
      details: "A virtual filesystem that exposes kernel device information.",
      processRelationship: "kernel — Interface for kernel to export device information",
      children: [
        { id: "sys-block", name: "block", type: "directory", permissions: "dr-xr-xr-x", owner: "root", group: "root", content: "", created: new Date().toISOString(), modified: new Date().toISOString(), description: "Block devices", details: "", processRelationship: "", children: [] },
        { id: "sys-devices", name: "devices", type: "directory", permissions: "dr-xr-xr-x", owner: "root", group: "root", content: "", created: new Date().toISOString(), modified: new Date().toISOString(), description: "Device tree", details: "", processRelationship: "", children: [] },
      ]
    },
    {
      id: "run", name: "run", type: "directory", permissions: "drwxr-xr-x", owner: "root", group: "root", content: "",
      created: new Date().toISOString(), modified: new Date().toISOString(),
      description: "Run-time variable data since last boot",
      details: "Contains runtime data for processes started since the last boot.",
      processRelationship: "systemd — Early boot processes store runtime data here",
      children: [
        { id: "run-systemd", name: "systemd", type: "directory", permissions: "drwxr-xr-x", owner: "root", group: "root", content: "", created: new Date().toISOString(), modified: new Date().toISOString(), description: "Systemd runtime", details: "", processRelationship: "", children: [] },
      ]
    },
  ]
});

// FS Utility Functions
function findNodeByPath(fs, path) {
  if (path === "/" || path === "") return fs;
  const parts = path.split("/").filter(Boolean);
  let current = fs;
  for (const part of parts) {
    if (!current.children) return null;
    const next = current.children.find(c => c.name === part);
    if (!next) return null;
    current = next;
  }
  return current;
}

function getPathForNode(fs, targetId, currentPath = "/") {
  if (fs.id === targetId) return currentPath;
  if (!fs.children) return null;
  for (const child of fs.children) {
    const childPath = currentPath === "/" ? `/${child.name}` : `${currentPath}/${child.name}`;
    const result = getPathForNode(child, targetId, childPath);
    if (result) return result;
  }
  return null;
}

function resolvePath(cwd, inputPath) {
  if (inputPath.startsWith("/")) return normalizePath(inputPath);
  const base = cwd === "/" ? "" : cwd;
  return normalizePath(`${base}/${inputPath}`);
}

function normalizePath(path) {
  const parts = path.split("/").filter(Boolean);
  const resolved = [];
  for (const part of parts) {
    if (part === "..") resolved.pop();
    else if (part !== ".") resolved.push(part);
  }
  return "/" + resolved.join("/");
}

function cloneFS(node) {
  return JSON.parse(JSON.stringify(node));
}

function insertNodeAtPath(fs, parentPath, newNode) {
  const clone = cloneFS(fs);
  const parent = findNodeByPath(clone, parentPath);
  if (!parent || parent.type !== "directory") return null;
  parent.children.push(newNode);
  parent.modified = new Date().toISOString();
  return clone;
}

function deleteNodeAtPath(fs, targetPath) {
  const clone = cloneFS(fs);
  const parts = targetPath.split("/").filter(Boolean);
  const parentPath = "/" + parts.slice(0, -1).join("/");
  const name = parts[parts.length - 1];
  const parent = findNodeByPath(clone, parentPath);
  if (!parent) return null;
  parent.children = parent.children.filter(c => c.name !== name);
  parent.modified = new Date().toISOString();
  return clone;
}

function updateNodeAtPath(fs, targetPath, updates) {
  const clone = cloneFS(fs);
  const node = findNodeByPath(clone, targetPath);
  if (!node) return null;
  Object.assign(node, updates, { modified: new Date().toISOString() });
  return clone;
}

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

// ============================================================
// USERS
// ============================================================

const USERS = {
  root: { username: "root", group: "root", uid: 0, gid: 0, home: "/root", shell: "/bin/bash", privilege: "superuser" },
  student: { username: "student", group: "student", uid: 1000, gid: 1000, home: "/home/student", shell: "/bin/bash", privilege: "regular" },
  guest: { username: "guest", group: "guest", uid: 1001, gid: 1001, home: "/home/guest", shell: "/bin/sh", privilege: "regular" },
};

// ============================================================
// PERMISSION ENGINE
// ============================================================

function canRead(node, user) {
  if (user.username === "root") return true;
  const p = node.permissions;
  if (node.owner === user.username && p[1] === "r") return true;
  if (node.group === user.group && p[4] === "r") return true;
  if (p[7] === "r") return true;
  return false;
}

function canWrite(node, user) {
  if (user.username === "root") return true;
  const p = node.permissions;
  if (node.owner === user.username && p[2] === "w") return true;
  if (node.group === user.group && p[5] === "w") return true;
  if (p[8] === "w") return true;
  return false;
}

function canExecute(node, user) {
  if (user.username === "root") return true;
  const p = node.permissions;
  if (node.owner === user.username && p[3] === "x") return true;
  if (node.group === user.group && p[6] === "x") return true;
  if (p[9] === "x") return true;
  return false;
}

// ============================================================
// TERMINAL COMMAND ENGINE
// ============================================================

function executeCommand(cmd, args, state) {
  const { fs, cwd, user } = state;

  switch (cmd) {
    case "pwd": return { output: [cwd], newState: {} };
    case "whoami": return { output: [user.username], newState: {} };
    case "clear": return { output: [], newState: { clearTerminal: true } };
    case "help": return {
      output: [
        "\x1b[33mAvailable Commands:\x1b[0m",
        "  \x1b[36mls\x1b[0m      [path]        — List directory contents",
        "  \x1b[36mcd\x1b[0m      <path>        — Change directory",
        "  \x1b[36mpwd\x1b[0m                   — Print working directory",
        "  \x1b[36mmkdir\x1b[0m   <name>        — Create directory",
        "  \x1b[36mtouch\x1b[0m   <name>        — Create file",
        "  \x1b[36mcat\x1b[0m     <file>        — Show file contents",
        "  \x1b[36mrm\x1b[0m      [-r] <path>   — Remove file/directory",
        "  \x1b[36mchmod\x1b[0m   <octal> <path>— Change permissions",
        "  \x1b[36mwhoami\x1b[0m                — Show current user",
        "  \x1b[36mtree\x1b[0m    [path]        — Show directory tree",
        "  \x1b[36mecho\x1b[0m    <text>        — Print text",
        "  \x1b[36mfile\x1b[0m    <path>        — Show file type",
        "  \x1b[36mstat\x1b[0m    <path>        — Show file status",
        "  \x1b[36mclear\x1b[0m                 — Clear terminal",
        "  \x1b[36mhelp\x1b[0m                  — Show this help",
      ],
      newState: {}
    };

    case "ls": {
      const targetPath = args[0] ? resolvePath(cwd, args[0]) : cwd;
      const node = findNodeByPath(fs, targetPath);
      if (!node) return { output: [`ls: cannot access '${args[0] || targetPath}': No such file or directory`], newState: {} };
      if (!canRead(node, user)) return { output: [`ls: cannot open directory '${targetPath}': Permission denied`], newState: {} };
      if (node.type === "file") return { output: [node.name], newState: {} };
      const showAll = args.includes("-a") || args.includes("-la") || args.includes("-al");
      const showLong = args.includes("-l") || args.includes("-la") || args.includes("-al");
      let children = node.children || [];
      if (!showAll) children = children.filter(c => !c.name.startsWith("."));
      if (showLong) {
        const lines = ["total " + children.length];
        children.forEach(c => {
          const color = c.type === "directory" ? "\x1b[34m" : (c.permissions.startsWith("-rwx") ? "\x1b[32m" : "\x1b[0m");
          lines.push(`${c.permissions} 1 ${c.owner.padEnd(8)} ${c.group.padEnd(8)} ${String(c.content.length).padStart(6)} Jan 01 00:00 ${color}${c.name}\x1b[0m`);
        });
        return { output: lines, newState: {} };
      }
      const names = children.map(c => c.type === "directory" ? `\x1b[34m${c.name}\x1b[0m` : c.name);
      return { output: [names.join("  ") || "(empty)"], newState: {} };
    }

    case "cd": {
      if (!args[0] || args[0] === "~") {
        return { output: [], newState: { cwd: user.home } };
      }
      const targetPath = resolvePath(cwd, args[0]);
      const node = findNodeByPath(fs, targetPath);
      if (!node) return { output: [`cd: ${args[0]}: No such file or directory`], newState: {} };
      if (node.type !== "directory") return { output: [`cd: ${args[0]}: Not a directory`], newState: {} };
      if (!canExecute(node, user)) return { output: [`cd: ${args[0]}: Permission denied`], newState: {} };
      return { output: [], newState: { cwd: targetPath } };
    }

    case "mkdir": {
      if (!args[0]) return { output: ["mkdir: missing operand"], newState: {} };
      const targetPath = resolvePath(cwd, args[0]);
      const parts = targetPath.split("/").filter(Boolean);
      const name = parts[parts.length - 1];
      const parentPath = "/" + parts.slice(0, -1).join("/");
      const parentNode = findNodeByPath(fs, parentPath);
      if (!parentNode) return { output: [`mkdir: cannot create directory '${args[0]}': No such file or directory`], newState: {} };
      if (!canWrite(parentNode, user)) return { output: [`mkdir: cannot create directory '${args[0]}': Permission denied`], newState: {} };
      if (parentNode.children.find(c => c.name === name)) return { output: [`mkdir: cannot create directory '${args[0]}': File exists`], newState: {} };
      const newNode = { id: generateId(), name, type: "directory", permissions: "drwxr-xr-x", owner: user.username, group: user.group, content: "", created: new Date().toISOString(), modified: new Date().toISOString(), description: `Directory: ${name}`, details: "", processRelationship: "", children: [] };
      const newFS = insertNodeAtPath(fs, parentPath, newNode);
      return { output: [], newState: { fs: newFS } };
    }

    case "touch": {
      if (!args[0]) return { output: ["touch: missing file operand"], newState: {} };
      const targetPath = resolvePath(cwd, args[0]);
      const parts = targetPath.split("/").filter(Boolean);
      const name = parts[parts.length - 1];
      const parentPath = "/" + parts.slice(0, -1).join("/");
      const parentNode = findNodeByPath(fs, parentPath);
      if (!parentNode) return { output: [`touch: cannot touch '${args[0]}': No such file or directory`], newState: {} };
      if (!canWrite(parentNode, user)) return { output: [`touch: cannot touch '${args[0]}': Permission denied`], newState: {} };
      if (parentNode.children.find(c => c.name === name)) {
        const newFS = updateNodeAtPath(fs, targetPath, { modified: new Date().toISOString() });
        return { output: [], newState: { fs: newFS } };
      }
      const newNode = { id: generateId(), name, type: "file", permissions: "-rw-r--r--", owner: user.username, group: user.group, content: "", created: new Date().toISOString(), modified: new Date().toISOString(), description: `File: ${name}`, details: "", processRelationship: "", children: [] };
      const newFS = insertNodeAtPath(fs, parentPath, newNode);
      return { output: [], newState: { fs: newFS } };
    }

    case "cat": {
      if (!args[0]) return { output: ["cat: missing operand"], newState: {} };
      const targetPath = resolvePath(cwd, args[0]);
      const node = findNodeByPath(fs, targetPath);
      if (!node) return { output: [`cat: ${args[0]}: No such file or directory`], newState: {} };
      if (node.type === "directory") return { output: [`cat: ${args[0]}: Is a directory`], newState: {} };
      if (!canRead(node, user)) return { output: [`cat: ${args[0]}: Permission denied`], newState: {} };
      return { output: node.content ? node.content.split("\n") : ["(empty file)"], newState: {} };
    }

    case "rm": {
      if (!args[0]) return { output: ["rm: missing operand"], newState: {} };
      const recursive = args.includes("-r") || args.includes("-rf") || args.includes("-fr");
      const targetArg = args.find(a => !a.startsWith("-")) || args[0];
      const targetPath = resolvePath(cwd, targetArg);
      if (targetPath === "/") return { output: ["rm: cannot remove root directory '/'"], newState: {} };
      const node = findNodeByPath(fs, targetPath);
      if (!node) return { output: [`rm: cannot remove '${targetArg}': No such file or directory`], newState: {} };
      if (node.type === "directory" && !recursive) return { output: [`rm: cannot remove '${targetArg}': Is a directory (use -r)`], newState: {} };
      const parts = targetPath.split("/").filter(Boolean);
      const parentPath = "/" + parts.slice(0, -1).join("/");
      const parentNode = findNodeByPath(fs, parentPath);
      if (!canWrite(parentNode, user)) return { output: [`rm: cannot remove '${targetArg}': Permission denied`], newState: {} };
      const newFS = deleteNodeAtPath(fs, targetPath);
      return { output: [], newState: { fs: newFS } };
    }

    case "chmod": {
      if (args.length < 2) return { output: ["chmod: missing operand"], newState: {} };
      const octal = args[0];
      const targetPath = resolvePath(cwd, args[1]);
      const node = findNodeByPath(fs, targetPath);
      if (!node) return { output: [`chmod: cannot access '${args[1]}': No such file or directory`], newState: {} };
      if (node.owner !== user.username && user.username !== "root") return { output: [`chmod: changing permissions of '${args[1]}': Operation not permitted`], newState: {} };
      const octalNum = parseInt(octal, 8);
      if (isNaN(octalNum)) return { output: [`chmod: invalid mode: '${octal}'`], newState: {} };
      const permStr = octalToPermString(octalNum, node.type);
      const newFS = updateNodeAtPath(fs, targetPath, { permissions: permStr });
      return { output: [], newState: { fs: newFS } };
    }

    case "tree": {
      const targetPath = args[0] ? resolvePath(cwd, args[0]) : cwd;
      const node = findNodeByPath(fs, targetPath);
      if (!node) return { output: [`tree: '${args[0]}': No such file or directory`], newState: {} };
      const lines = [targetPath];
      function renderTree(n, prefix) {
        const children = n.children || [];
        children.forEach((child, idx) => {
          const isLast = idx === children.length - 1;
          const icon = child.type === "directory" ? "\x1b[34m" : "\x1b[0m";
          lines.push(`${prefix}${isLast ? "└── " : "├── "}${icon}${child.name}\x1b[0m`);
          if (child.type === "directory" && child.children) {
            renderTree(child, prefix + (isLast ? "    " : "│   "));
          }
        });
      }
      renderTree(node, "");
      lines.push(`\n${(node.children || []).filter(c => c.type === "directory").length} directories, ${(node.children || []).filter(c => c.type === "file").length} files`);
      return { output: lines, newState: {} };
    }

    case "echo": return { output: [args.join(" ")], newState: {} };

    case "file": {
      if (!args[0]) return { output: ["file: missing operand"], newState: {} };
      const targetPath = resolvePath(cwd, args[0]);
      const node = findNodeByPath(fs, targetPath);
      if (!node) return { output: [`file: ${args[0]}: No such file or directory`], newState: {} };
      const type = node.type === "directory" ? "directory" : (node.content ? "ASCII text" : "empty");
      return { output: [`${args[0]}: ${type}`], newState: {} };
    }

    case "stat": {
      if (!args[0]) return { output: ["stat: missing operand"], newState: {} };
      const targetPath = resolvePath(cwd, args[0]);
      const node = findNodeByPath(fs, targetPath);
      if (!node) return { output: [`stat: cannot stat '${args[0]}': No such file or directory`], newState: {} };
      return {
        output: [
          `  File: ${node.name}`,
          `  Size: ${node.content.length}   Blocks: 8   IO Block: 4096   ${node.type}`,
          `Device: fd00h/64768d   Inode: ${generateId()}   Links: 1`,
          `Access: (${permToOctal(node.permissions)?.toString(8).padStart(4,"0")}/${node.permissions})  Uid: (    0/   ${node.owner})  Gid: (    0/   ${node.group})`,
          `Modify: ${new Date(node.modified).toLocaleString()}`,
          `Change: ${new Date(node.created).toLocaleString()}`,
        ],
        newState: {}
      };
    }

    default:
      return { output: [`${cmd}: command not found. Type 'help' for available commands.`], newState: {} };
  }
}

function octalToPermString(octal, type = "file") {
  const prefix = type === "directory" ? "d" : "-";
  const bits = ["---","--x","-w-","-wx","r--","r-x","rw-","rwx"];
  const o = [(octal >> 6) & 7, (octal >> 3) & 7, octal & 7];
  return prefix + o.map(b => bits[b]).join("");
}

function permToOctal(perm) {
  if (!perm || perm.length < 10) return 0;
  const r = (c, v) => c === v ? 1 : 0;
  return (
    (r(perm[1],"r") << 8) | (r(perm[2],"w") << 7) | (r(perm[3],"x") << 6) |
    (r(perm[4],"r") << 5) | (r(perm[5],"w") << 4) | (r(perm[6],"x") << 3) |
    (r(perm[7],"r") << 2) | (r(perm[8],"w") << 1) | r(perm[9],"x")
  );
}

// ============================================================
// CONTEXT
// ============================================================

const SimContext = createContext(null);
function useSim() { return useContext(SimContext); }

// ============================================================
// ANSI COLOR RENDERER
// ============================================================

function AnsiText({ text }) {
  const parts = [];
  const re = /\x1b\[(\d+)m/g;
  let last = 0;
  let match;
  let currentColor = null;
  const colorMap = { "0": null, "31": "#ff5f57", "32": "#28ca41", "33": "#febc2e", "34": "#7aa2f7", "35": "#bb9af7", "36": "#7dcfff" };

  const segments = [];
  let raw = text;
  let pos = 0;
  const parts2 = raw.split(/(\x1b\[\d+m)/);
  let color = null;
  parts2.forEach(part => {
    const m = part.match(/\x1b\[(\d+)m/);
    if (m) { color = colorMap[m[1]] !== undefined ? colorMap[m[1]] : color; }
    else if (part) segments.push({ text: part, color });
  });

  return (
    <span>
      {segments.map((s, i) => (
        <span key={i} style={s.color ? { color: s.color } : {}}>{s.text}</span>
      ))}
    </span>
  );
}

// ============================================================
// TERMINAL COMPONENT
// ============================================================

function Terminal() {
  const { fs, setFs, cwd, setCwd, currentUser } = useSim();
  const [lines, setLines] = useState([
    { type: "output", text: "\x1b[32mLinux Filesystem Simulator — Educational Shell\x1b[0m" },
    { type: "output", text: "Type \x1b[36mhelp\x1b[0m to see available commands." },
    { type: "output", text: "" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [lines]);

  const prompt = `\x1b[32m${currentUser.username}@linux-sim\x1b[0m:\x1b[34m${cwd}\x1b[0m${currentUser.username === "root" ? "#" : "$"}`;

  function handleSubmit() {
    const raw = inputValue.trim();
    if (!raw) {
      setLines(l => [...l, { type: "prompt", text: prompt, input: "" }]);
      return;
    }
    const newHistory = [raw, ...history].slice(0, 50);
    setHistory(newHistory);
    setHistoryIndex(-1);

    const parts = raw.split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);

    const promptLine = { type: "prompt", text: prompt, input: raw };

    const result = executeCommand(cmd, args, { fs, cwd, user: currentUser });

    if (result.newState.clearTerminal) {
      setLines([]);
      setInputValue("");
      return;
    }

    if (result.newState.fs) setFs(result.newState.fs);
    if (result.newState.cwd !== undefined) setCwd(result.newState.cwd);

    const outputLines = (result.output || []).map(t => ({ type: "output", text: t }));
    setLines(l => [...l, promptLine, ...outputLines]);
    setInputValue("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") { handleSubmit(); }
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      const idx = historyIndex + 1;
      if (idx < history.length) { setHistoryIndex(idx); setInputValue(history[idx]); }
    }
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      const idx = historyIndex - 1;
      if (idx < 0) { setHistoryIndex(-1); setInputValue(""); }
      else { setHistoryIndex(idx); setInputValue(history[idx]); }
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-950 rounded-lg border border-gray-700 overflow-hidden font-mono text-sm">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="ml-2 text-gray-400 text-xs">bash — {currentUser.username}@linux-sim</span>
      </div>
      {/* Output */}
      <div ref={terminalRef} className="flex-1 overflow-y-auto p-4 space-y-0.5 cursor-text" onClick={() => inputRef.current?.focus()}>
        {lines.map((line, i) => (
          <div key={i} className="leading-5">
            {line.type === "prompt" ? (
              <span><AnsiText text={line.text} /> <span className="text-gray-100">{line.input}</span></span>
            ) : (
              <span className="text-gray-300"><AnsiText text={line.text} /></span>
            )}
          </div>
        ))}
        {/* Input line */}
        <div className="flex items-center leading-5">
          <span className="mr-1 whitespace-pre"><AnsiText text={prompt} /></span>
          <span className="text-white"> </span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-white outline-none caret-green-400"
            autoFocus
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DIRECTORY TREE PANEL
// ============================================================

function TreeNode({ node, path, depth = 0 }) {
  const { selectedPath, setSelectedPath } = useSim();
  const [expanded, setExpanded] = useState(depth < 1);
  const isSelected = selectedPath === path;
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <div
        className={`flex items-center gap-1 py-0.5 px-2 rounded cursor-pointer text-sm group transition-colors ${isSelected ? "bg-blue-600 text-white" : "hover:bg-gray-700 text-gray-300"}`}
        style={{ paddingLeft: `${8 + depth * 14}px` }}
        onClick={() => { setSelectedPath(path); if (hasChildren) setExpanded(e => !e); }}
      >
        {hasChildren ? (
          <span className="text-xs text-gray-500 w-3">{expanded ? "▾" : "▸"}</span>
        ) : (
          <span className="w-3"></span>
        )}
        <span>{node.type === "directory" ? "📁" : "📄"}</span>
        <span className="truncate">{node.name}</span>
      </div>
      {expanded && hasChildren && node.children.map(child => {
        const childPath = path === "/" ? `/${child.name}` : `${path}/${child.name}`;
        return <TreeNode key={child.id} node={child} path={childPath} depth={depth + 1} />;
      })}
    </div>
  );
}

function DirectoryTree() {
  const { fs } = useSim();
  return (
    <div className="flex-1 overflow-y-auto bg-gray-800 rounded-lg border border-gray-700 p-2">
      <div className="text-xs font-semibold text-gray-400 uppercase px-2 py-1 mb-1">Filesystem</div>
      <TreeNode node={fs} path="/" depth={0} />
    </div>
  );
}

// ============================================================
// DETAILS PANEL
// ============================================================

function PermGrid({ perm }) {
  if (!perm || perm.length < 10) return null;
  const sections = [
    { label: "Owner", bits: perm.slice(1, 4) },
    { label: "Group", bits: perm.slice(4, 7) },
    { label: "Others", bits: perm.slice(7, 10) },
  ];
  const labels = ["r", "w", "x"];
  return (
    <div className="flex gap-2 mt-1">
      {sections.map(s => (
        <div key={s.label} className="flex-1 bg-gray-700 rounded p-2 text-center">
          <div className="text-xs text-gray-400 mb-1">{s.label}</div>
          {labels.map((l, i) => (
            <div key={l} className="flex justify-between text-xs">
              <span className="text-gray-400">{l}</span>
              <span className={s.bits[i] === l ? "text-green-400" : "text-red-400"}>{s.bits[i] === l ? "✓" : "✗"}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function PermissionEditor({ node, nodePath }) {
  const { fs, setFs } = useSim();
  const perm = node.permissions;
  if (!perm || perm.length < 10) return null;

  const positions = [1,2,3,4,5,6,7,8,9];
  const chars = ["r","w","x","r","w","x","r","w","x"];

  function toggle(i) {
    const arr = perm.split("");
    arr[i] = arr[i] === chars[i-1] ? "-" : chars[i-1];
    const newPerm = arr.join("");
    const newFS = updateNodeAtPath(fs, nodePath, { permissions: newPerm });
    if (newFS) setFs(newFS);
  }

  const octal = permToOctal(perm);
  const octalStr = octal.toString(8).padStart(4, "0");

  return (
    <div className="mt-3">
      <div className="text-xs font-semibold text-gray-400 mb-2">PERMISSION EDITOR</div>
      <div className="grid grid-cols-9 gap-1 mb-2">
        {["Owner R","Owner W","Owner X","Group R","Group W","Group X","Others R","Others W","Others X"].map((label, i) => (
          <button
            key={i}
            onClick={() => toggle(i+1)}
            title={label}
            className={`rounded text-xs py-1 font-mono transition-colors ${perm[i+1] === chars[i] ? "bg-green-600 text-white" : "bg-gray-700 text-gray-400"}`}
          >
            {chars[i]}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3 text-xs">
        <span className="text-gray-400">String: <span className="font-mono text-yellow-300">{perm}</span></span>
        <span className="text-gray-400">Octal: <span className="font-mono text-yellow-300">{octalStr}</span></span>
      </div>
    </div>
  );
}

function DetailsPanel() {
  const { fs, setFs, selectedPath, currentUser } = useSim();
  const [editingContent, setEditingContent] = useState(false);
  const [contentDraft, setContentDraft] = useState("");
  const [showModal, setShowModal] = useState(null); // "newFile" | "newDir" | "rename"
  const [modalInput, setModalInput] = useState("");

  const node = findNodeByPath(fs, selectedPath);

  if (!node) return (
    <div className="flex-1 flex items-center justify-center text-gray-500">
      <div className="text-center"><div className="text-4xl mb-2">📂</div>Select a directory</div>
    </div>
  );

  const octalStr = permToOctal(node.permissions).toString(8).padStart(4, "0");

  function handleNewItem(type) {
    if (!modalInput.trim()) return;
    const newNode = {
      id: generateId(), name: modalInput.trim(),
      type, permissions: type === "directory" ? "drwxr-xr-x" : "-rw-r--r--",
      owner: currentUser.username, group: currentUser.group,
      content: "", created: new Date().toISOString(), modified: new Date().toISOString(),
      description: `${type}: ${modalInput.trim()}`, details: "", processRelationship: "", children: []
    };
    const targetPath = node.type === "directory" ? selectedPath : selectedPath.split("/").slice(0,-1).join("/") || "/";
    const newFS = insertNodeAtPath(fs, targetPath, newNode);
    if (newFS) setFs(newFS);
    setShowModal(null); setModalInput("");
  }

  function handleRename() {
    if (!modalInput.trim()) return;
    const newFS = updateNodeAtPath(fs, selectedPath, { name: modalInput.trim() });
    if (newFS) setFs(newFS);
    setShowModal(null); setModalInput("");
  }

  function handleDelete() {
    if (selectedPath === "/") return;
    const newFS = deleteNodeAtPath(fs, selectedPath);
    if (newFS) setFs(newFS);
  }

  function saveContent() {
    const newFS = updateNodeAtPath(fs, selectedPath, { content: contentDraft });
    if (newFS) setFs(newFS);
    setEditingContent(false);
  }

  const canEditNode = canWrite(node, currentUser);
  const isDir = node.type === "directory";

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 w-80">
            <h3 className="text-white font-semibold mb-3">
              {showModal === "newFile" ? "New File" : showModal === "newDir" ? "New Directory" : "Rename"}
            </h3>
            <input
              autoFocus
              type="text"
              value={modalInput}
              onChange={e => setModalInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && (showModal === "rename" ? handleRename() : handleNewItem(showModal === "newDir" ? "directory" : "file"))}
              placeholder={showModal === "rename" ? node.name : "name"}
              className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white text-sm outline-none focus:border-blue-500 mb-4"
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => { setShowModal(null); setModalInput(""); }} className="px-3 py-1.5 text-sm text-gray-400 hover:text-white">Cancel</button>
              <button onClick={() => showModal === "rename" ? handleRename() : handleNewItem(showModal === "newDir" ? "directory" : "file")} className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-500">OK</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{isDir ? "📁" : "📄"}</span>
            <h2 className="text-lg font-bold text-white">{selectedPath === "/" ? "/ (root)" : node.name}</h2>
          </div>
          <div className="text-xs text-gray-400 mt-0.5">{selectedPath}</div>
        </div>
        {selectedPath !== "/" && (
          <div className="flex gap-1 flex-wrap">
            {isDir && canEditNode && (
              <>
                <button onClick={() => setShowModal("newDir")} className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600">+ Dir</button>
                <button onClick={() => setShowModal("newFile")} className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600">+ File</button>
              </>
            )}
            <button onClick={() => setShowModal("rename")} className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600">Rename</button>
            <button onClick={handleDelete} className="px-2 py-1 text-xs bg-red-800 text-red-200 rounded hover:bg-red-700">Delete</button>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-300">{node.description}</p>
      {node.details && <p className="text-xs text-gray-500 bg-gray-800 p-3 rounded border border-gray-700">{node.details}</p>}

      {/* Metadata */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        {[["Type", node.type], ["Owner", node.owner], ["Group", node.group], ["Permissions", node.permissions], ["Octal", octalStr], ["Modified", new Date(node.modified).toLocaleString()]].map(([k, v]) => (
          <div key={k} className="bg-gray-800 rounded p-2">
            <div className="text-gray-500">{k}</div>
            <div className="text-gray-200 font-mono mt-0.5 truncate">{v}</div>
          </div>
        ))}
      </div>

      {/* Permissions */}
      <PermGrid perm={node.permissions} />
      <PermissionEditor node={node} nodePath={selectedPath} />

      {/* Contents */}
      {isDir && node.children && (
        <div>
          <div className="text-xs font-semibold text-gray-400 mb-2">CONTENTS ({node.children.length} items)</div>
          <div className="bg-gray-800 rounded border border-gray-700 overflow-hidden">
            {node.children.length === 0 ? (
              <div className="p-3 text-gray-500 text-sm italic">Empty directory</div>
            ) : node.children.map((child, i) => (
              <div key={child.id} className={`flex items-center gap-2 px-3 py-2 text-sm ${i > 0 ? "border-t border-gray-700" : ""}`}>
                <span>{child.type === "directory" ? "📁" : "📄"}</span>
                <span className="flex-1 text-gray-300 font-mono">{child.name}</span>
                <span className="text-gray-600 text-xs font-mono">{child.permissions}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File content editor */}
      {!isDir && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold text-gray-400">CONTENT</div>
            {canEditNode && !editingContent && <button onClick={() => { setEditingContent(true); setContentDraft(node.content); }} className="text-xs text-blue-400 hover:text-blue-300">Edit</button>}
          </div>
          {editingContent ? (
            <div>
              <textarea
                value={contentDraft}
                onChange={e => setContentDraft(e.target.value)}
                rows={6}
                className="w-full bg-gray-900 border border-blue-500 rounded p-2 text-sm text-green-300 font-mono outline-none resize-y"
              />
              <div className="flex gap-2 mt-2">
                <button onClick={saveContent} className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-500">Save</button>
                <button onClick={() => setEditingContent(false)} className="px-3 py-1.5 text-xs text-gray-400 hover:text-white">Cancel</button>
              </div>
            </div>
          ) : (
            <pre className="bg-gray-900 rounded p-3 text-xs text-green-300 font-mono overflow-x-auto border border-gray-700 max-h-40">{node.content || "(empty file)"}</pre>
          )}
        </div>
      )}

      {/* Process relationship */}
      {node.processRelationship && (
        <div className="bg-gray-800 border border-gray-700 rounded p-3">
          <div className="text-xs font-semibold text-gray-400 mb-1">PROCESS RELATIONSHIP</div>
          <div className="text-sm text-gray-300">{node.processRelationship}</div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// USER SWITCHER
// ============================================================

function UserSwitcher() {
  const { currentUser, setCurrentUser, setCwd } = useSim();
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400">User:</span>
      {Object.values(USERS).map(u => (
        <button
          key={u.username}
          onClick={() => { setCurrentUser(u); setCwd(u.home); }}
          className={`px-2 py-1 text-xs rounded font-mono transition-colors ${currentUser.username === u.username ? (u.username === "root" ? "bg-red-600 text-white" : "bg-blue-600 text-white") : "bg-gray-700 text-gray-400 hover:bg-gray-600"}`}
        >
          {u.username === "root" ? "⚡" : u.username === "guest" ? "👤" : "🎓"} {u.username}
        </button>
      ))}
    </div>
  );
}

// ============================================================
// FS COMPARISON MODULE
// ============================================================

const fsData = {
  EXT4: {
    color: "from-blue-600 to-blue-800",
    accent: "blue",
    icon: "🐧",
    tagline: "Default Linux filesystem",
    maxFile: "16 TiB",
    maxPartition: "1 EiB",
    journaling: "Yes (full)",
    linuxSupport: "Native",
    windowsSupport: "3rd party only",
    performance: "Excellent",
    fragmentation: "Low",
    security: "Full POSIX",
    permissions: "Full Unix perms",
    reliability: "Very High",
    useCases: "Linux OS, servers, general purpose",
    pros: ["Built-in journaling", "Low fragmentation", "Excellent Linux support", "Mature & stable"],
    cons: ["Limited Windows support", "No built-in encryption", "No native compression"],
  },
  NTFS: {
    color: "from-blue-500 to-cyan-700",
    accent: "cyan",
    icon: "🪟",
    tagline: "Default Windows filesystem",
    maxFile: "16 EiB (theoretical)",
    maxPartition: "256 TiB",
    journaling: "Yes (metadata)",
    linuxSupport: "Via ntfs-3g",
    windowsSupport: "Native",
    performance: "Good",
    fragmentation: "Medium",
    security: "ACLs, EFS encryption",
    permissions: "Windows ACLs",
    reliability: "High",
    useCases: "Windows OS, cross-platform drives, external disks",
    pros: ["Windows native", "Supports encryption", "Large file support", "Compression built-in"],
    cons: ["Fragmentation over time", "Partial Linux support", "Overhead from metadata"],
  },
  FAT32: {
    color: "from-purple-600 to-pink-700",
    accent: "pink",
    icon: "💾",
    tagline: "Universal compatibility",
    maxFile: "4 GiB",
    maxPartition: "2 TiB",
    journaling: "No",
    linuxSupport: "Full",
    windowsSupport: "Full",
    performance: "Basic",
    fragmentation: "High",
    security: "None",
    permissions: "None",
    reliability: "Low (no journaling)",
    useCases: "USB drives, SD cards, firmware, embedded systems",
    pros: ["Universal support", "Simple structure", "Works everywhere", "Low overhead"],
    cons: ["4 GiB max file size", "No journaling", "No permissions", "High fragmentation"],
  }
};

function FSComparison() {
  const [activeTab, setActiveTab] = useState("EXT4");
  const fs2 = fsData[activeTab];

  return (
    <div className="p-6 h-full overflow-y-auto">
      <h2 className="text-xl font-bold text-white mb-1">Filesystem Type Comparison</h2>
      <p className="text-gray-400 text-sm mb-4">Compare EXT4, NTFS, and FAT32 filesystems</p>

      <div className="flex gap-2 mb-6">
        {Object.keys(fsData).map(name => (
          <button
            key={name}
            onClick={() => setActiveTab(name)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === name ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
          >
            {fsData[name].icon} {name}
          </button>
        ))}
      </div>

      <div className={`rounded-xl bg-gradient-to-br ${fs2.color} p-0.5 mb-4`}>
        <div className="bg-gray-900 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{fs2.icon}</span>
            <div>
              <h3 className="text-lg font-bold text-white">{activeTab}</h3>
              <div className="text-gray-400 text-sm">{fs2.tagline}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              ["Max File Size", fs2.maxFile], ["Max Partition", fs2.maxPartition],
              ["Journaling", fs2.journaling], ["Linux Support", fs2.linuxSupport],
              ["Windows Support", fs2.windowsSupport], ["Performance", fs2.performance],
              ["Fragmentation", fs2.fragmentation], ["Security", fs2.security],
              ["Permissions", fs2.permissions], ["Reliability", fs2.reliability],
              ["Use Cases", fs2.useCases],
            ].map(([k, v]) => (
              <div key={k} className="bg-gray-800 rounded p-2">
                <div className="text-gray-500 text-xs">{k}</div>
                <div className="text-gray-200 text-xs font-medium mt-0.5">{v}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <div className="text-xs font-semibold text-green-400 mb-1">✓ Advantages</div>
              {fs2.pros.map(p => <div key={p} className="text-xs text-gray-300 mb-0.5">• {p}</div>)}
            </div>
            <div>
              <div className="text-xs font-semibold text-red-400 mb-1">✗ Disadvantages</div>
              {fs2.cons.map(c => <div key={c} className="text-xs text-gray-300 mb-0.5">• {c}</div>)}
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-side comparison table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-800">
              <th className="p-2 text-left text-gray-400 border border-gray-700">Feature</th>
              {Object.keys(fsData).map(n => <th key={n} className={`p-2 text-center border border-gray-700 ${activeTab === n ? "text-blue-400" : "text-gray-300"}`}>{n}</th>)}
            </tr>
          </thead>
          <tbody>
            {[["Journaling","journaling"],["Max File Size","maxFile"],["Linux Support","linuxSupport"],["Windows Support","windowsSupport"],["Performance","performance"],["Reliability","reliability"]].map(([label, key]) => (
              <tr key={key} className="border-b border-gray-700 hover:bg-gray-800/50">
                <td className="p-2 text-gray-400 border border-gray-700">{label}</td>
                {Object.keys(fsData).map(n => (
                  <td key={n} className={`p-2 text-center border border-gray-700 ${activeTab === n ? "text-white font-medium" : "text-gray-400"}`}>{fsData[n][key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// EDUCATIONAL PANEL
// ============================================================

function Education() {
  const [open, setOpen] = useState("inode");
  const topics = [
    { id: "inode", title: "Inodes", icon: "🔢", content: "An inode (index node) is a data structure in a Unix-style filesystem that describes a filesystem object such as a file or a directory. Each inode stores the attributes and disk block locations of the object's data. File-system object attributes may include metadata (times of last change, access, modification), as well as owner and permission data.\n\nEach file has exactly one inode, but a file may have multiple hard links. The inode number is the filesystem's internal identifier — not the file's name." },
    { id: "mount", title: "Mount Points", icon: "📌", content: "A mount point is a directory where a filesystem is attached into the existing directory tree. When you mount a filesystem, it appears as if all the files and directories of the new filesystem are inside the directory used as the mount point.\n\nCommon mounts: /boot (boot partition), /home (user data), /mnt (temporary mounts), /media (removable devices)." },
    { id: "vfs", title: "Virtual Filesystem (VFS)", icon: "🌐", content: "The Virtual File System (VFS) is an abstraction layer within the kernel that allows different filesystem types to be used in a uniform way. Applications can use the same system calls (open, read, write, close) regardless of which filesystem is used.\n\nVFS supports ext4, NTFS, FAT32, NFS, and even virtual filesystems like /proc and /sys." },
    { id: "perms", title: "Permission Hierarchy", icon: "🔐", content: "Linux uses a discretionary access control (DAC) model based on three permission levels:\n• Owner (u): The user who created the file\n• Group (g): Users in the file's assigned group\n• Others (o): All other users\n\nEach level has three permission bits: Read (r=4), Write (w=2), Execute (x=1). The octal representation combines these: rwxr-xr-x = 755." },
    { id: "boot", title: "Linux Boot Flow", icon: "🚀", content: "Linux boot sequence:\n1. BIOS/UEFI: Hardware POST & firmware initialization\n2. Bootloader (GRUB): Loads from /boot, selects kernel\n3. Kernel: Decompresses, initializes hardware, mounts rootfs\n4. initramfs: Temporary root filesystem for early boot\n5. systemd (PID 1): First real process, mounts /proc, /sys\n6. Init targets: System services, networking, login prompt\n7. User login: Shell starts, ~/.bashrc loaded" },
    { id: "proc", title: "Process-to-FS Interaction", icon: "⚙️", content: "Processes interact with the filesystem through system calls:\n• open() — opens a file descriptor\n• read()/write() — data transfer\n• stat() — file metadata\n• fork()/exec() — process creation loads binaries from disk\n\nEvery process has a working directory (cwd), and the /proc/<PID>/ directory exposes process memory maps, file descriptor tables, and CPU/memory usage." },
  ];

  return (
    <div className="p-6 h-full overflow-y-auto">
      <h2 className="text-xl font-bold text-white mb-1">OS & Filesystem Concepts</h2>
      <p className="text-gray-400 text-sm mb-4">Deep dives into core Linux concepts</p>
      <div className="space-y-2">
        {topics.map(t => (
          <div key={t.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <button
              onClick={() => setOpen(open === t.id ? null : t.id)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-750"
            >
              <div className="flex items-center gap-2">
                <span>{t.icon}</span>
                <span className="text-white font-medium text-sm">{t.title}</span>
              </div>
              <span className="text-gray-400 text-xs">{open === t.id ? "▲" : "▼"}</span>
            </button>
            {open === t.id && (
              <div className="px-4 pb-4 text-xs text-gray-300 whitespace-pre-line border-t border-gray-700 pt-3">
                {t.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================

export default function LinuxSimulator() {
  const [fs, setFs] = useState(buildInitialFS);
  const [cwd, setCwd] = useState("/home/student");
  const [currentUser, setCurrentUser] = useState(USERS.student);
  const [selectedPath, setSelectedPath] = useState("/");
  const [activeTab, setActiveTab] = useState("explorer"); // explorer | terminal | fscomp | education
  const [terminalOpen, setTerminalOpen] = useState(true);

  // Sync selectedPath to cwd when cwd changes
  useEffect(() => { setSelectedPath(cwd); }, [cwd]);

  const ctxValue = { fs, setFs, cwd, setCwd, currentUser, setCurrentUser, selectedPath, setSelectedPath };

  const tabs = [
    { id: "explorer", label: "Explorer", icon: "🗂" },
    { id: "fscomp", label: "FS Comparison", icon: "📊" },
    { id: "education", label: "Concepts", icon: "📚" },
  ];

  return (
    <SimContext.Provider value={ctxValue}>
      <div className="flex flex-col h-screen bg-gray-900 text-white font-sans overflow-hidden pb-12">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-lg">🐧</span>
            <span className="font-bold text-white text-sm tracking-wide">Linux Filesystem Simulator</span>
            <div className="flex gap-1 ml-4">
              {tabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-3 py-1 text-xs rounded transition-colors ${activeTab === t.id ? "bg-gray-600 text-white" : "text-gray-400 hover:text-white"}`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <UserSwitcher />
            <button
              onClick={() => setTerminalOpen(t => !t)}
              className={`px-3 py-1 text-xs rounded transition-colors ${terminalOpen ? "bg-green-700 text-white" : "bg-gray-700 text-gray-300"}`}
            >
              {terminalOpen ? "▼" : "▲"} Terminal
            </button>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1 px-4 py-1.5 bg-gray-850 border-b border-gray-700 shrink-0 text-xs text-gray-400 bg-gray-800/50">
          <span>Path:</span>
          {selectedPath.split("/").filter(Boolean).reduce((acc, part, i, arr) => {
            const path = "/" + arr.slice(0, i + 1).join("/");
            return [...acc,
              <span key="sep" className="text-gray-600">/</span>,
              <button key={path} onClick={() => setSelectedPath(path)} className="hover:text-blue-400 text-gray-300">{part}</button>
            ];
          }, [<button key="/" onClick={() => setSelectedPath("/")} className="hover:text-blue-400 text-gray-300">/</button>])}
        </div>

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden gap-2 p-2">
          {/* Left side - Explorer */}
          <div className="flex-1 flex overflow-hidden">
            {activeTab === "explorer" ? (
              <>
                {/* Tree */}
                <div className="w-56 shrink-0 border-r border-gray-700 pr-2 overflow-y-auto">
                  <DirectoryTree />
                </div>
                {/* Details */}
                <div className="flex-1 flex flex-col overflow-hidden pl-2">
                  <DetailsPanel />
                </div>
              </>
            ) : activeTab === "fscomp" ? (
              <div className="flex-1 overflow-hidden"><FSComparison /></div>
            ) : (
              <div className="flex-1 overflow-hidden"><Education /></div>
            )}
          </div>

          {/* Terminal - Right side */}
          {terminalOpen && (
            <div className="w-96 shrink-0 border-l border-gray-700 pl-2 bg-gray-950 rounded-lg overflow-hidden">
              <Terminal />
            </div>
          )}
        </div>
      </div>
    </SimContext.Provider>
  );
}