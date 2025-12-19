# LostFound Guard - Tech Stack & Architecture Decisions

## Document Overview
This document details the complete technology stack, justifications, and implementation guidelines for the LostFound Guard platform.

---

## 1. Frontend Technology Stack

### 1.1 Web Application: Next.js 14 + React 18

#### Why Next.js?
```
Benefits:
✓ Server-side rendering (SEO optimization)
✓ Static site generation (fast loading)
✓ Built-in API routes (backend endpoints)
✓ Image optimization (automatic)
✓ Font optimization
✓ Code splitting (performance)
✓ Zero-config setup
✓ TypeScript support out-of-the-box
✓ Large community & ecosystem

Features used:
├─ App Router (new routing system)
├─ Server Components (for optimization)
├─ Dynamic imports (code splitting)
├─ Image & Font optimization
├─ Middleware (authentication)
└─ Environmental variables management
```

#### React 18 Specifics
```
Key Features:
├─ Concurrent Rendering (better UX)
├─ Automatic batching (fewer renders)
├─ Suspense for data fetching
├─ Transitions API (loading states)
└─ useTransition hook for pending UI

Component Structure:
├─ Functional components (hooks)
├─ Custom hooks for reusability
├─ Context API for state
├─ Redux Toolkit for complex state
└─ Memoization for performance
```

### 1.2 UI Framework: Tailwind CSS

#### Why Tailwind?
```
Advantages:
✓ Utility-first approach
✓ Small bundle size (with PurgeCSS)
✓ No naming conflicts
✓ Responsive design built-in
✓ Dark mode support
✓ Customizable themes
✓ Great DevX (developer experience)
✓ Active community

Configuration:
├─ Custom color palette
├─ Custom breakpoints
├─ Plugin system
└─ CSS-in-JS with @apply
```

### 1.3 State Management: Redux Toolkit

#### Redux Store Structure
```
store/
├─ slices/
│   ├─ authSlice.ts (user, token, auth status)
│   ├─ productsSlice.ts (products list, single product)
│   ├─ recoveriesSlice.ts (recoveries data)
│   ├─ messagesSlice.ts (conversation history)
│   └─ uiSlice.ts (modals, notifications)
├─ selectors/
│   ├─ authSelectors.ts
│   ├─ productSelectors.ts
│   └─ recoverySelectors.ts
└─ store.ts (configuration)

Key Libraries:
├─ @reduxjs/toolkit (state management)
├─ react-redux (React bindings)
├─ redux-persist (localStorage sync)
└─ @reduxjs/toolkit/query (data fetching)
```

### 1.4 Real-time Communication: Socket.io

#### WebSocket Implementation
```
Socket.io Setup:
├─ Namespace: /recovery (recovery conversations)
├─ Events:
│   ├─ emit: "send_message" → Backend
│   ├─ on: "new_message" ← Backend
│   ├─ emit: "typing" → Backend
│   ├─ on: "user_typing" ← Backend
│   ├─ emit: "recovery_status_change" → Backend
│   └─ on: "status_updated" ← Backend
│
├─ Rooms:
│   ├─ recovery:{recoveryId} (per recovery room)
│   └─ user:{userId} (user-specific events)
│
├─ Connection Management:
│   ├─ Auto-reconnect with exponential backoff
│   ├─ Message queue while disconnected
│   ├─ Clear message queue on reconnect
│   └─ Presence detection (user online/offline)
│
└─ Performance:
    ├─ Binary protocol compression
    ├─ Message batching
    ├─ Connection pooling
    └─ Load balancing across servers
```

### 1.5 HTTP Client: React Query + Axios

#### Data Fetching Strategy
```
React Query Setup:
├─ Query hooks for GET requests:
│   ├─ useGetProduct(productId)
│   ├─ useGetRecoveries()
│   ├─ useGetMessages(recoveryId)
│   └─ useGetUserProfile()
│
├─ Mutation hooks for POST/PUT/DELETE:
│   ├─ useRegisterProduct()
│   ├─ useInitiateRecovery()
│   ├─ useSendMessage()
│   └─ useProcessPayment()
│
├─ Cache Management:
│   ├─ Stale time: 5 minutes
│   ├─ Cache time: 10 minutes
│   ├─ Automatic refetch on window focus
│   └─ Infinity scrolling with useInfiniteQuery
│
├─ Error Handling:
│   ├─ Global error middleware
│   ├─ Retry logic with exponential backoff
│   ├─ User-friendly error messages
│   └─ Error boundary for fallback UI
│
└─ DevTools:
    └─ React Query DevTools for debugging
```

