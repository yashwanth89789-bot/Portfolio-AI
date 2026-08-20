import { RoleInfo, SamplePortfolio } from '../types';

export const POWER_VERBS = [
  'architected', 'spearheaded', 'orchestrated', 'engineered', 'streamlined',
  'accelerated', 'optimized', 'scaled', 'implemented', 'overhauled',
  'pioneered', 'automated', 'deployed', 'refactored', 'consolidated',
  'decreased', 'boosted', 'generated', 'transformed', 'delivered',
  'conceptualized', 'maximized', 'eliminated', 'standardized', 'built',
  'formulated', 'modernized', 'revolutionized', 'instituted', 'championed',
  'benchmarked', 'provisioned', 'reduced', 'increased', 'authored'
];

export const WEAK_VERBS = [
  'helped with', 'worked on', 'assisted in', 'assisted with', 'was responsible for',
  'responsible for', 'handled', 'tried to', 'did', 'participated in', 'contributed to',
  'supported', 'involved in', 'tasked with', 'attempted', 'duties included',
  'helped team', 'was assigned to', 'acted as', 'served as', 'worked with'
];

export interface PassivePhraseRule {
  phrase: string;
  category: 'passive' | 'weak';
  feedback: string;
  replacements: string[];
}

export const PASSIVE_PHRASE_RULES: PassivePhraseRule[] = [
  {
    phrase: 'was responsible for',
    category: 'passive',
    feedback: 'Passive phrase hiding ownership. State direct leadership action.',
    replacements: ['Spearheaded', 'Architected', 'Orchestrated', 'Owned']
  },
  {
    phrase: 'responsible for',
    category: 'passive',
    feedback: 'Job description language. Replace with active execution verb.',
    replacements: ['Spearheaded', 'Engineered', 'Delivered', 'Led']
  },
  {
    phrase: 'were responsible for',
    category: 'passive',
    feedback: 'Passive collective phrasing.',
    replacements: ['Orchestrated', 'Co-engineered', 'Spearheaded']
  },
  {
    phrase: 'helped with',
    category: 'weak',
    feedback: 'Diminishes your direct contribution. Use an active collaborative verb.',
    replacements: ['Accelerated', 'Facilitated', 'Co-authored', 'Streamlined']
  },
  {
    phrase: 'helped to',
    category: 'weak',
    feedback: 'Weak auxiliary phrasing.',
    replacements: ['Accelerated', 'Optimized', 'Engineered']
  },
  {
    phrase: 'helped team',
    category: 'weak',
    feedback: 'Vague impact on team.',
    replacements: ['Enabled engineering team to', 'Unblocked cross-functional squad', 'Empowered team with']
  },
  {
    phrase: 'worked on',
    category: 'weak',
    feedback: 'Vague activity indicator without ownership or outcome.',
    replacements: ['Engineered', 'Architected', 'Implemented', 'Refactored']
  },
  {
    phrase: 'worked with',
    category: 'weak',
    feedback: 'Passive participation.',
    replacements: ['Partnered with', 'Collaborated cross-functionally with', 'Aligned with']
  },
  {
    phrase: 'assisted in',
    category: 'weak',
    feedback: 'Sounds like a passive bystander.',
    replacements: ['Co-developed', 'Accelerated', 'Executed']
  },
  {
    phrase: 'assisted with',
    category: 'weak',
    feedback: 'Minimizes individual technical scope.',
    replacements: ['Engineered supporting modules for', 'Streamlined', 'Delivered']
  },
  {
    phrase: 'participated in',
    category: 'weak',
    feedback: 'Passive attendance instead of proactive contribution.',
    replacements: ['Contributed to architecture of', 'Co-designed', 'Facilitated']
  },
  {
    phrase: 'tasked with',
    category: 'passive',
    feedback: 'Makes you sound like a passive task-taker instead of an owner.',
    replacements: ['Pioneered', 'Spearheaded', 'Took ownership of']
  },
  {
    phrase: 'involved in',
    category: 'weak',
    feedback: 'Ambiguous contribution.',
    replacements: ['Engineered key components for', 'Drove', 'Delivered']
  },
  {
    phrase: 'duties included',
    category: 'passive',
    feedback: 'Reads like a copy-pasted HR job description.',
    replacements: ['Owned and scaled', 'Orchestrated', 'Maintained and deployed']
  },
  {
    phrase: 'handled',
    category: 'weak',
    feedback: 'Reactive phrasing. Use proactive technical or managerial verbs.',
    replacements: ['Resolved', 'Orchestrated', 'Triaged and eliminated', 'Managed']
  },
  {
    phrase: 'tried to',
    category: 'weak',
    feedback: 'Expresses effort without verified achievement.',
    replacements: ['Piloted', 'Successfully implemented', 'Prototyped']
  }
];

