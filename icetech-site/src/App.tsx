import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import {
  Code2,
  Server,
  Cloud,
  LifeBuoy,
  ArrowRight,
  Mail,
  MapPin,
  Phone,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";

/* ---------- design tokens ---------- */
const T = {
  bg: "#0A0E17",
  panel: "#111826",
  panelAlt: "#0D1320",
  line: "#243040",
  lineSoft: "#1A2431",
  accent: "#6FE3FF",
  accentDim: "#2B7A8C",
  text: "#EAF2F6",
  textDim: "#8CA0AF",
  textFaint: "#5C6B7A",
};

const fontStack = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');
`;

/* ---------- fracture line motif ---------- */
function Fracture({ style, opacity = 1, color = T.accent }) {
  return (
    <svg
      viewBox="0 0 400 400"
      style={{ position: "absolute", ...style }}
      fill="none"
      aria-hidden="true"
    >
      <path d="M0 60 L120 60 L150 10 L260 120 L400 90" stroke={color} strokeWidth="1" opacity={opacity} />
      <path d="M20 400 L80 300 L60 210 L180 190 L160 90" stroke={color} strokeWidth="1" opacity={opacity * 0.6} />
      <path d="M400 250 L300 260 L280 340 L340 400" stroke={color} strokeWidth="1" opacity={opacity * 0.4} />
      <circle cx="150" cy="10" r="2.5" fill={color} opacity={opacity} />
      <circle cx="260" cy="120" r="2.5" fill={color} opacity={opacity * 0.7} />
      <circle cx="180" cy="190" r="2.5" fill={color} opacity={opacity * 0.5} />
    </svg>
  );
}

/* ---------- 3d snowfall ---------- */
function Snowfall({ count = 900 }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 60;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const drift = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 140;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
      speeds[i] = 0.05 + Math.random() * 0.14;
      drift[i] = Math.random() * Math.PI * 2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xeaf6fb,
      size: 0.7,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let frameId;
    const animate = () => {
      const pos = geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        pos[i * 3 + 1] -= speeds[i];
        pos[i * 3] += Math.sin(drift[i] + pos[i * 3 + 1] * 0.02) * 0.02;
        if (pos[i * 3 + 1] < -60) {
          pos[i * 3 + 1] = 60;
          pos[i * 3] = (Math.random() - 0.5) * 140;
        }
      }
      geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [count]);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  );
}

function Divider({ inset }) {
  return (
    <div
      style={{
        height: 1,
        background: T.line,
        margin: inset ? `0 ${inset}` : 0,
      }}
    />
  );
}

/* ---------- nav ---------- */
const PAGES = ["Home", "About", "Services", "Portfolio", "Contact"];

function Nav({ page, setPage }) {
  const [open, setOpen] = useState(false);
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        background: "rgba(10,14,23,0.92)",
        backdropFilter: "blur(6px)",
        borderBottom: `1px solid ${T.line}`,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "18px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={() => {
            setPage("Home");
            setOpen(false);
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: 0,
          }}
        >
          <span
            style={{
              width: 9,
              height: 9,
              background: T.accent,
              display: "inline-block",
              transform: "rotate(45deg)",
            }}
          />
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600,
              fontSize: 19,
              letterSpacing: "0.01em",
              color: T.text,
            }}
          >
            ICETECH
          </span>
        </button>

        <nav style={{ display: "flex", gap: 4 }} className="icetech-nav-desktop">
          {PAGES.map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px 14px",
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontSize: 14,
                color: page === p ? T.text : T.textDim,
                borderBottom: page === p ? `1px solid ${T.accent}` : "1px solid transparent",
                transition: "color 0.15s ease",
              }}
            >
              {p}
            </button>
          ))}
        </nav>

        <button
          onClick={() => setPage("Contact")}
          className="icetech-nav-desktop"
          style={{
            background: "none",
            border: `1px solid ${T.accent}`,
            color: T.accent,
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 13.5,
            padding: "9px 16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          Start a project <ArrowRight size={14} />
        </button>

        <button
          onClick={() => setOpen(!open)}
          className="icetech-nav-mobile"
          style={{ background: "none", border: "none", color: T.text, cursor: "pointer" }}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div
          className="icetech-nav-mobile"
          style={{ borderTop: `1px solid ${T.line}`, padding: "8px 24px 18px" }}
        >
          {PAGES.map((p) => (
            <button
              key={p}
              onClick={() => {
                setPage(p);
                setOpen(false);
              }}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                background: "none",
                border: "none",
                padding: "10px 0",
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontSize: 15,
                color: page === p ? T.accent : T.textDim,
                cursor: "pointer",
              }}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 720px) {
          .icetech-nav-desktop { display: none !important; }
          .icetech-nav-mobile { display: block !important; }
        }
        @media (min-width: 721px) {
          .icetech-nav-mobile { display: none !important; }
        }
      `}</style>
    </header>
  );
}