### 1.6 QR Code Scanning: jsQR

#### QR Scanner Implementation
```
Libraries:
├─ jsQR (QR decoding)
├─ html5-qrcode (camera access)
└─ react-qr-code (QR generation)

Features:
├─ Real-time camera feed scanning
├─ Video frame processing
├─ Barcode detection
├─ Mobile camera optimization
├─ Permission handling
└─ Fallback for no-camera scenarios

Implementation:
├─ Start scanner on page load
├─ Process frames for QR codes
├─ On QR detected:
│   ├─ Extract product ID
│   ├─ Validate format
│   └─ Navigate to discovery flow
│
└─ Performance:
    ├─ Throttle frame processing (100ms)
    ├─ Unload scanner on component unmount
    └─ Memory cleanup
```

### 1.7 NFC Handling: Web NFC API

#### NFC Integration
```
Browser Support:
├─ Chrome/Edge (Mobile & Desktop)
├─ Fallback to app-based approach
└─ Feature detection on load

Implementation:
├─ Request NFC read permission
├─ Listen for NFC tag events
├─ Parse NFC payload
├─ Extract product ID
└─ Initiate discovery flow

Code Example:
try {
  const ndef = new NDEFReader();
  await ndef.scan();
  ndef.onreading = event => {
    const decoder = new TextDecoder();
    for (const record of event.message.records) {
      const productId = decoder.decode(record.data);
      // Process discovery
    }
  };
} catch (error) {
  // Fallback to QR code or manual entry
}
```

### 1.8 Payment UI: Stripe Elements

#### Payment Form Implementation
```
Stripe Integration:
├─ Stripe React library
├─ Elements for secure card input
├─ Stripe.js for payment processing
└─ Payment Intent for 3D Secure

Components:
├─ CardElement (card details)
├─ BillingDetailsElement (address, name)
└─ PaymentElement (wallet options)

Flow:
├─ Create Payment Intent (backend)
├─ Collect payment details (client)
├─ Confirm Payment (client)
├─ Webhook confirmation (backend)
└─ Settlement

Security:
├─ PCI compliance (no card storage)
├─ Tokenization
├─ 3D Secure authentication
└─ Fraud detection by Stripe
```

### 1.9 Maps & Geolocation: Google Maps API

#### Geolocation Features
```
Google Maps Integration:
├─ Google Maps React library
├─ Geolocation API
├─ Maps JavaScript API
└─ Places API (location search)

Features:
├─ Display found item location
├─ Show owner's profile location (masked)
├─ Route calculation
├─ Distance calculation
├─ Courier location tracking
└─ Pickup/delivery point mapping

Privacy:
├─ GPS coordinates only with user consent
├─ Location history not stored
├─ Coordinates masked in public profiles
└─ GDPR-compliant location handling
```

### 1.10 Forms & Validation: React Hook Form + Zod

#### Form Management
```
React Hook Form:
├─ Minimal re-renders
├─ Flexible validation
├─ Error management
├─ Field-level control
└─ Integration with UI libraries

Validation (Zod):
├─ TypeScript-first schema validation
├─ Runtime type checking
├─ Custom validation rules
├─ Error messages
└─ Async validation (email uniqueness)

Example Flow:
├─ Define schema (Zod)
├─ Create form hook (useForm)
├─ Register fields
├─ Handle validation on change
├─ Submit with validation
└─ Display errors
```

### 1.11 Testing: Jest + React Testing Library

#### Test Strategy
```
Unit Tests:
├─ Component rendering
├─ Props handling
├─ User interactions
├─ Hook behavior
└─ Utility functions

Integration Tests:
├─ API integration
├─ Redux integration
├─ Navigation flows
├─ Form submissions
└─ Error handling

Coverage Target: 80%

Command:
npm test -- --coverage
```

### 1.12 Build & Deployment: Vercel

#### Deployment Strategy
```
Vercel Benefits:
✓ Optimized for Next.js
✓ Automatic deployments on git push
✓ Preview deployments for PRs
✓ Built-in analytics
✓ Edge functions support
✓ Automatic HTTPS
✓ Global CDN
✓ Serverless functions

Environment Variables:
├─ .env.local (local development)
├─ .env.production (production secrets)
├─ .env.preview (preview env)
└─ System env vars in Vercel dashboard

Optimization:
├─ Image optimization
├─ Automatic font optimization
├─ Code splitting
├─ Prefetching
└─ Compression
```

---

## 2. Mobile App Technology Stack

### 2.1 Cross-Platform: React Native

