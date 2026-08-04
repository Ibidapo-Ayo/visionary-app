# AGENTS.md

## Project

Visionary App

A modern AI-powered ministry platform built for The Visionary Nation.

This project is built using:

- React Native
- Expo
- Expo Router
- TypeScript
- NativeWind
- Zustand
- React Query
- React Hook Form
- Axios

This application should feel like a premium consumer application rather than a traditional church application.

The overall experience should rival products such as Apple apps, Linear, Notion, Airbnb and Spotify while maintaining a distinctly Christian identity.

---

# Brand Identity

Primary Colors

Orange (#FF7A00)

Black (#111111)

Green (#16A34A)

White (#FFFFFF)

Orange is the primary action color.

Never introduce unrelated primary colors.

---

# Design Principles

Every screen must feel

- Premium
- Modern
- Calm
- Inspiring
- Elegant
- Spiritual
- Minimal
- Youthful

Avoid

- Crowded layouts
- Generic dashboards
- Material UI looking interfaces
- Bootstrap looking components
- Flat interfaces

---

# UX Rules

Every interaction should feel delightful.

Maximum three taps to reach any major feature.

Navigation should always be obvious.

Animations should reinforce user actions instead of distracting users.

Always prefer bottom sheets over navigating to unnecessary pages.

Every important action must have visual feedback.

---

# Motion

Animations are mandatory.

Use

- Reanimated
- Moti
- Lottie

Every screen transition should be smooth.

Cards should animate.

Lists should stagger.

Buttons should slightly scale when pressed.

Loading should feel alive.

---

# Glassmorphism

Glass effects should be used tastefully.

Use

- Blur
- Transparency
- Layer depth

Avoid excessive blur.

Accessibility always comes first.

---

# Typography

Use modern typography.

Strong hierarchy.

Large headlines.

Comfortable spacing.

Readable line heights.

---

# Components

Everything must be reusable.

Never duplicate UI.

Build components inside

/components

Variants should be configurable.

---

# Engineering Principles

Follow SOLID.

Follow DRY.

Follow Clean Architecture.

Separate

UI

Business Logic

Networking

Hooks

Services

Never mix responsibilities.

---

# Folder Structure

app/

components/

hooks/

services/

features/

store/

types/

constants/

assets/

utils/

providers/

lib/

---

# AI Counselor

This is the flagship feature.

The AI must feel compassionate.

Responses should reference scripture.

Display relevant verses.

Support follow-up questions.

Support prayer mode.

Support escalation to pastors.

Never design this like ChatGPT.

It should feel like a trusted spiritual companion.

---

# Attendance

Attendance is the second flagship feature.

The QR experience should be extremely fast.

Scanning should take one tap.

Success animations are required.

Attendance history should be visually engaging.

---

# Dashboard

Never build generic dashboards.

Every dashboard should feel alive.

Use

Progress

Charts

Insight cards

Quick actions

Upcoming events

Daily digest

Prayer

Attendance

Announcements

---

# Accessibility

Minimum touch target

44px

Support large text.

High contrast.

Readable typography.

---

# Performance

Lazy load screens.

Memoize expensive components.

Use FlashList where appropriate.

Avoid unnecessary renders.

---

# Code Quality

Strict TypeScript.

No any.

Meaningful naming.

Small functions.

Reusable hooks.

Reusable UI.

No duplicated logic.

---

# Testing

Every feature should build successfully.

Every change must preserve existing functionality.

Never leave TypeScript errors.

Never leave lint errors.

Always fix build errors before completing work.

Run type checks whenever changes are made.

If something breaks, fix it before moving on.

Never stop after introducing an error.

The repository should always remain in a working state.