/* ---------- shared page shell ---------- */
function Section({ children, style }) {
  return (
    <section style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 24px", ...style }}>
      {children}
    </section>
  );
}

function Eyebrow({ children }) {
  return (
    <p
      style={{
        fontFamily: "'IBM Plex Sans', sans-serif",
        fontSize: 13,
        color: T.accent,
        marginBottom: 14,
        letterSpacing: "0.02em",
      }}
    >
      {children}
    </p>
  );
}

/* ---------- Home ---------- */
function Home({ setPage }) {
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 80);
    return () => clearTimeout(t);
  }, []);

  const capabilities = [
    {
      icon: Code2,
      title: "Frontend engineering",
      copy: "Interfaces built with React, vanilla JS, or plain HTML and CSS — fast to load, easy to hand off.",
    },
    {
      icon: Server,
      title: "Backend and APIs",
      copy: "PHP and Python services, databases, and integrations that keep your data straight under real traffic.",
    },
    {
      icon: Cloud,
      title: "Cloud infrastructure",
      copy: "Deployment, scaling, and hosting set up so your site stays up when it matters most.",
    },
    {
      icon: LifeBuoy,
      title: "Ongoing support",
      copy: "Fixes, updates, and small changes handled on a schedule you can plan around, not a queue you wait in.",
    },
  ];

  const process = [
    { n: "01", t: "Discover", c: "We map what the site needs to do before anyone touches a design tool." },
    { n: "02", t: "Design", c: "Wireframes and a visual direction you sign off on before we build anything." },
    { n: "03", t: "Build", c: "Development in short cycles, with something you can click on within the first week." },
    { n: "04", t: "Ship", c: "Testing, launch, and a handover doc that explains how everything works." },
    { n: "05", t: "Support", c: "A maintenance window for fixes and updates once the site is live." },
  ];

  return (
    <>
      {/* hero */}
      <div style={{ position: "relative", overflow: "hidden", borderBottom: `1px solid ${T.line}` }}>
        <Snowfall count={700} />
        <Fracture style={{ right: -60, top: -40, width: 340, height: 340 }} opacity={0.35} />
        <Section style={{ paddingTop: 96, paddingBottom: 96, position: "relative" }}>
          <div style={{ maxWidth: 620 }}>
            <Eyebrow>Web development studio</Eyebrow>
            <h1
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 600,
                fontSize: "clamp(34px, 5vw, 54px)",
                lineHeight: 1.08,
                color: T.text,
                margin: 0,
                overflow: "hidden",
              }}
            >
              <span
                style={{
                  display: "block",
                  transform: revealed ? "translateY(0)" : "translateY(110%)",
                  transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
                }}
              >
                We build web systems
              </span>
              <span
                style={{
                  display: "block",
                  color: T.accent,
                  transform: revealed ? "translateY(0)" : "translateY(110%)",
                  transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1) 0.08s",
                }}
              >
                that hold up under load.
              </span>
            </h1>
            <p
              style={{
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontSize: 16.5,
                lineHeight: 1.65,
                color: T.textDim,
                marginTop: 22,
                maxWidth: 480,
              }}
            >
              ICETECH designs and ships production-grade websites, applications, and internal tools
              for teams who can't afford downtime.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
              <button
                onClick={() => setPage("Contact")}
                style={{
                  background: T.accent,
                  color: "#04222B",
                  border: "none",
                  padding: "13px 22px",
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: 14.5,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                Start a project <ArrowRight size={16} />
              </button>
              <button
                onClick={() => setPage("Portfolio")}
                style={{
                  background: "none",
                  color: T.text,
                  border: `1px solid ${T.line}`,
                  padding: "13px 22px",
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  fontSize: 14.5,
                  cursor: "pointer",
                }}
              >
                See our work
              </button>
            </div>
          </div>
        </Section>
      </div>

      {/* capabilities strip */}
      <Section style={{ paddingTop: 64, paddingBottom: 64 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" }}>
          {capabilities.map((c, i) => (
            <div
              key={c.title}
              style={{
                padding: "24px 22px",
                borderTop: `1px solid ${T.line}`,
                borderLeft: i % 2 === 1 ? `1px solid ${T.line}` : "none",
              }}
            >
              <c.icon size={20} color={T.accent} strokeWidth={1.6} />
              <h3
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 16.5,
                  fontWeight: 600,
                  color: T.text,
                  margin: "14px 0 8px",
                }}
              >
                {c.title}
              </h3>
              <p
                style={{
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: T.textDim,
                  margin: 0,
                }}
              >
                {c.copy}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* process */}
      <div style={{ borderTop: `1px solid ${T.line}`, background: T.panelAlt }}>
        <Section>
          <Eyebrow>How a project runs</Eyebrow>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600,
              fontSize: 28,
              color: T.text,
              margin: "0 0 40px",
              maxWidth: 480,
            }}
          >
            Five stages, start to launch
          </h2>
          <div>
            {process.map((p, i) => (
              <div key={p.n}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "60px 1fr",
                    gap: 20,
                    padding: "22px 0",
                    alignItems: "start",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 14,
                      color: T.accentDim,
                    }}
                  >
                    {p.n}
                  </span>
                  <div>
                    <h4
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: 17,
                        fontWeight: 600,
                        color: T.text,
                        margin: "0 0 6px",
                      }}
                    >
                      {p.t}
                    </h4>
                    <p
                      style={{
                        fontFamily: "'IBM Plex Sans', sans-serif",
                        fontSize: 14.5,
                        color: T.textDim,
                        margin: 0,
                        maxWidth: 560,
                      }}
                    >
                      {p.c}
                    </p>
                  </div>
                </div>
                {i < process.length - 1 && <Divider />}
              </div>
            ))}
          </div>
        </Section>
      </div>
    </>
  );
}

