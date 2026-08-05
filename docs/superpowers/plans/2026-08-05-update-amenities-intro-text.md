# Update Amenities Intro Text Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the copy for the amenities introduction block on the home page and amenities page.

**Architecture:** Edit `src/components/LifestyleSection.tsx` and `src/components/AmenitiesPage.tsx` to update the paragraph copy.

**Tech Stack:** React, TypeScript

## Global Constraints

* Do not touch other slider or navigation components.
* Verify build compiles cleanly.

---

### Task 1: Update LifestyleSection.tsx

**Files:**
* Modify: [LifestyleSection.tsx](file:///Users/apple/Documents/Projects/RealNY/src/components/LifestyleSection.tsx:186)

- [ ] **Step 1: Replace text in LifestyleSection.tsx**
  * Update the paragraph element at line 186:
    ```tsx
          <p className="font-sora text-[15px] tracking-[-0.015em] leading-[1.0] text-[#101535]/80 font-light max-w-2xl mx-auto text-center [text-wrap:balance]">
            The courtyards open the base of the buildings to daylight and air, so the shared spaces read as outdoor rooms rather than interior corridors. Above, two landscaped rooftops crown the towers, and the 23rd floor holds the Sky Lounge: the highest room in the building.
          </p>
    ```

---

### Task 2: Update AmenitiesPage.tsx

**Files:**
* Modify: [AmenitiesPage.tsx](file:///Users/apple/Documents/Projects/RealNY/src/components/AmenitiesPage.tsx:397)

- [ ] **Step 1: Replace text in AmenitiesPage.tsx**
  * Update the paragraph element at line 397:
    ```tsx
            <p className="univ-p-body text-[#101535]/80 max-w-2xl mx-auto text-center [text-wrap:balance]">
              The courtyards open the base of the buildings to daylight and air, so the shared spaces read as outdoor rooms rather than interior corridors. Above, two landscaped rooftops crown the towers, and the 23rd floor holds the Sky Lounge: the highest room in the building.
            </p>
    ```

---

### Task 3: Build & Commit

- [ ] **Step 1: Run npm run build**
- [ ] **Step 2: Commit changes to git**
