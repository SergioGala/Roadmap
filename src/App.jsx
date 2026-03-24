import { useState, useRef, useEffect } from "react";

const PHASES = [
  {
    id: 1,
    name: "Cimientos",
    subtitle: "Infraestructura + MVP funcional",
    duration: "Semanas 1–10",
    weeks: 10,
    color: "#E8453C",
    milestone: {
      name: "Beta privada cerrada",
      week: 10,
      icon: "🚀",
    },
    objectives: [
      "Monorepo configurado y CI/CD operativo",
      "Scraping PLACE + 7 autonómicas + DOUE funcionando",
      "Auth, buscador con filtros y alertas email operativos",
      "Web app desplegada con onboarding wizard",
      "Servicio IA: primera extracción de pliegos PDF",
      "50 beta testers invitados",
    ],
    tasks: {
      backend: [
        { t: "Setup monorepo Turborepo + NestJS scaffold", p: "critical", w: "S1" },
        { t: "Auth module: JWT + refresh tokens + roles", p: "critical", w: "S1-2" },
        { t: "Módulo de scraping PLACE (ATOM/RSS feeds + datasets abiertos)", p: "critical", w: "S2-4" },
        { t: "Scrapers plataformas autonómicas (CAT, PV, MAD, GAL, AND, NAV, RIO)", p: "critical", w: "S3-6" },
        { t: "Scraper DOUE + BOE + boletines provinciales", p: "important", w: "S5-7" },
        { t: "API REST: endpoints licitaciones (CRUD, filtros, paginación)", p: "critical", w: "S3-5" },
        { t: "Motor de alertas: cron jobs + queue (BullMQ) + envío email (Resend)", p: "critical", w: "S5-7" },
        { t: "Base de datos: PostgreSQL + Prisma ORM + esquema inicial", p: "critical", w: "S1-2" },
        { t: "Cache layer: Redis para búsquedas frecuentes", p: "important", w: "S6-7" },
        { t: "Módulo de onboarding: auto-detección sector por NIF/CNAE", p: "important", w: "S7-8" },
        { t: "Infraestructura: Docker + Railway/Fly.io deploy + CI/CD GitHub Actions", p: "critical", w: "S1-3" },
        { t: "Logging + monitoring: Sentry + estructurado", p: "important", w: "S8-9" },
        { t: "Rate limiting + seguridad API", p: "important", w: "S9-10" },
      ],
      web: [
        { t: "Setup React + Vite + TailwindCSS + shadcn/ui", p: "critical", w: "S1" },
        { t: "Design system: tokens, tipografía, colores, componentes base", p: "critical", w: "S1-2" },
        { t: "Auth pages: login, registro, recuperar contraseña", p: "critical", w: "S2-3" },
        { t: "Onboarding wizard: sector → ubicación → tamaño → CPVs auto", p: "critical", w: "S4-6" },
        { t: "Buscador de licitaciones: filtros (CPV, ubicación, importe, tipo, estado)", p: "critical", w: "S5-7" },
        { t: "Ficha de licitación: detalle completo + enlace pliegos + timeline", p: "critical", w: "S6-7" },
        { t: "Panel de alertas: crear, editar, activar/desactivar", p: "critical", w: "S7-8" },
        { t: "Dashboard home: resumen del día, licitaciones nuevas, próximos vencimientos", p: "important", w: "S8-9" },
        { t: "Responsive design mobile-first", p: "important", w: "S9-10" },
        { t: "PWA: service worker, manifest, offline básico", p: "nice", w: "S10" },
      ],
      mobile: [
        { t: "Setup React Native + Expo + navegación (expo-router)", p: "critical", w: "S3-4" },
        { t: "Auth screens compartiendo lógica con web", p: "critical", w: "S5-6" },
        { t: "Push notifications: setup Firebase Cloud Messaging", p: "critical", w: "S6-7" },
        { t: "Feed de licitaciones: lista con filtro rápido + swipe interesa/descarta", p: "important", w: "S7-9" },
        { t: "Ficha de licitación mobile-optimized", p: "important", w: "S9-10" },
        { t: "Deep linking: abrir licitación desde push notification", p: "nice", w: "S10" },
      ],
      ia: [
        { t: "Setup repo Python: FastAPI + estructura de proyecto", p: "critical", w: "S1-2" },
        { t: "Pipeline ingesta: descargar + parsear PDFs de pliegos (PyMuPDF/pdfplumber)", p: "critical", w: "S2-4" },
        { t: "Chunking + embeddings de pliegos (OpenAI/local)", p: "critical", w: "S4-6" },
        { t: "Vector store: Qdrant/Pinecone para búsqueda semántica", p: "critical", w: "S5-7" },
        { t: "Endpoint: resumen automático de licitación (3 frases clave)", p: "critical", w: "S7-8" },
        { t: "Endpoint: chat con pliego (RAG básico)", p: "important", w: "S8-10" },
        { t: "Pipeline de enriquecimiento: clasificar licitaciones por sector/tipo automáticamente", p: "important", w: "S9-10" },
      ],
    },
    dependencies: [
      { from: "Backend: Auth module", to: "Web: Auth pages", type: "blocks" },
      { from: "Backend: Auth module", to: "Mobile: Auth screens", type: "blocks" },
      { from: "Backend: API licitaciones", to: "Web: Buscador", type: "blocks" },
      { from: "Backend: Scraping PLACE", to: "IA: Pipeline ingesta PDFs", type: "feeds" },
      { from: "Backend: Motor de alertas", to: "Mobile: Push notifications", type: "blocks" },
      { from: "IA: Resumen automático", to: "Web: Ficha licitación (resumen IA)", type: "enhances" },
    ],
  },
  {
    id: 2,
    name: "Diferenciación",
    subtitle: "IA potente + gestión + mobile + subvenciones",
    duration: "Semanas 11–22",
    weeks: 12,
    color: "#F59E0B",
    milestone: {
      name: "Lanzamiento público",
      week: 22,
      icon: "⚡",
    },
    objectives: [
      "App móvil publicada en App Store y Play Store",
      "Chat IA con pliegos + Score de idoneidad por licitación",
      "Gestión tipo Kanban de licitaciones en proceso",
      "Subvenciones integradas (BDNS + autonómicas)",
      "Integración Slack + Google Calendar",
      "Plan gratuito + Pro (49€/mes) activos con Stripe",
      "2.000 usuarios, 200 de pago",
    ],
    tasks: {
      backend: [
        { t: "Módulo de subvenciones: scraping BDNS + fuentes autonómicas", p: "critical", w: "S11-14" },
        { t: "API de gestión: boards Kanban, estados, asignar responsable", p: "critical", w: "S11-13" },
        { t: "Módulo de pagos: Stripe subscriptions + webhooks + planes", p: "critical", w: "S13-15" },
        { t: "API de análisis de competencia: histórico adjudicaciones por empresa/CPV", p: "critical", w: "S14-17" },
        { t: "Endpoint score de idoneidad (conecta con servicio IA)", p: "critical", w: "S16-18" },
        { t: "Webhooks Slack: enviar licitaciones a canal", p: "important", w: "S17-18" },
        { t: "Google Calendar API: crear eventos con deadlines", p: "important", w: "S18-19" },
        { t: "API pública v1: documentación OpenAPI + API keys", p: "important", w: "S19-21" },
        { t: "Sistema de roles y permisos granular (admin, editor, viewer)", p: "important", w: "S20-21" },
        { t: "Optimización queries: índices, materialised views, query caching", p: "nice", w: "S21-22" },
      ],
      web: [
        { t: "Kanban board: drag & drop, estados personalizables, filtros", p: "critical", w: "S11-14" },
        { t: "Chat IA con pliegos: interfaz conversacional sobre documentos", p: "critical", w: "S14-16" },
        { t: "Score de idoneidad: badge visual en cada licitación", p: "critical", w: "S16-17" },
        { t: "Sección subvenciones: buscador + alertas + fichas", p: "critical", w: "S14-17" },
        { t: "Panel de análisis de competencia: gráficos, top adjudicatarios, bajas", p: "critical", w: "S17-19" },
        { t: "Página de pricing + checkout Stripe integrado", p: "critical", w: "S15-16" },
        { t: "Settings: integraciones (Slack, Calendar), perfil, equipo", p: "important", w: "S18-20" },
        { t: "Notificaciones in-app: bell icon + dropdown + mark as read", p: "important", w: "S19-20" },
        { t: "Landing page pública: SEO, copy, social proof", p: "important", w: "S20-22" },
        { t: "Docs/ayuda: centro de ayuda + tooltips contextuales", p: "nice", w: "S21-22" },
      ],
      mobile: [
        { t: "Kanban mobile: vista simplificada con swipe entre columnas", p: "critical", w: "S13-15" },
        { t: "Subvenciones en app: feed unificado licitaciones + subvenciones", p: "critical", w: "S16-18" },
        { t: "Chat IA mobile: interfaz nativa de conversación", p: "important", w: "S17-19" },
        { t: "Score de idoneidad: badge + explicación expandible", p: "important", w: "S18-19" },
        { t: "Análisis de competencia: gráficos nativos (Victory Native)", p: "nice", w: "S19-21" },
        { t: "App Store / Play Store: submit + assets + descripción ASO", p: "critical", w: "S20-22" },
        { t: "Widget iOS: próximas licitaciones / deadlines", p: "nice", w: "S22" },
      ],
      ia: [
        { t: "Score de idoneidad: modelo que evalúa encaje empresa↔licitación", p: "critical", w: "S11-14" },
        { t: "Chat avanzado con pliegos: RAG multi-documento + memoria conversación", p: "critical", w: "S13-16" },
        { t: "Extracción estructurada: requisitos, criterios, plazos, importes desde pliegos", p: "critical", w: "S15-18" },
        { t: "Predicción de precio óptimo: modelo basado en histórico de adjudicaciones", p: "important", w: "S17-20" },
        { t: "Clasificador de subvenciones: enriquecer datos BDNS con IA", p: "important", w: "S18-20" },
        { t: "Detección de licitaciones similares: embeddings + cosine similarity", p: "nice", w: "S20-22" },
      ],
    },
    dependencies: [
      { from: "Backend: Módulo subvenciones", to: "Web: Sección subvenciones", type: "blocks" },
      { from: "Backend: API gestión Kanban", to: "Web: Kanban board", type: "blocks" },
      { from: "Backend: API gestión Kanban", to: "Mobile: Kanban mobile", type: "blocks" },
      { from: "IA: Score de idoneidad", to: "Backend: Endpoint score", type: "blocks" },
      { from: "Backend: Endpoint score", to: "Web: Score badge", type: "blocks" },
      { from: "IA: Chat avanzado", to: "Web: Chat IA con pliegos", type: "blocks" },
      { from: "Backend: Stripe", to: "Web: Pricing + checkout", type: "blocks" },
    ],
  },
  {
    id: 3,
    name: "Killer Features",
    subtitle: "Generador de ofertas + predicción + deep analytics",
    duration: "Semanas 23–40",
    weeks: 18,
    color: "#8B5CF6",
    milestone: {
      name: "1.000 usuarios de pago",
      week: 40,
      icon: "🏆",
    },
    objectives: [
      "Generador de ofertas técnicas con IA (killer feature)",
      "Repositorio documental reutilizable (DEUC, certificados, experiencia)",
      "Predicción de candidatos y bajas por licitación",
      "Búsqueda semántica dentro de pliegos",
      "Integraciones: Notion, Teams, Zapier",
      "Dashboard BI avanzado con métricas sectoriales",
      "10.000 usuarios totales, 1.000 de pago",
    ],
    tasks: {
      backend: [
        { t: "Módulo documental: vault de empresa (DEUC, certificados, experiencia)", p: "critical", w: "S23-26" },
        { t: "API generación ofertas: orquesta llamadas al servicio IA", p: "critical", w: "S26-30" },
        { t: "Búsqueda full-text dentro de pliegos (Elasticsearch/Meilisearch)", p: "critical", w: "S25-28" },
        { t: "API predicción candidatos/bajas (conecta con IA)", p: "important", w: "S28-32" },
        { t: "Webhooks + Zapier: eventos de licitación como triggers", p: "important", w: "S30-33" },
        { t: "Integración Notion API: crear pages con datos de licitación", p: "important", w: "S33-35" },
        { t: "Integración Microsoft Teams: bot + notificaciones", p: "nice", w: "S35-37" },
        { t: "Dashboard BI: aggregation pipelines + endpoints analíticos", p: "important", w: "S32-36" },
        { t: "Multi-tenancy avanzado: workspaces, invitaciones, SSO (OAuth)", p: "important", w: "S36-39" },
        { t: "Audit log: tracking de acciones por usuario", p: "nice", w: "S39-40" },
      ],
      web: [
        { t: "Vault documental: upload, organizar, versionar documentos de empresa", p: "critical", w: "S25-28" },
        { t: "Generador de ofertas: wizard paso a paso → borrador IA → editar → exportar", p: "critical", w: "S28-34" },
        { t: "Editor de ofertas: rich text con sugerencias IA inline", p: "critical", w: "S32-36" },
        { t: "Búsqueda en pliegos: search bar global con resultados dentro de PDFs", p: "critical", w: "S27-30" },
        { t: "Predicción visual: quién se va a presentar + baja estimada", p: "important", w: "S30-33" },
        { t: "Dashboard BI: gráficos interactivos (Recharts), métricas por sector/zona", p: "important", w: "S34-38" },
        { t: "Settings integraciones: Notion, Teams, Zapier configuración", p: "nice", w: "S35-38" },
        { t: "Exportar informes a PDF/Excel", p: "nice", w: "S38-40" },
      ],
      mobile: [
        { t: "Vault documental: acceso mobile + cámara para escanear docs", p: "important", w: "S28-31" },
        { t: "Generador ofertas mobile: review + aprobar borradores desde móvil", p: "important", w: "S34-37" },
        { t: "Predicción candidatos: vista mobile con cards", p: "nice", w: "S35-38" },
        { t: "Offline mode: cache de licitaciones guardadas", p: "nice", w: "S38-40" },
      ],
      ia: [
        { t: "Generador de memoria técnica: LLM fine-tuned con pliegos + perfil empresa", p: "critical", w: "S23-30" },
        { t: "Auto-relleno DEUC: extraer datos empresa y mapear a campos DEUC", p: "critical", w: "S26-29" },
        { t: "Generador propuesta económica: precio óptimo + desglose sugerido", p: "critical", w: "S28-33" },
        { t: "Predicción de candidatos: modelo basado en histórico + features empresa", p: "important", w: "S30-35" },
        { t: "Predicción de bajas: regresión sobre datos históricos de adjudicación", p: "important", w: "S33-37" },
        { t: "Mejora RAG: reranking + citation de fuentes dentro del pliego", p: "important", w: "S35-38" },
        { t: "Feedback loop: aprender de ofertas ganadoras vs perdedoras", p: "nice", w: "S38-40" },
      ],
    },
    dependencies: [
      { from: "Backend: Módulo documental", to: "Web: Vault documental", type: "blocks" },
      { from: "IA: Generador memoria técnica", to: "Backend: API generación ofertas", type: "blocks" },
      { from: "Backend: API generación ofertas", to: "Web: Generador de ofertas wizard", type: "blocks" },
      { from: "IA: Auto-relleno DEUC", to: "Web: Vault documental (auto-fill)", type: "enhances" },
      { from: "Backend: Búsqueda full-text pliegos", to: "Web: Búsqueda en pliegos", type: "blocks" },
      { from: "IA: Predicción candidatos", to: "Backend: API predicción", type: "blocks" },
    ],
  },
  {
    id: 4,
    name: "Escala & Expansión",
    subtitle: "Internacionalización + marketplace + enterprise",
    duration: "Semanas 41–56+",
    weeks: 16,
    color: "#06B6D4",
    milestone: {
      name: "3.000+ pago · 250K€ MRR",
      week: 56,
      icon: "👑",
    },
    objectives: [
      "Expansión Portugal + Latinoamérica (primeras fuentes)",
      "Plan Enterprise con white-label + SSO + SLA",
      "Marketplace de expertos en licitaciones",
      "Comunidad + academia de formación",
      "30.000 usuarios, 3.000 de pago",
      "Revenue: 250-300K€/mes",
    ],
    tasks: {
      backend: [
        { t: "i18n: multi-idioma (ES, PT, EN) en API + contenido", p: "critical", w: "S41-44" },
        { t: "Scrapers Portugal (BASE.gov.pt) + Latam (primeras fuentes)", p: "critical", w: "S43-48" },
        { t: "White-label: custom domains, branding, themes por tenant", p: "important", w: "S45-49" },
        { t: "SSO: SAML + OAuth enterprise", p: "important", w: "S47-50" },
        { t: "Marketplace: perfiles expertos, booking, pagos, reviews", p: "important", w: "S48-53" },
        { t: "SLA monitoring + uptime guarantees + dedicated support", p: "nice", w: "S52-55" },
        { t: "Data export GDPR + compliance enterprise", p: "important", w: "S53-56" },
      ],
      web: [
        { t: "Multi-idioma UI: i18next + traducción completa", p: "critical", w: "S42-46" },
        { t: "Marketplace: directorio expertos, perfiles, solicitar asesoría", p: "important", w: "S48-53" },
        { t: "Academia: cursos, vídeos, certificaciones", p: "nice", w: "S50-54" },
        { t: "Admin panel enterprise: gestión tenants, billing, analytics", p: "important", w: "S46-50" },
        { t: "Comunidad: foro, rankings, casos de éxito", p: "nice", w: "S52-56" },
      ],
      mobile: [
        { t: "Multi-idioma mobile", p: "critical", w: "S44-46" },
        { t: "Marketplace mobile: buscar expertos, chat, booking", p: "important", w: "S50-54" },
        { t: "Apple Watch: notificaciones de deadlines", p: "nice", w: "S54-56" },
      ],
      ia: [
        { t: "Multi-lingual: modelos adaptados a PT/EN para pliegos internacionales", p: "critical", w: "S43-48" },
        { t: "Auto-mejora: fine-tuning con feedback de ofertas ganadoras", p: "important", w: "S48-53" },
        { t: "Recomendador inteligente: licitaciones proactivas basadas en perfil + historial", p: "important", w: "S50-55" },
        { t: "Analytics IA: insights automáticos sobre tendencias de mercado", p: "nice", w: "S53-56" },
      ],
    },
    dependencies: [
      { from: "Backend: i18n", to: "Web: Multi-idioma UI", type: "blocks" },
      { from: "Backend: i18n", to: "Mobile: Multi-idioma", type: "blocks" },
      { from: "Backend: Scrapers Portugal", to: "IA: Multi-lingual", type: "feeds" },
      { from: "Backend: Marketplace", to: "Web: Marketplace", type: "blocks" },
    ],
  },
];

