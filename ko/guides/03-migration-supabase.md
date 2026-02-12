# Supabase에서 이전하기

{% hint style="warning" %}
🚧 이 문서는 준비 중입니다. Supabase에서 bkend로의 마이그레이션 가이드는 향후 제공될 예정입니다.
{% endhint %}

## 개요

Supabase 프로젝트를 bkend로 이전하는 단계별 가이드를 준비하고 있습니다.

***

## 준비 중인 내용

- 스키마 마이그레이션 (PostgreSQL → bkend Database)
- 인증 마이그레이션 (GoTrue → bkend Auth)
- RLS 정책 변환 (PostgreSQL RLS → bkend RLS)
- 스토리지 마이그레이션 (Supabase Storage → bkend Storage)
- 클라이언트 코드 전환 (supabase-js → bkend REST API)

***

## 지금 시작하려면

Supabase와 bkend의 기능 차이를 먼저 확인하세요.

- [타 서비스 비교](01-comparison.md) — Supabase vs bkend 상세 비교
- [빠른 시작 가이드](../getting-started/02-quickstart.md) — bkend 시작하기
- [인증 개요](../authentication/01-overview.md) — bkend 인증 시스템
- [데이터베이스 개요](../database/01-overview.md) — bkend 데이터베이스
