# Reduce Hero Font Sizes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce Hero overlays text font sizes and fix UES mobile overflow.

**Architecture:** Edit `src/components/Hero.tsx` to update classes on all headings and paragraphs in the scroll overlays.

**Tech Stack:** React, TypeScript, Tailwind CSS

## Global Constraints

* Unify the size changes across UES, Eastline, and Luxury overlays.
* Verify build compiles cleanly.

---

### Task 1: Update Hero.tsx

**Files:**
* Modify: [Hero.tsx](file:///Users/apple/Documents/Projects/RealNY/src/components/Hero.tsx)

- [ ] **Step 1: Update text size classes and remove UES whitespace-nowrap**
  * Update the text size classes for UES, Eastline, and Luxury overlays in `Hero.tsx` to use the new spec sizes.
  * UES heading: change to `className="font-rexton text-[8.5px] xs:text-[9.5px] sm:text-[11.5px] md:text-[12.5px] ..."`
  * UES paragraph: change to `className="font-sora text-[8px] xs:text-[8.5px] sm:text-[10.5px] md:text-[11.5px] ..."`
  * UES mobile span: remove `whitespace-nowrap` class:
    ```tsx
    <span className="sm:hidden block">
      <span className="block">A quieter side of Manhattan, where tree-lined streets</span>
      <span className="block">meet all the shopping & transit conveniences.</span>
    </span>
    ```
  * Eastline heading: change to `className="font-rexton text-[8.5px] xs:text-[9.5px] sm:text-[11.5px] md:text-[12.5px] ..."`
  * Eastline paragraph: change to `className="font-sora text-[8px] xs:text-[8.5px] sm:text-[10.5px] md:text-[11.5px] ..."`
  * Luxury heading: change to `className="font-rexton text-[8.5px] xs:text-[9.5px] sm:text-[11.5px] md:text-[12.5px] ..."`

- [ ] **Step 2: Run npm run build to verify no compilation errors**
  * Command: `npm run build`

- [ ] **Step 3: Commit changes**
  * Stage and commit files.
