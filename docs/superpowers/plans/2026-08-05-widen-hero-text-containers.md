# Widen Hero Text Containers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Widen Hero text containers and format paragraph line wraps to exactly 2 (UES) and 3 (Eastline) lines on mobile.

**Architecture:** Edit `src/components/Hero.tsx` to update container wrapper classes and paragraph contents.

**Tech Stack:** React, TypeScript, Tailwind CSS

## Global Constraints

* Ensure consistent container dimensions.
* Verify build compiles cleanly.

---

### Task 1: Update Hero.tsx

**Files:**
* Modify: [Hero.tsx](file:///Users/apple/Documents/Projects/RealNY/src/components/Hero.tsx)

- [ ] **Step 1: Replace container classes and UES paragraph format**
  * Update the three container wrapper divs to use `w-full` instead of `w-[95vw]` and `px-4` instead of `px-2` on mobile.
  * Update the UES paragraph mobile span to use a clean `<br />` tag for exactly 2 lines.
  * Verify the final file compiles without any styling/syntax issues.

- [ ] **Step 2: Run npm run build to verify no compilation errors**
  * Command: `npm run build`

- [ ] **Step 3: Commit changes**
  * Stage and commit files.