/* ---------- About ---------- */
function About() {
  const stats = [
    { n: "40+", l: "sites shipped" },
    { n: "5", l: "years building" },
    { n: "12", l: "active clients" },
    { n: "98%", l: "on-time launches" },
  ];
  return (
    <Section>
      <div style={{ maxWidth: 640 }}>
        <Eyebrow>About ICETECH</Eyebrow>
        <h1
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600,
            fontSize: "clamp(28px, 4vw, 40px)",
            color: T.text,
            margin: "0 0 22px",
            lineHeight: 1.15,
          }}
        >
          Small studio, direct line to the people building your site.
        </h1>
        <p
          style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 16,
            lineHeight: 1.7,
            color: T.textDim,
            margin: "0 0 18px",
          }}
        >
          ICETECH started as a one-person freelance practice and grew into a small studio because
          clients kept asking for the same thing: someone who writes the code, answers the phone,
          and doesn't disappear after launch. We still work that way.
        </p>
        <p
          style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 16,
            lineHeight: 1.7,
            color: T.textDim,
            margin: 0,
          }}
        >
          We take on a small number of projects at a time so every client gets a developer who
          knows their codebase by name, not a ticket number in a queue.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 1,
          background: T.line,
          marginTop: 56,
          border: `1px solid ${T.line}`,
        }}
      >
        {stats.map((s) => (
          <div key={s.l} style={{ background: T.bg, padding: "26px 20px" }}>
            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 30,
                fontWeight: 600,
                color: T.accent,
              }}
            >
              {s.n}
            </div>
            <div
              style={{
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontSize: 13.5,
                color: T.textDim,
                marginTop: 4,
              }}
            >
              {s.l}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------- Services ---------- */
function Services({ setPage }) {
  const services = [
    {
      icon: Code2,
      title: "Web design and build",
      copy: "A new site from scratch — structure, visual design, and front-end build in one pass, using HTML, CSS, JavaScript, or React depending on what the project needs.",
    },
    {
      icon: Server,
      title: "Full-stack development",
      copy: "Custom web applications with PHP or Python back ends, database design, and the APIs that connect them to your front end.",
    },
    {
      icon: ExternalLink,
      title: "E-commerce",
      copy: "Storefronts wired up to payment processing, inventory, and order handling — built to survive a traffic spike on launch day.",
    },
    {
      icon: Cloud,
      title: "Cloud and DevOps",
      copy: "Hosting setup, deployment pipelines, and infrastructure on AWS or similar platforms, sized to what your site actually needs.",
    },
    {
      icon: LifeBuoy,
      title: "Maintenance and support",
      copy: "A standing arrangement for updates, bug fixes, and small feature requests after launch, billed monthly or per request.",
    },
  ];
  return (
    <Section>
      <Eyebrow>What we do</Eyebrow>
      <h1
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 600,
          fontSize: "clamp(28px, 4vw, 40px)",
          color: T.text,
          margin: "0 0 48px",
          maxWidth: 560,
        }}
      >
        Services, scoped to what your project needs
      </h1>

      <div>
        {services.map((s, i) => (
          <div key={s.title}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "44px 1fr",
                gap: 24,
                padding: "28px 0",
                alignItems: "start",
              }}
            >
              <s.icon size={22} color={T.accent} strokeWidth={1.6} />
              <div>
                <h3
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 19,
                    fontWeight: 600,
                    color: T.text,
                    margin: "0 0 8px",
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    fontSize: 15,
                    lineHeight: 1.65,
                    color: T.textDim,
                    margin: 0,
                    maxWidth: 620,
                  }}
                >
                  {s.copy}
                </p>
              </div>
            </div>
            {i < services.length - 1 && <Divider />}
          </div>
        ))}
      </div>

      <button
        onClick={() => setPage("Contact")}
        style={{
          marginTop: 40,
          background: T.accent,
          color: "#04222B",
          border: "none",
          padding: "13px 22px",
          fontFamily: "'IBM Plex Sans', sans-serif",
          fontWeight: 600,
          fontSize: 14.5,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        Ask about a project <ArrowRight size={16} />
      </button>
    </Section>
  );
}