#### Why React Native?
```
Advantages:
✓ Single codebase for iOS & Android
✓ Native performance
✓ Large developer community
✓ Reusable React components/logic
✓ Hot reload for faster development
✓ Access to native APIs
✓ Strong third-party library ecosystem
✓ Regular updates & maintenance

Project Structure:
mobile/
├─ app.json (project config)
├─ app.tsx (main entry)
├─ screens/ (screen components)
├─ components/ (reusable components)
├─ services/ (API, storage, native)
├─ utils/ (helpers, constants)
├─ store/ (Redux/Context state)
├─ navigation/ (routing)
└─ assets/ (images, fonts, icons)
```

### 2.2 Navigation: React Navigation

#### App Navigation
```
Navigation Stack:
├─ AuthStack (Login, Register, Reset Password)
├─ MainStack
│   ├─ HomeStack (Dashboard, Products)
│   ├─ ScannerStack (QR/NFC Scanner)
│   ├─ RecoveryStack (Recovery Details)
│   ├─ ChatStack (Messaging)
│   └─ AccountStack (Profile, Settings)
└─ Modals (Payment, Confirm, Alert)

Navigation Library:
├─ @react-navigation/native
├─ @react-navigation/bottom-tabs
├─ @react-navigation/stack
└─ React Native Navigation (alternative)
```

### 2.3 Camera & QR: React Native Camera

#### Camera Integration
```
Libraries:
├─ react-native-camera (camera access)
├─ react-native-vision-camera (modern alternative)
├─ react-native-qrcode-scanner (QR decoding)
└─ react-native-nfc-manager (NFC reading)

Features:
├─ Full-screen camera preview
├─ QR code detection
├─ NFC tag reading
├─ Permission handling
├─ Flashlight control
└─ Fallback UI for permissions denied
```

### 2.4 Local Storage: AsyncStorage + MMKV

#### Data Persistence
```
AsyncStorage (React Native):
├─ Persist app state
├─ Store user preferences
├─ Cache non-critical data
├─ Automatic cleanup

MMKV (Fast alternative):
├─ Key-value storage
├─ 30x faster than AsyncStorage
├─ Larger storage capacity
└─ Used for large datasets

Usage:
├─ User tokens
├─ Recently viewed products
├─ Draft messages
├─ User preferences
└─ Offline queue
```

### 2.5 State Management: Redux + Redux Persist

#### Mobile State Management
```
Redux Setup (same as web):
├─ Normalized state structure
├─ Actions for all mutations
├─ Selectors for derived state
└─ Thunks for async operations

Redux Persist:
├─ Persist state to AsyncStorage
├─ Whitelist specific slices
├─ Auto-rehydrate on app start
└─ Version control for migrations
```

### 2.6 Push Notifications: Firebase Cloud Messaging (FCM)

#### Notification Handling
```
FCM Setup:
├─ Firebase project configuration
├─ Backend integration
├─ Client token management
├─ Permission handling
└─ Deep linking

Notification Types:
├─ Item found alert
├─ Message received
├─ Payment confirmation
├─ Shipment update
├─ Reminder notifications
└─ Promotional

Library: react-native-firebase
├─ @react-native-firebase/messaging
├─ @react-native-firebase/analytics
└─ @react-native-firebase/app
```

### 2.7 HTTP Client: Axios

#### API Client Configuration
```
Axios Configuration:
├─ Base URL setup
├─ Default headers
├─ Interceptors for:
│   ├─ Request: Add auth token
│   ├─ Response: Handle errors
│   ├─ 401: Refresh token & retry
│   └─ Network error: Offline queue
│
├─ Timeout: 10 seconds
├─ Retry: 3 attempts
└─ Offline support:
    ├─ Queue requests while offline
    ├─ Sync when online
    └─ Conflict resolution
```

### 2.8 Maps: React Native Maps

#### Native Maps Integration
```
Library: react-native-maps

Features:
├─ Display item location
├─ Show route (pickup → delivery)
├─ Distance calculation
├─ Marker customization
├─ Real-time tracking (if shared)
└─ Touch interaction

Implementation:
├─ Provider: Google Maps / Apple Maps
├─ Region tracking
├─ Animated markers
└─ InfoWindows
```

### 2.9 Location Services: Geolocation

#### Location Access
```
Library: @react-native-community/geolocation

Permissions:
├─ iOS: CFBundleURLSchemes configuration
├─ Android: AndroidManifest.xml
├─ Runtime permissions (React Native Permissions)
└─ User consent handling

Usage:
├─ Get current GPS coordinates
├─ Continuous tracking (if opted)
├─ Background location (if allowed)
└─ Location accuracy settings
```

