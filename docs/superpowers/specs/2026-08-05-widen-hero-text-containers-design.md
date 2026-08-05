# Design Spec: Widen Hero Text Containers and Format Wraps

Widen the layout containers for text overlays on mobile to prevent premature line wrapping, and set exact line breaks for the UES and Eastline paragraph blocks.

## Design Details
* **Container Class (Mobile)**: Change `w-[95vw]` to `w-full` and `px-2` to `px-4` for all three scroll overlay containers in `Hero.tsx`.
* **UES Overlay Wrapping**: Split paragraph text into exactly two lines on mobile:
  * Line 1: `A quieter side of Manhattan, where tree-lined streets`
  * Line 2: `meet all the shopping & transit conveniences.`
* **Eastline Overlay Wrapping**: Split paragraph text into exactly three lines on mobile:
  * Line 1: `23-stories tall with over fifteen amenity spaces between them.`
  * Line 2: `198 spectacular homes, ranging from studios to three-bedrooms`
  * Line 3: `with private outdoor spaces in select units.`
