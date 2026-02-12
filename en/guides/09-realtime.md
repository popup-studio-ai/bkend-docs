# Realtime Data

{% hint style="info" %}
Learn how to implement realtime data synchronization with bkend.
{% endhint %}

## Overview

**This document is under preparation.**

bkend currently operates on a REST API basis. If you need realtime data synchronization, you can use polling patterns. A guide for WebSocket/SSE support is being prepared.

***

## Planned Content

- Polling pattern implementation (basic, smart, adaptive)
- React usePolling Hook
- Polling interval optimization
- Long polling pattern
- WebSocket / SSE support status

{% hint style="warning" %}
If the polling interval is too short, you may hit the API rate limit (429). A minimum interval of **5 seconds** is recommended. Use adaptive polling to reduce unnecessary requests.
{% endhint %}

***

## Related Documents

- [Data List Query](../database/05-list.md) — List query API
- [Performance Optimization](04-performance.md) — API call optimization
