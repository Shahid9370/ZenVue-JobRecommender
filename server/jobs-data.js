/**
 * server/jobs-data.js
 *
 * Lightweight CommonJS copy of job data for the server.
 * Keep this file inside the new /server folder.
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
    tags: ["React", "TypeScript"],
    logo: "https://placehold.co/80x80/E6F0FF/0F172A?text=AC&font=roboto",
    postedAt: 1699990000,
    category: "Engineering"
  },
  {
    id: "2",
    title: "Product Designer",
    company: "DesignHub",
    location: "New York, NY",
    salary: "$90k - $110k",
    salaryNum: 110000,
    type: "Full-time",
    tags: ["Figma", "UX"],
    logo: "https://placehold.co/80x80/FFF3EC/7C3AED?text=DH&font=roboto",
    postedAt: 1699900000,
    category: "Design"
  },
  {
    id: "3",
    title: "Marketing Specialist",
    company: "Marketly",
    location: "San Francisco, CA",
    salary: "$70k - $90k",
    salaryNum: 90000,
    type: "Contract",
    tags: ["SEO", "Content"],
    logo: "https://placehold.co/80x80/FEF3C7/92400E?text=M&font=roboto",
    postedAt: 1699800000,
    category: "Marketing"
  },
  {
    id: "4",
    title: "Backend Engineer",
    company: "ZenVue",
    location: "Remote",
    salary: "$110k - $140k",
    salaryNum: 140000,
    type: "Full-time",
    tags: ["Node.js", "MongoDB"],
    logo: "https://placehold.co/80x80/EEFBF7/064E3B?text=ZV&font=roboto",
    postedAt: 1699700000,
    category: "Engineering"
  },
  {
    id: "6",
    title: "Senior Backend Engineer",
    company: "InnovaTech",
    location: "Pune, Maharashtra, India",
    salary: "₹18L - ₹28L",
    salaryNum: 2800000,
    type: "Full-time",
    tags: ["Node.js", "AWS", "Microservices"],
    logo: "https://placehold.co/80x80/E8F8F5/064E3B?text=IN&font=roboto",
    postedAt: Math.floor(Date.now() / 1000) - 3 * 24 * 3600,
    category: "Engineering"
  },
  {
    id: "7",
    title: "Frontend Engineer (React)",
    company: "PuneLabs",
    location: "Pune, Maharashtra, India",
    salary: "₹10L - ₹15L",
    salaryNum: 1500000,
    type: "Full-time",
    tags: ["React", "JavaScript", "CSS"],
    logo: "https://placehold.co/80x80/EDF2FF/0F172A?text=PL&font=roboto",
    postedAt: Math.floor(Date.now() / 1000) - 6 * 24 * 3600,
    category: "Engineering"
  },
  {
    id: "9",
    title: "Data Scientist",
    company: "DataCraft India",
    location: "Bengaluru, Karnataka, India",
    salary: "₹12L - ₹22L",
    salaryNum: 2200000,
    type: "Full-time",
    tags: ["Python", "Machine Learning", "SQL"],
    logo: "https://placehold.co/80x80/FEF3C7/92400E?text=DC&font=roboto",
    postedAt: Math.floor(Date.now() / 1000) - 2 * 24 * 3600,
    category: "Engineering"
  },
  {
    id: "11",
    title: "Marketing Specialist (Growth)",
    company: "Bazaarly",
    location: "Delhi, India",
    salary: "₹6L - ₹10L",
    salaryNum: 1000000,
    type: "Contract",
    tags: ["Growth", "SEO", "Performance"],
    logo: "https://placehold.co/80x80/EDF7FF/0A2540?text=BZ&font=roboto",
    postedAt: Math.floor(Date.now() / 1000) - 1 * 24 * 3600,
    category: "Marketing"
  }
];