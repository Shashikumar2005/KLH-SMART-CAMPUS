import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 80;

    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
        this.fadeDelay = Math.random() * 600;
        this.fadeStart = Date.now() + this.fadeDelay;
        this.fadingOut = false;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.speed = Math.random() * 0.5 + 0.1;
        this.opacity = 0;
        this.fadeDelay = Math.random() * 600;
        this.fadeStart = Date.now() + this.fadeDelay;
        this.fadingOut = false;
        this.radius = Math.random() * 2 + 1;
        
        const colors = [
          { r: 99, g: 102, b: 241 },   // indigo
          { r: 236, g: 72, b: 153 },   // pink
          { r: 139, g: 92, b: 246 },   // purple
          { r: 59, g: 130, b: 246 },   // blue
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.y -= this.speed;
        
        const now = Date.now();
        if (now > this.fadeStart) {
          if (!this.fadingOut) {
            this.opacity += 0.01;
            if (this.opacity >= 1) {
              this.fadingOut = true;
            }
          } else {
            this.opacity -= 0.005;
            if (this.opacity <= 0) {
              this.reset();
            }
          }
        }

        if (this.y < 0) {
          this.reset();
          this.y = canvas.height;
        }
      }

      draw() {
        if (this.opacity > 0) {
          ctx.beginPath();
          
          // Create gradient for glow effect
          const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.radius * 3
          );
          gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`);
          gradient.addColorStop(0.5, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity * 0.5})`);
          gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);
          
          ctx.fillStyle = gradient;
          ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
          ctx.fill();
          
          // Core particle
          ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Box
      ref={canvasRef}
      component="canvas"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

export default ParticleBackground;
