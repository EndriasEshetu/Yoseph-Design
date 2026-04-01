import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Award,
  BookOpen,
  Compass,
  Paintbrush,
  Target,
  Building2,
  ArrowRight,
  Sofa,
  Armchair,
  Box,
  LayoutTemplate,
  Palette,
  PenTool,
  Blocks,
  Sun,
  Scan,
  Image,
  Sparkles,
  Hexagon,
  Layers,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import yosephImage from '../assets/yoseph.png';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

/** Journey timeline: smooth in both directions (scroll down & scroll up) */
const timelineEaseOut = [0.22, 1, 0.36, 1] as const;
const timelineEaseIn = [0.4, 0, 0.2, 1] as const;

const timelineItemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.55,
      ease: timelineEaseIn,
    },
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.09,
      duration: 0.72,
      ease: timelineEaseOut,
    },
  }),
};

const timelineLineVariants = {
  hidden: {
    scaleY: 0,
    transformOrigin: '50% 0%',
    transition: { duration: 0.6, ease: timelineEaseIn },
  },
  visible: {
    scaleY: 1,
    transformOrigin: '50% 0%',
    transition: { duration: 1.05, ease: timelineEaseOut },
  },
};

const journeyViewport = {
  once: false as const,
  amount: 0.25,
  margin: '-10% 0px -10% 0px',
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const practiceAreas: { label: string; icon: LucideIcon }[] = [
  { label: 'Architectural design', icon: Building2 },
  { label: 'Interior design', icon: Sofa },
  { label: 'Furniture design', icon: Armchair },
  { label: '3D modeling & visualization', icon: Box },
  { label: 'Space planning', icon: LayoutTemplate },
  { label: 'Material selection', icon: Palette },
];

const softwareTools: { label: string; icon: LucideIcon }[] = [
  { label: 'AutoCAD', icon: PenTool },
  { label: 'Revit', icon: Blocks },
  { label: 'SketchUp', icon: Box },
  { label: 'Lumion', icon: Sun },
  { label: 'Enscape', icon: Scan },
  { label: 'Photoshop', icon: Image },
  { label: 'V-Ray', icon: Sparkles },
  { label: 'Rhino', icon: Hexagon },
  { label: 'Blender', icon: Layers },
];

const timeline = [
  { period: 'Foundation', title: 'Academic Studies', description: 'I built my foundation in architectural theory, structural engineering, and sustainable design principles.' },
  { period: 'Growth', title: 'Design Exploration', description: 'I deepened my expertise in interior and furniture design, merging Ethiopian craft traditions with global aesthetics.' },
  { period: 'Present', title: 'Yoseph Design Studio', description: 'I run a unified practice integrating architecture, interiors, and bespoke furniture under one creative vision.' },
  { period: 'Future', title: 'Expanding Impact', description: 'I aim to scale sustainable, culturally rooted design solutions across East Africa and beyond.' },
];

export const AboutPage = () => {
  return (
    <>
      {/* Profile & Essay — Enhanced */}
      <section className="pt-16 pb-20 md:pt-24 md:pb-28 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-50/40 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          {/* Section header */}
          <motion.div
            className="mb-14 md:mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-amber-500 block mb-3">
              About Me
            </span>
            <h1
              className="text-4xl md:text-5xl lg:text-[3.4rem] font-light text-neutral-800 leading-tight font-playfair"
            >
              The Architect Behind <br className="hidden md:block" />
              <span className="italic">the Vision</span>
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20 items-start">
            {/* Essay — Left */}
            <motion.div
              className="lg:col-span-3 order-2 lg:order-1"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
            >
              <div className="space-y-6 text-neutral-600 leading-[1.85] text-[15.5px]">
                <motion.p variants={fadeUp} custom={0}>
                  I&apos;m <span className="font-bold text-neutral-800">Yoseph Teferi</span>, an architect driven by the belief that design shapes human experience.
                  Rooted in Ethiopia, my work blends culture, functionality, and aesthetics creating
                  spaces that speak to both heritage and modernity.
                </motion.p>
                <motion.p variants={fadeUp} custom={1}>
                  My approach connects architecture with interior and furniture design, creating complete
                  spatial experiences rather than isolated objects. Every project begins with deep listening
                  understanding the people, the place, and the purpose—then translating that understanding
                  into form, material, and light.
                </motion.p>
                <motion.p variants={fadeUp} custom={2}>
                  Inspired by local craftsmanship and global modernism, I design spaces and objects
                  that feel both timeless and contemporary. My furniture pieces draw from Ethiopian woodworking
                  traditions, mid-century proportions, and Scandinavian restraint each conceived as part of
                  a larger spatial story.
                </motion.p>
                <motion.p variants={fadeUp} custom={3}>
                  I&apos;m passionate about solving real-world challenges through sustainable, human-centered
                  design solutions from affordable housing to thoughtful commercial interiors that elevate
                  daily life.
                </motion.p>
              </div>

              {/* Inline CTA */}
              <motion.div
                variants={fadeUp}
                custom={4}
                className="mt-10 flex flex-wrap gap-4"
              >
                <Link
                  to="/studio"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  View Studio Work
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-neutral-300 text-neutral-700 text-sm font-medium rounded-lg hover:border-amber-400 hover:text-amber-600 transition-colors"
                >
                  Get in Touch
                </Link>
              </motion.div>
            </motion.div>

            {/* Image & Quick Info — Right */}
            <motion.div
              className="lg:col-span-2 order-1 lg:order-2 lg:sticky lg:top-28"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="relative">
                <div className="absolute -inset-3 bg-gradient-to-br from-amber-100/60 via-transparent to-neutral-100/60 rounded-[1.4rem] blur-sm" />
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-100 shadow-2xl ring-1 ring-black/5">
                  <img
                    src={yosephImage}
                    alt="Yoseph Teferi — Architect & Designer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <p className="text-white text-2xl font-bold tracking-tight">Yoseph Teferi</p>
                    <p className="text-white/80 text-sm uppercase tracking-widest mt-1">Architect & Designer</p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-10 grid grid-cols-2 gap-3">
                {[
                  { label: 'Focus', value: 'Architecture' },
                  { label: 'Passion', value: 'Furniture' },
                  { label: 'Craft', value: 'Interior' },
                  { label: 'Based in', value: 'Ethiopia' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-neutral-50 rounded-xl p-4 text-center border border-neutral-100 hover:border-amber-200 transition-colors group">
                    <p className="text-lg font-bold text-neutral-800 group-hover:text-amber-600 transition-colors">{stat.value}</p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-20 md:py-28 bg-neutral-900 text-white relative overflow-hidden scroll-mt-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(245,158,11,0.08),_transparent_60%)]" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={journeyViewport}
            transition={{ duration: 0.65, ease: timelineEaseOut }}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-amber-400 block mb-4">
              The Path
            </span>
            <h2
              className="text-3xl md:text-4xl font-light font-playfair"
            >
              My Journey
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto relative min-h-[200px]">
            {/* Vertical line — draws in smoothly with scroll */}
            <motion.div
              className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-neutral-700 md:-translate-x-px origin-top"
              initial="hidden"
              whileInView="visible"
              viewport={journeyViewport}
              variants={timelineLineVariants}
              aria-hidden
            />

            {timeline.map((item, i) => (
              <motion.div
                key={item.period}
                className={`relative flex flex-col md:flex-row items-start gap-6 md:gap-12 mb-14 last:mb-0 ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
                initial="hidden"
                whileInView="visible"
                viewport={journeyViewport}
                variants={timelineItemVariants}
                custom={i}
              >
                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 top-1 w-3 h-3 rounded-full bg-amber-500 ring-4 ring-neutral-900 -translate-x-1.5 md:-translate-x-1.5 z-10" />

                {/* Content */}
                <div className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-400">{item.period}</span>
                  <h3 className="text-xl font-semibold mt-1 mb-2">{item.title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Pillars — Enhanced */}
      <section className="py-20 md:py-28 bg-neutral-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-400 block mb-4">
              What Drives Me
            </span>
            <h2
              className="text-3xl md:text-4xl font-light text-neutral-800 font-playfair"
            >
              Core Pillars
            </h2>
            <p className="mt-4 text-neutral-500 text-sm max-w-xl mx-auto leading-relaxed">
              Six fundamental principles that guide every design decision, from the first sketch to the finished space.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Building2,
                title: 'Architecture',
                text: 'A holistic approach to building design that balances form, function, and cultural context creating structures that serve communities and stand the test of time.',
                accent: 'from-amber-500 to-orange-500',
              },
              {
                icon: Paintbrush,
                title: 'Furniture Design',
                text: 'Handcrafted and custom-designed furniture that merges Ethiopian craftsmanship with contemporary aesthetics, treating every piece as both art and utility.',
                accent: 'from-amber-500 to-yellow-500',
              },
              {
                icon: Compass,
                title: 'Interior Design',
                text: 'Thoughtfully curated interiors where material, light, and spatial flow come together to create environments that feel personal, warm, and intentional.',
                accent: 'from-orange-500 to-amber-500',
              },
              {
                icon: BookOpen,
                title: 'Academic Foundation',
                text: 'Grounded in rigorous study of architectural theory, structural engineering, and sustainable design, with a commitment to lifelong learning.',
                accent: 'from-yellow-500 to-amber-500',
              },
              {
                icon: Target,
                title: 'Vision & Goals',
                text: 'Building a unified design practice that integrates architecture, interiors, and furniture  celebrating Ethiopian heritage while embracing global innovation.',
                accent: 'from-amber-600 to-orange-500',
              },
              {
                icon: Award,
                title: 'Design Philosophy',
                text: 'Every project tells a story. I believe great design is not decoration but a deeply human act shaping how we live, work, and connect.',
                accent: 'from-orange-500 to-yellow-500',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-100 hover:border-amber-200 relative overflow-hidden"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="w-14 h-14 rounded-xl bg-amber-50 flex items-center justify-center mb-6 group-hover:bg-amber-100 transition-colors">
                  <item.icon size={24} className="text-amber-500" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-neutral-800">{item.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills — practice areas & software (no proficiency percentages) */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="text-center max-w-2xl mx-auto mb-14"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-400 block mb-4">
                Expertise
              </span>
              <h2
                className="text-3xl md:text-4xl font-light text-neutral-800 mb-5 font-playfair"
              >
                Practice & Tools
              </h2>
              <p className="text-neutral-500 leading-relaxed text-[15px]">
                Work spans architecture, interiors, and furniture  from concept sketches and spatial planning
                to detailed documentation and visualization. Below are the main areas of practice and the
                software used day to day.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={staggerContainer}
              >
                <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-800 mb-5">
                  Areas of practice
                </h3>
                <ul className="space-y-4">
                  {practiceAreas.map((area, i) => (
                    <motion.li
                      key={area.label}
                      variants={fadeUp}
                      custom={i}
                      className="flex items-center gap-4 rounded-xl border border-neutral-100 bg-neutral-50/80 px-4 py-3.5 transition-colors hover:border-amber-200 hover:bg-amber-50/30"
                    >
                      <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-amber-600 shadow-sm ring-1 ring-neutral-100"
                        aria-hidden
                      >
                        <area.icon size={22} strokeWidth={1.75} />
                      </span>
                      <span className="text-[15px] font-medium text-neutral-700 leading-snug">
                        {area.label}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={staggerContainer}
              >
                <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-800 mb-5">
                  Software & visualization
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {softwareTools.map((tool, i) => (
                    <motion.div
                      key={tool.label}
                      variants={fadeUp}
                      custom={i}
                      className="flex flex-col items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-4 text-center transition-colors hover:border-amber-300 hover:shadow-sm"
                    >
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600"
                        aria-hidden
                      >
                        <tool.icon size={20} strokeWidth={1.75} />
                      </span>
                      <span className="text-xs font-semibold text-neutral-700 leading-tight">
                        {tool.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote — Enhanced */}
      <section className="py-28 md:py-36 bg-neutral-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] about-quote-bg" />
        <div className="container mx-auto px-4 text-center max-w-3xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-400 block mb-8">
              Philosophy
            </span>
            <div className="text-6xl text-amber-300 font-serif mb-4 leading-none">"</div>
            <blockquote
              className="text-2xl md:text-3xl lg:text-4xl font-light italic leading-snug text-neutral-800 font-playfair"
            >
              Architecture is not just about buildings. It is about the lives that unfold within them,
              the stories they hold, and the futures they inspire.
            </blockquote>
            <div className="mt-10 flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-200">
                <img src={yosephImage} alt="Yoseph" className="w-full h-full object-cover" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-neutral-800">Yoseph Teferi</p>
                <p className="text-xs text-neutral-400 uppercase tracking-widest">Architect & Designer</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};
