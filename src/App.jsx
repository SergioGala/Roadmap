
Copiar

import { useState, useMemo } from "react";
 
const FEATURES = [
  // ══════════ INGESTA DE DATOS ══════════
  {
    id: "ingesta-place",
    name: "Scraping PLACE (feed ATOM/CODICE)",
    desc: "Ingesta de ~90% de licitaciones de España desde los feeds públicos XML de PLACE. Fuente principal.",
    category: "Ingesta de datos",
    priority: "core",
    cost: null,
    costNote: null,
    effort: "alta",
  },
  {
    id: "ingesta-place-historico",
    name: "Carga histórica PLACE (ZIPs 2024-presente)",
    desc: "Descarga de ficheros ZIP históricos para tener licitaciones pasadas desde 2024. Necesario para análisis de competencia y adjudicaciones.",
    category: "Ingesta de datos",
    priority: "core",
    cost: null,
    costNote: null,
    effort: "media",
  },
  {
    id: "ingesta-boe",
    name: "API BOE (Boletín Oficial del Estado)",
    desc: "Sección III del BOE con concursos y contratos. API XML pública sin auth.",
    category: "Ingesta de datos",
    priority: "core",
    cost: null,
    costNote: null,
    effort: "baja",
  },
  {
    id: "ingesta-ted",
    name: "API TED (licitaciones europeas)",
    desc: "Licitaciones por encima del umbral SARA publicadas en el Diario Oficial de la UE. API REST con JSON. API key gratis.",
    category: "Ingesta de datos",
    priority: "importante",
    cost: null,
    costNote: null,
    effort: "baja",
  },
  {
    id: "ingesta-autonomicas",
    name: "Scrapers plataformas autonómicas (7 CCAA)",
    desc: "Cataluña, País Vasco, Madrid, Galicia, Andalucía, Navarra, La Rioja. Scraping HTML con Playwright. Enriquece datos que PLACE ya tiene.",
    category: "Ingesta de datos",
    priority: "importante",
    cost: null,
    costNote: null,
    effort: "alta",
  },
  {
    id: "ingesta-boletines",
    name: "Boletines autonómicos (10 CCAA sin plataforma propia)",
    desc: "Aragón, C. Valenciana, Castilla y León, CLM, Extremadura, Murcia, Asturias, Cantabria, Baleares, Canarias. Scraping HTML/RSS.",
    category: "Ingesta de datos",
    priority: "deseable",
    cost: null,
    costNote: null,
    effort: "alta",
  },
  {
    id: "ingesta-bops",
    name: "34 BOPs provinciales",
    desc: "Boletines oficiales provinciales. Muchos solo PDF, requieren OCR. Cubren ayuntamientos y diputaciones.",
    category: "Ingesta de datos",
    priority: "deseable",
    cost: "~5-15€/mes",
    costNote: "OCR con Tesseract es gratis pero si usas servicios cloud de OCR o IA para interpretar PDFs, hay coste.",
    effort: "muy alta",
  },
  {
    id: "ingesta-menores",
    name: "Contratos menores PLACE",
    desc: "Sindicación 645 de PLACE. Contratos <15K€ (servicios) o <40K€ (obras). Alto volumen, bajo importe.",
    category: "Ingesta de datos",
    priority: "deseable",
    cost: null,
    costNote: null,
    effort: "media",
  },
  {
    id: "ingesta-bdns",
    name: "BDNS — Subvenciones y ayudas",
    desc: "Base de Datos Nacional de Subvenciones. API REST pública. Incluye subvenciones estatales, autonómicas y europeas (NextGenerationEU).",
    category: "Ingesta de datos",
    priority: "importante",
    cost: null,
    costNote: null,
    effort: "media",
  },
 
  // ══════════ BUSCADOR ══════════
  {
    id: "buscador-basico",
    name: "Buscador con filtros básicos",
    desc: "Búsqueda por texto libre, CPV, CCAA, tipo de contrato, estado, rango de presupuesto, fechas. Paginación y ordenación.",
    category: "Buscador",
    priority: "core",
    cost: null,
    costNote: null,
    effort: "media",
  },
  {
    id: "buscador-fulltext",
    name: "Búsqueda full-text PostgreSQL",
    desc: "Búsqueda avanzada con tsvector de PostgreSQL. Encuentra 'limpieza' aunque el título diga 'servicios de higienización'. Sin coste extra.",
    category: "Buscador",
    priority: "core",
    cost: null,
    costNote: null,
    effort: "media",
  },
  {
    id: "buscador-semantico",
    name: "Búsqueda semántica con embeddings",
    desc: "Buscar por significado, no solo por palabras. Usa Qdrant + embeddings. 'software para hospitales' encuentra licitaciones de 'sistemas de información sanitaria'.",
    category: "Buscador",
    priority: "deseable",
    cost: "~5-10€/mes",
    costNote: "Embeddings con text-embedding-3-small de OpenAI: $0.02/1M tokens. Coste mínimo.",
    effort: "media",
  },
  {
    id: "buscador-pliegos",
    name: "Búsqueda dentro de pliegos",
    desc: "Indexar el contenido de los PDFs de pliegos y permitir buscar dentro. 'requiere certificación ISO 27001' busca en el texto de los pliegos.",
    category: "Buscador",
    priority: "deseable",
    cost: "~10-20€/mes",
    costNote: "Requiere procesar PDFs + generar embeddings de cada pliego. Coste de embeddings + almacenamiento Qdrant.",
    effort: "alta",
  },
 
  // ══════════ ALERTAS ══════════
  {
    id: "alertas-email",
    name: "Alertas por email",
    desc: "El usuario configura filtros (CPV, keywords, CCAA, importe) y recibe un email diario/semanal con licitaciones que encajan.",
    category: "Alertas",
    priority: "core",
    cost: "0-20€/mes",
    costNote: "Resend: gratis hasta 3.000 emails/mes, luego 20$/mes por 50.000.",
    effort: "media",
  },
  {
    id: "alertas-push",
    name: "Notificaciones push (PWA)",
    desc: "Push notifications en el navegador para licitaciones urgentes o con deadline próximo. Sin necesidad de app nativa.",
    category: "Alertas",
    priority: "deseable",
    cost: null,
    costNote: "Firebase FCM es gratis.",
    effort: "media",
  },
  {
    id: "alertas-slack",
    name: "Integración Slack/Teams",
    desc: "Enviar alertas de licitaciones a un canal de Slack o Microsoft Teams.",
    category: "Alertas",
    priority: "deseable",
    cost: null,
    costNote: "Webhooks de Slack/Teams son gratuitos.",
    effort: "baja",
  },
 
  // ══════════ FICHA LICITACIÓN ══════════
  {
    id: "ficha-detalle",
    name: "Ficha de licitación completa",
    desc: "Página de detalle con todos los datos: título, presupuesto, órgano, CPVs, fechas, estado, documentos descargables, adjudicación.",
    category: "Ficha de licitación",
    priority: "core",
    cost: null,
    costNote: null,
    effort: "media",
  },
  {
    id: "ficha-guardar",
    name: "Guardar licitaciones (bookmark)",
    desc: "Marcar licitaciones como favoritas, organizarlas en carpetas, añadir notas.",
    category: "Ficha de licitación",
    priority: "core",
    cost: null,
    costNote: null,
    effort: "baja",
  },
  {
    id: "ficha-similares",
    name: "Licitaciones similares",
    desc: "En cada ficha, mostrar licitaciones parecidas por CPV, órgano o texto. Sin IA, basado en metadatos.",
    category: "Ficha de licitación",
    priority: "deseable",
    cost: null,
    costNote: null,
    effort: "baja",
  },
  {
    id: "ficha-documentos",
    name: "Visor de pliegos integrado",
    desc: "Ver PDFs de pliegos directamente en la plataforma sin descargar.",
    category: "Ficha de licitación",
    priority: "deseable",
    cost: null,
    costNote: null,
    effort: "media",
  },
 
  // ══════════ IA ══════════
  {
    id: "ia-resumen",
    name: "Resumen IA (3 frases por licitación)",
    desc: "Genera un resumen breve y claro de cada licitación: qué se contrata, presupuesto, requisitos clave. Bajo demanda cuando el usuario abre la ficha.",
    category: "Inteligencia Artificial",
    priority: "importante",
    cost: "~30-100€/mes",
    costNote: "Haiku 4.5: ~$0.04 por resumen. 1.000 resúmenes/mes = $40. Escala con usuarios.",
    effort: "media",
  },
  {
    id: "ia-chat-pliegos",
    name: "Chat con pliegos (RAG)",
    desc: "El usuario pregunta cosas sobre un pliego en lenguaje natural: '¿cuáles son los requisitos de solvencia?', '¿hay subrogación de personal?'. Usa RAG con Qdrant.",
    category: "Inteligencia Artificial",
    priority: "importante",
    cost: "~50-200€/mes",
    costNote: "Sonnet 4.6: ~$0.10 por pregunta (contexto RAG + respuesta). 1.000 preguntas/mes = $100. Escala con usuarios.",
    effort: "alta",
  },
  {
    id: "ia-viabilidad",
    name: "Análisis de viabilidad / Score de idoneidad",
    desc: "La IA analiza si la empresa debería presentarse: encaje técnico, presupuesto, requisitos de solvencia, complejidad. Devuelve score 0-100 + justificación.",
    category: "Inteligencia Artificial",
    priority: "importante",
    cost: "~50-150€/mes",
    costNote: "Sonnet 4.6: ~$0.15 por análisis (pliego + perfil empresa). 500 análisis/mes = $75. Escala con usuarios.",
    effort: "alta",
  },
  {
    id: "ia-extraccion",
    name: "Extracción estructurada de pliegos",
    desc: "La IA extrae automáticamente: requisitos de solvencia, criterios de adjudicación, plazos, presupuesto desglosado, lotes. Datos estructurados, no solo resumen.",
    category: "Inteligencia Artificial",
    priority: "deseable",
    cost: "~30-80€/mes",
    costNote: "Haiku 4.5 con Batch API: ~$0.025 por pliego. Se puede pre-procesar en batch nocturno.",
    effort: "alta",
  },
  {
    id: "ia-generador-ofertas",
    name: "Generador de ofertas con IA",
    desc: "Genera borradores de memoria técnica, propuesta económica y documentación administrativa adaptados al pliego. La killer feature.",
    category: "Inteligencia Artificial",
    priority: "deseable",
    cost: "~100-500€/mes",
    costNote: "Sonnet/Opus: $0.50-2.00 por oferta generada. 100 ofertas/mes = $50-200. Funcionalidad premium.",
    effort: "muy alta",
  },
  {
    id: "ia-prediccion-precio",
    name: "Predicción de precio óptimo",
    desc: "Basado en histórico de adjudicaciones similares, sugiere el precio/baja óptimo para maximizar probabilidad de ganar.",
    category: "Inteligencia Artificial",
    priority: "deseable",
    cost: "~10-30€/mes",
    costNote: "Usa datos históricos de adjudicaciones + modelo ML ligero. Coste mínimo una vez entrenado.",
    effort: "alta",
  },
 
  // ══════════ ANÁLISIS / DATOS ══════════
  {
    id: "analytics-competencia",
    name: "Análisis de competencia",
    desc: "Quién se ha presentado a licitaciones similares, a qué precio, con qué baja. Basado en datos de adjudicaciones históricas de PLACE.",
    category: "Analítica",
    priority: "importante",
    cost: null,
    costNote: "Solo usa datos de PLACE que ya ingestamos. Queries a PostgreSQL, sin coste adicional.",
    effort: "media",
  },
  {
    id: "analytics-dashboard",
    name: "Dashboard con KPIs",
    desc: "Métricas clave: licitaciones abiertas que encajan, próximos vencimientos, tasa de éxito, ahorro de tiempo, valor del pipeline.",
    category: "Analítica",
    priority: "importante",
    cost: null,
    costNote: null,
    effort: "media",
  },
  {
    id: "analytics-vencimientos",
    name: "Contratos que vencen (renovaciones)",
    desc: "Detectar contratos que están por terminar: oportunidad de presentarse a la renovación. Basado en fechas de formalización + duración.",
    category: "Analítica",
    priority: "deseable",
    cost: null,
    costNote: null,
    effort: "media",
  },
  {
    id: "analytics-prediccion-candidatos",
    name: "Predicción de candidatos y bajas",
    desc: "Predecir qué empresas se van a presentar y qué baja van a ofrecer. Modelo ML basado en histórico.",
    category: "Analítica",
    priority: "deseable",
    cost: null,
    costNote: "Modelo ML ligero (scikit-learn). Sin coste de API externa.",
    effort: "muy alta",
  },
 
  // ══════════ GESTIÓN ══════════
  {
    id: "gestion-kanban",
    name: "Kanban de licitaciones",
    desc: "Tablero tipo Trello para gestionar el pipeline: Nueva → Analizando → Preparando oferta → Presentada → Adjudicada → Descartada.",
    category: "Gestión",
    priority: "importante",
    cost: null,
    costNote: null,
    effort: "alta",
  },
  {
    id: "gestion-equipo",
    name: "Trabajo en equipo (multi-usuario)",
    desc: "Múltiples usuarios por organización con roles (admin, editor, viewer). Asignar licitaciones a miembros del equipo.",
    category: "Gestión",
    priority: "importante",
    cost: null,
    costNote: null,
    effort: "media",
  },
  {
    id: "gestion-vault",
    name: "Vault documental",
    desc: "Subir documentos de empresa (DEUC, certificados, solvencia, experiencia) una vez y reutilizarlos en cada licitación.",
    category: "Gestión",
    priority: "deseable",
    cost: "~5-20€/mes",
    costNote: "Almacenamiento en Cloudflare R2 o S3. ~$0.015/GB/mes. Con 10GB: $0.15/mes. Casi gratis.",
    effort: "media",
  },
  {
    id: "gestion-calendario",
    name: "Integración Google Calendar",
    desc: "Añadir deadlines de licitaciones al calendario automáticamente.",
    category: "Gestión",
    priority: "deseable",
    cost: null,
    costNote: "Google Calendar API es gratis.",
    effort: "baja",
  },
 
  // ══════════ AUTH Y USUARIOS ══════════
  {
    id: "auth-email",
    name: "Registro + Login con email/password",
    desc: "Sistema de autenticación básico con JWT, refresh tokens, reset password.",
    category: "Auth y usuarios",
    priority: "core",
    cost: null,
    costNote: null,
    effort: "media",
  },
  {
    id: "auth-oauth",
    name: "Login con Google / Microsoft",
    desc: "OAuth2 para login rápido con cuenta de Google o Microsoft.",
    category: "Auth y usuarios",
    priority: "importante",
    cost: null,
    costNote: "Google/Microsoft OAuth APIs son gratis.",
    effort: "media",
  },
  {
    id: "auth-onboarding",
    name: "Onboarding wizard inteligente",
    desc: "Flujo paso a paso: sector, ubicación, tamaño, presupuestos que manejas. Auto-configura alertas y filtros. Detección automática por NIF.",
    category: "Auth y usuarios",
    priority: "importante",
    cost: null,
    costNote: null,
    effort: "media",
  },
  {
    id: "auth-organizacion",
    name: "Gestión de organización + perfil empresa",
    desc: "Datos de la empresa: NIF, sector, CNAE, CCAA, capacidades técnicas. Se usa para el matching de IA y el score de idoneidad.",
    category: "Auth y usuarios",
    priority: "core",
    cost: null,
    costNote: null,
    effort: "baja",
  },
 
  // ══════════ PAGOS ══════════
  {
    id: "pagos-stripe",
    name: "Suscripciones con Stripe",
    desc: "Planes Free, Pro, Business, Enterprise. Cobro mensual/anual, facturas automáticas, gestión de cancelaciones.",
    category: "Pagos",
    priority: "core",
    cost: "1.4% + 0.25€/tx",
    costNote: "Stripe cobra por transacción. Lo paga el cliente indirectamente. Sin coste fijo mensual para ti.",
    effort: "media",
  },
 
  // ══════════ INFRAESTRUCTURA ══════════
  {
    id: "infra-api-publica",
    name: "API pública REST",
    desc: "Endpoints documentados con Swagger para que usuarios integren licitaciones en su CRM, ERP o herramientas internas.",
    category: "Infraestructura",
    priority: "deseable",
    cost: null,
    costNote: null,
    effort: "media",
  },
  {
    id: "infra-webhooks",
    name: "Webhooks",
    desc: "Notificar a sistemas externos cuando hay una nueva licitación que coincide con los filtros. Para integraciones con Zapier, Make, etc.",
    category: "Infraestructura",
    priority: "deseable",
    cost: null,
    costNote: null,
    effort: "media",
  },
  {
    id: "infra-export",
    name: "Exportar a Excel/CSV",
    desc: "Descargar resultados de búsqueda o licitaciones guardadas en formato Excel o CSV.",
    category: "Infraestructura",
    priority: "importante",
    cost: null,
    costNote: null,
    effort: "baja",
  },
  {
    id: "infra-landing",
    name: "Landing page + SEO",
    desc: "Página de aterrizaje con pricing, features, testimonios. Optimizada para SEO.",
    category: "Infraestructura",
    priority: "core",
    cost: null,
    costNote: null,
    effort: "media",
  },
];
 