### 2.10 Testing: Jest + React Native Testing Library

#### Mobile Testing
```
Test Types:
├─ Unit tests (utilities, services)
├─ Component tests (UI, interactions)
├─ Integration tests (flows, navigation)
└─ E2E tests (Detox framework)

Testing Tools:
├─ Jest (test runner)
├─ React Native Testing Library
├─ Detox (E2E testing)
└─ Appium (alternative E2E)
```

### 2.11 Build & Distribution: EAS (Expo Application Services)

#### Build Pipeline
```
Development:
├─ Expo CLI for local testing
├─ expo start for fast iteration
└─ Hot reload enabled

Production:
├─ EAS Build (cloud builds)
├─ Automated signing (iOS)
├─ APK/AAB generation (Android)
├─ TestFlight distribution (iOS)
└─ Google Play Store (Android)

Commands:
├─ eas build --platform ios
├─ eas build --platform android
├─ eas submit --platform ios
└─ eas submit --platform android
```

---

## 3. Backend Technology Stack

### 3.1 Runtime: Node.js 20 LTS

#### Why Node.js?
```
Advantages:
✓ JavaScript ecosystem (shared with frontend)
✓ Non-blocking I/O (perfect for scalability)
✓ Event-driven architecture
✓ Large npm ecosystem (~2M packages)
✓ Strong community support
✓ Excellent for microservices
✓ Built-in HTTP server capabilities

Version Management:
├─ Use Node.js 20 LTS (long-term support)
├─ Managed via nvm (Node Version Manager)
├─ Docker for consistent development
└─ CI/CD uses same Node version
```

### 3.2 Framework: NestJS

#### Why NestJS?
```
Advantages:
✓ TypeScript-first framework
✓ Modular architecture (scalable)
✓ Built-in dependency injection
✓ Decorator-based routing
✓ GraphQL & REST support
✓ ORM-agnostic database layer
✓ Built-in validation
✓ Testing utilities included
✓ Strong documentation
✓ Enterprise adoption

Project Structure:
src/
├─ main.ts (entry point)
├─ app.module.ts (root module)
├─ modules/
│   ├─ auth/
│   │   ├─ auth.module.ts
│   │   ├─ auth.controller.ts
│   │   ├─ auth.service.ts
│   │   ├─ jwt.strategy.ts
│   │   ├─ local.strategy.ts
│   │   └─ auth.guard.ts
│   │
│   ├─ products/
│   │   ├─ products.module.ts
│   │   ├─ products.controller.ts
│   │   ├─ products.service.ts
│   │   ├─ dto/ (data transfer objects)
│   │   ├─ entities/ (database models)
│   │   └─ qr-generator.service.ts
│   │
│   ├─ recovery/
│   │   ├─ recovery.module.ts
│   │   ├─ recovery.controller.ts
│   │   ├─ recovery.service.ts
│   │   ├─ recovery.gateway.ts (WebSocket)
│   │   └─ entities/
│   │
│   ├─ messaging/
│   │   ├─ messaging.module.ts
│   │   ├─ messaging.gateway.ts
│   │   ├─ messaging.service.ts
│   │   └─ entities/
│   │
│   ├─ payments/
│   │   ├─ payments.module.ts
│   │   ├─ payments.controller.ts
│   │   ├─ payments.service.ts
│   │   ├─ stripe.provider.ts
│   │   └─ webhook.handler.ts
│   │
│   ├─ courier/
│   │   ├─ courier.module.ts
│   │   ├─ courier.controller.ts
│   │   ├─ courier.service.ts
│   │   └─ adapters/ (partner integrations)
│   │
│   └─ users/
│       ├─ users.module.ts
│       ├─ users.controller.ts
│       ├─ users.service.ts
│       ├─ dto/
│       └─ entities/
│
├─ common/
│   ├─ filters/
│   │   └─ http-exception.filter.ts
│   ├─ pipes/
│   │   └─ validation.pipe.ts
│   ├─ interceptors/
│   │   ├─ logging.interceptor.ts
│   │   ├─ transform.interceptor.ts
│   │   └─ timeout.interceptor.ts
│   ├─ decorators/
│   │   ├─ current-user.decorator.ts
│   │   └─ public.decorator.ts
│   └─ middleware/
│       └─ cors.middleware.ts
│
├─ config/
│   ├─ database.config.ts
│   ├─ jwt.config.ts
│   ├─ env.validation.ts
│   └─ stripe.config.ts
│
└─ database/
    ├─ migrations/
    ├─ seeders/
    └─ connection.ts

```