export const ROLES_DATA: Record<string, RoleInfo> = {
  'frontend': {
    id: 'frontend',
    title: 'Frontend Engineer',
    category: 'Engineering',
    icon: 'Layout',
    description: 'Specializes in user interfaces, client state, web vitals performance, accessibility, and modern component systems.',
    primaryKeywords: [
      'React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'State Management',
      'Web Vitals', 'Responsive Design', 'Accessibility', 'WCAG', 'REST API',
      'GraphQL', 'CI/CD', 'Jest', 'Cypress', 'Component Library'
    ],
    secondaryKeywords: [
      'Micro-frontends', 'Server-Side Rendering', 'Static Site Generation',
      'Webpack', 'Vite', 'Turborepo', 'Design Systems', 'Storybook',
      'Zustand', 'Redux Toolkit', 'TanStack Query', 'CSS Modules', 'WebSockets'
    ],
    toolsAndFrameworks: [
      'React', 'Next.js', 'Vue.js', 'Svelte', 'TypeScript', 'Vite', 'Tailwind CSS',
      'Figma', 'Jest', 'Playwright', 'Git', 'Vercel'
    ],
    metricsToHighlight: [
      'Lighthouse performance score improvement (e.g. 62 -> 98)',
      'Bundle size reduction (e.g. 42% smaller)',
      'First Contentful Paint (FCP) & Largest Contentful Paint (LCP) reduction',
      'User engagement & conversion rate increase'
    ],
    commonMistakes: [
      'Focusing purely on visual layout without mentioning web performance or accessibility.',
      'No live deployed URLs or dead GitHub repo links.',
      'Omitting state management architecture and testing suites.'
    ],
    resumeEssentials: [
      'Quantify performance lifts (e.g. "Reduced bundle size by 35%, boosting Core Web Vitals to 96+").',
      'Highlight design system creation and cross-browser resilience.',
      'Demonstrate deep TypeScript type-safety and automated testing (Jest, Playwright).'
    ],
    portfolioMustHaves: [
      'Live interactive preview demos with responsive viewports.',
      'Accessible UI with clean keyboard navigation & screen-reader tags.',
      'Architecture breakdown diagram for complex state or data streaming.'
    ]
  },
  'fullstack': {
    id: 'fullstack',
    title: 'Full Stack / Backend Engineer',
    category: 'Engineering',
    icon: 'Server',
    description: 'Architects end-to-end applications, scalable distributed backends, REST/GraphQL APIs, database persistence, and cloud infrastructure.',
    primaryKeywords: [
      'Node.js', 'PostgreSQL', 'TypeScript', 'Docker', 'RESTful APIs',
      'GraphQL', 'Redis', 'AWS', 'Microservices', 'Database Schema',
      'Authentication', 'CI/CD', 'Unit Testing', 'System Architecture'
    ],
    secondaryKeywords: [
      'Kubernetes', 'Prisma', 'Drizzle ORM', 'Kafka', 'RabbitMQ', 'gRPC',
      'Serverless', 'PostgreSQL Indexing', 'OAuth2', 'JWT', 'Terraform',
      'Elasticsearch', 'Load Balancing', 'Query Optimization'
    ],
    toolsAndFrameworks: [
      'Node.js', 'Express', 'NestJS', 'Go', 'Python', 'PostgreSQL', 'MongoDB',
      'Redis', 'Docker', 'AWS', 'GitHub Actions'
    ],
    metricsToHighlight: [
      'API latency p99 reduction (e.g. 450ms -> 45ms)',
      'Database query throughput increase (e.g. 10k QPS)',
      'Infrastructure cloud bill reduction (%)',
      'System uptime guarantee (99.99%)'
    ],
    commonMistakes: [
      'Only listing simple CRUD apps without explaining concurrency, indexing, or scaling.',
      'Missing architectural system diagrams.',
      'Vague descriptions without API response times or database performance metrics.'
    ],
    resumeEssentials: [
      'Emphasize database schema design, index optimization, and transaction safety.',
      'Detail high-throughput endpoints, distributed caches (Redis), and event queues.',
      'Specify infrastructure deployment (Docker, Kubernetes, AWS/GCP pipelines).'
    ],
    portfolioMustHaves: [
      'System architecture diagrams and ERDs (Entity Relationship Diagrams).',
      'Interactive Swagger / Postman API documentation links.',
      'Load testing and stress benchmark results (k6 or Artillery).'
    ]
  },
  'ai-ml': {
    id: 'ai-ml',
    title: 'AI / Machine Learning Engineer',
    category: 'Data & AI',
    icon: 'BrainCircuit',
    description: 'Builds predictive models, LLM pipelines, RAG systems, model evaluation benchmarks, fine-tuning workflows, and production ML pipelines.',
    primaryKeywords: [
      'Python', 'PyTorch', 'TensorFlow', 'LLMs', 'RAG', 'Vector Database',
      'LangChain', 'LlamaIndex', 'Fine-tuning', 'Prompt Engineering',
      'Model Evaluation', 'Embeddings', 'Hugging Face', 'Data Pipeline', 'MLOps'
    ],
    secondaryKeywords: [
      'Pinecone', 'ChromaDB', 'Qdrant', 'LoRA', 'QLoRA', 'vLLM', 'Ollama',
      'Triton', 'MLflow', 'Weights & Biases', 'Quantization', 'NLP',
      'Computer Vision', 'CUDA', 'Pandas', 'NumPy', 'Scikit-Learn'
    ],
    toolsAndFrameworks: [
      'Python', 'PyTorch', 'HuggingFace', 'LangChain', 'FastAPI', 'Docker',
      'ChromaDB', 'MLflow', 'Jupyter', 'Weights & Biases'
    ],
    metricsToHighlight: [
      'Model accuracy / F1 score / BLEU / ROUGE improvements',
      'Inference latency reduction (e.g. TTFT reduced by 60%)',
      'Retrieval Precision@K and Recall in RAG pipelines',
      'Cost reduction via model quantization or batching'
    ],
    commonMistakes: [
      'Only showing standard toy datasets (e.g. Titanic or MNIST).',
      'Lacking real-world deployment or API wrapper demos.',
      'Omitting evaluation metrics and hallucination mitigation techniques.'
    ],
    resumeEssentials: [
      'Highlight end-to-end ML lifecycles from dataset curation to production serving.',
      'Detail retrieval augmented generation (RAG) architecture and semantic search.',
      'Quantify inference throughput, token latency, and model accuracy gains.'
    ],
    portfolioMustHaves: [
      'Interactive live demos (Streamlit, Gradio, or Next.js web interface).',
      'Well-structured GitHub repository with benchmark evaluation tables.',
      'Dataset sources, methodology writeup, and error analysis.'
    ]
  },
  'ui-ux': {
    id: 'ui-ux',
    title: 'UI/UX & Product Designer',
    category: 'Design',
    icon: 'Figma',
    description: 'Designs intuitive product experiences, conducts user research, builds design systems, and transforms complex user journeys into elegant visual flows.',
    primaryKeywords: [
      'Figma', 'User Research', 'Design System', 'Prototyping', 'Wireframing',
      'Usability Testing', 'Information Architecture', 'User Journey Mapping',
      'Interaction Design', 'Accessibility', 'Mobile First', 'Design Tokens'
    ],
    secondaryKeywords: [
      'Micro-interactions', 'Design Sprint', 'A/B Testing', 'Typography Hierarchy',
      'Color Theory', 'Responsive Grid', 'Component Variants', 'User Persona',
      'Framer', 'Principle', 'Heuristic Evaluation', 'Design QA'
    ],
    toolsAndFrameworks: [
      'Figma', 'Framer', 'FigJam', 'Miro', 'Adobe CC', 'Lottie', 'Maze', 'Notion'
    ],
    metricsToHighlight: [
      'Conversion funnel rate improvement (e.g. +24% checkout completion)',
      'Task completion time drop (e.g. onboarding time cut by 40%)',
      'System usability score (SUS) increase',
      'Design system adoption percentage across engineering squads'
    ],
    commonMistakes: [
      'Showing only final glossy Dribbble mockups without explaining problem solving or user research.',
      'No interactive clickable prototypes.',
      'Ignoring mobile responsive adaptations and accessibility contrast.'
    ],
    resumeEssentials: [
      'Frame every project around Problem -> Research -> Iteration -> Measurable Business Outcome.',
      'Highlight cross-functional partnership with engineering and product managers.',
      'Demonstrate mastery of token-driven design systems and WCAG accessibility.'
    ],
    portfolioMustHaves: [
      'In-depth case studies with high-fidelity clickable Figma / Framer prototypes.',
      'Clear before-and-after visual comparisons with research data.',
      'Component breakdown showcase demonstrating reusable UI kits.'
    ]
  },
  'mobile': {
    id: 'mobile',
    title: 'Mobile Developer (iOS / Android / Flutter)',
    category: 'Engineering',
    icon: 'Smartphone',
    description: 'Creates high-performance native or cross-platform mobile apps with smooth 60fps animations, offline persistence, and seamless OS integrations.',
    primaryKeywords: [
      'Swift', 'Kotlin', 'React Native', 'Flutter', 'SwiftUI', 'Jetpack Compose',
      'iOS', 'Android', 'App Store Deployment', 'Offline Storage', 'Push Notifications',
      'State Management', 'REST API', 'Core Animation', 'Mobile Security'
    ],
    secondaryKeywords: [
      'Room DB', 'CoreData', 'SQLite', 'Realm', 'Biometrics', 'Deep Linking',
      'Fastlane', 'Cocoapods', 'Gradle', 'TestFlight', 'Redux Toolkit', 'Riverpod'
    ],
    toolsAndFrameworks: [
      'Xcode', 'Android Studio', 'React Native', 'Flutter', 'Fastlane', 'Firebase', 'TestFlight'
    ],
    metricsToHighlight: [
      'App Store / Play Store download milestones and star ratings (4.8+)',
      'App launch time optimization (e.g. cold start under 800ms)',
      'Crash-free session rate (99.9%)',
      'App bundle size reduction'
    ],
    commonMistakes: [
      'No video demos or App Store/TestFlight links.',
      'Ignoring offline-first sync behavior and battery/memory constraints.',
      'Generic UI without platform-specific navigation guidelines (HIG / Material 3).'
    ],
    resumeEssentials: [
      'Mention store deployment metrics, ratings, and crash-free session rates.',
      'Detail background sync, local database caching, and secure enclave authentication.',
      'Showcase performance tuning for low-end devices and variable network latency.'
    ],
    portfolioMustHaves: [
      'High-framerate video screen captures or embedded device mockup demos.',
      'Direct links to TestFlight, Google Play beta, or GitHub open-source code.',
      'Architecture breakdown (MVVM, Clean Architecture, or Bloc/Redux).'
    ]
  },
  'devops': {
    id: 'devops',
    title: 'DevOps & Cloud Engineer',
    category: 'Infrastructure',
    icon: 'Cloud',
    description: 'Automates cloud infrastructure, CI/CD pipelines, container orchestration, observability, and zero-downtime deployment pipelines.',
    primaryKeywords: [
      'Kubernetes', 'Docker', 'Terraform', 'AWS', 'CI/CD Pipelines',
      'GitHub Actions', 'Prometheus', 'Grafana', 'Infrastructure as Code',
      'Helm', 'Linux', 'Security Compliance', 'CloudWatch', 'Bash'
    ],
    secondaryKeywords: [
      'ArgoCD', 'GitOps', 'GCP', 'Azure', 'Ansible', 'Istio Service Mesh',
      'OpenTelemetry', 'Vault', 'ELK Stack', 'Cost Optimization', 'Zero-Downtime'
    ],
    toolsAndFrameworks: [
      'AWS', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'Prometheus', 'Grafana', 'Linux'
    ],
    metricsToHighlight: [
      'Deployment frequency (e.g. 5x daily zero-downtime releases)',
      'Mean Time to Recovery (MTTR) reduction (e.g. from 45 min to 3 min)',
      'Cloud compute infrastructure cost reduction (e.g. 38% annual savings)',
      'Build & test pipeline speedup (e.g. 25 min -> 4 min)'
    ],
    commonMistakes: [
      'Only listing tools without demonstrating automated pipeline architecture.',
      'No code samples showing reusable Terraform modules or Helm charts.',
      'Omitting security hardening and disaster recovery protocols.'
    ],
    resumeEssentials: [
      'Highlight Infrastructure as Code (IaC) modularity and automated testing.',
      'Quantify deployment velocity, pipeline duration cuts, and cost savings.',
      'Detail incident response, SLO/SLA management, and automated rollbacks.'
    ],
    portfolioMustHaves: [
      'Architecture blueprints showing VPC, ingress, auto-scaling, and telemetry.',
      'Open-source GitHub repos with production-ready Terraform or Helm templates.',
      'Live Grafana dashboard demo snapshot or simulated load recovery test.'
    ]
  },
  'product-manager': {
    id: 'product-manager',
    title: 'Product Manager',
    category: 'Product',
    icon: 'Briefcase',
    description: 'Leads cross-functional discovery, roadmap prioritization, user metrics analysis, product requirements (PRDs), and go-to-market strategy.',
    primaryKeywords: [
      'Product Strategy', 'PRD', 'Roadmapping', 'User Research', 'Agile / Scrum',
      'A/B Testing', 'Data Analytics', 'KPIs & OKRs', 'Go-To-Market',
      'User Personas', 'Feature Prioritization', 'Stakeholder Management'
    ],
    secondaryKeywords: [
      'SQL', 'Mixpanel', 'Amplitude', 'Jira', 'Competitive Analysis',
      'Customer Discovery', 'North Star Metric', 'Monetization', 'Retention Funnel'
    ],
    toolsAndFrameworks: [
      'Jira', 'Linear', 'Amplitude', 'Mixpanel', 'Figma', 'Notion', 'Google Analytics', 'SQL'
    ],
    metricsToHighlight: [
      'ARR / MRR revenue growth contribution',
      'Monthly Active Users (MAU) & Day-30 Retention lift',
      'Conversion rate increase on core activation funnels',
      'Customer Acquisition Cost (CAC) reduction'
    ],
    commonMistakes: [
      'Describing day-to-day project coordination instead of strategic product vision.',
      'No quantified business impact or North Star metrics.',
      'Lacking tangible PRD artifacts, wireframe strategies, or experiment design summaries.'
    ],
    resumeEssentials: [
      'Highlight ownership of product lifecycle from 0-to-1 or scaling 1-to-100.',
      'Quantify business metrics: ARR, retention, conversion, and adoption.',
      'Demonstrate strong cross-functional leadership across Engineering, Design, and Sales.'
    ],
    portfolioMustHaves: [
      'De-identified PRD (Product Requirements Document) case study breakdown.',
      'Data-driven feature launch retrospective with hypothesis and metric results.',
      'Interactive prototype walkthrough or product demo video.'
    ]
  },
  'data-engineer': {
    id: 'data-engineer',
    title: 'Data Engineer & Analyst',
    category: 'Data & AI',
    icon: 'Database',
    description: 'Builds robust ETL/ELT data pipelines, data warehouses, streaming systems, and empowers business analytics with high-reliability data models.',
    primaryKeywords: [
      'SQL', 'Python', 'Apache Spark', 'Snowflake', 'dbt', 'Airflow',
      'Data Modeling', 'ETL Pipelines', 'BigQuery', 'Kafka', 'PostgreSQL',
      'Data Quality', 'Data Warehousing', 'Analytics'
    ],
    secondaryKeywords: [
      'Databricks', 'Delta Lake', 'Redshift', 'Pandas', 'PySpark',
      'Data Governance', 'Tableau', 'Power BI', 'Dimensional Modeling', 'Parquet'
    ],
    toolsAndFrameworks: [
      'Python', 'SQL', 'Apache Spark', 'Snowflake', 'dbt', 'Airflow', 'BigQuery', 'Tableau'
    ],
    metricsToHighlight: [
      'Pipeline execution time reduction (e.g. 6-hour nightly job -> 25 minutes)',
      'Data pipeline reliability (99.9% on-time SLA)',
      'Data processing volume (e.g. 5TB+ daily streaming events)',
      'Query cost optimization in BigQuery/Snowflake'
    ],
    commonMistakes: [
      'Listing only basic SQL queries without explaining data lineage or pipeline orchestrators.',
      'No data architecture diagrams showing raw -> staging -> marts layers.',
      'Lacking automated data quality testing and alerting protocols.'
    ],
    resumeEssentials: [
      'Highlight modern data stack experience (dbt, Snowflake, Airflow, Spark).',
      'Quantify pipeline latency reductions, data volume scale, and warehouse query optimization.',
      'Detail dimensional modeling (star/snowflake schemas) and automated data testing.'
    ],
    portfolioMustHaves: [
      'End-to-end data pipeline code repository with dbt models and DAG definitions.',
      'Data flow architecture diagrams illustrating real-time and batch ingestion.',
      'Interactive dashboard or clear analysis report demonstrating business intelligence value.'
    ]
  }
};

