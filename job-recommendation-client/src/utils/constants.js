// src/utils/constants.js
// Sample data for the demo job portal. Added India-specific jobs, companies,
// salaries (INR) and a testimonial from Pune. Logo fields use remote placeholder
// images so you don't need local assets.

export const categories = [
  { name: "Engineering", count: 124, icon: "E" },
  { name: "Design", count: 32, icon: "D" },
  { name: "Product", count: 21, icon: "P" },
  { name: "Marketing", count: 44, icon: "M" },
  { name: "Sales", count: 18, icon: "S" },
  { name: "Customer Success", count: 12, icon: "C" },
];

export const featuredJobs = [
  {
    id: "1",
    title: "Senior Frontend Engineer",
    company: "Acme Corp",
    location: "Remote",
    salary: "$120k - $150k",
    salaryNum: 150000,
    type: "Full-time",
    tags: ["React", "TypeScript"],
    // remote placeholder logo (no local asset required)
    logo: "https://placehold.co/80x80/E6F0FF/0F172A?text=AC&font=roboto",
    postedAt: 1699990000,
    category: "Engineering",
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
    category: "Design",
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
    category: "Marketing",
  },
];

export const jobs = [
  // include featured first
  ...featuredJobs,

  // original items (converted logos to remote placeholders)
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
    category: "Engineering",
  },
  {
    id: "5",
    title: "Customer Success Manager",
    company: "Supportly",
    location: "Austin, TX",
    salary: "$60k - $80k",
    salaryNum: 80000,
    type: "Full-time",
    tags: ["Support", "SaaS"],
    logo: "https://placehold.co/80x80/F0F9FF/075985?text=S&font=roboto",
    postedAt: 1699600000,
    category: "Customer Success",
  },

  // ---------- India-specific jobs ----------
  {
    id: "6",
    title: "Senior Backend Engineer",
    company: "InnovaTech",
    location: "Pune, Maharashtra, India",
    // salaries expressed in INR (lakh notation in string). salaryNum in INR (number).
    salary: "₹18L - ₹28L",
    salaryNum: 2800000,
    type: "Full-time",
    tags: ["Node.js", "AWS", "Microservices"],
    logo: "https://placehold.co/80x80/E8F8F5/064E3B?text=IN&font=roboto",
    postedAt: Math.floor(Date.now() / 1000) - 3 * 24 * 3600, // 3 days ago
    category: "Engineering",
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
    postedAt: Math.floor(Date.now() / 1000) - 6 * 24 * 3600, // 6 days ago
    category: "Engineering",
  },
  {
    id: "8",
    title: "Product Manager",
    company: "Tata Digital",
    location: "Mumbai, Maharashtra, India",
    salary: "₹25L - ₹35L",
    salaryNum: 3500000,
    type: "Full-time",
    tags: ["Product", "Roadmap", "Stakeholder"],
    logo: "https://placehold.co/80x80/FFF3EC/7C3AED?text=TD&font=roboto",
    postedAt: Math.floor(Date.now() / 1000) - 10 * 24 * 3600, // 10 days ago
    category: "Product",
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
    postedAt: Math.floor(Date.now() / 1000) - 2 * 24 * 3600, // 2 days ago
    category: "Engineering",
  },
  {
    id: "10",
    title: "Customer Success Manager",
    company: "Supportly India",
    location: "Hyderabad, Telangana, India",
    salary: "₹8L - ₹12L",
    salaryNum: 1200000,
    type: "Full-time",
    tags: ["Customer Success", "SaaS"],
    logo: "https://placehold.co/80x80/F0F9FF/075985?text=SI&font=roboto",
    postedAt: Math.floor(Date.now() / 1000) - 8 * 24 * 3600, // 8 days ago
    category: "Customer Success",
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
    postedAt: Math.floor(Date.now() / 1000) - 1 * 24 * 3600, // 1 day ago
    category: "Marketing",
  },
];

export const testimonials = [
  {
    id: "t1",
    name: "Aisha Khan",
    role: "Frontend Engineer",
    text: "Found an amazing role within a week.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=aisha-khan",
  },
  {
    id: "t2",
    name: "David Lee",
    role: "Product Manager",
    text: "Excellent job matching.",
    rating: 4,
    avatar: "https://i.pravatar.cc/150?u=david-lee",
  },
  {
    id: "t3",
    name: "Sophia Patel",
    role: "Designer",
    text: "Great UX and easy to apply.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=sophia-patel",
  },
  // India-specific testimonial
  {
    id: "t4",
    name: "Shahid Shaikh",
    role: "Full Stack Developer",
    text: "I got a great offer from a Pune startup after applying through ZenVue.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=ravi-kulkarni",
  },
];