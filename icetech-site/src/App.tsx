import React, { useState, useEffect, useRef, useCallback } from "react";


const WHATSAPP_NUMBER = "27810782998"; 
const BUSINESS_EMAIL = "icetech.weddev@gmail.com";
const WEB3FORMS_KEY = "75d941f3-484f-402f-917d-c865e10dcd4f";
const SUPABASE_URL = "https://gdmskhylzxvkkylimflc.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_94gWC-3BsfHfb7vc2VKbfg_cMlso0uJ";
const RAIN_OPACITY = 0.45; 
const EMAIL_ENABLED = !WEB3FORMS_KEY.startsWith("PASTE");
const TRACKING_ENABLED = !SUPABASE_URL.startsWith("PASTE");

const T = {
  bg: "#141416",
  panel: "#1E1E21",
  glass: "rgba(26,26,29,0.9)",
  line: "#3A3A40",
  accent: "#C6FF00", 
  pink: "#FF2E93", 
  text: "#F2F2F0",
  dim: "#A3A3AB",
};

const waLink = (msg: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

const sbHeaders = (token?: string) => {
  const h: any = { apikey: SUPABASE_ANON_KEY, "Content-Type": "application/json" };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
};


const vpad = (top: number, bottom?: number) => ({
  paddingTop: top,
  paddingBottom: bottom === undefined ? top : bottom,
});

const css = `
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Permanent+Marker&family=IBM+Plex+Sans:wght@400;500;600&display=swap');
:root { --gutter: clamp(20px, 4vw, 72px); }
* { box-sizing: border-box; }
html { scroll-behavior: smooth; background: ${T.bg}; }
body { margin: 0; background: ${T.bg}; color: ${T.text}; font-family: 'IBM Plex Sans', sans-serif; }
h1, h2 { font-family: 'Anton', sans-serif; font-weight: 400; text-transform: uppercase; letter-spacing: 0.01em; margin: 0; }
h3 { font-family: 'Anton', sans-serif; font-weight: 400; letter-spacing: 0.02em; margin: 0; }
.page { position: relative; z-index: 1; }
.wrap { width: 100%; max-width: 2200px; margin: 0 auto; padding-left: var(--gutter); padding-right: var(--gutter); }
.btn { display: inline-block; padding: 13px 22px; font-weight: 600; font-size: 15px; text-decoration: none; border: 2px solid transparent; cursor: pointer; font-family: inherit; }
.btn-primary { background: ${T.accent}; color: ${T.bg}; box-shadow: 4px 4px 0 #000; }
.btn-primary:hover { transform: translate(-1px, -1px); box-shadow: 5px 5px 0 ${T.pink}; }
.btn-ghost { border-color: ${T.line}; color: ${T.text}; background: rgba(20,20,22,0.6); }
.btn-ghost:hover { border-color: ${T.accent}; }
.nav-link { color: ${T.dim}; text-decoration: none; font-size: 14.5px; margin-right: 28px; }
.nav-link:hover { color: ${T.accent}; }
.card { background: ${T.glass}; border: 2px solid ${T.line}; box-shadow: 6px 6px 0 #000; transition: transform .15s, box-shadow .15s; }
.card:hover { transform: translate(-2px, -2px); box-shadow: 8px 8px 0 ${T.pink}; }
.tag { font-family: 'Permanent Marker', cursive; color: ${T.pink}; display: inline-block; transform: rotate(-3deg); }
.marker { background-image: linear-gradient(transparent 62%, rgba(255,46,147,0.65) 62%); padding: 0 4px; }
.sticker { font-family: 'Permanent Marker', cursive; background: ${T.pink}; color: ${T.bg}; padding: 4px 14px; display: inline-block; transform: rotate(-4deg); font-size: 16px; }
.splat { position: absolute; top: 24px; right: 2%; width: 300px; height: 300px; opacity: 0.5;
  background:
    radial-gradient(circle at 50% 50%, rgba(255,46,147,0.9) 0 42px, transparent 44px),
    radial-gradient(circle at 80% 28%, rgba(255,46,147,0.9) 0 10px, transparent 11px),
    radial-gradient(circle at 22% 72%, rgba(255,46,147,0.9) 0 13px, transparent 14px),
    radial-gradient(circle at 86% 74%, rgba(198,255,0,0.9) 0 8px, transparent 9px),
    radial-gradient(circle at 14% 24%, rgba(198,255,0,0.9) 0 5px, transparent 6px),
    radial-gradient(circle at 62% 88%, rgba(255,46,147,0.9) 0 6px, transparent 7px); }
.hero-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 56px; align-items: center; }
.contact-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 56px; align-items: start; }
.grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
.grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
.rain-toggle { position: fixed; left: 16px; bottom: 16px; z-index: 30; background: rgba(20,20,22,0.88); color: ${T.dim}; border: 2px solid ${T.line}; font-family: inherit; font-size: 12.5px; padding: 6px 12px; cursor: pointer; }
.rain-toggle:hover { color: ${T.accent}; border-color: ${T.accent}; }
@media (max-width: 1100px) { .grid-4, .grid-3 { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 960px) { .hero-grid, .contact-grid { grid-template-columns: 1fr; } .hero-side { display: none; } .nav-links { display: none; } }
@media (max-width: 640px) { .grid-4, .grid-3, .grid-2 { grid-template-columns: 1fr; } .splat { display: none; } }
`;



function CodeRain({ enabled }: any) {
  const ref = useRef<any>(null);

  useEffect(() => {
    if (!enabled) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fontSize = 16;
    let w = 0;
    let h = 0;
    let cols = 0;
    let drops: number[] = [];

    const setup = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = T.bg;
      ctx.fillRect(0, 0, w, h);
      cols = Math.ceil(w / fontSize);
      drops = Array.from({ length: cols }, () => -Math.floor(Math.random() * 30));
    };

    const draw = () => {
      ctx.fillStyle = "rgba(20,20,22,0.09)";
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < cols; i++) {
        const y = drops[i] * fontSize;
        if (y > 0) {
          ctx.fillStyle = Math.random() > 0.97 ? T.pink : T.accent;
          ctx.fillText(Math.random() > 0.5 ? "1" : "0", i * fontSize, y);
        }
        if (y > h && Math.random() > 0.975) {
          drops[i] = 0;
        } else {
          drops[i] += 1;
        }
      }
    };

    setup();
    
    const timer = window.setInterval(() => {
      if (!document.hidden) draw();
    }, 50);
    window.addEventListener("resize", setup);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("resize", setup);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{ position: "fixed", top: 0, left: 0, zIndex: 0, pointerEvents: "none", opacity: RAIN_OPACITY }}
    />
  );
}


