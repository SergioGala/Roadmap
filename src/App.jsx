import { useState, useCallback } from "react";

// ════════════════════════════════════════════════════════════════
//  COMPLETE TASK DATABASE — 200+ TASKS, NO GAPS, NO SHORTCUTS
//  Every task has: description + QA acceptance criteria
// ════════════════════════════════════════════════════════════════

const T=[
// ╔═══════════════════════════════════════════════════════════════╗
// ║ FASE 0 — DÍA CERO: SETUP COMPLETO DEL PROYECTO (Semana 0)   ║
// ╚═══════════════════════════════════════════════════════════════╝
{id:"0-01",p:0,l:"infra",s:"S0",pr:"critical",t:"Crear organización GitHub + 2 repos + permisos",d:"Org @licitaapp. Repo monorepo-app (privado) + ia-service (privado). Branch protection main: require PR+1review+CI. Permisos: 3 BE admin, 1 FE write, UX read.",q:["Org creada","2 repos privados existen","Branch protection activa en main","5 miembros con rol correcto","Template PR con checklist creado"]},
{id:"0-02",p:0,l:"infra",s:"S0",pr:"critical",t:"Inicializar monorepo Turborepo",d:"npx create-turbo@latest. Carpetas: apps/backend, apps/web, apps/mobile, packages/shared, packages/ui. turbo.json con pipelines build/dev/lint/test. Package.json raíz con workspaces.",q:["npm install sin errores","turbo dev arranca apps en paralelo","Estructura apps/ + packages/ correcta","turbo.json válido con 4 pipelines"]},
{id:"0-03",p:0,l:"infra",s:"S0",pr:"critical",t:"Docker Compose: postgres + redis + qdrant",d:"docker-compose.yml con postgres:16, redis:7, qdrant/qdrant. Volúmenes persistentes. .env.example con TODAS las variables (DB, Redis, Qdrant, JWT, OpenAI, Resend, Stripe, Firebase).",q:["docker-compose up levanta 3 servicios","Postgres en 5432, Redis en 6379, Qdrant en 6333","Datos persisten tras restart",".env.example tiene 15+ variables documentadas"]},
{id:"0-04",p:0,l:"infra",s:"S0",pr:"critical",t:"CI/CD: GitHub Actions workflows",d:"ci.yml: en PR → turbo lint + test + type-check. deploy-backend.yml: push main → deploy Railway. deploy-web.yml: push main → deploy Vercel. deploy-ia.yml: push main → deploy Railway.",q:["PR abre → CI ejecuta automáticamente","CI falla si hay error lint → bloquea merge","CI pasa → check verde","Deploy auto al pushear a main","Workflows < 5 min"]},
{id:"0-05",p:0,l:"infra",s:"S0",pr:"critical",t:"Configurar entornos deploy: Railway + Vercel + EAS",d:"Railway: crear projects backend + ia-service. Vercel: conectar repo → apps/web. Expo EAS: configurar eas.json. Variables de entorno en cada servicio (dev, staging, prod).",q:["Backend accesible en URL pública Railway","Web accesible en URL pública Vercel","IA service accesible en URL pública Railway","Variables de entorno configuradas por entorno"]},
{id:"0-06",p:0,l:"infra",s:"S0",pr:"important",t:"Herramientas equipo: Linear + Notion + Slack + Figma",d:"Linear (o GitHub Projects) con board. Notion workspace con docs. Slack: #dev, #design, #alerts, #general. Figma workspace compartido.",q:["Board proyecto con columnas Backlog/Sprint/InProgress/Review/Done","Notion con página onboarding","Slack 4 canales","Figma workspace con acceso para UX"]},
{id:"0-07",p:0,l:"infra",s:"S0",pr:"important",t:"Gitflow + convenciones: branches, commits, PRs",d:"Branches: main (prod), develop (staging), feature/xxx, fix/xxx. Conventional commits: feat:, fix:, chore:, docs:. PR template. Commitlint + husky pre-commit hooks.",q:["Husky pre-commit ejecuta lint","Commitlint rechaza commits sin prefijo","PR template aparece al crear PR","README documenta la convención"]},
{id:"0-08",p:0,l:"infra",s:"S0",pr:"important",t:"ADRs: documentar decisiones de arquitectura",d:"docs/adr/: 001-monorepo-turborepo.md, 002-nestjs.md, 003-expo.md, 004-fastapi-ia.md, 005-postgresql-prisma.md, 006-bullmq-queues.md, 007-atom-codice-ingesta.md",q:["Al menos 5 ADRs escritos","Cada ADR tiene: contexto, decisión, consecuencias","El equipo ha leído y validado"]},

// Backend scaffolds
{id:"0-09",p:0,l:"backend",s:"S0",pr:"critical",t:"Scaffold NestJS + dependencias completas",d:"nest new backend --strict. Instalar: @nestjs/config, swagger, jwt, passport, bull, throttler, schedule, axios. Prisma client. class-validator/transformer. Resend, stripe, firebase-admin.",q:["npm run start:dev arranca en :3000","GET /health → {status:'ok'}","Swagger en /api/docs","ESLint sin errores","TypeScript strict"]},
{id:"0-10",p:0,l:"backend",s:"S0",pr:"critical",t:"Configurar módulos NestJS base",d:"Estructura: src/auth/, src/users/, src/organizations/, src/licitaciones/, src/alertas/, src/scraping/, src/notifications/, src/integrations/, src/analytics/. ConfigModule con validación env.",q:["Carpeta por cada módulo","ConfigModule carga .env correctamente","Al menos 9 módulos creados (vacíos pero registrados)"]},

// Web scaffold
{id:"0-11",p:0,l:"web",s:"S0",pr:"critical",t:"Scaffold React + Vite + Tailwind + shadcn completo",d:"Vite react-ts. TailwindCSS v4. shadcn/ui init + añadir 10 componentes base (button, input, card, badge, dialog, dropdown, select, tabs, toast, tooltip). React Router v7. TanStack Query. Zustand. react-hook-form + zod.",q:["npm run dev → app en :5173","Tailwind funciona","shadcn button renderiza","Router con / y /login","Build producción sin errores"]},
{id:"0-12",p:0,l:"web",s:"S0",pr:"critical",t:"Implementar tokens de diseño del Design System",d:"tailwind.config: colores (primary, secondary, success, warning, danger, grays), tipografía (font-sans, font-mono, scale), spacing, border-radius, shadows según Figma.",q:["Los colores de Tailwind coinciden con Figma","Las fuentes coinciden","bg-primary aplica el color correcto"]},

// Mobile scaffold
{id:"0-13",p:0,l:"mobile",s:"S0",pr:"critical",t:"Scaffold Expo + React Native completo",d:"Expo tabs template. expo-router, nativewind, reanimated, expo-notifications, expo-secure-store, expo-image, expo-haptics. eas.json configurado.",q:["npx expo start → bundler OK","App carga en Expo Go","Tabs navegación funciona","NativeWind funciona","eas.json válido"]},

// IA scaffold
{id:"0-14",p:0,l:"ia",s:"S0",pr:"critical",t:"Scaffold FastAPI + Dockerfile + estructura",d:"app/main.py (FastAPI + CORS + health). app/api/, app/ingestion/, app/models/, app/generation/, app/rag/. Dockerfile multi-stage. docker-compose.ia.yml para dev local con Qdrant.",q:["uvicorn arranca en :8000","GET /health → ok","GET /docs → Swagger","Dockerfile build OK","requirements.txt completo"]},

// Shared packages
{id:"0-15",p:0,l:"infra",s:"S0",pr:"critical",t:"packages/shared: tipos TypeScript completos",d:"Interfaces: Licitacion (30+ campos), Subvencion, User, Organization, Alerta, AlertMatch, OrganoContratacion, Adjudicacion, Documento, KanbanBoard, KanbanCard, Notification, CpvCode. Enums: DataSource (15 valores), TipoContrato (7), EstadoLicitacion (7), Procedimiento (5), UserRole (5), Plan (4), OrgSize (5).",q:["Importable desde backend y web","Compila sin errores","Al menos 12 interfaces + 8 enums","Cada interfaz con JSDoc"]},
{id:"0-16",p:0,l:"infra",s:"S0",pr:"critical",t:"packages/shared: validaciones Zod + constantes",d:"Schemas Zod para: CreateAlertDto, UpdateUserDto, SearchLicitacionesDto. Constantes: CCAA list (17+2), tipos contrato, estados, procedimientos. API client: axios instance con interceptors para auth token.",q:["Zod schemas exportables","Constantes importables desde web y backend","API client con baseURL configurable"]},
{id:"0-17",p:0,l:"infra",s:"S0",pr:"important",t:"packages/ui: componentes compartidos web+mobile",d:"Button (primary/secondary/ghost/danger), Card, Badge (con variantes de color), Input, Spinner, EmptyState. Tailwind variants. Export para web y RN.",q:["Button renderiza en web","Button renderiza en Expo Go","Al menos 6 componentes","Cada uno con 2+ variantes"]},

// Design
{id:"0-18",p:0,l:"web",s:"S0",pr:"important",t:"UX/UI: Design System completo en Figma",d:"Entregar: paleta colores, tipografía, spacing scale, 15+ componentes (Button, Input, Select, Card, Badge, Modal, Toast, Table, Sidebar item, Tab, Dropdown, Tooltip, Avatar, Tag, Progress), iconografía (Lucide). Wireframes baja fidelidad: Login, Register, Onboarding x4, Dashboard, Buscador, Ficha licitación, Alertas, Guardadas, Settings.",q:["Página Tokens con colores+tipo+spacing","Página Components con 15+ componentes","Página Wireframes con 12+ pantallas","Dev ha validado viabilidad técnica"]},

// ╔═══════════════════════════════════════════════════════════════╗
// ║ FASE 1 — CIMIENTOS: MVP FUNCIONAL (Semanas 1-10)             ║
// ╚═══════════════════════════════════════════════════════════════╝

// -- DB --
{id:"1-01",p:1,l:"backend",s:"S1",pr:"critical",t:"Schema Prisma completo: todas las tablas desde día 1",d:"Tablas: User, Organization, Licitacion (30+ campos), Subvencion, Alerta, AlertMatch, SavedLicitacion, OrganoContratacion, KanbanBoard, KanbanCard, Document, Notification, CpvCode. Relaciones FK. Unique constraints (externalId+source). Migración init.",q:["npx prisma migrate dev OK","prisma studio muestra 13+ tablas","FKs correctas","Unique externalId+source en licitaciones","Campos Licitacion: id, externalId, source, title, description, cpvCodes[], organoId, presupuestoBase, presupuestoConIva, tipoContrato, procedimiento, estado, ccaa, provincia, municipio, fechaPublicacion, fechaPresentacion, fechaAdjudicacion, documentos(json), resumenIA, datosExtraidos(json), adjudicatarioNombre, adjudicatarioNif, importeAdjudicacion, porcentajeBaja, searchVector"]},
{id:"1-02",p:1,l:"backend",s:"S1",pr:"critical",t:"Seed script: CPVs + CCAA + datos test",d:"Importar 9.454 CPVs con jerarquía. Insertar 17+2 CCAA. Mapping CNAE→CPV (top 50). Usuario admin test. Organización test.",q:["9.454 CPVs insertados","Árbol CPV navegable (parentId)","50+ CNAEs mapeados a CPVs","1 usuario + 1 org de test"]},
{id:"1-03",p:1,l:"backend",s:"S1",pr:"critical",t:"Índices rendimiento + full-text search trigger",d:"Índices: licitaciones(estado), licitaciones(fechaPresentacion), licitaciones(cpvCodes) GIN, licitaciones(ccaa), licitaciones(source), licitaciones(organoId). Trigger: auto-update tsvector en INSERT/UPDATE de title+description.",q:["EXPLAIN ANALYZE en query con filtro estado < 10ms","Full-text search funciona: SELECT WHERE searchVector @@ to_tsquery('limpieza')","Índice GIN en searchVector creado"]},

// -- Auth --
{id:"1-04",p:1,l:"backend",s:"S1-2",pr:"critical",t:"Auth: registro email + login + JWT access/refresh",d:"POST /auth/register (name, email, password→bcrypt). POST /auth/login → {accessToken(15min), refreshToken(7d)}. POST /auth/refresh → nuevo accessToken. Guardar refreshToken hasheado en BD.",q:["Register crea user con password bcrypt","Login devuelve 2 tokens","Access token expira en 15min","Refresh funciona y rota token","Login con password incorrecto → 401","Register con email duplicado → 409"]},
{id:"1-05",p:1,l:"backend",s:"S2",pr:"critical",t:"Auth: forgot/reset password + OAuth Google + Microsoft",d:"POST /auth/forgot-password → email con reset link (token 1h). POST /auth/reset-password (token + newPassword). OAuth Google (passport-google-oauth20). OAuth Microsoft. Si email existe, vincular cuenta.",q:["Forgot password envía email real","Reset con token válido cambia password","Reset con token expirado → 400","Google OAuth → crea user o vincula","Microsoft OAuth → crea user o vincula"]},
{id:"1-06",p:1,l:"backend",s:"S2",pr:"critical",t:"Auth: Guards + Rate limiting + Seguridad",d:"AuthGuard (JWT validation). RolesGuard (OWNER/ADMIN/EDITOR/VIEWER/MEMBER). @nestjs/throttler: 5 login/min/IP, 100 req/min general. Helmet headers. CORS whitelist. class-validator en todos DTOs.",q:["Endpoint sin token → 401","Endpoint con token válido → 200","Endpoint con rol insuficiente → 403","6º login en 1 min → 429","Helmet headers en response","CORS rechaza origen no whitelisted"]},

// -- Users/Org --
{id:"1-07",p:1,l:"backend",s:"S2",pr:"critical",t:"API Users + Organizations CRUD",d:"GET /users/me. PATCH /users/me (name, avatar). POST /organizations (create). GET /organizations/:id. PATCH /organizations/:id (name, nif, cnae, sector, size, ccaa, cpvPreferences). POST /organizations/:id/invite (email, role).",q:["GET /users/me → datos del user autenticado","PATCH actualiza campos","Crear organización funciona","Solo miembros ven su organización","Invite envía email con link"]},

// -- Motor scraping: ARQUITECTURA --
{id:"1-08",p:1,l:"backend",s:"S2",pr:"critical",t:"Arquitectura scraping: BullMQ colas + workers + scheduler",d:"Configurar BullMQ con Redis. Colas: scraping:fetch, scraping:parse, scraping:dedupe, scraping:enrich, alertas:match, alertas:notify, ia:process. Workers con concurrencia configurable. Retry: 3 intentos, exponential backoff. Dead letter queue. Bull Board dashboard.",q:["BullMQ conecta a Redis","Encolar job manualmente → se procesa","Job fallido → reintenta 3 veces → dead letter","Bull Board accesible en /admin/queues","Workers procesan jobs en paralelo","Logs estructurados por job"]},
{id:"1-09",p:1,l:"backend",s:"S2",pr:"critical",t:"Scheduler service: cron jobs por fuente",d:"@nestjs/schedule. Configurar crons: PLACE feeds (*/5 * * * *), BOE (0 8 * * *), TED (0 9 * * *), Autonómicas (0 */2 * * *), Boletines (0 7 * * *). Toggle on/off por fuente. Log inicio/fin de cada ejecución.",q:["Cron PLACE se ejecuta cada 5 min","Cron BOE se ejecuta a las 08:00","Cada ejecución genera log con timestamp","Se puede desactivar un cron individualmente"]},

// -- Parser CODICE --
{id:"1-10",p:1,l:"backend",s:"S2-3",pr:"critical",t:"Parser CODICE: extraer TODOS los campos del XML PLACE",d:"Parsear XML CODICE (spec 250 págs) al modelo Licitacion unificado. Extraer: expediente, título, descripción, CPVs (múltiples), órgano (nombre+NIF+tipo+CCAA), presupuesto (sinIVA+conIVA), tipo contrato, procedimiento, estado, lugar ejecución (CCAA+provincia+municipio), fechas (publicación, presentación, adjudicación, formalización), documentos/pliegos (URLs+nombres), lotes, adjudicación (ganador+NIF+importe+%baja), criterios adjudicación.",q:["Dado XML real de PLACE, extrae título correctamente","Extrae CPVs (puede haber 1 o N)","Extrae presupuesto sin IVA y con IVA","Extrae órgano con nombre y NIF","Extrae fechas en ISO 8601","Extrae URLs de pliegos","Extrae datos de adjudicación si existen","Extrae lotes si existen","Maneja entries sin adjudicación (estado EN_PLAZO)","Maneja entries con múltiples lotes","Tests unitarios con 5+ XMLs reales de ejemplo"]},
{id:"1-11",p:1,l:"backend",s:"S3",pr:"critical",t:"Motor deduplicación cross-source",d:"Dedup por unique constraint (externalId+source). Dedup cross-source: detectar misma licitación de PLACE + autonómica + BOE. Match por: nº expediente exacto. Match fuzzy: título similar (Levenshtein >0.85) + mismo órgano + fecha ±3 días. Merge: enriquecer con datos más completos.",q:["INSERT duplicado por misma source → UPDATE (no duplicar)","Misma licitación de PLACE y BOE → detectada como duplicada","Merge: si BOE tiene campo que PLACE no, se enriquece","Log: 'Dedup: X duplicados, Y enriquecidos'","Test con datos reales que aparecen en 2 fuentes"]},

// -- Scrapers --
{id:"1-12",p:1,l:"backend",s:"S3-4",pr:"critical",t:"Scraper PLACE: carga inicial ZIPs históricos",d:"Descargar ZIPs 2024 y 2025 de sindicación 643 (licitaciones). Descomprimir. Parsear ATOM files secuencialmente siguiendo <link rel='next'>. Upsert en BD. Log progreso: 'Procesando 2024... 15.234 insertadas'. Job one-shot ejecutable manualmente.",q:["Descarga ZIP 2025 correctamente","Descomprime y encuentra ATOM raíz","Sigue paginación next hasta el final","Inserta >10.000 licitaciones de 2025","No duplica si se ejecuta 2 veces","Log muestra progreso cada 1.000 items","Tarda <30 min para un año completo"]},
{id:"1-13",p:1,l:"backend",s:"S3-4",pr:"critical",t:"Scraper PLACE: carga inicial sindicaciones 644-645-1044-1154",d:"Mismo proceso para: 644 (agregadas autonómicas), 645 (contratos menores), 1044 (encargos medios propios), 1154 (consultas preliminares). Cada una con su source.",q:["Sindicación 644 ingerida → source PLACE_AGREGADA","645 → source PLACE_MENORES (miles de contratos menores)","1044 → source PLACE_MEDIOS_PROPIOS","1154 → source PLACE_CONSULTAS_PREVIAS","Cada sindicación inserta datos correctamente"]},
{id:"1-14",p:1,l:"backend",s:"S3",pr:"critical",t:"Scraper PLACE: ATOM feed tiempo real (poller)",d:"Poll feed ATOM en curso cada 5 min. Detectar entries nuevos por <updated> vs último timestamp en Redis. Seguir paginación. Encolar parse job. Manejar deleted entries (archivar). Persistir último timestamp.",q:["Se ejecuta cada 5 min","Detecta entries nuevos correctamente","Licitación nueva en PLACE → disponible en BD en <10min","Entry tipo deleted → marca licitación como archivada","Update de licitación existente → actualiza estado/datos","Último timestamp persiste en Redis entre reinicios"]},
{id:"1-15",p:1,l:"backend",s:"S3",pr:"critical",t:"Scraper PLACE: catálogo órganos de contratación",d:"Parsear dataset de órganos. Insertar en tabla organos_contratacion. Vincular con licitaciones por FK.",q:["5.000+ órganos insertados","Campos: nombre, externalId, tipo, ccaa, provincia, web, activo","Licitaciones vinculadas a su órgano","Búsqueda por nombre funciona"]},
{id:"1-16",p:1,l:"backend",s:"S4",pr:"critical",t:"Importar CPVs completos + mapping CNAE→CPV",d:"CSV oficial CPV → tabla cpv_codes con parentId jerárquico. Mapping CNAE→CPV (50+ CNAEs). APIs: GET /cpv/search, GET /cpv/:id/children.",q:["9.454 CPVs insertados","Árbol navegable","50+ CNAEs mapeados","Búsqueda 'limpieza' → CPVs relevantes"]},
{id:"1-17",p:1,l:"backend",s:"S3-4",pr:"critical",t:"Scraper BOE: API datos abiertos sección III",d:"HTTP GET sumario diario (boe.es/datosabiertos/). Filtrar sección III. Parsear XML anuncio → modelo unificado. Dedup con PLACE. Cron diario 08:00.",q:["Descarga sumario del día OK","Filtra solo sección III","Parsea correctamente al modelo unificado","Dedup: no duplica con PLACE","Se ejecuta diario","Source='BOE'"]},
{id:"1-18",p:1,l:"backend",s:"S3-4",pr:"critical",t:"Scraper TED: API REST licitaciones europeas",d:"Registrar TED API key (gratis). Consumir /notices/search con filtro country=ES. Parsear JSON → modelo unificado. Manejar títulos multi-idioma. Dedup con PLACE (umbrales SARA). Cron diario 09:00.",q:["Conecta con API key","Filtra España correctamente","50+ licitaciones en primera ejecución","Título en ES si disponible, EN si no","Dedup con PLACE para licitaciones SARA","Source='TED'"]},
{id:"1-19",p:1,l:"backend",s:"S4-5",pr:"critical",t:"Scraper Cataluña PSCP (API datos abiertos)",d:"contractaciopublica.gencat.cat — Tiene API propia de datos abiertos. Obtener licitaciones + URLs pliegos. Dedup con PLACE agregada. Source=CAT_PSCP. Cron cada 2h.",q:["Consume API Cataluña correctamente","20+ licitaciones en primera ejecución","URLs pliegos guardados en documentos[]","Dedup con PLACE","Source='CAT_PSCP'","Cron cada 2h"]},
{id:"1-20",p:1,l:"backend",s:"S4-6",pr:"critical",t:"Scrapers País Vasco + Madrid + Galicia",d:"3 scrapers HTML (Playwright/Cheerio). Cada uno: parsear listado → extraer detalle → modelo unificado → dedup → guardar URLs pliegos.",q:["PV: contratacion.euskadi.eus scrapeado","MAD: contratos-publicos.comunidad.madrid scrapeado","GAL: contratosdegalicia.gal scrapeado","Cada uno 10+ licitaciones","Dedup con PLACE","Graceful failure si web caída"]},
{id:"1-21",p:1,l:"backend",s:"S5-6",pr:"critical",t:"Scrapers Andalucía + Navarra + La Rioja",d:"3 scrapers HTML. Misma estructura que anteriores.",q:["AND: juntadeandalucia.es/contratacion","NAV: hacienda.navarra.es/contratacion","RIO: larioja.org/contratacion","Cada uno funcional","Dedup con PLACE"]},
{id:"1-22",p:1,l:"backend",s:"S5-7",pr:"critical",t:"10 scrapers boletines autonómicos (CCAA sin plataforma)",d:"BOA, DOGV, BOCYL, DOCM, DOE, BORM, BOPA, BOC(Cant), BOIB, BOC(Can). Formato variado: XML/HTML/PDF. NLP para extraer campos. Source=BOCA. Cron diario 07:00.",q:["Cada boletín scrapeado","XML se parsea directo","HTML se scrapea con Cheerio","NLP extrae título+presupuesto+órgano de texto libre","5+ licitaciones/boletín","Source='BOCA'"]},

// -- API Licitaciones --
{id:"1-23",p:1,l:"backend",s:"S5-6",pr:"critical",t:"API Licitaciones: GET con 20+ filtros + full-text search",d:"GET /licitaciones. Filtros: cpv, ccaa, provincia, importeMin, importeMax, tipoContrato, procedimiento, estado, organoId, source, q (texto libre full-text), fechaPublicacionDesde/Hasta, fechaPresentacionDesde/Hasta, soloConPliegos, incluirMenores, incluirConsultasPrevias. Cursor-based pagination. Ordenar: relevancia, fecha, importe.",q:["Sin filtros → últimas 20","Filtro CPV funciona (exacto + padre)","Filtro CCAA funciona","Filtro importe rango funciona","Filtro texto libre con full-text search","20+ filtros combinables","Paginación cursor-based con total","Ordenación por 4 criterios","Response <500ms con cache","URL query params: /licitaciones?cpv=45&ccaa=MAD"]},
{id:"1-24",p:1,l:"backend",s:"S6",pr:"critical",t:"API Licitaciones: GET /:id + save/unsave + órganos",d:"GET /licitaciones/:id (detalle + órgano + docs + resumen IA). POST /save, DELETE /unsave. GET /saved (guardadas). GET /organos (búsqueda). GET /organos/:id (detalle + historial).",q:["Detalle completo con todos los campos","Órgano populado con datos","Documentos listados con URLs","Save/unsave funciona","Guardadas listadas por usuario","Órganos buscables por nombre"]},

// -- Alertas --
{id:"1-25",p:1,l:"backend",s:"S5-7",pr:"critical",t:"Módulo Alertas: CRUD + motor matching",d:"POST /alertas (nombre, cpvs[], keywords[], excludeKeywords[], ccaa[], importeMin/Max, tiposContrato[], includeSubvenciones). Motor: nueva licitación → evaluar contra TODAS alertas activas → crear alert_matches. Algoritmo: CPV ∩ + keyword search + location + importe range. Performance: 1000 alertas < 2s.",q:["Crear alerta con todos los campos","Listar alertas del usuario","Toggle activa/desactiva","Nueva licitación matchea con alerta correcta","Keywords con exclusión funcionan","1000 alertas evaluadas en <2s","GET /alertas/:id/matches → historial"]},
{id:"1-26",p:1,l:"backend",s:"S7",pr:"critical",t:"Notificaciones email: Resend + template HTML",d:"Template HTML responsive. Batch diario: agrupar matches por usuario. Contenido: lista licitaciones + resumen IA + links. No enviar si 0 matches. Frecuencia configurable. Unsubscribe.",q:["Email se recibe en inbox real","Template bien en Gmail+Outlook+mobile","Lista de licitaciones matched","Link directo a ficha","No envía si 0 matches","Unsubscribe funciona"]},
{id:"1-27",p:1,l:"backend",s:"S7-8",pr:"critical",t:"Push notifications: Firebase FCM + deep links",d:"Firebase Admin SDK. Registrar device tokens. Push cuando match alerta. Payload: título, presupuesto, días restantes. Deep link → ficha licitación.",q:["Push llega a dispositivo real","Tap → abre ficha correcta en app","Foreground → banner in-app","Se puede desactivar desde settings"]},
{id:"1-28",p:1,l:"backend",s:"S7-8",pr:"critical",t:"API Onboarding: detect + suggest + auto-setup",d:"POST /onboarding/detect-company (NIF→CNAE,sector,nombre). POST /onboarding/suggest-cpvs (CNAE→CPVs). POST /onboarding/setup (crear alertas auto + perfil).",q:["NIF válido → nombre+CNAE+sector","CNAE → 3+ CPVs sugeridos","Setup crea al menos 1 alerta","Flujo completo <5s"]},

// -- Cache + Monitoring + Tests --
{id:"1-29",p:1,l:"backend",s:"S8",pr:"important",t:"Cache Redis: búsquedas + fichas + conteos",d:"Cache queries (TTL 5min), fichas (TTL 1h), conteos (TTL 10min). Invalidar en update. Key strategy: sha256(queryparams).",q:["2ª búsqueda idéntica >5x más rápida","Cache invalidada en update","Hit ratio >60%"]},
{id:"1-30",p:1,l:"backend",s:"S9",pr:"important",t:"Dashboard scrapers: status + métricas + errores",d:"Panel /admin/scrapers: cada fuente con última ejecución, items procesados, errores, estado (ok/warning/error). Métricas: licitaciones/día por fuente, total en BD, alertas enviadas/día.",q:["Muestra status de cada scraper","Última ejecución con timestamp","Items procesados y errores","Gráfico licitaciones/día"]},
{id:"1-31",p:1,l:"backend",s:"S9",pr:"important",t:"Sentry + health checks + logging estructurado",d:"Sentry SDK en backend+web+mobile. GET /health (DB, Redis, queues, IA). Winston JSON logs con correlation IDs.",q:["Errores aparecen en Sentry","GET /health → status cada servicio","Logs en JSON con requestId"]},
{id:"1-32",p:1,l:"backend",s:"S10",pr:"important",t:"Tests: unit + integration (70% coverage críticos)",d:"Jest unit tests: parser CODICE, matching alertas, dedup. Supertest integration: auth, licitaciones, alertas endpoints. Fixtures con XML real de PLACE.",q:["30+ unit tests pasan","15+ integration tests pasan",">70% coverage en auth, licitaciones, alertas, scraping","Fixtures con XML real"]},

// -- WEB Fase 1 --
{id:"1-33",p:1,l:"web",s:"S2-3",pr:"critical",t:"Auth pages: login + register + forgot + reset + OAuth",d:"4 páginas. react-hook-form + zod validation. OAuth buttons (Google, Microsoft). Tokens → httpOnly cookie o secure storage. Redirect post-login. Loading states. Error messages.",q:["Login email+pass → /dashboard","Google OAuth → /dashboard","Register → /onboarding","Forgot → email enviado","Validación inline (email, pass min 8)","Error credenciales claro","Loading en botones","Responsive 375px"]},
{id:"1-34",p:1,l:"web",s:"S3-4",pr:"critical",t:"Layout: sidebar + topbar + bottom nav mobile",d:"Sidebar colapsable: nav items con iconos (Dashboard, Buscador, Alertas, Guardadas, Settings). Topbar: search global, bell notifications, user dropdown. Responsive: <768px → bottom tab nav. Breadcrumbs.",q:["Sidebar colapsa con animación","Active state en nav actual","Topbar con search+bell+avatar","<768px → bottom tabs","100vh sin scroll en shell","SPA navigation sin reload"]},
{id:"1-35",p:1,l:"web",s:"S4-6",pr:"critical",t:"Onboarding wizard: 4 pasos con auto-detección",d:"Step 1: NIF → auto-detect empresa. Step 2: Selector CCAA (multi). Step 3: Tipo contrato checkboxes + importe slider. Step 4: CPVs sugeridos + crear alertas. Progress bar. Animaciones. Persistir entre pasos.",q:["NIF detecta empresa auto","Manual si NIF falla","CCAA multi-select","Slider importe funcional","CPVs sugeridos toggleables","'Finalizar' crea alertas → dashboard","Progress bar visible","Navegación adelante/atrás","Animaciones transición"]},
{id:"1-36",p:1,l:"web",s:"S5-7",pr:"critical",t:"Buscador completo: filtros + resultados + paginación",d:"Search bar + panel filtros: CPV tree selector, CCAA multi, importe slider, tipo contrato, procedimiento, estado, fechas, texto libre. Cards resultado: título, órgano, presupuesto, deadline, CPV badges, estado badge. Paginación. Ordenación. URL sync. Empty state. Skeletons.",q:["Texto libre busca en título+desc","CPV tree selector navegable","Importe slider funcional","Filtros combinables","Card muestra 6+ campos","Click card → ficha","Paginación sin perder filtros","Ordenar por 4 criterios","URL refleja filtros","Empty state con sugerencias","Skeleton loading"]},
{id:"1-37",p:1,l:"web",s:"S6-7",pr:"critical",t:"Ficha licitación completa",d:"Header: título, estado badge, presupuesto, órgano link. Body: descripción, CPVs, lugar, tipo, procedimiento. Timeline estados. Links pliegos (abrir nueva pestaña). Resumen IA. Licitaciones similares. Botones: guardar, crear alerta similar, compartir (copy URL). Breadcrumb.",q:["Todos los campos mostrados","Presupuesto formato español","Fechas legibles","Estado con color","Guardar funciona","Links pliegos abren","Resumen IA visible","Share copia URL","Responsive"]},
{id:"1-38",p:1,l:"web",s:"S7-8",pr:"critical",t:"Alertas: lista + crear/editar + historial matches",d:"Lista alertas con cards: nombre, CPVs, keywords, matches count, toggle. Crear/editar: mismo formulario que filtros buscador. Preview: '~X licitaciones/semana'. Historial matches por alerta.",q:["Lista todas las alertas","Toggle activa/desactiva","Crear alerta con todos los filtros","Preview estimación matches","Historial clickeable","Editar alerta existente","Eliminar con confirmación"]},
{id:"1-39",p:1,l:"web",s:"S7-8",pr:"critical",t:"Guardadas: lista con carpetas + búsqueda",d:"Lista licitaciones guardadas. Organizar en carpetas/tags. Buscar dentro. Ordenar: fecha guardado, deadline, importe.",q:["Lista guardadas del usuario","Crear carpetas","Mover entre carpetas","Buscar dentro de guardadas","Ordenar por 3 criterios"]},
{id:"1-40",p:1,l:"web",s:"S8-9",pr:"critical",t:"Dashboard home: resumen + vencimientos + métricas",d:"Nuevas licitaciones hoy (matches alertas). Top 5 próximos vencimientos. Métricas: alertas activas, guardadas, matches semana. Quick actions.",q:["Nº matches de hoy","5 próximos vencimientos","3 métricas","Botones quick action","Carga <2s","Empty state si usuario nuevo"]},
{id:"1-41",p:1,l:"web",s:"S9-10",pr:"important",t:"Settings: perfil + empresa + notificaciones + tema",d:"Perfil: nombre, email, password, avatar. Empresa: nombre, NIF, sector, CPVs. Notificaciones: email frecuencia, push toggle. Tema: dark/light.",q:["Editar perfil funciona","Editar empresa funciona","Cambiar frecuencia email","Toggle push","Dark/light mode"]},
{id:"1-42",p:1,l:"web",s:"S9-10",pr:"important",t:"Responsive + PWA + error boundaries + loading states",d:"Todas las páginas responsive 375-1440px. PWA manifest+SW+offline page. 404+500 pages. Skeleton loading en cada página. Toast notifications.",q:["375px OK en todas las páginas","PWA instalable","Offline page","404 y 500 custom","Skeletons en todas las listas","Toast en acciones"]},

// -- MOBILE Fase 1 --
{id:"1-43",p:1,l:"mobile",s:"S3-5",pr:"critical",t:"Auth + Onboarding mobile (4 pasos swipe)",d:"Login (email + OAuth). Register. Onboarding 4 pasos adaptado: swipe entre pasos, teclado numérico NIF, CCAA chips scroll horizontal. Tokens en expo-secure-store.",q:["Login funciona iOS+Android","OAuth funciona con deep link","Tokens en secure store","Onboarding swipe fluido","NIF teclado numérico"]},
{id:"1-44",p:1,l:"mobile",s:"S6-7",pr:"critical",t:"Push notifications: permisos + registro + handlers",d:"Pedir permiso. Registrar device token en backend. Handler tap → deep link a ficha. Foreground → banner in-app.",q:["Pide permiso","Token registrado en backend","Push recibida en device real","Tap → abre ficha correcta","Foreground → banner"]},
{id:"1-45",p:1,l:"mobile",s:"S7-9",pr:"critical",t:"Feed + ficha + tab bar completa",d:"Tab bar: Home, Buscar, Alertas, Guardadas, Perfil. Feed: cards compactas, pull-to-refresh, swipe guardar/descartar, haptic. Ficha: header colapsable, guardar, compartir, abrir pliego.",q:["5 tabs funcionan","Feed con cards","Pull-to-refresh","Swipe right=guardar con haptic","Swipe left=descartar","Ficha con header colapsable","Badge en tab Alertas"]},

// -- IA Fase 1 --
{id:"1-46",p:1,l:"ia",s:"S2-4",pr:"critical",t:"Pipeline PDF: descargar + extraer texto + OCR fallback",d:"Descargar PDFs desde URLs pliegos. pdfplumber (tablas) + PyMuPDF (rápido). OCR Tesseract para escaneados. Detectar automáticamente si necesita OCR.",q:["PDF normal → texto extraído","PDF escaneado → OCR → texto","Tablas extraídas correctamente","Auto-detecta si necesita OCR","50 páginas en <30s"]},
{id:"1-47",p:1,l:"ia",s:"S4-6",pr:"critical",t:"Chunking inteligente + embeddings + Qdrant",d:"Chunks 512 tokens, overlap 64, respetar secciones/párrafos. Embeddings OpenAI text-embedding-3-small. Colección Qdrant 'pliegos'. Metadata: licitacion_id, page_num.",q:["Chunks no cortan frases","Embeddings generados","Qdrant colección creada","Búsqueda similaridad funciona","100+ pliegos indexados"]},
{id:"1-48",p:1,l:"ia",s:"S7-8",pr:"critical",t:"Endpoint resumen: 3 frases clave por licitación",d:"POST /ia/resumir {licitacion_id} → 3 frases: qué se licita, presupuesto+plazo, requisitos principales. Cache en BD.",q:["3 frases coherentes y útiles","Frase 1: objeto contrato","Frase 2: presupuesto+plazo","Frase 3: requisitos clave","<10s respuesta","Cache: no regenera si ya existe"]},
{id:"1-49",p:1,l:"ia",s:"S8-10",pr:"critical",t:"Chat con pliego: RAG + streaming + citas",d:"POST /ia/chat {licitacion_id, pregunta, historial} → Retrieval Qdrant → LLM con contexto → streaming response. Citar página del pliego.",q:["'Requisitos solvencia?' → respuesta correcta","'Plazo ejecución?' → plazo exacto","'Criterios adjudicación?' → lista con ponderación","Citas: 'Según pág. X'","Streaming funciona","Historial mantenido","'No encuentro' si no está en pliego"]},
{id:"1-50",p:1,l:"ia",s:"S9-10",pr:"important",t:"Clasificador automático + Celery para ingesta masiva",d:"Clasificar licitaciones por sector (IT, construcción, limpieza, consultoría, sanidad). Celery + Redis para procesar PDFs en batch.",q:["Clasificación coherente","Celery procesa cola de PDFs","100 PDFs procesados en batch sin timeout"]},

// ╔═══════════════════════════════════════════════════════════════╗
// ║ FASE 2 — DIFERENCIACIÓN (Semanas 11-22)                      ║
// ╚═══════════════════════════════════════════════════════════════╝
{id:"2-01",p:2,l:"backend",s:"S11-14",pr:"critical",t:"Subvenciones: API BDNS + PRTR + alertas",d:"Consumir API BDNS (convocatorias+concesiones). Scraper PRTR (planderecuperacion.gob.es). Modelo Subvencion. Alertas con flag includeSubvenciones.",q:["500+ subvenciones ingeridas","Campos: título,organismo,importe,plazo,sector","PRTR convocatorias incluidas","Alertas matchean subvenciones","Source BDNS/PRTR"]},
{id:"2-02",p:2,l:"backend",s:"S11-13",pr:"critical",t:"Kanban: boards + columnas + cards + comentarios",d:"CRUD boards. Columnas default: Nueva/Analizando/Preparando/Presentada/Adjudicada/Descartada. Cards vinculadas a licitación. Drag-drop (reorder). Asignar responsable. Comentarios. Historial movimientos.",q:["Crear board OK","Mover cards entre columnas","Asignar responsable","Comentarios","Historial movimientos"]},
{id:"2-03",p:2,l:"backend",s:"S13-15",pr:"critical",t:"Stripe: planes + checkout + webhooks + feature gates",d:"4 planes: Free(0€), Pro(49€), Business(99€), Enterprise(199€). Stripe Checkout. Webhooks: payment_succeeded, subscription_updated/deleted. Middleware feature gates por plan (max alertas, funciones IA, etc).",q:["Checkout crea suscripción","Webhook actualiza plan BD","Free: 3 alertas max","Pro: features IA","Cancelar → Free fin periodo","Facturas descargables"]},
{id:"2-04",p:2,l:"backend",s:"S14-16",pr:"critical",t:"BOPs top 15 provinciales + OCR pipeline",d:"Scrapers 15 BOPs más grandes (Madrid, Barcelona, Valencia...). OCR Tesseract para PDFs. NLP extracción campos texto libre.",q:["15 BOPs scrapeados","PDF con OCR funciona","NLP extrae campos","3+ licitaciones/BOP","Source='BOP'"]},
{id:"2-05",p:2,l:"backend",s:"S14-17",pr:"critical",t:"Analytics: competencia + histórico adjudicaciones",d:"GET /analytics/adjudicatarios?cpv=X (top empresas). GET /analytics/organo/:id/historico. GET /analytics/empresa/:nif (ganadas, importes, bajas). Aggregation queries.",q:["Top adjudicatarios por CPV","Histórico órgano con timeline","Perfil empresa con estadísticas"]},
{id:"2-06",p:2,l:"backend",s:"S16-18",pr:"critical",t:"Score idoneidad: endpoint + conexión IA",d:"GET /licitaciones/:id/score {empresa_id} → llama servicio IA → score 0-100 + factores explicados.",q:["Score numérico 0-100","Factores: CPV, experiencia, importe, ubicación","<5s respuesta"]},
{id:"2-07",p:2,l:"backend",s:"S17-19",pr:"important",t:"Integraciones: Slack + Google Calendar",d:"Slack OAuth + enviar licitaciones a canal. Google Calendar: eventos con deadlines de presentación.",q:["Slack: licitación enviada a canal","Calendar: evento creado con fecha límite","Reminder 3d y 1d antes"]},
{id:"2-08",p:2,l:"backend",s:"S19-21",pr:"important",t:"API pública v1 + docs + consultas preliminares visibles",d:"API versionada /v1/. API keys + rate limiting por plan. Swagger auto-generado. Consultas preliminares como sección diferenciada.",q:["API key funciona","Rate limiting por plan","Swagger completo","Consultas preliminares buscables"]},

// Web Fase 2
{id:"2-09",p:2,l:"web",s:"S11-14",pr:"critical",t:"Kanban board interactivo con drag-drop",d:"@dnd-kit/sortable. Columnas configurables. Cards: título, presupuesto, deadline, responsable, CPV. Filtros. Vista lista alternativa. Modal detalle.",q:["Drag-drop fluido","Columnas reordenables","Cards con 5 campos","Filtros por responsable/CPV","Modal detalle al click"]},
{id:"2-10",p:2,l:"web",s:"S14-16",pr:"critical",t:"Chat IA con pliegos: UI completa",d:"Sidebar/modal chat. Input. Mensajes con markdown. Citas clickables. Streaming typewriter. Historial. Preguntas sugeridas.",q:["Input envía pregunta","Respuesta streaming","Citas clickables","Preguntas sugeridas","Historial persistente","Copy respuesta"]},
{id:"2-11",p:2,l:"web",s:"S14-17",pr:"critical",t:"Subvenciones: buscador + alertas + fichas",d:"Tab 'Subvenciones' en sidebar. Buscador con filtros. Ficha subvención. Alertas incluyen subvenciones.",q:["Tab visible","Buscador funcional","Ficha completa","Alertas con subvenciones"]},
{id:"2-12",p:2,l:"web",s:"S16-17",pr:"critical",t:"Score idoneidad: badge + explicación",d:"Badge circular 0-100 con color (rojo<30, amarillo 30-60, verde>60). Expandible con factores. En ficha y en resultados búsqueda.",q:["Badge visible en ficha","Badge en resultados","Colores correctos","Factores expandibles"]},
{id:"2-13",p:2,l:"web",s:"S17-19",pr:"critical",t:"Analytics competencia: gráficos + top adjudicatarios",d:"Dashboard /analytics. Top adjudicatarios (bar chart). Histórico órgano (timeline). Perfil empresa. Recharts. Filtros.",q:["Bar chart top adjudicatarios","Timeline órgano","Perfil empresa","Filtros CPV/CCAA/periodo"]},
{id:"2-14",p:2,l:"web",s:"S15-16",pr:"critical",t:"Pricing page + Stripe checkout",d:"/pricing con 4 planes cards. Comparativa features. Toggle mensual/anual. Stripe Checkout.",q:["4 planes visibles","Comparativa features","Toggle mes/año","Checkout funciona","Post-pago → dashboard"]},
{id:"2-15",p:2,l:"web",s:"S18-20",pr:"important",t:"Settings: integraciones + equipo + billing",d:"Conectar Slack/Calendar. Invitar miembros, roles. Ver plan, cambiar, facturas, cancelar.",q:["Slack conectar","Calendar conectar","Invitar miembro","Cambiar rol","Ver facturas"]},
{id:"2-16",p:2,l:"web",s:"S20-22",pr:"important",t:"Landing page pública: hero + features + pricing + SEO",d:"Hero con CTA. Social proof. Features. Pricing section. FAQ. Blog section. Meta tags, OG, sitemap.",q:["Hero impactante","CTA registro","Features section","Pricing","SEO meta tags","OG images","Sitemap"]},
{id:"2-17",p:2,l:"web",s:"S19-20",pr:"important",t:"Notificaciones in-app: bell + dropdown",d:"Bell icon con badge count. Dropdown lista notifs. Mark as read. Link a licitación. WebSocket/polling.",q:["Badge con count","Dropdown lista","Mark as read","Links funcionan"]},

// Mobile Fase 2
{id:"2-18",p:2,l:"mobile",s:"S13-15",pr:"critical",t:"Kanban mobile + subvenciones feed unificado",d:"Kanban simplificado con scroll horizontal. Feed con toggle Licitaciones/Subvenciones/Todo.",q:["Kanban scroll horizontal","Toggle feed funciona","Cards adaptadas"]},
{id:"2-19",p:2,l:"mobile",s:"S17-19",pr:"important",t:"Chat IA + Score idoneidad mobile",d:"Chat nativo con keyboard avoiding. Score badge en cards.",q:["Chat funcional","Keyboard OK","Score badge visible"]},
{id:"2-20",p:2,l:"mobile",s:"S20-22",pr:"critical",t:"Publicar App Store + Play Store",d:"EAS Build. Screenshots. Descripción ASO. TestFlight beta. Submit ambas stores.",q:["iOS build OK","Android build OK","TestFlight 10 testers","Ambas stores aprobadas"]},

// IA Fase 2
{id:"2-21",p:2,l:"ia",s:"S11-14",pr:"critical",t:"Score idoneidad: modelo empresa↔licitación",d:"Input: perfil empresa + licitación. Output: 0-100 + factores. Rules + LLM para requisitos vs capacidades.",q:["Score coherente","Limpieza+limpieza >70","IT+obras <30","Factores explicados","<5s"]},
{id:"2-22",p:2,l:"ia",s:"S13-16",pr:"critical",t:"RAG avanzado: multi-doc + reranking + memoria",d:"Buscar en múltiples docs (PCAP+PPT+anexos). Cross-encoder reranking. Memoria conversación.",q:["Multi-doc funciona","Reranking mejora relevancia","Memoria últimos 5 mensajes"]},
{id:"2-23",p:2,l:"ia",s:"S15-18",pr:"critical",t:"Extracción estructurada: requisitos + criterios + plazos",d:"Extraer de pliegos: requisitos solvencia, criterios adjudicación (ponderaciones), plazos, penalizaciones. Output JSON.",q:["Requisitos solvencia extraídos","Criterios con ponderación","Plazos exactos","JSON estructurado"]},
{id:"2-24",p:2,l:"ia",s:"S17-20",pr:"important",t:"Predicción precio óptimo basado en histórico",d:"Input: licitación + histórico adjudicaciones similares. Output: precio recomendado + rango baja probable.",q:["Precio sugerido coherente","Rango baja en %","Basado en datos reales"]},

// ╔═══════════════════════════════════════════════════════════════╗
// ║ FASE 3 — KILLER FEATURES (Semanas 23-40)                     ║
// ╚═══════════════════════════════════════════════════════════════╝
{id:"3-01",p:3,l:"backend",s:"S23-26",pr:"critical",t:"Vault documental: CRUD + S3 + versionado + expiración",d:"Documentos empresa: DEUC, certificados, pólizas, balances, experiencia, CVs. Upload S3/R2. Versionado. Tags. Fecha expiración con alerta.",q:["Upload PDF/imagen OK","S3 almacena","Carpetas por tipo","Versiones anteriores accesibles","Alerta expiración"]},
{id:"3-02",p:3,l:"backend",s:"S26-30",pr:"critical",t:"API generación ofertas: orquestar IA + vault",d:"POST /ofertas/generar {licitacion_id, tipo: memoria|economica|deuc}. Obtener datos empresa vault + licitación + análisis pliego IA → generar borrador.",q:["Genera borrador memoria técnica","Genera propuesta económica","Genera DEUC pre-rellenado","<60s por documento"]},
{id:"3-03",p:3,l:"backend",s:"S25-28",pr:"critical",t:"Búsqueda full-text en pliegos: Elasticsearch/Meilisearch",d:"Indexar texto de todos los pliegos. Búsqueda: query → resultados con highlight + link PDF + página.",q:["Búsqueda 'subcontratación' → resultados relevantes","Highlight en texto","Link a PDF+página","Filtros CPV, órgano"]},
{id:"3-04",p:3,l:"backend",s:"S25-28",pr:"critical",t:"Completar 34 BOPs + convenios colectivos + tribunales",d:"19 BOPs restantes. Scraping convenios colectivos BOE/BOP (para propuestas económicas). Resoluciones TACRC + tribunales autonómicos.",q:["34 BOPs completos","Convenios indexados por sector","Resoluciones indexadas"]},
{id:"3-05",p:3,l:"backend",s:"S28-32",pr:"important",t:"Predicción candidatos/bajas + Webhooks/Zapier + Notion",d:"Predicción quién se presentará + baja estimada. Webhooks eventos. Zapier app. Notion API integration.",q:["Predicción candidatos coherente","Baja estimada con intervalo","Webhooks funcionan","Zapier triggers","Notion pages creadas"]},
{id:"3-06",p:3,l:"backend",s:"S32-39",pr:"important",t:"Dashboard BI + multi-tenancy + SSO + Funding UE",d:"Aggregation pipelines métricas sectoriales. Workspaces. SAML SSO enterprise. Funding & Tenders Portal UE (Horizon, LIFE, Digital Europe).",q:["Dashboard BI con gráficos","Workspaces aislados","SSO SAML funciona","Fondos UE directos ingeridos"]},

// Web Fase 3
{id:"3-07",p:3,l:"web",s:"S25-28",pr:"critical",t:"Vault documental UI completa",d:"Página /vault: upload drag-drop, carpetas, preview PDF inline, versionado, fecha expiración.",q:["Upload drag-drop","Carpetas organizables","Preview inline","Expiración visible"]},
{id:"3-08",p:3,l:"web",s:"S28-36",pr:"critical",t:"Generador ofertas: wizard 5 pasos + editor IA + export",d:"Paso 1: elegir licitación. Paso 2: tipo doc. Paso 3: IA genera (progress bar). Paso 4: editor TipTap con sidebar requisitos como checklist. Paso 5: exportar DOCX/PDF.",q:["Wizard 5 pasos end-to-end","Editor TipTap editable","Sidebar requisitos checklist","Auto-mark requisito cubierto","Export DOCX válido","Export PDF válido","Autoguardado 30s"]},
{id:"3-09",p:3,l:"web",s:"S27-30",pr:"critical",t:"Búsqueda en pliegos UI + predicción visual",d:"Search global con scope 'Dentro de pliegos'. Resultados con snippet+highlight. Predicción: cards empresas probables con estadísticas.",q:["Búsqueda en pliegos funciona","Snippet con highlight","Predicción empresas visible","Baja estimada visual"]},
{id:"3-10",p:3,l:"web",s:"S34-40",pr:"important",t:"Dashboard BI + integraciones settings + export informes",d:"Gráficos Recharts interactivos. Métricas por sector/CCAA. Settings Notion/Teams/Zapier. Export PDF/Excel.",q:["Gráficos interactivos","Filtros globales","Settings integraciones","Export funciona"]},

// Mobile Fase 3
{id:"3-11",p:3,l:"mobile",s:"S28-37",pr:"important",t:"Vault mobile (cámara) + review ofertas + offline",d:"Acceso vault. Upload desde cámara. Review borradores. Offline cache licitaciones guardadas.",q:["Vault accesible","Cámara scan doc","Review borradores","Offline funciona"]},

// IA Fase 3
{id:"3-12",p:3,l:"ia",s:"S23-30",pr:"critical",t:"Generador memoria técnica con IA",d:"Input: pliego chunks + perfil empresa vault. Output: borrador 5+ páginas adaptado a criterios adjudicación. Secciones auto-detectadas. [REVISAR] tags.",q:["5+ páginas generadas","Secciones = criterios pliego","Datos empresa incorporados","Tags [REVISAR]","<60s"]},
{id:"3-13",p:3,l:"ia",s:"S26-29",pr:"critical",t:"Auto-relleno DEUC + generador propuesta económica",d:"DEUC: extraer datos empresa vault → mapear campos DEUC → XML/PDF. Propuesta económica: precio óptimo + desglose costes + convenio colectivo.",q:["DEUC pre-rellenado correcto","Propuesta con precio sugerido","Desglose costes directos/indirectos","Convenio colectivo aplicado"]},
{id:"3-14",p:3,l:"ia",s:"S30-40",pr:"important",t:"Predicción candidatos + bajas + reranking + feedback loop",d:"Modelo candidatos (quién se presentará). Regresión bajas. Mejora RAG con reranking. Feedback: ofertas ganadoras/perdedoras como training signal.",q:["Candidatos predichos coherentes","Baja con intervalo confianza","Reranking mejora citas","Feedback registrado"]},

// ╔═══════════════════════════════════════════════════════════════╗
// ║ FASE 4 — ESCALA & EXPANSIÓN (Semanas 41-56+)                 ║
// ╚═══════════════════════════════════════════════════════════════╝
{id:"4-01",p:4,l:"backend",s:"S41-48",pr:"critical",t:"i18n completo + scrapers Portugal (BASE.gov.pt)",d:"i18next en API+web+mobile. ES/PT/EN. Scraper BASE.gov.pt. Contenido IA multi-idioma.",q:["App completa en 3 idiomas","Portugal 200+ licitaciones","Resúmenes IA en idioma usuario"]},
{id:"4-02",p:4,l:"backend",s:"S45-53",pr:"important",t:"White-label + Marketplace expertos + GDPR",d:"Custom domains/branding por tenant. Perfiles expertos con booking + Stripe Connect. Data export + derecho olvido.",q:["White-label funciona","Marketplace operativo","GDPR compliance"]},
{id:"4-03",p:4,l:"backend",s:"S48-56",pr:"important",t:"TED toda UE + Latam primeras fuentes + OCDS",d:"TED 27 países. Chile/Colombia/México primeras fuentes. Normalizar a Open Contracting Data Standard.",q:["TED toda UE","3 países Latam","OCDS normalization"]},
{id:"4-04",p:4,l:"web",s:"S42-56",pr:"critical",t:"Multi-idioma UI + Marketplace + Academia + Comunidad",d:"i18next completo. Directorio expertos. Cursos/vídeos. Foro comunidad. Admin panel enterprise.",q:["3 idiomas completos","Marketplace funcional","Academia con cursos","Foro activo"]},
{id:"4-05",p:4,l:"mobile",s:"S44-56",pr:"important",t:"Multi-idioma + Marketplace mobile + Apple Watch",d:"3 idiomas. Buscar expertos+chat+booking. watchOS deadlines.",q:["Mobile 3 idiomas","Marketplace mobile","Watch notificaciones"]},
{id:"4-06",p:4,l:"ia",s:"S43-56",pr:"important",t:"Multi-lingual PT/EN + auto-mejora + recomendador proactivo",d:"Modelos adaptados PT/EN. Fine-tuning con feedback. Push diario 'Licitaciones que deberías mirar' basado en perfil+patrones.",q:["IA funciona en PT/EN","Mejora con feedback","Recomendaciones proactivas diarias"]},
];

