# Webhooks

{% hint style="info" %}
💡 Learn how to configure bkend webhooks and receive events.
{% endhint %}

## Overview

**This document is under preparation.**

Webhooks allow you to deliver events from bkend to an external server in real time. A guide for automating workflows based on events such as data changes and user signups is being prepared.

***

## Planned Content

- Webhook event types
- Payload format
- Receiver server implementation (Node.js)
- Retry policy
- Idempotency patterns

{% hint style="warning" %}
⚠️ Your webhook receiver must be an **HTTPS** endpoint. Always implement **signature verification** to block forged requests.
{% endhint %}

***

## Related Documents

- [CI/CD Integration](07-ci-cd.md) — Automation pipelines
- [Data Creation](../database/03-insert.md) — Data change event triggers
