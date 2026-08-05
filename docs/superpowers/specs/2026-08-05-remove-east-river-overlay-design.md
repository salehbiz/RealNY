# Design Spec: Remove East River Overlay

Remove the "EAST RIVER" overlay entirely from the Hero section while keeping the rest of the scroll timeline and other overlays unchanged.

## Design Details
* **Remove "EAST RIVER" Overlay**: Remove the DOM element, the React ref (`riverEastRef`), and the frame opacity logic (frames 2–17) in [Hero.tsx](file:///Users/apple/Documents/Projects/RealNY/src/components/Hero.tsx).
* **Maintain Scrolling Timeline**: Do not alter frame-to-scroll mapping or shift subsequent overlays. The UES overlay will still begin at frame 30.
* **Scope Guard**: Touch nothing else.
