function Landing({ onGetStarted }) {
    return (
        <div data-name="landing-container" className="landing-container min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
            <div data-name="landing-content" className="text-center z-10 relative">
                <div data-name="logo-container" className="mb-8">
                    <div className="neon-circle-large">
                        <div className="neon-circle-inner">
                            <i className="fas fa-wave-square text-6xl neon-icon"></i>
                        </div>
                    </div>
                </div>
                <h1 data-name="landing-title" className="text-5xl font-bold mb-4 neon-text-enhanced">
                    WellWave
                </h1>
                <p data-name="landing-subtitle" className="text-xl mb-12 text-blue-200 flicker-text-enhanced">
                    Your Personal Medical AI Assistant
                </p>

                <div className="features-grid">
                    <div className="feature-card">
                        <i className="fas fa-brain neon-icon-small"></i>
                        <h3>AI Powered</h3>
                        <p>Advanced medical intelligence</p>
                    </div>
                    <div className="feature-card">
                        <i className="fas fa-heartbeat neon-icon-small"></i>
                        <h3>Health Monitoring</h3>
                        <p>Real-time health tracking</p>
                    </div>
                    <div className="feature-card">
                        <i className="fas fa-shield-virus neon-icon-small"></i>
                        <h3>Secure & Private</h3>
                        <p>Your data is protected</p>
                    </div>
                    <div className="feature-card">
                        <i className="fas fa-comments neon-icon-small"></i>
                        <h3>24/7 Support</h3>
                        <p>Always here for you</p>
                    </div>
                </div>

                <button
                    data-name="get-started-button"
                    onClick={onGetStarted}
                    className="neon-button-enhanced mt-12"
                >
                    Get Started
                    <span className="neon-button-glow"></span>
                    <i className="fas fa-arrow-right ml-2"></i>
                </button>
            </div>

            {/* Animated Background Elements */}
            <div className="neon-grid-enhanced"></div>
            <div className="cyber-particles">
                {[...Array(30)].map((_, i) => (
                    <div key={i} className="cyber-particle"></div>
                ))}
            </div>
            <div className="corner-decorations">
                <div className="corner-decoration top-left"></div>
                <div className="corner-decoration top-right"></div>
                <div className="corner-decoration bottom-left"></div>
                <div className="corner-decoration bottom-right"></div>
            </div>
        </div>
    );
}
