# MySQL Migration Guide

This guide outlines the migration from Supabase to MySQL for the JobFlow PhotoSync application.

## ✅ Completed Changes

### 1. Database Setup
- ✅ Installed MySQL 9.3.0 via Homebrew
- ✅ Created `jobflow_photosync` database
- ✅ Executed comprehensive migration script with all tables
- ✅ Added sample data for production statuses and app settings

### 2. Dependencies
- ✅ Removed `@supabase/supabase-js`
- ✅ Added `mysql2`, `bcryptjs`, `jsonwebtoken`, `uuid` and their types
- ✅ All authentication and database libraries installed

### 3. Database Layer
- ✅ Created MySQL client (`src/integrations/mysql/client.ts`)
- ✅ Created authentication service (`src/integrations/mysql/auth.ts`)
- ✅ Created comprehensive TypeScript types (`src/integrations/mysql/types.ts`)
- ✅ Updated all service files to use MySQL

### 4. Authentication System
- ✅ Implemented JWT-based authentication
- ✅ Created new AuthContext for MySQL
- ✅ Password hashing with bcrypt
- ✅ Token-based session management

### 5. Service Layer Updates
- ✅ Updated `auth-service.ts`
- ✅ Updated `profile-service.ts`
- ✅ Updated `app-settings-service.ts`
- ✅ Created consolidated `mysql-service.ts`

### 6. Configuration
- ✅ Created `.env.local` with database configuration
- ✅ Added JWT secret configuration

## 🔄 Remaining Tasks

### 1. Update Application Entry Points
Replace Supabase references in main application files:

```bash
# Update these files to use MySQL instead of Supabase:
src/main.tsx                          # App providers
src/providers/AppProviders.tsx        # Auth provider swap
src/contexts/AuthContext.tsx          # Use MySQL auth context
```

### 2. Update React Query Hooks
Update hooks that use Supabase queries:

```bash
# Key files to update:
src/hooks/use-order-mutations.ts
src/hooks/use-clients.ts
src/hooks/use-orders.ts
src/hooks/use-products.ts
# And other data-fetching hooks
```

### 3. Update Components
Replace Supabase client usage in components:

```bash
# Search for Supabase imports and replace:
grep -r "from '@/integrations/supabase" src/
```

## 🚀 How to Run

1. **Ensure MySQL is running:**
   ```bash
   brew services start mysql
   ```

2. **Verify database setup:**
   ```bash
   mysql -u root jobflow_photosync -e "SHOW TABLES;"
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## 🔧 Environment Configuration

The `.env.local` file contains:
```env
VITE_DB_HOST=localhost
VITE_DB_PORT=3306
VITE_DB_USER=root
VITE_DB_PASSWORD=
VITE_DB_NAME=jobflow_photosync
VITE_JWT_SECRET=your-super-secret-jwt-key-change-in-production
VITE_APP_URL=http://localhost:5173
```

## 📊 Database Schema

The MySQL database includes:
- **Core Tables**: profiles, clients, companies, orders, products
- **Relationships**: Proper foreign keys and indexes
- **Business Logic**: Order products, invoices, payments
- **Team Management**: Company teams and members
- **Settings**: App settings, integrations, tax settings

## 🔐 Authentication Flow

1. **Registration**: User creates account with email/password
2. **Login**: JWT token generated and stored in localStorage
3. **Session**: Token validated on each request
4. **Logout**: Token removed from localStorage

## 📝 API Changes

### Old Supabase Pattern:
```typescript
const { data, error } = await supabase
  .from('clients')
  .select('*')
  .eq('id', clientId);
```

### New MySQL Pattern:
```typescript
const client = await db.queryOne(
  'SELECT * FROM clients WHERE id = ?',
  [clientId]
);
```

## 🧪 Testing

After migration, test these key features:
1. User registration and login
2. Client management
3. Order creation and management
4. Settings configuration
5. Data persistence

## 🔍 Troubleshooting

### Common Issues:

1. **MySQL Connection Errors**:
   - Ensure MySQL service is running
   - Check connection credentials in `.env.local`

2. **Authentication Issues**:
   - Clear localStorage: `localStorage.clear()`
   - Check JWT secret configuration

3. **Database Errors**:
   - Verify migration completed successfully
   - Check table structure matches types

### Debugging Commands:
```bash
# Check MySQL status
brew services list | grep mysql

# Connect to database
mysql -u root jobflow_photosync

# View tables
SHOW TABLES;

# Check specific table
DESCRIBE profiles;
```

## 📚 Next Steps

1. Complete React Query hooks migration
2. Update all components to use MySQL
3. Implement real-time features (if needed)
4. Add proper error handling
5. Set up production deployment configuration
6. Add comprehensive testing