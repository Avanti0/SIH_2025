# Farm Management Backend

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup
```bash
# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Create database
sudo -u postgres createdb farm_management

# Setup environment variables
cp .env.example .env
# Edit .env with your database credentials
```

### 3. Initialize Database
```bash
npm run setup-db
```

### 4. Run Server
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Farm Management
- `GET /api/farm/dashboard` - Get farm statistics

### Biosecurity
- `GET /api/biosecurity/checklist` - Get compliance checklist
- `PUT /api/biosecurity/checklist` - Update checklist items

### Alerts
- `GET /api/alerts` - Get farm alerts

## Database Schema
See `tables.psql` for complete database structure created by Member 3.

## Features
- PostgreSQL integration
- User authentication with bcrypt
- Role-based access (farmer/vet/admin)
- Compliance tracking
- Risk assessment
- Alert management
- Training modules support