const MAINTENANCE = [
  {
    service: "Maintenance: Basic",
    title: "Basic",
    prefix: "",
    price: "R500",
    suffix: "/month",
    blurb: "Keep a simple site online and working.",
    items: ["Uptime checks", "Fixes if something breaks", "1 small content change a month", "Replies within 3 business days"],
    cta: "Choose this plan",
  },
  {
    service: "Maintenance: Standard",
    title: "Standard",
    prefix: "",
    price: "R1,000",
    suffix: "/month",
    blurb: "For sites that change regularly.",
    items: ["Everything in Basic", "Up to 2 hours of changes a month", "Replies within 1 business day"],
    cta: "Choose this plan",
  },
  {
    service: "Maintenance: Premium",
    title: "Premium",
    prefix: "",
    price: "R1,800",
    suffix: "/month",
    blurb: "For busy sites with a blog or frequent updates.",
    items: ["Everything in Standard", "Up to 4 hours of changes a month", "Priority fixes when something goes wrong"],
    cta: "Choose this plan",
  },
];

const PACKAGES = [
  {
    service: "Landing Page",
    short: "Landing page",
    prefix: "From ",
    price: "R1,499",
    suffix: "",
    popular: false,
    blurb: "One clean page that tells customers who you are and lets them message you instantly.",
    items: ["1 page", "Mobile-friendly design", "WhatsApp contact button linked to your number", "Your contact details and business info"],
    turnaround: "2 weeks",
    timeNote: "",
    revisions: "2 rounds of changes",
    extraPage: "",
    maintenance: "",
  },
  {
    service: "Basic Website",
    short: "Basic website",
    prefix: "",
    price: "R3,499",
    suffix: "",
    popular: false,
    blurb: "A simple multi-page site for a small business.",
    items: [
      "Up to 5 pages",
      { t: "No CMS: we make your updates for you", no: true },
      "SEO basics: page titles, meta descriptions, mobile-friendly",
      { t: "No blog", no: true },
      "Google Analytics (GA4) installed",
    ],
    turnaround: "2 weeks",
    timeNote: "",
    revisions: "2 rounds of changes",
    extraPage: "R500 each",
    maintenance: `${MAINTENANCE[0].price}${MAINTENANCE[0].suffix}`,
  },
  {
    service: "Standard Website",
    short: "Standard website",
    prefix: "",
    price: "R5,999",
    suffix: "",
    popular: true,
    blurb: "For businesses that want to edit their own text and images.",
    items: [
      "Up to 7 pages",
      "CMS: simple editing of text and images",
      "Everything in Basic SEO, plus sitemap, image optimization and Google Business Profile setup",
      { t: "No blog", no: true },
      "Google Analytics (GA4) + Search Console",
    ],
    turnaround: "3 weeks",
    timeNote: "",
    revisions: "3 rounds of changes",
    extraPage: "R450 each",
    maintenance: `${MAINTENANCE[1].price}${MAINTENANCE[1].suffix}`,
  },
  {
    service: "Premium Website",
    short: "Premium website",
    prefix: "",
    price: "R9,999",
    suffix: "",
    popular: false,
    blurb: "Built to rank on Google and bring in leads.",
    items: [
      "Up to 10 pages",
      "CMS, plus a short training session for you",
      "Advanced SEO: schema markup, speed tuning, keyword-targeted content and Search Console",
      "Blog with template, categories and CMS publishing",
      "GA4 + event tracking (form submits, WhatsApp clicks, calls)",
    ],
    turnaround: "4 weeks",
    timeNote: "",
    revisions: "3 rounds of changes",
    extraPage: "R400 each",
    maintenance: `${MAINTENANCE[2].price}${MAINTENANCE[2].suffix}`,
  },
];

