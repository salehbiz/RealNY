# Design Spec: Reduce Side Padding and Minify Mobile Paragraphs

Reduce the side padding of the text overlay containers to maximize horizontal text space, and reduce mobile paragraph font sizes to prevent viewport clipping.

## Design Details
* **Container Padding (Mobile)**: Change `px-4` to `px-1` for all overlay containers in `Hero.tsx` on mobile.
* **UES Paragraph Size (Mobile)**: Change from `text-[8px] xs:text-[8.5px]` to `text-[7.2px] xs:text-[7.6px]`.
* **Eastline Paragraph Size (Mobile)**: Change from `text-[8px] xs:text-[8.5px]` to `text-[7.2px] xs:text-[7.6px]`.
* **Desktop View**: Unchanged.
* **Explicit Line Breaks**: Maintain the `whitespace-nowrap block` segments on mobile.
