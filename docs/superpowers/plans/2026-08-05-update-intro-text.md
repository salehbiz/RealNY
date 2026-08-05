# Update Intro Section Text Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the paragraph text of the Intro section.

**Architecture:** Edit `src/components/IntroSection.tsx` to replace the body text in the paragraph tag.

**Tech Stack:** React, TypeScript

## Global Constraints

* Do not touch any button logic or layout.
* Verify build compiles cleanly.

---

### Task 1: Update IntroSection.tsx

**Files:**
* Modify: [IntroSection.tsx](file:///Users/apple/Documents/Projects/RealNY/src/components/IntroSection.tsx)

- [ ] **Step 1: Replace text in IntroSection.tsx**
  * Modify `src/components/IntroSection.tsx` to update the body text:
    ```tsx
        {/* Paragraph */}
        <p
          data-typo-id="home-intro-body"
          data-typo-label="Home / Intro Paragraph"
          className="univ-p-body text-[#101535]/80 max-w-2xl mx-auto text-center [text-wrap:balance]"
        >
          The Eastline stands at 1655 First Avenue and 355 East 86th Street. Two addresses hold 198 residences, from studio through three-bedroom, and more than fifteen amenity spaces across two connected buildings. The very best in luxury living on the Upper East Side is here.
        </p>
    ```

- [ ] **Step 2: Run npm run build to verify no compilation errors**
  * Command: `npm run build`

- [ ] **Step 3: Commit changes**
  * Stage and commit files.