const SERVICES = [...PACKAGES.map((p) => p.service), ...MAINTENANCE.map((m) => m.service), "Not sure yet"];


const PROJECTS = [
  { name: "Briis Best Bakes", type: "Home bakery site with a photo gallery of cakes, muffins and custom bakes", url: "https://k3vin11-beep.github.io/briis-best-bakes-/" },
  { name: "Cynosure Wig Atelier", type: "Wig installation services and price list", url: "" },
  { name: "Mvuni's Digital Portfolio", type: "Portfolio website for a web developer", url: "https://k3vin11-beep.github.io/personal-portfolio/" },
  { name: "Land of Laundry", type: "Laundry service packages and pricing", url: "https://k3vin11-beep.github.io/land-of-laundry-site/" },
  { name: "Thakani's Wigs", type: "Website for a wig business", url: "" },
  { name: "The 24th Vision", type: "Portfolio and gallery website", url: "https://k3vin11-beep.github.io/the-24th-vision/" },
  { name: "Ndzalos Digital Portfolio", type: "Portfolio website for an actuary", url: "https://k3vin11-beep.github.io/ndzalo-portfolio/" },
  { name: "Khodanis Digital Portfolio", type: "Portfolio website for a final year Bcom Law student", url: "https://k3vin11-beep.github.io/khodani-portfolio/"},
];

const COMING_SOON = [
  { name: "Full-stack web applications", blurb: "Custom web apps with logins, databases and dashboards built around how your business works." },
  { name: "IT admin systems", blurb: "Internal tools to manage your staff, stock, bookings and records in one place." },
];

const STEPS = [
  { n: "01", t: "Send us a message", c: "Tell us about your business and what you need using the form." },
  { n: "02", t: "We build it", c: "We design and build your website." },
  { n: "03", t: "Go live", c: "Your site goes online and customers can start finding you." },
];

