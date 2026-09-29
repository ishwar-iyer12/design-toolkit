---
name: motion
description: Rules for animation, transitions and 3D on the web. Use when asked for animation, motion, a 3D effect, a hero that moves, scroll effects or micro-interactions, or when a page feels static.
---

# Motion

Motion is part of the design, not a coat of paint on top. Apply these rules with the `taste` skill, not in place of it.

## Before you animate

1. Say what the motion is for, in one sentence. Good reasons: it shows how the product works, it shows where something came from, it confirms an action, it directs the eye to the one thing that matters. "It looks cool" is not a reason, but "it makes the first five seconds memorable" is, once per page.
2. Read the motion tokens in the design system variant. Use the token names for durations and easing.
3. Decide the still frame first. The page must look finished with every animation at its end state. Then add the movement.

## One signature, many whispers

- A page gets one signature animation. It is the thing someone would describe to a friend. Put it where the product is, usually the hero.
- Everything else is a whisper: 100 to 240ms, small distance, there to confirm or to orient.
- Build the signature from the product. An invoicing tool animates an invoice. A map tool animates a map. Floating abstract blobs, spinning cubes and particle fields belong to no product, so they belong on no page.

## Timing

- Whispers: `fast` (100ms) for hover and press, `base` (160ms) for small reveals, `slow` (240ms) for panels.
- Signature: up to 1200ms per beat, and no more than three beats before it rests.
- Things that enter ease out. Things that leave ease in. Things that move between two places ease both ways.
- Stagger a group by 40 to 80ms per item, and cap the total at 400ms. Past that, people wait.
- Nothing blocks input. The person can click, scroll and type while anything is moving.

## 3D

Use 3D when depth explains something: layers of a document, the front and back of a card, a stack being dealt. Do not use it to tilt a screenshot for no reason.

- Set `perspective` on the parent, between 800 and 1600px. Lower values distort.
- Put `transform-style: preserve-3d` on the element whose children sit at different depths.
- Be bold with the object, careful with the words. Text a person must read (headline, body, buttons) stays flat and never rotates. Text inside a depicted object, such as the lines of an invoice in the hero, is illustration and may sit at any angle.
- Rest in depth. When the signature ends, the object holds a pose that still reads as 3D: 15 to 35 degrees on at least two axes, layers visibly separated, shadows under each. If the rest pose is flat, the 3D exists for two seconds of a two-minute visit.
- Make it big. The signature object fills at least 40% of the hero's width on a desktop screen.
- Ground it. Give the object a surface to sit on or float above: a cast shadow, a floor line, a faint grid. An object with nothing under it has no depth to read.
- After it rests, it may breathe: a slow float of a few pixels or a degree or two, with still periods, that stops under reduced motion.
- Show the readable version too. If the object's contents matter, show them flat and legible elsewhere on the page.
- Give depth with `translateZ` and with shadow tokens that grow with height. A raised layer with no shadow looks pasted on.
- Hide the back of anything that flips: `backface-visibility: hidden`.
- Pointer-driven tilt is capped at 8 degrees, eased, and returns to rest when the pointer leaves. It does nothing on touch screens, so the design cannot depend on it.
- Prefer CSS transforms. Reach for WebGL or a 3D library only when the product is itself three-dimensional.

## Performance

- Animate `transform` and `opacity`. Nothing else, unless you have measured it.
- Never animate `width`, `height`, `top`, `left`, `margin` or `box-shadow`. To animate a shadow, cross-fade a pseudo-element that already has it.
- Never write `transition: all`. List the properties.
- Add `will-change` just before an animation and remove it after. Left on, it costs memory.
- Pause anything that is off screen. Use `IntersectionObserver` or `animation-play-state`.
- If it drops below 60 frames per second on a mid-range laptop, simplify it.

## Scroll

- Reveal on scroll once. Content that has appeared stays.
- Never change the speed or direction of scrolling. Never pin a section for more than one screen height.
- Content is in the document and visible without JavaScript. Motion is added on top.

## Reduced motion

Every animation has an answer for `prefers-reduced-motion: reduce`.

- The signature shows its end state, or cross-fades to it.
- Whispers become instant.
- Loops stop on a good frame.
- Parallax, tilt and auto-play are off.

Write the reduced-motion rule next to the animation, in the same block. Do not leave it for a clean-up pass.

## Loops

- A loop longer than five seconds has a visible pause control.
- A loop rests. Build in a still period at least as long as the movement.
- Nothing flashes more than three times a second.

## Smell test

Run this on your own output. A "yes" means rework.

1. Could this animation sit on any other product's page unchanged?
2. Does anything move that the person did not cause and cannot stop?
3. Is text moving while someone is meant to read it?
4. Do more than two things move at once, outside the signature?
5. Does the page look broken or empty with animations off?
6. Is anything animating a layout property?
7. Is there an animation with no reduced-motion rule?
8. Does everything fade up by 20px on scroll, section after section?
9. Take a screenshot ten seconds after load. Can you tell from the still that the page has 3D in it? If not, the rest pose is too flat.
10. Is the signature timid? If someone asked for something striking, would they say this is it?

## Report

Add these lines to the report from `taste`:

- Signature: what it is, and what it shows about the product.
- Reduced motion: what the person sees in place of it.
- Motion smell test: "passed", or what failed and what you changed.