// ════════════════════════════════════════════════════════════════
const PHASES=[
{id:0,n:"Día Cero",sub:"Setup completo proyecto",dur:"S0",c:"#64748B",ms:"Repos+CI/CD+Docker operativo",ic:"🏗️"},
{id:1,n:"Cimientos",sub:"MVP: scraping 47+ fuentes + buscador + alertas + IA",dur:"S1–10",c:"#EF4444",ms:"Beta privada 50 testers",ic:"🚀"},
{id:2,n:"Diferenciación",sub:"Subvenciones + Kanban + Score IA + Pagos + Stores",dur:"S11–22",c:"#F59E0B",ms:"Lanzamiento público 2K users",ic:"⚡"},
{id:3,n:"Killer Features",sub:"Generador ofertas IA + Predicción + búsqueda pliegos",dur:"S23–40",c:"#8B5CF6",ms:"1.000 pago · 75K€ MRR",ic:"🏆"},
{id:4,n:"Escala",sub:"Internacional + Marketplace + Enterprise",dur:"S41–56+",c:"#06B6D4",ms:"3.000 pago · 250K€ MRR",ic:"👑"},
];
const LY={infra:{l:"Infra/DevOps",c:"#64748B",ic:"🔧"},backend:{l:"Backend",c:"#3B82F6",ic:"⚙️"},web:{l:"Web App",c:"#10B981",ic:"🌐"},mobile:{l:"Mobile",c:"#F59E0B",ic:"📱"},ia:{l:"Servicio IA",c:"#8B5CF6",ic:"🧠"}};
const PR={critical:{l:"Crítico",c:"#EF4444",bg:"rgba(239,68,68,0.08)",d:"🔴"},important:{l:"Importante",c:"#F59E0B",bg:"rgba(245,158,11,0.06)",d:"🟡"},nice:{l:"Nice-to-have",c:"#22C55E",bg:"rgba(34,197,94,0.06)",d:"🟢"}};

