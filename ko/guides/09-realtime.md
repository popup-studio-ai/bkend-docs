# 실시간 데이터

{% hint style="info" %}
💡 bkend에서 실시간 데이터 동기화를 구현하는 방법을 안내합니다.
{% endhint %}

## 개요

🚧 **이 문서는 준비 중입니다.**

bkend는 현재 REST API 기반으로 동작합니다. 실시간 데이터 동기화가 필요한 경우 폴링 패턴을 활용할 수 있습니다. WebSocket/SSE 지원에 대한 가이드를 준비하고 있습니다.

***

## 다룰 내용 (예정)

- 폴링 패턴 구현 (기본, 스마트, 적응형)
- React usePolling Hook
- 폴링 간격 최적화
- 롱폴링 패턴
- WebSocket / SSE 지원 현황

***

## 관련 문서

- [데이터 목록 조회](../database/05-list.md) — 목록 조회 API
- [성능 최적화](04-performance.md) — API 호출 최적화
