import "./HomePage.css";

import { useAuth } from "@/modules/auth/hooks/useAuth";

const STATS = [
  {
    value: "1,240+",
    label: "Animals adopted since 2018",
    delta: "+12% vs last year",
  },
  { value: "86", label: "In our care today", delta: "32 ready to adopt" },
  {
    value: "420",
    label: "Active volunteers",
    delta: "Orientation every month",
  },
  { value: "98%", label: "Post-adoption check-ins", delta: "First 90 days" },
] as const;

const EVENTS = [
  {
    day: "28",
    month: "Mar",
    title: "Weekend adoption fair",
    desc: "Meet dogs and cats, speak with matchmakers, same-day applications.",
    tags: ["Open house", "Family-friendly"],
  },
  {
    day: "05",
    month: "Apr",
    title: "Volunteer orientation",
    desc: "New volunteer onboarding, shelter tour, and role sign-up.",
    tags: ["Volunteers", "RSVP"],
  },
  {
    day: "12",
    month: "Apr",
    title: "Kitten foster info session",
    desc: "Learn how fostering works and take home a starter kit.",
    tags: ["Foster", "Education"],
  },
] as const;

/** March 2026 demo grid: Sun=empty leading, 1 Sat = Mar 1... */
const CAL_WEEKS: (number | null)[][] = [
  [null, null, null, null, null, null, 1],
  [2, 3, 4, 5, 6, 7, 8],
  [9, 10, 11, 12, 13, 14, 15],
  [16, 17, 18, 19, 20, 21, 22],
  [23, 24, 25, 26, 27, 28, 29],
  [30, 31, null, null, null, null, null],
];

const EVENT_DAYS = new Set([5, 12, 28]);

const ADOPTION_STEPS = [
  {
    title: "Browse & filter",
    body: "Search by species, age, energy level, and home type. Save favorites to your shortlist.",
  },
  {
    title: "Meet & match",
    body: "Book a visit or video call. Our staff helps ensure a good fit for your household.",
  },
  {
    title: "Apply & review",
    body: "Submit a short application. We verify references and answer your questions promptly.",
  },
  {
    title: "Go home together",
    body: "Finalize paperwork, medical records, and a transition plan with ongoing support.",
  },
] as const;

const STAFF_PORTALS = [
  {
    role: "Public",
    name: "This site",
    hint: "Adopt, donate, events",
    href: "#top",
    current: true as const,
  },
  {
    role: "Admin",
    name: "Operations",
    hint: "Users, settings, reports",
    href: "#admin",
    current: false as const,
  },
  {
    role: "Volunteer",
    name: "My shifts",
    hint: "Schedule & tasks",
    href: "#volunteer",
    current: false as const,
  },
  {
    role: "Coordinator",
    name: "Teams",
    hint: "Rosters & approvals",
    href: "#coordinator",
    current: false as const,
  },
  {
    role: "Veterinarian",
    name: "Clinical",
    hint: "Records & rounds",
    href: "#vet",
    current: false as const,
  },
] as const;

const HERO_IMAGES = {
  main: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80",
  a: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80",
  b: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&q=80",
} as const;

