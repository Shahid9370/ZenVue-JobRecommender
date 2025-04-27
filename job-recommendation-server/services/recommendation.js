const getRecommendations = (skills, location) => {
    // Static job recommendations for now
    const jobs = [
        { title: 'React Developer', company: 'Tech Corp', location: 'Mumbai', skills: ['React', 'JavaScript', 'CSS'], link: 'http://example.com' },
        { title: 'Backend Developer', company: 'Code Inc.', location: 'Pune', skills: ['Node.js', 'Express', 'MongoDB'], link: 'http://example.com' },
        { title: 'AI Engineer', company: 'AI Labs', location: 'Bangalore', skills: ['Python', 'Machine Learning', 'TensorFlow'], link: 'http://example.com' },
    ];

    // Filter jobs based on location (For now, simple filter based on location)
    const filteredJobs = jobs.filter(job => job.location.toLowerCase().includes(location.toLowerCase()));

    return filteredJobs;
};

module.exports = { getRecommendations };
