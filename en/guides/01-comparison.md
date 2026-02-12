# Comparison with Other Services

{% hint style="info" %}
This document compares bkend with major BaaS platforms such as Firebase, Supabase, and Appwrite.
{% endhint %}

## Overview

bkend is a backend service with native MCP integration. This document compares it with other major BaaS (Backend as a Service) platforms across key categories.

***

## Core Comparison

| Category | bkend | Firebase | Supabase | Appwrite |
|----------|-------|----------|----------|----------|
| **Database** | MongoDB | Firestore (Document DB) | PostgreSQL 15/17 | MariaDB (Document API) |
| **Data Model** | Dynamic BSON Schema | Schemaless Document | Static SQL Schema | Document (relational internally) |
| **Auth Providers** | Email, Google, GitHub | Email, Google, GitHub, etc. 9+ (SAML/OIDC) | Email, Google, GitHub, etc. 20+ | Email, Google, GitHub, etc. 40+ |
| **File Storage** | S3-compatible | Cloud Storage | S3-compatible | Built-in storage |
| **Realtime** | — | Firestore onSnapshot | Realtime Channels | Realtime Events (WebSocket) |
| **MCP Integration** | Built into the service (register URL) | Separate server (Firebase CLI) | Separate server (npm package) | Separate server (npm package) |
| **Multi-tenancy** | Project-based isolation | Project-based isolation | RLS-based custom implementation | Project-based isolation |
| **Environment Separation** | Dev / Staging / Prod | Project-based separation | Branching (Pro and above) | Project-based separation |
| **Access Control** | RLS (admin/user/self/guest) | Security Rules | RLS (PostgreSQL native) | Collection-level permissions |
| **Offline Support** | — | Firestore/RTDB native | — | — |
| **Open Source** | — | SDK only | Apache 2.0 | BSD 3-Clause |
| **Self-hosting** | — | Not available | Docker Compose | Docker |

***

## Free Plan Comparison

Scope of each service's free plan.

| Category | bkend | Firebase (Spark) | Supabase (Free) | Appwrite (Starter) |
|----------|-------|------------------|-----------------|-------------------|
| **Projects** | — | Unlimited | 2 (paused after 7 days inactive) | 2 |
| **Auth MAU** | — | Unlimited (Email/OAuth) | 50,000 | 75,000 |
| **DB Storage** | — | 1 GiB (Firestore) | 500 MB | — |
| **DB Reads** | — | 50,000/day | — | 500,000/month |
| **DB Writes** | — | 20,000/day | — | 250,000/month |
| **File Storage** | — | Blaze required (Feb 2026~) | 1 GB | 2 GB |
| **Bandwidth** | — | 10 GB/month (Hosting) | 2 GB/month | 5 GB/month |
| **Edge/Cloud Functions** | — | Blaze required | 500,000 invocations/month | 750,000 executions/month |
| **Realtime Connections** | — | 100 (RTDB) | 200 | 250 |

{% hint style="warning" %}
Starting February 2026, Firebase no longer supports Cloud Storage on the Spark (free) plan. You must upgrade to Blaze (pay-as-you-go).
{% endhint %}

***

## Paid Plan Comparison

| Category | Firebase (Blaze) | Supabase (Pro) | Appwrite (Pro) |
|----------|------------------|----------------|----------------|
| **Monthly Base** | $0 (pay-as-you-go) | $25 | $25 |
| **DB Storage** | $0.26/GB | 8 GB included, then $0.125/GB | — |
| **DB Read Overage** | $0.18/100K | — | $0.06/100K |
| **DB Write Overage** | $0.18/100K | — | $0.10/100K |
| **Auth MAU Overage** | Free (Email/OAuth) | $0.00325/user | $3/1,000 users |
| **Phone SMS** | $0.01–$0.06/message | — | — |
| **SAML/OIDC** | $0.015/MAU | Team ($599/month) | — |
| **File Storage** | $0.026/GB | 100 GB included | 150 GB included |
| **Bandwidth** | $0.15/GB (Hosting) | 250 GB included, then $0.09/GB | 2 TB included, then $15/100GB |
| **Cloud Functions** | $0.40/M invocations | 2M invocations included | 3.5M executions included |

