# LostFound Guard - High Level Design (HLD) Document

## 1. System Overview

**LostFound Guard** is a distributed, scalable, cloud-based platform designed to facilitate the recovery of lost items through NFC, QR codes, and numerical identification combined with an intelligent courier logistics network.

### 1.1 System Objectives
- Enable quick discovery and notification when items are lost
- Facilitate direct communication between finders and owners
- Provide integrated courier service for long-distance item recovery
- Process secure payments between stakeholders
- Maintain data integrity and user privacy

### 1.2 System Scope
- **In Scope**: Web app, mobile app, backend APIs, payment processing, courier integration
- **Out of Scope**: Physical product manufacturing, courier service operation, insurance

---

## 2. Architecture Overview

### 2.1 Multi-Tier Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                      │
│  ┌────────────────────┐  ┌────────────────────────────────┐│
│  │   Web Frontend     │  │     Mobile Frontend (iOS/AND)  ││
│  │  Next.js + React   │  │  React Native / Flutter        ││
│  │  - Dashboard       │  │  - QR Scanner                  ││
│  │  - Admin Panel     │  │  - NFC Tap                     ││
│  │  - Payments UI     │  │  - Real-time Chat              ││
│  └────────────────────┘  └────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              ↓ (REST/WebSocket)
┌─────────────────────────────────────────────────────────────┐
│                   API GATEWAY & LOAD BALANCER               │
│        (AWS API Gateway / Nginx with SSL/TLS)               │
│  - Rate limiting, Request validation, Logging               │
│  - Authentication routing, CORS handling                    │
└─────────────────────────────────────────────────────────────┘
                              ↓ (REST/gRPC)
┌─────────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC LAYER                     │
│  ┌──────────────────┐  ┌──────────────────────────────┐   │
│  │ Auth Service     │  │ Product Service              │   │
│  │ - JWT handling   │  │ - Registration               │   │
│  │ - Refresh tokens │  │ - QR/NFC generation          │   │
│  │ - OAuth flows    │  │ - Status tracking            │   │
│  │ - MFA            │  │ - Unique code generation     │   │
│  └──────────────────┘  └──────────────────────────────┘   │
│  ┌──────────────────┐  ┌──────────────────────────────┐   │
│  │ Recovery Service │  │ Messaging Service            │   │
│  │ - Discovery log  │  │ - WebSocket connections      │   │
│  │ - Status updates │  │ - Message persistence        │   │
│  │ - Notifications  │  │ - Real-time delivery         │   │
│  │ - Event handling │  │ - Typing indicators          │   │
│  └──────────────────┘  └──────────────────────────────┘   │
│  ┌──────────────────┐  ┌──────────────────────────────┐   │
│  │ Payment Service  │  │ Courier Service              │   │
│  │ - Payment init   │  │ - Partner integration        │   │
│  │ - Webhook verify │  │ - Shipment creation          │   │
│  │ - Settlement     │  │ - Tracking aggregation       │   │
│  │ - Refunds        │  │ - Cost calculation           │   │
│  └──────────────────┘  └──────────────────────────────┘   │
│  ┌──────────────────┐  ┌──────────────────────────────┐   │
│  │ User Service     │  │ Notification Service         │   │
│  │ - Profile mgmt   │  │ - Push notifications         │   │
│  │ - Preferences    │  │ - Email dispatch             │   │
│  │ - Verification   │  │ - SMS delivery               │   │
│  │ - Analytics      │  │ - Notification queue         │   │
│  └──────────────────┘  └──────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓ (SQL/Cache protocols)
┌─────────────────────────────────────────────────────────────┐
│                      DATA ACCESS LAYER                      │
│  ┌──────────────────┐  ┌──────────────────────────────┐   │
│  │ User Repository  │  │ Product Repository           │   │
│  │ - CRUD ops       │  │ - Query optimization         │   │
│  │ - Indexing       │  │ - Full-text search           │   │
│  │ - Caching        │  │ - Geospatial queries         │   │
│  └──────────────────┘  └──────────────────────────────┘   │
│  ┌──────────────────┐  ┌──────────────────────────────┐   │
│  │ Recovery Repo    │  │ Payment Repository           │   │
│  │ - Event logs     │  │ - Transaction tracking       │   │
│  │ - Status queries │  │ - Invoice generation         │   │
│  │ - Geolocation    │  │ - Audit trail                │   │
│  └──────────────────┘  └──────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    DATA PERSISTENCE LAYER                   │
│  ┌──────────────────┐  ┌──────────────────────────────┐   │
│  │ PostgreSQL DB    │  │ Redis Cache                  │   │
│  │ - Primary store  │  │ - Session store              │   │
│  │ - Transactions   │  │ - Rate limiting              │   │
│  │ - ACID ops       │  │ - Real-time subscriptions    │   │
│  │ - Backups        │  │ - Message queue              │   │
│  └──────────────────┘  └──────────────────────────────┘   │
│  ┌──────────────────┐  ┌──────────────────────────────┐   │
│  │ AWS S3 Storage   │  │ Elasticsearch (Optional)     │   │
│  │ - File uploads   │  │ - Search indexing            │   │
│  │ - QR images      │  │ - Analytics queries          │   │
│  │ - Backups        │  │ - Log aggregation            │   │
│  │ - CDN delivery   │  │ - Performance tracking       │   │
│  └──────────────────┘  └──────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Component Design

