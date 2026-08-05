# Design Spec: Revert Desktop Styles and Minify Mobile Text

Revert all desktop font sizes for headings and paragraphs to their original values while reducing the mobile paragraph font size to prevent wrapping/alignment issues on mobile screens.

## Design Details
* **Container Class (Mobile)**: Keep `w-full px-4` to maximize available width.
* **Heading Size (Mobile)**: Revert to `text-[10px] xs:text-[11px]` (UES) and `text-[11px]` (others).
* **Heading Size (Desktop)**: Revert to `sm:text-sm md:text-base` (all).
* **Paragraph Size (Mobile)**: Change to `text-[7px] xs:text-[7.5px]` (all).
* **Paragraph Size (Desktop)**: Revert to `sm:text-xs md:text-sm` (all).
* **UES Overlay Wrapping**: Split paragraph text into exactly two lines on mobile (using `<br />`).
* **Eastline Overlay Wrapping**: Split paragraph text into exactly three lines on mobile (using `<br />`).
