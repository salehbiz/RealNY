# Update Eastline Overlay Text Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the text content of the "The Eastline New York" text overlay in the Hero section.

**Architecture:** Edit `src/components/Hero.tsx` to update the heading text to "THE EASTLINE" and the paragraph text with responsive layout wrapping.

**Tech Stack:** React, TypeScript

## Global Constraints

* Ensure proper mobile and desktop formatting per spec.
* Verify build compiles cleanly.

---

### Task 1: Update Hero.tsx Text

**Files:**
* Modify: [Hero.tsx](file:///Users/apple/Documents/Projects/RealNY/src/components/Hero.tsx)

- [ ] **Step 1: Replace Eastline text in Hero.tsx**
  * Modify `src/components/Hero.tsx` to update Eastline text:
    ```tsx
    {/* Frame 62 - 101: The Eastline New York Text Overlay */}
    <div
      ref={eastlineRef}
      className="absolute left-0 right-0 mx-auto sm:left-12 sm:right-auto sm:mx-0 bottom-36 sm:bottom-28 z-30 w-[95vw] sm:w-auto max-w-xl sm:max-w-3xl space-y-1 sm:space-y-1.5 pointer-events-none transition-opacity duration-300 ease-out text-center sm:text-left px-2 sm:px-0"
      style={{ opacity: 0 }}
    >
      <h2
        data-typo-id="hero-f3-h2"
        data-typo-label="[Hero Section] Heading 3: The Eastline New York"
        className="font-rexton text-[11px] sm:text-sm md:text-base font-bold tracking-[0.2em] sm:tracking-[0.25em] text-[#D6B585] uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]"
      >
        THE EASTLINE
      </h2>
      <p
        data-typo-id="hero-f3-p"
        data-typo-label="[Hero Section] Paragraph 3: The Eastline New York"
        className="font-sora text-[9.5px] sm:text-xs md:text-sm font-light tracking-tight sm:tracking-wide text-[#F4F5F8] leading-snug sm:leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]"
      >
        <span className="sm:hidden">
          23-stories tall with over fifteen amenity spaces between them.<br />
          198 spectacular homes, ranging from studios to three-bedrooms<br />
          with private outdoor spaces in select units.
        </span>
        <span className="hidden sm:inline">
          23-stories tall with over fifteen amenity spaces between them.<br />
          198 spectacular homes, ranging from studios to three-bedrooms with private outdoor spaces in select units.
        </span>
      </p>
    </div>
    ```

- [ ] **Step 2: Run npm run build to verify no compilation errors**
  * Command: `npm run build`

- [ ] **Step 3: Commit changes**
  * Stage and commit files.