function Header() {
  const { session, isLoading, signOut } = useAuth();
  const userLabel = isLoading ? "Loading..." : (session?.user.email ?? "Guest");

  return (
    <header className="hp-header">
      <div className="hp-header__inner">
        <a href="#top" className="hp-logo" id="top">
          <span className="hp-logo__mark" aria-hidden>
            🐾
          </span>
          Haven Shelter
        </a>
        <nav className="hp-nav" aria-label="Primary">
          <a href="#adopt">Adopt</a>
          <a href="#events">Events</a>
          <a href="#how-it-works">How it works</a>
          <a href="#portals">Staff</a>
        </nav>
        <div className="hp-header__actions">
          <a className="hp-btn hp-btn--ghost" href="/login">
            Log in
          </a>
          <span className="hp-user-chip" title={userLabel}>
            {userLabel}
          </span>
          {session ? (
            <button
              type="button"
              className="hp-btn hp-btn--ghost"
              onClick={() => void signOut()}
            >
              Sign out
            </button>
          ) : null}
          <a className="hp-btn hp-btn--secondary" href="#events">
            View events
          </a>
          <a className="hp-btn hp-btn--primary" href="/adopt">
            Find a pet
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hp-hero" aria-labelledby="hero-heading">
      <div>
        <p className="hp-hero__eyebrow">
          <span className="hp-badge hp-badge--success">Open visits</span>
          Non-profit · No-kill
        </p>
        <h1 id="hero-heading">Find your companion. Change a life.</h1>
        <p className="hp-hero__lead">
          We match dogs, cats, and small animals with loving homes—supported by
          volunteers, coordinators, and our veterinary team.
        </p>
        <div className="hp-hero__ctas" id="adopt">
          <a className="hp-btn hp-btn--primary" href="/adopt">
            Start adoption
          </a>
          <a className="hp-btn hp-btn--secondary" href="#events">
            See upcoming events
          </a>
        </div>
        <div className="hp-hero__tags" role="list" aria-label="Highlights">
          <span className="hp-tag" role="listitem">
            Spay/neuter included
          </span>
          <span className="hp-tag" role="listitem">
            Behavior support
          </span>
          <span className="hp-tag" role="listitem">
            Foster-to-adopt
          </span>
        </div>
      </div>
      <div className="hp-hero__visual">
        <div className="hp-hero__grid">
          <div className="hp-hero__photo hp-hero__photo--large">
            <img
              src={HERO_IMAGES.main}
              alt="Happy dog looking at the camera in a sunny park"
              width={400}
              height={560}
              loading="eager"
            />
          </div>
          <div className="hp-hero__photo hp-hero__photo--small">
            <img
              src={HERO_IMAGES.a}
              alt="Cat resting peacefully indoors"
              width={320}
              height={200}
              loading="lazy"
            />
          </div>
          <div className="hp-hero__photo hp-hero__photo--small">
            <img
              src={HERO_IMAGES.b}
              alt="Two dogs playing together outdoors"
              width={320}
              height={200}
              loading="lazy"
            />
          </div>
        </div>
        <div className="hp-hero__float-card">
          <span className="hp-badge hp-badge--info">Live</span>
          <div>
            <strong>12 meet-and-greets</strong>
            <span>scheduled this week</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="hp-stats" aria-labelledby="stats-heading">
      <h2 id="stats-heading" className="visually-hidden">
        Shelter impact statistics
      </h2>
      <div className="hp-stats__grid">
        {STATS.map((s) => (
          <article key={s.label} className="hp-stat-card">
            <div className="hp-stat-card__value">{s.value}</div>
            <div className="hp-stat-card__label">{s.label}</div>
            <div className="hp-stat-card__delta">{s.delta}</div>
          </article>
        ))}
      </div>
    </section>
  );
}

