"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export default function LavaLamp() {
  const container = useRef(null);

  useGSAP(() => {
    // Random utility
    const randomBetween = (min: number, max: number) => 
      Math.floor(Math.random() * (max - min + 1) + min);

    // Animate each blob with unique physics
    [0, 1, 2, 3, 4].forEach((i) => {
      const blob = document.querySelector(`#blob${i}`);
      if (!blob) return;

      // Set initial random delay so they don't start together
      gsap.set(blob, { y: randomBetween(-10, 10) });

      // The Yoyo Loop
      gsap.to(blob, {
        y: 260, // Move down
        duration: randomBetween(14, 50) / 2, // Random speed
        repeat: -1,
        yoyo: true,
        ease: "none", // Linear movement looks more like wax
        delay: randomBetween(0, 5),
      });
    });
  }, { scope: container });

  return (
    <div 
      ref={container}
      className="fixed inset-0 w-full h-full pointer-events-none -z-50 overflow-hidden flex items-center justify-center opacity-40 mix-blend-screen"
    >
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 600 600"
        className="w-300 h-300 md:w-200 md:h-200 opacity-80"
      >
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -9"
              result="cm"
            />
          </filter>

          {/* BACKGROUND GRADIENT (Dark Obsidian) */}
          <radialGradient id="bgGrad" cx="300" cy="300" r="300" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#0A0A0A" />
            <stop offset="1" stopColor="#000000" />
          </radialGradient>

          {/* MASK SHAPE (The Glass Container) */}
          <clipPath id="glassMask">
            <path
              id="glassShape"
              d="M262,174h60l33.5,182.3c0,0,2.7,12.8,2.5,22.8c-7.5,0-131,0-131,0s-0.7-9.3,0-18C227.6,352.9,262,174,262,174z"
            />
          </clipPath>

          {/* SAGE GRADIENTS FOR BLOBS (Replaced Orange) */}
          <radialGradient id="sageBlob" cx="292" cy="171.5" r="56.5" gradientUnits="userSpaceOnUse">
             <stop offset="0" stopColor="#D4FF00" />    {/* Core Bright Sage */}
             <stop offset="0.4" stopColor="#A3CC00" />  {/* Mid Green */}
             <stop offset="1" stopColor="#4A6600" />    {/* Dark Olive Edge */}
          </radialGradient>
        </defs>

        {/* --- THE STRUCTURE --- */}
        
        {/* The Lamp Base & Cap (Dark Metal) */}
        <polygon points="269,135 262,174 322,174 316,135" fill="#111" /> {/* Top Cap */}
        <path d="M226.8,379c2.6,43,23.9,54.6,28.3,60.2c3.3,5.4-10,30.8-10,30.8h95.5c0,0-16.5-25.1-14.5-30.8s26-15.2,32-60.2C328,379,240.3,379,226.8,379z" fill="#111" /> {/* Base */}

        {/* --- THE GOO (Animated Wax) --- */}
        <g clipPath="url(#glassMask)" filter="url(#goo)">
          <path id="blob0" fill="url(#sageBlob)" d="M326.2,149.5c-5,19.2-21.4,29.2-37.8,26.6c-16.5-2.9-33.4-12.9-37.1-26.6c-3.8-13.6,12.5-32.1,37.8-34.9C314.4,111.8,331.3,130.4,326.2,149.5z" />
          <path id="blob1" fill="url(#sageBlob)" d="M320.5,146.4c-4.4,10.1-16.4,20.2-26.8,25.3c-10.4,5.2-22.4-2.9-26.8-15.2c-4.4-11.6,7.6-20.4,26.8-25.3C312.9,126.3,324.9,135.6,320.5,146.4z" />
          <path id="blob2" fill="url(#sageBlob)" d="M278,147.7c2.7-7.1,9.4-15.7,15.4-16.4c5.9-0.4,12.6,8.5,15.4,16.9c2.7,8.4-4.2,14.9-15.4,14.2C282.2,161.5,275.3,154.8,278,147.7z" />
          <path id="blob3" fill="url(#sageBlob)" d="M312.7,147.3c-2.1,16.4-15.3,27.2-23.2,25.3c-8.1-1.8-12.6-13-14.8-24.9c-1.9-11.8,2.7-22.7,14.8-25.3C301.5,119.6,314.7,130.8,312.7,147.3z" />
          <path id="blob4" fill="url(#sageBlob)" d="M317.8,147.4c-1,8.2-9.8,10.3-13.8,9.3c-4-0.9-6.5-3-7.6-8.9c-1-5.9,2.3-8.5,8.4-9.8C310.8,136.6,318.8,139.1,317.8,147.4z" />
        </g>
        
        {/* Subtle Glass Reflection Overlay */}
        <use xlinkHref="#glassShape" fill="url(#sageBlob)" opacity="0.05" />
        
      </svg>
    </div>
  );
}