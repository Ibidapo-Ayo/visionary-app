# API_INTEGRATION.md

## Purpose

This document defines the engineering standards for integrating external services and backend APIs into the Visionary App.

Every API implementation must follow these guidelines to ensure consistency, scalability, maintainability, and a high-quality developer experience.

The AI must strictly follow this document before implementing any authentication, backend API, or third-party service.

---

# General Principles

Always prioritize:

* Clean Architecture
* SOLID Principles
* Separation of Concerns
* Type Safety
* Reusable Code
* Error Handling
* Performance
* Maintainability

Never sacrifice code quality for speed.

---

# Tech Stack

Framework

* React Native
* Expo SDK (Latest)

Language

* TypeScript

Routing

* Expo Router

Authentication

* Clerk

Backend

* No custom backend
* Use free SaaS and backend-as-a-service platforms only
* Supabase
* Clerk
* Serverless functions only if absolutely necessary

Database

* Supabase PostgreSQL

Storage

* Supabase Storage

AI

* OpenAI API

State Management

* Zustand

Forms

* React Hook Form
* Zod

Networking

* Axios

Animations

* React Native Reanimated
* Moti

---

# Authentication Rules

Authentication is handled exclusively through Clerk.

Never implement custom authentication.

Never create your own JWT system.

Never manually store passwords.

Never bypass Clerk authentication.

Always use Clerk's SDK.

---

# Authentication Flow

Sign Up

↓

Email Verification

↓

Create User Profile

↓

Complete Onboarding

↓

Dashboard

---

Sign In

↓

Restore Session

↓

Dashboard

---

Forgot Password

↓

Reset Password

↓

Sign In

---

# Clerk Guidelines

Use Clerk as the single source of truth for authentication.

Use Clerk User ID as the unique identifier.

Never duplicate authentication information inside the database.

Only store ministry-related information in the backend.

Example:

clerk_user_id

first_name

last_name

birthday

department

role

profile_picture

church_unit

joined_at

etc.

---

# Environment Variables

Never hardcode secrets.

Use environment variables for:

EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

API_BASE_URL

OPENAI_API_KEY

SUPABASE_URL

SUPABASE_ANON_KEY

Never expose server secrets inside the mobile application.

---

# API Folder Structure

Create a dedicated API layer.

Example:

src/

services/

auth/

api/

hooks/

types/

constants/

utils/

Never place API logic inside screens.

Never place Axios requests inside components.

---

# Axios

Create a reusable Axios instance.

Example responsibilities:

Base URL

Headers

Authentication

Interceptors

Timeouts

Logging

Error Handling

All requests must use this instance.

---

# Authentication Service

Create reusable authentication functions.

Example:

signIn()

signUp()

signOut()

forgotPassword()

resetPassword()

verifyEmail()

getCurrentUser()

refreshSession()

UI components should never call Clerk directly.

Always use the authentication service.

---

# API Requests

Every request must include:

Loading state

Error state

Retry support

Response validation

TypeScript interfaces

Graceful failure

Never assume a request succeeds.

---

# Error Handling

Handle every possible failure.

Examples:

No internet

Timeout

401 Unauthorized

403 Forbidden

404 Not Found

500 Server Error

Invalid Response

Unexpected Error

Display friendly error messages.

Never expose raw server errors.

---

# Loading States

Every API request must have:

Skeleton

Spinner

Button Loading

Retry Option

Never leave users wondering.

---

# Types

Every API request must have:

Request Type

Response Type

Error Type

Never use any.

Never ignore TypeScript errors.

---

# Caching

Avoid unnecessary requests.

Cache where appropriate.

Examples:

Current User

Profile

Church Information

Bible Reading Plan

Daily Digest

---

# File Uploads

All uploads must use Supabase Storage.

Supported uploads:

Profile Picture

Celebration Cards

Images

Documents

Never store files locally after successful upload.

---

# Security

Never expose:

API Keys

Private Tokens

Secrets

Database Credentials

Server URLs that should remain private

Validate all user input.

Sanitize all outgoing requests.

---

# Folder Responsibilities

services/

Business logic.

api/

HTTP layer.

hooks/

Reusable data hooks.

types/

Interfaces.

constants/

API routes.

utils/

Helpers.

Keep responsibilities separate.

---

# Code Quality

Always:

Use reusable functions.

Extract constants.

Use descriptive names.

Write modular code.

Avoid duplication.

Follow existing project structure.

Do not refactor unrelated code.

---

# UI Protection

API integration must never change existing UI unless explicitly requested.

Do not redesign screens.

Do not change spacing.

Do not modify animations.

Do not alter typography.

Only connect functionality.

---

# Before Creating New Files

Always check whether:

A service already exists.

A hook already exists.

A type already exists.

A utility already exists.

Reuse before creating new code.

---

# Authentication Integration Checklist

Before implementation verify:

✓ Clerk Provider configured

✓ Publishable key loaded

✓ Secure session persistence

✓ Expo Router protection

✓ Public routes

✓ Protected routes

✓ Sign In works

✓ Sign Up works

✓ Forgot Password works

✓ Session restoration works

✓ Logout works

✓ Error handling works

✓ Loading states implemented

✓ Type safety maintained

---

# AI Development Rules

Before writing code:

Read the existing project.

Understand the architecture.

Reuse existing components.

Do not duplicate functionality.

Implement only the requested feature.

Do not make unrelated changes.

Do not introduce breaking changes.

Maintain backward compatibility.

If an implementation could affect other parts of the application, stop and choose the safest solution.

The objective is to build production-ready integrations that are clean, modular, scalable, and easy to maintain.