function EventsAndCalendar() {
  return (
    <section
      className="hp-section"
      id="events"
      aria-labelledby="events-heading"
    >
      <div className="hp-section__head">
        <div>
          <h2 id="events-heading">Upcoming events</h2>
          <p>Fairs, training, and community days—join us on site or online.</p>
        </div>
        <a className="hp-link" href="#calendar">
          Full calendar →
        </a>
      </div>
      <div className="hp-events-layout">
        <div className="hp-card-list">
          {EVENTS.map((e) => (
            <article key={e.title} className="hp-event-card">
              <div className="hp-event-card__date" aria-hidden>
                <span className="d">{e.day}</span>
                <span className="m">{e.month}</span>
              </div>
              <div className="hp-event-card__body">
                <h3>{e.title}</h3>
                <p>{e.desc}</p>
                <div className="hp-event-card__meta">
                  {e.tags.map((t) => (
                    <span key={t} className="hp-badge hp-badge--neutral">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
        <div
          className="hp-calendar"
          id="calendar"
          aria-label="March 2026 calendar with event days highlighted"
        >
          <div className="hp-calendar__top">
            <h3>March 2026</h3>
            <div className="hp-calendar__nav">
              <button type="button" aria-label="Previous month (demo)">
                ‹
              </button>
              <button type="button" aria-label="Next month (demo)">
                ›
              </button>
            </div>
          </div>
          <div className="hp-calendar__dow">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="hp-calendar__days">
            {CAL_WEEKS.flatMap((week, wi) =>
              week.map((day, di) => {
                if (day === null) {
                  return (
                    <span
                      key={`e-${wi}-${di}`}
                      className="hp-cal-day hp-cal-day--muted"
                      aria-hidden
                    />
                  );
                }
                const isEvent = EVENT_DAYS.has(day);
                const isToday = day === 24;
                const cls = [
                  "hp-cal-day",
                  isEvent && "hp-cal-day--event",
                  isToday && "hp-cal-day--today",
                ]
                  .filter(Boolean)
                  .join(" ");
                if (isEvent) {
                  return (
                    <button
                      key={`${wi}-${di}-${day}`}
                      type="button"
                      className={cls}
                      aria-label={`March ${day}, event scheduled`}
                    >
                      {day}
                    </button>
                  );
                }
                return (
                  <span key={`${wi}-${di}-${day}`} className={cls}>
                    {day}
                  </span>
                );
              }),
            )}
          </div>
          <div className="hp-calendar__legend">
            <span className="hp-calendar__dot" aria-hidden />
            Green days have a listed event (demo).
          </div>
        </div>
      </div>
    </section>
  );
}

function AdoptionHowItWorks() {
  return (
    <section
      className="hp-section"
      id="how-it-works"
      aria-labelledby="how-heading"
    >
      <div className="hp-section__head">
        <div>
          <h2 id="how-heading">How adoption works</h2>
          <p>
            Transparent steps from first click to life at home—no guesswork.
          </p>
        </div>
      </div>
      <div className="hp-steps">
        <div className="hp-steps__grid">
          {ADOPTION_STEPS.map((step, i) => (
            <div key={step.title} className="hp-step">
              <div className="hp-step__num">{i + 1}</div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StaffPortals() {
  return (
    <section
      className="hp-portals"
      id="portals"
      aria-labelledby="portals-heading"
    >
      <div className="hp-portals__inner">
        <h2 id="portals-heading">Role-based workspaces</h2>
        <p>
          Staff and volunteers use dedicated panels (sidebar navigation, tables,
          and calendars) separate from this public site—tiles below map the
          future app shell.
        </p>
        <div className="hp-portals__grid">
          {STAFF_PORTALS.map((p) =>
            p.current ? (
              <div
                key={p.role}
                className="hp-portal-tile"
                style={{ cursor: "default" }}
              >
                <div className="hp-portal-tile__role">{p.role}</div>
                <div className="hp-portal-tile__name">{p.name}</div>
                <div className="hp-portal-tile__hint">{p.hint}</div>
              </div>
            ) : (
              <a key={p.role} className="hp-portal-tile" href={p.href}>
                <div className="hp-portal-tile__role">{p.role}</div>
                <div className="hp-portal-tile__name">{p.name}</div>
                <div className="hp-portal-tile__hint">{p.hint}</div>
              </a>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="hp-footer" id="donate">
      <div className="hp-footer__inner">
        <p>
          © {new Date().getFullYear()} Haven Shelter. A demo UI for coursework.
        </p>
        <nav className="hp-footer__links" aria-label="Footer">
          <a href="#top">Privacy</a>
          <a href="#top">Contact</a>
          <a href="#top">Donate</a>
        </nav>
      </div>
    </footer>
  );
}

export function HomePage() {
  return (
    <div className="shelter-public">
      <a href="#main-content" className="visually-hidden hp-skip-link">
        Skip to main content
      </a>
      <Header />
      <main id="main-content">
        <Hero />
        <StatsSection />
        <EventsAndCalendar />
        <AdoptionHowItWorks />
        <StaffPortals />
      </main>
      <Footer />
    </div>
  );
}