### 3.1 Frontend Layer Components

#### Web Application (Next.js)
```
next-app/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── products/
│   │   ├── recoveries/
│   │   ├── messages/
│   │   └── payments/
│   ├── (public)/
│   │   ├── found/[productId]/
│   │   ├── profile/[userId]/
│   │   └── about/
│   └── api/ (API routes)
├── components/
│   ├── Auth/
│   ├── Product/
│   ├── Recovery/
│   ├── Chat/
│   └── Payment/
├── lib/
│   ├── api-client/
│   ├── socket-client/
│   └── utils/
└── styles/
    └── globals.css (Tailwind)
```

#### Mobile Application (React Native)
```
mobile-app/
├── screens/
│   ├── Auth/ (Login, Register)
│   ├── Home/ (Dashboard, Products)
│   ├── Scanner/ (QR + NFC)
│   ├── Chat/ (Messaging)
│   └── Account/ (Profile)
├── components/
│   ├── QRScanner/
│   ├── NFCReader/
│   └── LocationShare/
├── services/
│   ├── api-service/
│   ├── socket-service/
│   └── camera-service/
└── store/ (Redux/Zustand)
    └── reducers/
```

### 3.2 Backend Layer Components

#### API Server (NestJS/Express)
```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── jwt.strategy.ts
│   │   │   └── auth.guard.ts
│   │   ├── products/
│   │   │   ├── products.controller.ts
│   │   │   ├── products.service.ts
│   │   │   ├── qr-generator.service.ts
│   │   │   └── nfc-handler.service.ts
│   │   ├── recovery/
│   │   │   ├── recovery.controller.ts
│   │   │   ├── recovery.service.ts
│   │   │   └── recovery.gateway.ts (WebSocket)
│   │   ├── messaging/
│   │   │   ├── messaging.gateway.ts
│   │   │   ├── messaging.service.ts
│   │   │   └── message.entity.ts
│   │   ├── payments/
│   │   │   ├── payments.controller.ts
│   │   │   ├── payments.service.ts
│   │   │   ├── stripe.provider.ts
│   │   │   └── webhook.handler.ts
│   │   ├── courier/
│   │   │   ├── courier.controller.ts
│   │   │   ├── courier.service.ts
│   │   │   └── courier-adapters/ (DHL, FedEx, etc.)
│   │   └── users/
│   │       ├── users.controller.ts
│   │       ├── users.service.ts
│   │       └── user.entity.ts
│   ├── common/
│   │   ├── filters/ (Exception handling)
│   │   ├── pipes/ (Validation)
│   │   ├── interceptors/ (Logging, Transform)
│   │   └── decorators/ (Custom)
│   ├── database/
│   │   ├── migrations/
│   │   ├── seeders/
│   │   └── entities/
│   ├── config/
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── payment.config.ts
│   └── main.ts
├── test/
└── docker/
```

### 3.3 Data Access Layer

