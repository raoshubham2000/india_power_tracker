import React from 'react';
import '../styles/AboutDeveloper.css';

const AboutDeveloper = () => {
  return (
    <div className="about-developer-container">
      <div className="developer-header">
        <h1>SHUBHAM RAO</h1>
        <h2>Digital Solutions Engineer</h2>
        <div className="contact-info">
          <p>raoshubham@hotmail.com | Vijayanagar, Karnataka</p>
        </div>
      </div>

      <section className="developer-section">
        <h3>SUMMARY</h3>
        <p>
          Experienced Digital Solutions Engineer with a background in energy
          digitalization and business analysis. I specialize in creating AI-powered
          solutions, optimizing IoT platforms, and designing efficient cloud data
          pipelines that drive operational improvements. My work leverages the latest
          hardware to develop practical, high-performance systems that enhance
          productivity and streamline processes. I'm committed to using data-driven
          insights to solve business challenges and improve operational efficiency.
        </p>
      </section>

      <section className="developer-section">
        <h3>NOTABLE PROJECTS</h3>
        <div className="project-item">
          <h4>In-House IDCC Platform</h4>
          <p>09/2024 - Present | Hyderabad, India</p>
          <ul>
            <li>Built using FastAPI and Vite</li>
            <li>Engineered customizable dashboards for wind energy assets</li>
            <li>Established user management backend serving 200+ employees across 8 locations</li>
          </ul>
        </div>
        <div className="project-item">
          <h4>AI Vision Implementation</h4>
          <p>11/2024 - Present | Thermal Plant Vijayanagar</p>
          <ul>
            <li>Deployed custom YOLO-trained models for PPE compliance detection</li>
            <li>Enhanced employee safety through real-time monitoring in high-risk areas</li>
          </ul>
        </div>
      </section>

      <div className="portfolio-link">
        <a href="https://raoshubham2000.github.io/" target="_blank" rel="noopener noreferrer" className="retro-btn">
          <span className="retro-btn-icon">🌐</span> VIEW PORTFOLIO
        </a>
      </div>
    </div>
  );
};

export default AboutDeveloper; 