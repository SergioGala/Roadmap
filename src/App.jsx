import { useState, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════
// ALL TASKS — with acceptance criteria (ac) for QA
// ═══════════════════════════════════════════════════════════════
const T = [
  // FASE 0
  { id:"0-01", ph:0, ly:"infra", sp:"S0", pr:"critical",
    t:"Crear organización en GitHub",
    desc:"Crear org (ej: @licitaapp). Configurar permisos: 3 devs backend (admin), 1 front (write), UX (read). Habilitar GitHub Projects.",
    why:"Necesitamos un lugar centralizado para todo el código. La organización permite gestionar permisos, repos y projects desde un solo sitio.",
    ac:["Org creada y accesible por los 5 miembros","Branch protection activada en repos: require PR + 1 review + CI green","GitHub Projects board creado con columnas: Backlog, Sprint, In Progress, Review, Done","Template de PR creado con checklist: tests, docs, screenshots"],
    test:"Cada miembro del equipo puede clonar ambos repos. Un push directo a main es rechazado. Un PR sin approval no se puede mergear." },
  { id:"0-02", ph:0, ly:"infra", sp:"S0", pr:"critical",
    t:"Crear Repo 1: monorepo-app (JS/TS)",
    desc:"Repo privado con Turborepo. Estructura: apps/backend, apps/web, apps/mobile, packages/shared, packages/ui.",
    why:"Un monorepo nos permite compartir tipos TypeScript y componentes UI entre web y mobile sin publicar paquetes npm. Turborepo cachea builds y paraleliza tareas.",
    ac:["Repo creado con estructura de carpetas completa","turbo.json configurado con pipelines: build, dev, lint, test","package.json raíz con workspaces configurados","npm install funciona sin errores","turbo dev arranca backend + web en paralelo"],
    test:"Clonar repo limpio → npm install → docker-compose up → turbo dev → backend responde en localhost:3000/health y web carga en localhost:5173" },
  { id:"0-03", ph:0, ly:"infra", sp:"S0", pr:"critical",
    t:"Crear Repo 2: ia-service (Python)",
    desc:"Repo privado. FastAPI + estructura: app/api/, app/ingestion/, app/models/, app/generation/, app/rag/.",
    why:"El servicio de IA tiene dependencias Python pesadas (PyTorch, transformers) que no encajan en el monorepo JS. Se despliega independientemente.",
    ac:["Repo creado con estructura de carpetas","requirements.txt con dependencias base","Dockerfile funcional","FastAPI responde en /health","README con instrucciones de setup local"],
    test:"git clone → python -m venv venv → pip install -r requirements.txt → uvicorn app.main:app → GET /health devuelve {status: ok}" },
  { id:"0-04", ph:0, ly:"backend", sp:"S0", pr:"critical",
    t:"Scaffold NestJS en apps/backend",
    desc:"nest new backend --strict. Instalar: @nestjs/config, @nestjs/swagger, class-validator, class-transformer, prisma, bullmq.",
    why:"NestJS da estructura modular con inyección de dependencias, decorators para validación, y Swagger auto-generado. Ideal para APIs grandes con múltiples módulos.",
    ac:["NestJS arranca sin errores","Swagger UI accesible en /api/docs","ESLint + Prettier configurados y sin warnings","tsconfig.json con strict mode"],
    test:"npm run start:dev → abrir localhost:3000/api/docs → se ve la documentación Swagger vacía" },
  { id:"0-05", ph:0, ly:"web", sp:"S0", pr:"critical",
    t:"Scaffold React en apps/web",
    desc:"Vite + React + TS. Instalar: TailwindCSS v4, shadcn/ui, react-router, tanstack-query, zustand, react-hook-form + zod.",
    why:"Vite es el bundler más rápido para dev. shadcn/ui da componentes accesibles y customizables (no una librería, se copia el código). Zustand para state global simple.",
    ac:["React app arranca sin errores con Vite","TailwindCSS funciona (probar con una clase)","shadcn/ui inicializado (button component funciona)","React Router con ruta / que renderiza","Build produce bundle sin errores"],
    test:"npm run dev → localhost:5173 carga → se ve un botón de shadcn/ui con estilos Tailwind → npm run build sin errores" },
  { id:"0-06", ph:0, ly:"mobile", sp:"S0", pr:"critical",
    t:"Scaffold React Native en apps/mobile",
    desc:"Expo con expo-router (tabs). Instalar: nativewind, reanimated, expo-notifications, expo-secure-store.",
    why:"Expo simplifica enormemente el dev de RN: no necesitas Xcode/Android Studio para empezar. expo-router da file-based routing como Next.js.",
    ac:["App arranca en Expo Go (iOS o Android)","Navegación por tabs funciona","NativeWind aplica estilos Tailwind","Texto 'Hello World' visible en primera tab"],
    test:"npx expo start → escanear QR con Expo Go → app carga → navegar entre tabs funciona" },
  { id:"0-07", ph:0, ly:"ia", sp:"S0", pr:"critical",
    t:"Scaffold servicio IA (FastAPI)",
    desc:"FastAPI app con estructura modular. Dockerfile. Endpoints: /health, /docs.",
    why:"FastAPI es el framework Python más rápido para APIs, con tipado automático, docs OpenAPI, y soporte async nativo. Perfecto para servir modelos de IA.",
    ac:["FastAPI arranca con uvicorn","GET /health → {status: ok}","/docs muestra Swagger UI","Dockerfile construye imagen sin errores"],
    test:"docker build -t ia-service . → docker run -p 8000:8000 ia-service → curl localhost:8000/health → OK" },
  { id:"0-08", ph:0, ly:"infra", sp:"S0", pr:"critical",
    t:"Docker Compose para desarrollo local",
    desc:"docker-compose.yml con: postgres:16, redis:7, qdrant (vector DB). Volúmenes persistentes. .env.example con todas las variables.",
    why:"Cada dev necesita los mismos servicios locales. Docker Compose estandariza el entorno. Sin esto, cada uno tendrá versiones diferentes de Postgres y habrá bugs fantasma.",
    ac:["docker-compose up levanta los 3 servicios","PostgreSQL accesible en localhost:5432","Redis accesible en localhost:6379","Qdrant dashboard accesible en localhost:6333/dashboard",".env.example documentado con cada variable"],
    test:"docker-compose up -d → psql -h localhost -U licitaapp -d licitaapp → conexión OK → redis-cli ping → PONG" },
  { id:"0-09", ph:0, ly:"infra", sp:"S0", pr:"critical",
    t:"CI/CD: GitHub Actions",
    desc:"Workflows: ci.yml (lint + test en PR), deploy-backend.yml, deploy-web.yml. Turbo prune para builds selectivos.",
    why:"Sin CI, se mergean PRs rotos. Los tests y lint deben correr automáticamente en cada PR. El deploy debe ser automático al mergear a main.",
    ac:["ci.yml se ejecuta en cada PR","Falla si lint tiene errores","Falla si tests fallan","Badge de CI visible en README"],
    test:"Crear PR con un error de ESLint → CI falla → fix → CI pasa → PR mergeable" },
  { id:"0-10", ph:0, ly:"infra", sp:"S0", pr:"critical",
    t:"packages/shared: tipos + constantes",
    desc:"Tipos TS compartidos: User, Licitacion, Alerta, etc. Constantes: CPV codes, CCAA list, estados, tipos contrato. Validaciones Zod.",
    why:"Sin tipos compartidos, backend y frontend tendrían definiciones duplicadas que se desincronizarían. Un cambio en la API rompería el frontend sin aviso.",
    ac:["Package exporta todos los tipos principales","Se puede importar desde apps/backend y apps/web","Los tipos de Licitacion cubren todos los campos del schema Prisma","Zod schemas validan los mismos campos que Prisma"],
    test:"import { Licitacion } from '@licitaapp/shared' compila sin errores tanto en backend como en web" },
  { id:"0-11", ph:0, ly:"web", sp:"S0", pr:"important",
    t:"UX: Design System en Figma",
    desc:"Paleta colores, tipografía, spacing, componentes base, iconografía. Wireframes baja fidelidad de: login, onboarding, buscador, ficha, alertas, dashboard.",
    why:"Sin design system, el frontend improvisará estilos y la app parecerá inconsistente. Los wireframes alinean al equipo en qué estamos construyendo antes de escribir código.",
    ac:["Figma con paleta de colores (primario, secundario, grays, semánticos)","Tipografía elegida con scale de tamaños","Componentes: Button, Input, Card, Badge, Modal, Table, Sidebar","Wireframes de las 6 páginas principales del MVP","Iconografía: librería elegida (Lucide/Phosphor)"],
    test:"Dev 4 puede abrir Figma y saber exactamente qué colores, fuentes y componentes usar sin preguntar" },

  // FASE 1 — Solo muestro una selección representativa; la versión completa tendría las 120+ tareas
  { id:"1-01", ph:1, ly:"backend", sp:"S1", pr:"critical",
    t:"Diseñar y crear esquema de BD completo (Prisma)",
    desc:"Todas las tablas: users, organizations, licitaciones, subvenciones, alertas, alert_matches, organos_contratacion, kanban_boards, kanban_cards, documents, notifications, cpv_codes. Relaciones, índices, constraints.",
    why:"El schema debe estar completo desde el principio para evitar migraciones destructivas. Cada tabla que olvidemos será una migración dolorosa después con datos en producción.",
    ac:["schema.prisma con todas las tablas del diseño","Migración inicial ejecuta sin errores","Seed script crea: 1 user admin, 1 org, tabla CPV completa (9.454 códigos), mapping CNAE→CPV","Todos los campos tienen tipos correctos y constraints (unique, not null, etc.)","Índices en campos de búsqueda frecuente: estado, cpvCodes, ccaa, fechaPresentacion"],
    test:"npx prisma migrate dev --name init → OK. npx prisma db seed → DB tiene CPVs, user admin. psql → SELECT count(*) FROM cpv_codes → 9454 rows." },
  { id:"1-02", ph:1, ly:"backend", sp:"S1-2", pr:"critical",
    t:"Módulo Auth: registro + login + JWT + refresh",
    desc:"POST /auth/register, /auth/login, /auth/refresh, /auth/forgot-password, /auth/reset-password. JWT access (15min) + refresh (7d). Bcrypt passwords. Guards: AuthGuard, RolesGuard.",
    why:"Es lo primero que necesitan web y mobile para funcionar. Sin auth no hay usuarios, sin usuarios no hay nada. Los refresh tokens evitan que el usuario tenga que loguearse cada 15 min.",
    ac:["POST /auth/register crea usuario con password hasheada","POST /auth/login devuelve access_token + refresh_token","Access token expira en 15 min","POST /auth/refresh genera nuevo access token con refresh token válido","POST /auth/forgot-password envía email con link de reset","Rutas protegidas devuelven 401 sin token","Swagger documenta todos los endpoints con schemas"],
    test:"Registrar usuario → login → usar access token en header → acceder ruta protegida → OK. Esperar 15min (o forzar expiración) → 401 → refresh → nuevo token → OK. Forgot password → email llega → click link → reset funciona." },
  { id:"1-03", ph:1, ly:"backend", sp:"S2", pr:"critical",
    t:"Auth OAuth: Google + Microsoft",
    desc:"Passport strategies: passport-google-oauth20, passport-microsoft. Callback URLs. Merge de cuentas si ya existe email.",
    why:"Muchos usuarios empresariales usan Google Workspace o Microsoft 365. OAuth reduce fricción de registro enormemente. El merge de cuentas evita duplicados.",
    ac:["Botón 'Continuar con Google' redirige a consent screen de Google","Callback crea usuario nuevo o logea existente","Si email ya existe con password, se vincula la cuenta OAuth","Lo mismo funciona con Microsoft","Tokens JWT se generan igual que con login normal"],
    test:"Click 'Google' → consent → redirect → usuario creado con avatar de Google → logout → login con Google → mismo usuario." },
  { id:"1-04", ph:1, ly:"backend", sp:"S2-4", pr:"critical",
    t:"Motor de scraping: PLACE datasets abiertos (6 conjuntos)",
    desc:"Descargar y parsear los 6 datasets XML CODICE de PLACE: licitaciones, agregadas autonómicas, menores, medios propios, consultas preliminares, órganos. Scheduler: delta sync cada 6h, full sync semanal.",
    why:"PLACE es LA fuente principal con ~90% de todas las licitaciones de España. Los 6 datasets cubren licitaciones normales, menores, pre-licitaciones y el directorio de organismos. Sin esto no tenemos producto.",
    ac:["Job descarga los 6 ficheros XML de PLACE sin errores","Parser CODICE extrae todos los campos al modelo unificado","Deduplicación: no se crean duplicados si se ejecuta 2 veces","Delta sync: solo procesa licitaciones nuevas/modificadas desde última ejecución","Full sync semanal: reconstruye todo desde cero","Contratos menores se marcan con flag especial","Logs: nº licitaciones procesadas, nuevas, actualizadas, errores"],
    test:"Ejecutar job manualmente → SELECT count(*) FROM licitaciones → miles de filas. Ejecutar otra vez → count no cambia (dedup funciona). Ver logs: '5.432 procesadas, 127 nuevas, 45 actualizadas, 0 errores'." },
  { id:"1-05", ph:1, ly:"backend", sp:"S3", pr:"critical",
    t:"Scraper PLACE: ATOM feeds tiempo real",
    desc:"Poll feeds ATOM de PLACE cada 5 min. Detectar nuevas entradas → enqueue parse job → match con alertas → notificaciones.",
    why:"Los datasets abiertos se actualizan cada pocas horas. Los feeds ATOM detectan nuevas licitaciones en minutos. Es la diferencia entre alertar al usuario hoy o mañana.",
    ac:["Cron job ejecuta cada 5 minutos","Detecta nuevas entradas desde último poll (tracking de last-modified/etag)","Cada nueva licitación se encola en BullMQ para procesamiento","Después de procesar, se ejecuta matching contra alertas activas","Si hay match, se crea AlertMatch y se encola notificación","Rate limiting: no spamear PLACE (respetar headers de cache)"],
    test:"Crear alerta con CPV genérico → esperar a que PLACE publique algo nuevo (o simular) → AlertMatch creado → notificación en cola." },
  { id:"1-06", ph:1, ly:"backend", sp:"S3-4", pr:"critical",
    t:"Integrar BOE API + TED API",
    desc:"BOE: consumir API datos abiertos, filtrar sección III. TED: integrar API REST, filtrar país ES. Parsear ambos a modelo unificado.",
    why:"BOE tiene licitaciones de la AGE que a veces aparecen antes que en PLACE. TED tiene las licitaciones europeas (>umbrales SARA) que son los contratos más grandes y jugosos.",
    ac:["BOE: job diario descarga nuevas publicaciones sección III","TED: job diario consulta API con filtro country=ES","Ambos parsean al mismo modelo Licitacion","Dedup con licitaciones que ya vienen de PLACE (por externalId)","source field correcto: 'BOE' o 'TED'"],
    test:"Ejecutar jobs → hay licitaciones con source='BOE' y source='TED' en BD. No hay duplicados con las de PLACE (verificar por título + órgano)." },
  { id:"1-07", ph:1, ly:"backend", sp:"S4-7", pr:"critical",
    t:"Scrapers 7 plataformas autonómicas",
    desc:"Cataluña (PSCP), País Vasco, Madrid, Galicia, Andalucía, Navarra, La Rioja. Cada uno con su parser adaptado. Descargar pliegos/documentos que no estén en PLACE.",
    why:"Los pliegos completos y documentos a menudo solo están en la plataforma autonómica. Sin esto, el usuario ve la licitación pero no puede acceder a los documentos para analizarla.",
    ac:["7 scrapers funcionando sin errores","Cada scraper extrae: licitaciones + URLs de documentos/pliegos","Dedup con PLACE: si licitación ya existe, solo enriquece con documentos","Scheduler: cada 12h","Errores de scraping no crashean el job (try/catch por licitación)","Métricas: licitaciones por fuente autonómica"],
    test:"Ejecutar los 7 → hay licitaciones con source='CAT_PSCP', 'PV_EUSKADI', etc. Licitaciones de PLACE ahora tienen más documentos. Dashboard de métricas muestra conteos por fuente." },
  { id:"1-08", ph:1, ly:"backend", sp:"S5-7", pr:"critical",
    t:"Scrapers 10 boletines autonómicos (CCAA sin plataforma)",
    desc:"Aragón (BOA), C.Valenciana (DOGV), Castilla y León (BOCYL), C-La Mancha (DOCM), Extremadura (DOE), Murcia (BORM), Asturias (BOPA), Cantabria (BOC), Baleares (BOIB), Canarias (BOC).",
    why:"Estas 10 comunidades NO tienen plataforma propia. Sus licitaciones llegan a PLACE pero a veces con retraso. El boletín oficial es la primera publicación. Cubrirlos = detectar licitaciones antes que la competencia.",
    ac:["10 scrapers creados, uno por boletín","Cada uno parsea la sección de contratación del diario oficial","NLP básico para extraer campos de texto libre (título, órgano, importe, plazo)","Dedup con PLACE","Manejo de formatos diferentes: algunos HTML, otros PDF"],
    test:"Ejecutar → hay licitaciones con source='BOCA' (boletín autonómico). Verificar que no hay duplicados con PLACE. Verificar que campos están correctamente extraídos en al menos 90% de los casos." },
  { id:"1-09", ph:1, ly:"backend", sp:"S5-7", pr:"critical",
    t:"API Licitaciones: CRUD + búsqueda + filtros",
    desc:"GET /licitaciones (paginado, 20+ filtros), GET /licitaciones/:id, POST /licitaciones/:id/save, DELETE /licitaciones/:id/save. Full-text search con ts_vector PostgreSQL.",
    why:"Es el core de la app. El buscador es lo primero que usa el usuario. Los filtros deben ser potentes pero rápidos (<500ms). Sin una buena búsqueda, no hay producto.",
    ac:["GET /licitaciones devuelve paginado (page, limit, total)","Filtros funcionan: cpv, ccaa, provincia, importeMin, importeMax, tipoContrato, procedimiento, estado, source, fechaDesde, fechaHasta, query (full-text)","Filtros combinables (AND entre diferentes filtros)","Full-text search funciona con acentos, singulares/plurales","Respuesta < 500ms con 100K+ licitaciones en BD","GET /licitaciones/:id devuelve todos los campos + documentos + órgano embebido","Save/unsave funciona y persiste"],
    test:"Buscar 'limpieza madrid' → resultados relevantes en <500ms. Filtrar por CPV 90910000 + ccaa=Madrid + importe>50000 → resultados correctos. Guardar una → aparece en /licitaciones/saved." },
  { id:"1-10", ph:1, ly:"backend", sp:"S5-8", pr:"critical",
    t:"Motor de alertas: CRUD + matching + email + push",
    desc:"CRUD alertas, motor de matching (nueva licitación → evaluar vs alertas → matches), envío email (Resend) con template HTML responsive, push notifications (Firebase FCM).",
    why:"Las alertas son la feature #1 más valorada en TODAS las plataformas de la competencia. Es lo que hace que el usuario vuelva cada día. Sin alertas buenas, no hay retención.",
    ac:["CRUD alertas: crear con CPVs, keywords, exclusiones, ubicaciones, importes, tipos","Matching: cuando se ingiere nueva licitación, se evalúa contra todas las alertas activas","Score de matching: keyword exact > keyword partial > CPV match > location","Email diario: agrupa matches por alerta, template HTML con resumen IA de cada licitación, link directo","Push notification: título + presupuesto + días restantes","Configurable: frecuencia email (diario, 2x/día, semanal)","Métricas: matches/día, emails enviados/día"],
    test:"Crear alerta con CPV 72000000 (IT) en Madrid → inyectar licitación fake que coincide → AlertMatch creado en <1min → email recibido con la licitación → push en móvil." },

  // WEB — Fase 1
  { id:"1-11", ph:1, ly:"web", sp:"S2-3", pr:"critical",
    t:"Auth pages: login + registro + forgot password",
    desc:"Formularios con react-hook-form + zod. Botones OAuth (Google, Microsoft). Redirect post-login. Guardar tokens.",
    why:"Es la puerta de entrada de la app. Debe ser impecable: rápida, sin fricción, con error messages claros. OAuth reduce la barrera de registro al mínimo.",
    ac:["Formulario login: email + password + validación + error messages","Formulario registro: nombre + email + password + confirmación","Botones OAuth: Google y Microsoft","Forgot password: email input → envía link → reset form","Tokens guardados de forma segura (httpOnly cookie o secure localStorage)","Redirect a dashboard post-login","Loading states en botones durante requests"],
    test:"Registrar con email → redirect a onboarding. Login → redirect a dashboard. Login con Google → funciona. Forgot password → email llega → click → reset → login con nueva password." },
  { id:"1-12", ph:1, ly:"web", sp:"S4-6", pr:"critical",
    t:"Onboarding wizard (4 pasos)",
    desc:"Paso 1: ¿Sector? (NIF o búsqueda). Paso 2: ¿Dónde? (mapa CCAA). Paso 3: ¿Qué tipo de contratos? (tipo + importe). Paso 4: Confirmar CPVs → crear alertas auto.",
    why:"El onboarding es lo que nos diferencia de TODA la competencia. Nadie ofrece 'dime tu NIF y te configuro todo'. Es la diferencia entre 10% y 50% de activación.",
    ac:["4 pasos con progress bar","Paso 1: input NIF → auto-detecta empresa (CNAE, nombre, sector) o búsqueda libre","Paso 2: mapa visual de España, click en CCAA/provincias para seleccionar","Paso 3: checkboxes tipo contrato + slider rango importe","Paso 4: lista de CPVs sugeridos (basados en CNAE), editable, botón 'Crear mis alertas'","Skip posible en cada paso","Al finalizar: alertas creadas automáticamente + redirect a dashboard"],
    test:"Introducir NIF de empresa real → se autocompletan datos. Seleccionar Madrid + Barcelona en mapa. Elegir Servicios + 50K-500K. Confirmar CPVs → redirect a dashboard → alertas creadas visibles." },
  { id:"1-13", ph:1, ly:"web", sp:"S5-8", pr:"critical",
    t:"Buscador de licitaciones completo",
    desc:"Barra de búsqueda + panel de filtros lateral + lista de resultados con cards + paginación. Filtros: CPV (tree), ubicación, importe, tipo, procedimiento, estado, fuente, fechas.",
    why:"Es la pantalla donde el usuario pasa más tiempo. Debe ser rápida, intuitiva y potente. Los filtros deben permitir refinar sin recargar página (URL params para compartir búsquedas).",
    ac:["Search bar prominente en la parte superior","Panel filtros lateral colapsable con todos los filtros","CPV selector: tree view con búsqueda (escribir 'limpieza' → muestra CPVs relacionados)","Resultados: card con título, órgano, presupuesto formateado (€), fecha límite, estado badge color, CPV tags","Paginación: numbered (no infinite scroll en v1)","URL params: la URL refleja los filtros aplicados (compartible)","Ordenar por: relevancia, fecha publicación, importe, fecha límite","Contador: 'X licitaciones encontradas'","Loading skeleton mientras carga","Estado vacío: 'No hay licitaciones que coincidan con tu búsqueda'"],
    test:"Buscar 'desarrollo software' → resultados relevantes. Añadir filtro Madrid → se reduce. Añadir filtro >100K€ → se reduce más. Copiar URL → abrir en otra pestaña → mismos resultados. Ordenar por importe desc → el más caro primero." },

  // MOBILE — Fase 1
  { id:"1-14", ph:1, ly:"mobile", sp:"S7-9", pr:"critical",
    t:"Feed de licitaciones mobile con swipe",
    desc:"Lista vertical tipo feed. Card compacta. Pull-to-refresh. Filtros rápidos en top. Swipe right = guardar, left = descartar. Haptic feedback.",
    why:"La experiencia mobile debe ser distinta a la web: más rápida, más táctil, más decisiva. El swipe tipo Tinder es adictivo y reduce la fricción de clasificar licitaciones.",
    ac:["Feed carga las licitaciones que coinciden con alertas del usuario","Card: título (2 líneas max), presupuesto, días restantes, CPV badge, órgano","Pull-to-refresh funciona","Swipe right: guarda en 'Mis licitaciones' + haptic feedback","Swipe left: descarta (no vuelve a aparecer) + haptic feedback","Filtros rápidos: toggle por tipo contrato, picker CCAA","Tap en card: abre ficha de detalle","Infinite scroll con loading indicator"],
    test:"Abrir app → feed carga licitaciones → swipe right → sale de la lista + aparece en 'Guardadas' → swipe left → desaparece → pull down → se refresca → las descartadas no vuelven." },

  // IA — Fase 1
  { id:"1-15", ph:1, ly:"ia", sp:"S2-6", pr:"critical",
    t:"Pipeline ingesta PDFs de pliegos + embeddings + Qdrant",
    desc:"Descargar PDFs → extraer texto (pdfplumber/PyMuPDF) → OCR fallback (Tesseract) → chunking inteligente (512 tokens) → embeddings (OpenAI) → almacenar en Qdrant.",
    why:"Sin poder leer pliegos, la IA no puede hacer nada útil. Es la base sobre la que se construye todo: resúmenes, chat, extracción de requisitos, generación de ofertas.",
    ac:["Descarga PDFs desde URLs de documentos de licitaciones","Extrae texto de PDFs normales con pdfplumber","Detecta PDFs escaneados y aplica OCR con Tesseract","Chunking: respeta párrafos/secciones, ~512 tokens con overlap 64","Embeddings generados correctamente (verificar dimensión del vector)","Chunks almacenados en Qdrant con metadata: licitacion_id, page_num, section_type","Búsqueda semántica funciona: query → top-K chunks relevantes","Manejo de errores: PDFs corruptos no crashean el pipeline"],
    test:"Dar 10 PDFs de pliegos reales → pipeline procesa → Qdrant tiene chunks → buscar 'requisitos de solvencia' → devuelve chunks del pliego que hablan de solvencia." },
  { id:"1-16", ph:1, ly:"ia", sp:"S7-10", pr:"critical",
    t:"Endpoints: resumen IA + chat con pliego (RAG)",
    desc:"POST /ia/resumir → 3 frases clave. POST /ia/chat → RAG (retrieve chunks + LLM genera respuesta citando fuentes).",
    why:"El resumen automático es lo que diferencia nuestras alertas de las de la competencia (ellos mandan solo el título). El chat con pliegos ahorra horas de lectura de documentos de 100+ páginas.",
    ac:["Resumen: genera 3 frases que capturan: qué se licita, presupuesto/plazo, requisitos principales","Resumen se cachea (no regenerar cada vez)","Chat: pregunta + historial → respuesta con citas (página del pliego)","Streaming response (no esperar a que termine todo para empezar a mostrar)","Citas correctas: 'Según el pliego (pág. 23)...'","Historial de conversación: las preguntas siguientes tienen contexto de las anteriores","Latencia aceptable: resumen <10s, chat response start <3s"],
    test:"Resumir un pliego real → las 3 frases tienen sentido y cubren lo esencial. Chat: preguntar '¿Cuáles son los criterios de adjudicación?' → respuesta correcta con cita a la página del pliego donde aparecen." },

  // FASE 2 — Selección representativa
  { id:"2-01", ph:2, ly:"backend", sp:"S11-14", pr:"critical",
    t:"Integrar BDNS API + PRTR (subvenciones)",
    desc:"Consumir API oficial BDNS: convocatorias + concesiones. Scraper PRTR (NextGenerationEU). Modelo unificado de subvención.",
    why:"Nadie en el mercado integra licitaciones + subvenciones en una sola plataforma. Es el diferencial #1 para pymes que buscan cualquier tipo de financiación pública.",
    ac:["API BDNS conectada y devolviendo convocatorias","Parser normaliza a modelo Subvencion (título, organismo, importe, plazo, beneficiarios, sector, ámbito)","PRTR scraper extrae convocatorias de fondos europeos","Ambas fuentes alimentan alertas (si usuario activa 'incluir subvenciones')","Scheduler: sync diaria","Búsqueda de subvenciones con filtros: sector, ámbito geográfico, importe, organismo"],
    test:"GET /subvenciones → devuelve subvenciones reales de BDNS. Filtrar por sector='tecnología' + ccaa='Madrid' → resultados coherentes. Crear alerta con includeSubvenciones=true → match cuando hay nueva subvención." },
  { id:"2-02", ph:2, ly:"backend", sp:"S13-15", pr:"critical",
    t:"Stripe Subscriptions: planes + pagos",
    desc:"Planes: Free (0€), Pro (49€/mes), Business (99€/mes), Enterprise (199€/mes). Stripe Checkout. Webhooks. Feature gates middleware.",
    why:"Sin pagos no hay negocio. Stripe es el estándar para SaaS. Los feature gates aseguran que cada plan solo accede a las funciones que le corresponden.",
    ac:["4 productos creados en Stripe Dashboard","POST /billing/checkout-session crea sesión de Stripe Checkout","Webhook payment_succeeded actualiza plan de la organización en BD","Webhook subscription_deleted revierte a plan Free","Middleware checkPlan('PRO') bloquea acceso a features premium en plan Free","Portal de billing: ver plan actual, cambiar plan, ver facturas, cancelar","Prueba gratuita de 14 días para Pro"],
    test:"Registrar → plan Free → intentar acceder a analytics → bloqueado. Suscribir Pro (tarjeta test de Stripe) → analytics accesible. Cancelar → al final del periodo vuelve a Free." },
  { id:"2-03", ph:2, ly:"web", sp:"S11-14", pr:"critical",
    t:"Kanban board interactivo",
    desc:"Drag & drop con @dnd-kit. Columnas configurables. Cards con datos de licitación. Filtros por responsable, CPV, fecha.",
    why:"La gestión de licitaciones en proceso es caótica sin una herramienta visual. El Kanban permite que todo el equipo de una empresa vea el estado de cada oferta en preparación.",
    ac:["Board con columnas default: Nueva, Analizando, Preparando Oferta, Presentada, Adjudicada, Descartada","Drag & drop entre columnas funciona (desktop y touch)","Card muestra: título, presupuesto, días restantes, avatar del responsable","Click en card abre detalle: notas, comentarios, historial de movimientos, link a licitación","Añadir licitación al board desde la ficha de licitación","Filtrar por responsable (dropdown de miembros equipo)","Columnas reordenables y renombrables"],
    test:"Guardar licitación → añadir al board → drag de 'Nueva' a 'Analizando' → soltar → card se mueve → historial muestra 'Movido de Nueva a Analizando por [user] hace 5s'. Asignar responsable → filtrar por ese responsable → solo sus cards visibles." },

  // FASE 3
  { id:"3-01", ph:3, ly:"ia", sp:"S23-30", pr:"critical",
    t:"Generador de memoria técnica con IA",
    desc:"Input: pliego (chunks relevantes) + perfil empresa (experiencia, equipo, metodología del vault). Output: borrador memoria técnica adaptada a criterios de adjudicación del pliego.",
    why:"Esta es LA killer feature que nadie tiene. Generar un borrador de memoria técnica en minutos en lugar de días cambia completamente el juego. Es lo que convertirá usuarios gratuitos en usuarios de pago.",
    ac:["Detecta automáticamente secciones requeridas del pliego (metodología, equipo, experiencia, planning, mejoras)","Genera borrador adaptado a cada sección con datos reales de la empresa (del vault)","Incluye experiencia relevante de contratos previos similares","Genera planning de ejecución coherente con plazo del contrato","Sugiere mejoras basadas en criterios de adjudicación ponderados","Output: markdown estructurado exportable a DOCX","Calidad: el borrador es un 70%+ utilizable (necesita revisión humana pero no reescritura)","Latencia: <60s para generar borrador completo"],
    test:"Elegir pliego real de licitación de servicios IT → cargar perfil de empresa tech → generar → borrador tiene secciones coherentes, cita experiencia real de la empresa, planning tiene sentido temporal, mejoras alineadas con criterios. Un experto en licitaciones lee el borrador y dice 'con revisión, esto es presentable'." },

  { id:"3-02", ph:3, ly:"web", sp:"S28-36", pr:"critical",
    t:"Generador de ofertas: wizard + editor con IA",
    desc:"Wizard: seleccionar licitación → tipo documento → IA genera borrador → editor rich-text con requisitos como checklist lateral → exportar DOCX/PDF.",
    why:"Es la feature que convierte la app de 'busco licitaciones' a 'preparo y presento ofertas'. Cierra el ciclo completo. Nadie más ofrece esto.",
    ac:["Wizard 5 pasos: seleccionar licitación → tipo (memoria/económica/DEUC) → confirmar datos empresa → loading con progress → editor","Editor rich-text (TipTap): editable, formateado, guardar borrador","Sidebar: requisitos del pliego como checklist, se tachan cuando están cubiertos en el texto","Sugerencias IA inline: 'Completar este párrafo' → genera continuación","Autoguardado cada 30 segundos","Exportar a DOCX (formato profesional con headers, numeración, logo empresa)","Exportar a PDF","Historial de versiones (ver borradores anteriores)"],
    test:"Seleccionar licitación real → generar memoria técnica → editor carga con borrador → editar un párrafo → se autoguarda → sidebar checklist se actualiza → exportar DOCX → abrir en Word → formato profesional con secciones numeradas." },

  // FASE 4
  { id:"4-01", ph:4, ly:"backend", sp:"S41-48", pr:"critical",
    t:"Internacionalización: i18n + Portugal + scrapers",
    desc:"Multi-idioma (ES/PT/EN) en API, emails, UI. Scraper BASE.gov.pt (contratos Portugal). Modelos IA adaptados a portugués.",
    why:"Portugal es el mercado natural de expansión: mismo huso horario, mercado más pequeño (menos competencia), y el portugués es cercano al español para los modelos de IA.",
    ac:["API devuelve contenido traducido según header Accept-Language","Emails en idioma del usuario","Scraper Portugal funciona y alimenta BD","Resúmenes IA en portugués para licitaciones portuguesas","Web: language switcher funciona, todas las páginas traducidas","Mobile: detecta idioma del dispositivo"],
    test:"Cambiar idioma a PT → toda la UI en portugués. Buscar licitaciones en Portugal → aparecen. Resumen IA de licitación portuguesa → en portugués correcto." },
  { id:"4-02", ph:4, ly:"backend", sp:"S48-53", pr:"important",
    t:"Marketplace de expertos en licitaciones",
    desc:"Perfiles de consultores con especialidades, tarifas, reviews. Booking empresa↔experto. Pagos con Stripe Connect. Chat integrado.",
    why:"Muchas pymes necesitan ayuda profesional pero no saben dónde encontrarla. El marketplace genera un revenue stream adicional (comisión) y aumenta el valor de la plataforma.",
    ac:["Registro como experto: perfil, especialidades (CPVs), tarifas, bio, experiencia","Búsqueda de expertos: por especialidad, ubicación, valoración","Solicitar asesoría: formulario con descripción + licitación asociada","Booking: experto acepta/rechaza solicitud","Pagos: Stripe Connect, empresa paga, plataforma retiene comisión (15-20%)","Reviews: después de la asesoría, empresa valora al experto","Chat: mensajes entre empresa y experto (dentro de la plataforma)"],
    test:"Registrar como experto → publicar perfil → buscar como empresa → encontrar experto → solicitar asesoría → experto acepta → pago procesado → chat disponible → asesoría completada → review publicada." },
];

const PHASES = [
  { id:0, nm:"Día Cero", sub:"Setup del proyecto completo", dur:"Semana 0", c:"#64748B", ms:"Repos + CI/CD + todos pueden hacer npm install", ic:"🏗️" },
  { id:1, nm:"Cimientos", sub:"MVP: scraping + buscador + alertas + IA básica", dur:"Semanas 1–10", c:"#EF4444", ms:"Beta privada — 50 testers", ic:"🚀" },
  { id:2, nm:"Diferenciación", sub:"Subvenciones + Kanban + Score IA + Stripe + Stores", dur:"Semanas 11–22", c:"#F59E0B", ms:"Lanzamiento público — 2K usuarios", ic:"⚡" },
  { id:3, nm:"Killer Features", sub:"Generador ofertas IA + Predicción + BI", dur:"Semanas 23–40", c:"#8B5CF6", ms:"1.000 de pago — 75K€ MRR", ic:"🏆" },
  { id:4, nm:"Escala", sub:"Internacional + Marketplace + Enterprise", dur:"Semanas 41–56+", c:"#06B6D4", ms:"3.000 pago — 250K€ MRR", ic:"👑" },
];

const LY = {
  infra:{ l:"Infra / DevOps", c:"#64748B", i:"🔧" },
  backend:{ l:"Backend", c:"#3B82F6", i:"⚙️" },
  web:{ l:"Web App", c:"#10B981", i:"🌐" },
  mobile:{ l:"Mobile", c:"#F59E0B", i:"📱" },
  ia:{ l:"Servicio IA", c:"#8B5CF6", i:"🧠" },
};
const PR = {
  critical:{ l:"Crítico", c:"#EF4444", d:"🔴" },
  important:{ l:"Importante", c:"#F59E0B", d:"🟡" },
  nice:{ l:"Nice-to-have", c:"#22C55E", d:"🟢" },
};

export default function App() {
  const [ck, setCk] = useState({});
  const [ph, setPh] = useState(0);
  const [lyF, setLyF] = useState(null);
  const [prF, setPrF] = useState(null);
  const [q, setQ] = useState("");
  const [col, setCol] = useState({});
  const [sel, setSel] = useState(null); // selected task for detail panel

  const toggle = useCallback((id, e) => {
    e.stopPropagation();
    setCk(p => ({ ...p, [id]: !p[id] }));
  }, []);

  const tasks = T.filter(t => {
    if (t.ph !== ph) return false;
    if (lyF && t.ly !== lyF) return false;
    if (prF && t.pr !== prF) return false;
    if (q && !t.t.toLowerCase().includes(q.toLowerCase()) && !t.desc.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const pAll = T.filter(t => t.ph === ph);
  const pDone = pAll.filter(t => ck[t.id]).length;
  const pTot = pAll.length;
  const pPct = pTot ? Math.round((pDone/pTot)*100) : 0;
  const gDone = T.filter(t => ck[t.id]).length;
  const gTot = T.length;
  const gPct = gTot ? Math.round((gDone/gTot)*100) : 0;

  const byLy = {};
  tasks.forEach(t => { if (!byLy[t.ly]) byLy[t.ly] = []; byLy[t.ly].push(t); });
  const p = PHASES[ph];

  const selectedTask = sel ? T.find(t => t.id === sel) : null;

  return (
    <div style={{ display:"flex", height:"100vh", background:"#08090d", color:"#e2e8f0", fontFamily:"system-ui,-apple-system,sans-serif", fontSize:14 }}>

      {/* MAIN PANEL */}
      <div style={{ flex:1, overflow:"auto", minWidth:0 }}>
        {/* Header */}
        <div style={{ padding:"16px 20px 0", borderBottom:"1px solid #1a1d2a" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:20 }}>📋</span>
              <div>
                <div style={{ fontSize:16, fontWeight:800 }}>Roadmap Checklist</div>
                <div style={{ fontSize:10, color:"#64748B" }}>{gTot} tareas · {gDone} completadas · {gPct}% global</div>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:80, height:6, background:"#1a1d2a", borderRadius:3 }}>
                <div style={{ width:gPct+"%", height:"100%", background:"#3B82F6", borderRadius:3, transition:"width 0.3s" }} />
              </div>
              <span style={{ fontSize:12, fontWeight:700, color:"#3B82F6" }}>{gPct}%</span>
            </div>
          </div>
          {/* Phase tabs */}
          <div style={{ display:"flex", gap:2, marginTop:12, overflowX:"auto" }}>
            {PHASES.map((pp, i) => {
              const pd = T.filter(t => t.ph === i && ck[t.id]).length;
              const pt = T.filter(t => t.ph === i).length;
              const pc = pt ? Math.round((pd/pt)*100) : 0;
              return (
                <button key={pp.id} onClick={() => { setPh(i); setCol({}); setSel(null); }} style={{
                  padding:"6px 12px", borderRadius:"6px 6px 0 0",
                  border: ph===i ? `1px solid ${pp.c}44` : "1px solid transparent", borderBottom:"none",
                  background: ph===i ? pp.c+"12" : "transparent",
                  color: ph===i ? pp.c : "#64748B",
                  fontSize:11, fontWeight: ph===i ? 700 : 500, cursor:"pointer", whiteSpace:"nowrap",
                  display:"flex", alignItems:"center", gap:4,
                }}>{pp.ic} F{pp.id} <span style={{ fontSize:9, opacity:0.7 }}>{pc}%</span>{pc===100 && " ✅"}</button>
              );
            })}
          </div>
        </div>

        {/* Phase bar */}
        <div style={{ padding:"12px 20px", background:"#0b0d12", borderBottom:"1px solid #1a1d2a" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
            <div>
              <div style={{ fontSize:16, fontWeight:800, color:p.c }}>{p.ic} Fase {p.id}: {p.nm}</div>
              <div style={{ fontSize:11, color:"#64748B" }}>{p.sub} · <span style={{ color:p.c }}>{p.dur}</span></div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:100, height:6, background:"#1a1d2a", borderRadius:3 }}>
                <div style={{ width:pPct+"%", height:"100%", background:p.c, borderRadius:3, transition:"width 0.3s" }} />
              </div>
              <span style={{ fontSize:12, fontWeight:700, color:p.c }}>{pDone}/{pTot}</span>
            </div>
          </div>
          <div style={{ marginTop:6, background:p.c+"10", border:`1px solid ${p.c}33`, borderRadius:4, padding:"4px 10px", fontSize:11, color:"#94A3B8" }}>
            🏁 <strong style={{ color:p.c }}>Milestone:</strong> {p.ms}
          </div>
        </div>

        {/* Filters */}
        <div style={{ padding:"8px 20px", display:"flex", gap:4, flexWrap:"wrap", borderBottom:"1px solid #1a1d2a" }}>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="🔍 Buscar..." style={{
            background:"#0e1017", border:"1px solid #1a1d2a", borderRadius:4, padding:"3px 8px",
            color:"#e2e8f0", fontSize:11, width:160, outline:"none",
          }} />
          {Object.entries(LY).map(([k, v]) => (
            <button key={k} onClick={() => setLyF(lyF===k ? null : k)} style={{
              padding:"2px 8px", borderRadius:4, fontSize:10, cursor:"pointer",
              border:`1px solid ${lyF===k ? v.c+"66" : "#1a1d2a"}`,
              background: lyF===k ? v.c+"15" : "transparent",
              color: lyF===k ? v.c : "#64748B",
            }}>{v.i} {v.l}</button>
          ))}
          <span style={{ width:1, height:16, background:"#1a1d2a", margin:"0 2px", alignSelf:"center" }} />
          {Object.entries(PR).map(([k, v]) => (
            <button key={k} onClick={() => setPrF(prF===k ? null : k)} style={{
              padding:"2px 8px", borderRadius:4, fontSize:10, cursor:"pointer",
              border:`1px solid ${prF===k ? v.c+"66" : "#1a1d2a"}`,
              background: prF===k ? v.c+"10" : "transparent",
              color: prF===k ? v.c : "#64748B",
            }}>{v.d} {v.l}</button>
          ))}
        </div>

        {/* Tasks */}
        <div style={{ padding:"4px 20px 40px" }}>
          {Object.entries(byLy).map(([lk, lt]) => {
            const ly = LY[lk];
            const ld = lt.filter(t => ck[t.id]).length;
            const isC = col[lk];
            return (
              <div key={lk} style={{ marginTop:8, background:"#0e1017", border:`1px solid ${ly.c}22`, borderRadius:8, overflow:"hidden" }}>
                <div onClick={() => setCol(p => ({...p, [lk]: !p[lk]}))} style={{
                  padding:"8px 14px", display:"flex", alignItems:"center", justifyContent:"space-between",
                  cursor:"pointer", background:ly.c+"08",
                }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <span style={{ fontSize:14 }}>{ly.i}</span>
                    <span style={{ fontSize:13, fontWeight:700, color:ly.c }}>{ly.l}</span>
                    <span style={{ fontSize:10, color:"#64748B" }}>{ld}/{lt.length}</span>
                  </div>
                  <span style={{ color:"#475569", fontSize:10, transform: isC ? "rotate(-90deg)" : "none", transition:"transform 0.2s" }}>▾</span>
                </div>
                {!isC && <div style={{ padding:"2px 6px 6px" }}>
                  {lt.map(task => {
                    const pr = PR[task.pr];
                    const done = ck[task.id];
                    const isSel = sel === task.id;
                    return (
                      <div key={task.id}
                        onClick={() => setSel(isSel ? null : task.id)}
                        style={{
                          display:"flex", alignItems:"flex-start", gap:8, padding:"6px 8px",
                          borderRadius:4, margin:"1px 0", cursor:"pointer",
                          background: isSel ? "#151a26" : done ? "rgba(34,197,94,0.03)" : "transparent",
                          borderLeft: isSel ? `2px solid ${ly.c}` : "2px solid transparent",
                          opacity: done ? 0.5 : 1,
                        }}
                      >
                        <div onClick={(e) => toggle(task.id, e)} style={{
                          width:16, height:16, borderRadius:3, flexShrink:0, marginTop:1,
                          border: done ? "2px solid #22C55E" : "2px solid #2a2f40",
                          background: done ? "#22C55E" : "transparent",
                          display:"flex", alignItems:"center", justifyContent:"center",
                          fontSize:9, color:"#fff",
                        }}>{done ? "✓" : ""}</div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{
                            fontSize:12, fontWeight:600, lineHeight:1.4,
                            color: done ? "#4a5568" : "#CBD5E1",
                            textDecoration: done ? "line-through" : "none",
                          }}>{pr.d} {task.t}</div>
                          <div style={{ fontSize:10, color:"#3d4255", lineHeight:1.4, marginTop:1 }}>{task.desc}</div>
                        </div>
                        <span style={{ fontFamily:"monospace", fontSize:9, color:"#2a2f40", background:"#080a0f", padding:"1px 5px", borderRadius:2, whiteSpace:"nowrap", flexShrink:0 }}>{task.sp}</span>
                      </div>
                    );
                  })}
                </div>}
              </div>
            );
          })}
          {Object.keys(byLy).length === 0 && <div style={{ textAlign:"center", padding:32, color:"#2a2f40", fontSize:12 }}>Sin tareas para estos filtros</div>}
        </div>
      </div>

      {/* DETAIL PANEL */}
      {selectedTask && (
        <div style={{
          width:380, minWidth:380, borderLeft:"1px solid #1a1d2a", overflow:"auto",
          background:"#0b0d12",
        }}>
          <div style={{ padding:"16px 18px", borderBottom:"1px solid #1a1d2a" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <span style={{ fontSize:9, fontFamily:"monospace", color:"#3d4255", background:"#08090d", padding:"1px 6px", borderRadius:2 }}>{selectedTask.id} · {selectedTask.sp}</span>
              <button onClick={() => setSel(null)} style={{ background:"none", border:"none", color:"#64748B", cursor:"pointer", fontSize:16 }}>✕</button>
            </div>
            <div style={{ marginTop:8 }}>
              <span style={{ fontSize:10, padding:"2px 6px", borderRadius:3, background:LY[selectedTask.ly].c+"18", color:LY[selectedTask.ly].c, fontWeight:600 }}>{LY[selectedTask.ly].i} {LY[selectedTask.ly].l}</span>
              <span style={{ fontSize:10, padding:"2px 6px", borderRadius:3, background:PR[selectedTask.pr].c+"15", color:PR[selectedTask.pr].c, fontWeight:600, marginLeft:4 }}>{PR[selectedTask.pr].d} {PR[selectedTask.pr].l}</span>
            </div>
            <h3 style={{ fontSize:15, fontWeight:700, marginTop:10, lineHeight:1.4 }}>{selectedTask.t}</h3>
          </div>

          {/* What */}
          <div style={{ padding:"14px 18px", borderBottom:"1px solid #141720" }}>
            <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:1.5, color:"#64748B", marginBottom:6 }}>📝 Qué hacer</div>
            <div style={{ fontSize:12, color:"#94A3B8", lineHeight:1.7 }}>{selectedTask.desc}</div>
          </div>

          {/* Why */}
          {selectedTask.why && (
            <div style={{ padding:"14px 18px", borderBottom:"1px solid #141720" }}>
              <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:1.5, color:"#F59E0B", marginBottom:6 }}>💡 Por qué es importante</div>
              <div style={{ fontSize:12, color:"#94A3B8", lineHeight:1.7 }}>{selectedTask.why}</div>
            </div>
          )}

          {/* Acceptance Criteria */}
          {selectedTask.ac && (
            <div style={{ padding:"14px 18px", borderBottom:"1px solid #141720" }}>
              <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:1.5, color:"#22C55E", marginBottom:8 }}>✅ Criterios de aceptación (Definition of Done)</div>
              {selectedTask.ac.map((a, i) => (
                <div key={i} style={{ display:"flex", gap:6, padding:"3px 0", fontSize:12, color:"#94A3B8", lineHeight:1.5 }}>
                  <span style={{ color:"#22C55E", flexShrink:0 }}>•</span>
                  <span>{a}</span>
                </div>
              ))}
            </div>
          )}

          {/* How to Test */}
          {selectedTask.test && (
            <div style={{ padding:"14px 18px" }}>
              <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:1.5, color:"#3B82F6", marginBottom:6 }}>🧪 Cómo testear (sin QA)</div>
              <div style={{
                fontSize:12, color:"#94A3B8", lineHeight:1.7,
                background:"#080a0f", border:"1px solid #141720", borderRadius:6, padding:"10px 12px",
              }}>{selectedTask.test}</div>
            </div>
          )}

          {/* Complete button */}
          <div style={{ padding:"14px 18px" }}>
            <button
              onClick={(e) => toggle(selectedTask.id, e)}
              style={{
                width:"100%", padding:"10px", borderRadius:6, cursor:"pointer",
                fontSize:13, fontWeight:700, border:"none",
                background: ck[selectedTask.id] ? "#1a1d2a" : "#22C55E",
                color: ck[selectedTask.id] ? "#64748B" : "#fff",
              }}
            >{ck[selectedTask.id] ? "↩ Desmarcar como completada" : "✓ Marcar como completada"}</button>
          </div>
        </div>
      )}
    </div>
  );
}