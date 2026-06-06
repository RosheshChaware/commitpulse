'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import {
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Code,
  Globe,
  Sparkles,
} from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─── Project Interface ─── */
export interface ShowcaseProject {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
  accentColor: string;
  icon: string;
}

/* ─── Preseeded Default Projects ─── */
const DEFAULT_PROJECTS: ShowcaseProject[] = [
  {
    id: 'default-1',
    name: 'DevBoard',
    description:
      'Full-stack developer dashboard for tracking coding metrics, contribution heatmaps, and team velocity with real-time WebSocket updates.',
    techStack: ['Next.js', 'TypeScript', 'Prisma'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    accentColor: '#10b981',
    icon: '📊',
  },
  {
    id: 'default-2',
    name: 'GitFlow Analytics',
    description:
      'Beautiful visual analytics for Git repository workflows. Interactive D3 charts reveal commit patterns, PR cycles, and branch topology.',
    techStack: ['React', 'D3.js', 'Node.js'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    accentColor: '#8b5cf6',
    icon: '📈',
  },
  {
    id: 'default-3',
    name: 'CodeVault',
    description:
      'Secure, versioned code snippet manager with syntax highlighting, team sharing, and end-to-end encryption for sensitive configurations.',
    techStack: ['TypeScript', 'MongoDB', 'Docker'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    accentColor: '#06b6d4',
    icon: '🔐',
  },
];

const ACCENT_COLORS = ['#10b981', '#8b5cf6', '#06b6d4', '#f43f5e', '#f59e0b', '#3b82f6'];
const ICONS = ['📊', '📈', '🔐', '🎨', '☁️', '🧠', '🚀', '🛠️', '💻', '⚡'];

/* ─── GitHub Icon Component ─── */
function GitHubIcon() {
  return (
    <svg height="14" width="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

/* ─── Real-time Preview Project Card Component ─── */
function ProjectCard({
  project,
  isEditing = false,
  onClick,
}: {
  project: ShowcaseProject;
  isEditing?: boolean;
  onClick?: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);

  /* Magnetic 3D tilt + cursor spotlight on hover */
  useEffect(() => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHoveredRef.current) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      gsap.to(card, {
        rotateX,
        rotateY,
        duration: 0.4,
        ease: 'power2.out',
        transformPerspective: 600,
      });

      gsap.to(glow, {
        x: x - rect.width / 2,
        y: y - rect.height / 2,
        opacity: 0.12,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      gsap.to(card, { scale: 1.03, duration: 0.4, ease: 'power2.out' });
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
      });
      gsap.to(glow, { opacity: 0, duration: 0.3 });
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={`relative flex-shrink-0 w-[300px] sm:w-[320px] select-none ${
        onClick ? 'cursor-pointer' : ''
      }`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div
        className={`group relative overflow-hidden rounded-2xl border bg-white/70 p-6 shadow-lg backdrop-blur-xl transition-all duration-300 flex flex-col h-[280px] ${
          isEditing
            ? 'border-purple-500/50 shadow-[0_0_25px_rgba(139,92,246,0.15)] bg-purple-500/[0.02] dark:bg-purple-500/[0.04]'
            : 'border-black/5 dark:border-white/[0.08] bg-white/70 dark:bg-[#0c0c0c]/90'
        } dark:shadow-2xl dark:shadow-black/40 hover:border-black/10 dark:hover:border-white/15`}
      >
        {/* Spotlight glow */}
        <div
          ref={glowRef}
          className="absolute pointer-events-none rounded-full"
          style={{
            width: 240,
            height: 240,
            background: `radial-gradient(circle, ${project.accentColor || '#8b5cf6'}30, transparent 70%)`,
            opacity: 0,
            filter: 'blur(35px)',
            transform: 'translate(-50%, -50%)',
            left: '50%',
            top: '50%',
          }}
        />

        {/* Background gradient blob */}
        <div
          className="absolute -right-16 -top-16 h-32 w-32 rounded-full blur-3xl transition-all duration-700 group-hover:scale-150"
          style={{ background: `${project.accentColor || '#8b5cf6'}10` }}
        />

        {/* Icon + Project Name */}
        <div className="relative z-10 flex items-center gap-3 mb-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl text-lg shadow-lg ring-1 ring-white/10"
            style={{
              background: `linear-gradient(135deg, ${project.accentColor || '#8b5cf6'}cc, ${project.accentColor || '#8b5cf6'}88)`,
              boxShadow: `0 4px 15px ${project.accentColor || '#8b5cf6'}30`,
            }}
          >
            {project.icon || '🚀'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white tracking-tight truncate">
              {project.name || 'Untitled Project'}
            </h3>
          </div>
          {isEditing && (
            <span className="text-[9px] uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20 animate-pulse">
              Live Editing
            </span>
          )}
        </div>

        {/* Description */}
        <p className="relative z-10 text-xs leading-relaxed text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
          {project.description ||
            'Provide a compelling description of your project to capture attention...'}
        </p>

        {/* Tech Stack Badges */}
        <div className="relative z-10 flex flex-wrap gap-1.5 mb-4 overflow-hidden h-[24px]">
          {project.techStack && project.techStack.length > 0 ? (
            project.techStack.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider transition-colors duration-300 whitespace-nowrap"
                style={{
                  color: project.accentColor || '#8b5cf6',
                  background: `${project.accentColor || '#8b5cf6'}12`,
                  border: `1px solid ${project.accentColor || '#8b5cf6'}25`,
                }}
              >
                {tech}
              </span>
            ))
          ) : (
            <span className="text-[10px] italic text-gray-400">No tech badges added yet</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 flex items-center gap-2 mt-auto">
          <a
            href={project.githubUrl || '#'}
            target={project.githubUrl ? '_blank' : '_self'}
            rel="noopener noreferrer"
            onClick={(e) => !project.githubUrl && e.preventDefault()}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-semibold transition-all duration-300 hover:scale-[1.03] ${
              project.githubUrl
                ? 'border-black/10 bg-white/80 hover:bg-white hover:border-black/20 dark:border-white/10 dark:bg-white/5 text-gray-700 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:border-white/20'
                : 'opacity-40 cursor-not-allowed border-black/5 dark:border-white/5 text-gray-400 dark:text-gray-600'
            }`}
            aria-label={`View ${project.name} on GitHub`}
          >
            <GitHubIcon />
            GitHub
          </a>
          <a
            href={project.liveUrl || '#'}
            target={project.liveUrl ? '_blank' : '_self'}
            rel="noopener noreferrer"
            onClick={(e) => !project.liveUrl && e.preventDefault()}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:opacity-90 shadow-sm ${
              project.liveUrl ? '' : 'opacity-40 cursor-not-allowed pointer-events-none'
            }`}
            style={{
              background: `linear-gradient(135deg, ${project.accentColor || '#8b5cf6'}, ${project.accentColor || '#8b5cf6'}cc)`,
              boxShadow: `0 2px 10px ${project.accentColor || '#8b5cf6'}30`,
            }}
            aria-label={`View ${project.name} live demo`}
          >
            <ExternalLink size={12} />
            Live Demo
          </a>
        </div>

        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-700 ease-out"
          style={{
            background: `linear-gradient(90deg, transparent, ${project.accentColor || '#8b5cf6'}, transparent)`,
          }}
        />
      </div>
    </div>
  );
}

/* ─── Main Showcase Builder Component ─── */
export function ShowcaseBuilder() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const builderRef = useRef<HTMLDivElement>(null);

  const [projects, setProjects] = useState<ShowcaseProject[]>([]);
  const [activeIdx, setActiveIdx] = useState<number>(0);

  /* Carousel scrolling button states */
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  /* Load projects from localStorage or default list */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('commitpulse:showcase-projects');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setProjects(parsed);
            return;
          }
        } catch {
          // Fallback to default
        }
      }
      setProjects(DEFAULT_PROJECTS);
    }
  }, []);

  /* Save projects to localStorage on change */
  const saveProjects = (updatedProjects: ShowcaseProject[]) => {
    setProjects(updatedProjects);
    localStorage.setItem('commitpulse:showcase-projects', JSON.stringify(updatedProjects));
  };

  /* Get currently edited project profile */
  const activeProject = projects[activeIdx] || {
    id: 'temp',
    name: '',
    description: '',
    techStack: [],
    githubUrl: '',
    liveUrl: '',
    accentColor: '#8b5cf6',
    icon: '🚀',
  };

  /* Form change handler */
  const handleFormChange = (key: keyof ShowcaseProject, value: string | string[]) => {
    const updated = projects.map((p, idx) => {
      if (idx === activeIdx) {
        return { ...p, [key]: value };
      }
      return p;
    });
    saveProjects(updated);
  };

  /* Special handler for Tech Stack (splits by comma and cleans up) */
  const handleTechChange = (val: string) => {
    const split = val
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    handleFormChange('techStack', split);
  };

  /* Add project action */
  const handleAddProject = () => {
    const newProject: ShowcaseProject = {
      id: `custom-${Date.now()}`,
      name: 'My New Project',
      description: 'A brief description introducing this custom repository or web application.',
      techStack: ['React', 'Next.js'],
      githubUrl: 'https://github.com',
      liveUrl: 'https://example.com',
      accentColor: ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)],
      icon: ICONS[Math.floor(Math.random() * ICONS.length)],
    };
    const updated = [...projects, newProject];
    saveProjects(updated);
    setActiveIdx(updated.length - 1);
  };

  /* Remove project action */
  const handleRemoveProject = () => {
    if (projects.length <= 1) {
      alert('You must keep at least one project in the showcase.');
      return;
    }
    const updated = projects.filter((_, idx) => idx !== activeIdx);
    saveProjects(updated);
    setActiveIdx(Math.max(0, activeIdx - 1));
  };

  /* Update carousel controls */
  const updateScrollButtons = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    updateScrollButtons();
    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    window.addEventListener('resize', updateScrollButtons);

    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [updateScrollButtons, projects]);

  const scrollBy = useCallback((direction: 'left' | 'right') => {
    const el = carouselRef.current;
    if (!el) return;
    const cardWidth = 340; // card width + gap
    el.scrollBy({
      left: direction === 'left' ? -cardWidth : cardWidth,
      behavior: 'smooth',
    });
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        scrollBy('left');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        scrollBy('right');
      }
    },
    [scrollBy]
  );

  /* Entrance animations via GSAP */
  useEffect(() => {
    if (
      !sectionRef.current ||
      !headingRef.current ||
      !subheadingRef.current ||
      !badgeRef.current ||
      !builderRef.current
    )
      return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      tl.fromTo(
        badgeRef.current,
        { y: 30, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)' }
      );

      tl.fromTo(
        headingRef.current,
        { y: 50, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
        {
          y: 0,
          opacity: 1,
          clipPath: 'inset(0 0 0% 0)',
          duration: 0.8,
          ease: 'power3.out',
        },
        '-=0.3'
      );

      tl.fromTo(
        subheadingRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.4'
      );

      tl.fromTo(
        builderRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.3'
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 -mx-6 overflow-hidden">
      {/* ── Background Blobs ── */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full bg-purple-500/[0.03] blur-[130px]" />
        <div className="absolute -left-[5%] top-[20%] h-[350px] w-[350px] rounded-full bg-emerald-500/[0.03] blur-[110px]" />
        <div className="absolute -right-[5%] bottom-[10%] h-[400px] w-[400px] rounded-full bg-cyan-500/[0.03] blur-[110px]" />
      </div>

      {/* ── Header ── */}
      <div className="text-center mb-14 px-6">
        <div ref={badgeRef} className="inline-block mb-6" style={{ opacity: 0 }}>
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-gray-600 shadow-sm dark:border-white/10 dark:bg-[#0a0a0a]/80 dark:text-white/70">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
            </span>
            Interactive Showcase Builder
          </div>
        </div>

        <div ref={headingRef} style={{ opacity: 0 }}>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            <span className="bg-gradient-to-br from-gray-900 via-black to-gray-600 dark:from-white dark:via-gray-100 dark:to-gray-500 bg-clip-text text-transparent">
              Build Your{' '}
            </span>
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-500 to-purple-500 bg-clip-text text-transparent">
              Project Showcase
            </span>
            <span className="inline-block ml-2 text-4xl md:text-6xl">🚀</span>
          </h2>
        </div>

        <p
          ref={subheadingRef}
          className="mx-auto max-w-xl text-sm sm:text-base leading-relaxed text-gray-500 dark:text-white/55"
          style={{ opacity: 0 }}
        >
          Add your custom projects, edit metadata in real-time, customize styling, and watch your
          profile showcase update dynamically.
        </p>
      </div>

      {/* ── Main Dynamic Builder Workspace ── */}
      <div ref={builderRef} className="max-w-5xl mx-auto px-6 mb-16" style={{ opacity: 0 }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start rounded-3xl border border-black/5 bg-white/60 p-6 md:p-8 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-[#0a0a0a]/80 dark:shadow-2xl dark:shadow-black/50">
          {/* LEFT COLUMN: Input Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/5 dark:border-white/5 pb-4">
              <div>
                <h3 className="text-base font-bold text-gray-950 dark:text-white flex items-center gap-2">
                  <Sparkles size={16} className="text-purple-400" />
                  Showcase Configuration
                </h3>
                <p className="text-xs text-gray-500 dark:text-zinc-500 mt-0.5">
                  Update active project characteristics dynamically below.
                </p>
              </div>

              {/* Add & Delete Project Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddProject}
                  className="flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black hover:opacity-95 text-[11px] font-bold py-1.5 px-3 rounded-lg shadow transition duration-200 cursor-pointer active:scale-95"
                >
                  <Plus size={12} />
                  Add Project
                </button>
                <button
                  onClick={handleRemoveProject}
                  disabled={projects.length <= 1}
                  className={`flex items-center gap-1 border border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10 text-[11px] font-bold py-1.5 px-3 rounded-lg transition duration-200 ${
                    projects.length <= 1
                      ? 'opacity-40 cursor-not-allowed'
                      : 'cursor-pointer active:scale-95'
                  }`}
                >
                  <Trash2 size={12} />
                  Remove
                </button>
              </div>
            </div>

            {/* List / Tabs of Added Projects */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-black/5 dark:border-white/5">
              {projects.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setActiveIdx(idx)}
                  className={`flex-shrink-0 text-xs font-semibold py-1.5 px-3 rounded-lg transition-all duration-300 border cursor-pointer ${
                    idx === activeIdx
                      ? 'border-purple-500/30 bg-purple-500/10 text-purple-400 font-bold'
                      : 'border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-black/10 dark:hover:bg-white/10'
                  }`}
                >
                  {p.icon} {p.name || 'Untitled'}
                </button>
              ))}
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Project Icon & Title */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-3 sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Icon
                  </label>
                  <select
                    value={activeProject.icon}
                    onChange={(e) => handleFormChange('icon', e.target.value)}
                    className="w-full rounded-xl border border-black/10 bg-white/50 px-3 py-3 text-sm text-black outline-none transition dark:border-white/10 dark:bg-black/40 dark:text-white focus:ring-1 focus:ring-purple-500"
                  >
                    {ICONS.map((i) => (
                      <option key={i} value={i} className="dark:bg-black">
                        {i}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-9 sm:col-span-10">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={activeProject.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    placeholder="Enter project name..."
                    maxLength={32}
                    className="w-full rounded-xl border border-black/10 bg-white/50 px-4 py-3 text-sm text-black outline-none transition dark:border-white/10 dark:bg-black/40 dark:text-white focus:ring-1 focus:ring-purple-500 shadow-inner"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Short Description
                </label>
                <textarea
                  value={activeProject.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  placeholder="Provide a compelling description of what this project accomplishes..."
                  maxLength={160}
                  rows={3}
                  className="w-full rounded-xl border border-black/10 bg-white/50 px-4 py-3 text-sm text-black outline-none transition dark:border-white/10 dark:bg-black/40 dark:text-white focus:ring-1 focus:ring-purple-500 shadow-inner resize-none"
                />
                <div className="text-[10px] text-right text-gray-400 mt-1">
                  {activeProject.description.length}/160 characters
                </div>
              </div>

              {/* Tech Stack Comma Separated */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1.5">
                  <Code size={12} />
                  Tech Stack (Comma-separated)
                </label>
                <input
                  type="text"
                  value={activeProject.techStack.join(', ')}
                  onChange={(e) => handleTechChange(e.target.value)}
                  placeholder="React, TypeScript, Next.js, Tailwind"
                  className="w-full rounded-xl border border-black/10 bg-white/50 px-4 py-3 text-sm text-black outline-none transition dark:border-white/10 dark:bg-black/40 dark:text-white focus:ring-1 focus:ring-purple-500 shadow-inner"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  Separate tags with commas. E.g.: <strong>Next.js, TypeScript, CSS</strong>
                </p>
              </div>

              {/* URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1.5">
                    <GitHubIcon />
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={activeProject.githubUrl}
                    onChange={(e) => handleFormChange('githubUrl', e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full rounded-xl border border-black/10 bg-white/50 px-4 py-3 text-sm text-black outline-none transition dark:border-white/10 dark:bg-black/40 dark:text-white focus:ring-1 focus:ring-purple-500 shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1.5">
                    <Globe size={12} />
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={activeProject.liveUrl}
                    onChange={(e) => handleFormChange('liveUrl', e.target.value)}
                    placeholder="https://example.com"
                    className="w-full rounded-xl border border-black/10 bg-white/50 px-4 py-3 text-sm text-black outline-none transition dark:border-white/10 dark:bg-black/40 dark:text-white focus:ring-1 focus:ring-purple-500 shadow-inner"
                  />
                </div>
              </div>

              {/* Theme / Accent Color picker */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Project Accent Color
                </label>
                <div className="flex gap-3 flex-wrap">
                  {ACCENT_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => handleFormChange('accentColor', c)}
                      className={`h-6 w-6 rounded-full border-2 transition-transform duration-200 cursor-pointer ${
                        activeProject.accentColor === c
                          ? 'scale-125 border-gray-900 dark:border-white shadow'
                          : 'border-transparent hover:scale-110'
                      }`}
                      style={{ backgroundColor: c }}
                      aria-label={`Select accent color ${c}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Live Card Preview */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center h-full pt-6 lg:pt-0 lg:pl-6 lg:border-l border-black/5 dark:border-white/5">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 self-center lg:self-start">
              Live Card Preview
            </h4>
            <div className="w-full flex items-center justify-center p-2">
              <ProjectCard project={activeProject as ShowcaseProject} isEditing={true} />
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-4 max-w-[280px]">
              Hover over the preview card to experience the responsive 3D parallax tilt and lighting
              glow.
            </p>
          </div>
        </div>
      </div>

      {/* ── Generated Showcase Gallery Carousel ── */}
      <div className="relative px-6">
        <div className="text-center mb-6">
          <span className="text-[10px] uppercase font-bold tracking-widest text-purple-400">
            Showcase Gallery
          </span>
          <h3 className="text-lg font-bold text-gray-950 dark:text-white">
            Your Generated Showcase ({projects.length} Projects)
          </h3>
        </div>

        {/* Carousel fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-12 sm:w-20 bg-gradient-to-r from-white dark:from-[#000000] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-12 sm:w-20 bg-gradient-to-l from-white dark:from-[#000000] to-transparent" />

        {/* Carousel buttons */}
        <button
          onClick={() => scrollBy('left')}
          disabled={!canScrollLeft}
          className={`hidden sm:flex absolute left-8 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/80 backdrop-blur-md shadow-lg transition-all duration-300 dark:border-white/10 dark:bg-[#0a0a0a]/80 cursor-pointer ${
            canScrollLeft
              ? 'hover:scale-110 hover:bg-white hover:border-black/20 dark:hover:bg-white/10 dark:hover:border-white/20 text-gray-700 dark:text-gray-300'
              : 'opacity-40 cursor-not-allowed text-gray-400 dark:text-gray-600'
          }`}
          aria-label="Scroll left"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          onClick={() => scrollBy('right')}
          disabled={!canScrollRight}
          className={`hidden sm:flex absolute right-8 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/80 backdrop-blur-md shadow-lg transition-all duration-300 dark:border-white/10 dark:bg-[#0a0a0a]/80 cursor-pointer ${
            canScrollRight
              ? 'hover:scale-110 hover:bg-white hover:border-black/20 dark:hover:bg-white/10 dark:hover:border-white/20 text-gray-700 dark:text-gray-300'
              : 'opacity-40 cursor-not-allowed text-gray-400 dark:text-gray-600'
          }`}
          aria-label="Scroll right"
        >
          <ChevronRight size={18} />
        </button>

        {/* Horizontal scroll track */}
        <div
          ref={carouselRef}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="region"
          aria-label="Dynamic projects showcase"
          className="flex gap-5 overflow-x-auto py-4 px-2 scroll-smooth focus:outline-none [&::-webkit-scrollbar]:hidden"
          style={{
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {projects.map((p, idx) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              style={{ scrollSnapAlign: 'start' }}
            >
              <ProjectCard
                project={p}
                isEditing={idx === activeIdx}
                onClick={() => {
                  setActiveIdx(idx);
                  // Scroll builder panel into view smoothly
                  builderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Mobile scroll points */}
        <div className="flex justify-center gap-1.5 mt-6 sm:hidden">
          {projects.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setActiveIdx(idx)}
              className={`h-2 w-2 rounded-full transition-colors ${
                idx === activeIdx ? 'bg-purple-500' : 'bg-gray-300 dark:bg-white/20'
              }`}
              aria-label={`Go to project ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
