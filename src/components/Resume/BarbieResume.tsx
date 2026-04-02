import React, { useState, useEffect } from 'react';
import { Star, MapPin, Github, Linkedin, Calendar, Award, Briefcase, Heart, Sparkles } from 'lucide-react';
import type { PersonalInfo, Skill } from '../types';


interface BarbieResumeProps {
  personalInfo: PersonalInfo;
}

const BarbieResume: React.FC<BarbieResumeProps> = ({ personalInfo }) => {
  const [activeSection, setActiveSection] = useState('about');
  const [sparkles, setSparkles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);

  // Provide default values if personalInfo is undefined or incomplete
  const defaultPersonalInfo: PersonalInfo = {
    name: 'Your Name',
    location: '',
    github: '',
    linkedin: '',
    jobs: [],
    volunteer: [],
    awards: [],
    projects: [],
    skills: [],
    education: {
      degree: 'Bachelor of Science in',
      degreeShort: 'B.S.',
      major: 'Computer Science',
      minor: '',
      certificate: '',
      university: 'University',
      universityShort: 'U',
      graduationDate: new Date(),
      location: '',
      gpa: 0
    }
  };

  const safePersonalInfo = personalInfo ? {
    ...defaultPersonalInfo,
    ...personalInfo,
    education: personalInfo.education ? {
      ...defaultPersonalInfo.education,
      ...personalInfo.education
    } : defaultPersonalInfo.education
  } : defaultPersonalInfo;

  useEffect(() => {
    // Generate sparkles for background animation
    const newSparkles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }));
    setSparkles(newSparkles);
  }, []);

  const formatDate = (date: Date | string) => {
    if (typeof date === 'string') return date;
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const SkillBar = ({ skill }: { skill: Skill }) => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-pink-800 font-semibold text-sm">{skill.name}</span>
        <span className="text-pink-600 text-xs">{Math.round(skill.level * 100)}%</span>
      </div>
      <div className="w-full bg-pink-100 rounded-full h-3 overflow-hidden shadow-inner">
        <div 
          className="h-full bg-gradient-to-r from-pink-400 to-pink-600 rounded-full transition-all duration-1000 ease-out shadow-sm animate-pulse"
          style={{ width: `${skill.level * 100}%` }}
        />
      </div>
    </div>
  );

  const SectionCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-4 border-pink-200 hover:border-pink-300 transition-all duration-300 hover:shadow-pink-200/50 ${className}`}>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-pink-300 to-pink-400 relative overflow-hidden">
      {/* Animated background sparkles */}
      {sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          className="absolute animate-ping"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            animationDelay: `${sparkle.delay}s`,
            animationDuration: '3s'
          }}
        >
          <Sparkles className="text-white/30 w-4 h-4" />
        </div>
      ))}

      {/* Floating hearts decoration */}
      <div className="absolute top-20 left-10 animate-bounce" style={{ animationDelay: '0.5s' }}>
        <Heart className="text-pink-500/40 w-8 h-8 fill-current" />
      </div>
      <div className="absolute top-40 right-20 animate-bounce" style={{ animationDelay: '1.5s' }}>
        <Heart className="text-pink-400/40 w-6 h-6 fill-current" />
      </div>
      <div className="absolute bottom-32 left-1/4 animate-bounce" style={{ animationDelay: '2.5s' }}>
        <Heart className="text-pink-600/40 w-5 h-5 fill-current" />
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="relative inline-block">
            <h1 className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-pink-800 mb-4 drop-shadow-lg animate-pulse">
              {safePersonalInfo.name}
            </h1>
            <div className="absolute -top-2 -right-2">
              <Star className="text-yellow-400 w-8 h-8 fill-current animate-spin" style={{ animationDuration: '3s' }} />
            </div>
          </div>
          
          <div className="flex justify-center items-center gap-8 mt-8 flex-wrap">
            {safePersonalInfo.location && (
              <div className="flex items-center gap-2 bg-white/70 rounded-full px-6 py-3 shadow-lg backdrop-blur-sm border-2 border-pink-200">
                <MapPin className="text-pink-600 w-5 h-5" />
                <span className="text-pink-800 font-semibold">{safePersonalInfo.location}</span>
              </div>
            )}
            
            {safePersonalInfo.github && (
              <a href={safePersonalInfo.github} target="_blank" rel="noopener noreferrer" 
                 className="flex items-center gap-2 bg-white/70 rounded-full px-6 py-3 shadow-lg backdrop-blur-sm border-2 border-pink-200 hover:border-pink-400 transition-all duration-300 hover:scale-105">
                <Github className="text-pink-600 w-5 h-5" />
                <span className="text-pink-800 font-semibold">GitHub</span>
              </a>
            )}
            
            {safePersonalInfo.linkedin && (
              <a href={safePersonalInfo.linkedin} target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-2 bg-white/70 rounded-full px-6 py-3 shadow-lg backdrop-blur-sm border-2 border-pink-200 hover:border-pink-400 transition-all duration-300 hover:scale-105">
                <Linkedin className="text-pink-600 w-5 h-5" />
                <span className="text-pink-800 font-semibold">LinkedIn</span>
              </a>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/60 backdrop-blur-sm rounded-full p-2 shadow-2xl border-4 border-pink-200">
            {['about', 'experience', 'projects', 'skills'].map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 mx-1 ${
                  activeSection === section
                    ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg scale-105'
                    : 'text-pink-700 hover:bg-pink-100 hover:scale-105'
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div className="max-w-6xl mx-auto">
          {/* About Section */}
          {activeSection === 'about' && (
            <div className="grid md:grid-cols-2 gap-8">
              <SectionCard>
                <div className="flex items-center gap-3 mb-6">
                  <Award className="text-pink-600 w-8 h-8" />
                  <h2 className="text-3xl font-bold text-pink-800">Education</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-pink-700">{safePersonalInfo.education.degree} {safePersonalInfo.education.major}</h3>
                    {safePersonalInfo.education.minor && (
                      <p className="text-pink-600">Minor: {safePersonalInfo.education.minor}</p>
                    )}
                    {safePersonalInfo.education.certificate && (
                      <p className="text-pink-600">Certificate: {safePersonalInfo.education.certificate}</p>
                    )}
                    <p className="text-pink-800 font-semibold">{safePersonalInfo.education.university}</p>
                    <p className="text-pink-600">{safePersonalInfo.education.location}</p>
                    <p className="text-pink-600">Graduated: {formatDate(safePersonalInfo.education.graduationDate)}</p>
                    {safePersonalInfo.education.gpa > 0 && (
                      <p className="text-pink-600">GPA: {safePersonalInfo.education.gpa}</p>
                    )}
                  </div>
                </div>
              </SectionCard>

              <SectionCard>
                <div className="flex items-center gap-3 mb-6">
                  <Star className="text-pink-600 w-8 h-8 fill-current" />
                  <h2 className="text-3xl font-bold text-pink-800">Awards</h2>
                </div>
                <div className="space-y-4">
                  {safePersonalInfo.awards.map((award, index) => (
                    <div key={index} className="border-l-4 border-pink-300 pl-4 py-2">
                      <h3 className="text-lg font-bold text-pink-700">{award.title}</h3>
                      <p className="text-pink-600">{award.organization}</p>
                      <p className="text-pink-500 text-sm">{formatDate(award.date)} • {award.location}</p>
                      {award.description && (
                        <p className="text-pink-700 mt-2">{award.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>
          )}

          {/* Experience Section */}
          {activeSection === 'experience' && (
            <div className="space-y-8">
              <SectionCard>
                <div className="flex items-center gap-3 mb-6">
                  <Briefcase className="text-pink-600 w-8 h-8" />
                  <h2 className="text-3xl font-bold text-pink-800">Work Experience</h2>
                </div>
                <div className="space-y-6">
                  {safePersonalInfo.jobs.map((job, index) => (
                    <div key={index} className="border-l-4 border-pink-300 pl-6 py-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-pink-700">{job.position}</h3>
                          <p className="text-pink-600 font-semibold">{job.company} • {job.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-pink-500 text-sm flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(job.startDate)} - {job.current ? 'Present' : formatDate(job.endDate)}
                          </p>
                        </div>
                      </div>
                      
                      {job.descriptionBulletPoints.length > 0 && (
                        <div className="mb-4">
                          {job.descriptionBulletPoints.map((point, pointIndex) => (
                            <p key={pointIndex} className="text-pink-700 mb-2">{point}</p>
                          ))}
                        </div>
                      )}
                      
                      {job.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {job.technologies.map((tech, techIndex) => (
                            <span key={techIndex} className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-semibold border border-pink-200">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </SectionCard>

              {safePersonalInfo.volunteer.length > 0 && (
                <SectionCard>
                  <div className="flex items-center gap-3 mb-6">
                    <Heart className="text-pink-600 w-8 h-8 fill-current" />
                    <h2 className="text-3xl font-bold text-pink-800">Volunteer Experience</h2>
                  </div>
                  <div className="space-y-6">
                    {safePersonalInfo.volunteer.map((vol, index) => (
                      <div key={index} className="border-l-4 border-pink-300 pl-6 py-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-pink-700">{vol.position}</h3>
                            <p className="text-pink-600 font-semibold">
                              {vol.organization}
                              {vol.suborganization && ` • ${vol.suborganization}`}
                            </p>
                            <p className="text-pink-600">{vol.location}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-pink-500 text-sm flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(vol.startDate)} - {vol.current ? 'Present' : formatDate(vol.endDate)}
                            </p>
                          </div>
                        </div>
                        
                        {vol.descriptionBulletPoints.length > 0 && (
                          <div>
                            {vol.descriptionBulletPoints.map((point, pointIndex) => (
                              <p key={pointIndex} className="text-pink-700 mb-2">{point}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}
            </div>
          )}

          {/* Projects Section */}
          {activeSection === 'projects' && (
            <div>
              <SectionCard>
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="text-pink-600 w-8 h-8" />
                  <h2 className="text-3xl font-bold text-pink-800">Projects</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {safePersonalInfo.projects.map((project, index) => (
                    <div key={index} className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-6 border-2 border-pink-200 hover:border-pink-400 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                      {project.image && (
                        <img src={project.image} alt={project.title} className="w-full h-40 object-cover rounded-xl mb-4" />
                      )}
                      <h3 className="text-xl font-bold text-pink-700 mb-2">{project.title}</h3>
                      <p className="text-pink-600 mb-4">{project.description}</p>
                      
                      {project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies.map((tech, techIndex) => (
                            <span key={techIndex} className="bg-pink-200 text-pink-800 px-2 py-1 rounded-full text-xs font-semibold">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" 
                           className="inline-block bg-gradient-to-r from-pink-500 to-pink-600 text-white px-4 py-2 rounded-full font-semibold hover:scale-105 transition-transform duration-200">
                          View Project
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>
          )}

          {/* Skills Section */}
          {activeSection === 'skills' && (
            <div>
              <SectionCard>
                <div className="flex items-center gap-3 mb-6">
                  <Star className="text-pink-600 w-8 h-8 fill-current" />
                  <h2 className="text-3xl font-bold text-pink-800">Skills</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  {safePersonalInfo.skills.map((skill, index) => (
                    <SkillBar key={index} skill={skill} />
                  ))}
                </div>
              </SectionCard>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default BarbieResume;