"use client";
import { useEffect, useRef } from "react";

export default function LavaLamp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // CONFIGURATION
    const BALL_COUNT = 15;
    const BASE_SPEED = 2;
    const COLORS = ["#D4FF00", "#ccff00", "#aaff00"]; // All variations of your Sage

    class Ball {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;

      constructor() {
        this.radius = Math.random() * 60 + 40; // Big blobs (40px - 100px)
        this.x = Math.random() * (width - this.radius * 2) + this.radius;
        this.y = Math.random() * (height - this.radius * 2) + this.radius;
        // Random velocity between -BASE_SPEED and BASE_SPEED
        this.vx = (Math.random() - 0.5) * BASE_SPEED;
        this.vy = (Math.random() - 0.5) * BASE_SPEED;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      }

      update() {
        // Move
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off walls
        if (this.x + this.radius > width || this.x - this.radius < 0) {
          this.vx *= -1;
        }
        if (this.y + this.radius > height || this.y - this.radius < 0) {
          this.vy *= -1;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
      }
    }

    // Initialize Balls
    const balls: Ball[] = [];
    for (let i = 0; i < BALL_COUNT; i++) {
      balls.push(new Ball());
    }

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Standard composite operation usually works best for flat colors
      ctx.globalCompositeOperation = "source-over";

      balls.forEach((ball) => {
        ball.update();
        ball.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();

    // Handle Resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none bg-obsidian">
      {/* THE SECRET SAUCE:
         1. blur(80px): Blurs the balls heavily so they overlap.
         2. contrast(20): Sharpens the blur, making the overlap look like "sticky liquid".
         3. opacity-30: Keeps it subtle enough to read text over.
      */}
      <div 
        className="absolute inset-0 w-full h-full filter blur-[80px] contrast-[25] opacity-30 mix-blend-screen"
      >
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}