const LAYERS = [
  { key: "backend", label: "Backend", sub: "NestJS · PostgreSQL · Redis", color: "#3B82F6", icon: "⚙️" },
  { key: "web", label: "Web App", sub: "React · Vite · TailwindCSS", color: "#10B981", icon: "🌐" },
  { key: "mobile", label: "Mobile", sub: "React Native · Expo", color: "#F59E0B", icon: "📱" },
  { key: "ia", label: "Servicio IA", sub: "Python · FastAPI · LLMs", color: "#8B5CF6", icon: "🧠" },
];

const priorityConfig = {
  critical: { label: "MVP Crítico", color: "#EF4444", bg: "rgba(239,68,68,0.12)", dot: "🔴" },
  important: { label: "Importante", color: "#F59E0B", bg: "rgba(245,158,11,0.10)", dot: "🟡" },
  nice: { label: "Nice-to-have", color: "#22C55E", bg: "rgba(34,197,94,0.10)", dot: "🟢" },
};

export default function Roadmap() {
  const [activePhase, setActivePhase] = useState(0);
  const [activeLayer, setActiveLayer] = useState(null);
  const [showDeps, setShowDeps] = useState(false);
  const [filterPriority, setFilterPriority] = useState(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activePhase]);

  const phase = PHASES[activePhase];

  const filteredTasks = (layerKey) => {
    const tasks = phase.tasks[layerKey] || [];
    if (!filterPriority) return tasks;
    return tasks.filter((t) => t.p === filterPriority);
  };

  const totalTasks = Object.values(phase.tasks).flat().length;
  const criticalCount = Object.values(phase.tasks).flat().filter((t) => t.p === "critical").length;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0B0E14",
      color: "#E2E8F0",
      fontFamily: "'Segoe UI', 'SF Pro Display', -apple-system, sans-serif",
    }}>
      {/* Header */}
      <div style={{
        padding: "28px 32px 0",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18,
          }}>📋</div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>
              Product Roadmap
            </h1>
            <p style={{ fontSize: 12, color: "#64748B", margin: 0 }}>
              SaaS Licitaciones · 56 semanas · 4 fases · 2 repos
            </p>
          </div>
        </div>

        {/* Phase Tabs */}
        <div style={{
          display: "flex", gap: 4, marginTop: 20, overflowX: "auto",
          paddingBottom: 0,
        }}>
          {PHASES.map((ph, i) => (
            <button
              key={ph.id}
              onClick={() => setActivePhase(i)}
              style={{
                padding: "10px 18px",
                borderRadius: "10px 10px 0 0",
                border: "1px solid",
                borderBottom: "none",
                borderColor: activePhase === i ? ph.color + "44" : "transparent",
                background: activePhase === i ? ph.color + "15" : "transparent",
                color: activePhase === i ? ph.color : "#64748B",
                fontSize: 13,
                fontWeight: activePhase === i ? 700 : 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{
                width: 22, height: 22, borderRadius: 6,
                background: activePhase === i ? ph.color : "#1E293B",
                color: activePhase === i ? "#fff" : "#64748B",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700,
              }}>{ph.id}</span>
              <span>{ph.name}</span>
              <span style={{ fontSize: 11, opacity: 0.6 }}>{ph.duration}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Timeline bar */}
      <div style={{
        padding: "0 32px",
        background: "#0F1219",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{
          display: "flex", height: 40, alignItems: "center", gap: 2,
          position: "relative",
        }}>
          {PHASES.map((ph, i) => {
            const totalWeeks = PHASES.reduce((s, p) => s + p.weeks, 0);
            const pct = (ph.weeks / totalWeeks) * 100;
            return (
              <div
                key={ph.id}
                onClick={() => setActivePhase(i)}
                style={{
                  width: pct + "%",
                  height: activePhase === i ? 8 : 4,
                  borderRadius: 4,
                  background: activePhase === i ? ph.color : ph.color + "33",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  position: "relative",
                }}
              >
                {/* Milestone marker */}
                <div style={{
                  position: "absolute",
                  right: -1,
                  top: -14,
                  fontSize: 14,
                  filter: activePhase === i ? "none" : "grayscale(1) opacity(0.4)",
                }}>{ph.milestone.icon}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Phase header */}
      <div style={{ padding: "24px 32px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span style={{
                fontSize: 28, fontWeight: 800, color: phase.color,
                letterSpacing: "-0.03em",
              }}>Fase {phase.id}</span>
              <span style={{
                background: phase.color + "22",
                color: phase.color,
                padding: "3px 12px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
              }}>{phase.duration}</span>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: "-0.01em" }}>
              {phase.name} <span style={{ fontWeight: 400, color: "#64748B", fontSize: 16 }}>— {phase.subtitle}</span>
            </h2>
          </div>
          <div style={{
            display: "flex", gap: 16, alignItems: "center",
            background: "#111520", borderRadius: 10, padding: "8px 16px",
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{totalTasks}</div>
              <div style={{ fontSize: 10, color: "#64748B", textTransform: "uppercase", letterSpacing: 1 }}>Tareas</div>
            </div>
            <div style={{ width: 1, height: 28, background: "#1E293B" }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#EF4444" }}>{criticalCount}</div>
              <div style={{ fontSize: 10, color: "#64748B", textTransform: "uppercase", letterSpacing: 1 }}>Críticas</div>
            </div>
            <div style={{ width: 1, height: 28, background: "#1E293B" }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 14 }}>{phase.milestone.icon}</div>
              <div style={{ fontSize: 10, color: "#64748B", textTransform: "uppercase", letterSpacing: 1 }}>Hito</div>
            </div>
          </div>
        </div>

        {/* Milestone callout */}
        <div style={{
          marginTop: 16,
          background: phase.color + "10",
          border: `1px solid ${phase.color}33`,
          borderRadius: 10,
          padding: "12px 18px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}>
          <span style={{ fontSize: 20 }}>{phase.milestone.icon}</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: phase.color }}>
              Milestone — Semana {phase.milestone.week}
            </div>
            <div style={{ fontSize: 13, color: "#94A3B8" }}>{phase.milestone.name}</div>
          </div>
        </div>

        {/* Objectives */}
        <div style={{
          marginTop: 14,
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
        }}>
          {phase.objectives.map((obj, i) => (
            <span key={i} style={{
              background: "#111520",
              border: "1px solid #1E293B",
              borderRadius: 6,
              padding: "4px 10px",
              fontSize: 12,
              color: "#94A3B8",
            }}>✓ {obj}</span>
          ))}
        </div>

        {/* Filters */}
        <div style={{
          marginTop: 16,
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexWrap: "wrap",
        }}>
          <span style={{ fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: 1, marginRight: 4 }}>Filtrar:</span>
          {Object.entries(priorityConfig).map(([key, cfg]) => (
            <button key={key} onClick={() => setFilterPriority(filterPriority === key ? null : key)} style={{
              padding: "4px 12px",
              borderRadius: 6,
              border: `1px solid ${filterPriority === key ? cfg.color + "66" : "#1E293B"}`,
              background: filterPriority === key ? cfg.bg : "transparent",
              color: filterPriority === key ? cfg.color : "#64748B",
              fontSize: 12,
              cursor: "pointer",
              fontWeight: filterPriority === key ? 600 : 400,
              transition: "all 0.2s",
            }}>{cfg.dot} {cfg.label}</button>
          ))}
          <button onClick={() => setShowDeps(!showDeps)} style={{
            padding: "4px 12px",
            borderRadius: 6,
            border: `1px solid ${showDeps ? "#3B82F6" + "66" : "#1E293B"}`,
            background: showDeps ? "rgba(59,130,246,0.1)" : "transparent",
            color: showDeps ? "#3B82F6" : "#64748B",
            fontSize: 12,
            cursor: "pointer",
            fontWeight: showDeps ? 600 : 400,
            marginLeft: 8,
          }}>🔗 Dependencias</button>
          <button onClick={() => setActiveLayer(activeLayer ? null : "all")} style={{
            padding: "4px 12px",
            borderRadius: 6,
            border: `1px solid ${activeLayer ? "#06B6D4" + "66" : "#1E293B"}`,
            background: activeLayer ? "rgba(6,182,212,0.1)" : "transparent",
            color: activeLayer ? "#06B6D4" : "#64748B",
            fontSize: 12,
            cursor: "pointer",
          }}>{activeLayer ? "Mostrar todo" : "Colapsar capas"}</button>
        </div>
      </div>

      {/* Dependencies panel */}
      {showDeps && (
        <div style={{ padding: "0 32px 16px" }}>
          <div style={{
            background: "#111520",
            border: "1px solid #1E293B",
            borderRadius: 10,
            padding: 16,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: "#3B82F6" }}>
              🔗 Dependencias entre capas — Fase {phase.id}
            </div>
            {phase.dependencies.map((dep, i) => (
              <div key={i} style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 0",
                fontSize: 12,
                color: "#94A3B8",
                borderBottom: i < phase.dependencies.length - 1 ? "1px solid #1A1F2E" : "none",
              }}>
                <span style={{
                  background: dep.type === "blocks" ? "rgba(239,68,68,0.15)" : dep.type === "feeds" ? "rgba(245,158,11,0.15)" : "rgba(34,197,94,0.15)",
                  color: dep.type === "blocks" ? "#EF4444" : dep.type === "feeds" ? "#F59E0B" : "#22C55E",
                  padding: "2px 8px",
                  borderRadius: 4,
                  fontSize: 10,
                  fontWeight: 600,
                  minWidth: 60,
                  textAlign: "center",
                }}>
                  {dep.type === "blocks" ? "BLOQUEA" : dep.type === "feeds" ? "ALIMENTA" : "MEJORA"}
                </span>
                <span style={{ color: "#CBD5E1" }}>{dep.from}</span>
                <span style={{ color: "#475569" }}>→</span>
                <span style={{ color: "#CBD5E1" }}>{dep.to}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Task Layers */}
      <div ref={contentRef} style={{ padding: "0 32px 40px" }}>
        {LAYERS.map((layer) => {
          const tasks = filteredTasks(layer.key);
          if (tasks.length === 0 && filterPriority) return null;

          return (
            <div key={layer.key} style={{
              marginTop: 16,
              background: "#0F1219",
              border: `1px solid ${layer.color}22`,
              borderRadius: 12,
              overflow: "hidden",
            }}>
              {/* Layer Header */}
              <div
                onClick={() => setActiveLayer(activeLayer === layer.key ? null : layer.key)}
                style={{
                  padding: "14px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  borderBottom: `1px solid ${layer.color}15`,
                  background: layer.color + "08",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 20 }}>{layer.icon}</span>
                  <div>
                    <span style={{ fontSize: 15, fontWeight: 700, color: layer.color }}>{layer.label}</span>
                    <span style={{ fontSize: 11, color: "#64748B", marginLeft: 10 }}>{layer.sub}</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{
                    background: layer.color + "22",
                    color: layer.color,
                    padding: "2px 10px",
                    borderRadius: 10,
                    fontSize: 12,
                    fontWeight: 700,
                  }}>{tasks.length}</span>
                  <span style={{ color: "#475569", fontSize: 14, transition: "transform 0.2s", transform: activeLayer === layer.key ? "rotate(180deg)" : "none" }}>▾</span>
                </div>
              </div>

              {/* Tasks */}
              {activeLayer !== layer.key && (
                <div style={{ padding: "8px 12px 12px" }}>
                  {tasks.map((task, i) => {
                    const pr = priorityConfig[task.p];
                    return (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 10,
                          padding: "8px 10px",
                          borderRadius: 8,
                          margin: "2px 0",
                          background: "transparent",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#141824"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                      >
                        <span style={{ fontSize: 11, marginTop: 2 }}>{pr.dot}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: 13,
                            color: "#CBD5E1",
                            lineHeight: 1.5,
                          }}>{task.t}</div>
                        </div>
                        <span style={{
                          fontFamily: "'SF Mono', 'Fira Code', monospace",
                          fontSize: 11,
                          color: "#475569",
                          whiteSpace: "nowrap",
                          background: "#111520",
                          padding: "2px 8px",
                          borderRadius: 4,
                          marginTop: 1,
                        }}>{task.w}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Architecture Footer */}
      <div style={{
        padding: "24px 32px 32px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "#0A0D12",
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, color: "#64748B", textTransform: "uppercase", letterSpacing: 1 }}>
          Arquitectura de repositorios
        </div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div style={{
            flex: "1 1 300px",
            background: "#111520",
            border: "1px solid #1E293B",
            borderRadius: 10,
            padding: 18,
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#3B82F6", marginBottom: 8 }}>
              📦 Repo 1 — Monorepo JS/TS (Turborepo)
            </div>
            <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.8, fontFamily: "monospace" }}>
              <div>├─ apps/</div>
              <div>│ ├─ <span style={{color:"#3B82F6"}}>backend/</span> NestJS · REST API · Auth · Scraping · Integraciones</div>
              <div>│ ├─ <span style={{color:"#10B981"}}>web/</span> React · Vite · TailwindCSS · shadcn/ui · PWA</div>
              <div>│ └─ <span style={{color:"#F59E0B"}}>mobile/</span> React Native · Expo · Push notifications</div>
              <div>├─ packages/</div>
              <div>│ ├─ shared/ Tipos TS · Validaciones · Constantes</div>
              <div>│ └─ ui/ Componentes compartidos web+mobile</div>
              <div>├─ turbo.json</div>
              <div>└─ package.json</div>
            </div>
          </div>
          <div style={{
            flex: "1 1 300px",
            background: "#111520",
            border: "1px solid #1E293B",
            borderRadius: 10,
            padding: 18,
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#8B5CF6", marginBottom: 8 }}>
              🧠 Repo 2 — Servicio IA (Python)
            </div>
            <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.8, fontFamily: "monospace" }}>
              <div>├─ app/</div>
              <div>│ ├─ <span style={{color:"#8B5CF6"}}>api/</span> FastAPI endpoints · REST interno</div>
              <div>│ ├─ <span style={{color:"#8B5CF6"}}>ingestion/</span> PDF parsing · Chunking · Embeddings</div>
              <div>│ ├─ <span style={{color:"#8B5CF6"}}>models/</span> Score idoneidad · Predicción precios · Candidatos</div>
              <div>│ ├─ <span style={{color:"#8B5CF6"}}>generation/</span> Memorias técnicas · DEUC · Propuestas</div>
              <div>│ └─ <span style={{color:"#8B5CF6"}}>rag/</span> Vector store · Retrieval · Chat con pliegos</div>
              <div>├─ requirements.txt</div>
              <div>├─ Dockerfile</div>
              <div>└─ docker-compose.yml</div>
            </div>
          </div>
        </div>

        <div style={{
          marginTop: 16,
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
        }}>
          {[
            { l: "PostgreSQL", c: "#336791" },
            { l: "Redis", c: "#DC382D" },
            { l: "Elasticsearch", c: "#FEC514" },
            { l: "Qdrant", c: "#DC3545" },
            { l: "BullMQ", c: "#EF4444" },
            { l: "Stripe", c: "#635BFF" },
            { l: "Firebase FCM", c: "#FFCA28" },
            { l: "Resend", c: "#000" },
            { l: "OpenAI / Local LLM", c: "#10A37F" },
            { l: "Docker", c: "#2496ED" },
            { l: "GitHub Actions", c: "#2088FF" },
          ].map((tech) => (
            <span key={tech.l} style={{
              background: tech.c + "18",
              border: `1px solid ${tech.c}44`,
              color: "#CBD5E1",
              padding: "3px 10px",
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 500,
            }}>{tech.l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}