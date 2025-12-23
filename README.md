# Budget Tracker

A comprehensive budget tracking application with multi-user support, built with Next.js, PostgreSQL, and Docker. Features Authentik SSO integration for secure authentication.

## Features

- **Transaction Management**: Track income and expenses with detailed categorization
- **Budget Categories & Limits**: Set monthly/yearly budget limits with visual alerts
- **Reports & Visualizations**: Interactive charts showing spending patterns and trends
- **Recurring Transactions**: Automate recurring income/expenses (subscriptions, salary, etc.)
- **Multi-User Support**: Secure authentication via Authentik SSO
- **Responsive Design**: Modern UI built with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL 15
- **ORM**: Prisma 7
- **Authentication**: Authentik SSO (via Traefik forward auth)
- **Charts**: Recharts
- **Deployment**: Docker + Docker Compose
- **Reverse Proxy**: Traefik

## Architecture

```
Internet → Cloudflare Tunnel → Traefik → Authentik → Budget Tracker
                                            ↓
                                       PostgreSQL
```

## Prerequisites

- Docker and Docker Compose
- Traefik reverse proxy with Authentik middleware configured
- Domain/subdomain pointing to your server (e.g., finance.readj.dev)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/budget-tracker.git
cd budget-tracker
```

### 2. Environment Setup

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` and update the database credentials:

```env
DATABASE_URL="postgresql://budget:YOUR_SECURE_PASSWORD@postgres:5432/budget_tracker"
POSTGRES_USER=budget
POSTGRES_PASSWORD=YOUR_SECURE_PASSWORD
POSTGRES_DB=budget_tracker
NODE_ENV=production
```

### 3. Start the Application

```bash
docker compose up -d
```

This will:
- Start a PostgreSQL database
- Build and start the Next.js application
- Expose the app through Traefik at your configured domain

### 4. Run Database Migrations

```bash
docker compose exec budget-tracker npx prisma migrate deploy
```

### 5. (Optional) Seed the Database

To create default categories:

```bash
docker compose exec budget-tracker npx prisma db seed
```

## Usage

### Accessing the Application

Navigate to your configured domain (e.g., https://finance.readj.dev). You'll be prompted to log in via Authentik SSO.

### Managing Transactions

1. Click **Transactions** in the navigation
2. Click **Add Transaction**
3. Fill in the amount, type (income/expense), category, date, and description
4. Click **Save**

### Setting Budgets

1. Click **Budgets** in the navigation
2. Click **Create Budget**
3. Select a category, set the budget amount and period (monthly/yearly)
4. Set an alert threshold (default 80%)
5. Click **Save**

### Viewing Reports

Click **Reports** to see:
- Spending by category (pie chart)
- Monthly income vs. expenses trend
- Category breakdowns
- Custom date range filtering

### Recurring Transactions

1. Navigate to your dashboard or transactions page
2. Look for the recurring transactions section
3. Add templates for recurring income/expenses
4. Manually trigger processing or set up a cron job to hit `/api/recurring/process`

## Development

### Local Development

```bash
# Install dependencies
npm install

# Run Prisma migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Start development server
npm run dev
```

The app will be available at http://localhost:3000

### Database Management

```bash
# Open Prisma Studio
npm run prisma:studio

# Create a new migration
npx prisma migrate dev --name your_migration_name

# Reset database (caution: destroys all data)
npx prisma migrate reset
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/user` | GET | Get current user info |
| `/api/transactions` | GET, POST | List/create transactions |
| `/api/transactions/[id]` | GET, PATCH, DELETE | Manage single transaction |
| `/api/categories` | GET, POST | List/create categories |
| `/api/budgets` | GET, POST | List/create budgets |
| `/api/budgets/[id]` | DELETE | Delete budget |
| `/api/recurring` | GET, POST | List/create recurring transactions |
| `/api/recurring/process` | POST | Process recurring transactions |
| `/api/reports` | GET | Get financial reports and analytics |

## Database Schema

- **User**: Synced from Authentik (id, email, name)
- **Category**: Budget categories with color coding
- **Transaction**: Individual income/expense entries
- **Budget**: Monthly/yearly spending limits per category
- **RecurringTransaction**: Templates for recurring transactions

## Docker Configuration

### Services

- **postgres**: PostgreSQL 15 database
- **budget-tracker**: Next.js application

### Networks

- **budget_net**: Internal network for app-database communication
- **proxy**: External Traefik network

### Volumes

- **postgres_data**: Persistent database storage

## Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker compose ps postgres

# View PostgreSQL logs
docker compose logs postgres

# Check database connection from app
docker compose exec budget-tracker npx prisma db push
```

### Authentication Issues

Ensure:
1. Traefik's Authentik middleware is properly configured
2. The domain is correctly set in Traefik labels
3. Authentik is passing the required headers (`x-authentik-uid`, `x-authentik-email`)

### Build Failures

```bash
# Clean rebuild
docker compose down
docker compose build --no-cache
docker compose up -d
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database management with [Prisma](https://www.prisma.io/)
- Authentication via [Authentik](https://goauthentik.io/)
- Reverse proxy by [Traefik](https://traefik.io/)
