const pdfParse = require('pdf-parse');
const fs = require('fs');

exports.getRecommendations = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Files:', req.files);

    const { userSkills, location, salaryRange } = req.body;
    const files = req.files || [];

    let skills = userSkills ? userSkills.split(',').map(s => s.trim().toLowerCase()) : [];
    let extractedSkills = [];

    // Define valid locations
    const validLocations = ['pune', 'mumbai', 'delhi', 'bangalore', 'chennai', 'hyderabad', 'kolkata'];

    if (files.length > 0) {
      const file = files[0];
      if (!file) throw new Error('No file uploaded');
      const dataBuffer = fs.readFileSync(file.path);
      const data = await pdfParse(dataBuffer);
      const text = data.text.toLowerCase();

      // Define skillSet for role-based skill detection
      const skillSet = {
        'react developer': ['react', 'javascript', 'html', 'css', 'redux', 'typescript'],
        'python engineer': ['python', 'django', 'flask', 'pandas', 'numpy', 'machine learning'],
        'web developer': ['html', 'css', 'javascript', 'php', 'wordpress', 'bootstrap'],
        'java developer': ['java', 'spring', 'hibernate', 'maven', 'junit'],
        'data analyst': ['sql', 'excel', 'python', 'r', 'tableau', 'power bi'],
        'full stack developer': ['nodejs', 'express', 'mongodb', 'react', 'angular', 'vue'],
        'devops engineer': ['docker', 'kubernetes', 'aws', 'jenkins', 'terraform', 'ansible'],
        'frontend developer': ['javascript', 'react', 'vue', 'angular', 'sass', 'webpack'],
        'backend developer': ['nodejs', 'python', 'java', 'sql', 'rest api', 'graphql'],
        'mobile app developer': ['swift', 'kotlin', 'flutter', 'xcode', 'android studio', 'dart'],
        'machine learning engineer': ['tensorflow', 'pytorch', 'scikit-learn', 'nlp', 'deep learning', 'python'],
        'cloud architect': ['aws', 'azure', 'google cloud', 'cloudformation', 'iam', 'vpc'],
        'ui/ux designer': ['sketch', 'figma', 'adobe xd', 'prototyping', 'wireframing', 'user research', 'balsamiq', 'photoshop', 'illustrator'],
        'database administrator': ['mysql', 'postgresql', 'oracle', 'sql server', 'mongodb', 'backup'],
        'security analyst': ['firewall', 'siem', 'penetration testing', 'encryption', 'cybersecurity', 'nessus'],
        'software tester': ['selenium', 'jira', 'testng', 'manual testing', 'automation', 'qa'],
        'system administrator': ['linux', 'windows server', 'active directory', 'networking', 'vmware', 'powershell'],
        'blockchain developer': ['solidity', 'ethereum', 'hyperledger', 'smart contracts', 'web3.js', 'truffle'],
        'product manager': ['agile', 'scrum', 'jira', 'roadmapping', 'stakeholder management', 'market analysis'],
        'business analyst': ['bpmn', 'uml', 'requirements gathering', 'data modeling', 'sap', 'business process']
      };

      // Advanced skill detection with improved section matching
      const skillSections = ['skills', 'technical skills', 'competencies', 'proficiencies', 'skills & competencies'];
      skillSections.forEach(section => {
        const sectionIndex = text.indexOf(section);
        if (sectionIndex !== -1) {
          const nextLineBreak = text.indexOf('\n', sectionIndex);
          const skillsText = text.substring(sectionIndex + section.length, nextLineBreak !== -1 ? nextLineBreak : undefined)
            .replace(/[-•●]/g, '') // Remove bullets
            .split(/[,;\s]+/) // Split by commas, semicolons, or whitespace
            .map(skill => skill.trim())
            .filter(skill => skill.length > 0 && !['and', '&'].includes(skill)); // Filter out conjunctions
          extractedSkills = [...extractedSkills, ...skillsText];
        }
      });

      // Role-based skill detection with flexible role matching
      extractedSkills = [...extractedSkills, ...Object.entries(skillSet).reduce((acc, [role, roleSkills]) => {
        const roleVariants = [role, role.replace('/', ' '), role.replace(' ', '/')]; // Handle "ui/ux" or "ux/ui"
        if (roleVariants.some(variant => text.includes(variant))) {
          return [...acc, ...roleSkills.filter(skill => text.includes(skill))];
        }
        return acc;
      }, []).filter((skill, index, self) => self.indexOf(skill) === index)];

      // Extract additional skills from projects and experience
      const projectKeywords = ['project', 'internship', 'experience', 'professional experience'];
      projectKeywords.forEach(keyword => {
        const keywordIndex = text.indexOf(keyword);
        if (keywordIndex !== -1) {
          const sectionEnd = text.indexOf('\n\n', keywordIndex) !== -1 ? text.indexOf('\n\n', keywordIndex) : text.length;
          const sectionText = text.substring(keywordIndex, sectionEnd).toLowerCase();
          const additionalSkills = ['php', 'react.js', 'mysql', 'node.js', 'spring boot', 'html', 'css', 'javascript', 'java', 'figma', 'sketch', 'adobe xd', 'balsamiq', 'photoshop', 'illustrator']
            .filter(skill => sectionText.includes(skill));
          extractedSkills = [...new Set([...extractedSkills, ...additionalSkills])];
        }
      });
    }

    skills = [...new Set([...skills, ...extractedSkills])];

    // Validate manual location
    const isValidLocation = location && validLocations.includes(location.toLowerCase());
    if (location && !isValidLocation) {
      return res.status(400).json({ message: 'Warning: Location is not valid. Please use one of: pune, mumbai, delhi, bangalore, chennai, hyderabad, kolkata.' });
    }

    // Filter jobs based on skills and user-provided location only
    const jobs = [
      { title: 'React Developer', company: 'Tech Corp', location: 'mumbai', salary: '60000-90000', matchScore: 85, requiredSkills: ['react', 'javascript', 'html', 'css'] },
      { title: 'Python Engineer', company: 'Data Inc', location: 'pune', salary: '70000-100000', matchScore: 70, requiredSkills: ['python', 'django', 'flask'] },
      { title: 'Web Developer', company: 'Web Solutions', location: 'delhi', salary: '55000-85000', matchScore: 80, requiredSkills: ['html', 'css', 'javascript', 'php'] },
      { title: 'Java Developer', company: 'CodeMasters', location: 'bangalore', salary: '65000-95000', matchScore: 75, requiredSkills: ['java', 'spring'] },
      { title: 'Data Analyst', company: 'Insight Analytics', location: 'chennai', salary: '60000-90000', matchScore: '78', requiredSkills: ['sql', 'excel'] },
      { title: 'Full Stack Developer', company: 'NextGen Tech', location: 'hyderabad', salary: '70000-110000', matchScore: 82, requiredSkills: ['nodejs', 'react', 'mongodb'] },
      { title: 'DevOps Engineer', company: 'Cloud Innovations', location: 'kolkata', salary: '75000-120000', matchScore: 80, requiredSkills: ['docker', 'aws'] },
      { title: 'Frontend Developer', company: 'UI Pioneers', location: 'mumbai', salary: '55000-80000', matchScore: 77, requiredSkills: ['react', 'javascript'] },
      { title: 'Backend Developer', company: 'ServerSide Inc', location: 'pune', salary: '65000-100000', matchScore: 79, requiredSkills: ['nodejs', 'sql'] },
      { title: 'Mobile App Developer', company: 'AppVantage', location: 'delhi', salary: '60000-95000', matchScore: 76, requiredSkills: ['swift', 'kotlin'] },
      { title: 'Machine Learning Engineer', company: 'AI Labs', location: 'bangalore', salary: '80000-130000', matchScore: 83, requiredSkills: ['tensorflow', 'python'] },
      { title: 'Cloud Architect', company: 'SkyNet Solutions', location: 'chennai', salary: '90000-140000', matchScore: 81, requiredSkills: ['aws', 'azure'] },
      { title: 'UI/UX Designer', company: 'DesignHub', location: 'hyderabad', salary: '55000-85000', matchScore: 74, requiredSkills: ['figma', 'sketch'] },
      { title: 'Database Administrator', company: 'DataGuard', location: 'kolkata', salary: '65000-100000', matchScore: 77, requiredSkills: ['mysql', 'postgresql'] },
      { title: 'Security Analyst', company: 'CyberSafe', location: 'mumbai', salary: '70000-110000', matchScore: 79, requiredSkills: ['firewall', 'siem'] },
      { title: 'Software Tester', company: 'QualityAssure', location: 'pune', salary: '50000-80000', matchScore: 73, requiredSkills: ['selenium', 'jira'] },
      { title: 'System Administrator', company: 'InfraTech', location: 'delhi', salary: '60000-95000', matchScore: 76, requiredSkills: ['linux', 'networking'] },
      { title: 'Blockchain Developer', company: 'ChainLink Inc', location: 'bangalore', salary: '80000-130000', matchScore: 82, requiredSkills: ['solidity', 'ethereum'] },
      { title: 'Product Manager', company: 'InnovateNow', location: 'chennai', salary: '75000-120000', matchScore: 78, requiredSkills: ['agile', 'scrum'] },
      { title: 'Business Analyst', company: 'StrategyCore', location: 'hyderabad', salary: '60000-90000', matchScore: 75, requiredSkills: ['bpmn', 'uml'] },
    ].filter(job => {
      if (skills.length === 0) return true; // Show all jobs if no skills provided
      return job.requiredSkills.some(skill => skills.includes(skill.toLowerCase()));
    }).filter(job => 
      (!salaryRange || (parseInt(job.salary.split('-')[0]) >= parseInt(salaryRange.split('-')[0]) && 
                        parseInt(job.salary.split('-')[1]) <= parseInt(salaryRange.split('-')[1]))) &&
      // Filter based on user-provided location only
      (!location || job.location.toLowerCase() === location.toLowerCase())
    );

    console.log('Filtered jobs:', jobs); // Debug log
    res.json({ jobs });
  } catch (error) {
    console.error('Recommendation error:', error.message, error.stack);
    res.status(500).json({ message: 'Error processing request', error: error.message });
  }
};