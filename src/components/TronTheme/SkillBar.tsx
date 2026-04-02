import type { Skill } from "../../types";

const SkillBar: React.FC<{ skill: Skill }> = ({ skill }) => {
  return (
	<div className="mb-4 group">
	  <div className="flex justify-between items-center mb-2">
		<span className="text-cyan-300 font-mono text-sm group-hover:text-cyan-200 transition-colors duration-300">{skill.name}</span>
		<span className="text-cyan-400 font-mono text-xs group-hover:text-cyan-300 transition-colors duration-300">{Math.round(skill.level * 100)}%</span>
	  </div>
	  <div className="w-full bg-gray-900 rounded-full h-2 border border-cyan-900 group-hover:border-cyan-700 transition-all duration-300 hover:h-3 cursor-pointer">
		<div
		  className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full shadow-lg shadow-cyan-400/50 group-hover:from-cyan-300 group-hover:to-blue-300 group-hover:shadow-cyan-300/70 hover:animate-pulse"
		  style={{
			width: `${skill.level * 100}%`,
			boxShadow: '0 0 10px rgba(0, 255, 255, 0.5)'
		  }}
		/>
	  </div>
	</div>
  );
};
export default SkillBar;