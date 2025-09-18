"use client";

import React, { useEffect } from "react";

const Cursor: React.FC = () => {
  useEffect(() => {
    let canvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D | null;
    let animationFrame: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let cursor = { x: width / 2, y: height / 2 };

    // states for hover/click
    let isHovering = false;
    let isClicking = false;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    // ✅ Prevent cursor on mobile & tablet (screen width <= 1024 or touch devices)
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const isMobileOrTablet = width <= 1024 || isTouchDevice;
    if (isMobileOrTablet) return; // ⛔ Do not run cursor effect at all

    class Dot {
      position: { x: number; y: number };
      radius: number;
      lag: number;
      color: string;
      currentRadius: number;

      constructor(
        x: number,
        y: number,
        radius: number,
        lag: number,
        color: string
      ) {
        this.position = { x, y };
        this.radius = radius;
        this.currentRadius = radius;
        this.lag = lag;
        this.color = color;
      }

      moveTowards(
        x: number,
        y: number,
        context: CanvasRenderingContext2D,
        borderOnly = false
      ) {
        this.position.x += (x - this.position.x) / this.lag;
        this.position.y += (y - this.position.y) / this.lag;

        // smooth radius animation - much faster
        if (borderOnly) {
          let targetRadius = this.radius;
          if (isHovering) targetRadius = this.radius * 1.5;
          if (isClicking) targetRadius = this.radius * 0.8;
          this.currentRadius += (targetRadius - this.currentRadius) * 0.4; // increased from 0.2
        } else {
          let targetRadius = this.radius;
          if (isClicking) targetRadius = this.radius * 0.7;
          this.currentRadius += (targetRadius - this.currentRadius) * 0.5; // increased from 0.3
        }

        context.beginPath();
        context.arc(
          this.position.x,
          this.position.y,
          this.currentRadius,
          0,
          2 * Math.PI
        );

        if (borderOnly) {
          context.strokeStyle = this.color;
          context.lineWidth = 2;
          context.stroke();
        } else {
          context.fillStyle = this.color;
          context.fill();
        }

        context.closePath();
      }
    }

    // ✅ MAIN FIX: Much lower lag values for ultra-smooth movement
    const dot = new Dot(width / 2, height / 2, 4, 1.2, "rgba(146, 168, 191, 0.6)"); // was 1, now 1.2 for slight trail
    const ring = new Dot(width / 2, height / 2, 15, 2.5, "rgba(146, 168, 191, 0.6)"); // was 8, now 2.5 for much faster follow

    const onMouseMove = (e: MouseEvent) => {
      cursor.x = e.clientX;
      cursor.y = e.clientY;

      // detect hover state
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (
        el &&
        (el.tagName === "A" ||
          el.tagName === "BUTTON" ||
          el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA")
      ) {
        isHovering = true;
      } else {
        isHovering = false;
      }
    };

    const onMouseDown = () => {
      isClicking = true;
    };

    const onMouseUp = () => {
      isClicking = false;
    };

    const onWindowResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      if (canvas) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    const updateCursor = () => {
      if (context) {
        context.clearRect(0, 0, width, height);
        dot.moveTowards(cursor.x, cursor.y, context, false);
        ring.moveTowards(cursor.x, cursor.y, context, true);
      }
    };

    const loop = () => {
      updateCursor();
      animationFrame = requestAnimationFrame(loop);
    };

    const init = () => {
      if (prefersReducedMotion.matches) return;

      canvas = document.createElement("canvas");
      context = canvas.getContext("2d");
      canvas.style.position = "fixed";
      canvas.style.top = "0";
      canvas.style.left = "0";
      canvas.style.pointerEvents = "none";
      canvas.style.zIndex = "9999";
      canvas.width = width;
      canvas.height = height;
      document.body.appendChild(canvas);

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mouseup", onMouseUp);
      window.addEventListener("resize", onWindowResize);
      loop();
    };

    const destroy = () => {
      if (canvas) canvas.remove();
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", onWindowResize);
    };

    prefersReducedMotion.onchange = () => {
      if (prefersReducedMotion.matches) destroy();
      else init();
    };

    init();

    return () => {
      destroy();
    };
  }, []);

  return null;
};

export default Cursor;