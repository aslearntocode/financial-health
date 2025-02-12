'use client'
import Layout from '@/app/layout';
import Header from '@/components/Header';
import Link from 'next/link';
import { useState } from 'react';

const jobOpenings = [
  {
    id: 1,
    title: "Front-End Engineer (NextJS, React, TypeScript)",
    location: "Location: Mumbai",
    jobType: "Type: Hybrid (3 days in office)",
    experience: "Experience: Minimum 2 years",
    education: "Education: B.Tech or M.Tech",
    aboutUs: "Financial Health is a forward-thinking tech company focused on creating exceptional products that make a real difference in people's lives. We believe in empowering teams to grow, innovate, and push the boundaries of technology. We are a new age Fintech working to improve financial health of Indians.",
    description: [
      "We are looking for an enthusiastic and experienced Front-End Engineer with a strong background in React, NextJS, and TypeScript to join our dynamic team. You will play a pivotal role in building scalable, user-centric web applications and delivering high-quality solutions to our users.",
      "As a Front-End Engineer, you will work closely with cross-functional teams to design and implement intuitive user interfaces, while ensuring top-notch performance and responsiveness."
    ],
    responsibilities: [
      "Develop, test, and maintain scalable web applications using React, NextJS, and TypeScript.",
      "Collaborate with product designers and back-end engineers to implement UI/UX designs.",
      "Optimize web applications for maximum speed and scalability.",
      "Ensure high-quality code through writing unit tests, debugging, and code reviews.",
      "Stay updated with the latest trends and technologies in web development.",
      "Troubleshoot and resolve front-end issues across various browsers and devices."
    ],
    requiredSkills: [
      "Minimum 2 years of professional work experience in front-end development.",
      "Proficient in React, NextJS, and TypeScript.",
      "Strong understanding of HTML, CSS, and JavaScript fundamentals.",
      "Experience with version control systems, preferably Git.",
      "Understanding of front-end build tools like Webpack and Babel.",
      "Knowledge of UI/UX principles and experience working with design systems.",
      "Ability to work collaboratively in an Agile development environment.",
      "Excellent problem-solving skills and attention to detail.",
      "B.Tech in Computer Science, Information Technology, or related fields from a recognized Indian college."
    ],
    preferredSkills: [
      "Experience with RESTful APIs and integrating front-end applications with back-end services.",
      "Familiarity with server-side rendering and optimization in NextJS.",
      "Knowledge of CI/CD pipelines and deployment strategies.",
      "Experience with cloud platforms like AWS or Azure."
    ],
    benefits: [
      "Competitive salary and performance-based incentives.",
      "Health insurance and other benefits.",
      "Learning and development opportunities.",
      "Flexible working hours and remote work options.",
      "Collaborative and inclusive company culture."
    ]
  },
  // Add more jobs here with the same structure
];

export default function Careers() {
  const [selectedJob, setSelectedJob] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-white relative">
      <Header />
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        {/* <div className="bg-blue-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">Join Our Team</h1>
            <p className="text-xl">Build the future of financial technology with us</p>
          </div>
        </div> */}

        {/* Job Listings */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {selectedJob === null ? (
            // Show job list
            <div className="grid gap-6">
              {jobOpenings.map((job, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedJob(index)}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{job.title}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      </svg>
                      {job.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                      {job.jobType}
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {job.experience}
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                      </svg>
                      {job.education}
                    </div>
                  </div>
                  <button className="mt-4 text-blue-600 hover:text-blue-800 font-medium">
                    View Details →
                  </button>
                </div>
              ))}
            </div>
          ) : (
            // Detailed job description view
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                  </svg>
                  Back to All Jobs
                </button>

                <div className="space-y-8">
                  {/* Job Header */}
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">{jobOpenings[selectedJob].title}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        </svg>
                        {jobOpenings[selectedJob].location}
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                        {jobOpenings[selectedJob].jobType}
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        {jobOpenings[selectedJob].experience}
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                        {jobOpenings[selectedJob].education}
                      </div>
                    </div>
                  </div>

                  {/* About Us */}
                  <section>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">About Us</h3>
                    <p className="text-gray-600">{jobOpenings[selectedJob].aboutUs}</p>
                  </section>

                  {/* Description */}
                  <section>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Job Description</h3>
                    {jobOpenings[selectedJob].description.map((desc, i) => (
                      <p key={i} className="text-gray-600 mb-2">{desc}</p>
                    ))}
                  </section>

                  {/* Responsibilities */}
                  <section>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Key Responsibilities</h3>
                    <ul className="list-disc pl-5 text-gray-600 space-y-2">
                      {jobOpenings[selectedJob].responsibilities.map((resp, i) => (
                        <li key={i}>{resp}</li>
                      ))}
                    </ul>
                  </section>

                  {/* Required Skills */}
                  <section>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Required Skills & Qualifications</h3>
                    <ul className="list-disc pl-5 text-gray-600 space-y-2">
                      {jobOpenings[selectedJob].requiredSkills.map((skill, i) => (
                        <li key={i}>{skill}</li>
                      ))}
                    </ul>
                  </section>

                  {/* Preferred Skills */}
                  <section>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Preferred Qualifications</h3>
                    <ul className="list-disc pl-5 text-gray-600 space-y-2">
                      {jobOpenings[selectedJob].preferredSkills.map((skill, i) => (
                        <li key={i}>{skill}</li>
                      ))}
                    </ul>
                  </section>

                  {/* Benefits */}
                  <section>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Benefits</h3>
                    <ul className="list-disc pl-5 text-gray-600 space-y-2">
                      {jobOpenings[selectedJob].benefits.map((benefit, i) => (
                        <li key={i}>{benefit}</li>
                      ))}
                    </ul>
                  </section>

                  {/* Apply Section */}
                  <section className="bg-gray-50 p-6 rounded-lg mt-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">How to Apply</h3>
                    <p className="text-gray-600">
                      Please submit your updated resume and portfolio (if available) to{' '}
                      <a href="mailto:careers@financialhealth.co.in" className="text-blue-600 hover:text-blue-800 font-medium">
                        careers@financialhealth.co.in
                      </a>
                    </p>
                  </section>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link href="/careers" className="text-gray-400 hover:text-white">Careers</Link></li>
                <li><Link href="/press" className="text-gray-400 hover:text-white">Press</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
                <li><Link href="/learning-center" className="text-gray-400 hover:text-white">Learning Center</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Social Media</h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://www.youtube.com/@FHAI-InvCredit" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-400 hover:text-white flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    YouTube
                  </a>
                </li>
                <li>
                  <a 
                    href="https://twitter.com/financialhealth" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-400 hover:text-white flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                    Twitter
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.instagram.com/financialhealthai?igsh=bXgweHE5cmRwZmx2&utm_source=qr" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-400 hover:text-white flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.074-4.947c-.061-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                    </svg>
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-gray-400">
                <li>support@financialhealth.co.in</li>
                <li>+91 93213 14553</li>
                <li>Mumbai 400012<br />India</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 Financial Health. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
} 