#### Entities/Models
```
User
├─ id: UUID
├─ email: string (unique)
├─ phone: string
├─ password: hashed
├─ profile: JSON
├─ role: OWNER | FINDER | COURIER
├─ isVerified: boolean
├─ preferences: JSON
└─ timestamps

Product
├─ id: UUID
├─ ownerId: UUID (FK)
├─ type: CARD | STICKER
├─ itemDetails: JSON
├─ uniqueCode: string (unique)
├─ qrCodeImage: URL
├─ nfcChipId: string
├─ status: ACTIVE | LOST | RECOVERED | INACTIVE
└─ timestamps

Recovery
├─ id: UUID
├─ productId: UUID (FK)
├─ finderId: UUID (FK)
├─ ownerId: UUID (FK)
├─ foundLocation: GeoPoint
├─ recoveryType: DIRECT | COURIER
├─ status: PENDING | IN_PROGRESS | COMPLETED
└─ timestamps

Message
├─ id: UUID
├─ recoveryId: UUID (FK)
├─ senderId: UUID (FK)
├─ content: string
├─ type: TEXT | LOCATION | IMAGE
└─ timestamps

Shipment
├─ id: UUID
├─ recoveryId: UUID (FK)
├─ courierId: UUID (FK)
├─ trackingNumber: string
├─ status: PENDING | PICKED | SHIPPED | DELIVERED
└─ timestamps

Payment
├─ id: UUID
├─ recoveryId: UUID (FK)
├─ fromUser: UUID (FK)
├─ toUser: UUID (FK)
├─ amount: decimal
├─ status: PENDING | SUCCESS | FAILED
└─ timestamps
```

---

## 4. Data Flow Diagrams

### 4.1 Product Registration Flow

```
START: User logs in
  ↓
User fills registration form
  ↓
SELECT Product Type (Card or Sticker)
  ↓
IF Card:
  ├─ Generate NFC payload
  ├─ Generate QR code
  └─ Generate 8-digit code
    ↓
IF Sticker:
  └─ Generate QR code only
    ↓
Store product in Database
  ├─ PostgreSQL: Product record
  ├─ S3: QR image
  └─ Memory: Product ID
    ↓
Encode data to physical medium (Manufacturing)
  ├─ NFC card encoding (offline)
  ├─ Print QR code
  └─ Print 8-digit number
    ↓
Activate product (link physical to digital)
  ├─ Scan QR or tap NFC
  ├─ Confirm activation
  └─ Status: ACTIVE
    ↓
User receives product
  ├─ Email with instructions
  ├─ Push notification
  └─ Dashboard update
    ↓
END: Product ready for use
```

### 4.2 Discovery Flow (Item Found)

```
START: Finder discovers lost item
  ↓
CHOOSE Discovery Method:
  │
  ├─ Method 1: Tap NFC card with smartphone
  │   ├─ NFC API triggers
  │   ├─ Extract product ID from NFC payload
  │   └─ Jump to "Fetch Owner Details"
  │
  ├─ Method 2: Scan QR code with phone camera
  │   ├─ Open camera/QR app
  │   ├─ Extract product ID from QR data
  │   └─ Jump to "Fetch Owner Details"
  │
  └─ Method 3: Manual entry of 8-digit code
      ├─ Open app
      ├─ Navigate to "Enter Code"
      ├─ Input 8-digit number
      └─ Jump to "Fetch Owner Details"
        ↓
Fetch Owner Details
  ├─ Query product database
  ├─ Fetch owner profile
  ├─ Extract owner location (for show)
  └─ Check if owner notification enabled
        ↓
Send Notifications to Owner
  ├─ Push notification: "Your [item] was found!"
  ├─ Email notification
  ├─ SMS notification (if opted)
  └─ Create in-app notification
        ↓
Create Recovery Record
  ├─ Recovery ID generated
  ├─ Finder ID recorded
  ├─ Found location (GPS)
  ├─ Timestamp
  └─ Status: PENDING
        ↓
Display Finder Interface
  ├─ Show: "Item found! Tell the owner"
  ├─ Show owner's public profile
  ├─ Show message input
  ├─ Show location sharing option
  └─ Show courier option button
        ↓
Finder Sends Message
  ├─ "I found your [item] at [location]"
  ├─ Message stored in DB
  ├─ Owner gets notification
  └─ Owner sees message in app
        ↓
END: Recovery process initiated
```

### 4.3 Courier Service Flow