export const SAMPLE_PORTFOLIOS: SamplePortfolio[] = [
  {
    id: 'sample-frontend',
    role: 'frontend',
    name: 'Alex Rivera — Senior Frontend Engineer',
    experienceLevel: 'Senior (6+ Years)',
    tagline: 'Crafting pixel-perfect, accessible, ultra-fast web experiences with React, Next.js & TypeScript.',
    socials: {
      linkedin: 'https://linkedin.com/in/alexrivera-fe',
      github: 'https://github.com/alexrivera-dev',
      twitter: 'https://x.com/alexrivera_ui'
    },
    content: `Alex Rivera
Senior Frontend Engineer | San Francisco, CA | alex.rivera@example.com | github.com/alexrivera-dev

Summary:
Senior Frontend Engineer with 6+ years of experience building high-performance, accessible enterprise web applications. Proven track record in architecting design systems, reducing bundle sizes by 45%, and improving Core Web Vitals across millions of monthly active users.

Technical Skills:
- Languages & Core: TypeScript, JavaScript (ES6+), HTML5, CSS3/PostCSS
- Frameworks & Libraries: React 19, Next.js 15, Vue.js, Tailwind CSS, TanStack Query, Zustand, Redux Toolkit
- Testing & Quality: Jest, React Testing Library, Playwright, Cypress, WCAG 2.1 AA Accessibility
- Build & Tooling: Vite, Webpack, Turborepo, Git, Vercel, Docker

Professional Experience:
Senior Frontend Engineer | FinTech Cloud Corp (2022 - Present)
- Spearheaded the redesign of the core trading dashboard using Next.js, React, and TypeScript, boosting Lighthouse performance scores from 64 to 98.
- Architected a unified enterprise Design System adopted by 14 cross-functional squads, reducing new feature development turnaround by 35%.
- Optimized client bundle sizes by 42% through aggressive tree-shaking, dynamic imports, and route-based code splitting, saving over 1.4s on initial page loads.
- Implemented robust end-to-end test suites using Playwright and Jest, increasing code coverage to 92% and preventing regression bugs.

Frontend Developer | Horizon Media (2019 - 2022)
- Built interactive analytics dashboards with real-time WebSockets and D3.js, handling 50k concurrent data stream events with smooth 60fps rendering.
- Engineered comprehensive WCAG 2.1 AA compliance audit and remediation across 20+ customer portals.
- Collaborated closely with UX designers in Figma to transform high-fidelity prototypes into responsive, accessible components.

Featured Projects:
1. DevFlow — Developer Productivity & Snippet Hub
- Live URL: https://devflow-app.demo
- GitHub: https://github.com/alexrivera-dev/devflow
- Description: Open-source developer workspace built with Next.js, Tailwind CSS, and SQLite. Features real-time syntax highlighting, local offline sync, and keyboard-first shortcuts.
- Impact: 2,400+ GitHub Stars, 15,000 monthly active users.

2. PulseUI — Minimalist React Component Kit
- Live URL: https://pulseui.demo
- GitHub: https://github.com/alexrivera-dev/pulseui
- Description: Ultra-lightweight, zero-runtime dependency UI component library focused on strict accessibility, customizable tokens, and sub-10kb bundle sizes.`
  },
  {
    id: 'sample-fullstack',
    role: 'fullstack',
    name: 'David Chen — Staff Full Stack & Backend Engineer',
    experienceLevel: 'Staff / Lead (8+ Years)',
    tagline: 'Scaling distributed backends, microservices, and high-throughput systems on AWS & PostgreSQL.',
    socials: {
      linkedin: 'https://linkedin.com/in/davidchen-tech',
      github: 'https://github.com/davidchen-eng',
      twitter: 'https://x.com/davidchen_code'
    },
    content: `David Chen
Staff Full Stack & Distributed Systems Engineer | Seattle, WA | david.chen@example.com

Summary:
Results-driven Lead Engineer with 8+ years architecting high-throughput distributed backends, microservices, and modern React/TypeScript frontends. Expert in PostgreSQL indexing, Redis caching, Kafka message streaming, and containerized cloud infrastructure on AWS.

Technical Skills:
- Languages: TypeScript, Go, Python, SQL, JavaScript
- Backend: Node.js, Express, NestJS, Go (Golang), gRPC, RESTful APIs, GraphQL
- Databases & Messaging: PostgreSQL, Redis, MongoDB, Apache Kafka, RabbitMQ
- Infrastructure & Cloud: AWS (ECS, Lambda, RDS, S3), Docker, Kubernetes, Terraform, GitHub Actions CI/CD

Work Experience:
Lead Backend Engineer | CloudScale Networks (2021 - Present)
- Architected and deployed microservices backend processing 15,000+ queries per second with p99 response times under 40ms using Go, Node.js, and PostgreSQL.
- Implemented multi-tier caching strategy with Redis and read-replicas, decreasing database server CPU load by 55% and reducing AWS infrastructure spend by $72,000 annually.
- Orchestrated zero-downtime Kubernetes deployments and CI/CD pipelines via GitHub Actions and Terraform, enabling daily automated production releases.
- Mentored a team of 8 engineers on distributed system reliability, API design standards, and comprehensive unit/integration testing.

Senior Full Stack Engineer | DataSync Inc (2018 - 2021)
- Built customer-facing billing and identity management portal using React, TypeScript, and Node.js with Stripe integration and OAuth2 / JWT authentication.
- Optimized slow database queries through B-Tree indexing and query restructuring, accelerating report generation from 45 seconds to 1.2 seconds.
- Designed event-driven data ingestion pipeline with Apache Kafka and PostgreSQL, streaming 10M+ daily events without data loss.

Key Projects:
1. MicroStream — Distributed Event Ingestion Gateway
- Tech: Go, Apache Kafka, Redis, Docker, Prometheus
- URL: https://microstream.cloud
- Description: Fault-tolerant event streamer capable of handling 50k events/sec with automated backpressure control and Prometheus monitoring alerts.

2. NexusDB — Lightweight In-Memory Key-Value Store
- Tech: TypeScript, Node.js, Raft Consensus
- GitHub: https://github.com/davidchen-eng/nexus-db
- Description: Experimental distributed key-value store implementing Raft consensus for leader election and data replication.`
  },
  {
    id: 'sample-ai-ml',
    role: 'ai-ml',
    name: 'Dr. Sophia Zhang — Senior AI / ML Engineer',
    experienceLevel: 'Senior (5+ Years)',
    tagline: 'Building production RAG systems, LLM fine-tuning pipelines, and high-throughput model inference.',
    socials: {
      linkedin: 'https://linkedin.com/in/sophiazhang-ai',
      github: 'https://github.com/sophiazhang-ml',
      twitter: 'https://x.com/sophia_ml'
    },
    content: `Dr. Sophia Zhang
Senior AI & Machine Learning Engineer | Boston, MA | sophia.zhang@example.com

Summary:
AI/ML Engineer with a Ph.D. in Computer Science and 5+ years building and deploying generative AI systems, RAG architectures, and custom deep learning models. Specialized in vector databases, LLM quantization (LoRA/QLoRA), model evaluation frameworks, and high-throughput inference serving.

Technical Stack:
- Machine Learning & AI: PyTorch, Hugging Face Transformers, LangChain, LlamaIndex, Scikit-Learn, LoRA/QLoRA
- Data & Vector Stores: Pinecone, Qdrant, ChromaDB, Pandas, NumPy, PostgreSQL (pgvector)
- Deployment & MLOps: FastAPI, vLLM, Triton Inference Server, Docker, MLflow, Weights & Biases
- Languages: Python, C++, TypeScript, SQL

Experience:
Senior AI Engineer | Cognitive Systems Labs (2022 - Present)
- Engineered enterprise RAG (Retrieval-Augmented Generation) pipeline over 5M+ technical documents using Qdrant, hybrid dense-sparse search, and reranking, achieving 94% retrieval precision@5.
- Fine-tuned open-source LLMs (Llama 3, Mistral) using QLoRA for domain-specific medical summaries, matching proprietary model performance at 85% lower inference cost.
- Accelerated LLM serving throughput by 3.2x by deploying vLLM with PagedAttention and FP8 quantization on NVIDIA A100 clusters.
- Established automated hallucination evaluation harness utilizing custom ROUGE, BERTScore, and G-Eval benchmarks.

Machine Learning Researcher | VisionAI Analytics (2019 - 2022)
- Developed computer vision pipeline for automated defect detection in manufacturing using PyTorch, reducing manual QA inspection time by 60%.
- Published 3 peer-reviewed papers on transfer learning and few-shot classification at top tier ML conferences.
- Built real-time inference microservice with FastAPI and Docker processing 200 FPS video streams.

Projects:
1. Omnisearch AI — Hybrid Semantic Code Search Engine
- Tech: Python, FastAPI, Hugging Face, ChromaDB, React
- Demo: https://omnisearch.ai.demo
- Description: Natural language code search across 500+ GitHub repositories with AST parsing, AST-aware chunking, and sub-50ms query latency.

2. PromptForge — LLM Evaluation & Regression Suite
- GitHub: https://github.com/sophiazhang-ml/prompt-forge
- Description: Open-source test harness to evaluate prompt drifts, latency regressions, and model token costs across LLM releases.`
  },
  {
    id: 'sample-ui-ux',
    role: 'ui-ux',
    name: 'Elena Vance — Senior Product & UI/UX Designer',
    experienceLevel: 'Senior (6+ Years)',
    tagline: 'Designing human-centered digital products, design systems, and conversion-boosting user journeys.',
    socials: {
      linkedin: 'https://linkedin.com/in/elenavance-design',
      github: 'https://github.com/elenavance',
      twitter: 'https://x.com/elenavance_ui'
    },
    content: `Elena Vance
Senior Product & UI/UX Designer | New York, NY | elena.vance@example.com | elenavance.design

Summary:
Senior Product Designer with 6+ years shaping complex B2B SaaS platforms and mobile consumer applications. Proven track record of increasing checkout conversion by 28%, cutting user onboarding drop-off by 45%, and architecting design systems supporting 50+ engineers and designers.

Core Competencies:
- Design: Product Strategy, User Journey Mapping, Wireframing, High-Fidelity Prototyping, Design Systems
- Research: User Interviews, Usability Testing, Heuristic Analysis, A/B Testing, Heuristic Evaluation
- Tools: Figma, FigJam, Framer, Principle, Adobe Creative Suite, Maze, Miro, Notion
- Technical: HTML5, CSS3, Tailwind CSS basics, WCAG 2.1 AA Accessibility Standards

Experience:
Lead Product Designer | FlowState SaaS (2022 - Present)
- Led end-to-end product design for flagship team collaboration platform, conducting 40+ user interviews and iterative usability tests with Maze.
- Redesigned user onboarding flow, reducing time-to-first-value from 18 minutes to 4 minutes and boosting 30-day user retention by 22%.
- Created and maintained "Prism Design System" in Figma with 150+ token-driven components and interactive variants, improving design-to-engineering handoff speed by 40%.
- Partnered closely with Product Managers and Frontend Engineers to ensure pixel-perfect implementation and WCAG AA contrast compliance.

Senior UI/UX Designer | Sprout Mobile (2019 - 2022)
- Designed iOS and Android mobile banking app from concept to 2M+ active users, achieving a 4.9-star App Store rating.
- Designed checkout and subscription funnel experiments, resulting in a +28% increase in annual plan conversion.
- Created micro-interactions and vector illustrations with Principle and Lottie, enhancing delight and perceived performance.

Case Studies:
1. Prism — Enterprise Design System & Guidelines
- Prototype: https://figma.com/@elenavance/prism
- Impact: Adopted across 6 distinct web and mobile product lines, standardizing UI consistency and cutting design QA tickets by 65%.

2. PayFlow — Frictionless Global Payments UX
- Case Study: https://elenavance.design/case-studies/payflow
- Problem: High checkout abandonment on cross-border payments.
- Solution: Streamlined 5-step form into an adaptive single-page drawer with contextual auto-fill, resulting in +28% completed transactions.`
  },
  {
    id: 'sample-mobile',
    role: 'mobile',
    name: 'Marcus Cole — Lead Mobile Engineer (iOS & Android)',
    experienceLevel: 'Lead (7+ Years)',
    tagline: 'Building buttery-smooth 60fps mobile applications with Swift, Kotlin, and React Native.',
    socials: {
      linkedin: 'https://linkedin.com/in/marcuscole-mobile',
      github: 'https://github.com/marcuscole-dev',
      twitter: 'https://x.com/marcus_mobile'
    },
    content: `Marcus Cole
Lead Mobile Engineer | Austin, TX | marcus.cole@example.com

Summary:
Lead Mobile Developer with 7+ years delivering top-rated iOS (Swift / SwiftUI) and cross-platform (React Native) applications to millions of global users. Specialized in offline-first SQLite synchronization, buttery-smooth 60fps UI animations, and automated Fastlane CI/CD store pipelines.

Technical Skills:
- iOS: Swift, SwiftUI, UIKit, Combine, CoreData, CoreAnimation, TestFlight
- Android & Cross-Platform: React Native, Kotlin, Jetpack Compose, TypeScript
- Architecture & Patterns: MVVM, Clean Architecture, Redux, StateFlow
- Tools: Xcode, Android Studio, Fastlane, Firebase, CocoaPods, Git, App Store Connect

Professional Experience:
Lead iOS & Mobile Engineer | Velocity Fitness (2021 - Present)
- Led development of flagship iOS fitness app with 3.5M downloads, maintaining a 4.8/5.0 App Store rating across 85k+ reviews.
- Engineered offline-first synchronization engine using Swift, Combine, and SQLite, ensuring zero workout data loss in poor connectivity environments.
- Optimized startup cold-launch time by 48% (from 2.2s down to 850ms) and maintained a 99.95% crash-free session rate.
- Automated TestFlight beta builds and App Store submissions via Fastlane and GitHub Actions, cutting release deployment overhead from 6 hours to 15 minutes.

Mobile Developer | TravelMate Inc (2018 - 2021)
- Built interactive mapping and booking features in React Native and TypeScript, serving 500k monthly travelers.
- Integrated Apple Pay, Google Pay, and biometric authentication with zero security defects.
- Reduced app bundle size by 35% through dynamic asset delivery and image optimization.

Featured Apps:
1. ApexTimer — Precision Interval HIIT Tracker (iOS)
- App Store: 4.9 Stars (12k Reviews)
- Description: Native SwiftUI workout timer with Apple Watch companion app, Live Activities, and Dynamic Island integrations.

2. AudioCaster — Minimalist Offline Podcast Player
- GitHub: https://github.com/marcuscole-dev/audiocaster
- Description: Open-source React Native audio player featuring local SQLite database caching, background playback service, and custom waveform scrubber.`
  },
  {
    id: 'sample-newgrad',
    role: 'frontend',
    name: 'Jordan Lee — Aspiring Frontend / Web Developer (Early Career)',
    experienceLevel: 'Entry-Level / Junior (1 Year)',
    tagline: 'Hungry developer passionate about modern React, TypeScript, and interactive web tools.',
    socials: {
      linkedin: 'https://linkedin.com/in/jordanlee-web',
      github: 'https://github.com/jordanlee-dev',
      twitter: 'https://x.com/jordan_builds'
    },
    content: `Jordan Lee
Junior Frontend Developer | Chicago, IL | jordan.lee@example.com

Summary:
Passionate Frontend Developer and recent Computer Science graduate with hands-on experience building responsive web applications using React, TypeScript, and Tailwind CSS. Eager to contribute clean code, collaborative problem-solving, and continuous learning to high-impact product teams.

Skills:
- HTML5, CSS3, JavaScript, TypeScript, React, Next.js, Tailwind CSS
- Git, GitHub, REST APIs, Jest, Vite, Vercel

Projects:
1. Taskify — Drag-and-Drop Task Management Board
- Tech: React, TypeScript, Tailwind CSS, LocalStorage
- GitHub: https://github.com/jordanlee-dev/taskify
- Built a Kanban-style task tracker featuring drag-and-drop column reordering, custom priority tags, and responsive mobile layouts.

2. WeatherPulse — Live Forecast & Radar App
- Tech: JavaScript, OpenWeather API, CSS Grid
- Live Demo: https://weatherpulse.demo
- Created a weather lookup application fetching real-time 5-day forecasts with temperature conversions and animated weather condition icons.`
  }
];