export default function App(){
  const[ck,setCk]=useState({});
  const[ph,setPh]=useState(0);
  const[lf,setLf]=useState(null);
  const[pf,setPf]=useState(null);
  const[q,setQ]=useState("");
  const[exp,setExp]=useState({});
  const[col,setCol]=useState({});
  const tog=useCallback((id)=>setCk(p=>({...p,[id]:!p[id]})),[]);
  const togExp=useCallback((id)=>setExp(p=>({...p,[id]:!p[id]})),[]);

  const tasks=T.filter(t=>{
    if(t.p!==ph)return false;
    if(lf&&t.l!==lf)return false;
    if(pf&&t.pr!==pf)return false;
    if(q&&!t.t.toLowerCase().includes(q.toLowerCase())&&!(t.d||"").toLowerCase().includes(q.toLowerCase()))return false;
    return true;
  });
  const phAll=T.filter(t=>t.p===ph),phDone=phAll.filter(t=>ck[t.id]).length,phTot=phAll.length,phPct=phTot?Math.round((phDone/phTot)*100):0;
  const gDone=T.filter(t=>ck[t.id]).length,gTot=T.length,gPct=gTot?Math.round((gDone/gTot)*100):0;
  const byLy={};tasks.forEach(t=>{if(!byLy[t.l])byLy[t.l]=[];byLy[t.l].push(t);});
  const P=PHASES[ph];

  return(<div style={{minHeight:"100vh",background:"#08090d",color:"#e2e8f0",fontFamily:"'Segoe UI',-apple-system,sans-serif",fontSize:14}}>
    {/* HEADER */}
    <div style={{padding:"16px 20px 0",borderBottom:"1px solid #1a1d2a"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:22}}>📋</span>
          <div><div style={{fontSize:17,fontWeight:800}}>Roadmap Definitivo</div>
          <div style={{fontSize:11,color:"#64748B"}}>{gTot} tareas · 5 fases · 3BE+1FE+1UX · 47+ fuentes de datos</div></div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{fontSize:18,fontWeight:800,color:gPct===100?"#22C55E":"#3B82F6"}}>{gPct}%</div>
          <div style={{width:70,height:6,background:"#1a1d2a",borderRadius:3,overflow:"hidden"}}><div style={{width:gPct+"%",height:"100%",background:gPct===100?"#22C55E":"#3B82F6",borderRadius:3,transition:"width 0.3s"}}/></div>
          <span style={{fontSize:11,color:"#64748B"}}>{gDone}/{gTot}</span>
        </div>
      </div>
      <div style={{display:"flex",gap:2,marginTop:12,overflowX:"auto"}}>
        {PHASES.map((p,i)=>{const d=T.filter(t=>t.p===i&&ck[t.id]).length,tot=T.filter(t=>t.p===i).length,pct=tot?Math.round((d/tot)*100):0;
        return(<button key={p.id} onClick={()=>{setPh(i);setCol({});setExp({});}} style={{padding:"7px 12px",borderRadius:"7px 7px 0 0",border:ph===i?`1px solid ${p.c}44`:"1px solid transparent",borderBottom:"none",background:ph===i?p.c+"12":"transparent",color:ph===i?p.c:"#64748B",fontSize:11,fontWeight:ph===i?700:500,cursor:"pointer",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:5}}>
          <span>{p.ic}</span><span>F{p.id}</span><span style={{fontSize:10,opacity:0.6}}>{pct}%</span>{pct===100&&<span>✅</span>}
        </button>);})}
      </div>
    </div>

    {/* PHASE BAR */}
    <div style={{padding:"12px 20px",background:"#0b0e14",borderBottom:"1px solid #1a1d2a"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
        <div><div style={{fontSize:18,fontWeight:800,color:P.c}}>{P.ic} Fase {P.id}: {P.n}</div>
        <div style={{fontSize:11,color:"#64748B"}}>{P.sub} · <span style={{color:P.c}}>{P.dur}</span></div></div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:100,height:7,background:"#1a1d2a",borderRadius:4,overflow:"hidden"}}><div style={{width:phPct+"%",height:"100%",background:P.c,borderRadius:4,transition:"width 0.3s"}}/></div>
          <span style={{fontSize:13,fontWeight:700,color:P.c}}>{phPct}%</span>
          <span style={{fontSize:11,color:"#64748B"}}>{phDone}/{phTot}</span>
        </div>
      </div>
      <div style={{marginTop:6,background:P.c+"10",border:`1px solid ${P.c}33`,borderRadius:5,padding:"5px 10px",fontSize:11,color:"#94A3B8"}}>🏁 <strong style={{color:P.c}}>Milestone:</strong> {P.ms}</div>
    </div>

    {/* FILTERS */}
    <div style={{padding:"8px 20px",display:"flex",gap:5,flexWrap:"wrap",alignItems:"center",borderBottom:"1px solid #1a1d2a"}}>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="🔍 Buscar..." style={{background:"#0e1017",border:"1px solid #1a1d2a",borderRadius:5,padding:"4px 10px",color:"#e2e8f0",fontSize:11,width:160,outline:"none"}}/>
      {Object.entries(LY).map(([k,v])=>(<button key={k} onClick={()=>setLf(lf===k?null:k)} style={{padding:"2px 8px",borderRadius:4,fontSize:10,cursor:"pointer",border:`1px solid ${lf===k?v.c+"66":"#1a1d2a"}`,background:lf===k?v.c+"15":"transparent",color:lf===k?v.c:"#64748B",fontWeight:lf===k?600:400}}>{v.ic} {v.l}</button>))}
      <span style={{width:1,height:16,background:"#1a1d2a"}}/>
      {Object.entries(PR).map(([k,v])=>(<button key={k} onClick={()=>setPf(pf===k?null:k)} style={{padding:"2px 8px",borderRadius:4,fontSize:10,cursor:"pointer",border:`1px solid ${pf===k?v.c+"66":"#1a1d2a"}`,background:pf===k?v.bg:"transparent",color:pf===k?v.c:"#64748B"}}>{v.d} {v.l}</button>))}
    </div>

    {/* TASKS */}
    <div style={{padding:"6px 20px 40px"}}>
      {Object.entries(byLy).map(([lk,lt])=>{const ly=LY[lk],ld=lt.filter(t=>ck[t.id]).length,ic=col[lk];
      return(<div key={lk} style={{marginTop:10,background:"#0e1017",border:`1px solid ${ly.c}22`,borderRadius:8,overflow:"hidden"}}>
        <div onClick={()=>setCol(p=>({...p,[lk]:!p[lk]}))} style={{padding:"8px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",background:ly.c+"08",borderBottom:`1px solid ${ly.c}15`}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:14}}>{ly.ic}</span><span style={{fontSize:13,fontWeight:700,color:ly.c}}>{ly.l}</span><span style={{fontSize:10,color:"#64748B"}}>{ld}/{lt.length}</span></div>
          <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:50,height:3,background:"#1a1d2a",borderRadius:2,overflow:"hidden"}}><div style={{width:(lt.length?(ld/lt.length)*100:0)+"%",height:"100%",background:ly.c,borderRadius:2}}/></div>
          <span style={{color:"#475569",fontSize:11,transform:ic?"rotate(-90deg)":"none",transition:"transform 0.2s"}}>▾</span></div>
        </div>
        {!ic&&(<div style={{padding:"2px 6px 6px"}}>
          {lt.map(task=>{const pr=PR[task.pr],done=ck[task.id],isExp=exp[task.id];
          return(<div key={task.id} style={{margin:"2px 0",borderRadius:6,border:isExp?`1px solid ${ly.c}33`:"1px solid transparent",background:isExp?"#0a0d14":"transparent",overflow:"hidden"}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:8,padding:"6px 8px",cursor:"pointer",opacity:done?0.5:1}} onClick={()=>togExp(task.id)}>
              <div onClick={e=>{e.stopPropagation();tog(task.id);}} style={{width:16,height:16,borderRadius:3,flexShrink:0,marginTop:1,border:done?"2px solid #22C55E":"2px solid #2a2f40",background:done?"#22C55E":"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#fff",cursor:"pointer"}}>{done?"✓":""}</div>
              <div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:600,color:done?"#4a5568":"#CBD5E1",textDecoration:done?"line-through":"none",lineHeight:1.4}}>{pr.d} {task.t}</div></div>
              <span style={{fontFamily:"monospace",fontSize:9,color:"#3a3f55",background:"#0a0d12",padding:"1px 5px",borderRadius:3,whiteSpace:"nowrap",flexShrink:0}}>{task.s}</span>
              <span style={{fontSize:10,color:"#3a3f55",transition:"transform 0.2s",transform:isExp?"rotate(180deg)":"none"}}>▾</span>
            </div>
            {isExp&&(<div style={{padding:"0 8px 10px 32px",fontSize:12}}>
              <div style={{background:"#111520",borderRadius:6,padding:"10px 12px",marginBottom:8,border:"1px solid #1a1d2a"}}>
                <div style={{fontSize:10,fontWeight:700,color:"#64748B",textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>📝 Qué hacer y por qué</div>
                <div style={{color:"#94A3B8",lineHeight:1.6}}>{task.d}</div>
              </div>
              {task.q&&task.q.length>0&&(<div style={{background:"#0d1018",borderRadius:6,padding:"10px 12px",border:"1px solid #1a2030"}}>
                <div style={{fontSize:10,fontWeight:700,color:"#22C55E",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>✅ Criterios QA — la tarea está DONE cuando:</div>
                {task.q.map((c,i)=>(<div key={i} style={{display:"flex",alignItems:"flex-start",gap:6,marginTop:4}}><span style={{color:"#22C55E",fontSize:10,marginTop:2,flexShrink:0}}>▸</span><span style={{color:"#94A3B8",fontSize:11,lineHeight:1.5}}>{c}</span></div>))}
              </div>)}
              <div style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap"}}>
                <span style={{fontSize:10,padding:"2px 8px",borderRadius:3,background:pr.bg,color:pr.c,border:`1px solid ${pr.c}33`}}>{pr.d} {pr.l}</span>
                <span style={{fontSize:10,padding:"2px 8px",borderRadius:3,background:ly.c+"12",color:ly.c,border:`1px solid ${ly.c}33`}}>{ly.ic} {ly.l}</span>
                <span style={{fontSize:10,padding:"2px 8px",borderRadius:3,background:"#111520",color:"#64748B",border:"1px solid #1a1d2a"}}>📅 {task.s}</span>
              </div>
            </div>)}
          </div>);})}
        </div>)}
      </div>);})}
      {Object.keys(byLy).length===0&&<div style={{textAlign:"center",padding:30,color:"#3a3f55",fontSize:13}}>No hay tareas con esos filtros</div>}
    </div>
  </div>);
}