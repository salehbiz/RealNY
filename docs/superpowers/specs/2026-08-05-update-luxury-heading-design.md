# Design Spec: Update luxury heading

Update the final text overlay (frames 118–178) to change the heading and remove the paragraph text.

## Design Details
* **Heading**: Update from "Step into Luxury" to "Ready to Experience a New Line of Luxury?".
* **Heading wrapping**:
  * Mobile:
    * Line 1: `Ready to Experience`
    * Line 2: `a New Line of Luxury?`
  * Desktop:
    * Single line: `Ready to Experience a New Line of Luxury?`
* **Heading casing**: Keep `uppercase` class so it renders in uppercase.
* **Paragraph**: Remove the entire `<p>` element (`hero-f4-p`) entirely.
