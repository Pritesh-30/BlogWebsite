import React from "react";
import { Github, Linkedin } from "lucide-react";
import "../Styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <p>© 2025 Pritesh</p>
      <div className="socials">
        <a href="https://github.com/Pritesh-30" target="_blank" rel="noopener noreferrer">
          <Github size={20} />
        </a>
        <a
          href="https://www.linkedin.com/in/pritesh-shetty-60419a320/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Linkedin size={20} />
        </a>
      </div>
    </footer>
  );
}