{% hint style="info" %}
For bkend pricing details, visit the [bkend official website](https://bkend.ai).
{% endhint %}

***

## Database Comparison

### bkend (MongoDB)

- **Dynamic schema** — Add and modify tables and columns freely from the console or MCP tools
- **BSON Schema validation** — Apply type validation on flexible schemas
- **7 column types** — String, Number, Boolean, Date, Array, Object, Mixed

### Firebase (Firestore)

- **Document-based NoSQL** — Collection/document structure with subcollection support
- **Native offline** — Offline cache enabled by default on Android and iOS
- **Realtime sync** — Detect data changes in real time with `onSnapshot`
- **No joins** — Relationships expressed via subcollections/references (no server-side joins)

### Supabase (PostgreSQL)

- **Relational database** — Static SQL schema with foreign keys
- **Native RLS** — Fine-grained access control with PostgreSQL Row Level Security
- **Powerful joins** — Handle complex relational queries with SQL JOIN
- **pgvector** — Vector search extension for AI/embedding workloads

### Appwrite (MariaDB)

- **Document API** — NoSQL-style interface, MariaDB under the hood
- **Relationship support** — one-to-one, one-to-many, many-to-many, cascade delete
- **Multiple runtimes** — Functions support Node.js, Python, Dart, PHP, and more

***

## Authentication Comparison

| Feature | bkend | Firebase | Supabase | Appwrite |
|---------|-------|----------|----------|----------|
| Email/Password | ✅ | ✅ | ✅ | ✅ |
| Magic Link | ✅ | ✅ (Email Link) | ✅ | ✅ (Magic URL) |
| Google OAuth | ✅ | ✅ | ✅ | ✅ |
| GitHub OAuth | ✅ | ✅ | ✅ | ✅ |
| Phone (SMS) | — | ✅ (paid) | ✅ | ✅ (OTP) |
| Anonymous Auth | — | ✅ | ✅ | ✅ |
| MFA | ✅ (TOTP) | ✅ (SMS + TOTP) | ✅ (TOTP + Phone) | ✅ (Email + Phone + TOTP) |
| SSO (SAML) | — | ✅ (Identity Platform) | ✅ (Team and above) | — |
| Account Linking | ✅ | ✅ | ✅ (linkIdentity) | ✅ |
| Session Management | ✅ (per device) | ✅ | ✅ | ✅ |
| Teams/Groups | RLS-based RBAC | Custom Claims | RLS-based implementation | Native Teams |
| OAuth Provider Count | 2 (Google, GitHub) | 9+ native | 20+ | 40+ |

***

## AI Tool Integration

| Category | bkend | Firebase | Supabase | Appwrite |
|----------|-------|----------|----------|----------|
| **MCP Server** | Built into the service | Firebase CLI built-in (Oct 2025 GA) | Community package | Official package (Mar 2025) |
| **Installation** | Register URL only | `npx firebase-tools@latest` | `npx supabase-mcp-server` | `npx @appwrite/mcp-server` |
| **Authentication** | OAuth 2.1 (browser login) | Google Cloud auth | Access Token / API Key | API Key |
| **Supported Tools** | Claude Code, Cursor, etc. | Firebase Studio, Gemini CLI, Cursor | Cursor, Claude, VS Code Copilot | Cursor, Claude, Gemini CLI |
| **Project Management** | ✅ | ✅ | ✅ | ✅ |
| **Table/Schema** | ✅ (dynamic schema) | ⚠️ (Firestore collections) | ✅ (SQL DDL) | ✅ |
| **Data CRUD** | ✅ | ✅ | ✅ (SQL queries) | ✅ |
| **AI Native** | pgvector, etc. — | Vertex AI, Gemini API integration | pgvector vector search | — |

{% hint style="info" %}
bkend MCP is built into the service, so you can start using it simply by registering the URL. Other services require installing and running the MCP server locally.
{% endhint %}

***

## Access Control Comparison

### bkend

```json
{
  "permissions": {
    "user": { "create": true, "read": true },
    "self": { "update": true, "delete": true },
    "guest": { "read": true }
  }
}
```

- Declarative JSON-based settings per table
- 4 groups: admin / user / guest / self

### Firebase

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

- Custom logic based on Security Rules

### Supabase

```sql
CREATE POLICY "Users can view own data"
ON posts FOR SELECT
USING (auth.uid() = user_id);
```

- SQL-based RLS policies, PostgreSQL native

### Appwrite

- Collection-level permissions set in the console
- Access control by `Any`, `Users`, `Guests`, `Teams`
- Document-level permissions (`$permissions` field)

***

## Open Source & Self-hosting

| Category | bkend | Firebase | Supabase | Appwrite |
|----------|-------|----------|----------|----------|
| **Open Source** | — | SDK only | ✅ | ✅ |
| **License** | — | Proprietary | Apache 2.0 | BSD 3-Clause |
| **GitHub Stars** | — | — | ~75,000+ | ~46,000+ |
| **Self-hosting** | — | Not available | Docker Compose | Docker |
| **Commercial Use** | — | N/A | ✅ | ✅ |

***

## Selection Guide

| Requirement | Recommended Service |
|-------------|-------------------|
| Start immediately with AI tools — no MCP installation | **bkend** |
| Flexible schema + dynamic data model | **bkend** |
| Dev/Staging/Prod environment separation is essential | **bkend** |
| SQL joins and pgvector needed | Supabase |
| Mobile offline sync is critical | Firebase |
| Leverage Google Cloud ecosystem (Vertex AI, etc.) | Firebase |
| Prefer self-hosting + open source | Supabase, Appwrite |
| Need maximum OAuth provider support | Appwrite (40+) |
| Pay-as-you-go pricing | Firebase (Blaze) |

***

## Next Steps

- [Introduction to bkend](../getting-started/01-what-is-bkend.md) — bkend overview
- [Migrating from Firebase](02-migration-firebase.md) — Firebase migration
- [Migrating from Supabase](03-migration-supabase.md) — Supabase migration

## References

- [Supabase Pricing](https://supabase.com/pricing)
- [Firebase Pricing](https://firebase.google.com/pricing)
- [Appwrite Pricing](https://appwrite.io/pricing)
- [Supabase MCP Docs](https://supabase.com/docs/guides/getting-started/mcp)
- [Firebase MCP Server](https://firebase.blog/posts/2025/10/firebase-mcp-server-ga/)
- [Appwrite MCP Docs](https://appwrite.io/docs/tooling/mcp)
