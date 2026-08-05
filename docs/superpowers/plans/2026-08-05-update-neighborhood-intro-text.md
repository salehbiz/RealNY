# Update Neighborhood Intro Text Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the copy for the neighborhood section introduction paragraph.

**Architecture:** Edit `src/components/NeighborhoodSection.tsx` to replace the paragraph text.

**Tech Stack:** React, TypeScript

## Global Constraints

* Do not touch image paths or layout.
* Verify build compiles cleanly.

---

### Task 1: Update NeighborhoodSection.tsx

**Files:**
* Modify: [NeighborhoodSection.tsx](file:///Users/apple/Documents/Projects/RealNY/src/components/NeighborhoodSection.tsx:68)

- [ ] **Step 1: Replace text in NeighborhoodSection.tsx**
  * Update the paragraph element at line 68:
    ```tsx
          <p className="font-sora text-[16.5px] tracking-[-0.04em] leading-[1.0] text-[#101535]/80 font-light max-w-2xl mx-auto text-center [text-wrap:balance]">
            ButterflyMX keyless entry and video intercom put building access, guest entry, and package delivery on your phone. Verizon Fios and Spectrum service are available throughout.
          </p>
    ```

- [ ] **Step 2: Run npm run build to verify no compilation errors**
  * Command: `npm run build`

- [ ] **Step 3: Commit changes**
  * Stage and commit files.
