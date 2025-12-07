/**
 * server/jobs-data.js
 *
 * Expanded job dataset (CommonJS). Added a diverse set of roles across:
 * - Engineering (Frontend, Backend, Fullstack, MERN, DevOps, Mobile, QA, Security)
 * - Data (Data Engineer, Data Scientist)
 * - Product & Design
 * - Marketing & Sales & Customer Success
 *
 * This file is ready to drop into your server/ folder and will be consumed
 * by the existing resume-matcher server.
 *
 * NOTE: postedAt uses dynamic timestamps (seconds) so newest jobs appear higher.
 */

module.exports.jobs = [
  {
    id: "1",
    title: "Senior Frontend Engineer",
    company: "Acme Corp",
    location: "Remote",
    salary: "$120k - $150k",
    salaryNum: 150000,
    type: "Full-time",
    tags: ["React", "TypeScript", "CSS"],
    logo: "https://placehold.co/80x80/E6F0FF/0F172A?text=AC&font=roboto",
    postedAt: Math.floor(Date.now() / 1000) - 6 * 24 * 3600,
    category: "Engineering",
    description: "Build performant, accessible React applications used by millions."
  },
  {
    id: "2",
    title: "Product Designer",
    company: "DesignHub",
    location: "New York, NY",
    salary: "$90k - $110k",
    salaryNum: 110000,
    type: "Full-time",
    tags: ["Figma", "UX", "Prototyping"],
    logo: "https://placehold.co/80x80/FFF3EC/7C3AED?text=DH&font=roboto",
    postedAt: Math.floor(Date.now() / 1000) - 9 * 24 * 3600,
    category: "Design",
    description: "Lead end-to-end product design for web and mobile."
  },
  {
    id: "3",
    title: "Marketing Specialist",
    company: "Marketly",
    location: "San Francisco, CA",
    salary: "$70k - $90k",
    salaryNum: 90000,
    type: "Contract",
    tags: ["SEO", "Content", "Growth"],
    logo: "https://placehold.co/80x80/FEF3C7/92400E?text=M&font=roboto",
    postedAt: Math.floor(Date.now() / 1000) - 12 * 24 * 3600,
    category: "Marketing",
    description: "Run acquisition experiments and build content funnels."
  },

  // Core engineering
  {
    id: "4",
    title: "Backend Engineer",
    company: "ZenVue",
    location: "Remote",
    salary: "$110k - $140k",
    salaryNum: 140000,
    type: "Full-time",
    tags: ["Node.js", "MongoDB", "REST"],
    logo: "https://placehold.co/80x80/EEFBF7/064E3B?text=ZV&font=roboto",
    postedAt: Math.floor(Date.now() / 1000) - 14 * 24 * 3600,
    category: "Engineering",
    description: "Design APIs, optimize DB queries, and improve platform reliability."
  },
  {
    id: "5",
    title: "MERN Stack Engineer",
    company: "ByteWorks",
    location: "Bengaluru, Karnataka, India",
    salary: "₹12L - ₹18L",
    salaryNum: 1800000,
    type: "Full-time",
    tags: ["MongoDB", "Express", "React", "Node.js"],
    logo: "https://placehold.co/80x80/CDEFF7/0F172A?text=BW&font=roboto",
    postedAt: Math.floor(Date.now() / 1000) - 2 * 24 * 3600,
    category: "Engineering",
    description: "Fullstack role working on customer-facing web apps using MERN stack."
  },
  {
    id: "6",
    title: "Full Stack Developer (React / Node)",
    company: "StackLab",
    location: "Pune, Maharashtra, India",
    salary: "₹10L - ₹16L",
    salaryNum: 1600000,
    type: "Full-time",
    tags: ["React", "Node.js", "Express", "MongoDB"],
    logo: "https://placehold.co/80x80/FFF0F6/7C3AED?text=SL&font=roboto",
    postedAt: Math.floor(Date.now() / 1000) - 4 * 24 * 3600,
    category: "Engineering",
    description: "Ship new features and scale web services using React and Node."
  },
  {
    id: "7",
    title: "Frontend Engineer — React",
    company: "Glacier Tech",
    location: "Mumbai, Maharashtra, India",
    salary: "₹8L - ₹13L",
    salaryNum: 1300000,
    type: "Full-time",
    tags: ["React", "Redux", "JavaScript", "CSS"],
    logo: "https://placehold.co/80x80/EFF6FF/0A2540?text=GT&font=roboto",
    postedAt: Math.floor(Date.now() / 1000) - 8 * 24 * 3600,
    category: "Engineering",
    description: "Focus on building performant React UIs and component libraries."
  },
  {
    id: "8",
    title: "Node.js Backend Developer",
    company: "CloudBridge",
    location: "Hyderabad, Telangana, India",
    salary: "₹14L - ₹20L",
    salaryNum: 2000000,
    type: "Full-time",
    tags: ["Node.js", "AWS", "Microservices", "Docker"],
    logo: "https://placehold.co/80x80/EEF9F6/064E3B?text=CB&font=roboto",
    postedAt: Math.floor(Date.now() / 1000) - 10 * 24 * 3600,
    category: "Engineering",
    description: "Build microservices and APIs for data-intensive applications."
  },
  {
    id: "9",
    title: "Senior Backend Engineer",
    company: "InnovaTech",
    location: "Pune, Maharashtra, India",
    salary: "₹18L - ₹28L",
    salaryNum: 2800000,
    type: "Full-time",
    tags: ["Node.js", "AWS", "Microservices"],
    logo: "https://placehold.co/80x80/E8F8F5/064E3B?text=IN&font=roboto",
    postedAt: Math.floor(Date.now() / 1000) - 3 * 24 * 3600,
    category: "Engineering",
    description: "Architect scalable backend services and mentor junior engineers."
  },

  // Data roles
  {
    id: "10",
    title: "Data Scientist",
    company: "DataCraft India",
    location: "Bengaluru, Karnataka, India",
    salary: "₹12L - ₹22L",
    salaryNum: 2200000,
    type: "Full-time",
    tags: ["Python", "Machine Learning", "SQL"],
    logo: "https://placehold.co/80x80/FEF3C7/92400E?text=DC&font=roboto",
    postedAt: Math.floor(Date.now() / 1000) - 1 * 24 * 3600,
    category: "Engineering",
    description: "Develop ML models and productionize data pipelines."
  },
  {
    id: "11",
    title: "Data Engineer",
    company: "Lakehouse Labs",
    location: "Bengaluru, Karnataka, India",
    salary: "₹14L - ₹24L",
    salaryNum: 2400000,
    type: "Full-time",
    tags: ["Python", "Spark", "Airflow", "SQL"],
    logo: "https://placehold.co/80x80/EDF7FF/0A2540?text=LL&font=roboto",
    postedAt: Math.floor(Date.now() / 1000) - 7 * 24 * 3600,
    category: "Engineering",
    description: "Design and operate scalable ETL and analytics pipelines."
  },

  // Mobile
  {
    id: "12",
    title: "React Native Developer",
    company: "Appify",
    location: "Remote",
    salary: "$30k - $45k",
    salaryNum: 45000,
    type: "Full-time",
    tags: ["React Native", "React", "TypeScript"],
    logo: "https://placehold.co/80x80/FFF3EC/7C3AED?text=AP&font=roboto",
    postedAt: Math.floor(Date.now() / 1000) - 11 * 24 * 3600,
    category: "Engineering",
    description: "Build and maintain cross-platform mobile applications."
  },

  // Senior fullstack
  {
    id: "13",
    title: "Senior Full Stack Engineer",
    company: "DevNest",
    location: "Bengaluru, Karnataka, India",
    salary: "₹18L - ₹28L",
    salaryNum: 2800000,
    type: "Full-time",
    tags: ["React", "Node.js", "Postgres", "Docker"],
    logo: "https://placehold.co/80x80/EEF2FF/0F172A?text=DN&font=roboto",
    postedAt: Math.floor(Date.now() / 1000) - 13 * 24 * 3600,
    category: "Engineering",
    description: "Lead feature teams and architect scalable systems."
  },

  // Startups & remote
  {
    id: "14",
    title: "Full Stack Engineer (MERN)",
    company: "Pune Startups",
    location: "Pune, Maharashtra, India",
    salary: "₹9L - ₹14L",
    salaryNum: 1400000,
    type: "Full-time",
    tags: ["MongoDB", "Express", "React", "Node.js", "AWS"],
    logo: "https://placehold.co/80x80/FFF7ED/92400E?text=PS&font=roboto",
    postedAt: Math.floor(Date.now() / 1000) - 5 * 24 * 3600,
    category: "Engineering",
    description: "End-to-end product development for an early-stage startup."
  },
  {
    id: "15",
    title: "Junior Full Stack Developer",
    company: "CampusTech",
    location: "Pune, Maharashtra, India",
    salary: "₹4L - ₹6L",
    salaryNum: 600000,
    type: "Full-time",
    tags: ["React", "Node.js", "MongoDB"],
    logo: "https://placehold.co/80x80/FEF9FF/92400E?text=CT&font=roboto",
    postedAt: Math.floor(Date.now() / 1000) - 15 * 24 * 3600,
    category: "Engineering",
    description: "Great role for early-career MERN developers with mentorship."
  },

  // DevOps / SRE
  {
    id: "16",
    title: "DevOps Engineer",
    company: "InfraWorks",
    location: "Bengaluru, Karnataka, India",
    salary: "₹16L - ₹26L",
    salaryNum: 2600000,
    type: "Full-time",
    tags: ["AWS", "Terraform", "Kubernetes", "Docker"],
    logo: "https://placehold.co/80x80/EFFDF0/0F172A?text=IW&font=roboto",
    postedAt: Math.floor(Date.now() / 1000) - 20 * 24 * 3600,
    category: "Engineering",
    description: "Improve platform reliability and automation."
  },

  // QA / Testing
  {
    id: "17",
    title: "QA Engineer (Automation)",
    company: "QualityPlus",
    location: "Bengaluru, Karnataka, India",
    salary: "₹6L - ₹10L",
    salaryNum: 1000000,
    type: "Full-time",
    tags: ["Selenium", "Java", "API Testing", "CI/CD"],
    logo: "https://placehold.co/80x80/FFF8E6/92400E?text=QP&font=roboto",
    postedAt: Math.floor(Date.now() / 1000) - 18 * 24 * 3600,
    category: "Engineering",
    description: "Automated test frameworks and integration testing."
  },

  // Security
  {
    id: "18",
    title: "Application Security Engineer",
    company: "SecuriTech",
    location: "Remote",
    salary: "$100k - $140k",
    salaryNum: 140000,
    type: "Full-time",
    tags: ["Security", "SAST", "DevSecOps", "AWS"],
    logo: "https://placehold.co/80x80/F0F9FF/075985?text=ST&font=roboto",
    postedAt: Math.floor(Date.now() / 1000) - 22 * 24 * 3600,
    category: "Engineering",
    description: "Integrate security into dev lifecycle and perform code reviews."
  },

  // Product & Management
  {
    id: "19",
    title: "Product Manager",
    company: "Tata Digital",
    location: "Mumbai, Maharashtra, India",
    salary: "₹25L - ₹35L",
    salaryNum: 3500000,
    type: "Full-time",
    tags: ["Product", "Roadmap", "Stakeholder"],
    logo: "https://placehold.co/80x80/FFF3EC/7C3AED?text=TD&font=roboto",
    postedAt: Math.floor(Date.now() / 1000) - 17 * 24 * 3600,
    category: "Product",
    description: "Drive product strategy and cross-functional execution."
  },

  // Sales & Customer Success
  {
    id: "20",
    title: "Customer Success Manager",
    company: "Supportly",
    location: "Austin, TX",
    salary: "$60k - $80k",
    salaryNum: 80000,
    type: "Full-time",
    tags: ["Customer Success", "SaaS", "Account Management"],
    logo: "https://placehold.co/80x80/F0F9FF/075985?text=S&font=roboto",
    postedAt: Math.floor(Date.now() / 1000) - 25 * 24 * 3600,
    category: "Customer Success",
    description: "Be a trusted advisor to enterprise customers."
  },
  {
    id: "21",
    title: "Account Executive",
    company: "SalesPro",
    location: "Delhi, India",
    salary: "₹8L - ₹14L",
    salaryNum: 1400000,
    type: "Full-time",
    tags: ["Sales", "B2B", "CRM"],
    logo: "https://placehold.co/80x80/FFF1F2/92400E?text=SP&font=roboto",
    postedAt: Math.floor(Date.now() / 1000) - 30 * 24 * 3600,
    category: "Sales",
    description: "Hunt and close new enterprise business."
  },

  // Specialized engineering
  {
    id: "22",
    title: "Site Reliability Engineer",
    company: "ScaleOps",
    location: "Bengaluru, Karnataka, India",
    salary: "₹20L - ₹32L",
    salaryNum: 3200000,
    type: "Full-time",
    tags: ["Kubernetes", "Prometheus", "Go", "SRE"],
    logo: "https://placehold.co/80x80/ECFDF5/064E3B?text=SO&font=roboto",
    postedAt: Math.floor(Date.now() / 1000) - 2 * 24 * 3600,
    category: "Engineering",
    description: "Improve site reliability, incident response, and scalability."
  },
  {
    id: "23",
    title: "Frontend Engineer (Accessibility)",
    company: "InclusiveUI",
    location: "Remote",
    salary: "$85k - $110k",
    salaryNum: 110000,
    type: "Full-time",
    tags: ["React", "Accessibility", "WCAG", "HTML", "CSS"],
    logo: "https://placehold.co/80x80/FFF8F6/0F172A?text=IU&font=roboto",
    postedAt: Math.floor(Date.now() / 1000) - 21 * 24 * 3600,
    category: "Engineering",
    description: "Champion accessible web experiences across products."
  },

  // Fintech & GraphQL
  {
    id: "24",
    title: "Software Engineer - Frontend",
    company: "FinEdge",
    location: "Bengaluru, Karnataka, India",
    salary: "₹11L - ₹16L",
    salaryNum: 1600000,
    type: "Full-time",
    tags: ["React", "TypeScript", "GraphQL"],
    logo: "https://placehold.co/80x80/EDF7FF/0A2540?text=FE&font=roboto",
    postedAt: Math.floor(Date.now() / 1000) - 19 * 24 * 3600,
    category: "Engineering",
    description: "Work on business applications for fintech using React + GraphQL."
  },

  // Remote US roles
  {
    id: "25",
    title: "Full Stack Software Engineer",
    company: "Nomad Labs",
    location: "Remote (US)",
    salary: "$80k - $110k",
    salaryNum: 110000,
    type: "Full-time",
    tags: ["React", "Node.js", "Postgres", "Docker"],
    logo: "https://placehold.co/80x80/EDF2FF/0F172A?text=NL&font=roboto",
    postedAt: Math.floor(Date.now() / 1000) - 24 * 3600,
    category: "Engineering",
    description: "Distributed teams building SaaS products."
  },

  // More niche / junior / contract roles
  {
    id: "26",
    title: "Frontend Intern (React)",
    company: "StartupLab",
    location: "Pune, Maharashtra, India",
    salary: "₹1.5L - ₹3L",
    salaryNum: 300000,
    type: "Internship",
    tags: ["React", "JavaScript"],
    logo: "https://placehold.co/80x80/F8F5FF/7C3AED?text=SL&font=roboto",
    postedAt: Math.floor(Date.now() / 1000) - 3 * 24 * 3600,
    category: "Engineering",
    description: "Great learning opportunity for early-career frontend engineers."
  },
  {
    id: "27",
    title: "Contract Backend Developer",
    company: "QuickHire",
    location: "Remote",
    salary: "$40/hr - $60/hr",
    salaryNum: 50,
    type: "Contract",
    tags: ["Node.js", "Express", "Postgres"],
    logo: "https://placehold.co/80x80/FFF7F2/92400E?text=QH&font=roboto",
    postedAt: Math.floor(Date.now() / 1000) - 16 * 24 * 3600,
    category: "Engineering",
    description: "Short-term contract building API features."
  },

  // Design / research
  {
    id: "28",
    title: "UX Researcher",
    company: "UserLens",
    location: "Mumbai, Maharashtra, India",
    salary: "₹8L - ₹14L",
    salaryNum: 1400000,
    type: "Full-time",
    tags: ["Research", "User Testing", "Figma"],
    logo: "https://placehold.co/80x80/FFF4F0/0F172A?text=UL&font=roboto",
    postedAt: Math.floor(Date.now() / 1000) - 27 * 24 * 3600,
    category: "Design",
    description: "Run user studies and translate research into product decisions."
  },

  // Growth & performance marketing
  {
    id: "29",
    title: "Growth Engineer",
    company: "GrowthLab",
    location: "Delhi, India",
    salary: "₹9L - ₹14L",
    salaryNum: 1400000,
    type: "Full-time",
    tags: ["Python", "SQL", "Analytics", "Growth"],
    logo: "https://placehold.co/80x80/F0FBFF/075985?text=GL&font=roboto",
    postedAt: Math.floor(Date.now() / 1000) - 23 * 24 * 3600,
    category: "Marketing",
    description: "Implement growth experiments and analytics instrumentation."
  },

  // Specialized product roles
  {
    id: "30",
    title: "Technical Product Manager",
    company: "APIWorks",
    location: "Bengaluru, Karnataka, India",
    salary: "₹20L - ₹30L",
    salaryNum: 3000000,
    type: "Full-time",
    tags: ["Product", "APIs", "Roadmap"],
    logo: "https://placehold.co/80x80/FFF8E6/92400E?text=AW&font=roboto",
    postedAt: Math.floor(Date.now() / 1000) - 26 * 24 * 3600,
    category: "Product",
    description: "Own the API product and coordinate engineering & partners."
  },

  // Additional engineering roles to broaden pool
  {
    id: "31",
    title: "Platform Engineer",
    company: "CoreInfra",
    location: "Bengaluru, Karnataka, India",
    salary: "₹22L - ₹36L",
    salaryNum: 3600000,
    type: "Full-time",
    tags: ["Kubernetes", "GCP", "Terraform"],
    logo: "https://placehold.co/80x80/EEF9FF/0A2540?text=CI&font=roboto",
    postedAt: Math.floor(Date.now() / 1000) - 29 * 24 * 3600,
    category: "Engineering",
    description: "Build and maintain internal developer platforms and CI/CD."
  },
  {
    id: "32",
    title: "Machine Learning Engineer",
    company: "AIMinds",
    location: "Bengaluru, Karnataka, India",
    salary: "₹18L - ₹30L",
    salaryNum: 3000000,
    type: "Full-time",
    tags: ["Python", "TensorFlow", "ML", "MLOps"],
    logo: "https://placehold.co/80x80/FFF6F6/92400E?text=AM&font=roboto",
    postedAt: Math.floor(Date.now() / 1000) - 35 * 24 * 3600,
    category: "Engineering",
    description: "Train and deploy ML models and maintain inference pipelines."
  },
  {
    id: "33",
    title: "Security Analyst",
    company: "SafeNet",
    location: "Hyderabad, Telangana, India",
    salary: "₹10L - ₹18L",
    salaryNum: 1800000,
    type: "Full-time",
    tags: ["Security", "SOC", "Monitoring"],
    logo: "https://placehold.co/80x80/FFF2F8/7C3AED?text=SN&font=roboto",
    postedAt: Math.floor(Date.now() / 1000) - 40 * 24 * 3600,
    category: "Engineering",
    description: "Handle incident response and security monitoring."
  },

  // More remote and international postings
  {
    id: "34",
    title: "Senior Frontend Engineer (React)",
    company: "Orbit Labs",
    location: "Berlin, Germany (Remote)",
    salary: "€70k - €95k",
    salaryNum: 95000,
    type: "Full-time",
    tags: ["React", "TypeScript", "Performance"],
    logo: "https://placehold.co/80x80/EEF7FF/0A2540?text=OL&font=roboto",
    postedAt: Math.floor(Date.now() / 1000) - 45 * 24 * 3600,
    category: "Engineering",
    description: "Drive frontend performance and maintain component library."
  },
  {
    id: "35",
    title: "Technical Writer",
    company: "DocuFlow",
    location: "Remote",
    salary: "$55k - $75k",
    salaryNum: 75000,
    type: "Contract",
    tags: ["Docs", "Technical Writing", "API"],
    logo: "https://placehold.co/80x80/FFF9F1/92400E?text=DF&font=roboto",
    postedAt: Math.floor(Date.now() / 1000) - 50 * 24 * 3600,
    category: "Product",
    description: "Write API docs, tutorials, and developer guides."
  }
];