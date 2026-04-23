import { useState, useRef, useEffect } from "react";
import type { PersonalInfo } from "../types";

// --- SUB-COMPONENTS for a clean structure ---

/**
 * Renders the output of a command.
 * Uses dangerouslySetInnerHTML to allow for clickable links.
 * This is safe because the content is generated from controlled data (personalInfo).
 */
const CommandOutput = ({ htmlContent }) => {
  return (
    <div
      className="text-green-400 whitespace-pre-wrap"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

/**
 * Renders the command input line with the prompt.
 */
const InputLine = ({
  input,
  onInputChange,
  onCommand,
  onKeyDown,
  inputRef,
}) => {
  return (
    <div className="flex w-full items-center">
      <span className="text-yellow-400 shrink-0">guest@portfolio:~$</span>
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onCommand();
          } else {
            onKeyDown(e);
          }
        }}
        className="flex-grow bg-transparent border-none outline-none text-green-400 pl-2 font-mono"
        autoFocus
        autoComplete="off"
      />
    </div>
  );
};

// --- THE MAIN TERMINAL COMPONENT ---

const Terminal = ({ personalInfo, onEverything, onSwitchToUI, onShowResume, resumeNames = [] } : {personalInfo: PersonalInfo, onEverything?: () => void, onSwitchToUI?: () => void, onShowResume?: (n: number) => void, resumeNames?: string[]}) => {
  const [isWide, setIsWide] = useState(() => window.innerWidth >= 640);

  useEffect(() => {
    const handleResize = () => setIsWide(window.innerWidth >= 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- STATE MANAGEMENT ---
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [debugMode, setDebugMode] = useState(() => sessionStorage.getItem('cli_debug') === '1');

  // --- REFS for DOM manipulation ---
  const inputRef = useRef(null);
  const terminalEndRef = useRef(null);

  // --- CONSTANTS ---
  // "debug" and "resume" are intentionally omitted until debug mode is active.
  const commands = [
    "help",
    "about",
    "skills",
    "experience",
    "projects",
    "education",
    "contact",
    "volunteer",
    "awards",
    "all",
    "clear",
    "ui",
    ...(debugMode ? ["resume"] : []),
    "everything",
  ];

  // --- UTILITY & FORMATTING ---
  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Formatters for different resume sections to keep command logic clean
  const hangingIndent = (text: string, depth: number) =>
    `<span style="display:block;padding-left:${depth}ch;text-indent:-${depth}ch">${text}</span>`;

  const formatters = {
    date: (date) =>
      new Date(date).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
    experience: (exp) =>
      `\n<span class="text-cyan-300">&gt; ${exp.position} @ ${exp.company} (${
        exp.location
      })</span> <span class="text-gray-500">| ${formatters.date(exp.startDate)} - ${
        exp.current ? "Present" : formatters.date(exp.endDate)
      }</span>\n` +
      exp.descriptionBulletPoints.map((p) => hangingIndent(`  - ${p}`, 4)).join("") +
      `\n<span class="text-gray-500">  [Technologies: ${exp.technologies.join(", ")}]</span>`,
    project: (proj) =>
      `\n<span class="text-cyan-300">&gt; ${proj.title}</span>\n` +
      hangingIndent(`  ${proj.description}`, 2) +
      hangingIndent(`  <span class="text-gray-500">[Technologies: ${proj.technologies.join(", ")}]</span>`, 2) +
      hangingIndent(`  <span class="text-gray-500">Link:</span> <a href="${encodeURI(proj.link)}" target="_blank" rel="noopener noreferrer" class="text-blue-400 underline hover:text-blue-300">${proj.link}</a>`, 2),
    education: (edu) =>
      `<span class="text-cyan-300">&gt; ${edu.degree} in ${edu.major}</span>\n` +
      `  ${edu.university} (${edu.location}) <span class="text-gray-500">| ${formatters.date(edu.graduationDate)}</span>\n` +
      (edu.minor ? `  Minor: ${edu.minor}\n` : "") +
      (edu.certificate ? `  Certificate: ${edu.certificate}\n` : "") +
      `  <span class="text-green-400">GPA: ${edu.gpa.toFixed(2)}</span>\n`,
    skill: (skill) => {
      const bar =
        "█".repeat(Math.round(skill.level * 10)) +
        "░".repeat(10 - Math.round(skill.level * 10));
      return `${skill.name.padEnd(20, " ")} [${bar}]`;
    },
    volunteer: (vol) =>
      `\n<span class="text-cyan-300">&gt; ${vol.position} @ ${vol.organization} ${
        vol.suborganization ? `(${vol.suborganization})` : ""
      }</span> <span class="text-gray-500">| ${formatters.date(vol.startDate)} - ${
        vol.current ? "Present" : formatters.date(vol.endDate)
      }</span>\n` +
      vol.descriptionBulletPoints.map((p) => hangingIndent(`  - ${p}`, 4)).join(""),
    award: (award) => {
      const dateStr =
        award.date instanceof Date ? formatters.date(award.date) : award.date;
      return `\n<span class="text-cyan-300">&gt; ${award.title}</span> <span class="text-gray-500">- ${award.organization} (${dateStr})</span>` +
        hangingIndent(`  ${award.description}`, 2);
    },
  };

  const cmdSpan = (cmd: string) =>
    `<span data-command="${cmd}" class="text-cyan-300 cursor-pointer hover:underline">${cmd}</span>`;

  const debugCmdSpan = (cmd: string) =>
    `<span data-command="${cmd}" class="text-orange-400 cursor-pointer hover:underline">${cmd}</span>`;

  // --- COMMAND HANDLING ---
  const getCommandOutput = (command) => {
    const [cmd, ...args] = command.toLowerCase().split(" ");
    switch (cmd) {
      case "help": {
        const debugCmds = new Set(["resume"]);
        return (
          `Available commands:\n\n` +
          commands.slice(0, -1).map(c => debugCmds.has(c) ? debugCmdSpan(c) : cmdSpan(c)).join("\n") +
          `\n${cmdSpan("everything")}         # flash warning`
        );
      }
      case "about": {
        const asciiWide = [
          "                     _         __  __      _____                     _ _ ",
          "     /\\             | |       |  \\/  |    |  __ \\                   | | |",
          "    /  \\   _ __   __| |_   _  | \\  / | ___| |  | | _____      ____ _| | |",
          "   / /\\ \\ | '_ \\ / _` | | | | | |\\/| |/ __| |  | |/ _ \\ \\ /\\ / / _` | | |",
          "  / ____ \\| | | | (_| | |_| | | |  | | (__| |__| | (_) \\ V  V / (_| | | |",
          " /_/    \\_\\_| |_|\\__,_|\\__, | |_|  |_|\\___|_____/ \\___/ \\_/\\_/ \\__,_|_|_|",
          "                        __/ |                                            ",
          "                       |___/                                             ",
        ].join("\n");
        const asciiNarrow = [
          "  _    __  __ ",
          " /_\\  |  \\/  |",
          "/ _ \\ | |\\/| |",
          "/_/ \\_\\|_|  |_|",
          "Andy McDowall",
        ].join("\n");
        const ascii = isWide ? asciiWide : asciiNarrow;
        return `${ascii}\nLocation: ${personalInfo.location}\n\nWelcome to my interactive resume. Type '${cmdSpan("help")}' to see all available commands.\n`;
      }
      case "skills":
        return `\n<span class="text-white">=== Skills ===</span>\n\n${personalInfo.skills
          .map(formatters.skill)
          .join("\n")}\n`;
      case "experience":
        return `\n<span class="text-white">=== Work Experience ===</span>\n${personalInfo.jobs
          .map(formatters.experience)
          .join("\n")}\n`;
      case "projects":
        return `\n<span class="text-white">=== Projects ===</span>\n${personalInfo.projects
          .map(formatters.project)
          .join("")}`;
      case "education":
        return `\n<span class="text-white">=== Education ===</span>\n\n${formatters.education(
          personalInfo.education
        )}`;
      case "contact":
        return `\n<span class="text-white">=== Contact ===</span>\n\nGitHub:   <a href="${personalInfo.github}" target="_blank" rel="noopener noreferrer" class="text-blue-400 underline hover:text-blue-300">${personalInfo.github}</a>\nLinkedIn: <a href="${personalInfo.linkedin}" target="_blank" rel="noopener noreferrer" class="text-blue-400 underline hover:text-blue-300">${personalInfo.linkedin}</a>`;
      case "volunteer":
        return `\n<span class="text-white">=== Volunteer Experience ===</span>\n${personalInfo.volunteer
          .map(formatters.volunteer)
          .join("")}`;
      case "awards":
        return `\n<span class="text-white">=== Awards ===</span>\n${personalInfo.awards
          .map(formatters.award)
          .join("")}`;
      case "all":
        return [
          getCommandOutput("about"),
          getCommandOutput("skills"),
          getCommandOutput("experience"),
          getCommandOutput("projects"),
          getCommandOutput("education"),
          getCommandOutput("volunteer"),
          getCommandOutput("awards"),
          getCommandOutput("contact"),
        ].join("");
      case "clear":
        setHistory([]);
        return "";
      case "ui":
        onSwitchToUI?.();
        return "Switching to UI resume...";
      case "debug":
        sessionStorage.setItem('cli_debug', '1');
        setDebugMode(true);
        return `Debug mode enabled.\n<span class="text-gray-500">Use ${cmdSpan("help")} to see new commands. Congrats on leaving the Matrix!</span>`;
      case "resume": {
        if (!debugMode) break;
        if (args[0] === "--help") {
          return `usage:\n  resume list          list all available resumes\n  resume show &lt;n&gt;     jump directly to resume by index\n  resume --help        show this help`;
        }
        if (args[0] === "list") {
          if (resumeNames.length === 0) return "No resumes available.";
          const rows = resumeNames.map((name, i) => {
            const showCmd = `resume show ${i}`;
            return `  ${String(i).padEnd(3)} <span data-command="${showCmd}" class="text-cyan-300 cursor-pointer hover:underline">${name}</span>`;
          });
          return `\n<span class="text-white">=== Resume List ===</span>\n\n${rows.join("\n")}\n`;
        }
        if (args[0] === "show") {
          const n = parseInt(args[1], 10);
          if (!isNaN(n) && n >= 0 && n < resumeNames.length) {
            onShowResume?.(n);
            return `Loading resume ${n} (${resumeNames[n]})...`;
          }
          return `invalid index. Use ${cmdSpan("resume list")} to see available resumes.`;
        }
        return `usage:\n  resume list          list all available resumes\n  resume show &lt;n&gt;     jump directly to resume by index\n  resume --help        show this help`;
      }
      case "cursor": {
        const congrats = [
          "  ____                            _       ",
          " / ___|___  _ __   __ _ _ __ __ _| |_ ___ ",
          "| |   / _ \\| '_ \\ / _` | '__/ _` | __/ __|",
          "| |__| (_) | | | | (_| | | | (_| | |_\\__ \\",
          " \\____\\___/|_| |_|\\__, |_|  \\__,_|\\__|___/",
          "                  |___/                   ",
        ].join("\n");
        const cursorBanner = [
          "  ____                             _ ",
          " / ___|   _ _ __ ___  ___  _ __   | |",
          "| |  | | | | '__/ __|/ _ \\| '__|  | |",
          "| |__| |_| | |  \\__ \\ (_) | |     |_|",
          " \\____\\__,_|_|  |___/\\___/|_|     (_)",
        ].join("\n");
        const rocket = [
          "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⣀⣀⣠⠤⠴⠶⠶⠒⠒⠒⠒⠒⠲⣶",
          "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⢴⢾⣿⣟⣷⢤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿",
          "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⠴⠛⣍⣴⠼⣿⣻⠟⣿⣟⢭⡷⣤⡀⠀⠀⠀⠀⠀⠀⠀⡇",
          "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⠞⠋⣰⡴⢿⣿⣖⠛⠉⠉⠉⠛⢮⠛⢿⣷⣿⣦⠀⠀⠀⠀⠀⢰⠃",
          "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠞⠉⢀⣴⣞⠏⣡⣿⣮⣿⣷⣦⠀⠀⠀⠈⣇⠈⣿⡟⢿⣳⡄⠀⠀⠀⡼⠀",
          "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡴⠋⠁⢀⣾⠿⢿⣷⡋⣗⣴⣿⠿⠋⠻⣷⡅⠀⢰⠃⣰⡿⠁⠀⢷⡟⡆⠀⢀⡇⠀",
          "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡴⠋⠀⠀⠀⠉⠛⠷⣾⣍⠀⢿⡿⠃⠀⠀⠀⠘⣿⣶⣣⣴⠋⠀⠀⠀⠀⠹⡽⡆⡾⠀⠀",
          "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⣟⣷⣲⢦⣄⡀⠀⠀⠈⠙⢷⣌⠓⠦⠤⠤⠴⠚⢉⣲⠟⠁⠀⠀⠀⠀⠀⠀⢷⡿⠁⠀⠀",
          "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣤⠴⠒⠒⠒⢻⡟⠁⠀⠀⠉⠙⠺⣵⣫⡷⣄⠀⠀⠀⠙⢲⣤⠀⠀⢀⣶⠞⠁⠀⠀⠀⠀⠀⠀⠀⠀⣸⠃⠀⠀⠀",
          "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡴⠞⠉⠀⠀⠀⠀⠀⣰⣛⡲⠶⢤⣀⠀⠀⠀⢀⣭⣿⣽⢷⣄⠀⠀⠀⠈⢿⡼⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⢀⡼⠁⠀⠀⠀⠀",
          "⠀⠀⠀⠀⠀⠀⠀⠀⢀⡴⠋⠀⠀⠀⠀⠀⠀⢀⡾⢁⠟⣹⠛⠲⣄⣙⣶⣞⡽⠋⠀⠈⠻⣼⠳⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡞⠁⠀⠀⠀⠀⠀",
          "⠀⠀⠀⠀⠀⠀⢀⡴⠋⠀⠀⠀⠀⠀⠀⠀⣠⠏⣰⢋⡾⣱⢏⣴⡿⠋⣷⣟⠳⣄⠀⠀⠀⠈⠳⣜⢳⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠏⠀⠀⠀⠀⠀⠀⠀",
          "⠀⠀⠀⠀⠀⢠⠞⠁⠀⠀⢀⣠⠤⠴⠒⢲⠟⠒⠦⢬⣘⢁⡼⠋⢠⣞⡽⢉⡦⣌⠳⡄⠀⠀⠀⠘⢧⠝⢦⠀⠀⠀⠀⠀⠀⠀⢀⡼⠃⠀⠀⠀⠀⠀⠀⠀⠀",
          "⠀⠀⠀⢀⡴⠁⠀⠀⣠⠖⠉⠀⠀⠀⢠⣯⣤⣀⠀⢀⡼⠋⠀⡰⠋⢚⡴⢫⡞⢉⢢⡈⢦⡀⠀⠀⠀⢫⣭⢧⠀⠀⠀⠀⠀⣠⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
          "⠀⠀⣰⠟⠀⠀⢀⠾⠁⠀⠀⠀⠀⠀⡏⠀⠀⠈⣹⠏⣀⡴⠚⠙⢶⣈⠕⢉⡴⢁⡔⠙⢦⠱⣄⠀⠀⠀⣷⠞⢇⠀⠀⣠⠞⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
          "⠀⠀⠛⠛⠛⠒⠋⠀⠀⣀⣠⣤⠄⠒⠛⠒⢺⡟⣑⢾⡉⠳⣄⠀⠀⠙⢦⠉⠐⠋⡠⠊⡈⢧⡙⣆⣀⠼⢻⡏⣿⣀⡜⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
          "⠀⠀⠀⠀⠀⠀⠀⠀⢰⠋⠈⠉⣛⡢⢤⡰⢋⡴⠋⠀⠉⢣⡈⠳⣄⠀⠀⠱⡄⠈⡠⠞⣡⢖⣷⠞⠁⠀⢸⣷⡟⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
          "⠀⠀⠀⠀⠀⠀⠀⠀⠸⣤⠴⠚⠉⢠⡞⣱⠿⡅⠀⠀⠀⠀⠙⢆⠈⢳⡀⠀⠙⣄⠐⢚⡵⠛⠁⠀⠀⠀⣸⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
          "⠀⠀⠀⠀⠀⠀⢀⡴⠊⠁⠀⠀⢀⣠⡝⠁⠀⠈⠲⡀⠀⠀⠀⠈⢳⡀⠹⡄⠀⠸⡞⠋⠀⠀⠀⠀⠀⠀⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
          "⠀⠀⠀⠀⠀⣠⣞⣅⡀⠀⡠⠞⠉⠀⠀⠀⠀⠀⠀⠙⣦⠀⠀⠀⠀⣷⠀⠹⡄⠀⡇⠀⠀⠀⠀⠀⠀⢠⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
          "⠀⠀⠀⠀⡼⠟⣥⣤⠝⠛⠛⢻⠂⠀⠀⠀⠀⢱⠀⠀⠀⢳⡄⠀⢰⠋⠀⠀⣇⡤⡗⠀⠀⠀⠀⠀⠀⢸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
          "⠀⠀⠀⠀⣠⡴⠛⠁⠀⣀⡤⠟⠀⠀⠀⠀⢀⡿⠀⠀⠀⠀⣹⡀⡘⠉⠓⠋⠉⠀⡇⠀⠀⠀⠀⠀⢀⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
          "⠀⠀⢀⡾⠋⠀⠀⠀⠘⣿⠛⠀⠀⠀⠀⢠⡿⠁⠀⠀⠀⣰⠋⢧⡇⠀⠀⠀⠀⣠⠃⠀⠀⠀⠀⢠⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
          "⠀⢠⣾⢾⡇⠀⠀⠀⣸⠁⣀⠀⠾⣽⡶⠋⠀⠀⠀⢀⣴⡃⢀⣸⠃⠀⠀⢀⡴⠋⠀⠀⠀⢀⡴⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
          "⠀⠸⣳⠋⠀⠀⠀⠀⣷⢎⡁⢀⠀⢹⣄⡴⣦⢀⡤⠞⠁⠉⠉⠀⠀⣀⡴⠋⠀⠀⠀⣀⠴⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
          "⠀⢰⠇⠀⠀⠀⣀⣠⢴⡿⢁⡾⣇⡼⠿⠗⠛⠁⠀⠀⠀⠀⠀⠀⢾⠉⠀⠀⢀⣤⠞⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
          "⠀⡎⢀⡤⠒⠋⠻⠶⠯⠕⠊⠙⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡞⢀⣠⠖⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
          "⠀⣷⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠟⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
          "⠘⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
          "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
        ].join("\n");
        return `${congrats}\n${cursorBanner}\n\n${rocket}`;
      }
      case "everything":
        onEverything?.();
        return "Initiating everything, everywhere, all at once...\n⚠ Flash warning: contains flashing effects.";
      default:
        return `command not found: ${command}\nType '${cmdSpan("help")}' for a list of available commands.`;
    }
  };

  const executeCommand = (cmd: string) => {
    if (!cmd.trim()) return;
    const output = getCommandOutput(cmd);
    if (output) {
      setHistory((prev) => [...prev, { command: cmd, output }]);
    } else if (cmd.toLowerCase() === "clear") {
      setHistory([]);
    }
    if (!commandHistory.includes(cmd)) {
      setCommandHistory((prev) => [cmd, ...prev]);
    }
    setHistoryIndex(-1);
  };

  const handleCommand = () => {
    executeCommand(input);
    setInput("");
  };

  // --- KEYBOARD EVENT HANDLING ---
  const handleKeyDown = (e) => {
    // Up Arrow: Navigate to previous command
    if (e.key === "ArrowUp" && commandHistory.length > 0) {
      e.preventDefault();
      const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
      setHistoryIndex(newIndex);
      setInput(commandHistory[newIndex]);
    }
    // Down Arrow: Navigate to next command
    else if (e.key === "ArrowDown" && commandHistory.length > 0) {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    }
    // Tab: Autocomplete
    else if (e.key === "Tab") {
      e.preventDefault();
      const matchingCommand = commands.find((c) =>
        c.startsWith(input.toLowerCase())
      );
      if (matchingCommand) {
        setInput(matchingCommand);
      }
    }
  };

  // --- EFFECTS ---
  useEffect(scrollToBottom, [history]);

  // Welcome message on initial load
  useEffect(() => {
    setHistory([
      {
        command: "",
        output: getCommandOutput("about"),
      },
    ]);
  }, [personalInfo.name]);

  // Refresh welcome art when screen crosses the wide/narrow breakpoint,
  // but only if the user hasn't typed any commands yet.
  useEffect(() => {
    setHistory((prev) => {
      if (prev.length === 1 && prev[0].command === "") {
        return [{ command: "", output: getCommandOutput("about") }];
      }
      return prev;
    });
  }, [isWide]);

  return (
    <div
      className="bg-gray-900 text-green-400 font-mono p-4 rounded-lg shadow-xl h-[95vh] w-full max-w-5xl mx-auto overflow-y-auto"
      onClick={(e) => {
        const cmd = (e.target as HTMLElement).dataset.command;
        if (cmd) {
          executeCommand(cmd);
          scrollToBottom();
        } else {
          inputRef.current?.focus();
        }
      }}
    >
      <div className="flex flex-col">
        {history.map((entry, index) => (
          <div key={index} className="mb-2">
            {entry.command && (
              <div className="flex items-center">
                <span className="text-yellow-400 shrink-0">
                  guest@portfolio:~$
                </span>
                <span className="pl-2">{entry.command}</span>
              </div>
            )}
            <CommandOutput htmlContent={entry.output} />
          </div>
        ))}
      </div>

      <InputLine
        input={input}
        onInputChange={setInput}
        onCommand={handleCommand}
        onKeyDown={handleKeyDown}
        inputRef={inputRef}
      />

      <div ref={terminalEndRef} />
    </div>
  );
};
export default Terminal;