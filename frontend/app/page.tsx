import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Nav */}
      <nav className="w-full px-6 md:px-12 py-5 flex items-center justify-between">
        <span className="font-serif text-2xl text-primary tracking-tight">
          Campus Compass
        </span>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
          <a href="#features" className="hover:text-primary transition-colors">
            Features
          </a>
          <a href="#how" className="hover:text-primary transition-colors">
            How It Works
          </a>
          <a href="#about" className="hover:text-primary transition-colors">
            About
          </a>
        </div>
        <Link
          href="/chat"
          className="bg-primary text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-primary-light transition-colors"
        >
          Get Started
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto py-20 md:py-32">
        <h1 className="font-serif text-5xl md:text-7xl text-primary leading-tight">
          Discover everything{" "}
          <span className="dm-serif-display-regular-italic">your campus</span>{" "}
          has to offer.
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-500 max-w-2xl leading-relaxed">
          An intelligent assistant that connects you with labs, professors,
          services, and opportunities — all tailored to your interests.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            href="/chat"
            className="bg-primary text-white font-medium px-8 py-3.5 rounded-full text-lg hover:bg-primary-light transition-colors"
          >
            Start Chatting
          </Link>
          <a
            href="#how"
            className="border-2 border-primary text-primary font-medium px-8 py-3.5 rounded-full text-lg hover:bg-primary hover:text-white transition-colors"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-accent py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-primary text-center mb-14">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                step: "01",
                title: "Tell us your interests",
                desc: "Share what you're curious about — research areas, career goals, or support needs.",
              },
              {
                step: "02",
                title: "Get personalized matches",
                desc: "Our AI searches curated campus resources and returns the most relevant results.",
              },
              {
                step: "03",
                title: "Explore and connect",
                desc: "View details, ask follow-up questions, and draft outreach emails — all in chat.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center md:text-left">
                <div className="text-primary font-serif text-5xl opacity-20 mb-2">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg text-primary mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-primary text-center mb-14">
            Features
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Smart Search",
                desc: "Find labs, professors, and services by describing what you need in plain language.",
              },
              {
                title: "Personalized Recommendations",
                desc: "Results ranked by relevance to your specific interests and goals.",
              },
              {
                title: "AI-Powered Q&A",
                desc: "Ask detailed questions about any resource and get grounded, helpful answers.",
              },
              {
                title: "Email Drafting",
                desc: "Generate polished outreach emails to professors and labs in seconds.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-lg text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="bg-primary text-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-6">
            Built for students, by students.
          </h2>
          <p className="text-lg text-white/70 leading-relaxed">
            Campus Compass was built during a hackathon to solve a real problem:
            navigating the overwhelming number of resources at a university.
            Powered by AWS and AI, it makes discovery effortless.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Campus Compass &middot; Built with
        Next.js, Tailwind CSS, and AWS
      </footer>
    </div>
  );
}
