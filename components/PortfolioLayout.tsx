import { useState } from 'react';
import { AnimatedTextPortfolio } from './AnimatedTextPortfolio';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  Download,
  Moon,
  Sun,
  Code,
  Palette,
  Zap
} from 'lucide-react';

export function PortfolioLayout() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [animationStyle, setAnimationStyle] = useState<'blink' | 'wave' | 'wind' | 'rain'>('blink');

  const skills = [
    'React', 'TypeScript', 'Next.js', 'Node.js', 'Python', 'Figma', 
    'Tailwind CSS', 'GraphQL', 'MongoDB', 'AWS', 'Git', 'Docker'
  ];

  const projects = [
    {
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with React, Node.js, and Stripe integration',
      tech: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      link: '#',
      github: '#'
    },
    {
      title: 'Task Management App',
      description: 'Collaborative task management with real-time updates and team features',
      tech: ['Next.js', 'TypeScript', 'Prisma', 'Socket.io'],
      link: '#',
      github: '#'
    },
    {
      title: 'Design System',
      description: 'Component library and design system for consistent UI development',
      tech: ['React', 'Storybook', 'Tailwind', 'Figma'],
      link: '#',
      github: '#'
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Animated Background */}
      <AnimatedTextPortfolio
        highlightWords={['CREATIVE', 'DEVELOPER', 'DESIGNER']}
        animationStyle={animationStyle}
        animationSpeed={40}
        backgroundOpacity={isDarkMode ? 20 : 15}
        isDarkMode={isDarkMode}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="fixed top-0 w-full backdrop-blur-md bg-opacity-80 border-b border-opacity-20 z-50">
          <div className={`container mx-auto px-6 py-4 flex justify-between items-center ${
            isDarkMode ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-gray-200'
          }`}>
            <h1 className="font-bold text-xl">Your Name</h1>
            
            <div className="flex items-center gap-4">
              {/* Animation Style Selector */}
              <div className="hidden md:flex gap-1">
                {(['blink', 'wave', 'wind', 'rain'] as const).map((style) => (
                  <Button
                    key={style}
                    variant={animationStyle === style ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setAnimationStyle(style)}
                    className="capitalize text-xs"
                  >
                    {style}
                  </Button>
                ))}
              </div>
              
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDarkMode(!isDarkMode)}
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <div className={`backdrop-blur-sm rounded-2xl p-8 ${
              isDarkMode ? 'bg-gray-800/30' : 'bg-white/30'
            } border border-opacity-20 ${
              isDarkMode ? 'border-gray-600' : 'border-gray-300'
            }`}>
              <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Full Stack Developer
              </h2>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Creating beautiful, functional, and user-centered digital experiences
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-blue-400" />
                  <span>Developer</span>
                </div>
                <div className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-purple-400" />
                  <span>Designer</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  <span>Innovator</span>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <Mail className="h-4 w-4 mr-2" />
                  Get In Touch
                </Button>
                <Button variant="outline" size="lg">
                  <Download className="h-4 w-4 mr-2" />
                  Download CV
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-4xl">
            <h3 className="text-3xl font-bold text-center mb-12">Skills & Technologies</h3>
            <div className={`backdrop-blur-sm rounded-2xl p-8 ${
              isDarkMode ? 'bg-gray-800/30' : 'bg-white/30'
            } border border-opacity-20 ${
              isDarkMode ? 'border-gray-600' : 'border-gray-300'
            }`}>
              <div className="flex flex-wrap gap-3 justify-center">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-sm py-2 px-4">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <h3 className="text-3xl font-bold text-center mb-12">Featured Projects</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <Card key={index} className={`p-6 backdrop-blur-sm ${
                  isDarkMode ? 'bg-gray-800/30 border-gray-600' : 'bg-white/30 border-gray-300'
                } border-opacity-20 hover:scale-105 transition-transform duration-300`}>
                  <h4 className="font-bold text-xl mb-3">{project.title}</h4>
                  <p className="opacity-80 mb-4">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Live
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Github className="h-3 w-3 mr-1" />
                      Code
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <div className={`backdrop-blur-sm rounded-2xl p-8 ${
              isDarkMode ? 'bg-gray-800/30' : 'bg-white/30'
            } border border-opacity-20 ${
              isDarkMode ? 'border-gray-600' : 'border-gray-300'
            }`}>
              <h3 className="text-3xl font-bold mb-6">Let's Work Together</h3>
              <p className="text-xl mb-8 opacity-90">
                Have a project in mind? Let's create something amazing together.
              </p>
              
              <div className="flex justify-center gap-4">
                <Button variant="outline" size="lg">
                  <Github className="h-5 w-5 mr-2" />
                  GitHub
                </Button>
                <Button variant="outline" size="lg">
                  <Linkedin className="h-5 w-5 mr-2" />
                  LinkedIn
                </Button>
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <Mail className="h-5 w-5 mr-2" />
                  Email Me
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={`py-8 px-6 border-t border-opacity-20 ${
          isDarkMode ? 'border-gray-700' : 'border-gray-300'
        }`}>
          <div className="container mx-auto text-center opacity-60">
            <p>&copy; 2025 Your Name. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}