function PackageCard({ pkg, onPick }: any) {
  return (
    <div
      className="card"
      style={{ padding: 26, display: "flex", flexDirection: "column", position: "relative", ...(pkg.popular ? { borderColor: T.accent } : {}) }}
    >
      {pkg.popular && (
        <span className="sticker" style={{ position: "absolute", top: -16, right: 16, fontSize: 14 }}>
          Most popular
        </span>
      )}
      <h3 style={{ fontSize: 24 }}>{pkg.title || pkg.service}</h3>
      <p style={{ color: T.dim, fontSize: 14.5, lineHeight: 1.6, margin: "10px 0 16px" }}>{pkg.blurb}</p>
      <div style={{ marginBottom: 18 }}>
        <span style={{ color: T.dim, fontSize: 14 }}>{pkg.prefix}</span>
        <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 44, color: T.accent }}>{pkg.price}</span>
        <span style={{ color: T.dim, fontSize: 14 }}>{pkg.suffix}</span>
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px", flex: 1 }}>
        {pkg.items.map((item: any) => {
          const text = typeof item === "string" ? item : item.t;
          const no = typeof item !== "string" && item.no;
          return (
            <li key={text} style={{ fontSize: 14.5, lineHeight: 1.5, padding: "5px 0", color: no ? T.dim : T.text }}>
              <span style={{ color: no ? T.dim : T.pink, marginRight: 10 }}>{no ? "✕" : "✓"}</span>
              {text}
            </li>
          );
        })}
      </ul>
      {pkg.turnaround && (
        <div style={{ borderTop: `1px solid ${T.line}`, paddingTop: 14, marginBottom: 20, fontSize: 14, lineHeight: 1.8 }}>
          <div>
            <span style={{ color: T.dim }}>Time frame: </span>
            {pkg.turnaround}
            {pkg.timeNote ? <span style={{ color: T.dim }}> ({pkg.timeNote})</span> : null}
          </div>
          <div>
            <span style={{ color: T.dim }}>Revisions: </span>
            {pkg.revisions}
          </div>
          {pkg.extraPage ? (
            <div>
              <span style={{ color: T.dim }}>Extra pages: </span>
              {pkg.extraPage}
            </div>
          ) : null}
          {pkg.maintenance ? (
            <div>
              <span style={{ color: T.dim }}>Optional maintenance: </span>
              {pkg.maintenance}
            </div>
          ) : null}
        </div>
      )}
      <a className="btn btn-primary" href="#contact" onClick={() => onPick(pkg.service)} style={{ textAlign: "center" }}>
        {pkg.cta || "Get this package"}
      </a>
    </div>
  );
}

function PriceBoard() {
  return (
    <div className="card hero-side" style={{ padding: 0, fontFamily: "monospace" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderBottom: `2px solid ${T.line}` }}>
        <span style={{ width: 11, height: 11, borderRadius: 99, background: T.pink, display: "inline-block" }} />
        <span style={{ width: 11, height: 11, borderRadius: 99, background: T.accent, display: "inline-block" }} />
        <span style={{ width: 11, height: 11, borderRadius: 99, background: T.line, display: "inline-block" }} />
        <span style={{ marginLeft: 8, color: T.dim, fontSize: 13 }}>icetech — price list</span>
      </div>
      <div style={{ padding: "20px 22px", fontSize: 16, lineHeight: 2.1 }}>
        <div style={{ color: T.dim }}>$ icetech --prices</div>
        {PACKAGES.map((p) => (
          <div key={p.service} style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
            <span>{p.short}</span>
            <span style={{ color: T.accent }}>{p.price}</span>
          </div>
        ))}
        <div style={{ color: T.pink }}>&gt; ready when you are</div>
      </div>
    </div>
  );
}

