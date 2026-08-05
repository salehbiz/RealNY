# Design Spec: Reduce Hero Font Sizes

Reduce font sizes for all text overlays in the Hero section so they fit properly on mobile and desktop viewports, and remove the clipping issue on mobile.

## Design Details
* **Heading Size (Mobile)**: `text-[8.5px] xs:text-[9.5px]`
* **Heading Size (Desktop)**: `sm:text-[11.5px] md:text-[12.5px]`
* **Paragraph Size (Mobile)**: `text-[8px] xs:text-[8.5px]`
* **Paragraph Size (Desktop)**: `sm:text-[10.5px] md:text-[11.5px]`
* **UES Overlay Layout**: Remove `whitespace-nowrap` class from mobile span lines to let them wrap naturally on small viewports.
