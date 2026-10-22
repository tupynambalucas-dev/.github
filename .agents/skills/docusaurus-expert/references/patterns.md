# Docusaurus Docs Code Patterns

These patterns must be followed in all code examples generated in the documentation. For formatting syntax, refer to the [MDX Syntax Guide](syntax.md).

---

## General Standards

### 1. Strict Booleans

Always use explicit comparisons in conditionals and JSX.

```typescript
// Correct
if (isValid === true) { ... }
if (data !== undefined) { ... }

// Incorrect
if (isValid) { ... }
if (data) { ... }
```

### 2. Promises & Async

Use the `void` operator for intentional unawaited promises.

```typescript
// For intentionally unawaited calls
void notifyUser();
```

---

## React 19 & Zustand Standards

### 1. JSX Explicit Comparisons

Always use explicit comparisons to boolean/numbers in JSX rendering conditions. Never use array index as keys.

```tsx
// Correct
{
  items.length > 0 && <List items={items} />;
}
{
  isVisible === true && <Modal />;
}

// Incorrect
{
  items.length && <List items={items} />;
}
{
  isVisible && <Modal />;
}
```

### 2. Zustand Atomic Selectors Pattern

Separate state from actions in the store definition and export selectors as individual hooks to prevent redundant component re-renders.

```typescript
// Define Store
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  actions: { setUser: (user) => set({ user }) },
}));

// Atomic Selector Hooks
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useAuthActions = () => useAuthStore((state) => state.actions);
```

### 3. Styling Rules

Combine TailwindCSS v4 and CSS Modules. **The use of `px` is strictly forbidden**. Use relative units (`rem`, `clamp`).

```css
/* Scoped layout styles */
.wrapper {
  padding: 1.5rem;
  font-size: clamp(1rem, 2vw, 1.25rem);
}
```

---

## Fastify 5 & Mongoose API Standards

### 1. Layered Responsibilities

Code examples must align with: `Controller -> Service -> Repository -> Model`. All data schemas must reside in core packages (e.g., `@repo/core`) first.

### 2. Dependency Injection

Repositories must receive the Mongoose model via dependency injection.

```typescript
export class ProductRepository {
  constructor(private readonly productModel: Model<IProduct>) {}
}
```

### 3. Security Guardrails

API examples must feature security-first configurations:

- **Turnstile Bot Validation**: Mandatory validation of `turnstileToken` from incoming DTOs against Cloudflare Siteverify API.
- **User Enumeration Prevention**: Use generic `INVALID_CREDENTIALS` error codes and constant-time comparisons.
- **Rate-Limiting & CSRF**: Document rate limit setups (e.g., auth routes limited to 5/min) and verify `CSRF-Token` headers.
- **HttpOnly Cookies & JWT**: Store JWT tokens in signed, HttpOnly, secure cookies.

---

## MongoDB Connection & Seeding Standards

### 1. Database Naming Parity

API connection scripts must dynamically override the database path in the MongoDB connection URI to enforce `workspacedb` across all environments.

```typescript
// Enforce canonical database name "workspacedb" in connection string
const connectionUri = originalUri.replace(/\/[^?]*(\?|$)/, '/workspacedb$1');
await mongoose.connect(connectionUri);
```

### 2. Idempotent Admin Seeding (`SeedPlugin`)

Administrative seed operations must use atomic, idempotent update operations to avoid duplication on server restarts.

```typescript
// Correct idempotent upsert pattern
await UserModel.findOneAndUpdate(
  { role: 'admin' },
  {
    $setOnInsert: {
      email: 'admin@example.com',
      username: 'admin',
      password: hashedSecurePassword,
      role: 'admin',
    },
  },
  { upsert: true, new: true },
);
```