function ContactForm({ service, setService }: any) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [waUrl, setWaUrl] = useState("");

  const submit = async (e: any) => {
    e.preventDefault();
    const text = `Hi ICETECH, I'm ${form.name}.\nI'm interested in: ${service}.\n\n${form.message}\n\nMy email: ${form.email}`;
    const url = waLink(text);
    setWaUrl(url);
    
    window.open(url, "_blank", "noopener,noreferrer");
    setStatus("sending");
    if (!EMAIL_ENABLED) {
      setStatus("error");
      return;
    }
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `New ICETECH enquiry from ${form.name}`,
          from_name: "ICETECH website",
          name: form.name,
          email: form.email,
          service,
          message: form.message,
        }),
      });
      const data = await res.json();
      setStatus(data.success ? "sent" : "error");
    } catch (err) {
      setStatus("error");
    }
  };

  const field = {
    width: "100%",
    background: T.panel,
    border: `2px solid ${T.line}`,
    color: T.text,
    padding: "12px 14px",
    fontFamily: "inherit",
    fontSize: 15,
  };
  const label = { display: "block", color: T.dim, fontSize: 13.5, margin: "0 0 6px" };

  if (status === "sent" || status === "error") {
    return (
      <div className="card" style={{ padding: 28 }}>
        <h3 style={{ fontSize: 26, marginBottom: 12 }}>{status === "sent" ? "Message sent" : "One more step"}</h3>
        {status === "sent" ? (
          <p style={{ color: T.dim, lineHeight: 1.6, margin: "0 0 18px" }}>
            Thanks {form.name}, we've got your message by email. WhatsApp should have opened with it ready to go. Press send there so it reaches our chat too.
          </p>
        ) : (
          <p style={{ color: T.dim, lineHeight: 1.6, margin: "0 0 18px" }}>
            Your WhatsApp chat should be open. Press send there. We couldn't send the email copy, so please also email us at{" "}
            <a href={`mailto:${BUSINESS_EMAIL}`} style={{ color: T.accent }}>{BUSINESS_EMAIL}</a>.
          </p>
        )}
        <a className="btn btn-primary" href={waUrl} target="_blank" rel="noopener noreferrer">Open WhatsApp</a>
      </div>
    );
  }

  return (
    <form className="card" onSubmit={submit} style={{ padding: 28 }}>
      <div style={{ marginBottom: 16 }}>
        <label style={label} htmlFor="cf-name">Your name</label>
        <input id="cf-name" style={field} value={form.name} onChange={(e: any) => setForm({ ...form, name: e.target.value })} required />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={label} htmlFor="cf-email">Your email</label>
        <input id="cf-email" type="email" style={field} value={form.email} onChange={(e: any) => setForm({ ...form, email: e.target.value })} required />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={label} htmlFor="cf-service">What do you need?</label>
        <select id="cf-service" style={field} value={service} onChange={(e: any) => setService(e.target.value)}>
          {SERVICES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={label} htmlFor="cf-message">Tell us about your business</label>
        <textarea id="cf-message" style={{ ...field, minHeight: 110, resize: "vertical" }} value={form.message} onChange={(e: any) => setForm({ ...form, message: e.target.value })} required />
      </div>
      <button className="btn btn-primary" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending..." : "Send message"}
      </button>
      <p style={{ color: T.dim, fontSize: 12.5, margin: "14px 0 0", lineHeight: 1.5 }}>
        We'll email your message to ICETECH and open WhatsApp with it ready to send.
      </p>
    </form>
  );
}

