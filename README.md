# EmprendeConecta V2

Marketplace de emprendimiento local — V2. Rediseño completo con TypeScript, Tailwind CSS v4, 
modo oscuro, arquitectura moderna y diseño minimalista premium.

## 🏗️ Stack

| Capa | Tecnología |
|------|-----------|
| **Frontend** | React 19 + TypeScript + Vite 8 |
| **Estilos** | Tailwind CSS v4 + Framer Motion |
| **Backend** | Spring Boot 4.1 + Java 21 |
| **BD** | MySQL 8 (Railway) |
| **Deploy** | Vercel (frontend) + Railway (backend) |

## 🚀 Inicio rápido

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
./mvnw spring-boot:run
```

## 📁 Estructura

```
emprendeconecta-v2/
├── frontend/
│   ├── src/
│   │   ├── components/   # UI primitives + layout + shared
│   │   ├── pages/        # public, customer, entrepreneur, admin
│   │   ├── stores/       # Zustand (auth, cart, ui)
│   │   ├── lib/          # API client, utilities
│   │   └── types/        # TypeScript types
│   └── ...
├── backend/
│   ├── src/main/java/com/market/market/
│   │   ├── controladores/
│   │   ├── servicios/
│   │   ├── repositorios/
│   │   └── entidades/
│   └── ...
└── .github/workflows/    # CI/CD
```

## 🔗 URLs

- **Frontend:** https://emprendeconecta.vercel.app
- **Backend API:** https://api.emprendeconecta.cl
- **Repositorio:** https://github.com/partberstech/emprendeconecta-v2
