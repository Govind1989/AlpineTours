This is a sophisticated design challenge that perfectly blends **high-end product visualization (using an image generation workflow)** with **progressive disclosure UI (using GSAP)**.

Here is your complete guide to achieving this: first by defining the image generation strategy, then providing the GSAP implementation plan.

-----


### Step 2: The GSAP ScrollTrigger Integration Plan

Once you have your four premium, consistent images (let's name them `bike_side.png`, `bike_front.png`, `bike_rear.png`, `bike_cockpit.png`), you build the component.

The key to a premium feel is **fluid transition** (cross-fades) and **staggered UI element reveals**.

#### The UI Structure (Mental Model):

```html
<div class="bike-showcase-container">

  <div class="image-stack">
    <img src="bike_side.png" id="img-profile" class="active">
    <img src="bike_front.png" id="img-front">
    <img src="bike_rear.png" id="img-rear">
    <img src="bike_cockpit.png" id="img-cockpit">
  </div>

  <div class="label-layer" id="reveal-suspension">...</div>
  <div class="label-layer" id="reveal-front-abs">...</div>
  <div class="label-layer" id="reveal-rear-abs">...</div>
  <div class="label-layer" id="reveal-cockpit-tech">...</div>

</div>
```

#### Detailed GSAP Logic & ScrollTrigger Setup:

This timeline tells the story. The key here is not just rotating the bike, but simultaneously revealing a *new part of its soul*.

| Scroll Stage | Visual Action (Bike) | Feature Reveal (UI) | GSAP Animation Instruction |
| :--- | :--- | :--- | :--- |
| **Init** | `bike_side.png` visible. | None. | Set all image overlays to `opacity: 0`, and UI layers to `autoAlpha: 0`. |
| **1. Pin & Reveal** | Section Pin. <br>Start smooth fade. | Fade-in long line and label: **"PREMIUM TELESCOPIC FORK"** | **Action:** `ScrollTrigger.pin(container)`. `gsap.to(reveal_suspension, {autoAlpha: 1})`. |
| **2. Fade 1** | Cross-fade `bike_side` -\> `bike_front`. | Fade out Suspension. <br>Fade-in: **"DUAL-CHANNEL ABS (FRONT)"** | **Action:** `gsap.to(img_profile, {opacity: 0})`. `gsap.to(img_front, {opacity: 1})`. `gsap.to(reveal_abs_front, {autoAlpha: 1, stagger: 0.1})`. |
| **3. Fade 2** | Cross-fade `bike_front` -\> `bike_rear`. | Fade out Front ABS. <br>Fade-in: **"DUAL-CHANNEL ABS (REAR)"** | **Action:** `gsap.to(img_front, {opacity: 0})`. `gsap.to(img_rear, {opacity: 1})`. `gsap.to(reveal_abs_rear, {autoAlpha: 1, stagger: 0.1})`. |
| **4. Fade 3** | Cross-fade `bike_rear` -\> `bike_cockpit`. | Fade out Rear ABS. <br>Fade-in: **"INTUITIVE COCKPIT & NAVIGATION"** | **Action:** `gsap.to(img_rear, {opacity: 0})`. `gsap.to(img_cockpit, {opacity: 1})`. `gsap.to(reveal_tech, {autoAlpha: 1})`. |
| **Exit** | Section unpins. | (All UI fades out/staggers out) | Allow the page to scroll. |

### Technical Code Implementation (Ready for Coding Agent)

*Copy and paste this technical directive into your coding environment:*

```javascript
// GSAP TECHNICAL IMPLEMENTATION SPECIFICATION
// PROJECT: Alpine Trek Nepal - Premium Bike Showcase Component
// TECH: React, GSAP, ScrollTrigger, Tailwind (for layout).

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const BikeShowcase = () => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    // 1. PIN the main container for a fluid, contained experience.
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,        // Pin the entire container
        scrub: 1,         // Smooth, fluid animation linked to scroll
        start: "top top",
        end: "+=3000px",  // Extend the scrollable "distance" of the experience
      },
    });

    // 2. Initial STATE setup (premium, hidden UI)
    tl.set(".bike-image", { opacity: 0 }); // Hide all images except the first.
    tl.set(".feature-line", { scaleX: 0, transformOrigin: "left" }); // Draw line from left.
    tl.set(".feature-label", { autoAlpha: 0 }); // Hide text labels.

    // Show the first image immediately.
    tl.set("#img-profile", { opacity: 1 });

    // --- SCROLL ANIMATION TIMELINE ---

    // [ST-1] Reveal First Feature (Suspension)
    tl.to("#reveal-suspension .feature-line", { scaleX: 1, duration: 1 }) // Draw line
      .to("#reveal-suspension .feature-label", { autoAlpha: 1, duration: 0.5 }, "<0.2") // Stagger text
      .to("#reveal-suspension", { autoAlpha: 0, delay: 0.5 }); // Stagger Out.

    // [ST-2] Bike Fades to Front & Reveal ABS
    tl.to("#img-profile", { opacity: 0, duration: 1.5 })
      .to("#img-front", { opacity: 1, duration: 1.5 }, "<") // Cross-fade
      .to("#reveal-abs-front .feature-line", { scaleX: 1, duration: 1 }) // Draw line
      .to("#reveal-abs-front .feature-label", { autoAlpha: 1, duration: 0.5 }, "<0.2") // Stagger text
      .to("#reveal-abs-front", { autoAlpha: 0, delay: 0.5 }); // Stagger Out.

    // [ST-3] Bike Fades to Rear & Reveal REAR ABS
    tl.to("#img-front", { opacity: 0, duration: 1.5 })
      .to("#img-rear", { opacity: 1, duration: 1.5 }, "<") // Cross-fade
      .to("#reveal-abs-rear .feature-line", { scaleX: 1, duration: 1 }) // Draw line
      .to("#reveal-abs-rear .feature-label", { autoAlpha: 1, duration: 0.5 }, "<0.2") // Stagger text
      .to("#reveal-abs-rear", { autoAlpha: 0, delay: 0.5 }); // Stagger Out.

    // [ST-4] Bike Fades to Cockpit & Reveal Tech
    tl.to("#img-rear", { opacity: 0, duration: 1.5 })
      .to("#img-cockpit", { opacity: 1, duration: 1.5 }, "<") // Cross-fade
      .to("#reveal-cockpit-tech .feature-line", { scaleX: 1, duration: 1 }) // Draw line
      .to("#reveal-cockpit-tech .feature-label", { autoAlpha: 1, duration: 0.5 }, "<0.2") // Stagger text
      // NOTE: Leave the last label or fade it out just before unpinning.
      .to("#reveal-cockpit-tech", { autoAlpha: 0, delay: 0.5, duration: 0.5 });

    // Ensure cleanup of the ScrollTrigger on component unmount.
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="bike-showcase-container h-screen relative bg-white flex items-center justify-center overflow-hidden">
      {/* Background Image Stack */}
      <div className="image-stack absolute inset-0 w-full h-full flex items-center justify-center">
        <img src="/bike_side.png" id="img-profile" className="bike-image absolute max-h-[80%]" />
        <img src="/bike_front.png" id="img-front" className="bike-image absolute max-h-[80%]" />
        <img src="/bike_rear.png" id="img-rear" className="bike-image absolute max-h-[80%]" />
        <img src="/bike_cockpit.png" id="img-cockpit" className="bike-image absolute max-h-[80%]" />
      </div>

      {/* --- FEATURE OVERLAY UI LAYERS (TAILWIND STYLE) --- */}

      {/* Reveal 1: Suspension */}
      <div id="reveal-suspension" className="feature-layer absolute top-[30%] left-[20%] z-10">
        <div className="feature-line w-40 h-[2px] bg-red-600 mb-2"></div>
        <div className="feature-label text-gray-900 font-medium">PREMIUM TELESCOPIC FORK</div>
        <p className="feature-label text-sm text-gray-700">Class-leading stability on rough Himalayan terrain.</p>
      </div>

      {/* Reveal 2: Front ABS (Shown when front wheel is visible) */}
      <div id="reveal-abs-front" className="feature-layer absolute bottom-[35%] left-[25%] z-10">
        <div className="feature-line w-48 h-[2px] bg-blue-600 mb-2"></div>
        <div className="feature-label text-gray-900 font-medium">DUAL-CHANNEL ABS (FRONT)</div>
        <p className="feature-label text-sm text-gray-700">Confident braking in Mustang's rocky descents.</p>
      </div>

      {/* Reveal 3: Rear ABS */}
      <div id="reveal-abs-rear" className="feature-layer absolute top-[40%] right-[15%] z-10 text-right">
        <div className="feature-line w-48 h-[2px] bg-blue-600 mb-2 transform-origin-right"></div>
        <div className="feature-label text-gray-900 font-medium">DUAL-CHANNEL ABS (REAR)</div>
        <p className="feature-label text-sm text-gray-700">Precision control and power-sliding capability.</p>
      </div>

       {/* Reveal 4: Cockpit */}
       <div id="reveal-cockpit-tech" className="feature-layer absolute bottom-[30%] right-[20%] z-10 text-right">
        <div className="feature-line w-40 h-[2px] bg-gray-900 mb-2 transform-origin-right"></div>
        <div className="feature-label text-gray-900 font-medium">INTUITIVE COCKPIT & NAVIGATION</div>
        <p className="feature-label text-sm text-gray-700">Stay connected with Royal Enfield Tripper navigation.</p>
      </div>

    </div>
  );
};

export default BikeShowcase;
```