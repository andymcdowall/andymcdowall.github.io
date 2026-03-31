import React from 'react';

// Header Component
const Header: React.FC<{ personalInfo: any }> = ({ personalInfo }) => {
  const formatVintagePhone = () => {
    return "MAyfair 4-7829";
  };

  return (
    <header className="header">
      <h1 className="name">{personalInfo.name}</h1>
      <div className="address">
        <div>{personalInfo.location}</div>
        <div>{`Telephone: ${formatVintagePhone()}`}</div>
      </div>
      <div className="date">March 15, 1947</div>
    </header>
  );
};

// Section Component
const Section: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  return (
    <section className="section">
      <h2 className="section-title">{title}</h2>
      <div className="section-content">{children}</div>
    </section>
  );
};

// Experience Item Component
const ExperienceItem: React.FC<{ job: any }> = ({ job }) => {
  const formatDateRange = (startDate: Date, endDate: Date, current: boolean) => {
    const start = startDate.getFullYear();
    const end = current ? "Present" : endDate.getFullYear();
    return `${start}-${end}`;
  };

  return (
    <div className="experience-item">
      <div className="job-line">
        {`${job.position} - ${job.company} (${formatDateRange(job.startDate, job.endDate, job.current)})`}
      </div>
      <div className="job-description">
        {job.descriptionBulletPoints.map((desc: string, index: number) => (
          <div key={index} className="description-line">{`    ${desc}`}</div>
        ))}
      </div>
    </div>
  );
};

