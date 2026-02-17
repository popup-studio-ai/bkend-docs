# Frequently Asked Questions

{% hint style="info" %}
This page compiles frequently asked questions and key terms related to bkend.
{% endhint %}

## General

**Q: What is bkend?**

bkend is a backend service that integrates with AI tools. It provides Database, Authentication, and Storage, and through MCP (Model Context Protocol), you can manage your backend directly from AI tools like Claude Code and Cursor.

***

**Q: What database does bkend use?**

It uses MongoDB. With dynamic BSON Schema support, you can flexibly manage tables and columns.

***

**Q: Can I use SQL?**

No. bkend is built on MongoDB and manipulates data through the REST API and MCP tools. Instead of SQL, it uses JSON-based filtering and sorting.

***

## Database

**Q: Can I join tables?**

bkend is a document-based NoSQL database and does not support relational JOINs. Instead, you can implement relationships using reference patterns (storing IDs) and client-side joins. For details, see [Table Relations](../database/13-relations.md).

***

**Q: How is data backed up?**

bkend uses MongoDB Atlas, which provides automatic backups. If you need manual backups, you can export data through the API.

***

## Authentication

**Q: How long are JWT tokens valid?**

Access Tokens are valid for 1 hour, and Refresh Tokens for 30 days. When an Access Token expires, you can renew it using the Refresh Token.

See [Session & Token Management](../authentication/10-session-management.md)

***

**Q: Which social login providers are supported?**

Google and GitHub are supported. For setup instructions, see the social login documentation.

See [Social Login Overview](../authentication/05-social-overview.md)

***

**Q: I forgot my password. What should I do?**

Use the password reset feature. A reset link will be sent to your registered email address.

See [Password Reset/Change](../authentication/08-password-management.md)

***

## Storage

**Q: Is there a maximum file size limit?**

There may be size limits for single Presigned URL uploads. For large files, use multipart upload.

See [Large File Upload](../storage/03-upload-multipart.md)

***

**Q: Are file URLs permanent?**

CDN URLs for public files do not expire. Presigned URLs for private files have a limited validity period.

***

## MCP / AI Tools

**Q: What is MCP?**

MCP stands for Model Context Protocol, a standard protocol for AI tools to communicate with external services.

See [Understanding the MCP Protocol](../ai-tools/02-mcp-protocol.md)

***

**Q: Which AI tools are supported?**

You can integrate with any AI tool that supports MCP, including Claude Code, Cursor, and Antigravity.

See [AI Tool Integration Overview](../ai-tools/01-overview.md)

***

## Security

**Q: My API Key has been exposed. What should I do?**

Immediately **revoke** the API Key in the console and generate a new one. Use Secret Keys (`sk_`) only on the server side, and never include them in client code.

See [API Key Management (Console)](../console/11-api-keys.md)

***

**Q: What is the difference between a Publishable Key and a Secret Key?**

A Publishable Key (`pk_`) is used on the client side with limited permissions (RLS-based), while a Secret Key (`sk_`) is used on the server side with full admin privileges.

See [Publishable Key vs Secret Key](../security/03-public-vs-secret.md)

***

{% hint style="info" %}
If you did not find the answer you were looking for in this FAQ, check the [Common Error Codes](01-common-errors.md) and the troubleshooting documents for each category.
{% endhint %}

## Glossary

| Term | Description |
|------|------|
| **bkend** | A backend service with AI tool integration support |
| **Organization** | An organizational unit that manages projects |
| **Project** | A service unit. Multiple projects can be created within an Organization |
| **Environment** | A project's runtime environment (dev, staging, prod) |
| **Tenant** | A user who builds services using bkend |
| **User** | An end user of the service built by a Tenant |
| **MCP** | Model Context Protocol. A standard communication protocol between AI tools and services |
| **Publishable Key** | A client-side API key (`pk_` prefix) with RLS-based permissions |
| **Secret Key** | A server-side API key (`sk_` prefix) with full admin permissions |
| **JWT** | JSON Web Token. A token format used for user authentication |
| **RLS** | Row Level Security. Row-level access control |
| **CRUD** | Abbreviation for Create, Read, Update, Delete |
| **OAuth 2.1** | An authentication/authorization protocol used for social login and more |
| **PKCE** | Proof Key for Code Exchange. An OAuth security extension |
| **Presigned URL** | A file access URL valid for a limited time |
| **CDN** | Content Delivery Network. A globally distributed file delivery network |

***

## Next Steps

- [Common Error Codes](01-common-errors.md) -- Error resolution
- [Connection Issues](02-connection-issues.md) -- Connectivity problems
- [Authentication Issues](03-auth-issues.md) -- Auth problems
- [What is bkend](../getting-started/01-what-is-bkend.md) -- bkend overview