```
START: Finder decides to courier item
  ↓
SELECT: Courier service partner
  ├─ Auto-select nearest courier
  ├─ Show available courier options
  └─ Finder selects one
        ↓
Finder Provides Courier Details
  ├─ Item condition
  ├─ Item weight/dimensions
  ├─ Receiver's city
  └─ Estimated cost calculated
        ↓
Create Shipment Record
  ├─ Shipment ID generated
  ├─ Recovery linked to shipment
  ├─ Courier assignment
  ├─ Cost calculated from courier API
  └─ Status: PENDING_PICKUP
        ↓
Notify Owner
  ├─ "Your item can be couriered"
  ├─ Show cost breakdown:
  │   ├─ Courier fee: X
  │   ├─ Service fee: Y
  │   └─ Total: Z
  ├─ Owner accepts/declines
  └─ If accepts → Create payment intent
        ↓
Payment Processing
  ├─ Owner selects payment method
  ├─ Stripe/Razorpay payment form
  ├─ Process payment
  ├─ On success: Payment record created
  ├─ Notify finder: "Payment received!"
  └─ Generate shipment on courier API
        ↓
Courier Integration
  ├─ Call courier API
  ├─ Create shipment with:
  │   ├─ Pickup address (finder)
  │   ├─ Delivery address (owner)
  │   ├─ Item description
  │   └─ Weight/dimensions
  ├─ Receive tracking number
  └─ Store in database
        ↓
Update Status
  ├─ Recovery status: IN_PROGRESS
  ├─ Shipment status: CONFIRMED
  ├─ Notify all parties
  └─ Send tracking link
        ↓
Tracking Updates
  ├─ Courier webhook sends updates:
  │   ├─ Item picked up
  │   ├─ Item in transit
  │   └─ Item delivered
  ├─ Update shipment status
  ├─ Notify owner & finder
  └─ Update tracking page
        ↓
Delivery Confirmation
  ├─ Owner receives item
  ├─ Owner confirms delivery in app
  ├─ Recovery status: COMPLETED
  └─ Finder payment initiated
        ↓
Settlement
  ├─ Calculate finder reward:
  │   ├─ Courier fee minus service fee
  │   └─ Add optional owner reward
  ├─ Transfer to finder wallet
  ├─ Settlement notification sent
  └─ Invoice generated
        ↓
END: Recovery completed successfully
```

### 4.4 Real-time Messaging Flow

```
START: Recovery conversation initiated
  ↓
Client A initiates WebSocket connection
  ├─ Socket.io client connects
  ├─ Authentication with JWT
  ├─ Subscribe to recovery room
  └─ Send "joined" event
        ↓
Backend receives connection
  ├─ Validate token
  ├─ Check recovery permissions
  ├─ Load message history
  ├─ Emit history to client
  └─ Mark as CONNECTED
        ↓
Client A sends message
  ├─ "I found your bag at the hotel"
  ├─ Message with metadata:
  │   ├─ sender ID
  │   ├─ recovery ID
  │   ├─ timestamp
  │   ├─ location (optional)
  │   └─ image (optional)
  └─ Emit to backend via WebSocket
        ↓
Backend processes message
  ├─ Validate message
  ├─ Store in database (Messages table)
  ├─ Mark status: DELIVERED
  ├─ Emit to other clients in room
  ├─ Send push notification to recipient
  └─ Update last_message_at
        ↓
Client B receives message
  ├─ WebSocket emits new message event
  ├─ UI updates with message
  ├─ Show typing indicator cleared
  ├─ Play notification sound
  └─ Update conversation timestamp
        ↓
Client B sees typing indicator
  ├─ A types response message
  ├─ Client emits "typing" event
  ├─ Backend broadcasts typing event
  ├─ Client B shows "User typing..."
  └─ After 3s of no input → hide indicator
        ↓
Client B sends response message
  ├─ Same flow as Client A
  └─ Message stored and delivered
        ↓
Message acknowledgment
  ├─ Recipient client emits "message_read"
  ├─ Backend updates Message.read_at
  ├─ Both clients show read status
  └─ Update recovery conversation
        ↓
REPEAT: Until recovery is completed
  ↓
END: Conversation history saved
```

---

## 5. API Gateway Design

### 5.1 Request Flow Through API Gateway