### 3.3 Database: PostgreSQL 15

#### Why PostgreSQL?
```
Advantages:
✓ ACID compliance (data integrity)
✓ JSON/JSONB support (flexible data)
✓ Full-text search (product search)
✓ PostGIS for geospatial queries
✓ Advanced indexing
✓ Row-level security
✓ Free & open source
✓ Enterprise-grade reliability
✓ Strong ecosystem

Key Features:
├─ JSONB columns for dynamic data
├─ Arrays for relationships
├─ Enums for status fields
├─ Materialized views for complex queries
├─ Window functions for analytics
├─ Common Table Expressions (CTE)
├─ Partitioning for large tables
└─ Logical replication for HA
```

### 3.4 ORM: Prisma

#### Database Layer
```
Why Prisma?
✓ TypeScript-first ORM
✓ Intuitive schema definition
✓ Auto-migrations
✓ Type-safe queries
✓ Relationships handling
✓ Transactions support
✓ Great DevX

Prisma Schema Structure:
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int     @id @default(autoincrement())
  email     String  @unique
  name      String?
  products  Product[]
  recoveries Recovery[] @relation("Owner")
  
  @@index([email])
}

model Product {
  id        Int     @id @default(autoincrement())
  owner     User    @relation(fields: [ownerId])
  ownerId   Int
  type      ProductType
  status    ProductStatus
  uniqueCode String @unique
  
  @@index([ownerId])
  @@index([uniqueCode])
}

Key Operations:
├─ Create: await prisma.user.create({...})
├─ Read: await prisma.user.findUnique({...})
├─ Update: await prisma.user.update({...})
├─ Delete: await prisma.user.delete({...})
├─ Transactions: await prisma.$transaction([...])
└─ Raw queries: await prisma.$queryRaw[...]
```

### 3.5 Validation: Zod

#### Request Validation
```
DTO Structure:
import { z } from 'zod';

export const CreateProductSchema = z.object({
  itemName: z.string().min(1).max(100),
  itemDescription: z.string().max(500),
  itemColor: z.string().min(1),
  estimatedValue: z.number().positive(),
  productType: z.enum(['CARD', 'STICKER']),
});

export type CreateProductDTO = z.infer<typeof CreateProductSchema>;

Usage in Controller:
@Post()
async create(@Body() dto: CreateProductDTO) {
  const validated = CreateProductSchema.parse(dto);
  return this.service.create(validated);
}
```

### 3.6 Authentication: Passport.js + JWT

#### Auth Strategy
```
Passport Strategies:
├─ LocalStrategy (email/password)
├─ JwtStrategy (token validation)
├─ GoogleStrategy (OAuth)
└─ AppleStrategy (OAuth)

JWT Implementation:
├─ Access token: 15 minutes expiry
├─ Refresh token: 7 days expiry
├─ Stored in: Secure HTTP-only cookies
├─ Payload includes: userId, email, role
└─ Signed with: RS256 (asymmetric)

Refresh Flow:
├─ Client requests with access token
├─ If expired: Return 401
├─ Client calls /refresh endpoint
├─ Backend validates refresh token
├─ Return new access token
├─ Client retries original request
└─ Success

Guards:
├─ AuthGuard('jwt'): Require authentication
├─ RolesGuard: Check user role
├─ PublicGuard: No authentication needed
└─ OptionalGuard: Authentication optional
```

### 3.7 WebSocket: Socket.io

#### Real-time Communication
```
Socket.io Server:
├─ Namespace: /recovery (recovery events)
├─ Rooms: recovery:{recoveryId}
├─ Rooms: user:{userId}
└─ Rooms: notifications

Events:
├─ Server emits:
│   ├─ new_message (new chat message)
│   ├─ user_typing (typing indicator)
│   ├─ recovery_update (status change)
│   ├─ notification (general alert)
│   └─ shipment_tracking (real-time tracking)
│
└─ Server listens:
    ├─ send_message (client message)
    ├─ typing (client typing)
    ├─ read_message (message read)
    └─ disconnect (cleanup)

Implementation:
@WebSocketGateway({
  namespace: '/recovery',
  cors: { origin: process.env.CLIENT_URL },
})
export class RecoveryGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer()
  server: Server;
  
  @SubscribeMessage('send_message')
  handleMessage(@MessageBody() data: MessageDTO): void {
    this.server
      .to(`recovery:${data.recoveryId}`)
      .emit('new_message', data);
  }
}
```