function Site() {
  const [service, setService] = useState(SERVICES[SERVICES.length - 1]);

  return (
    <>
      <header style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(20,20,22,0.9)", backdropFilter: "blur(6px)", borderBottom: `2px solid ${T.line}` }}>
        <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", ...vpad(12) }}>
          <a href="#home" style={{ textDecoration: "none", color: T.text, fontFamily: "'Anton', sans-serif", fontSize: 24, letterSpacing: "0.02em" }}>
            <span style={{ color: T.accent }}>&gt;_</span> ICETECH
          </a>
          <div style={{ display: "flex", alignItems: "center" }}>
            <nav className="nav-links">
              <a className="nav-link" href="#services">Services</a>
              <a className="nav-link" href="#maintenance">Maintenance</a>
              <a className="nav-link" href="#work">Our work</a>
              <a className="nav-link" href="#soon">Coming soon</a>
              <a className="nav-link" href="#contact">Contact</a>
            </nav>
            <a className="btn btn-primary" href="#contact" style={{ padding: "8px 16px", fontSize: 14 }}>Get a quote</a>
          </div>
        </div>
      </header>

      <main>
        <section id="home" style={{ position: "relative", overflow: "hidden", borderBottom: `2px solid ${T.line}` }}>
          <div className="splat" aria-hidden="true" />
          <div className="wrap hero-grid" style={{ ...vpad(96, 88), position: "relative" }}>
            <div>
              <div className="tag" style={{ fontSize: 22, marginBottom: 14 }}>web design for small businesses</div>
              <h1 style={{ fontSize: "clamp(42px, 6vw, 96px)", lineHeight: 1.02, textShadow: "0 2px 14px #000" }}>
                Professional websites for your business, <span className="marker" style={{ color: T.accent }}>from R1,499.</span>
              </h1>
              <p style={{ color: T.text, opacity: 0.85, fontSize: 17, lineHeight: 1.65, maxWidth: 560, margin: "24px 0 32px", textShadow: "0 1px 8px #000" }}>
                ICETECH builds landing pages and business websites for small businesses in Pretoria.
              </p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <a className="btn btn-primary" href="#contact">Get a quote</a>
                <a className="btn btn-ghost" href="#work">See our work</a>
              </div>
            </div>
            <PriceBoard />
          </div>
        </section>

        <section id="services">
          <div className="wrap" style={vpad(72)}>
            <h2 style={{ fontSize: 44 }}>What we build</h2>
            <p style={{ color: T.dim, fontSize: 16, margin: "10px 0 36px" }}>Simple, upfront pricing.</p>
            <div className="grid-4">
              {PACKAGES.map((pkg) => (
                <PackageCard key={pkg.service} pkg={pkg} onPick={setService} />
              ))}
            </div>
            <p style={{ color: T.dim, fontSize: 13.5, lineHeight: 1.6, margin: "24px 0 0", maxWidth: 760 }}>
              A revision round is one batch of changes you send us together. Time frames depend on how quickly you send content and feedback. Anything not listed in a package is quoted separately.
            </p>
          </div>
        </section>

        <section id="maintenance" style={{ borderTop: `2px solid ${T.line}` }}>
          <div className="wrap" style={vpad(72)}>
            <h2 style={{ fontSize: 44 }}>Maintenance plans</h2>
            <p style={{ color: T.dim, fontSize: 16, margin: "10px 0 36px" }}>Keep your site running after launch. Billed monthly.</p>
            <div className="grid-3">
              {MAINTENANCE.map((m) => (
                <PackageCard key={m.service} pkg={m} onPick={setService} />
              ))}
            </div>
            <p style={{ color: T.dim, fontSize: 13.5, lineHeight: 1.6, margin: "24px 0 0", maxWidth: 760 }}>
              Hosting and domain costs are quoted separately.
            </p>
          </div>
        </section>

        <section id="work" style={{ background: "rgba(20,20,22,0.82)", borderTop: `2px solid ${T.line}`, borderBottom: `2px solid ${T.line}` }}>
          <div className="wrap" style={vpad(72)}>
            <h2 style={{ fontSize: 44 }}>Our work</h2>
            <p style={{ color: T.dim, fontSize: 16, margin: "10px 0 36px" }}>Some of the sites we've built.</p>
            <div className="grid-4">
              {PROJECTS.map((p, i) => (
                <div key={p.name} className="card" style={{ padding: 24 }}>
                  <div className="tag" style={{ fontSize: 20, marginBottom: 6 }}>0{i + 1}</div>
                  <h3 style={{ fontSize: 24, marginBottom: 8 }}>{p.name}</h3>
                  <p style={{ color: T.dim, fontSize: 14.5, lineHeight: 1.6, margin: 0 }}>{p.type}</p>
                  {p.url && (
                    <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 14, color: T.accent, fontSize: 14.5 }}>
                      Visit site →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="soon">
          <div className="wrap" style={vpad(72)}>
            <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", marginBottom: 36 }}>
              <h2 style={{ fontSize: 44 }}>Coming soon</h2>
              <span className="sticker">upcoming services</span>
            </div>
            <div className="grid-2">
              {COMING_SOON.map((s) => (
                <div key={s.name} className="card" style={{ padding: 26, borderStyle: "dashed" }}>
                  <h3 style={{ fontSize: 24, marginBottom: 8 }}>{s.name}</h3>
                  <p style={{ color: T.dim, fontSize: 14.5, lineHeight: 1.6, margin: 0 }}>{s.blurb}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how" style={{ background: "rgba(20,20,22,0.82)", borderTop: `2px solid ${T.line}`, borderBottom: `2px solid ${T.line}` }}>
          <div className="wrap" style={vpad(72)}>
            <h2 style={{ fontSize: 44, marginBottom: 36 }}>How it works</h2>
            <div className="grid-3">
              {STEPS.map((s) => (
                <div key={s.n}>
                  <div className="tag" style={{ fontSize: 24, marginBottom: 6 }}>{s.n}</div>
                  <h3 style={{ fontSize: 22, marginBottom: 6 }}>{s.t}</h3>
                  <p style={{ color: T.dim, fontSize: 14.5, lineHeight: 1.6, margin: 0 }}>{s.c}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact">
          <div className="wrap" style={vpad(72, 88)}>
            <div className="contact-grid">
              <div>
                <h2 style={{ fontSize: 44 }}>Get a quote</h2>
                <p style={{ color: T.dim, fontSize: 16, lineHeight: 1.65, margin: "14px 0 24px", maxWidth: 420 }}>
                  Tell us about your business and what you need. We'll get back to you.
                </p>
                <p style={{ color: T.dim, fontSize: 14.5, lineHeight: 1.8, margin: 0 }}>
                  Email: <a href={`mailto:${BUSINESS_EMAIL}`} style={{ color: T.accent }}>{BUSINESS_EMAIL}</a>
                  <br />
                  Pretoria, South Africa
                </p>
              </div>
              <ContactForm service={service} setService={setService} />
            </div>
          </div>
        </section>
      </main>

      <footer style={{ borderTop: `2px solid ${T.line}`, background: "rgba(20,20,22,0.9)" }}>
        <div className="wrap" style={{ ...vpad(24), color: T.dim, fontSize: 13.5 }}>
          © {new Date().getFullYear()} ICETECH. All rights reserved.
        </div>
      </footer>
    </>
  );
}



function Stat({ label, value, sub }: any) {
  return (
    <div className="card" style={{ padding: "20px 18px" }}>
      <div style={{ color: T.dim, fontSize: 13.5 }}>{label}</div>
      <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 44, color: T.accent, margin: "4px 0 2px" }}>{value}</div>
      <div style={{ color: T.dim, fontSize: 12.5 }}>{sub}</div>
    </div>
  );
}

const dayKey = (offset: number) =>
  new Date(Date.now() - offset * 86400000).toLocaleDateString("en-CA", { timeZone: "Africa/Johannesburg" });

const dayLabel = (k: string) =>
  new Date(`${k}T12:00:00`).toLocaleDateString("en-ZA", { weekday: "short", day: "numeric", month: "short" });

function Admin() {
  const [token, setToken] = useState<any>(() => {
    try {
      return sessionStorage.getItem("icetech_token");
    } catch (e) {
      return null;
    }
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const [loadError, setLoadError] = useState("");
  const [loaded, setLoaded] = useState(false);

  const login = async (e: any) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError("");
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: sbHeaders(),
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.access_token) {
        sessionStorage.setItem("icetech_token", data.access_token);
        localStorage.setItem("icetech_is_admin", "1");
        setToken(data.access_token);
        setPassword("");
      } else {
        setLoginError("Wrong email or password.");
      }
    } catch (err) {
      setLoginError("Couldn't reach the server. Try again.");
    }
    setLoggingIn(false);
  };

  const loadStats = useCallback(async () => {
    setLoadError("");
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/daily_stats`, {
        method: "POST",
        headers: sbHeaders(token),
        body: JSON.stringify({ days: 30 }),
      });
      if (res.status === 401 || res.status === 403) {
        sessionStorage.removeItem("icetech_token");
        setToken(null);
        setLoginError("Session expired. Please log in again.");
        return;
      }
      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
      setLoaded(true);
    } catch (err) {
      setLoadError("Couldn't load the numbers. Try refreshing.");
    }
  }, [token]);

  useEffect(() => {
    if (token) loadStats();
  }, [token, loadStats]);

  const logout = () => {
    sessionStorage.removeItem("icetech_token");
    setToken(null);
    setRows([]);
    setLoaded(false);
  };

  const byDay: any = {};
  rows.forEach((r: any) => {
    byDay[r.day] = r;
  });
  const days = Array.from({ length: 14 }, (_, i) => {
    const k = dayKey(i);
    const r = byDay[k];
    return { day: k, visitors: r ? Number(r.visitors) : 0, visits: r ? Number(r.visits) : 0 };
  });
  const last7 = days.slice(0, 7).reduce((sum, d) => sum + d.visitors, 0);
  const total30 = rows.reduce((sum: number, r: any) => sum + Number(r.visits), 0);
  const maxV = Math.max(1, ...days.map((d) => d.visitors));

  const inputStyle = {
    width: "100%",
    background: T.panel,
    border: `2px solid ${T.line}`,
    color: T.text,
    padding: "12px 14px",
    fontFamily: "inherit",
    fontSize: 15,
    marginBottom: 14,
  };

  return (
    <div className="wrap" style={{ ...vpad(32, 64), minHeight: "100vh", maxWidth: 1100, margin: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
        <h1 style={{ fontSize: 34 }}>ICETECH Admin</h1>
        <div style={{ display: "flex", gap: 10 }}>
          {token && (
            <>
              <button className="btn btn-ghost" onClick={loadStats} style={{ padding: "8px 14px", fontSize: 14 }}>Refresh</button>
              <button className="btn btn-ghost" onClick={logout} style={{ padding: "8px 14px", fontSize: 14 }}>Log out</button>
            </>
          )}
          <button
            className="btn btn-ghost"
            onClick={() => {
              window.location.hash = "";
            }}
            style={{ padding: "8px 14px", fontSize: 14 }}
          >
            Back to site
          </button>
        </div>
      </div>

      {!TRACKING_ENABLED && (
        <p style={{ color: T.dim, lineHeight: 1.6 }}>
          Visitor tracking isn't set up yet. Add your Supabase URL and key at the top of App.tsx to turn it on.
        </p>
      )}

      {TRACKING_ENABLED && !token && (
        <form onSubmit={login} style={{ maxWidth: 360 }}>
          <p style={{ color: T.dim, margin: "0 0 18px" }}>Log in to see your visitor numbers.</p>
          <input style={inputStyle} type="email" placeholder="Email" autoComplete="username" value={email} onChange={(e: any) => setEmail(e.target.value)} required />
          <input style={inputStyle} type="password" placeholder="Password" autoComplete="current-password" value={password} onChange={(e: any) => setPassword(e.target.value)} required />
          <button className="btn btn-primary" type="submit" disabled={loggingIn}>
            {loggingIn ? "Logging in..." : "Log in"}
          </button>
          {loginError && <p style={{ color: "#ff8080", fontSize: 14, marginTop: 14 }}>{loginError}</p>}
        </form>
      )}

      {TRACKING_ENABLED && token && (
        <>
          {loadError && <p style={{ color: "#ff8080", fontSize: 14 }}>{loadError}</p>}
          {!loaded && !loadError && <p style={{ color: T.dim }}>Loading...</p>}
          {loaded && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 40 }}>
                <Stat label="Visitors today" value={days[0].visitors} sub={`${days[0].visits} visits`} />
                <Stat label="Visitors yesterday" value={days[1].visitors} sub={`${days[1].visits} visits`} />
                <Stat label="Last 7 days" value={last7} sub="daily visitors added up" />
                <Stat label="Last 30 days" value={total30} sub="total visits" />
              </div>

              <h2 style={{ fontSize: 26, marginBottom: 16 }}>Visitors per day (last 14 days)</h2>
              <div>
                {days.map((d) => (
                  <div key={d.day} style={{ display: "grid", gridTemplateColumns: "100px 1fr 40px", gap: 12, alignItems: "center", padding: "7px 0", borderTop: `1px solid ${T.line}` }}>
                    <span style={{ color: T.dim, fontSize: 13.5 }}>{dayLabel(d.day)}</span>
                    <div style={{ background: T.panel, height: 10 }}>
                      <div style={{ width: `${(d.visitors / maxV) * 100}%`, height: 10, background: T.accent }} />
                    </div>
                    <span style={{ textAlign: "right", fontSize: 14 }}>{d.visitors}</span>
                  </div>
                ))}
              </div>
              <p style={{ color: T.dim, fontSize: 12.5, marginTop: 20, lineHeight: 1.6 }}>
                A visitor is one device per day. A visit is counted once each time someone opens the site. Days use South African time.
              </p>
            </>
          )}
        </>
      )}
    </div>
  );
}



export default function App() {
  const [isAdmin, setIsAdmin] = useState(window.location.hash === "#admin");
  const [rainOn, setRainOn] = useState(() => {
    try {
      return localStorage.getItem("icetech_rain") !== "off";
    } catch (e) {
      return true;
    }
  });

  const toggleRain = () => {
    const next = !rainOn;
    setRainOn(next);
    try {
      localStorage.setItem("icetech_rain", next ? "on" : "off");
    } catch (e) {
      
    }
  };

  useEffect(() => {
    const onHash = () => setIsAdmin(window.location.hash === "#admin");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

 
  useEffect(() => {
    if (isAdmin || !TRACKING_ENABLED) return;
    try {
      if (localStorage.getItem("icetech_is_admin") === "1") return;
      if (sessionStorage.getItem("icetech_counted")) return;
      sessionStorage.setItem("icetech_counted", "1");
      let vid = localStorage.getItem("icetech_vid");
      if (!vid) {
        vid = Math.random().toString(36).slice(2) + Date.now().toString(36);
        localStorage.setItem("icetech_vid", vid);
      }
      fetch(`${SUPABASE_URL}/rest/v1/visits`, {
        method: "POST",
        headers: { ...sbHeaders(), Prefer: "return=minimal" },
        body: JSON.stringify({ visitor_id: vid, path: window.location.pathname }),
      }).catch(() => {});
    } catch (e) {
      /* ignore storage errors */
    }
  }, [isAdmin]);

  return (
    <div>
      <style>{css}</style>
      <CodeRain enabled={rainOn} />
      <div className="page">{isAdmin ? <Admin /> : <Site />}</div>
      <button className="rain-toggle" onClick={toggleRain} aria-pressed={rainOn}>
        Code rain: {rainOn ? "on" : "off"}
      </button>
    </div>
  );
}
