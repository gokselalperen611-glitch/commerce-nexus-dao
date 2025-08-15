# CommerceDAO API Dokümantasyonu

Bu dokümantasyon, CommerceDAO platformunun API endpoints, veri modelleri ve entegrasyon rehberlerini içerir.

## 🚀 API Genel Bakış

CommerceDAO, Supabase backend üzerinde RESTful API ve GraphQL desteği sunar. Tüm API çağrıları JWT token ile kimlik doğrulaması gerektirir.

### Base URL
```
Production: https://fzbppsomvfhjwxzicbli.supabase.co/rest/v1/
Development: http://localhost:54321/rest/v1/
```

### Authentication
```http
Authorization: Bearer <jwt_token>
apikey: <supabase_anon_key>
Content-Type: application/json
```

## 🔐 Authentication Endpoints

### Sign Up
```http
POST /auth/v1/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "data": {
    "display_name": "John Doe"
  }
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### Sign In
```http
POST /auth/v1/token?grant_type=password
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Refresh Token
```http
POST /auth/v1/token?grant_type=refresh_token
Content-Type: application/json

{
  "refresh_token": "refresh_token_here"
}
```

### Sign Out
```http
POST /auth/v1/logout
Authorization: Bearer <jwt_token>
```

## 👤 Profile Management

### Get Profile
```http
GET /profiles?user_id=eq.<user_id>
Authorization: Bearer <jwt_token>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "wallet_address": "0x1234...",
    "display_name": "John Doe",
    "avatar_url": "https://example.com/avatar.jpg",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

### Update Profile
```http
PATCH /profiles?user_id=eq.<user_id>
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "display_name": "Jane Doe",
  "avatar_url": "https://example.com/new-avatar.jpg"
}
```

### Connect Wallet
```http
PATCH /profiles?user_id=eq.<user_id>
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "wallet_address": "0x1234567890abcdef..."
}
```

## 🏪 Store Management

### Get All Stores
```http
GET /stores?select=*
```

**Query Parameters:**
- `category=eq.<category>` - Filter by category
- `verified=eq.true` - Only verified stores
- `order=holders.desc` - Sort by holders descending
- `limit=10` - Limit results
- `offset=0` - Pagination offset

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "TechHub Electronics",
    "description": "Premium electronics store",
    "logo_url": "https://example.com/logo.jpg",
    "owner_id": "uuid",
    "token_name": "TechHub Token",
    "token_symbol": "TECH",
    "membership_fee_tokens": 100,
    "has_premium_membership": true,
    "premium_fee_tokens": 500,
    "premium_features": ["early_access", "exclusive_products"],
    "reward_rate": 0.15,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

### Get Store by ID
```http
GET /stores?id=eq.<store_id>&select=*
```

### Create Store
```http
POST /stores
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "My Store",
  "description": "Store description",
  "token_name": "My Store Token",
  "token_symbol": "MST",
  "membership_fee_tokens": 100,
  "reward_rate": 0.10
}
```

### Update Store
```http
PATCH /stores?id=eq.<store_id>
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "description": "Updated description",
  "reward_rate": 0.20
}
```

### Delete Store
```http
DELETE /stores?id=eq.<store_id>
Authorization: Bearer <jwt_token>
```

## 👥 Store Membership

### Get Store Members
```http
GET /store_memberships?store_id=eq.<store_id>&select=*,profiles(display_name,avatar_url)
Authorization: Bearer <jwt_token>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "store_id": "uuid",
    "membership_type": "premium",
    "token_balance": 1500,
    "is_active": true,
    "joined_at": "2024-01-01T00:00:00Z",
    "profiles": {
      "display_name": "John Doe",
      "avatar_url": "https://example.com/avatar.jpg"
    }
  }
]
```

### Join Store
```http
POST /store_memberships
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "store_id": "uuid",
  "membership_type": "basic"
}
```

### Update Membership
```http
PATCH /store_memberships?user_id=eq.<user_id>&store_id=eq.<store_id>
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "membership_type": "premium",
  "token_balance": 2000
}
```

### Leave Store
```http
PATCH /store_memberships?user_id=eq.<user_id>&store_id=eq.<store_id>
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "is_active": false
}
```

## 🗳️ Governance System

### Get Proposals
```http
GET /governance_proposals?store_id=eq.<store_id>&select=*
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `status=eq.active` - Filter by status
- `proposal_type=eq.feature` - Filter by type
- `order=created_at.desc` - Sort by creation date

