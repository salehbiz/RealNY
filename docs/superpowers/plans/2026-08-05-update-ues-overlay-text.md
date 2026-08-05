# Update UES Overlay Text Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the text content of the "Welcome to the Upper East Side" text overlay in the Hero section.

**Architecture:** Edit `src/components/Hero.tsx` to update the heading text to "Welcome to The Upper East Side" and the paragraph text with responsive line breaks.

**Tech Stack:** React, TypeScript

## Global Constraints

* Ensure proper mobile and desktop formatting per spec.
* Verify build compiles cleanly.

---

### Task 1: Update Hero.tsx Text

**Files:**
* Modify: [Hero.tsx](file:///Users/apple/Documents/Projects/RealNY/src/components/Hero.tsx)

- [ ] **Step 1: Replace UES text in Hero.tsx**
  * Modify `src/components/Hero.tsx` to update UES text:
    ```tsx
    {/* Frame 30 - 61: Welcome to the Upper East Side Text Overlay */}
    <div
      ref={neighborhoodRef}
      className="absolute left-0 right-0 mx-auto sm:left-12 sm:right-auto sm:mx-0 bottom-36 sm:bottom-28 z-30 w-[95vw] sm:w-auto max-w-xl sm:max-w-3xl space-y-1 sm:space-y-1.5 pointer-events-none transition-opacity duration-300 ease-out text-center sm:text-left px-2 sm:px-0"
      style={{ opacity: 0 }}
    >
      <h2
        data-typo-id="hero-f2-h2"
        data-typo-label="[Hero Section] Heading 2: Welcome to Upper East Side"
        className="font-rexton text-[10px] xs:text-[11px] sm:text-sm md:text-base font-bold tracking-[0.16em] sm:tracking-[0.25em] text-[#D6B585] uppercase whitespace-nowrap sm:whitespace-normal drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]"
      >
        Welcome to The Upper East Side
      </h2>
      <p
        data-typo-id="hero-f2-p"
        data-typo-label="[Hero Section] Paragraph 2: Welcome to Upper East Side"
        className="font-sora text-[9px] xs:text-[9.5px] sm:text-xs md:text-sm font-light tracking-tight sm:tracking-wide text-[#F4F5F8] leading-snug sm:leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]"
      >
        <span className="sm:hidden block">
          <span className="whitespace-nowrap block">A quieter side of Manhattan, where tree-lined streets</span>
          <span className="whitespace-nowrap block">meet all the shopping & transit conveniences.</span>
        </span>
        <span className="hidden sm:inline">A quieter side of Manhattan, where tree-lined streets<br />meet all the shopping & transit conveniences.</span>
      </p>
    </div>
    ```

- [ ] **Step 2: Run npm run build to verify no compilation errors**
  * Command: `npm run build`

- [ ] **Step 3: Commit changes**
  * Stage and commit files.
