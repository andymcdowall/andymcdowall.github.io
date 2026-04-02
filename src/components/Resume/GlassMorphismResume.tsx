import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Github, Linkedin, MapPin, Briefcase, Award, Code, GraduationCap, ChevronsDown } from 'lucide-react';
import type { PersonalInfo, WorkExperience, Project, Skill } from '../types';

/**
 * Formats a date range for display.
 * @param startDate - The start date.
 * @param endDate - The end date.
 * @param current - Whether the position is current.
 * @returns A formatted string like "Jan 2021 - Present".
 */
const formatDateRange = (startDate: Date, endDate: Date, current: boolean) => {
  const start = startDate.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
  if (current) {
    return `${start} - Present`;
  }
  const end = endDate.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
  return `${start} - ${end}`;
};

//==============================================================================
// CORE UI COMPONENTS
//==============================================================================

const MorphingBackground = () => {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-gray-900">
            <motion.div
                initial={{ x: "-10%", y: "-10%", rotate: 0 }}
                animate={{ x: "30%", y: "10%", rotate: 40 }}
                transition={{ duration: 40, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                className="absolute top-0 left-0 h-[25rem] w-[25rem] rounded-full bg-gradient-to-br from-orange-500/80 to-amber-600/80"
            />
            <motion.div
                initial={{ x: "60%", y: "80%" }}
                animate={{ x: "40%", y: "20%", rotate: -30 }}
                transition={{ duration: 35, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                className="absolute bottom-0 right-0 h-[30rem] w-[30rem] rounded-full bg-gradient-to-tr from-red-500/80 to-orange-500/80"
            />
             <motion.div
                initial={{ x: "100%", y: "0%" }}
                animate={{ x: "-20%", y: "100%", rotate: 60 }}
                transition={{ duration: 50, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                className="absolute top-0 right-0 h-[20rem] w-[20rem] rounded-full bg-gradient-to-tr from-yellow-400/80 to-orange-400/80"
            />
        </div>
    );
};


/**
 * A reusable "glass" card component that provides the core visual style.
 * It includes an interactive glare and 3D tilt effect.
 */
const GlassCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-0.5, 0.5], ["12.5deg", "-12.5deg"]);
  const rotateY = useTransform(x, [-0.5, 0.5], ["-12.5deg", "12.5deg"]);

  const [glareStyle, setGlareStyle] = useState({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);

    setGlareStyle({
      background: `radial-gradient(circle at ${mouseX}px ${mouseY}px, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0) 50%)`,
    });
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setGlareStyle({});
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
      }}
      className={`relative rounded-3xl border-2 border-white/10 bg-white/5 backdrop-blur-3xl shadow-2xl shadow-black/40 ${className}`}
    >
      <div style={{ transform: "translateZ(25px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
      <div
        className="pointer-events-none absolute inset-0 transition-all duration-200"
        style={{...glareStyle, transform: "translateZ(25px)"}}
      />
    </motion.div>
  );
};


//==============================================================================
// RESUME-SPECIFIC COMPONENTS
//==============================================================================

const Header = ({ name, location, github, linkedin }: Pick<PersonalInfo, 'name' | 'location' | 'github' | 'linkedin'>) => {
  return (
    <section>
        <GlassCard className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">{name}</h1>
                    <div className="mt-2 flex items-center gap-2 text-orange-200/80">
                        <MapPin size={16} />
                        <span>{location}</span>
                    </div>
                </div>
                <div className="flex gap-4 mt-4 md:mt-0">
                     <a href={github} target="_blank" rel="noopener noreferrer" className="text-orange-200/80 hover:text-white transition-colors"><Github size={24} /></a>
                     <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-orange-200/80 hover:text-white transition-colors"><Linkedin size={24} /></a>
                </div>
            </div>
        </GlassCard>
    </section>
  );
};

const Section = ({ title, icon, children, id }: { title: string; icon: React.ReactNode; children: React.ReactNode; id: string }) => {
  return (
    <section className="mt-12" id={id}>
        <div className="flex items-center gap-3 mb-6">
            <div className="text-orange-300/80 drop-shadow-lg">{icon}</div>
            <h2 className="text-3xl font-bold text-white tracking-wide">{title}</h2>
        </div>
        {children}
    </section>
  );
};

const ExperienceCard = ({ job }: { job: WorkExperience }) => {
  return (
     <GlassCard className="p-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
            <h3 className="text-xl font-semibold text-white">{job.position}</h3>
            <span className="text-sm text-orange-200/80 mt-1 sm:mt-0">{formatDateRange(job.startDate, job.endDate, job.current)}</span>
        </div>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center text-orange-100/90 mb-4">
            <p>{job.company}</p>
            <p className="text-sm">{job.location}</p>
        </div>
        <ul className="list-disc list-inside text-gray-300/90 space-y-2 mb-4">
            {job.descriptionBulletPoints.map((point, index) => (
                <li key={index}>{point}</li>
            ))}
        </ul>
        <div className="flex flex-wrap gap-2">
            {job.technologies.map((tech) => (
                <span key={tech} className="bg-white/10 border border-white/20 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                    {tech}
                </span>
            ))}
        </div>
    </GlassCard>
  );
};

const ProjectCard = ({ project }: { project: Project }) => (
    <GlassCard className="p-6">
        <a href={project.link} target="_blank" rel="noopener noreferrer" className="block">
            <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
            <p className="text-gray-300/90 mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                     <span key={tech} className="bg-white/10 border border-white/20 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                        {tech}
                    </span>
                ))}
            </div>
        </a>
    </GlassCard>
);