### 3.8 Background Jobs: Bull Queue

#### Async Job Processing
```
Why Bull?
✓ Redis-backed job queue
✓ Automatic retry mechanism
✓ Job scheduling
✓ Priority support
✓ Large job support
✓ Monitoring UI available

Job Types:
├─ Send notifications (email, SMS, push)
├─ Generate QR codes
├─ Process payments
├─ Courier integration calls
├─ Data cleanup tasks
└─ Report generation

Implementation:
const notificationQueue = new Queue('notifications', {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

// Add job
await notificationQueue.add(
  'send_email',
  { email: user.email, type: 'item_found' },
  { delay: 1000, attempts: 3, backoff: 'exponential' }
);

// Process job
notificationQueue.process('send_email', async (job) => {
  await emailService.sendNotification(job.data);
});

Job Monitoring:
├─ Bull Board UI (web dashboard)
├─ Job status: pending, active, completed, failed
├─ Retry management
├─ Job history
└─ Performance metrics
```

### 3.9 Logging: Winston

#### Structured Logging
```
Log Levels:
├─ error: System errors, exceptions
├─ warn: Warnings, degraded performance
├─ info: Important state changes
├─ debug: Detailed execution info
└─ trace: Very detailed debugging

Winston Setup:
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

Log Structure:
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
  "trace_id": "trace-789",
  "message": "Payment processed successfully"
}
```

### 3.10 Testing: Jest

#### Backend Testing
```
Test Structure:
test/
├─ unit/
│   ├─ services/ (business logic)
│   ├─ controllers/ (endpoints)
│   └─ utils/ (helpers)
├─ integration/
│   ├─ products/ (product flow)
│   ├─ recovery/ (recovery flow)
│   └─ payments/ (payment flow)
└─ e2e/
    ├─ auth.e2e.spec.ts
    ├─ products.e2e.spec.ts
    └─ recovery.e2e.spec.ts

Test Command:
npm test                    # Run all tests
npm run test:cov           # With coverage
npm run test:watch         # Watch mode

Coverage Goals:
├─ Statements: 80%
├─ Branches: 80%
├─ Functions: 80%
└─ Lines: 80%
```

### 3.11 API Documentation: Swagger/OpenAPI

#### Auto-generated Documentation
```
Swagger Setup:
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('LostFound Guard API')
  .setDescription('API for lost item recovery platform')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api-docs', app, document);

Decorators:
@Controller('products')
@ApiTags('Products')
@UseGuards(AuthGuard('jwt'))
export class ProductsController {
  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, type: ProductDTO })
  async getProduct(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}

Generated Documentation:
├─ Available at: http://localhost:3000/api-docs
├─ Interactive Swagger UI
├─ Try-it-out feature
├─ Request/response schemas
└─ Authentication examples
```

---

## 4. Infrastructure & DevOps

### 4.1 Containerization: Docker

#### Docker Setup
```
Dockerfile (Backend):
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["node", "dist/main.js"]

Docker Compose (Development):
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://user:pass@db:5432/lostfound
      REDIS_URL: redis://redis:6379
    depends_on:
      - db
      - redis
  
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: lostfound
    volumes:
      - pg_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  pg_data:
```

### 4.2 Orchestration: Kubernetes

#### K8s Deployment
```
Deployment Manifest (backend):
apiVersion: apps/v1
kind: Deployment
metadata:
  name: lostfound-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: registry.example.com/lostfound:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"

Service Manifest:
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  selector:
    app: backend
  type: LoadBalancer
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
```

### 4.3 CI/CD: GitHub Actions

#### Build & Deploy Pipeline
```
Pipeline Flow:
┌─ Push to main
└─ Trigger GitHub Actions workflow
  └─ Run tests (Jest)
  └─ Run linting (ESLint)
  └─ Security scan (Snyk)
  └─ Build Docker image
  └─ Push to ECR
  └─ Deploy to staging (auto)
  └─ Run E2E tests
  └─ Manual approval
  └─ Deploy to production (Blue-Green)
  └─ Smoke tests
  └─ Notify team

Workflow File (.github/workflows/deploy.yml):
name: Deploy
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test
      - run: npm run lint

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: docker build -t backend:latest .
      - run: docker push registry.example.com/backend:latest

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: kubectl set image deployment/staging-backend ...
      - run: kubectl rollout status deployment/staging-backend
      - run: npm run e2e:staging
```

### 4.4 Monitoring: CloudWatch + Datadog

