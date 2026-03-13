"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FlaskConical, MessageSquare, Video, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Nav */}
      <nav className="w-full px-6 md:px-12 py-5 flex items-center justify-between">
        <span className="font-serif text-2xl text-primary tracking-tight">
          Atryn
        </span>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto py-20 md:py-32">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-serif text-5xl md:text-7xl text-primary leading-tight"
        >
          Discover research{" "}
          <span className="dm-serif-display-regular-italic">that matters</span>{" "}
          to you.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 text-lg md:text-xl text-gray-500 max-w-2xl leading-relaxed"
        >
          An intelligent assistant that connects you with labs and professors at
          U of T - all tailored to your research interests.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10"
        >
          <Link href="/register">
            <Button size="lg" className="rounded-full text-lg px-8 py-6 gap-2">
              Start Exploring
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="bg-accent py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-primary text-center mb-14">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                step: "01",
                icon: <MessageSquare className="w-6 h-6" />,
                title: "Tell us your interests",
                desc: "Share what you are curious about - research areas, topics, or specific professors.",
              },
              {
                step: "02",
                icon: <FlaskConical className="w-6 h-6" />,
                title: "Get personalized matches",
                desc: "Our AI searches research labs and returns the most relevant results for you.",
              },
              {
                step: "03",
                icon: <Video className="w-6 h-6" />,
                title: "Record and connect",
                desc: "Submit a quick video introduction to labs you are interested in joining.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center md:text-left"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 mx-auto md:mx-0">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-lg text-primary mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-primary text-center mb-14">
            Features
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "AI Research Chat",
                desc: "Find labs and professors by describing your research interests in plain language.",
              },
              {
                title: "Personalized Matches",
                desc: "Results ranked by relevance to your specific interests and academic background.",
              },
              {
                title: "Video Introductions",
                desc: "Record a quick video introduction to stand out when expressing interest in a lab.",
              },
              {
                title: "Track Applications",
                desc: "Monitor your submissions and see when professors shortlist your application.",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-lg text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
