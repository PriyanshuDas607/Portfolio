
import React, { useEffect, useRef } from 'react';

const LiquidBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width: number;
    let height: number;

    const particles: {
      x: number;
      y: number;
      tx: number;
      ty: number;
      r: number;
      color: string;
      speed: number;
    }[] = [];

    const colors = [
      'rgba(45, 212, 191, 0.4)',  // Teal
      'rgba(249, 115, 22, 0.3)',  // Orange
      'rgba(168, 85, 247, 0.3)',  // Purple
      'rgba(59, 130, 246, 0.3)'   // Blue
    ];

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles.length = 0;
      for (let i = 0; i < 6; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          tx: Math.random() * width,
          ty: Math.random() * height,
          r: Math.random() * 200 + 150,
          color: colors[i % colors.length],
          speed: 0.002 + Math.random() * 0.003
        });
      }
    };

    const mouse = { x: 0, y: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p) => {
        // Move towards target
        p.x += (p.tx - p.x) * p.speed;
        p.y += (p.ty - p.y) * p.speed;

        // Influence of mouse
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 400) {
          p.x -= dx * 0.01;
          p.y -= dy * 0.01;
        }

        // Random target changes
        if (Math.abs(p.x - p.tx) < 10) p.tx = Math.random() * width;
        if (Math.abs(p.y - p.ty) < 10) p.ty = Math.random() * height;

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    resize();
    createParticles();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0 opacity-60 mix-blend-screen"
    />
  );
};

export default LiquidBackground;