#### Observability Stack
```
CloudWatch Metrics:
├─ Application metrics (custom)
├─ Infrastructure metrics (auto)
├─ Database performance
├─ API gateway metrics
└─ Lambda execution

Dashboards:
├─ Real-time monitoring
├─ System health overview
├─ Error rate tracking
├─ Performance trends
└─ Cost analysis

Alerts:
├─ Error rate > 5%
├─ Response time > 1s
├─ Database connections exhausted
├─ Payment failures
└─ Server down

Datadog:
├─ APM (Application Performance Monitoring)
├─ Log aggregation
├─ Metrics visualization
├─ Alert management
└─ Incident tracking
```

### 4.5 Environment Variables Management

#### Secrets & Configuration
```
Development (.env.local):
NODE_ENV=development
DATABASE_URL=postgresql://localhost/lostfound_dev
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev_secret_key
STRIPE_SECRET_KEY=sk_test_...

Staging (.env.staging):
NODE_ENV=staging
DATABASE_URL=<RDS_STAGING_URL>
REDIS_URL=<ELASTICACHE_STAGING_URL>
STRIPE_SECRET_KEY=sk_test_...

Production (AWS Secrets Manager):
- All secrets in AWS Secrets Manager
- Rotated monthly
- Encrypted at rest & in transit
- Audit logging enabled

Loading:
import { config } from 'dotenv';
config();

Validation:
const env = z.object({
  NODE_ENV: z.enum(['dev', 'staging', 'prod']),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
}).parse(process.env);
```

---

## 5. Third-Party Integrations

### 5.1 Payment Processing: Stripe

#### Stripe Integration
```
Key APIs:
├─ Payment Intents API (checkout)
├─ Connect (seller payouts)
├─ Webhooks (event handling)
├─ Customers API (save cards)
└─ Disputes API (chargeback handling)

Implementation:
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const paymentIntent = await stripe.paymentIntents.create({
  amount: 10000, // cents
  currency: 'usd',
  metadata: { recovery_id: 'rec-123' },
  statement_descriptor: 'LostFound Recovery',
});

Webhooks:
app.post('/webhooks/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(
    req.body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  );
  
  switch (event.type) {
    case 'payment_intent.succeeded':
      // Handle payment success
      break;
    case 'payment_intent.payment_failed':
      // Handle payment failure
      break;
  }
});
```

### 5.2 Courier Integration: API Wrappers

#### Courier Partner APIs
```
Supported Couriers:
├─ DHL eCommerce API
├─ FedEx APIs
├─ UPS APIs
└─ Local courier provider APIs

Generic Adapter Pattern:
interface CourierAdapter {
  createShipment(details: ShipmentDetails): Promise<ShipmentResponse>;
  getTracking(trackingNumber: string): Promise<TrackingInfo>;
  cancelShipment(shipmentId: string): Promise<void>;
}

Implementation:
class DHL implements CourierAdapter {
  async createShipment(details: ShipmentDetails) {
    const response = await axios.post(
      'https://api.dhl.com/shipments',
      this.transformToFormat(details),
      { headers: this.getHeaders() }
    );
    return this.transformResponse(response);
  }
}

Service Abstraction:
@Injectable()
export class CourierService {
  private adapters: Map<string, CourierAdapter>;
  
  async shipItem(recoveryId: string, courierId: string) {
    const adapter = this.adapters.get(courierId);
    return adapter.createShipment(shipmentDetails);
  }
}
```

### 5.3 SMS Notifications: Twilio

#### SMS Service
```
Twilio Setup:
const twilio = require('twilio');
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

Sending SMS:
await client.messages.create({
  body: 'Your item was found! Tap this link to contact finder.',
  from: process.env.TWILIO_PHONE_NUMBER,
  to: user.phone,
});

Webhook for Replies:
app.post('/sms/webhook', async (req, res) => {
  const message = req.body.Body;
  const from = req.body.From;
  // Process reply
});
```

### 5.4 Email Service: SendGrid

#### Email Notifications
```
SendGrid Setup:
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

Sending Email:
await sgMail.send({
  to: user.email,
  from: 'notifications@lostfoundguard.com',
  subject: 'Your item was found!',
  html: emailTemplate,
});

Templates:
├─ Item found notification
├─ Message received alert
├─ Payment confirmation
├─ Shipment tracking update
└─ Welcome email
```

### 5.5 Maps & Geolocation: Google Maps API

