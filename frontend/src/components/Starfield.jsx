import React, { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import "../Styles/Starfield.css";

export default function Starfield() {
  const { theme, colors } = useTheme();

  useEffect(() => {
    const canvas = document.getElementById("star-canvas");
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    // 🌟 Create twinkling stars
    const stars = Array.from({ length: 300 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 1.5,
      alpha: Math.random(),              // ⭐ opacity
      speed: 0.005 + Math.random() * 0.015, // ⭐ twinkle speed
      direction: Math.random() > 0.5 ? 1 : -1, // fade in/out
    }));

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // ⭐ Fill background with theme color
      // For light theme, we make the background transparent to show the gradient
      if (colors[theme].background) {
        ctx.fillStyle = colors[theme].background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      stars.forEach((star) => {
        // ⭐ Update alpha (twinkling)
        star.alpha += star.speed * star.direction;

        if (star.alpha <= 0) {
          star.alpha = 0;
          star.direction = 1;
        }
        if (star.alpha >= 1) {
          star.alpha = 1;
          star.direction = -1;
        }

        // ⭐ Draw star
        ctx.globalAlpha = star.alpha;
        ctx.fillStyle = colors[theme].stars;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1; // reset alpha

      requestAnimationFrame(draw);
    }

    draw();

    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [theme]);

  return <canvas id="star-canvas" className="star-bg"></canvas>;
}