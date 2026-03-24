import { useState, useEffect, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════
// COMPLETE TASK DATABASE — EVERY SINGLE TASK FROM DAY 0 TO DONE
// ═══════════════════════════════════════════════════════════════

const ALL_TASKS = [
  // ╔══════════════════════════════════════════════════════════╗
  // ║  FASE 0: DÍA CERO — SETUP DEL PROYECTO (Semana 0)      ║
  // ╚══════════════════════════════════════════════════════════╝
  { id:"0-001", phase:0, layer:"infra", sprint:"S0", pri:"critical", t:"Crear organización en GitHub", desc:"Crear org (ej: @licitaapp). Configurar permisos: 3 devs backend (admin), 1 front (write), UX (read). Habilitar GitHub Projects." },
  { id:"0-002", phase:0, layer:"infra", sprint:"S0", pri:"critical", t:"Crear Repo 1: monorepo-app (JS/TS)", desc:"Repo privado. Branch protection en main: require PR + 1 review + CI passing. Conventional commits enforced." },
  { id:"0-003", phase:0, layer:"infra", sprint:"S0", pri:"critical", t:"Crear Repo 2: ia-service (Python)", desc:"Repo privado. Mismo branch protection. README con instrucciones de setup local." },
  { id:"0-004", phase:0, layer:"infra", sprint:"S0", pri:"critical", t:"Inicializar monorepo con Turborepo", desc:"npx create-turbo@latest. Estructura: apps/backend, apps/web, apps/mobile, packages/shared, packages/ui. Configurar turbo.json con pipelines: build, dev, lint, test." },
  { id:"0-005", phase:0, layer:"backend", sprint:"S0", pri:"critical", t:"Scaffold NestJS en apps/backend", desc:"nest new backend --strict. Instalar: @nestjs/config, @nestjs/swagger, class-validator, class-transformer. Configurar ESLint + Prettier compartido desde raíz." },
  { id:"0-006", phase:0, layer:"web", sprint:"S0", pri:"critical", t:"Scaffold React en apps/web", desc:"npm create vite@latest web -- --template react-ts. Instalar: TailwindCSS v4, shadcn/ui, react-router-dom v7, @tanstack/react-query, zustand, react-hook-form + zod." },
  { id:"0-007", phase:0, layer:"mobile", sprint:"S0", pri:"critical", t:"Scaffold React Native en apps/mobile", desc:"npx create-expo-app mobile --template tabs. Instalar: expo-router, nativewind (Tailwind para RN), react-native-reanimated, expo-notifications." },
  { id:"0-008", phase:0, layer:"infra", sprint:"S0", pri:"critical", t:"Crear packages/shared", desc:"Tipos TypeScript compartidos: User, Licitacion, Subvencion, Alerta, etc. Validaciones Zod compartidas. Constantes: CPV list, CCAA list, tipos contrato, estados licitación." },
  { id:"0-009", phase:0, layer:"infra", sprint:"S0", pri:"critical", t:"Crear packages/ui", desc:"Componentes compartidos web+mobile: Button, Card, Badge, Input, Modal, Toast. Usar Tailwind variants. Exportar tanto para web como para RN." },
  { id:"0-010", phase:0, layer:"ia", sprint:"S0", pri:"critical", t:"Scaffold servicio IA Python", desc:"Crear estructura: app/api/, app/ingestion/, app/models/, app/generation/, app/rag/. FastAPI main app. Pyproject.toml con dependencias: fastapi, uvicorn, pdfplumber, openai, qdrant-client, sqlalchemy." },
  { id:"0-011", phase:0, layer:"infra", sprint:"S0", pri:"critical", t:"Docker Compose para desarrollo local", desc:"docker-compose.yml con: postgres:16, redis:7, qdrant/qdrant (vector DB). Volúmenes persistentes. Variables de entorno en .env.example." },
  { id:"0-012", phase:0, layer:"infra", sprint:"S0", pri:"critical", t:"CI/CD: GitHub Actions workflows", desc:"Crear .github/workflows/: ci.yml (lint + test en PR), deploy-backend.yml, deploy-web.yml, deploy-ia.yml. Usar turbo prune para builds selectivos." },
  { id:"0-013", phase:0, layer:"infra", sprint:"S0", pri:"critical", t:"Configurar entornos de deploy", desc:"Elegir infra: Railway (backend + IA), Vercel (web), Expo EAS (mobile). Configurar variables de entorno por entorno (dev, staging, prod)." },
  { id:"0-014", phase:0, layer:"infra", sprint:"S0", pri:"important", t:"Configurar herramientas de equipo", desc:"Linear/GitHub Projects para gestión de tareas. Notion para documentación. Slack canal #dev + #alerts. Figma para diseño (UX/UI)." },
  { id:"0-015", phase:0, layer:"web", sprint:"S0", pri:"important", t:"UX/UI: Crear Design System en Figma", desc:"Paleta de colores, tipografía (elegir fuentes), iconografía, spacing scale, componentes base, tokens exportables a Tailwind." },
  { id:"0-016", phase:0, layer:"infra", sprint:"S0", pri:"important", t:"Documentar ADRs (Architecture Decision Records)", desc:"Crear docs/adr/: 001-monorepo-turborepo.md, 002-nestjs-backend.md, 003-react-native-expo.md, 004-python-ia-service.md, 005-postgresql-prisma.md." },

  // ╔══════════════════════════════════════════════════════════╗
  // ║  FASE 1: CIMIENTOS — MVP FUNCIONAL (Semanas 1-10)       ║
  // ╚══════════════════════════════════════════════════════════╝

  // --- Sprint 1-2: Base de datos + Auth ---
  { id:"1-001", phase:1, layer:"backend", sprint:"S1", pri:"critical", t:"Diseñar esquema de BD completo", desc:"Tablas: users, organizations, licitaciones, subvenciones, alertas, alert_matches, organos_contratacion, adjudicaciones, cpv_codes, user_cpv_preferences, saved_licitaciones, kanban_boards, kanban_cards, documents, notifications. Relaciones, índices, constraints. Documentar en docs/database-schema.md." },
  { id:"1-002", phase:1, layer:"backend", sprint:"S1", pri:"critical", t:"Configurar Prisma ORM + migraciones", desc:"npx prisma init. Crear schema.prisma con todo el modelo. Primera migración: npx prisma migrate dev --name init. Seed script con datos de test (CPVs, CCAA, usuarios demo)." },
  { id:"1-003", phase:1, layer:"backend", sprint:"S1-2", pri:"critical", t:"Módulo Auth: registro + login + JWT", desc:"POST /auth/register, POST /auth/login, POST /auth/refresh, POST /auth/forgot-password, POST /auth/reset-password. JWT access (15min) + refresh (7d) tokens. Bcrypt para passwords. Guards: AuthGuard, RolesGuard." },
  { id:"1-004", phase:1, layer:"backend", sprint:"S2", pri:"critical", t:"Módulo Auth: OAuth (Google, Microsoft)", desc:"Passport strategies: passport-google-oauth20, passport-microsoft. Callback URLs. Merge de cuentas si ya existe email." },
  { id:"1-005", phase:1, layer:"backend", sprint:"S2", pri:"critical", t:"Módulo Users: CRUD + perfil empresa", desc:"GET/PATCH /users/me, GET/PATCH /organizations/:id. Campos empresa: nombre, NIF, CNAE, dirección, tamaño, sectores interés, CPVs preferidos." },
  { id:"1-006", phase:1, layer:"backend", sprint:"S2", pri:"important", t:"Rate limiting + helmet + CORS", desc:"@nestjs/throttler para rate limiting. Helmet para headers de seguridad. CORS configurado para dominios de web y mobile." },

  // --- Sprint 2-4: Motor de Scraping PLACE ---
  { id:"1-007", phase:1, layer:"backend", sprint:"S2", pri:"critical", t:"Módulo Scraping: arquitectura base", desc:"Crear módulo scraping/ con: ScrapingService, ScrapingScheduler, parsers/. Configurar BullMQ para colas de jobs. Jobs: fetch-place, fetch-autonomica, fetch-boe, fetch-ted, parse-licitacion." },
  { id:"1-008", phase:1, layer:"backend", sprint:"S2-3", pri:"critical", t:"Scraper PLACE: datasets abiertos (6 conjuntos)", desc:"Descargar y parsear los 6 datasets XML CODICE: licitaciones, agregadas, menores, medios propios, consultas preliminares, órganos contratante. Scheduler: cada 6h delta sync, 1x/semana full sync." },
  { id:"1-009", phase:1, layer:"backend", sprint:"S3", pri:"critical", t:"Scraper PLACE: ATOM feeds tiempo real", desc:"Suscribirse a feeds ATOM de PLACE para nuevas licitaciones/adjudicaciones. Poll cada 5 min. Detectar nuevas entradas → enqueue parse job → match con alertas → enviar notificaciones." },
  { id:"1-010", phase:1, layer:"backend", sprint:"S3", pri:"critical", t:"Parser universal de licitaciones", desc:"Normalizar datos de cualquier fuente al modelo unificado: título, objeto, CPV, órgano, presupuesto, tipo contrato, procedimiento, estado, fechas (publicación, presentación, adjudicación), lugar ejecución, documentos/pliegos URLs." },
  { id:"1-011", phase:1, layer:"backend", sprint:"S3-4", pri:"critical", t:"Scraper BOE: API sección III", desc:"Consumir API datos abiertos del BOE. Filtrar sección III (concursos y contratos). Parsear XML a modelo unificado. Scheduler: diario." },
  { id:"1-012", phase:1, layer:"backend", sprint:"S3-4", pri:"critical", t:"Scraper TED: API licitaciones europeas", desc:"Integrar TED API REST (nueva). Filtrar por país='ES' + licitaciones abiertas a España. Parsear a modelo unificado. Scheduler: diario." },
  { id:"1-013", phase:1, layer:"backend", sprint:"S4", pri:"critical", t:"Ingerir catálogo completo de órganos de contratación", desc:"Dataset PLACE con todos los órganos (activos + inactivos). Parsear: nombre, tipo (ministerio, CCAA, EELL, empresa pública, universidad, hospital...), dirección, web, plataforma. Crear tabla organos_contratacion." },
  { id:"1-014", phase:1, layer:"backend", sprint:"S4", pri:"critical", t:"Ingerir tabla CPV completa + mapping CNAE→CPV", desc:"Importar árbol CPV oficial (9.454 códigos). Crear mapping CNAE→CPV manual+IA para onboarding. Tabla cpv_codes con parent_id para jerarquía." },

  // --- Sprint 4-6: Scrapers autonómicos + boletines ---
  { id:"1-015", phase:1, layer:"backend", sprint:"S4-5", pri:"critical", t:"Scraper Cataluña (PSCP)", desc:"contractaciopublica.gencat.cat — Tiene API propia. Obtener licitaciones + pliegos/documentos. Deduplicar con lo que ya viene por PLACE." },
  { id:"1-016", phase:1, layer:"backend", sprint:"S4-5", pri:"critical", t:"Scraper País Vasco (Euskadi)", desc:"contratacion.euskadi.eus — Scrape HTML + descargar pliegos. Deduplicar." },
  { id:"1-017", phase:1, layer:"backend", sprint:"S5", pri:"critical", t:"Scraper Comunidad de Madrid", desc:"contratos-publicos.comunidad.madrid — Scrape + sistema Licit@. Mapear también: Metro de Madrid, RTVM, Hospital Fuenlabrada (plataformas propias)." },
  { id:"1-018", phase:1, layer:"backend", sprint:"S5", pri:"critical", t:"Scraper Galicia", desc:"contratosdegalicia.gal — Scrape HTML." },
  { id:"1-019", phase:1, layer:"backend", sprint:"S5-6", pri:"critical", t:"Scraper Andalucía", desc:"juntadeandalucia.es/contratacion — Scrape." },
  { id:"1-020", phase:1, layer:"backend", sprint:"S6", pri:"critical", t:"Scraper Navarra", desc:"hacienda.navarra.es/contratacion — Scrape." },
  { id:"1-021", phase:1, layer:"backend", sprint:"S6", pri:"critical", t:"Scraper La Rioja", desc:"larioja.org/contratacion — Scrape." },
  { id:"1-022", phase:1, layer:"backend", sprint:"S5-7", pri:"critical", t:"Scrapers 10 boletines autonómicos (CCAA sin plataforma)", desc:"Aragón (BOA), C. Valenciana (DOGV), Castilla y León (BOCYL), Castilla-La Mancha (DOCM), Extremadura (DOE), Murcia (BORM), Asturias (BOPA), Cantabria (BOC), Baleares (BOIB), Canarias (BOC). Parsear secciones de contratación. Algunos tienen XML, otros solo HTML/PDF." },

  // --- Sprint 5-7: API REST licitaciones ---
  { id:"1-023", phase:1, layer:"backend", sprint:"S5-6", pri:"critical", t:"API Licitaciones: endpoints CRUD + búsqueda", desc:"GET /licitaciones (paginado, filtros: CPV, ubicación, importe min/max, tipo contrato, procedimiento, estado, órgano, fecha publicación, fecha presentación, texto libre). GET /licitaciones/:id (detalle completo). POST /licitaciones/:id/save, DELETE /licitaciones/:id/save." },
  { id:"1-024", phase:1, layer:"backend", sprint:"S6", pri:"critical", t:"API Licitaciones: búsqueda full-text", desc:"Configurar PostgreSQL full-text search con ts_vector en título + objeto + descripción. Índice GIN. Búsqueda por relevancia con ts_rank." },
  { id:"1-025", phase:1, layer:"backend", sprint:"S6-7", pri:"critical", t:"API Órganos de contratación", desc:"GET /organos (búsqueda + filtros por tipo, CCAA, activo). GET /organos/:id (detalle + licitaciones recientes + histórico adjudicaciones)." },

  // --- Sprint 5-8: Motor de alertas ---
  { id:"1-026", phase:1, layer:"backend", sprint:"S5-6", pri:"critical", t:"Módulo Alertas: CRUD", desc:"POST /alertas (crear: nombre, CPVs, palabras clave, exclusiones, ubicaciones, importe min/max, tipos contrato). GET /alertas, PATCH /alertas/:id, DELETE /alertas/:id, POST /alertas/:id/toggle." },
  { id:"1-027", phase:1, layer:"backend", sprint:"S6-7", pri:"critical", t:"Motor de matching: nueva licitación → alertas", desc:"Cuando se ingiere nueva licitación → BullMQ job → evaluar contra TODAS las alertas activas → crear alert_matches → enqueue notificaciones. Algoritmo de matching: CPV intersection + keyword search + location match + importe range." },
  { id:"1-028", phase:1, layer:"backend", sprint:"S7", pri:"critical", t:"Envío email de alertas (Resend)", desc:"Template HTML responsive para emails de alerta. Batch: agrupar matches por usuario, enviar 1 email/día (mañana) o 2/día (mañana + tarde). Incluir: lista de licitaciones matched, resumen IA de cada una (3 frases), link directo a ficha." },
  { id:"1-029", phase:1, layer:"backend", sprint:"S7-8", pri:"critical", t:"Notificaciones push (Firebase FCM)", desc:"Integrar Firebase Admin SDK. Enviar push a mobile cuando hay match de alerta. Payload: título licitación, presupuesto, días restantes." },

  // --- Sprint 7-8: Onboarding inteligente ---
  { id:"1-030", phase:1, layer:"backend", sprint:"S7-8", pri:"critical", t:"API Onboarding: auto-detección empresa", desc:"POST /onboarding/detect-company (input: NIF/CIF) → buscar en CNAE → devolver sector, tamaño, ubicación. POST /onboarding/suggest-cpvs (input: CNAE + descripción actividad) → devolver CPVs recomendados usando mapping CNAE→CPV + IA." },
  { id:"1-031", phase:1, layer:"backend", sprint:"S8", pri:"important", t:"API Onboarding: crear alertas automáticas", desc:"POST /onboarding/setup (input: CPVs seleccionados, ubicaciones preferidas, rango importe) → crear alertas automáticas + configurar perfil empresa." },

  // --- Sprint 8-10: Cache + monitorización ---
  { id:"1-032", phase:1, layer:"backend", sprint:"S8", pri:"important", t:"Cache Redis: búsquedas frecuentes", desc:"Cache de queries populares (TTL 5min). Cache de ficha licitación (TTL 1h). Invalidar cuando hay update. Cache de conteo de resultados por filtro (para mostrar '1.234 licitaciones encontradas' sin query pesada)." },
  { id:"1-033", phase:1, layer:"backend", sprint:"S9", pri:"important", t:"Logging estructurado + Sentry", desc:"Winston con formato JSON. Sentry para error tracking (backend + web + mobile). Request logging con correlation IDs. Dashboard de health check." },
  { id:"1-034", phase:1, layer:"backend", sprint:"S9-10", pri:"important", t:"Monitoring: health checks + métricas", desc:"GET /health (DB, Redis, queues). Métricas: licitaciones ingeridas/día, alertas enviadas/día, latencia API, errores scraping. Exportar a dashboard (Grafana o similar)." },
  { id:"1-035", phase:1, layer:"backend", sprint:"S10", pri:"important", t:"Tests: unit + integration + e2e", desc:"Jest para unit tests (services, parsers). Supertest para integration (API endpoints). Mínimo 70% coverage en módulos críticos (scraping, alertas, auth). Fixtures con datos reales de PLACE." },

  // --- WEB: Sprint 2-10 ---
  { id:"1-036", phase:1, layer:"web", sprint:"S2-3", pri:"critical", t:"Auth pages: login, registro, forgot password", desc:"Formularios con react-hook-form + zod. OAuth buttons (Google, Microsoft). Redirect post-login. Guardar tokens en httpOnly cookies o secure localStorage." },
  { id:"1-037", phase:1, layer:"web", sprint:"S3-4", pri:"critical", t:"Layout principal: sidebar + topbar + content area", desc:"Sidebar colapsable con nav: Dashboard, Buscador, Mis Alertas, Guardadas, Configuración. Topbar: search global, notificaciones bell, user avatar dropdown. Responsive: sidebar → bottom nav en mobile web." },
  { id:"1-038", phase:1, layer:"web", sprint:"S4-6", pri:"critical", t:"Onboarding wizard (4 pasos)", desc:"Paso 1: ¿A qué se dedica tu empresa? (NIF o búsqueda textual → autodetectar sector). Paso 2: ¿Dónde operas? (mapa España, seleccionar CCAA/provincias). Paso 3: ¿Qué tipo de contratos? (obras, servicios, suministros + rango importe). Paso 4: Confirmar CPVs sugeridos + crear alertas automáticas. Animaciones entre pasos. Progress bar." },
  { id:"1-039", phase:1, layer:"web", sprint:"S5-7", pri:"critical", t:"Buscador de licitaciones", desc:"Barra de búsqueda prominente. Panel de filtros lateral: CPV (tree selector), ubicación (CCAA → provincia), importe (rango slider), tipo contrato (checkboxes), procedimiento, estado, fuente, fecha publicación, fecha presentación. Lista de resultados: card con título, órgano, presupuesto, fecha límite, estado badge, CPV tags, resumen IA. Paginación infinita o numbered. Ordenar por: relevancia, fecha, importe." },
  { id:"1-040", phase:1, layer:"web", sprint:"S6-7", pri:"critical", t:"Ficha de licitación (detail page)", desc:"Header: título, estado badge, presupuesto destacado, órgano (link a perfil), fechas clave. Body: descripción completa, CPVs, lugar ejecución, tipo contrato, procedimiento. Sidebar: botones (guardar, crear alerta similar, compartir). Timeline de estados. Links a pliegos/documentos (PDFs). Resumen IA (3 frases). Licitaciones similares (carousel)." },
  { id:"1-041", phase:1, layer:"web", sprint:"S7-8", pri:"critical", t:"Panel de alertas", desc:"Lista de alertas del usuario. Card por alerta: nombre, CPVs, keywords, nº matches hoy/semana, toggle activa/inactiva. Crear/editar alerta: formulario con mismos filtros que buscador. Preview: '~X licitaciones/semana coincidirían con esta alerta'. Historial de matches por alerta." },
  { id:"1-042", phase:1, layer:"web", sprint:"S7-8", pri:"critical", t:"Sección Guardadas", desc:"Lista de licitaciones guardadas por el usuario. Organizar en carpetas/tags. Ordenar por fecha guardado, fecha límite, importe. Búsqueda dentro de guardadas." },
  { id:"1-043", phase:1, layer:"web", sprint:"S8-9", pri:"critical", t:"Dashboard home", desc:"Resumen del día: nuevas licitaciones que coinciden con tus alertas, próximos vencimientos (licitaciones guardadas con fecha límite cercana), licitaciones guardadas sin acción. Gráfico: licitaciones nuevas por día (últimos 30 días). Quick actions: ir a buscador, crear alerta, ver guardadas." },
  { id:"1-044", phase:1, layer:"web", sprint:"S9-10", pri:"important", t:"Responsive mobile-first + PWA", desc:"Todas las páginas responsive. Breakpoints: mobile (< 768), tablet (768-1024), desktop (> 1024). PWA: manifest.json, service worker para cache de shell, offline page. Instalable desde Chrome." },
  { id:"1-045", phase:1, layer:"web", sprint:"S10", pri:"important", t:"Settings: perfil usuario + empresa", desc:"Editar perfil: nombre, email, password, avatar. Editar empresa: nombre, NIF, sector, CPVs, ubicaciones. Preferencias de notificación: email (frecuencia), push (toggle). Tema: light/dark mode." },

  // --- MOBILE: Sprint 3-10 ---
  { id:"1-046", phase:1, layer:"mobile", sprint:"S3-4", pri:"critical", t:"Setup React Native + Auth screens", desc:"Expo Router para navegación (tabs + stack). Screens: Login, Register, Forgot Password. Shared auth logic con web (API client en packages/shared). Secure storage para tokens (expo-secure-store)." },
  { id:"1-047", phase:1, layer:"mobile", sprint:"S5-6", pri:"critical", t:"Onboarding wizard mobile", desc:"Mismos 4 pasos que web, adaptados a UX mobile. Swipe entre pasos. Animaciones nativas con Reanimated. Teclado numérico para NIF." },
  { id:"1-048", phase:1, layer:"mobile", sprint:"S6-7", pri:"critical", t:"Push notifications setup", desc:"expo-notifications + Firebase FCM. Pedir permiso al usuario. Registrar device token en backend. Configurar notification handlers: tap → abrir ficha licitación." },
  { id:"1-049", phase:1, layer:"mobile", sprint:"S7-9", pri:"critical", t:"Feed de licitaciones mobile", desc:"Lista vertical tipo feed. Card compacta: título, presupuesto, días restantes, CPV badge. Pull-to-refresh. Filtros rápidos en top bar (tipo, ubicación). Swipe right = guardar, swipe left = descartar (tipo Tinder). Haptic feedback." },
  { id:"1-050", phase:1, layer:"mobile", sprint:"S9-10", pri:"important", t:"Ficha licitación mobile", desc:"Scroll view con header colapsable. Botones: guardar, compartir (share sheet nativo), abrir pliego (in-app browser). Resumen IA. Timeline de estados." },
  { id:"1-051", phase:1, layer:"mobile", sprint:"S10", pri:"important", t:"Tab bar: Home, Buscar, Alertas, Guardadas, Perfil", desc:"Bottom tab navigation. Badges en Alertas (nº nuevas). Home: feed de matches de hoy. Buscar: buscador con filtros. Alertas: lista alertas. Guardadas: licitaciones guardadas. Perfil: settings." },

  // --- IA: Sprint 1-10 ---
  { id:"1-052", phase:1, layer:"ia", sprint:"S1-2", pri:"critical", t:"Setup FastAPI + estructura", desc:"FastAPI app con routers, middleware (auth token verification del backend NestJS), CORS. Dockerfile para deploy. Endpoints health check. Configurar OpenAI client (o modelo local Ollama para dev)." },
  { id:"1-053", phase:1, layer:"ia", sprint:"S2-4", pri:"critical", t:"Pipeline ingesta PDFs de pliegos", desc:"Descargar PDFs desde URLs de pliegos. Extraer texto con pdfplumber (mejores tablas) + PyMuPDF (más rápido). Fallback OCR con Tesseract para PDFs escaneados. Guardar texto estructurado en BD." },
  { id:"1-054", phase:1, layer:"ia", sprint:"S4-6", pri:"critical", t:"Chunking + embeddings", desc:"Chunking inteligente: respetar párrafos/secciones, chunks de ~512 tokens con overlap de 64. Embeddings con OpenAI text-embedding-3-small (o sentence-transformers local). Almacenar en Qdrant (vector DB). Metadata por chunk: licitacion_id, page_num, section_type." },
  { id:"1-055", phase:1, layer:"ia", sprint:"S5-7", pri:"critical", t:"Vector store Qdrant: setup + indexación", desc:"Colección 'pliegos' con vectores 1536-dim. Filtros por metadata: licitacion_id, cpv, organo. Búsqueda: query → embed → top-K similar chunks." },
  { id:"1-056", phase:1, layer:"ia", sprint:"S7-8", pri:"critical", t:"Endpoint: resumen automático de licitación", desc:"POST /ia/resumir {licitacion_id} → LLM genera resumen de 3 frases clave: qué se licita, presupuesto y plazo, requisitos principales. Usar chunks más relevantes como contexto. Cache resultado." },
  { id:"1-057", phase:1, layer:"ia", sprint:"S8-9", pri:"critical", t:"Endpoint: chat con pliego (RAG básico)", desc:"POST /ia/chat {licitacion_id, pregunta, historial} → Retrieval (buscar chunks relevantes en Qdrant) → Augmented Generation (LLM con contexto). Streaming response. Citar fuentes (página del pliego)." },
  { id:"1-058", phase:1, layer:"ia", sprint:"S9-10", pri:"important", t:"Clasificador automático de licitaciones", desc:"Modelo que clasifica licitaciones por sector/vertical más allá del CPV (ej: 'IT', 'construcción', 'limpieza', 'consultoría', 'sanidad'). Usar título + descripción + CPV como features. Fine-tuned classifier o few-shot prompting." },

  // ╔══════════════════════════════════════════════════════════╗
  // ║  FASE 2: DIFERENCIACIÓN (Semanas 11-22)                 ║
  // ╚══════════════════════════════════════════════════════════╝

  // --- Backend ---
  { id:"2-001", phase:2, layer:"backend", sprint:"S11-13", pri:"critical", t:"Módulo subvenciones: integrar API BDNS", desc:"Consumir API oficial BDNS (SNPSAP). Parsear convocatorias + concesiones. Modelo unificado: título, organismo, presupuesto, plazo, requisitos, beneficiarios, ámbito geográfico, sector. Scheduler: sync diaria." },
  { id:"2-002", phase:2, layer:"backend", sprint:"S13-14", pri:"critical", t:"Scraper PRTR / NextGenerationEU", desc:"planderecuperacion.gob.es — Scrape convocatorias de fondos europeos. Parsear a modelo de subvención." },
  { id:"2-003", phase:2, layer:"backend", sprint:"S11-13", pri:"critical", t:"Módulo gestión Kanban: API completa", desc:"POST /boards, GET /boards/:id. Columnas default: 'Nueva', 'Analizando', 'Preparando oferta', 'Presentada', 'Adjudicada', 'Descartada'. PATCH /cards/:id/move (drag & drop). Campos custom por card. Asignar responsable. Comentarios. Historial de movimientos." },
  { id:"2-004", phase:2, layer:"backend", sprint:"S13-15", pri:"critical", t:"Módulo pagos: Stripe Subscriptions", desc:"Planes: Free (0€), Pro (49€/mes), Business (99€/mes), Enterprise (199€/mes). Stripe Checkout para suscripción. Webhooks: payment_succeeded, subscription_updated, subscription_deleted. Middleware de feature gates por plan." },
  { id:"2-005", phase:2, layer:"backend", sprint:"S14-17", pri:"critical", t:"API análisis de competencia", desc:"GET /analytics/adjudicatarios?cpv=X (top empresas ganadoras por CPV). GET /analytics/organo/:id/historico (histórico de adjudicaciones de un órgano). GET /analytics/empresa/:nif (licitaciones ganadas, importes, bajas). Aggregation queries sobre tabla adjudicaciones." },
  { id:"2-006", phase:2, layer:"backend", sprint:"S16-18", pri:"critical", t:"Endpoint score de idoneidad", desc:"GET /licitaciones/:id/score {empresa_id} → llama al servicio IA → devuelve score 0-100 + explicación. Factores: match CPV, experiencia previa en licitaciones similares, rango importe, ubicación, requisitos de solvencia." },
  { id:"2-007", phase:2, layer:"backend", sprint:"S14-16", pri:"critical", t:"Scrapers BOPs (34 boletines provinciales)", desc:"Priorizar top 15 por volumen: Madrid, Barcelona, Valencia, Sevilla, Málaga, Bilbao, Zaragoza, Murcia, Palma, Las Palmas, Alicante, Córdoba, Valladolid, Vigo, Gijón. Scrape secciones de contratación. NLP para extraer licitaciones de texto libre." },
  { id:"2-008", phase:2, layer:"backend", sprint:"S17-18", pri:"important", t:"Integración Slack", desc:"Slack App con OAuth. POST /integrations/slack/connect. Enviar licitaciones matched a canal configurado. Formato: rich message con title, presupuesto, deadline, link." },
  { id:"2-009", phase:2, layer:"backend", sprint:"S18-19", pri:"important", t:"Integración Google Calendar", desc:"Google Calendar API. Crear evento con fecha límite de presentación de oferta. Título: nombre licitación. Descripción: resumen + link. Reminder 3 días antes y 1 día antes." },
  { id:"2-010", phase:2, layer:"backend", sprint:"S19-21", pri:"important", t:"API pública v1 + documentación", desc:"Versioned API: /v1/licitaciones, /v1/subvenciones, /v1/alertas. API keys con rate limiting por plan. Documentación OpenAPI/Swagger auto-generada. Portal de developer docs." },
  { id:"2-011", phase:2, layer:"backend", sprint:"S20-21", pri:"important", t:"Roles y permisos granulares", desc:"Roles: owner, admin, editor, viewer. Permisos por feature: gestión, alertas, analytics, integraciones. Invitación por email. Gestión de equipo dentro de organización." },
  { id:"2-012", phase:2, layer:"backend", sprint:"S15-18", pri:"important", t:"Scraper consultas preliminares de mercado", desc:"Dataset PLACE de consultas preliminares (desde 2022). Son pre-licitaciones. Alertar: 'Este órgano está preparando una licitación en tu sector'." },

  // --- Web ---
  { id:"2-013", phase:2, layer:"web", sprint:"S11-14", pri:"critical", t:"Kanban board interactivo", desc:"Drag & drop con @dnd-kit/sortable. Columnas configurables. Card: título licitación, presupuesto, días restantes, responsable avatar, CPV badge. Filtros: por responsable, CPV, fecha. Vista lista alternativa. Modal de detalle al click." },
  { id:"2-014", phase:2, layer:"web", sprint:"S14-16", pri:"critical", t:"Chat IA con pliegos (UI)", desc:"Sidebar o modal con interfaz de chat. Input con placeholder 'Pregunta sobre este pliego...'. Mensajes con markdown rendering. Citas con link a página del pliego. Streaming de respuesta (typewriter). Historial de conversación. Botones de preguntas sugeridas: '¿Cuáles son los requisitos de solvencia?', '¿Qué criterios de adjudicación hay?', '¿Cuál es el plazo de ejecución?'." },
  { id:"2-015", phase:2, layer:"web", sprint:"S16-17", pri:"critical", t:"Score de idoneidad UI", desc:"Badge circular con score (0-100) en color (rojo < 30, amarillo 30-60, verde > 60). Tooltip/expandible con explicación: 'Tu empresa encaja un 78% porque: CPV coincide (✓), experiencia similar (✓), importe en rango (✓), ubicación (⚠️)'. Mostrar en ficha de licitación y en resultados de búsqueda." },
  { id:"2-016", phase:2, layer:"web", sprint:"S14-17", pri:"critical", t:"Sección subvenciones", desc:"Tab nueva en sidebar: 'Subvenciones'. Buscador con filtros: sector, ámbito geográfico, importe, organismo, estado (abierta/cerrada). Ficha de subvención: requisitos, beneficiarios, plazos, documentación, link oficial. Alertas de subvenciones (reutilizar sistema de alertas de licitaciones)." },
  { id:"2-017", phase:2, layer:"web", sprint:"S17-19", pri:"critical", t:"Panel de análisis de competencia", desc:"Dashboard con: Top adjudicatarios por CPV (bar chart). Histórico de adjudicaciones de un órgano (timeline). Análisis de empresa: licitaciones ganadas, importes, % de baja medio. Gráficos con Recharts. Filtros: CPV, CCAA, periodo." },
  { id:"2-018", phase:2, layer:"web", sprint:"S15-16", pri:"critical", t:"Pricing page + Stripe checkout", desc:"Página /pricing con 4 planes en cards. Comparativa de features. Toggle mensual/anual. Botón 'Empezar gratis' / 'Suscribirse'. Stripe Checkout embebido o redirect. Post-pago: redirect a dashboard con confetti animation." },
  { id:"2-019", phase:2, layer:"web", sprint:"S18-20", pri:"important", t:"Settings: integraciones + equipo", desc:"Página /settings/integrations: conectar Slack (OAuth), conectar Google Calendar. Página /settings/team: invitar miembros, asignar roles, desactivar. Página /settings/billing: ver plan, cambiar plan, facturas, cancelar." },
  { id:"2-020", phase:2, layer:"web", sprint:"S19-20", pri:"important", t:"Notificaciones in-app", desc:"Bell icon en topbar con badge de count. Dropdown con lista de notificaciones: nuevas licitaciones matched, comentarios en Kanban, deadlines próximas. Mark as read. Link to licitación. WebSocket o polling para realtime." },
  { id:"2-021", phase:2, layer:"web", sprint:"S20-22", pri:"important", t:"Landing page pública", desc:"Hero: headline impactante + CTA registro gratis. Social proof: logos clientes, testimonios. Features: buscador, IA, subvenciones, mobile. Pricing section. FAQ. Footer con legal. SEO: meta tags, OG images, sitemap. Blog section (para contenido SEO)." },

  // --- Mobile ---
  { id:"2-022", phase:2, layer:"mobile", sprint:"S13-15", pri:"critical", t:"Kanban mobile", desc:"Vista simplificada: scroll horizontal entre columnas. Tap card para detalle. Long press para mover. Pull down para refresh." },
  { id:"2-023", phase:2, layer:"mobile", sprint:"S16-18", pri:"critical", t:"Feed unificado licitaciones + subvenciones", desc:"Toggle en top: 'Licitaciones' / 'Subvenciones' / 'Todo'. Misma card UI adaptada. Filtros rápidos." },
  { id:"2-024", phase:2, layer:"mobile", sprint:"S17-19", pri:"important", t:"Chat IA mobile", desc:"Chat nativo con keyboard avoiding view. Streaming response. Share response. Copiar texto." },
  { id:"2-025", phase:2, layer:"mobile", sprint:"S18-19", pri:"important", t:"Score de idoneidad mobile", desc:"Badge en card de licitación. Tap para expandir explicación." },
  { id:"2-026", phase:2, layer:"mobile", sprint:"S20-22", pri:"critical", t:"Publicar en App Store + Play Store", desc:"EAS Build para iOS + Android. App Store Connect: screenshots, descripción, categoría, keywords ASO. Google Play Console: idem. Privacy policy URL. TestFlight beta primero." },

  // --- IA ---
  { id:"2-027", phase:2, layer:"ia", sprint:"S11-14", pri:"critical", t:"Score de idoneidad: modelo", desc:"Input: perfil empresa (CPVs, experiencia, importes históricos, ubicación) + licitación (CPV, importe, requisitos solvencia, ubicación). Output: score 0-100 + factores. Approach: rules-based scoring + LLM para analizar requisitos vs capacidades." },
  { id:"2-028", phase:2, layer:"ia", sprint:"S13-16", pri:"critical", t:"RAG avanzado: multi-doc + memoria", desc:"Mejorar chat: buscar en múltiples documentos de una licitación (PCAP, PPT, anexos). Memoria de conversación (últimos N mensajes como contexto). Reranking de chunks con cross-encoder." },
  { id:"2-029", phase:2, layer:"ia", sprint:"S15-18", pri:"critical", t:"Extracción estructurada de pliegos", desc:"Extraer automáticamente: requisitos de solvencia (económica, técnica), criterios de adjudicación (ponderación), plazos (ejecución, garantía), penalizaciones, condiciones especiales. Output: JSON estructurado. Approach: LLM con prompting estructurado + validación." },
  { id:"2-030", phase:2, layer:"ia", sprint:"S17-20", pri:"important", t:"Predicción de precio óptimo", desc:"Input: licitación + histórico de adjudicaciones similares (mismo CPV, mismo órgano, mismo rango). Output: precio recomendado + rango de baja probable (%) + confianza. Modelo: regresión sobre datos históricos." },
  { id:"2-031", phase:2, layer:"ia", sprint:"S18-20", pri:"important", t:"Clasificador de subvenciones", desc:"Enriquecer datos BDNS: clasificar por sector, tipo empresa (pyme, autónomo, startup), ámbito. Usar descripción de convocatoria como input." },

  // ╔══════════════════════════════════════════════════════════╗
  // ║  FASE 3: KILLER FEATURES (Semanas 23-40)                ║
  // ╚══════════════════════════════════════════════════════════╝

  { id:"3-001", phase:3, layer:"backend", sprint:"S23-26", pri:"critical", t:"Módulo vault documental", desc:"CRUD documentos de empresa: DEUC, certificados clasificación, pólizas seguro, balances, experiencia (contratos previos), equipo técnico CVs. Upload S3/R2. Versionado. Tags. Compartir entre miembros organización." },
  { id:"3-002", phase:3, layer:"backend", sprint:"S26-30", pri:"critical", t:"API generación de ofertas", desc:"POST /ofertas/generar {licitacion_id, empresa_id, tipo: 'memoria_tecnica' | 'propuesta_economica' | 'deuc'}. Orquesta: obtener datos empresa del vault + datos licitación + análisis pliego IA → generar borrador → devolver documento editable." },
  { id:"3-003", phase:3, layer:"backend", sprint:"S25-28", pri:"critical", t:"Búsqueda full-text en pliegos (Elasticsearch)", desc:"Indexar todo el texto de pliegos en Elasticsearch/Meilisearch. Búsqueda: 'subcontratación permitida' → resultados con highlight dentro del texto del pliego + link a PDF + página. Filtros por CPV, órgano, fecha." },
  { id:"3-004", phase:3, layer:"backend", sprint:"S28-32", pri:"important", t:"API predicción candidatos/bajas", desc:"GET /licitaciones/:id/prediccion → candidatos probables (basado en histórico: quién se ha presentado a licitaciones similares) + baja estimada (%). Conecta con servicio IA." },
  { id:"3-005", phase:3, layer:"backend", sprint:"S30-33", pri:"important", t:"Webhooks + Zapier", desc:"Sistema de webhooks: eventos (nueva_licitacion_match, oferta_generada, deadline_proxima). Zapier integration: publicar en Zapier App Directory. Triggers + Actions." },
  { id:"3-006", phase:3, layer:"backend", sprint:"S33-35", pri:"important", t:"Integración Notion API", desc:"Crear page en Notion con datos de licitación. Sync bidireccional de estado. Configurar database template en Notion." },
  { id:"3-007", phase:3, layer:"backend", sprint:"S35-37", pri:"nice", t:"Integración Microsoft Teams", desc:"Teams Bot con cards adaptativas. Notificaciones en canal. Comandos: /licita buscar [query], /licita alertas." },
  { id:"3-008", phase:3, layer:"backend", sprint:"S32-36", pri:"important", t:"Dashboard BI: aggregation pipelines", desc:"Materialised views para: licitaciones por CPV/mes, presupuesto total por sector/CCAA, tasa de desiertos, baja media por CPV, top adjudicatarios. Endpoints analíticos con filtros." },
  { id:"3-009", phase:3, layer:"backend", sprint:"S36-39", pri:"important", t:"Multi-tenancy: workspaces + SSO", desc:"Workspace = organización con múltiples usuarios. Invitación por email + dominio. SSO con SAML 2.0 (para enterprise). Data isolation por workspace." },
  { id:"3-010", phase:3, layer:"backend", sprint:"S25-28", pri:"critical", t:"BOPs restantes (completar 34)", desc:"Scrapers para los BOPs que faltan del top 34. OCR con Tesseract/Amazon Textract para BOPs en PDF escaneado. NLP para extraer licitaciones de texto libre de boletines." },
  { id:"3-011", phase:3, layer:"backend", sprint:"S28-30", pri:"important", t:"Convenios colectivos: scraping + indexación", desc:"Scrapear convenios sectoriales del BOE/BOPs. Indexar por sector/ámbito. Necesario para calcular costes laborales en propuestas económicas (art. 100.2 LCSP)." },
  { id:"3-012", phase:3, layer:"backend", sprint:"S30-32", pri:"important", t:"Resoluciones tribunales contratación", desc:"Scrapear TACRC + tribunales autonómicos. Indexar por licitación, órgano, empresa. Útil para: alertar si una licitación tiene recurso, análisis jurídico." },

  // --- Web Fase 3 ---
  { id:"3-013", phase:3, layer:"web", sprint:"S25-28", pri:"critical", t:"Vault documental UI", desc:"Página /vault: upload documentos, organizar en carpetas (DEUC, Certificados, Experiencia, Equipo, Económico). Preview inline de PDFs. Drag & drop upload. Versionado visible. Fecha expiración con alertas." },
  { id:"3-014", phase:3, layer:"web", sprint:"S28-34", pri:"critical", t:"Generador de ofertas: wizard completo", desc:"Página /generar-oferta: Paso 1: seleccionar licitación. Paso 2: elegir tipo (memoria técnica, propuesta económica, DEUC). Paso 3: IA genera borrador (loading con progress). Paso 4: editor rich-text con borrador generado, sidebar con requisitos del pliego como checklist. Paso 5: exportar a DOCX/PDF." },
  { id:"3-015", phase:3, layer:"web", sprint:"S32-36", pri:"critical", t:"Editor de ofertas con sugerencias IA", desc:"Rich text editor (TipTap/ProseMirror). Sidebar: requisitos del pliego como checklist (tachado cuando están cubiertos en el texto). Inline suggestions: IA sugiere completar párrafos, mejorar redacción. Autoguardado." },
  { id:"3-016", phase:3, layer:"web", sprint:"S27-30", pri:"critical", t:"Búsqueda en pliegos UI", desc:"Search bar global con scope selector: 'Licitaciones' / 'Dentro de pliegos'. Resultados: snippet con highlight, link a PDF con página, metadata de la licitación. Filtros: CPV, órgano, periodo." },
  { id:"3-017", phase:3, layer:"web", sprint:"S30-33", pri:"important", t:"Predicción visual", desc:"En ficha de licitación: sección 'Competencia estimada'. Cards de empresas probables con: nombre, nº licitaciones ganadas, baja media, último contrato similar. Gráfico de distribución de bajas históricas." },
  { id:"3-018", phase:3, layer:"web", sprint:"S34-38", pri:"important", t:"Dashboard BI completo", desc:"Página /analytics: gráficos interactivos (Recharts). Métricas: licitaciones por sector, presupuesto total por CCAA (mapa de calor), evolución temporal, tasa de desiertos, baja media por CPV. Filtros globales. Exportar a PDF/Excel." },
  { id:"3-019", phase:3, layer:"web", sprint:"S38-40", pri:"nice", t:"Exportar informes PDF/Excel", desc:"Botón 'Exportar informe' en analytics. Generar PDF con gráficos (html2canvas + jsPDF) o Excel (SheetJS). Personalizable: seleccionar métricas, periodo, filtros." },

  // --- Mobile Fase 3 ---
  { id:"3-020", phase:3, layer:"mobile", sprint:"S28-31", pri:"important", t:"Vault mobile + cámara", desc:"Acceso al vault. Upload desde cámara (escanear documentos). Compartir desde otras apps (share extension)." },
  { id:"3-021", phase:3, layer:"mobile", sprint:"S34-37", pri:"important", t:"Review ofertas mobile", desc:"Ver borradores generados. Aprobar/rechazar. Comentar. No editar completo (eso en web)." },
  { id:"3-022", phase:3, layer:"mobile", sprint:"S38-40", pri:"nice", t:"Offline mode", desc:"Cache de licitaciones guardadas para consulta offline. Sync cuando vuelve conexión." },

  // --- IA Fase 3 ---
  { id:"3-023", phase:3, layer:"ia", sprint:"S23-30", pri:"critical", t:"Generador memoria técnica", desc:"Input: pliego (chunks relevantes) + perfil empresa (experiencia, equipo, metodología del vault). Output: borrador de memoria técnica estructurada según criterios de adjudicación del pliego. Approach: LLM con prompt engineering avanzado + few-shot con ejemplos de memorias buenas. Secciones auto-detectadas del pliego." },
  { id:"3-024", phase:3, layer:"ia", sprint:"S26-29", pri:"critical", t:"Auto-relleno DEUC", desc:"Extraer datos de empresa del vault (NIF, razón social, dirección, representante, experiencia, solvencia económica). Mapear a campos del DEUC (formulario estándar europeo). Generar XML/PDF del DEUC pre-rellenado." },
  { id:"3-025", phase:3, layer:"ia", sprint:"S28-33", pri:"critical", t:"Generador propuesta económica", desc:"Input: licitación (presupuesto base, criterios económicos, unidades) + histórico adjudicaciones similares + convenio colectivo sectorial. Output: precio recomendado + desglose sugerido (costes directos, indirectos, beneficio). Tabla de precios unitarios si aplica." },
  { id:"3-026", phase:3, layer:"ia", sprint:"S30-35", pri:"important", t:"Predicción de candidatos", desc:"Modelo: dado CPV + órgano + importe → predecir empresas que se presentarán. Features: historial de presentaciones, proximidad geográfica, tamaño empresa vs importe, CPV match. Output: ranking de empresas probables con probabilidad." },
  { id:"3-027", phase:3, layer:"ia", sprint:"S33-37", pri:"important", t:"Predicción de bajas", desc:"Regresión: dado CPV + órgano + nº candidatos estimados → predecir % de baja de adjudicación. Training data: histórico de adjudicaciones. Output: baja estimada + intervalo de confianza." },
  { id:"3-028", phase:3, layer:"ia", sprint:"S35-38", pri:"important", t:"Mejora RAG: reranking + citations", desc:"Cross-encoder reranking de chunks recuperados. Citations precisas: 'Según el pliego (pág. 23, sección 4.2)...'. Detección de contradicciones entre PCAP y PPT." },
  { id:"3-029", phase:3, layer:"ia", sprint:"S38-40", pri:"nice", t:"Feedback loop", desc:"Cuando usuario marca oferta como 'ganada' o 'perdida', usar como training signal. Fine-tune recomendaciones futuras. Dashboard de métricas: % ofertas generadas que ganaron." },

  // ╔══════════════════════════════════════════════════════════╗
  // ║  FASE 4: ESCALA & EXPANSIÓN (Semanas 41-56+)            ║
  // ╚══════════════════════════════════════════════════════════╝

  { id:"4-001", phase:4, layer:"backend", sprint:"S41-44", pri:"critical", t:"i18n: multi-idioma API + contenido", desc:"i18next en backend. Traducir: emails, notificaciones, resúmenes IA, UI strings. Idiomas: ES, PT, EN. Content negotiation por header Accept-Language." },
  { id:"4-002", phase:4, layer:"backend", sprint:"S43-48", pri:"critical", t:"Scrapers Portugal (BASE.gov.pt)", desc:"Integrar portal de contratos públicos de Portugal. Modelo de datos adaptado. Parsing de documentos en portugués." },
  { id:"4-003", phase:4, layer:"backend", sprint:"S45-49", pri:"important", t:"White-label: custom domains + branding", desc:"Tenant config: logo, colores, dominio custom, email from. Middleware que detecta tenant por domain. Útil para consultoras que quieran revender el producto." },
  { id:"4-004", phase:4, layer:"backend", sprint:"S47-50", pri:"important", t:"SSO: SAML + OAuth enterprise", desc:"SAML 2.0 para clientes enterprise (ej: grandes constructoras con Azure AD). OAuth2 genérico. Auto-provisioning de usuarios." },
  { id:"4-005", phase:4, layer:"backend", sprint:"S48-53", pri:"important", t:"Marketplace de expertos", desc:"Modelo: expertos (consultores licitaciones) con perfil, especialidades, tarifas, reviews. Booking: empresa solicita asesoría, experto acepta. Pagos: Stripe Connect (comisión plataforma). Chat entre empresa y experto." },
  { id:"4-006", phase:4, layer:"backend", sprint:"S53-56", pri:"important", t:"GDPR compliance + data export", desc:"Endpoint: exportar todos mis datos (JSON/ZIP). Derecho al olvido: eliminar cuenta + datos. Consentimientos granulares. DPA (Data Processing Agreement) template." },
  { id:"4-007", phase:4, layer:"backend", sprint:"S50-54", pri:"nice", t:"Scrapers Latam (primeros)", desc:"Chile (mercadopublico.cl), Colombia (colombiacompra.gov.co), México (compranet.gob.mx). Solo los portales principales." },
  { id:"4-008", phase:4, layer:"backend", sprint:"S48-52", pri:"important", t:"TED API completa: toda la UE", desc:"Expandir scraper TED de solo España a toda la UE (27 países). Filtros por país en buscador." },

  { id:"4-009", phase:4, layer:"web", sprint:"S42-46", pri:"critical", t:"Multi-idioma UI completa", desc:"react-i18next con namespaces. Traducir todas las páginas, componentes, mensajes de error. Language switcher en UI. URLs localizadas (/es/, /pt/, /en/)." },
  { id:"4-010", phase:4, layer:"web", sprint:"S48-53", pri:"important", t:"Marketplace UI", desc:"Directorio de expertos: búsqueda por especialidad, ubicación, valoración. Perfil experto: bio, experiencia, tarifas, reviews. Solicitar asesoría: formulario + booking. Chat embebido." },
  { id:"4-011", phase:4, layer:"web", sprint:"S50-54", pri:"nice", t:"Academia: cursos + certificaciones", desc:"Página /academia: cursos de contratación pública, vídeos, certificaciones. Content CMS (o Notion embebido). Progreso por usuario." },
  { id:"4-012", phase:4, layer:"web", sprint:"S46-50", pri:"important", t:"Admin panel enterprise", desc:"Gestión de tenants (para white-label). Billing overview. User analytics. Feature flags." },
  { id:"4-013", phase:4, layer:"web", sprint:"S52-56", pri:"nice", t:"Comunidad: foro + rankings", desc:"Foro de discusión por sector. Rankings de licitadores (gamificación). Casos de éxito." },

  { id:"4-014", phase:4, layer:"mobile", sprint:"S44-46", pri:"critical", t:"Multi-idioma mobile", desc:"expo-localization + i18next. Traducción completa." },
  { id:"4-015", phase:4, layer:"mobile", sprint:"S50-54", pri:"important", t:"Marketplace mobile", desc:"Buscar expertos, chat, solicitar asesoría, pagar." },
  { id:"4-016", phase:4, layer:"mobile", sprint:"S54-56", pri:"nice", t:"Apple Watch: notificaciones deadlines", desc:"watchOS companion app. Complicación con próximo deadline. Push a muñeca." },

  { id:"4-017", phase:4, layer:"ia", sprint:"S43-48", pri:"critical", t:"Multi-lingual: PT + EN", desc:"Adaptar prompts y modelos a portugués e inglés. Parsing de pliegos en PT/EN. Resúmenes multi-idioma." },
  { id:"4-018", phase:4, layer:"ia", sprint:"S48-53", pri:"important", t:"Auto-mejora con feedback", desc:"Fine-tuning con datos de ofertas ganadoras vs perdedoras. Mejorar predicciones de precio y candidatos con cada ciclo." },
  { id:"4-019", phase:4, layer:"ia", sprint:"S50-55", pri:"important", t:"Recomendador proactivo", desc:"Push diario: 'Licitaciones que deberías mirar' basado en perfil + historial + patrones de éxito. No solo alertas configuradas, sino descubrimiento inteligente." },
  { id:"4-020", phase:4, layer:"ia", sprint:"S53-56", pri:"nice", t:"Analytics IA: insights automáticos", desc:"Generar insights sobre tendencias: 'Las licitaciones de IT en Madrid han crecido un 23% este trimestre'. Alertas de oportunidad de mercado." },
];

// ═══════════════════════════════════════════════════════════════
// PHASE CONFIG
// ═══════════════════════════════════════════════════════════════
const PHASES = [
  { id:0, name:"Día Cero", sub:"Setup completo del proyecto", dur:"Semana 0", color:"#64748B", milestone:"Repos creados + CI/CD operativo", icon:"🏗️" },
  { id:1, name:"Cimientos", sub:"MVP funcional con scraping + buscador + alertas + IA básica", dur:"Semanas 1–10", color:"#EF4444", milestone:"Beta privada — 50 testers", icon:"🚀" },
  { id:2, name:"Diferenciación", sub:"Subvenciones + Kanban + Score IA + Pagos + Mobile en stores", dur:"Semanas 11–22", color:"#F59E0B", milestone:"Lanzamiento público — 2.000 usuarios", icon:"⚡" },
  { id:3, name:"Killer Features", sub:"Generador ofertas IA + Predicción + Búsqueda pliegos + BI", dur:"Semanas 23–40", color:"#8B5CF6", milestone:"1.000 usuarios de pago — 75K€ MRR", icon:"🏆" },
  { id:4, name:"Escala", sub:"Internacional + Marketplace + Enterprise + Comunidad", dur:"Semanas 41–56+", color:"#06B6D4", milestone:"3.000 pago — 250K€ MRR", icon:"👑" },
];

const LAYERS = {
  infra: { label:"Infra / DevOps", color:"#64748B", icon:"🔧" },
  backend: { label:"Backend", color:"#3B82F6", icon:"⚙️" },
  web: { label:"Web App", color:"#10B981", icon:"🌐" },
  mobile: { label:"Mobile", color:"#F59E0B", icon:"📱" },
  ia: { label:"Servicio IA", color:"#8B5CF6", icon:"🧠" },
};

const PRI = {
  critical: { l:"Crítico", c:"#EF4444", bg:"rgba(239,68,68,0.1)", d:"🔴" },
  important: { l:"Importante", c:"#F59E0B", bg:"rgba(245,158,11,0.08)", d:"🟡" },
  nice: { l:"Nice-to-have", c:"#22C55E", bg:"rgba(34,197,94,0.08)", d:"🟢" },
};

// ═══════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function RoadmapChecklist() {
  const [checked, setChecked] = useState({});
  const [phase, setPhase] = useState(0);
  const [layerFilter, setLayerFilter] = useState(null);
  const [priFilter, setPriFilter] = useState(null);
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState({});

  // Load from storage
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("roadmap-checked");
        if (r?.value) setChecked(JSON.parse(r.value));
      } catch(e) { /* first load */ }
    })();
  }, []);

  // Save to storage
  const toggle = useCallback((id) => {
    setChecked(prev => {
      const next = { ...prev, [id]: !prev[id] };
      window.storage.set("roadmap-checked", JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const tasks = ALL_TASKS.filter(t => {
    if (t.phase !== phase) return false;
    if (layerFilter && t.layer !== layerFilter) return false;
    if (priFilter && t.pri !== priFilter) return false;
    if (search && !t.t.toLowerCase().includes(search.toLowerCase()) && !t.desc.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const phaseAll = ALL_TASKS.filter(t => t.phase === phase);
  const phaseDone = phaseAll.filter(t => checked[t.id]).length;
  const phaseTotal = phaseAll.length;
  const phasePct = phaseTotal ? Math.round((phaseDone / phaseTotal) * 100) : 0;

  const globalDone = ALL_TASKS.filter(t => checked[t.id]).length;
  const globalTotal = ALL_TASKS.length;
  const globalPct = globalTotal ? Math.round((globalDone / globalTotal) * 100) : 0;

  // Group tasks by layer
  const byLayer = {};
  tasks.forEach(t => {
    if (!byLayer[t.layer]) byLayer[t.layer] = [];
    byLayer[t.layer].push(t);
  });

  const ph = PHASES[phase];

  return (
    <div style={{ minHeight:"100vh", background:"#08090d", color:"#e2e8f0", fontFamily:"'Segoe UI',-apple-system,sans-serif", fontSize:14 }}>

      {/* HEADER */}
      <div style={{ padding:"20px 24px 0", borderBottom:"1px solid #1a1d2a" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:24 }}>📋</span>
            <div>
              <div style={{ fontSize:18, fontWeight:800, letterSpacing:"-0.02em" }}>Roadmap Checklist</div>
              <div style={{ fontSize:11, color:"#64748B" }}>SaaS Licitaciones · {globalTotal} tareas · {PHASES.length} fases</div>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:20, fontWeight:800, color: globalPct === 100 ? "#22C55E" : "#3B82F6" }}>{globalPct}%</div>
              <div style={{ fontSize:9, color:"#64748B", textTransform:"uppercase", letterSpacing:1 }}>Global</div>
            </div>
            <div style={{ width:80, height:6, background:"#1a1d2a", borderRadius:3, overflow:"hidden" }}>
              <div style={{ width: globalPct + "%", height:"100%", background: globalPct === 100 ? "#22C55E" : "#3B82F6", borderRadius:3, transition:"width 0.3s" }} />
            </div>
            <div style={{ fontSize:12, color:"#64748B" }}>{globalDone}/{globalTotal}</div>
          </div>
        </div>

        {/* Phase tabs */}
        <div style={{ display:"flex", gap:2, marginTop:16, overflowX:"auto", paddingBottom:0 }}>
          {PHASES.map((p, i) => {
            const pd = ALL_TASKS.filter(t => t.phase === i && checked[t.id]).length;
            const pt = ALL_TASKS.filter(t => t.phase === i).length;
            const pp = pt ? Math.round((pd/pt)*100) : 0;
            return (
              <button key={p.id} onClick={() => { setPhase(i); setCollapsed({}); }} style={{
                padding:"8px 14px", borderRadius:"8px 8px 0 0",
                border: phase===i ? `1px solid ${p.color}44` : "1px solid transparent",
                borderBottom:"none",
                background: phase===i ? p.color+"12" : "transparent",
                color: phase===i ? p.color : "#64748B",
                fontSize:12, fontWeight: phase===i ? 700 : 500,
                cursor:"pointer", whiteSpace:"nowrap", transition:"all 0.2s",
                display:"flex", alignItems:"center", gap:6,
              }}>
                <span>{p.icon}</span>
                <span>F{p.id}</span>
                <span style={{ fontSize:10, opacity:0.6 }}>{pp}%</span>
                {pp === 100 && <span style={{ fontSize:10 }}>✅</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* PHASE INFO BAR */}
      <div style={{ padding:"16px 24px", background:"#0b0e14", borderBottom:"1px solid #1a1d2a" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div>
            <div style={{ fontSize:20, fontWeight:800, color:ph.color, letterSpacing:"-0.02em" }}>
              {ph.icon} Fase {ph.id}: {ph.name}
            </div>
            <div style={{ fontSize:12, color:"#64748B" }}>{ph.sub} · <span style={{ color:ph.color }}>{ph.dur}</span></div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:120, height:8, background:"#1a1d2a", borderRadius:4, overflow:"hidden" }}>
              <div style={{ width: phasePct+"%", height:"100%", background:ph.color, borderRadius:4, transition:"width 0.3s" }} />
            </div>
            <span style={{ fontSize:14, fontWeight:700, color:ph.color }}>{phasePct}%</span>
            <span style={{ fontSize:12, color:"#64748B" }}>{phaseDone}/{phaseTotal}</span>
          </div>
        </div>
        <div style={{ marginTop:8, background:ph.color+"10", border:`1px solid ${ph.color}33`, borderRadius:6, padding:"6px 12px", fontSize:12, color:"#94A3B8", display:"flex", alignItems:"center", gap:8 }}>
          <span>🏁</span> <strong style={{ color:ph.color }}>Milestone:</strong> {ph.milestone}
        </div>
      </div>

      {/* FILTERS */}
      <div style={{ padding:"12px 24px", display:"flex", gap:6, flexWrap:"wrap", alignItems:"center", borderBottom:"1px solid #1a1d2a" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Buscar tarea..." style={{
          background:"#0e1017", border:"1px solid #1a1d2a", borderRadius:6, padding:"5px 12px",
          color:"#e2e8f0", fontSize:12, width:200, outline:"none",
        }} />
        {Object.entries(LAYERS).map(([k, v]) => (
          <button key={k} onClick={() => setLayerFilter(layerFilter===k ? null : k)} style={{
            padding:"3px 10px", borderRadius:5, fontSize:11, cursor:"pointer", transition:"all 0.15s",
            border: `1px solid ${layerFilter===k ? v.color+"66" : "#1a1d2a"}`,
            background: layerFilter===k ? v.color+"15" : "transparent",
            color: layerFilter===k ? v.color : "#64748B", fontWeight: layerFilter===k ? 600 : 400,
          }}>{v.icon} {v.label}</button>
        ))}
        <span style={{ width:1, height:20, background:"#1a1d2a", margin:"0 4px" }} />
        {Object.entries(PRI).map(([k, v]) => (
          <button key={k} onClick={() => setPriFilter(priFilter===k ? null : k)} style={{
            padding:"3px 10px", borderRadius:5, fontSize:11, cursor:"pointer",
            border: `1px solid ${priFilter===k ? v.c+"66" : "#1a1d2a"}`,
            background: priFilter===k ? v.bg : "transparent",
            color: priFilter===k ? v.c : "#64748B", fontWeight: priFilter===k ? 600 : 400,
          }}>{v.d} {v.l}</button>
        ))}
      </div>

      {/* TASK LIST */}
      <div style={{ padding:"8px 24px 40px" }}>
        {Object.entries(byLayer).map(([layerKey, layerTasks]) => {
          const ly = LAYERS[layerKey];
          const layerDone = layerTasks.filter(t => checked[t.id]).length;
          const isCollapsed = collapsed[layerKey];
          return (
            <div key={layerKey} style={{ marginTop:12, background:"#0e1017", border:`1px solid ${ly.color}22`, borderRadius:10, overflow:"hidden" }}>
              <div onClick={() => setCollapsed(p => ({...p, [layerKey]: !p[layerKey]}))} style={{
                padding:"10px 16px", display:"flex", alignItems:"center", justifyContent:"space-between",
                cursor:"pointer", background:ly.color+"08", borderBottom:`1px solid ${ly.color}15`,
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:16 }}>{ly.icon}</span>
                  <span style={{ fontSize:14, fontWeight:700, color:ly.color }}>{ly.label}</span>
                  <span style={{ fontSize:11, color:"#64748B" }}>{layerDone}/{layerTasks.length}</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:60, height:4, background:"#1a1d2a", borderRadius:2, overflow:"hidden" }}>
                    <div style={{ width: (layerTasks.length ? (layerDone/layerTasks.length)*100 : 0)+"%", height:"100%", background:ly.color, borderRadius:2 }} />
                  </div>
                  <span style={{ color:"#475569", fontSize:12, transition:"transform 0.2s", transform: isCollapsed ? "rotate(-90deg)" : "none" }}>▾</span>
                </div>
              </div>
              {!isCollapsed && (
                <div style={{ padding:"4px 8px 8px" }}>
                  {layerTasks.map(task => {
                    const pr = PRI[task.pri];
                    const done = checked[task.id];
                    return (
                      <div key={task.id} onClick={() => toggle(task.id)} style={{
                        display:"flex", alignItems:"flex-start", gap:10, padding:"8px 10px",
                        borderRadius:6, margin:"2px 0", cursor:"pointer", transition:"background 0.15s",
                        background: done ? "rgba(34,197,94,0.04)" : "transparent",
                        opacity: done ? 0.6 : 1,
                      }}
                      onMouseEnter={e => { if(!done) e.currentTarget.style.background="#12151f"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = done ? "rgba(34,197,94,0.04)" : "transparent"; }}
                      >
                        <div style={{
                          width:18, height:18, borderRadius:4, flexShrink:0, marginTop:1,
                          border: done ? "2px solid #22C55E" : "2px solid #2a2f40",
                          background: done ? "#22C55E" : "transparent",
                          display:"flex", alignItems:"center", justifyContent:"center",
                          fontSize:10, color:"#fff", transition:"all 0.15s",
                        }}>{done ? "✓" : ""}</div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{
                            fontSize:13, fontWeight:600, lineHeight:1.4,
                            color: done ? "#4a5568" : "#CBD5E1",
                            textDecoration: done ? "line-through" : "none",
                          }}>{pr.d} {task.t}</div>
                          <div style={{ fontSize:11, color:"#4a5568", lineHeight:1.5, marginTop:2 }}>{task.desc}</div>
                        </div>
                        <span style={{
                          fontFamily:"'SF Mono',monospace", fontSize:10, color:"#3a3f55",
                          background:"#0a0d12", padding:"2px 6px", borderRadius:3,
                          whiteSpace:"nowrap", flexShrink:0, marginTop:2,
                        }}>{task.sprint}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
        {Object.keys(byLayer).length === 0 && (
          <div style={{ textAlign:"center", padding:40, color:"#3a3f55" }}>
            No hay tareas que coincidan con los filtros actuales
          </div>
        )}
      </div>
    </div>
  );
}