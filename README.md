# PM Online Learning Tool

Eine interaktive Lernplattform für **Projektmanagement** an der Hochschule Hof.

## Features

- 🎓 **Prüfungsvorbereitung** – Quiz-System mit Erklärungen
- 📚 **Lernmaterialien** – Upload & Organisation nach Lehrplan
- 💬 **Collaboration** – Diskussionsforum & Kurs-Chat
- 🎧 **Audio Learning** – Audio-Snippets mit Transkription
- 📅 **Vorlesungsplanung** – Kalender für Dozenten
- 🏆 **Gamification** – XP, Levels, Streaks
- 👤 **User Management** – Rollen (Student/Admin)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, TypeScript |
| Backend | Next.js Server Actions |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT (jose) + bcryptjs |
| Storage | Vercel Blob |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Vercel account (for Blob storage)

### Installation

```bash
# Clone & install
git clone https://github.com/iltis89/PM_collaboration_tool_uni_hof.git
cd PM_collaboration_tool_uni_hof
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your values

# Setup database
npm run db:push
npm run db:seed

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="min-32-characters-secret-key"
BLOB_READ_WRITE_TOKEN="vercel_blob_..."
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Auth pages (change-password)
│   ├── (dashboard)/      # Protected routes
│   │   ├── admin/        # Admin panel (modular components)
│   │   ├── dashboard/    # User dashboard
│   │   ├── exam-prep/    # Exam system
│   │   ├── materials/    # Learning materials
│   │   └── collaboration/# Forum
│   ├── actions/          # Server Actions (modular)
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── content.ts
│   │   ├── exams.ts
│   │   └── collaboration.ts
│   └── api/              # API routes
├── components/           # Reusable UI components
├── lib/                  # Utilities
│   ├── auth.ts          # JWT handling
│   ├── prisma.ts        # Database client
│   ├── env.ts           # Environment validation
│   └── rate-limit.ts    # Login rate limiting
└── middleware.ts         # Route protection
```

## Security Features

- ✅ JWT-based authentication
- ✅ Role-based access control (RBAC)
- ✅ Rate limiting (5 login attempts / 15 min)
- ✅ Environment validation in production
- ✅ HTTP-only secure cookies

## Scripts

```bash
npm run dev       # Development server
npm run build     # Production build
npm run lint      # ESLint check
npm run db:push   # Push schema to database
npm run db:seed   # Seed database with test data
```

## License

Private project for Hochschule Hof.