```
Client Request
      ↓
┌─────────────────────────────┐
│ AWS API Gateway / Nginx     │
├─────────────────────────────┤
│ 1. HTTPS/TLS validation     │
│ 2. Request logging          │
│ 3. API key validation       │
│ 4. Rate limiting check      │
│ 5. CORS validation          │
│ 6. Request transformation   │
│ 7. Authentication check     │
└─────────────────────────────┘
      ↓
  Route to appropriate backend service
      ↓
┌─────────────────────────────┐
│ Load Balancer (ALB)         │
├─────────────────────────────┤
│ 1. Health check             │
│ 2. Connection pooling       │
│ 3. Sticky sessions          │
│ 4. SSL termination          │
└─────────────────────────────┘
      ↓
  Distribute to backend instances
      ↓
Backend Service Processing
      ↓
Response sent back through gateway
      ↓
┌─────────────────────────────┐
│ Response Processing         │
├─────────────────────────────┤
│ 1. Compression (gzip)       │
│ 2. Caching headers          │
│ 3. Security headers         │
│ 4. Response logging         │
└─────────────────────────────┘
      ↓
Response to Client
```

### 5.2 Rate Limiting Strategy

```
Endpoint: /api/products/by-code/:code

Rate Limits (per user):
├─ Authenticated user: 100 requests/minute
├─ Anonymous user: 10 requests/minute
└─ API key holder: 1000 requests/minute

Rate Limit Headers:
├─ X-RateLimit-Limit: 100
├─ X-RateLimit-Remaining: 95
├─ X-RateLimit-Reset: 1702000000
└─ Retry-After: 60

Storage: Redis
├─ Key: ratelimit:user:{userId}:{endpoint}
├─ Value: request_count
└─ TTL: 60 seconds

Throttling Algorithm: Token Bucket
├─ Initial tokens: Rate limit per minute
├─ Add tokens: 1 per second
├─ Request cost: 1 token
└─ Reject if: tokens < 1
```

---

## 6. Security Architecture

### 6.1 Authentication Flow

```
User Login Flow:
  ↓
POST /auth/login
├─ Email & password
├─ Validate credentials
├─ Generate JWT tokens:
│   ├─ Access token (15 min expiry)
│   ├─ Refresh token (7 days expiry)
│   └─ ID token (with user claims)
├─ Store refresh token in Redis
├─ Return tokens in response
└─ Set HTTPOnly cookie with refresh token
  ↓
Access protected resource:
  ├─ Send request with Authorization header
  ├─ Include: Bearer {accessToken}
  ├─ API validates JWT signature
  ├─ Extract user claims
  ├─ Verify token expiry
  └─ Grant access if valid
  ↓
Token expiry handling:
  ├─ If access token expires:
  │   ├─ Return 401 Unauthorized
  │   ├─ Client receives error
  │   └─ Client calls /auth/refresh-token
  │
  ├─ POST /auth/refresh-token
  │   ├─ Send refresh token
  │   ├─ Validate refresh token
  │   ├─ Generate new access token
  │   └─ Return new token
  │
  └─ Retry original request with new token
```

### 6.2 Data Encryption Strategy

```
At Rest:
├─ Database encryption (AWS RDS encryption)
├─ S3 bucket encryption (AES-256)
├─ Sensitive fields encrypted:
│   ├─ payment_methods (PCI compliance)
│   ├─ phone numbers (masked)
│   ├─ addresses (optional)
│   └─ sensitive user data
│
In Transit:
├─ TLS 1.3 for all communications
├─ HTTPS enforcement (HSTS)
├─ Certificate pinning (mobile apps)
├─ Signed API requests
│
In Memory:
├─ Secrets in environment variables
├─ Credentials in AWS Secrets Manager
├─ Payment tokens in Stripe Vault
└─ No logging of sensitive data
```

### 6.3 API Security

```
Request Validation:
├─ Schema validation (Zod/Joi)
├─ Input sanitization
├─ SQL injection prevention (parameterized queries)
├─ XSS prevention (Content Security Policy)
└─ CSRF protection (SameSite cookies)

Response Security:
├─ Security headers:
│   ├─ X-Frame-Options: DENY
│   ├─ X-Content-Type-Options: nosniff
│   ├─ Strict-Transport-Security: max-age=31536000
│   └─ Content-Security-Policy: ...
├─ PII redaction in logs
├─ Error message sanitization
└─ Sensitive data removal from responses
```

---

## 7. Scalability Considerations

### 7.1 Horizontal Scaling

