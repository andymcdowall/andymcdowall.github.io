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

const Terminal = ({ personalInfo, onEverything } : {personalInfo: PersonalInfo, onEverything?: () => void}) => {
  // --- STATE MANAGEMENT ---
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // --- REFS for DOM manipulation ---
  const inputRef = useRef(null);
  const terminalEndRef = useRef(null);

  // --- CONSTANTS ---
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
    "everything",
  ];

  // --- UTILITY & FORMATTING ---
  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Formatters for different resume sections to keep command logic clean
  const formatters = {
    date: (date) =>
      new Date(date).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
    experience: (exp) =>
      `\n&gt; ${exp.position} @ ${exp.company} (${
        exp.location
      })\n  ${formatters.date(exp.startDate)} - ${
        exp.current ? "Present" : formatters.date(exp.endDate)
      }\n` +
      exp.descriptionBulletPoints.map((p) => `  - ${p}`).join("\n") +
      `\n  [Technologies: ${exp.technologies.join(", ")}]`,
    project: (proj) =>
      `\n&gt; ${proj.title}\n  ${proj.description}\n` +
      `  [Technologies: ${proj.technologies.join(", ")}]\n` +
      `  Link: <a href="${proj.link}" target="_blank" rel="noopener noreferrer" class="text-blue-400 underline hover:text-blue-300">${proj.link}</a>`,
    education: (edu) =>
      `&gt; ${edu.degree} in ${edu.major}\n` +
      `  ${edu.university} (${edu.location})\n` +
      `  Graduated: ${formatters.date(edu.graduationDate)}\n` +
      (edu.minor ? `  Minor: ${edu.minor}\n` : "") +
      (edu.certificate ? `  Certificate: ${edu.certificate}\n` : "") +
      `  GPA: ${edu.gpa.toFixed(2)}`,
    skill: (skill) => {
      const bar =
        "█".repeat(Math.round(skill.level * 10)) +
        "░".repeat(10 - Math.round(skill.level * 10));
      return `${skill.name.padEnd(20, " ")} [${bar}]`;
    },
    volunteer: (vol) =>
      `\n&gt; ${vol.position} @ ${vol.organization} ${
        vol.suborganization ? `(${vol.suborganization})` : ""
      }\n` +
      `  ${formatters.date(vol.startDate)} - ${
        vol.current ? "Present" : formatters.date(vol.endDate)
      }\n` +
      vol.descriptionBulletPoints.map((p) => `  - ${p}`).join("\n"),
    award: (award) => {
      const dateStr =
        award.date instanceof Date ? formatters.date(award.date) : award.date;
      return `\n&gt; ${award.title} - ${award.organization} (${dateStr})\n  ${award.description}`;
    },
  };

  // --- COMMAND HANDLING ---
  const getCommandOutput = (command) => {
    const [cmd, ...args] = command.toLowerCase().split(" ");
    switch (cmd) {
      case "help":
        return `Available commands:\n\n${commands.slice(0, -1).join("\n")}\neverything         # flash warning`;
      case "about":
        return `${personalInfo.name}\nLocation: ${personalInfo.location}\n\nWelcome to my interactive resume. Type 'help' to see all available commands.`;
      case "skills":
        return `--- Skills ---\n\n${personalInfo.skills
          .map(formatters.skill)
          .join("\n")}`;
      case "experience":
        return `--- Work Experience ---\n${personalInfo.jobs
          .map(formatters.experience)
          .join("\n")}`;
      case "projects":
        return `--- Projects ---\n${personalInfo.projects
          .map(formatters.project)
          .join("\n")}`;
      case "education":
        return `--- Education ---\n\n${formatters.education(
          personalInfo.education
        )}`;
      case "contact":
        return `--- Contact ---\n\nGitHub:   <a href="${personalInfo.github}" target="_blank" rel="noopener noreferrer" class="text-blue-400 underline hover:text-blue-300">${personalInfo.github}</a>\nLinkedIn: <a href="${personalInfo.linkedin}" target="_blank" rel="noopener noreferrer" class="text-blue-400 underline hover:text-blue-300">${personalInfo.linkedin}</a>`;
      case "volunteer":
        return `--- Volunteer Experience ---\n${personalInfo.volunteer
          .map(formatters.volunteer)
          .join("\n")}`;
      case "awards":
        return `--- Awards ---\n${personalInfo.awards
          .map(formatters.award)
          .join("\n")}`;
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
        ].join("\n\n" + "-".repeat(40) + "\n\n");
      case "clear":
        setHistory([]);
        return "";
      case "everything":
        onEverything?.();
        return "Initiating everything, everywhere, all at once...\n⚠ Flash warning: contains flashing effects.";
      default:
        return `command not found: ${command}\nType 'help' for a list of available commands.`;
    }
  };

  const handleCommand = () => {
    if (!input.trim()) return;

    const output = getCommandOutput(input);
    const newHistory = [...history, { command: input, output }];
    if (output) {
      // Only add to history if there is an output
      setHistory(newHistory);
    } else if (input.toLowerCase() === "clear") {
      setHistory([]); // Handle clear command
    }

    // Add unique commands to command history for arrow navigation
    if (!commandHistory.includes(input)) {
      setCommandHistory([input, ...commandHistory]);
    }
    setHistoryIndex(-1); // Reset history navigation
    setInput(""); // Clear input
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
        output: `Welcome to the interactive terminal resume of ${personalInfo.name}.\n\nType 'help' to get started.\n`,
      },
    ]);
  }, [personalInfo.name]);

  return (
    <div
      className="bg-gray-900 text-green-400 font-mono p-4 rounded-lg shadow-xl h-[95vh] w-full max-w-5xl mx-auto overflow-y-auto"
      onClick={() => inputRef.current?.focus()}
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