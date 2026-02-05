This analysis breaks down the **Remote** landing page into a "mathematical blueprint" to generate a precise `design.json` and a prompt for high-fidelity reconstruction.

### Part 1: The "X-Ray" Analysis (Layout & Metrics)

* **The Container Strategy:** Content is contained within a max-width of **1200px**, centered with fluid gutters. The hero section uses a **Vertical Stack** (Flexbox/Column) with center alignment.
* **The 8px Grid:** This site strictly adheres to 8px increments.
* **Hero Padding:** 120px Top / 80px Bottom.
* **Gap between elements:** 24px (Tag to Title), 32px (Title to Subtitle), 40px (Subtitle to Buttons).
* **Card Spacing:** 24px gap between the three pricing/segment cards.


* **Border Radius:** * **Buttons/Small Cards:** 12px.
* **Large Section Cards:** 24px.


* **Atmosphere:** Background is a "Ghost White" (`#FCFCFC`) with a subtle **Dot Grid** pattern overlay. Shadows are "Soft-Depth": `0px 4px 20px rgba(0,0,0,0.05)`.

### Part 2: The design.json

```json
{
  "theme": {
    "colors": {
      "background": "#FCFCFC",
      "textPrimary": "#1A1A1A",
      "textSecondary": "#4D4D4D",
      "brandPrimary": "#000000",
      "brandAccent": "#E6FF80",
      "border": "#E5E5E5"
    },
    "typography": {
      "fontFamily": "Inter, system-ui, sans-serif",
      "headings": {
        "weight": "600",
        "letterSpacing": "-0.03em",
        "lineHeight": "1.1"
      },
      "body": {
        "weight": "400",
        "lineHeight": "1.6"
      }
    },
    "spacing": {
      "unit": 8,
      "containerWidth": "1200px"
    }
  },
  "sections": [
    {
      "id": "hero",
      "type": "centered-stack",
      "elements": {
        "badge": {
          "text": "New: Announcing our $2.3M Seed Round",
          "styles": {
            "background": "#FFFFFF",
            "border": "1px solid #E5E5E5",
            "borderRadius": "100px",
            "padding": "8px 16px"
          },
          "highlight": "#E6FF80"
        },
        "headline": {
          "text": "Say hello to smarter hiring",
          "highlightStyle": "hand-drawn-circle",
          "fontSize": "84px"
        },
        "subtext": "A hiring platform that works the way you do.",
        "ctas": [
          {"label": "Try for free", "variant": "outline"},
          {"label": "Get a demo", "variant": "solid"}
        ]
      }
    },
    {
      "id": "plans",
      "type": "grid-3-col",
      "headline": "A plan for anyone. Anytime.",
      "cards": [
        {
          "title": "Startups",
          "bgImage": "low-opacity-person-working",
          "theme": "dark"
        },
        {
          "title": "Mid-size",
          "description": "See our standard pricing and get a customized quote.",
          "theme": "light"
        },
        {
          "title": "Enterprise",
          "description": "See our standard pricing and get a customized quote.",
          "theme": "light"
        }
      ]
    }
  ]
}

```

---

### Part 3: The AI Implementation Prompt

**Role:** Expert Frontend Engineer & UI Designer.
**Objective:** Replicate the "Remote" landing page sections provided in the images with 1:1 pixel accuracy.

**Core Layout Instructions:**

1. **Skeleton:** Use a 1200px max-width container. All vertical spacing must follow an 8px scale (e.g., margins of 16, 24, 32, 64, 120).
2. **Typography:** * Main Heading: Set font-weight to 600, letter-spacing to -0.04em, and color to `#1A1A1A`.
* The word "hello" and "smarter" in the hero must have a custom SVG "hand-drawn" highlight behind/around it in color `#E6FF80`.


3. **Components:**
* **Hero Badge:** Create a pill-shaped button with a small "New" tag inside a lime-green background.
* **Buttons:** Apply a `transition: all 0.2s ease` and a border-radius of `12px`. The "Solid" button is `#1A1A1A`; the "Outline" button has a 1px border of `#E5E5E5`.
* **Cards:** The "Startups" card needs a dark overlay (`rgba(0,0,0,0.6)`) over a grayscale/muted background image. The Mid-size and Enterprise cards are white with a subtle border and 24px padding.


4. **Visual Polish:**
* Add a subtle dot-grid background across the body using a repeating radial gradient.
* The "Changelog" floating button in the bottom right must be fixed, with a dark background and a "heart" icon inside the list icon.


5. **Specific Details:** Ensure the "arrow" icons in the buttons and cards are slim-profile (Lucide-style) and precisely centered.