```
Load Distribution:
├─ Multiple backend instances (Auto-scaling group)
├─ Stateless services (easy to scale)
├─ Sticky sessions via Redis
├─ Database connection pooling
└─ CDN for static assets

Auto-scaling Rules:
├─ Trigger 1: CPU > 70% → Add instance
├─ Trigger 2: Memory > 75% → Add instance
├─ Trigger 3: CPU < 30% → Remove instance
├─ Min instances: 2
├─ Max instances: 10
└─ Scale-down cooldown: 5 minutes
```

### 7.2 Database Optimization

```
Indexing Strategy:
├─ Primary key: id (automatic)
├─ Composite indexes:
│   ├─ (owner_id, status)
│   ├─ (finder_id, created_at)
│   ├─ (product_id, recovery_status)
│   └─ (user_id, created_at)
├─ Full-text search on product descriptions
└─ Geospatial index on found_location (PostGIS)

Query Optimization:
├─ Connection pooling (PgBouncer)
├─ Query caching (Redis)
├─ Lazy loading for related entities
├─ Pagination: 20 items per page
└─ Batch operations where possible

Partitioning Strategy:
├─ Partition Recoveries by year
├─ Partition Messages by recovery_id
├─ Archive old records to cold storage
└─ Keep hot data in SSD
```

### 7.3 Caching Strategy

```
Cache Layers:
├─ Application-level (Redis):
│   ├─ Product details: 1 hour TTL
│   ├─ User profiles: 2 hours TTL
│   ├─ Recovery status: 30 minutes TTL
│   └─ Geolocation results: 1 day TTL
│
├─ CDN-level (CloudFront):
│   ├─ Static assets: 30 days
│   ├─ API responses (public): 5 minutes
│   └─ QR images: 7 days
│
└─ Browser-level:
    ├─ Static JS/CSS: 30 days
    ├─ User data: No cache (private)
    └─ API responses: Vary based on endpoint

Cache Invalidation:
├─ TTL-based (automatic expiry)
├─ Event-based (on data change):
│   ├─ Product updated → Invalidate product cache
│   ├─ Recovery status changed → Invalidate recovery cache
│   └─ User profile updated → Invalidate user cache
└─ Manual invalidation (admin panel)
```

---

## 8. Monitoring & Observability

### 8.1 Metrics to Track

```
Application Metrics:
├─ Request count (by endpoint)
├─ Response time (p50, p95, p99)
├─ Error rate (5xx, 4xx)
├─ Database query time
├─ Cache hit/miss ratio
├─ WebSocket connections (active)
├─ Message throughput
└─ Payment success rate

Business Metrics:
├─ New user registrations
├─ Products registered (daily)
├─ Items found & reported (daily)
├─ Recovery success rate
├─ Courier shipments processed
├─ Total payment volume
├─ User retention rate
└─ Average resolution time

Infrastructure Metrics:
├─ CPU utilization
├─ Memory usage
├─ Disk I/O
├─ Network throughput
├─ Database connections
├─ Redis memory usage
└─ S3 storage usage
```

### 8.2 Alerting Rules

```
Alert: High Error Rate
├─ Condition: Error rate > 5% for 5 minutes
├─ Severity: CRITICAL
├─ Notify: On-call engineer + Slack

Alert: Database Connection Pool Exhausted
├─ Condition: Available connections < 10%
├─ Severity: HIGH
├─ Notify: Database team

Alert: Redis Memory Usage High
├─ Condition: Memory > 80% for 10 minutes
├─ Severity: WARNING
├─ Notify: Ops team

Alert: Payment Service Failure
├─ Condition: Stripe API errors > 10
├─ Severity: CRITICAL
├─ Notify: Payment team + CTO
```

### 8.3 Logging Strategy

```
Log Levels:
├─ ERROR: System errors, exceptions
├─ WARN: Degraded performance, retries
├─ INFO: User actions, state changes
├─ DEBUG: Detailed execution flow
└─ TRACE: Very detailed debugging

Log Structure (JSON):
{
  "timestamp": "2024-12-16T10:30:00Z",
  "level": "INFO",
  "service": "payment-service",
  "user_id": "user-123",
  "recovery_id": "rec-456",
  "action": "payment_processed",
  "amount": 500,
  "status": "SUCCESS",
  "duration_ms": 245,
  "trace_id": "trace-789"
}

Log Destinations:
├─ CloudWatch Logs (AWS)
├─ Elasticsearch (for analysis)
├─ S3 (long-term archival)
└─ DataDog (aggregation + alerts)

Log Retention:
├─ Hot logs: 30 days
├─ Warm logs: 90 days
├─ Cold logs: 1 year (S3)
└─ Audit logs: 3 years (compliance)
```