const Skills = ({ skills }: { skills: Skill[] }) => {
  return (
    <Section title="Skills" icon={<Code size={28} />} id="skills">
        <GlassCard className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {skills.map(skill => (
                    <div key={skill.name}>
                        <p className="text-white mb-2">{skill.name}</p>
                        <div className="w-full bg-white/10 rounded-full h-3">
                            <div
                                className="bg-gradient-to-r from-orange-400 to-amber-300 h-3 rounded-full shadow-[0_0_10px_theme(colors.orange.400),0_0_4px_theme(colors.amber.500)]"
                                style={{ width: `${skill.level * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </GlassCard>
    </Section>
  );
};

const Education = ({ education }: { education: PersonalInfo['education'] }) => {
    return (
        <Section title="Education" icon={<GraduationCap size={28} />} id="education">
            <GlassCard className="p-6">
                <h3 className="text-xl font-semibold text-white">{education.university}</h3>
                <p className="text-orange-100/90">{education.degree} in {education.major}</p>
                {education.minor && <p className="text-orange-100/90 text-sm">Minor in {education.minor}</p>}
                <p className="text-orange-200/80 text-sm mt-2">{education.graduationDate.getFullYear()} | GPA: {education.gpa.toFixed(2)}</p>
            </GlassCard>
        </Section>
    )
};

const Awards = ({ awards }: { awards: Award[] }) => (
    <Section title="Awards" icon={<Award size={28} />} id="awards">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {awards.map((award, index) => (
                <GlassCard key={index} className="p-6">
                    <h3 className="text-xl font-semibold text-white">{award.title}</h3>
                    <p className="text-orange-100/90">{award.organization}</p>
                    <p className="text-orange-200/80 text-sm mt-1">{award.date.toString()}</p>
                    <p className="text-gray-300/90 mt-2">{award.description}</p>
                </GlassCard>
            ))}
        </div>
    </Section>
);

const FloatingDock = () => {
    const dockItems = [
        { id: 'experience', icon: <Briefcase /> },
        { id: 'projects', icon: <Code /> },
        { id: 'skills', icon: <ChevronsDown /> },
        { id: 'education', icon: <GraduationCap /> },
        { id: 'awards', icon: <Award /> },
    ];
    
    const scrollTo = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <GlassCard className="p-2">
                <div className="flex items-center gap-2">
                    {dockItems.map(item => (
                        <motion.button 
                            key={item.id}
                            whileHover={{ y: -10, scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => scrollTo(item.id)}
                            className="text-white/70 hover:text-white p-3 rounded-xl transition-all"
                        >
                            {item.icon}
                        </motion.button>
                    ))}
                </div>
            </GlassCard>
        </div>
    );
};


//==============================================================================
// TOP-LEVEL COMPONENT
//==============================================================================

/**
 * The main component for the Liquid Glass themed resume.
 * @param {object} props - The component props.
 * @param {PersonalInfo} [props.personalInfo=dummyInfo] - The personal information to display.
 */
const GlassMorphismResume = ({ personalInfo }: { personalInfo: PersonalInfo }) => {
  return (
    <div className="min-h-screen font-sans text-gray-200 [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
        <MorphingBackground />
        <div className="relative max-w-4xl mx-auto p-4 md:p-8 pb-32">
            <Header 
                name={personalInfo.name} 
                location={personalInfo.location}
                github={personalInfo.github}
                linkedin={personalInfo.linkedin}
            />
            
            <Section title="Work Experience" icon={<Briefcase size={28} />} id="experience">
                {personalInfo.jobs.map((job, index) => (
                    <ExperienceCard key={index} job={job} />
                ))}
            </Section>
            
            <Section title="Projects" icon={<Code size={28} />} id="projects">
                <div className="grid md:grid-cols-2 gap-8">
                    {personalInfo.projects.map((project, index) => (
                        <ProjectCard key={index} project={project} />
                    ))}
                </div>
            </Section>

            {personalInfo.awards && personalInfo.awards.length > 0 && (
                <Awards awards={personalInfo.awards} />
            )}
            
            <Skills skills={personalInfo.skills} />

            <Education education={personalInfo.education} />

            <FloatingDock />
        </div>
    </div>
  );
};

export default GlassMorphismResume;
