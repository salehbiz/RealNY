# Force Explicit Mobile Line Wrapping Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Force explicit line wrapping for UES (2 lines) and Eastline (3 lines) on mobile viewports using `whitespace-nowrap block`.

**Architecture:** Edit `src/components/Hero.tsx` to wrap mobile segments.

**Tech Stack:** React, TypeScript, Tailwind CSS

## Global Constraints

* Do not alter desktop settings.
* Verify build compiles cleanly.

---

### Task 1: Update Hero.tsx

**Files:**
* Modify: [Hero.tsx](file:///Users/apple/Documents/Projects/RealNY/src/components/Hero.tsx)

- [ ] **Step 1: Wrap UES and Eastline paragraph texts**
  * Update UES paragraph in `src/components/Hero.tsx`:
    ```tsx
          <p
            data-typo-id="hero-f2-p"
            data-typo-label="[Hero Section] Paragraph 2: Welcome to Upper East Side"
            className="font-sora text-[8px] xs:text-[8.5px] sm:text-xs md:text-sm font-light tracking-tight sm:tracking-wide text-[#F4F5F8] leading-snug sm:leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]"
          >
            <span className="sm:hidden block">
              <span className="whitespace-nowrap block">A quieter side of Manhattan, where tree-lined streets</span>
              <span className="whitespace-nowrap block">meet all the shopping & transit conveniences.</span>
            </span>
            <span className="hidden sm:inline">A quieter side of Manhattan, where tree-lined streets<br />meet all the shopping & transit conveniences.</span>
          </p>
    ```
  * Update Eastline paragraph in `src/components/Hero.tsx`:
    ```tsx
          <p
            data-typo-id="hero-f3-p"
            data-typo-label="[Hero Section] Paragraph 3: The Eastline New York"
            className="font-sora text-[8px] xs:text-[8.5px] sm:text-xs md:text-sm font-light tracking-tight sm:tracking-wide text-[#F4F5F8] leading-snug sm:leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]"
          >
            <span className="sm:hidden block">
              <span className="whitespace-nowrap block">23-stories tall with over fifteen amenity spaces between them.</span>
              <span className="whitespace-nowrap block">198 spectacular homes, ranging from studios to three-bedrooms</span>
              <span className="whitespace-nowrap block">with private outdoor spaces in select units.</span>
            </span>
            <span className="hidden sm:inline">
              23-stories tall with over fifteen amenity spaces between them.<br />
              198 spectacular homes, ranging from studios to three-bedrooms<br />
              with private outdoor spaces in select units.
            </span>
          </p>
    ```

- [ ] **Step 2: Run npm run build to verify no compilation errors**
  * Command: `npm run build`

- [ ] **Step 3: Commit changes**
  * Stage and commit files.