#### Geolocation Services
```
Google Maps Integration:
const { Client } = require('@googlemaps/js-client');
const client = new Client({
  key: process.env.GOOGLE_MAPS_API_KEY,
});

Distance Matrix (calculate shipment cost):
const response = await client.distancematrix({
  origins: [finderLocation],
  destinations: [ownerLocation],
});

Geocoding (address → coordinates):
const result = await client.geocode({
  address: userAddress,
});

Reverse Geocoding (coordinates → address):
const result = await client.reverseGeocode({
  latlng: { lat, lng },
});

Places Autocomplete (address search):
const predictions = await client.placesAutocomplete({
  input: searchQuery,
});
```

---

## 6. Development Tools & Utilities

### 6.1 Code Quality Tools

#### Linting & Formatting
```
ESLint Configuration:
{
  "extends": [
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/explicit-function-return-types": "warn",
    "no-console": "warn",
    "@typescript-eslint/no-unused-vars": "error"
  }
}

Prettier Configuration:
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}

Pre-commit Hooks (Husky):
.husky/pre-commit:
  ├─ Run linter
  ├─ Format code
  ├─ Run tests (if relevant)
  └─ Prevent commit if fails
```

### 6.2 Code Review & Collaboration

#### PR Workflow
```
Branch Naming:
├─ feature/product-registration
├─ bugfix/payment-validation
├─ hotfix/critical-security
├─ refactor/database-layer
└─ docs/api-documentation

PR Checklist:
├─ Tests added/updated
├─ Documentation updated
├─ No breaking changes
├─ Code reviewed by 2 reviewers
├─ CI/CD passing
├─ Accessibility checks
└─ Performance impact assessment
```

---

## 7. Performance Optimization

### 7.1 Frontend Optimization

```
Image Optimization:
├─ Next.js Image component (auto optimization)
├─ WebP format (better compression)
├─ Lazy loading (loading="lazy")
├─ Responsive images (srcSet)
└─ CDN delivery (CloudFront)

Bundle Size:
├─ Code splitting (dynamic imports)
├─ Tree shaking (unused code removal)
├─ Compression (gzip/brotli)
├─ Critical CSS inline
└─ Defer non-critical JS

Web Vitals:
├─ LCP (Largest Contentful Paint): < 2.5s
├─ FID (First Input Delay): < 100ms
├─ CLS (Cumulative Layout Shift): < 0.1
└─ TTFB (Time to First Byte): < 600ms
```

### 7.2 Backend Optimization

```
Database Query Optimization:
├─ Indexes on frequently queried columns
├─ Query result caching (Redis)
├─ Connection pooling
├─ Query pagination (limit/offset)
├─ Avoid N+1 queries (eager loading)
└─ Database monitoring

API Response Optimization:
├─ Response compression (gzip)
├─ Field selection (only needed fields)
├─ Pagination (chunked responses)
├─ Caching headers (public, max-age)
└─ CDN for static responses

Memory Management:
├─ Connection pooling
├─ Stream large files
├─ Garbage collection tuning
├─ Memory leak detection
└─ Load testing
```

---

## 8. Security Best Practices

### 8.1 Application Security

```
OWASP Top 10 Mitigations:
├─ SQL Injection: Use parameterized queries (Prisma)
├─ Authentication: JWT + MFA
├─ Sensitive Data: Encryption at rest & transit
├─ XML External Entities: Disable XML parsing
├─ Broken Access Control: Role-based access
├─ Security Misconfiguration: Security headers
├─ XSS: Input sanitization + CSP
├─ Insecure Deserialization: Strict parsing
├─ Using Components with Known Vulnerabilities: Snyk scan
└─ Insufficient Logging: Comprehensive logging
```

### 8.2 Infrastructure Security

```
Network Security:
├─ VPC isolation
├─ Security groups (firewall rules)
├─ WAF (Web Application Firewall)
├─ DDoS protection (AWS Shield)
├─ Rate limiting
└─ SSL/TLS encryption

Access Control:
├─ IAM roles & policies
├─ Principle of least privilege
├─ MFA for AWS console
├─ Secrets rotation
├─ Audit logging
└─ VPN for admin access
```

---

## Summary

This tech stack provides:
- **Scalability**: Horizontal scaling, caching, CDN
- **Reliability**: Error handling, monitoring, backups
- **Security**: Encryption, authentication, validation
- **Developer Experience**: TypeScript, tooling, documentation
- **Performance**: Optimization at all layers
- **Maintainability**: Clean code, testing, CI/CD

All components are industry-standard, well-documented, and actively maintained.

---

**Document Version**: 1.0  
**Last Updated**: December 16, 2025  
**Status**: Ready for Implementation