/* ---------- Portfolio ---------- */
function Portfolio() {
  const projects = [
    { name: "Kelder Logistics", type: "Internal ops dashboard", stack: "React · PHP · MySQL" },
    { name: "Rivermark Realty", type: "Marketing site + listings", stack: "HTML/CSS · JS" },
    { name: "Pantry & Co.", type: "E-commerce storefront", stack: "React · Python · Stripe" },
    { name: "Fieldnote", type: "Field-report web app", stack: "React · Node · Postgres" },
    { name: "Glassworks Studio", type: "Portfolio + booking", stack: "HTML/CSS · JS" },
    { name: "Northline Freight", type: "Cloud migration", stack: "AWS · PHP" },
  ];
  return (
    <Section>
      <Eyebrow>Selected work</Eyebrow>
      <h1
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 600,
          fontSize: "clamp(28px, 4vw, 40px)",
          color: T.text,
          margin: "0 0 48px",
          maxWidth: 560,
        }}
      >
        Projects we've shipped
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 1,
          background: T.line,
          border: `1px solid ${T.line}`,
        }}
      >
        {projects.map((p) => (
          <div
            key={p.name}
            style={{
              background: T.bg,
              padding: "26px 24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: 150,
            }}
          >
            <div>
              <h3
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 17,
                  fontWeight: 600,
                  color: T.text,
                  margin: "0 0 6px",
                }}
              >
                {p.name}
              </h3>
              <p
                style={{
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  fontSize: 14,
                  color: T.textDim,
                  margin: 0,
                }}
              >
                {p.type}
              </p>
            </div>
            <p
              style={{
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontSize: 12.5,
                color: T.accentDim,
                marginTop: 18,
                letterSpacing: "0.01em",
              }}
            >
              {p.stack}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------- Contact ---------- */
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  const inputStyle = {
    width: "100%",
    background: T.panel,
    border: `1px solid ${T.line}`,
    color: T.text,
    padding: "12px 14px",
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: 14.5,
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle = {
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: 13,
    color: T.textDim,
    display: "block",
    marginBottom: 6,
  };

  return (
    <Section>
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 56 }} className="icetech-contact-grid">
        <div>
          <Eyebrow>Get in touch</Eyebrow>
          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600,
              fontSize: "clamp(28px, 4vw, 38px)",
              color: T.text,
              margin: "0 0 20px",
              lineHeight: 1.15,
            }}
          >
            Tell us what you're building.
          </h1>
          <p
            style={{
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: 15.5,
              lineHeight: 1.65,
              color: T.textDim,
              margin: "0 0 36px",
              maxWidth: 420,
            }}
          >
            Send a few lines about the project and we'll reply within one business day with next
            steps.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Mail size={17} color={T.accent} />
              <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14.5, color: T.text }}>
                icetech.webdev@gmail.com
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Phone size={17} color={T.accent} />
              <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14.5, color: T.text }}>
                +27 (0)12 555 0134
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <MapPin size={17} color={T.accent} />
              <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14.5, color: T.text }}>
                Arcadia, Pretoria, South Africa
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 16, marginTop: 32 }}>
          </div>
        </div>

        <div style={{ position: "relative" }}>
          <Fracture style={{ top: -30, right: -30, width: 180, height: 180 }} opacity={0.25} />
          {sent ? (
            <div
              style={{
                border: `1px solid ${T.line}`,
                padding: "40px 28px",
                position: "relative",
              }}
            >
              <p
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 18,
                  color: T.text,
                  margin: "0 0 8px",
                }}
              >
                Message sent
              </p>
              <p
                style={{
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  fontSize: 14,
                  color: T.textDim,
                  margin: 0,
                }}
              >
                We'll get back to you within one business day.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} style={{ position: "relative" }}>
              <div style={{ marginBottom: 18 }}>
                <label style={labelStyle}>Name</label>
                <input
                  style={inputStyle}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  required
                />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  style={inputStyle}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@company.com"
                  required
                />
              </div>
              <div style={{ marginBottom: 22 }}>
                <label style={labelStyle}>Project details</label>
                <textarea
                  style={{ ...inputStyle, resize: "vertical", minHeight: 110, fontFamily: "'IBM Plex Sans', sans-serif" }}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="What are you building, and when do you need it?"
                  required
                />
              </div>
              <button
                type="submit"
                style={{
                  background: T.accent,
                  color: "#04222B",
                  border: "none",
                  padding: "13px 22px",
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: 14.5,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                Send message <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>
      </div>
      <style>{`
        @media (max-width: 760px) {
          .icetech-contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </Section>
  );
}

/* ---------- Footer ---------- */
function Footer({ setPage }) {
  return (
    <footer style={{ borderTop: `1px solid ${T.line}`, background: T.panelAlt }}>
      <Section style={{ paddingTop: 40, paddingBottom: 40 }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  background: T.accent,
                  display: "inline-block",
                  transform: "rotate(45deg)",
                }}
              />
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600,
                  fontSize: 15.5,
                  color: T.text,
                }}
              >
                ICETECH
              </span>
            </div>
            <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: T.textFaint, marginTop: 8 }}>
              Web development studio, Pretoria.
            </p>
          </div>
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
            {PAGES.map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  fontSize: 13.5,
                  color: T.textDim,
                  padding: 0,
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <Divider />
        <p
          style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 12.5,
            color: T.textFaint,
            marginTop: 20,
            marginBottom: 0,
          }}
        >
          © {new Date().getFullYear()} ICETECH. All rights reserved.
        </p>
      </Section>
    </footer>
  );
}

/* ---------- app ---------- */
export default function ICETECHSite() {
  const [page, setPage] = useState("Home");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const pages = {
    Home: <Home setPage={setPage} />,
    About: <About />,
    Services: <Services setPage={setPage} />,
    Portfolio: <Portfolio />,
    Contact: <Contact />,
  };

  return (
    <div style={{ background: T.bg, minHeight: "100vh" }}>
      <style>{fontStack}</style>
      <Nav page={page} setPage={setPage} />
      {pages[page]}
      <Footer setPage={setPage} />
    </div>
  );
}
