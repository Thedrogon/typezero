'use client';
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Setup GSAP QuickSetter (Much faster than standard .to())
    const xSet = gsap.quickSetter(cursorRef.current, "x", "px");
    const ySet = gsap.quickSetter(cursorRef.current, "y", "px");

    // 2. Move Logic (Runs on every frame)
    const moveCursor = (e: MouseEvent) => {
      xSet(e.clientX);
      ySet(e.clientY);
    };

    // 3. Hover Logic (No React State = No Re-renders)
    const checkHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if we are hovering over something interactive
      const isClickable = 
        window.getComputedStyle(target).cursor === "pointer" ||
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest('a') || // Check parent links
        target.closest('button');

      if (cursorRef.current) {
        if (isClickable) {
          cursorRef.current.classList.add('is-hovering');
        } else {
          cursorRef.current.classList.remove('is-hovering');
        }
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", checkHover);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", checkHover);
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        /* Hide default cursor only on non-touch devices */
        @media (pointer: fine) {
          body {
            cursor: none;
          }
          a, button, [role="button"] {
            cursor: none !important; /* Force hide on links */
          }
        }
        
        .custom-cursor {
          position: fixed;
          top: 0;
          left: 0;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          
          /* THE LOOK: Gradient + Thick Border (Never camouflages) */
          background: linear-gradient(135deg, #D4FF00, oklch(76.5% 0.177 163.223));
          border: 3px solid white; 
          box-shadow: 0 0 0 2px black; /* Double border for contrast */
          
          transform: translate(-50%, -50%) scale(1);
          transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s;
        }

        /* Hover State: Grow & Spin slightly */
        .custom-cursor.is-hovering {
          transform: translate(-50%, -50%) scale(2);
          background: white;
          border-color: black;
          mix-blend-mode: normal; /* Ensure it stays visible */
        }
      `}</style>
      
      <div ref={cursorRef} className="custom-cursor" />
    </>
  );
}