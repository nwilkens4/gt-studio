# Rain Animation Design

**Date:** 2026-05-14
**Status:** Approved

## Problem

The rain and overcast weather settings in GT Studio currently only affect lighting parameters and Three.js fog. There is no visual rain animation, so the "Rain" option feels inert.

## Goal

Add a light drizzle particle system inside the 3D scene that activates when the Rain weather option is selected.

## Approach

Three.js `Points` geometry with imperative per-frame mutation via `useFrame`. No new dependencies required.

## Architecture

A new `<RainSystem>` component is added to `src/components/CarViewer.jsx` alongside the existing `SceneLighting` component. It is rendered inside the R3F `<Canvas>` conditionally: `{weatherId === 'rain' && <RainSystem />}`.

The component:
- Creates a `BufferGeometry` once on mount (stored in `useRef`, never recreated)
- Uses `useFrame` to tick particle y-positions downward each frame
- Wraps particles that fall below y = -3 back to y = ~8 (top of volume)
- Unmounts cleanly when weather changes — R3F disposes geometry automatically

No changes to the store, config, or any other component.

## Particle Parameters

| Parameter | Value |
|-----------|-------|
| Count | 800 |
| Volume | 12×12 wide, 10 tall (centered on car) |
| Fall speed | 0.04 units/frame |
| Wind drift | 0.005 units/frame on x |
| Point size | 0.03 |
| Color | `#aaccdd` (cool blue-grey) |
| Opacity | 0.5 |

Particles are initialized at random positions within the volume so no burst effect occurs on load.

## Testing

A Playwright spec in `e2e/` will:
- Select the Rain weather option via the panel UI
- Assert the canvas is visible and the page renders without error

The existing lighting/fog behavior for rain is unchanged.

## Files Changed

- `src/components/CarViewer.jsx` — add `<RainSystem>` component and conditional render
- `e2e/rain-animation.spec.js` — new Playwright spec
