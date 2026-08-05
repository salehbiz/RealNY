# Revert Desktop Styles and Minify Mobile Text Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Revert desktop classes to original values and reduce mobile paragraph font size to `text-[7px] xs:text-[7.5px]`.

**Architecture:** Edit `src/components/Hero.tsx` to update typography classes.

**Tech Stack:** React, TypeScript, Tailwind CSS

## Global Constraints

* Do not touch other layouts or scroll speeds.
* Verify build compiles cleanly.

---

### Task 1: Update Hero.tsx

**Files:**
* Modify: [Hero.tsx](file:///Users/apple/Documents/Projects/RealNY/src/components/Hero.tsx)

- [ ] **Step 1: Replace classes in Hero.tsx**
  * Update typography classes in `src/components/Hero.tsx`:
    * UES Heading: change back to `className="font-rexton text-[10px] xs:text-[11px] sm:text-sm md:text-base font-bold tracking-[0.16em] sm:tracking-[0.25em] text-[#D6B585] uppercase whitespace-nowrap sm:whitespace-normal drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]"`
    * UES Paragraph: change to `className="font-sora text-[7px] xs:text-[7.5px] sm:text-xs md:text-sm font-light tracking-tight sm:tracking-wide text-[#F4F5F8] leading-snug sm:leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]"`
    * Eastline Heading: change back to `className="font-rexton text-[11px] sm:text-sm md:text-base font-bold tracking-[0.2em] sm:tracking-[0.25em] text-[#D6B585] uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]"`
    * Eastline Paragraph: change to `className="font-sora text-[7px] xs:text-[7.5px] sm:text-xs md:text-sm font-light tracking-tight sm:tracking-wide text-[#F4F5F8] leading-snug sm:leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]"`
    * Luxury Heading: change back to `className="font-rexton text-[11px] sm:text-sm md:text-base font-bold tracking-[0.2em] sm:tracking-[0.25em] text-white uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]"`

- [ ] **Step 2: Run npm run build to verify no compilation errors**
  * Command: `npm run build`

- [ ] **Step 3: Commit changes**
  * Stage and commit files.
