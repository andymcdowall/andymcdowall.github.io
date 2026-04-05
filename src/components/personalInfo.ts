import type { PersonalInfo } from "../types";

export const andyPersonalInfo: PersonalInfo = {
  name: "Andy McDowall",
  about: "A passionate software developer with a knack for creating innovative solutions and a love for all things tech. I thrive on challenges and enjoy pushing the boundaries of what's possible in software development.",
  location: "Dallas-Fort Worth, TX",
  github: "https://github.com/andym1125",
  linkedin: "https://www.linkedin.com/in/michaelmcdowall/",
  jobs: [
    {
      company: "Paycom",
      position: "Software Developer",
      startDate: new Date("2024-07-01"),
      endDate: new Date("2025-07-01"),
      current: false,
      location: "Irving, TX",
      descriptionBulletPoints: [
        "Developed full-stack customized HCM solutions, collaborating with cross-functional teams to deliver client-spcific reports and integrate with third party systems.",
        "Managed multiple conceurrent development projects while maintaining clear communication with clients, vendors, and internal stakeholders to ensure the spirit, as well as the letter, of the requirements were met.",
        "Led development of integrations connecting client systems with third-party vendors, ensuring data accuracy and maintaining clear documentation throughout project lifecycle.",
      ],
      technologies: ["C#", ".NET", "PHP", "MySQL", "React", "RabbitMQ"],
    },
    {
      company: "UNT CSCE Department",
      position: "CSCE Peer Mentor",
      startDate: new Date("2023-09-01"),
      endDate: new Date("2023-08-01"),
      current: false,
      location: "Denton, TX",
      descriptionBulletPoints: [
        "Tailored personalized tutoring plans for each student, adapting teaching styles to match their unique learning preferences and pace.",
        "Supplemented communication and explanation using effective verbal skills, diagrams, analogies, and examples.",
      ],
      technologies: ["Data structures and algorithms", "Interpersonal communication"],
    },
    {
      company: "Triumph Financial (now Triumph)",
      position: "Software Engineer Intern",
      startDate: new Date("2023-07-01"),
      endDate: new Date("2023-09-01"),
      current: false,
      location: "Dallas, TX",
      descriptionBulletPoints: [
        "Engineered enhancements for an event sourced CQRS invoice decisioning system.",
        "Achieved over 10% increase in code coverage across two repositories, mitigating technical debt and ensuring more robust code quality, and presented on benefit to company to C-suite.",
        `Presented comprehensive research findings on viable Document Management System solutions to management, outlining
technological methodologies and highlighting their tangible business applications, and drafted a Request for Proposal to distribute to
three selected vendors.`,
        
      ],
      technologies: ["C#", ".NET", "Kafka", "CQRS"],
    },
    {
      company: "Sonr Inc",
      position: "Software Engineer",
      startDate: new Date("2022-07-10"),
      endDate: new Date("2022-11-30"),
      current: false,
      location: "Brooklyn, NY",
      descriptionBulletPoints: [
        "Led Go-based internal blockchain search tool development, which utilized gRPC and REST to enhance team efficiency.",
        "Maintained Cosmos-integrated applications, ensuring seamless functionality.",
      ],
      technologies: ["Golang", "Cosmos", "gRPC", "Protobuf"],
    },
  ],
  volunteer: [
    {
      organization: "Texas Academy of Mathematics and Science Advisory Board",
      suborganization: "Univ. of North Texas",
      position: "Member",
      startDate: new Date("2024-05-01"),
      endDate: new Date("2030-05-01"),
      current: true,
      location: "",
      descriptionBulletPoints: [
        "Provided strategic guidance and support to the Texas Academy of Mathematics and Science, enhancing the academic and extracurricular experience for gifted students.",
        "Collaborated with faculty and administration to develop initiatives that promote academic excellence and student well-being.",
      ],
    },
    {
      organization: "UNT Community Advisory Group",
      suborganization: "Univ. of North Texas",
      position: "Member",
      startDate: new Date("2024-03-01"),
      endDate: new Date("2024-05-01"),
      current: true,
      location: "Denton, TX",
      descriptionBulletPoints: [
        "Collaborated with university leadership to enhance community engagement and address local issues.",
        "Provided insights and recommendations to improve university-community relations.",
      ],
    },
    {
      organization: "UNT Presidential Search Committee",
      suborganization: "Univ. of North Texas",
      position: "Member",
      startDate: new Date("2024-02-01"),
      endDate: new Date("2024-05-01"),
      current: false,
      location: "",
      descriptionBulletPoints: [
        "Represented over 45,000 North Texas students, championing the student perspective in the search for UNT’s next president.",
      ],
    },
    {
      organization: "HackUNT",
      suborganization: "Univ. of North Texas",
      position: "President",
      startDate: new Date("2022-08-01"),
      endDate: new Date("2024-05-01"),
      current: false,
      location: "",
      descriptionBulletPoints: [
        "Led team of 10 to host competitive design & programming event with 200 participants and $20,000 in sponsorships.",
      ],
    },
    {
      organization: "UNTS Board of Regents",
      suborganization: "Univ. of North Texas System",
      position: "Student Regent",
      startDate: new Date("2022-06-01"),
      endDate: new Date("2023-05-01"),
      current: false,
      location: "",
      descriptionBulletPoints: [
        `Represented over 47,000 North Texas students, facilitating communication between student body and Board of Regents, resulting in
the resolution of 3 student-related issues and the establishment of a new student-focused System-wide values culture.`,
      ],
    },
  ],
  awards: [
    {
      title: "Eagle Scout",
      organization: "Boy Scouts of America",
      date: new Date("2020-03-15"),
      location: "Gonzales, TX",
      description:
        `Achieved Eagle Scout rank, demonstrating exceptional leadership, problem-solving, project management, and adaptability skills
through years of commitment, culminating in a successful community service project and teamwork experience.`,
    },
    {
      title: "National Merit Scholar",
      organization: "NMSC",
      date: new Date("2020-03-15"),
      location: "Seguin, TX",
      description:
        ``,
    },
  ],
  projects: [
    {
      title: "Personal Website", 
      description:
        "This website! Built with React and TypeScript, hosted on Vercel. It serves as a portfolio and a platform to share my projects and experiences.",
      technologies: ["React", "TypeScript", "Vercel"],
      link: "https://www.andymcdowall.com",
      image: "",
      started: new Date("2025-06-01"),
      isUnderDevelopment: true
    },
    {
      title: "Recipe Shopper",
      description:
        "A web application that generates a shopping list based on user-selected recipes. Built with React and Node.js, it allows users to easily plan meals and shop for ingredients.",
      technologies: ["React", "Node.js", "Express", "MongoDB"],
      link: "https://github.com/andymcdowall/reciper-shopper",
      image: "",
      started: new Date("2026-03-10"),
      isUnderDevelopment: true
    },
    {
      title: "Mike Fountain Comedy Website",
      description:
        "A website for comedian Mike Fountain, featuring his tour dates, videos, and contact information. WIP. Built with React and Formspree.",
      technologies: ["React", "Formspree", "Vercel"],
      link: "https://mikefountaincomedy.vercel.app",
      image: "",
      started: new Date("2026-04-01"),
      isUnderDevelopment: true
    },
    {
      title: "Fossil",
      description:
        "A client for the Mastodon microblogging platform. Won Capstone People's Choice - Computer Science award at UNT.",
      technologies: ["Flutter", "Dart", "Docker", "Mastodon"],
      link: "https://github.com/andym1125/Fossil/",
      image: "",
      started: new Date("2023-08-01"),
      isUnderDevelopment: false
    },
    {
      title: "JWKS Server",
      description:
        "The mission: create a jwks server, if you choose to accept",
      technologies: ["Golang", "JWKS", "TypeScript", "JavaScript"],
      link: "https://github.com/andym1125/jwt-assignment",
      image: "",
      started: new Date("2024-02-01"),
      isUnderDevelopment: false
    },
    {
      title: "ExtractPaper",
      description:
        "A preprocessor to prepare research papers for content extraction using LLMs. Was built as part of a research project at UNT ASP (AI Summer Program) to test the viability of extracting the properties of HEAs from research papers automatically.",
      technologies: ["Jupyter Notebook", "Ansible", "Grobid"],
      link: "https://github.com/andym1125/ExtractPaper",
      image: "",
      started: new Date("2024-05-01"),
      isUnderDevelopment: false
    },
  ],
  skills: [
    { name: "HTML", level: 0.95 },
    { name: "CSS", level: 0.9 },
    { name: "JavaScript", level: 0.85 },
    { name: "Flash", level: 1.0 },
    { name: "Photoshop", level: 0.88 },
    { name: "Dreamweaver", level: 0.92 },
    { name: "FrontPage", level: 0.87 },
    { name: "ActionScript", level: 0.93 },
    { name: "Java Applets", level: 0.75 },
    { name: "MIDI Composition", level: 0.82 },
  ],
  education: {
    degree: "Bachelor of Science in",
    degreeShort: "B.S.",
    major: "Computer Science",
    minor: "Political Science",
    certificate: "Cybersecurity",
    university: "University of North Texas",
    universityShort: "UNT",
    graduationDate: new Date("2024-05-15"),
    location: "Denton, TX",
    gpa: 4.0,
  },
};
