# Update luxury heading Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the final overlay to change the heading to "Ready to Experience a New Line of Luxury?" (with mobile line wraps) and remove the paragraph text.

**Architecture:** Edit `src/components/Hero.tsx` to update the heading text, insert the mobile line breaks, and delete the `<p>` paragraph element.

**Tech Stack:** React, TypeScript

## Global Constraints

* Ensure clean line wrapping and compilation.
* Verify build compiles cleanly.

---

### Task 1: Update Hero.tsx

**Files:**
* Modify: [Hero.tsx](file:///Users/apple/Documents/Projects/RealNY/src/components/Hero.tsx)

- [ ] **Step 1: Replace final overlay JSX in Hero.tsx**
  * Modify `src/components/Hero.tsx` to update the final overlay block:
    ```tsx
    {/* Frame 118 - 178: Step into Luxury Text Overlay */}
    <div
      ref={lobbyRef}
      className="absolute left-0 right-0 mx-auto sm:left-12 sm:right-auto sm:mx-0 bottom-36 sm:bottom-28 z-30 w-[95vw] sm:w-auto max-w-xl sm:max-w-3xl space-y-1 sm:space-y-1.5 pointer-events-none transition-opacity duration-300 ease-out text-center sm:text-left px-2 sm:px-0"
      style={{ opacity: 0 }}
    >
      <h2
        data-typo-id="hero-f4-h2"
        data-typo-label="[Hero Section] Heading 4: Step into Luxury"
        className="font-rexton text-[11px] sm:text-sm md:text-base font-bold tracking-[0.2em] sm:tracking-[0.25em] text-[#D6B585] uppercase drop-shadow-[0_2px_6_rgba(0,0,0,0.95)]"
      >
        <span className="sm:hidden">
          Ready to Experience<br />a New Line of Luxury?
        </span>
        <span className="hidden sm:inline">
          Ready to Experience a New Line of Luxury?
        </span>
      </h2>
    </div>
    ```

- [ ] **Step 2: Run npm run build to verify no compilation errors**
  * Command: `npm run build`

- [ ] **Step 3: Commit changes**
  * Stage and commit files.
