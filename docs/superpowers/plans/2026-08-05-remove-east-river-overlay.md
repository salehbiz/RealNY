# Remove East River Overlay Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the "EAST RIVER" overlay entirely from the Hero section while keeping all other components and timings intact.

**Architecture:** Edit [Hero.tsx](file:///Users/apple/Documents/Projects/RealNY/src/components/Hero.tsx) to remove `riverEastRef` definition, its progress calculations (frames 2-17), and its DOM elements.

**Tech Stack:** React, TypeScript, Vite

## Global Constraints

* Touch nothing else. No changes to UES, Eastline, or lobby overlays.
* Verify clean build and no references to `riverEast` left.

---

### Task 1: Modify Hero.tsx

**Files:**
* Modify: [Hero.tsx](file:///Users/apple/Documents/Projects/RealNY/src/components/Hero.tsx)

- [ ] **Step 1: Remove the riverEastRef declaration**
  * Find and delete the following line in `Hero.tsx`:
    ```typescript
    const riverEastRef = useRef<HTMLDivElement>(null);
    ```

- [ ] **Step 2: Remove the riverEastOpacity scroll calculations**
  * Find and delete the following block in the `onProgress` callback of `Hero.tsx`:
    ```typescript
    // 2. River East text overlay opacity (Frames 2 - 17)
    let riverEastOpacity = 0;
    if (frameNum >= 2 && frameNum <= 17) {
      if (frameNum < 4) {
        riverEastOpacity = (frameNum - 1) / 3;
      } else if (frameNum > 14) {
        riverEastOpacity = (17 - frameNum) / 3;
      } else {
        riverEastOpacity = 1;
      }
    }
    if (riverEastRef.current) {
      riverEastRef.current.style.opacity = String(riverEastOpacity);
    }
    ```

- [ ] **Step 3: Remove the River East text overlay div element**
  * Find and delete the following JSX element in `Hero.tsx`:
    ```tsx
    {/* Frame 2 - 17: East River Text Overlay */}
    <div
      ref={riverEastRef}
      className="absolute left-0 right-0 mx-auto sm:left-12 sm:right-auto sm:mx-0 bottom-36 sm:bottom-28 z-30 w-[95vw] sm:w-auto max-w-xl sm:max-w-3xl space-y-1 sm:space-y-1.5 pointer-events-none transition-opacity duration-300 ease-out text-center sm:text-left px-2 sm:px-0"
      style={{ opacity: 0 }}
    >
      <h2
        data-typo-id="hero-f1-h2"
        data-typo-label="[Hero Section] Heading 1: East River"
        className="font-rexton text-[11px] sm:text-sm md:text-base font-bold tracking-[0.2em] sm:tracking-[0.25em] text-[#D6B585] uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]"
      >
        East River
      </h2>
      <p
        data-typo-id="hero-f1-p"
        data-typo-label="[Hero Section] Paragraph 1: East River"
        className="font-sora text-[9.5px] sm:text-xs md:text-sm font-light tracking-tight sm:tracking-wide text-[#F4F5F8] leading-snug sm:leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]"
      >
        <span className="sm:hidden">Where Manhattan meets the water, a rare stretch<br />of calm along the East River's edge.</span>
        <span className="hidden sm:inline">Where Manhattan meets the water, a rare stretch of calm<br />along the East River's edge.</span>
      </p>
    </div>
    ```

- [ ] **Step 4: Verify that no references to "riverEast" remain in src**
  * Run grep command to ensure zero occurrences of `riverEast` or `riverEastRef` inside `src`.

- [ ] **Step 5: Run lint and production build to verify no errors**
  * Run `npm run build` to confirm everything builds cleanly.

- [ ] **Step 6: Commit changes**
  * Run `git add src/components/Hero.tsx` and commit.