---

## 9. Deployment Architecture

### 9.1 Infrastructure as Code

```
Terraform/CloudFormation Structure:
├─ VPC & Networking
│   ├─ Public subnets (ALB)
│   ├─ Private subnets (Backend)
│   ├─ Database subnet group
│   └─ NAT gateways
│
├─ Compute
│   ├─ Auto Scaling Group (Backend)
│   ├─ EC2 instances (t3.large)
│   ├─ Security groups (inbound/outbound rules)
│   └─ IAM roles & policies
│
├─ Database
│   ├─ RDS PostgreSQL (Multi-AZ)
│   ├─ ElastiCache Redis
│   ├─ Database backups
│   └─ Parameter groups
│
├─ Storage
│   ├─ S3 buckets (versioning enabled)
│   ├─ CloudFront distribution
│   ├─ Lifecycle policies
│   └─ CORS configuration
│
├─ Network
│   ├─ Application Load Balancer
│   ├─ Target groups
│   ├─ SSL certificates
│   └─ DNS records
│
└─ Monitoring
    ├─ CloudWatch dashboards
    ├─ SNS topics for alerts
    ├─ CloudTrail logging
    └─ VPC Flow Logs
```

### 9.2 Deployment Pipeline

```
Git Push to main branch
     ↓
GitHub Actions workflow triggered
     ↓
├─ Step 1: Run tests
│   ├─ Unit tests (Jest)
│   ├─ Integration tests
│   └─ E2E tests
│        ↓ [FAIL → Notify & Stop]
│
├─ Step 2: Security scan
│   ├─ SAST (Snyk/SonarQube)
│   ├─ Dependency check
│   └─ OWASP scanning
│        ↓ [FAIL → Notify & Stop]
│
├─ Step 3: Build Docker image
│   ├─ Build backend image
│   ├─ Build frontend image
│   └─ Tag with commit SHA
│        ↓ [FAIL → Notify & Stop]
│
├─ Step 4: Push to ECR
│   ├─ AWS ECR authentication
│   ├─ Push backend image
│   └─ Push frontend image
│        ↓ [FAIL → Notify & Stop]
│
├─ Step 5: Deploy to staging
│   ├─ Update ECS task definition
│   ├─ Deploy new tasks
│   ├─ Wait for health checks
│   └─ Smoke tests
│        ↓ [FAIL → Rollback]
│
├─ Step 6: Run E2E tests on staging
│   ├─ User flows
│   ├─ Payment processing
│   └─ API endpoints
│        ↓ [FAIL → Notify & Stop]
│
└─ Step 7: Manual approval
    ├─ Review staging deployment
    ├─ Approve for production
    └─ Step 8: Deploy to production
        ├─ Blue-Green deployment
        ├─ Health check (5 min)
        ├─ Route traffic gradually
        └─ Full deployment
             ↓
        ├─ Production smoke tests
        ├─ Monitoring verification
        └─ Notify team: Deployment Success
```

---

## 10. Disaster Recovery & Business Continuity

### 10.1 Backup Strategy

```
Database Backups:
├─ Daily automated snapshots
├─ Retained for 30 days
├─ Multi-region replication
└─ Test restore monthly

Application Backups:
├─ Docker images tagged with version
├─ Infrastructure as Code versioned
├─ Configuration stored in AWS Secrets Manager
└─ Git history for code rollback

Data Backups:
├─ S3 bucket replication (cross-region)
├─ Versioning enabled
├─ Lifecycle policies (archive after 90 days)
└─ Compliance-level encryption
```

### 10.2 Recovery Procedures

