# Design Spec: Force Explicit Mobile Line Wrapping

Force exact line counts for UES (2 lines) and Eastline (3 lines) overlay texts on mobile by wrapping each line segment in a `whitespace-nowrap block` element.

## Design Details
* **UES Overlay Wrapping (Mobile)**:
  * Line 1: `A quieter side of Manhattan, where tree-lined streets` (wrapped in `whitespace-nowrap block`)
  * Line 2: `meet all the shopping & transit conveniences.` (wrapped in `whitespace-nowrap block`)
* **Eastline Overlay Wrapping (Mobile)**:
  * Line 1: `23-stories tall with over fifteen amenity spaces between them.` (wrapped in `whitespace-nowrap block`)
  * Line 2: `198 spectacular homes, ranging from studios to three-bedrooms` (wrapped in `whitespace-nowrap block`)
  * Line 3: `with private outdoor spaces in select units.` (wrapped in `whitespace-nowrap block`)
* **Typography Classes (Mobile)**:
  * UES Paragraph: `text-[8px] xs:text-[8.5px]`
  * Eastline Paragraph: `text-[8px] xs:text-[8.5px]`
