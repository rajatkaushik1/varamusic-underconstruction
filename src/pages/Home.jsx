import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import LotusHeroBackground from '../components/LotusHeroBackground.jsx'
import '../styles/home.css'

export default function Home() {
  const [visible, setVisible] = useState(false)

  return (
    <main className="home-page">
      <section className="hero-section--with-bg home-hero">
        <LotusHeroBackground
          durationMs={2400}
          onIntroComplete={() => setVisible(true)}
          skipIntro={false}
        />
        <div className={`hero-content ${visible ? 'visible' : ''}`}>
          <img src="/logo.png" alt="VARA" className="hero-logo" />
          <h1 className="uc-title">Under Construction</h1>
          <p className="uc-sub">
            Our new website for VARA is being built and will be launching soon. Thank you for your patience.
          </p>

          {/* New CTA button to go to /team */}
          <Link
            to="/team"
            className="inline-block mt-4 px-6 py-2 rounded-full text-black font-semibold transition-colors"
            style={{
              backgroundColor: '#f59e0b',
              boxShadow: '0 10px 30px rgba(0,0,0,0.25)'
            }}
            aria-label="Join Vara's team"
          >
            Join Vara&apos;s team
          </Link>
        </div>
      </section>

      <footer className="site-footer" role="contentinfo" aria-label="Footer">
        <p className="footer-text">All rights are reserved to varamusic.com</p>
        {/* Removed the 'Team' footer link as requested */}
      </footer>
    </main>
  )
}