```
Scenario 1: Database Failure
├─ Detect: CloudWatch alert
├─ Action 1: Promote read replica
├─ Action 2: Update connection strings
├─ Action 3: Verify application connectivity
├─ RTO: 5 minutes
└─ RPO: 1 minute (automated snapshots)

Scenario 2: Application Server Failure
├─ Detect: Health check failure
├─ Action 1: Auto Scaling Group replaces instance
├─ Action 2: Load Balancer routes traffic away
├─ RTO: <1 minute (automatic)
└─ RPO: N/A (stateless)

Scenario 3: Entire Region Failure
├─ Detect: Multiple infrastructure failures
├─ Action 1: Failover to secondary region
├─ Action 2: Update DNS records
├─ Action 3: Restore from backups
├─ RTO: 30 minutes
└─ RPO: 15 minutes

Scenario 4: Data Corruption
├─ Detect: Data integrity checks
├─ Action 1: Isolate affected data
├─ Action 2: Restore from point-in-time backup
├─ Action 3: Verify data integrity
├─ RTO: 1 hour
└─ RPO: Depends on backup frequency
```

---

## 11. Performance Benchmarks

### 11.1 API Response Times

```
GET /products/:id
├─ P50: 50ms
├─ P95: 150ms
└─ P99: 500ms

POST /discoveries
├─ P50: 200ms
├─ P95: 500ms
└─ P99: 1500ms

GET /recoveries
├─ P50: 300ms
├─ P95: 800ms
└─ P99: 2000ms (paginated)

POST /payments
├─ P50: 1000ms
├─ P95: 2000ms
└─ P99: 5000ms (includes Stripe API call)
```

### 11.2 Concurrent User Capacity

```
Web Application:
├─ 1000 concurrent users
├─ Average response time: 200ms
├─ Error rate: < 0.1%
└─ Throughput: 500 requests/sec

Real-time Chat:
├─ 500 active WebSocket connections
├─ Message latency: < 500ms
├─ Max 100 messages/sec
└─ Server memory: ~2GB

Database:
├─ 1000 concurrent connections
├─ Query time (average): 50ms
├─ Transactions/sec: 1000
└─ Connection pool size: 100
```

---

## 12. Compliance & Legal

### 12.1 Data Privacy Compliance

```
GDPR (Europe):
├─ User data export functionality
├─ Right to deletion (data erasure)
├─ Privacy by design
├─ Data breach notification (within 72 hours)
└─ DPA signed with AWS

India (Data Protection):
├─ Data residency in India
├─ PII classification & handling
├─ Encryption standards
└─ Audit trails maintained

Payment Card Industry (PCI-DSS):
├─ Stripe handles payment data
├─ Never store full card details
├─ Tokenized payments
├─ Quarterly security scans
└─ Annual compliance audit
```

### 12.2 Terms & Policies

```
Required Documents:
├─ Terms of Service
├─ Privacy Policy
├─ Acceptable Use Policy
├─ Cookie Policy
├─ GDPR Cookie Consent
└─ Data Processing Addendum (DPA)

Liability Disclaimers:
├─ Limitation of liability
├─ Dispute resolution process
├─ Insurance coverage
├─ Indemnification clauses
└─ Governing law
```

---

## 13. Technology Justification

### Why These Technologies?

```
PostgreSQL (Database):
├─ ACID compliance ✓
├─ PostGIS for geolocation ✓
├─ Full-text search ✓
├─ JSON support for flexible data ✓
└─ Enterprise support available ✓

Node.js (Backend Runtime):
├─ JavaScript ecosystem (developers) ✓
├─ Excellent async support ✓
├─ High throughput, low latency ✓
├─ Microservices friendly ✓
└─ Strong community ✓

Next.js (Frontend):
├─ SSR for SEO ✓
├─ TypeScript support ✓
├─ API routes simplify deployment ✓
├─ Performance optimizations built-in ✓
└─ Large ecosystem ✓

React Native (Mobile):
├─ Code sharing between iOS/Android ✓
├─ Near-native performance ✓
├─ Large developer pool ✓
├─ Strong community support ✓
└─ Established ecosystem ✓

AWS (Infrastructure):
├─ Global infrastructure ✓
├─ Managed services reduce ops load ✓
├─ Strong security certifications ✓
├─ Cost-effective scaling ✓
└─ Multi-region support ✓
```

---

## 14. Document Metadata

| Property | Value |
|----------|-------|
| Document Version | 1.0 |
| Created | December 16, 2025 |
| Last Updated | December 16, 2025 |
| Status | Ready for Implementation |
| Author | Architecture Team |
| Approved By | CTO (Pending) |
| Next Review | After MVP completion |

---

**End of HLD Document**

This HLD provides a comprehensive blueprint for building the LostFound Guard platform. All components are designed for scalability, security, and user experience.