**Response:**
```json
[
  {
    "id": "uuid",
    "store_id": "uuid",
    "creator_id": "uuid",
    "title": "Add Mobile App",
    "description": "Develop a mobile application for better user experience",
    "proposal_type": "feature",
    "status": "active",
    "votes_for": 150,
    "votes_against": 25,
    "min_tokens_to_vote": 10,
    "expires_at": "2024-02-01T00:00:00Z",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### Create Proposal
```http
POST /governance_proposals
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "store_id": "uuid",
  "title": "New Feature Proposal",
  "description": "Detailed description of the proposal",
  "proposal_type": "feature",
  "expires_at": "2024-02-01T00:00:00Z",
  "min_tokens_to_vote": 10
}
```

### Vote on Proposal
```http
POST /governance_votes
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "proposal_id": "uuid",
  "vote_type": "for",
  "token_weight": 100
}
```

### Get Vote History
```http
GET /governance_votes?user_id=eq.<user_id>&select=*,governance_proposals(title,store_id)
Authorization: Bearer <jwt_token>
```

## 🛍️ Products & Purchases

### Get Store Products
```http
GET /products?store_id=eq.<store_id>&is_active=eq.true&select=*
```

**Response:**
```json
[
  {
    "id": "uuid",
    "store_id": "uuid",
    "name": "Premium Headphones",
    "description": "High-quality wireless headphones",
    "price": 299.99,
    "stock_quantity": 50,
    "dao_tokens_per_purchase": 30,
    "external_id": "PROD-001",
    "image_url": "https://example.com/product.jpg",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

### Create Product
```http
POST /products
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "store_id": "uuid",
  "name": "New Product",
  "description": "Product description",
  "price": 99.99,
  "stock_quantity": 100,
  "dao_tokens_per_purchase": 10
}
```

### Record Purchase
```http
POST /purchases
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "store_id": "uuid",
  "product_id": "uuid",
  "quantity": 2,
  "total_price": 199.98
}
```

### Get Purchase History
```http
GET /purchases?user_id=eq.<user_id>&select=*,products(name,image_url),stores(name,token_symbol)
Authorization: Bearer <jwt_token>
```

## 💰 Token Distribution

### Get Token Distributions
```http
GET /token_distributions?user_id=eq.<user_id>&select=*,stores(name,token_symbol)
Authorization: Bearer <jwt_token>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "store_id": "uuid",
    "purchase_id": "uuid",
    "tokens_amount": 50,
    "reason": "purchase",
    "created_at": "2024-01-01T00:00:00Z",
    "stores": {
      "name": "TechHub Electronics",
      "token_symbol": "TECH"
    }
  }
]
```

### Manual Token Distribution (Store Owner)
```http
POST /token_distributions
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "user_id": "uuid",
  "store_id": "uuid",
  "tokens_amount": 100,
  "reason": "bonus_reward"
}
```

## 📊 Analytics & Statistics

### Store Statistics
```http
GET /rpc/get_store_stats
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "store_id": "uuid"
}
```

**Response:**
```json
{
  "total_members": 1250,
  "active_members": 980,
  "total_proposals": 45,
  "active_proposals": 3,
  "total_votes": 2340,
  "total_tokens_distributed": 125000,
  "monthly_revenue": 45000,
  "governance_participation_rate": 0.78
}
```

### User Portfolio
```http
GET /rpc/get_user_portfolio
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "user_id": "uuid"
}
```

**Response:**
```json
{
  "total_stores": 5,
  "total_tokens": 2500,
  "total_value_usd": 1250.00,
  "monthly_rewards": 125.50,
  "governance_power": 0.05,
  "stores": [
    {
      "store_id": "uuid",
      "store_name": "TechHub Electronics",
      "token_symbol": "TECH",
      "token_balance": 500,
      "membership_type": "premium",
      "value_usd": 250.00
    }
  ]
}
```

## 🔄 Real-time Subscriptions

### Subscribe to Store Updates
```javascript
const subscription = supabase
  .channel('store-updates')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'stores',
      filter: 'id=eq.uuid'
    },
    (payload) => {
      console.log('Store updated:', payload);
    }
  )
  .subscribe();
```

### Subscribe to Proposal Votes
```javascript
const subscription = supabase
  .channel('proposal-votes')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'governance_votes',
      filter: 'proposal_id=eq.uuid'
    },
    (payload) => {
      console.log('New vote:', payload);
    }
  )
  .subscribe();
```

### Subscribe to Token Distributions
```javascript
const subscription = supabase
  .channel('token-distributions')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'token_distributions',
      filter: 'user_id=eq.uuid'
    },
    (payload) => {
      console.log('Tokens received:', payload);
    }
  )
  .subscribe();
```

## 🔧 Utility Functions (RPC)

### Get Public Profile
```http
POST /rpc/get_public_profile
Content-Type: application/json

{
  "profile_user_id": "uuid"
}
```

### Calculate Governance Power
```http
POST /rpc/calculate_governance_power
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "user_id": "uuid",
  "store_id": "uuid"
}
```

### Get Store Leaderboard
```http
POST /rpc/get_store_leaderboard
Content-Type: application/json

{
  "store_id": "uuid",
  "limit": 10
}
```

## 📝 Data Models

### User Profile
```typescript
interface Profile {
  id: string;
  user_id: string;
  wallet_address?: string;
  display_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}
```

### Store
```typescript
interface Store {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  owner_id: string;
  token_name: string;
  token_symbol: string;
  membership_fee_tokens?: number;
  has_premium_membership?: boolean;
  premium_fee_tokens?: number;
  premium_features?: string[];
  reward_rate?: number;
  created_at: string;
  updated_at: string;
}
```

### Store Membership
```typescript
interface StoreMembership {
  id: string;
  user_id: string;
  store_id: string;
  membership_type: 'basic' | 'premium';
  token_balance?: number;
  is_active?: boolean;
  joined_at: string;
}
```

### Governance Proposal
```typescript
interface GovernanceProposal {
  id: string;
  store_id: string;
  creator_id: string;
  title: string;
  description: string;
  proposal_type: 'feature' | 'policy' | 'tokenomics' | 'governance';
  status: 'active' | 'passed' | 'rejected' | 'expired';
  votes_for?: number;
  votes_against?: number;
  min_tokens_to_vote?: number;
  expires_at: string;
  created_at: string;
}
```

### Governance Vote
```typescript
interface GovernanceVote {
  id: string;
  proposal_id: string;
  user_id: string;
  vote_type: 'for' | 'against';
  token_weight: number;
  created_at: string;
}
```

## ⚠️ Error Handling

### Error Response Format
```json
{
  "error": {
    "message": "Error description",
    "details": "Detailed error information",
    "hint": "Suggestion for fixing the error",
    "code": "ERROR_CODE"
  }
}
```

### Common Error Codes
- `PGRST116` - Row Level Security violation
- `PGRST202` - Invalid JWT token
- `PGRST301` - Duplicate key violation
- `PGRST204` - No rows found
- `PGRST100` - Parse error

### Rate Limiting
```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{
  "error": {
    "message": "Rate limit exceeded",
    "details": "Maximum 100 requests per minute allowed",
    "retry_after": 60
  }
}
```

## 🔒 Security Best Practices

### API Key Management
- Never expose `service_role` key in client-side code
- Use `anon` key for public operations
- Rotate keys regularly
- Use environment variables

### Row Level Security
- All tables have RLS enabled
- Policies enforce data access rules
- Users can only access their own data
- Store owners have additional permissions

### Input Validation
- Validate all input parameters
- Use parameterized queries
- Sanitize user input
- Implement rate limiting

## 📚 SDK Usage Examples

### JavaScript/TypeScript
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://your-project.supabase.co',
  'your-anon-key'
);

// Get stores
const { data: stores, error } = await supabase
  .from('stores')
  .select('*')
  .eq('verified', true)
  .order('holders', { ascending: false });

// Create proposal
const { data: proposal, error } = await supabase
  .from('governance_proposals')
  .insert({
    store_id: 'uuid',
    title: 'New Feature',
    description: 'Description',
    proposal_type: 'feature',
    expires_at: '2024-02-01T00:00:00Z'
  })
  .select()
  .single();

// Subscribe to changes
const subscription = supabase
  .channel('proposals')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'governance_proposals'
  }, (payload) => {
    console.log('Change received!', payload);
  })
  .subscribe();
