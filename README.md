# Equity Manager - Case Study

> A modern, production-ready fullstack application for managing company shareholders and equity distribution.

[![Tests](https://img.shields.io/badge/tests-16%2F16%20passing-brightgreen)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()

## Project Overview

Equity Manager is a comprehensive enterprise application designed to manage company shareholders, equity distribution, and provide real-time analytics. Built with modern technologies and best practices, it demonstrates production-ready architecture, security, and testing.

**Key Features:**
- **JWT Authentication** with role-based access control (Admin/Editor/Viewer)
- **Analytics Dashboard** with interactive charts and statistics
- **Full CRUD Operations** with validation and error handling
- **API Documentation** with Swagger/OpenAPI
- **E2E Testing** with Cypress (100% pass rate)
- **AD Design System** integration
- **International context** ready

## Architecture & Tech Stack

### **Backend (NestJS)**
- **Framework:** NestJS 11+ with TypeScript
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT with Passport.js
- **API Documentation:** Swagger/OpenAPI 3.0
- **Validation:** class-validator, class-transformer
- **Security:** bcrypt password hashing, role-based guards

### **Frontend (Vue 3)**
- **Framework:** Vue 3 with Composition API + TypeScript
- **Build Tool:** Vite 7+
- **HTTP Client:** Axios
- **Charts:** Chart.js + vue-chartjs
- **Styling:** Tailwind CSS with ADEO design tokens
- **State Management:** Vue Composition API with refs

### **Testing & Quality**
- **E2E Testing:** Cypress 15+ (16/16 tests passing)
- **Type Safety:** TypeScript strict mode
- **Code Quality:** ESLint, Prettier
- **API Testing:** Swagger UI

### **Infrastructure**
- **Monorepo:** pnpm workspaces
- **Containerization:** Docker + Docker Compose
- **Database UI:** Mongo Express

## Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) v20+
- [pnpm](https://pnpm.io/) v8+
- [Docker & Docker Compose](https://www.docker.com/)

### 1. Clone & Install
```bash
git clone <repository-url>
cd equity-manager
pnpm install
```

### 2. Start Database
```bash
docker-compose up -d
```
*MongoDB will be available at `localhost:27017`*  
*Mongo Express UI at `http://localhost:8081`*

### 3. Seed Test Data
```bash
# Start API
cd apps/api
pnpm run start:dev

# In another terminal, seed test users
curl http://localhost:3000/users/seed/init
```

This creates 3 test users:
- **Admin:** admin@ad.com / admin123
- **Editor:** editor@ad.com / editor123  
- **Viewer:** viewer@ad.com / viewer123

### 4. Start Applications

**Backend API:**
```bash
cd apps/api
pnpm run start:dev
# API: http://localhost:3000
# Swagger: http://localhost:3000/api/docs
```

**Frontend:**
```bash
cd apps/web
pnpm run dev
# Web: http://localhost:5173
```

### 5. Run Tests
```bash
cd apps/web
pnpm exec cypress run  # Headless
# or
pnpm exec cypress open # Interactive
```

## Features

### Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
  - **Admin:** Full access (create, read, update, delete)
  - **Editor:** Read, create, update
  - **Viewer:** Read-only access
- Secure password hashing with bcrypt
- Protected API routes with guards

### Shareholder Management
- Create, read, update, delete shareholders
- Data validation with DTOs
- Email uniqueness validation
- Business unit categorization
- Share count tracking
- Real-time data updates

### Analytics Dashboard
- Total shareholders count
- Total shares distribution
- Average shares per person
- Business unit distribution (Pie chart)
- Top 5 shareholders (Bar chart)
- Detailed breakdown by business unit
- Percentage calculations

### API Documentation
- Swagger/OpenAPI 3.0 specification
- Interactive API testing
- Request/response examples
- Authentication documentation
- Available at `/api/docs`

### Testing
- 16 E2E tests with Cypress
  - 5 Authentication flow tests
  - 4 Role-based access tests
  - 7 CRUD operations tests
- 100% test pass rate
- TypeScript-based test suites
- Screenshot capture on failures

## User Interface

### Design System
- **Colors:** AD official brand colors
- **Typography:** System fonts with proper hierarchy
- **Components:** Modern, accessible UI components
- **Responsive:** Mobile-first design approach

### Views
1. **Login/Register** - Authentication flow
2. **Dashboard** - Analytics and statistics with charts
3. **Shareholders List** - Table with CRUD operations
4. **Modal Forms** - Create/Edit shareholders

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt (10 rounds)
- Role-based access control
- CORS configuration
- Input validation and sanitization
- MongoDB injection prevention
- Secret key management via environment variables

## API Endpoints

### Authentication
- `POST /users/auth/register` - Register new user
- `POST /users/auth/login` - Login user

### Users/Shareholders
- `GET /users` - List all shareholders (Protected)
- `GET /users/:id` - Get shareholder by ID (Protected)
- `POST /users` - Create shareholder (Admin/Editor)
- `PUT /users/:id` - Update shareholder (Admin/Editor)
- `DELETE /users/:id` - Delete shareholder (Admin only)

### Utilities
- `GET /users/seed/init` - Seed test users
- `GET /api/docs` - Swagger documentation

## Testing

### Test Coverage
```
Authentication Flow:        5/5 tests passing
Role-Based Access Control:  4/4 tests passing
Shareholders CRUD:          7/7 tests passing
───────────────────────────────────────────
Total:                     16/16 (100%)
```

### Test Scenarios
- Login/logout flow
- Invalid credentials handling
- Role-based UI rendering
- CRUD operations
- Dashboard statistics display
- Chart rendering
- Form validation

## Project Structure

```
equity-manager/
├── apps/
│   ├── api/                    # NestJS Backend
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   └── users/      # Users module
│   │   │   │       ├── dto/    # Data Transfer Objects
│   │   │   │       ├── guards/ # Auth guards
│   │   │   │       ├── strategies/ # JWT strategy
│   │   │   │       └── decorators/ # Custom decorators
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   └── test/               # E2E tests
│   │
│   └── web/                    # Vue 3 Frontend
│       ├── src/
│       │   ├── components/     # Vue components
│       │   ├── App.vue
│       │   └── main.ts
│       └── cypress/            # Cypress E2E tests
│           └── e2e/
│
├── docker-compose.yml          # Docker services
├── pnpm-workspace.yaml         # Monorepo config
└── README.md
```

## Development

### Available Scripts

**Root:**
```bash
pnpm install          # Install all dependencies
pnpm dev              # Start all services
```

**Backend (apps/api):**
```bash
pnpm run start:dev    # Development mode with hot reload
pnpm run build        # Production build
pnpm run start:prod   # Production mode
```

**Frontend (apps/web):**
```bash
pnpm run dev          # Development server
pnpm run build        # Production build
pnpm run preview      # Preview production build
```

**Tests:**
```bash
pnpm exec cypress run    # Run E2E tests (headless)
pnpm exec cypress open   # Open Cypress UI
```

## Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://admin:password@localhost:27017/equity-manager?authSource=admin
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=3000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
```

## Deployment

### Docker Production Build
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Environment-specific Configs
- Development: `.env.development`
- Production: `.env.production`
- Test: `.env.test`

## Future Enhancements

### Planned Features
- [ ] **Audit Trail** - Complete history of all modifications
- [ ] **Share Transactions** - Transfer shares between shareholders
- [ ] **Export to CSV/PDF** - Download reports
- [ ] **Real-time Notifications** - WebSocket integration
- [ ] **Multi-tenancy** - Support multiple companies
- [ ] **i18n** - French/English localization
- [ ] **Advanced Analytics** - Trends and predictions
- [ ] **Mobile App** - React Native companion

### Infrastructure
- [ ] **CI/CD Pipeline** - GitHub Actions
- [ ] **Kubernetes** - Container orchestration
- [ ] **Redis Cache** - Performance optimization
- [ ] **Rate Limiting** - API protection
- [ ] **Monitoring** - Datadog integration
- [ ] **Logging** - Structured logs with Winston

## Team & Contribution

Built as a case study for demonstrating:
- Modern fullstack development
- Enterprise-grade architecture
- Security best practices
- Comprehensive testing
- Clean code principles

## License

MIT License - feel free to use this project for learning and development.

## Acknowledgments

- **AD** Design System** for design guidelines
- **NestJS** for the excellent backend framework
- **Vue.js** for the reactive frontend framework
- **Cypress** for reliable E2E testing

---

**Built with <3 for modern enterprise applications**