const CATEGORIES_ORDER = [
  "Ingesta de datos",
  "Buscador",
  "Alertas",
  "Ficha de licitación",
  "Inteligencia Artificial",
  "Analítica",
  "Gestión",
  "Auth y usuarios",
  "Pagos",
  "Infraestructura",
];
 
const PRIORITY_CONFIG = {
  core: { label: "CORE", color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
  importante: { label: "IMPORTANTE", color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
  deseable: { label: "DESEABLE", color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
};
 
const EFFORT_CONFIG = {
  baja: { label: "Baja", dots: 1 },
  media: { label: "Media", dots: 2 },
  alta: { label: "Alta", dots: 3 },
  "muy alta": { label: "Muy alta", dots: 4 },
};
 
export default function FeatureSelector() {
  const [selected, setSelected] = useState(() => {
    const s = new Set();
    FEATURES.forEach((f) => {
      if (f.priority === "core" || f.priority === "importante") s.add(f.id);
    });
    return s;
  });
  const [expandedCat, setExpandedCat] = useState(new Set(CATEGORIES_ORDER));
  const [filter, setFilter] = useState("all");
 
  const toggle = (id) => {
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };
 
  const toggleCat = (cat) => {
    setExpandedCat((prev) => {
      const n = new Set(prev);
      if (n.has(cat)) n.delete(cat);
      else n.add(cat);
      return n;
    });
  };
 
  const selectAll = (cat) => {
    setSelected((prev) => {
      const n = new Set(prev);
      FEATURES.filter((f) => f.category === cat).forEach((f) => n.add(f.id));
      return n;
    });
  };
 
  const deselectAll = (cat) => {
    setSelected((prev) => {
      const n = new Set(prev);
      FEATURES.filter((f) => f.category === cat).forEach((f) => n.delete(f.id));
      return n;
    });
  };
 
  const stats = useMemo(() => {
    const sel = FEATURES.filter((f) => selected.has(f.id));
    const withCost = sel.filter((f) => f.cost && f.cost !== null);
    return {
      total: sel.length,
      core: sel.filter((f) => f.priority === "core").length,
      importante: sel.filter((f) => f.priority === "importante").length,
      deseable: sel.filter((f) => f.priority === "deseable").length,
      withCost: withCost.length,
    };
  }, [selected]);
 
  const filtered = filter === "all" ? FEATURES : FEATURES.filter((f) => f.priority === filter);
  const grouped = CATEGORIES_ORDER.map((cat) => ({
    name: cat,
    features: filtered.filter((f) => f.category === cat),
  })).filter((g) => g.features.length > 0);
 
  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: "#0a0a0a", color: "#e5e5e5", minHeight: "100vh", padding: "24px" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
 
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#fff", margin: 0 }}>
          📋 LicitaApp — Funcionalidades
        </h1>
        <p style={{ color: "#737373", marginTop: 8, fontSize: 14 }}>
          Selecciona las funcionalidades que queréis incluir. Las marcadas con coste mensual influyen en el precio operativo.
        </p>
      </div>
 
      {/* Stats bar */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        {[
          { label: "Seleccionadas", value: stats.total, total: FEATURES.length, color: "#22c55e" },
          { label: "Core", value: stats.core, color: "#dc2626" },
          { label: "Importantes", value: stats.importante, color: "#d97706" },
          { label: "Deseables", value: stats.deseable, color: "#2563eb" },
          { label: "Con coste IA/infra", value: stats.withCost, color: "#a855f7" },
        ].map((s) => (
          <div key={s.label} style={{ background: "#171717", border: "1px solid #262626", borderRadius: 10, padding: "12px 18px", minWidth: 130 }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: s.color, fontFamily: "'JetBrains Mono', monospace" }}>
              {s.value}{s.total ? <span style={{ fontSize: 14, color: "#525252" }}>/{s.total}</span> : null}
            </div>
            <div style={{ fontSize: 12, color: "#737373", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
 
      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {[
          { key: "all", label: "Todas" },
          { key: "core", label: "Core" },
          { key: "importante", label: "Importantes" },
          { key: "deseable", label: "Deseables" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: "6px 16px",
              borderRadius: 8,
              border: filter === f.key ? "1px solid #525252" : "1px solid #262626",
              background: filter === f.key ? "#262626" : "#171717",
              color: filter === f.key ? "#fff" : "#737373",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 500,
              transition: "all 0.15s",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>
 
      {/* Feature groups */}
      {grouped.map((group) => {
        const isExpanded = expandedCat.has(group.name);
        const catSelected = group.features.filter((f) => selected.has(f.id)).length;
 
        return (
          <div key={group.name} style={{ marginBottom: 16 }}>
            {/* Category header */}
            <div
              onClick={() => toggleCat(group.name)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                background: "#171717",
                border: "1px solid #262626",
                borderRadius: isExpanded ? "10px 10px 0 0" : 10,
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 14, color: "#525252", transition: "transform 0.2s", transform: isExpanded ? "rotate(90deg)" : "rotate(0)" }}>▶</span>
                <span style={{ fontWeight: 600, fontSize: 15 }}>{group.name}</span>
                <span style={{ fontSize: 12, color: "#525252", fontFamily: "'JetBrains Mono', monospace" }}>
                  {catSelected}/{group.features.length}
                </span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={(e) => { e.stopPropagation(); selectAll(group.name); }} style={{ fontSize: 11, background: "#262626", border: "1px solid #333", borderRadius: 6, color: "#a3a3a3", padding: "3px 10px", cursor: "pointer" }}>
                  Todas
                </button>
                <button onClick={(e) => { e.stopPropagation(); deselectAll(group.name); }} style={{ fontSize: 11, background: "#262626", border: "1px solid #333", borderRadius: 6, color: "#a3a3a3", padding: "3px 10px", cursor: "pointer" }}>
                  Ninguna
                </button>
              </div>
            </div>
 
            {/* Features */}
            {isExpanded && (
              <div style={{ border: "1px solid #262626", borderTop: "none", borderRadius: "0 0 10px 10px", overflow: "hidden" }}>
                {group.features.map((f, i) => {
                  const isSelected = selected.has(f.id);
                  const pr = PRIORITY_CONFIG[f.priority];
                  const ef = EFFORT_CONFIG[f.effort];
 
                  return (
                    <div
                      key={f.id}
                      onClick={() => toggle(f.id)}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        padding: "14px 16px",
                        background: isSelected ? "#0a1628" : "#0f0f0f",
                        borderBottom: i < group.features.length - 1 ? "1px solid #1a1a1a" : "none",
                        cursor: "pointer",
                        transition: "background 0.15s",
                      }}
                    >
                      {/* Checkbox */}
                      <div style={{
                        width: 20, height: 20, minWidth: 20, borderRadius: 6,
                        border: isSelected ? "2px solid #3b82f6" : "2px solid #404040",
                        background: isSelected ? "#3b82f6" : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        marginTop: 2, transition: "all 0.15s",
                      }}>
                        {isSelected && <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>✓</span>}
                      </div>
 
                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontWeight: 600, fontSize: 14, color: isSelected ? "#fff" : "#a3a3a3" }}>{f.name}</span>
                          <span style={{
                            fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4,
                            background: pr.bg + "22", color: pr.color, border: `1px solid ${pr.color}33`,
                            fontFamily: "'JetBrains Mono', monospace",
                          }}>
                            {pr.label}
                          </span>
                          {f.cost && (
                            <span style={{
                              fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 4,
                              background: "#a855f722", color: "#a855f7", border: "1px solid #a855f733",
                              fontFamily: "'JetBrains Mono', monospace",
                            }}>
                              💰 {f.cost}
                            </span>
                          )}
                          <span style={{ fontSize: 10, color: "#525252" }}>
                            {"●".repeat(ef.dots)}{"○".repeat(4 - ef.dots)} {ef.label}
                          </span>
                        </div>
                        <p style={{ fontSize: 12, color: "#737373", margin: "4px 0 0", lineHeight: 1.5 }}>{f.desc}</p>
                        {f.costNote && isSelected && (
                          <p style={{ fontSize: 11, color: "#a855f7", margin: "4px 0 0", lineHeight: 1.4, fontStyle: "italic" }}>
                            💡 {f.costNote}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
 
      {/* Summary */}
      <div style={{ marginTop: 32, padding: 20, background: "#171717", border: "1px solid #262626", borderRadius: 12 }}>
        <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 700 }}>📊 Resumen de selección</h3>
        <div style={{ fontSize: 13, color: "#a3a3a3", lineHeight: 1.8 }}>
          <div><strong style={{ color: "#fff" }}>{stats.total}</strong> funcionalidades seleccionadas de {FEATURES.length} totales</div>
          <div><strong style={{ color: "#dc2626" }}>{stats.core}</strong> core · <strong style={{ color: "#d97706" }}>{stats.importante}</strong> importantes · <strong style={{ color: "#2563eb" }}>{stats.deseable}</strong> deseables</div>
          <div><strong style={{ color: "#a855f7" }}>{stats.withCost}</strong> funcionalidades con coste operativo mensual (IA, emails, storage)</div>
          <div style={{ marginTop: 12, padding: 12, background: "#0a0a0a", borderRadius: 8, border: "1px solid #262626" }}>
            <div style={{ fontSize: 12, color: "#737373", marginBottom: 6 }}>Coste operativo estimado mensual (con ~500 usuarios activos):</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#22c55e", fontFamily: "'JetBrains Mono', monospace" }}>
              ~{(() => {
                let min = 20, max = 50;
                if (selected.has("ia-resumen")) { min += 30; max += 100; }
                if (selected.has("ia-chat-pliegos")) { min += 50; max += 200; }
                if (selected.has("ia-viabilidad")) { min += 50; max += 150; }
                if (selected.has("ia-extraccion")) { min += 30; max += 80; }
                if (selected.has("ia-generador-ofertas")) { min += 100; max += 500; }
                if (selected.has("ia-prediccion-precio")) { min += 10; max += 30; }
                if (selected.has("buscador-semantico")) { min += 5; max += 10; }
                if (selected.has("buscador-pliegos")) { min += 10; max += 20; }
                if (selected.has("alertas-email")) { min += 0; max += 20; }
                if (selected.has("ingesta-bops")) { min += 5; max += 15; }
                if (selected.has("gestion-vault")) { min += 5; max += 20; }
                return `${min}–${max}€/mes`;
              })()}
            </div>
            <div style={{ fontSize: 11, color: "#525252", marginTop: 4 }}>
              Infra base (Railway/Vercel/Redis): ~20-50€/mes incluidos. Escala linealmente con usuarios.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 