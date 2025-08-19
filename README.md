# MANIC VANITY

A modern e-commerce platform built with React, TypeScript, and Supabase. Features a dark theme with vibrant accent colors and smooth animations.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom dark theme
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe Checkout
- **Deployment**: Netlify
- **Typography**: Google Fonts (Space Grotesk)
- **Icons**: Lucide React

## Features

- 🌙 Dark theme with electric blue, neon purple, and emerald accents
- 🔐 Email/password authentication with Supabase
- 🛒 Shopping cart with local storage and Supabase sync
- 💳 Stripe checkout integration
- 📱 Fully responsive design
- ✨ Smooth animations and micro-interactions
- 🎨 Modern, production-ready UI components
- 📋 Content Command Center with Kanban board, calendar, and ideas management
- 🎯 Marketing workflow tools for content planning and execution

## Backend Setup

### Environment Variables

1. Copy `.env.example` to `.env`
2. Set the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. In the Supabase SQL Editor, run the following files in order:
   - `supabase/schema.sql` - Creates e-commerce tables, indexes, and RLS policies
   - `supabase/seed.sql` - Populates with sample data (24 products across 6 categories)
   - `supabase/content_schema.sql` - Creates content management tables for Command Center
   - `supabase/content_seed.sql` - Populates with sample content pieces and ideas

### Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your publishable key from the Stripe Dashboard
3. Get your secret key and webhook secret from the Stripe Dashboard
4. Set environment variables in Netlify:
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `STRIPE_WEBHOOK_SECRET`: Your webhook endpoint secret
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
5. Configure webhook endpoint in Stripe Dashboard:
   - URL: `https://your-site.netlify.app/.netlify/functions/stripe-webhook`
   - Events: `checkout.session.completed`, `charge.refunded`

### Stripe Webhooks

For local development:
```bash
# Install Stripe CLI and login
stripe login

# Forward webhooks to local function
stripe listen --forward-to localhost:8888/.netlify/functions/stripe-webhook

# Start Netlify dev server
netlify dev
```

For production, set the webhook endpoint URL in your Stripe Dashboard to point to your deployed Netlify function.

### Admin Tools

Development-only admin panel for seeding data and testing:

1. Set environment variables:
   ```env
   VITE_ENABLE_ADMIN=true
   NETLIFY_ADMIN_SECRET=your_secret_key
   ```

2. Access admin panel at `/admin`

3. Available tools:
   - **Reseed Products**: Add more products with random images
   - **Generate Orders**: Create fake orders for testing

**⚠️ Important**: Never enable admin tools in production. Keep `VITE_ENABLE_ADMIN=false` and protect `NETLIFY_ADMIN_SECRET`.

### Netlify Deployment

The project includes a `netlify.toml` configuration file for easy deployment:

1. Connect your repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy automatically on push to main branch

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Auth/           # Authentication forms and dropdowns
│   ├── Cart/           # Shopping cart drawer
│   └── Layout/         # Header, footer, and layout components
├── context/            # React context providers
│   ├── AuthContext.tsx # Authentication state management
│   └── CartContext.tsx # Shopping cart state management
├── data/               # Data access layer
│   └── catalog.ts      # Product and category API functions
├── lib/                # External service configurations
│   ├── supabase.ts     # Supabase client setup
│   └── stripe.ts       # Stripe client setup
├── pages/              # Page components
│   ├── Home.tsx        # Landing page
│   ├── Shop.tsx        # Product catalog
│   └── ProductDetail.tsx # Individual product pages
└── types/              # TypeScript type definitions
    └── database.ts     # Database schema types
```

## Database Schema

The application uses the following main tables with Row Level Security (RLS):

### Core Tables
- `categories`: Product categories with slugs
- `products`: Main catalog with pricing, descriptions, and category relationships
- `product_images`: Multiple images per product with positioning
- `variants`: Size/color/style variations with individual pricing and stock

### User Data
- `carts`: User shopping carts (one per user)
- `cart_items`: Items in shopping carts with quantities
- `orders`: Purchase records with status tracking and Stripe integration
- `order_items`: Line items for completed orders
- `addresses`: User shipping/billing addresses with default selection
- `wishlists`: User wishlists with saved products

### Development
- `dev_emails`: Email log for development (order confirmations, etc.)

### Security Features
- Row Level Security (RLS) enabled on all tables
- User-scoped access policies (users can only access their own data)
- Public read access for product catalog
- Service role access for webhook processing

## Order Flow

1. **Cart Management**: Items stored locally for guests, synced to Supabase for authenticated users
2. **Checkout**: Summary page with tax/shipping calculation
3. **Payment**: Stripe Checkout Session with line items
4. **Webhook Processing**: Order completion, stock updates, cart clearing
5. **Confirmation**: Success page with order details

## Features Implemented

### ✅ Authentication & Authorization
- Email/password sign-up and sign-in
- Protected routes with automatic redirects
- Account dropdown with user management
- Session persistence across browser sessions

### ✅ Product Catalog
- Category-based product organization
- Product detail pages with image galleries
- Variant selection (sizes, colors, styles)
- Stock management and availability tracking

### ✅ Shopping Cart
- Persistent cart across sessions
- Local storage for guests, Supabase sync for users
- Animated slide-out drawer interface
- Quantity management and item removal

### ✅ Checkout & Payments
- Comprehensive checkout flow with order summary
- Tax and shipping calculation
- Stripe Checkout integration
- Order confirmation and cancellation pages

### ✅ Order Management
- Order history and status tracking
- Detailed order views with line items
- Reorder functionality
- Email notifications (development logging)

### ✅ User Profiles
- Account dashboard with quick stats
- Address management (CRUD operations)
- Order history with filtering
- Wishlist functionality (UI ready)

### ✅ Admin Tools
- Development-only admin panel
- Product reseeding with random images
- Demo order generation for testing
- Secure access with environment flags

### ✅ Content Command Center
- Kanban board for content workflow management
- Content calendar with month/week views
- Ideas management with priority system
- Drag-and-drop content organization
- Content piece creation and status tracking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details