```

### Python
```python
from supabase import create_client, Client

supabase: Client = create_client(
    "https://your-project.supabase.co",
    "your-anon-key"
)

# Get stores
response = supabase.table('stores').select('*').eq('verified', True).execute()
stores = response.data

# Create proposal
response = supabase.table('governance_proposals').insert({
    'store_id': 'uuid',
    'title': 'New Feature',
    'description': 'Description',
    'proposal_type': 'feature',
    'expires_at': '2024-02-01T00:00:00Z'
}).execute()
```

## 🚀 Getting Started

1. **Get API Credentials**
   - Sign up for Supabase account
   - Create new project
   - Get project URL and anon key

2. **Install SDK**
   ```bash
   npm install @supabase/supabase-js
   ```

3. **Initialize Client**
   ```typescript
   import { createClient } from '@supabase/supabase-js';
   
   const supabase = createClient(
     process.env.SUPABASE_URL,
     process.env.SUPABASE_ANON_KEY
   );
   ```

4. **Start Building**
   - Authenticate users
   - Fetch store data
   - Implement governance features
   - Handle real-time updates

Bu API dokümantasyonu, CommerceDAO platformu ile entegrasyon için gereken tüm bilgileri içerir. Daha fazla örnek ve detay için GitHub repository'sini inceleyebilirsiniz.