// Projects Section Component
const ProjectsSection: React.FC<{ projects: any[] }> = ({ projects }) => {
  return (
    <div className="projects">
      {projects.slice(0, 3).map((project, index) => (
        <div key={index} className="project-item">
          <div className="project-title">{project.title}</div>
          <div className="project-description">{`    ${project.description}`}</div>
          {project.technologies.length > 0 && (
            <div className="project-tech">
              {`    Technologies: ${project.technologies.slice(0, 3).join(", ")}`}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Skills Component
const SkillsSection: React.FC<{ skills: any[] }> = ({ skills }) => {
  const topSkills = skills
    .sort((a, b) => b.level - a.level)
    .slice(0, 8)
    .map(skill => skill.name);

  return (
    <div className="skills">
      {`Proficient in: ${topSkills.join(", ")}`}
    </div>
  );
};

// Main Resume Component
const TypewriterResume: React.FC<{ personalInfo: any }> = ({ personalInfo }) => {
  return (
    <div className="container">
      <div className="paper">
        <div className="ink-stains">
          <div className="ink-spot spot-1"></div>
          <div className="ink-spot spot-2"></div>
          <div className="ink-spot spot-3"></div>
          <div className="ink-spot spot-4"></div>
        </div>

        <Header personalInfo={personalInfo} />

        <Section title="OBJECTIVE">
          <div className="objective">
            {`To secure a position as Senior ${personalInfo.jobs[0]?.position || "Engineer"} where I may utilize my extensive experience in technology and innovation to contribute to industrial growth.`}
          </div>
        </Section>

        <Section title="EXPERIENCE">
          {personalInfo.jobs.slice(0, 3).map((job: any, index: number) => (
            <ExperienceItem key={index} job={job} />
          ))}
        </Section>

        <Section title="EDUCATION">
          <div className="education">
            {`${personalInfo.education.degree} ${personalInfo.education.major} - ${personalInfo.education.university}, ${personalInfo.education.graduationDate.getFullYear()}`}
            {personalInfo.education.gpa && (
              <div style={{ marginTop: '0.5rem' }}>
                {`    Grade Point Average: ${personalInfo.education.gpa.toFixed(2)}`}
              </div>
            )}
          </div>
        </Section>

        {personalInfo.projects.length > 0 && (
          <Section title="NOTABLE PROJECTS">
            <ProjectsSection projects={personalInfo.projects} />
          </Section>
        )}

        {personalInfo.skills.length > 0 && (
          <Section title="TECHNICAL PROFICIENCIES">
            <SkillsSection skills={personalInfo.skills} />
          </Section>
        )}

        {personalInfo.awards.length > 0 && (
          <Section title="HONORS & RECOGNITION">
            <div className="awards">
              {personalInfo.awards.slice(0, 3).map((award: any, index: number) => (
                <div key={index} className="award-item">
                  {`${award.title} - ${award.organization}, ${typeof award.date === 'string' ? award.date : award.date.getFullYear()}`}
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>

      <style jsx>{`
        .container {
          min-height: 100vh;
          background: #e8dcc6;
          padding: 2rem;
          font-family: 'Courier New', Courier, monospace;
        }

        .paper {
          max-width: 800px;
          margin: 0 auto;
          background: #f8f6f0;
          padding: 3rem 2.5rem;
          position: relative;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          border: 1px solid #d4c4a8;
        }

        .paper::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image:
            repeating-linear-gradient(
              transparent,
              transparent 24px,
              #e0d4c0 24px,
              #e0d4c0 25px
            );
          pointer-events: none;
          opacity: 0.4;
        }

        .paper::after {
          content: '';
          position: absolute;
          top: 0;
          left: 60px;
          bottom: 0;
          width: 2px;
          background: #dc143c;
          opacity: 0.6;
        }

        .ink-stains {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }

        .ink-spot {
          position: absolute;
          background: #1e3a8a;
          border-radius: 50%;
          opacity: 0.2;
        }

        .spot-1 {
          width: 6px;
          height: 8px;
          top: 20%;
          right: 25%;
          border-radius: 60% 40% 30% 70%;
        }

        .spot-2 {
          width: 3px;
          height: 4px;
          top: 50%;
          left: 15%;
        }

        .spot-3 {
          width: 8px;
          height: 5px;
          bottom: 30%;
          right: 30%;
          border-radius: 70% 30% 60% 40%;
        }

        .spot-4 {
          width: 4px;
          height: 6px;
          top: 70%;
          left: 45%;
          border-radius: 40% 60% 50% 50%;
        }

        .header {
          text-align: center;
          margin-bottom: 2rem;
          position: relative;
          z-index: 1;
        }

        .name {
          font-size: 24px;
          font-weight: bold;
          color: #000;
          margin-bottom: 1rem;
          letter-spacing: 2px;
        }

        .address {
          margin-bottom: 1rem;
          font-size: 14px;
          color: #000;
          line-height: 1.5;
        }

        .date {
          text-align: right;
          font-size: 14px;
          color: #000;
          margin-top: 1rem;
        }

        .section {
          margin-bottom: 1.5rem;
          position: relative;
          z-index: 1;
        }

        .section-title {
          font-size: 16px;
          font-weight: bold;
          color: #000;
          margin-bottom: 0.5rem;
          text-decoration: underline;
          letter-spacing: 1px;
        }

        .section-content {
          font-size: 14px;
          color: #000;
          line-height: 1.4;
        }

        .objective {
          text-align: justify;
          margin-left: 1rem;
        }

        .experience-item {
          margin-bottom: 1rem;
        }

        .job-line {
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .job-description {
          margin-left: 0;
        }

        .description-line {
          margin-bottom: 0.3rem;
        }

        .education {
          margin-left: 1rem;
        }

        .projects {
          margin-left: 1rem;
        }

        .project-item {
          margin-bottom: 1rem;
        }

        .project-title {
          font-weight: bold;
          margin-bottom: 0.3rem;
        }

        .project-description {
          margin-bottom: 0.3rem;
        }

        .project-tech {
          margin-bottom: 0.5rem;
          font-style: italic;
        }

        .skills {
          margin-left: 1rem;
        }

        .awards {
          margin-left: 1rem;
        }

        .award-item {
          margin-bottom: 0.5rem;
        }

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }

          .paper {
            padding: 2rem 1.5rem;
          }

          .name {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
};
export default TypewriterResume;
