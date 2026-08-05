# Update Skyline Descriptions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the copy for all three categories in the Skyline section.

**Architecture:** Edit `src/components/SkylineSection.tsx` categories array with the new description strings.

**Tech Stack:** React, TypeScript

## Global Constraints

* Do not touch image paths or tab logic.
* Verify build compiles cleanly.

---

### Task 1: Update SkylineSection.tsx

**Files:**
* Modify: [SkylineSection.tsx](file:///Users/apple/Documents/Projects/RealNY/src/components/SkylineSection.tsx)

- [ ] **Step 1: Replace descriptions in categories array**
  * Update the categories description properties in `src/components/SkylineSection.tsx`:
    ```typescript
    const categories = [
      {
        id: 'architecture',
        tabLabel: 'Architecture',
        title: 'Architecture',
        description: 'Twenty-three stories of floor-to-ceiling glass, with double exposures in select residences. The striking facade is adorned with a rich shade of deep blue & accents of royal gold, all while paying respects to the fabric of the neighborhood.',
        image: media('/images/building-entrance.webp'),
        imageMobile: media('/images/building-entrance-mobile.webp'),
      },
      {
        id: 'interiors',
        tabLabel: 'Interior',
        title: 'Interior',
        description: 'Up to nine-foot ceilings, engineered prefinished hardwood, and custom built-out closets in every residence. Two distinct color palettes are offered, creating variety for all residents.',
        image: media('/images/skyline-interiors.webp'),
        imageMobile: media('/images/skyline-interiors-mobile.webp'),
      },
      {
        id: 'amenities',
        tabLabel: 'Amenities',
        title: 'Amenities',
        description: 'Over fifteen amenity spaces across two buildings, two rooftops, endless moments of relaxation and connection. Most buildings offer amenities. The Eastline offers a lifestyle designed with you in mind.',
        image: media('/images/skyline-amenities.webp'),
        imageMobile: media('/images/skyline-amenities-mobile.webp'),
      },
    ];
    ```

- [ ] **Step 2: Run npm run build to verify no compilation errors**
  * Command: `npm run build`

- [ ] **Step 3: Commit changes**
  * Stage and commit files.
