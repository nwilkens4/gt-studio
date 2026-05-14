# Rain Animation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a light drizzle particle system inside the 3D scene that activates when the Rain weather option is selected.

**Architecture:** A self-contained `RainSystem` R3F component is added to `CarViewer.jsx`. It creates a `BufferGeometry` with 800 particles on mount and mutates their positions each frame via `useFrame`. The Canvas `frameloop` switches from `"demand"` to `"always"` when rain is active so `useFrame` fires continuously.

**Tech Stack:** React 19, @react-three/fiber (`useFrame`), Three.js (`BufferGeometry`, `Points`, `PointsMaterial`), Playwright for e2e.

---

### Task 1: Add RainSystem component to CarViewer

**Files:**
- Modify: `src/components/CarViewer.jsx`

**Step 1: Add `useFrame` to the @react-three/fiber import**

Current line 2:
```js
import { Canvas, useThree } from '@react-three/fiber'
```
Change to:
```js
import { Canvas, useThree, useFrame } from '@react-three/fiber'
```

**Step 2: Add the RainSystem component**

Insert this block after the `CameraRig` function (after line 57, before `LoadingBar`):

```jsx
const RAIN_COUNT = 800
const RAIN_AREA = 12   // half-width of the spawn box (±12 on x and z)
const RAIN_TOP  = 8    // y spawn ceiling
const RAIN_BOT  = -3   // y floor — wraps back to top
const FALL_SPEED = 0.04
const DRIFT_X    = 0.005

function RainSystem() {
  const geoRef = useRef()

  // Build initial random positions once on mount
  const initialPositions = useMemo(() => {
    const pos = new Float32Array(RAIN_COUNT * 3)
    for (let i = 0; i < RAIN_COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * RAIN_AREA * 2
      pos[i * 3 + 1] = Math.random() * (RAIN_TOP - RAIN_BOT) + RAIN_BOT
      pos[i * 3 + 2] = (Math.random() - 0.5) * RAIN_AREA * 2
    }
    return pos
  }, [])

  useFrame(() => {
    const pos = geoRef.current?.attributes.position.array
    if (!pos) return
    for (let i = 0; i < RAIN_COUNT; i++) {
      pos[i * 3]     += DRIFT_X
      pos[i * 3 + 1] -= FALL_SPEED
      if (pos[i * 3 + 1] < RAIN_BOT) {
        pos[i * 3]     = (Math.random() - 0.5) * RAIN_AREA * 2
        pos[i * 3 + 1] = RAIN_TOP
        pos[i * 3 + 2] = (Math.random() - 0.5) * RAIN_AREA * 2
      }
    }
    geoRef.current.attributes.position.needsUpdate = true
  })

  return (
    <points>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute
          attach="attributes-position"
          args={[initialPositions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#aaccdd"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  )
}
```

**Step 3: Make the Canvas frameloop dynamic**

The Canvas currently has `frameloop="demand"` (line 137). When rain is active, `useFrame` needs the loop running continuously. Change the Canvas opening tag:

```jsx
<Canvas
  frameloop={weatherId === 'rain' ? 'always' : 'demand'}
  camera={{ position: [12, 5, 12], fov: 45 }}
  gl={{ toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.85 }}
  style={{ background: '#000000' }}
>
```

**Step 4: Render RainSystem conditionally inside Canvas**

Add this line after `<SceneLighting ... />` (after line 142):

```jsx
{weatherId === 'rain' && <RainSystem />}
```

**Step 5: Start the dev server and verify visually**

```bash
npm run dev
```

Open `http://localhost:5173`, open the panel, select **Rain** under WEATHER. You should see thin blue-grey streaks slowly drifting down and slightly to the right around the car. Switch to another weather option — streaks should disappear immediately.

**Step 6: Commit**

```bash
git add src/components/CarViewer.jsx
git commit -m "feat: add 3D rain particle system to CarViewer"
```

---

### Task 2: Write Playwright e2e spec for rain animation

**Files:**
- Create: `e2e/rain-animation.spec.js`

**Step 1: Write the spec**

```js
import { test, expect } from '@playwright/test'

test('rain weather option renders without error', async ({ page }) => {
  await page.goto('http://localhost:5173')

  // Wait for the panel to be ready
  const collapseBtn = page.getByLabel('Collapse panel')
  await collapseBtn.waitFor({ state: 'visible', timeout: 15000 })

  // Find and click the WEATHER carousel until Rain is active
  // The carousel arrows cycle through options — find the one labeled WEATHER
  // and click forward until we see "Rain"
  const weatherLabel = page.getByText('WEATHER')
  await weatherLabel.waitFor({ state: 'visible' })

  // Click next on the weather carousel until Rain is shown
  // Rain is index 2 (clear=0, golden=1, overcast=2... check carOptions)
  // Use the next-arrow button nearest to WEATHER label
  const nextBtns = page.locator('[aria-label="Next option"]')

  // Cycle to Rain: it's at index 2 (overcast=1, rain=2 in WEATHER_OPTIONS)
  // Start from clear (0) → click twice
  // First find which next button belongs to WEATHER row by proximity
  // Simpler: click the WEATHER next arrow twice
  const weatherSection = page.locator('text=WEATHER').locator('..')
  const weatherNext = weatherSection.locator('[aria-label="Next option"]')
  await weatherNext.click() // → overcast
  await page.waitForTimeout(200)
  await weatherNext.click() // → rain
  await page.waitForTimeout(500)

  // The canvas should still be visible and not crash
  const canvas = page.locator('canvas')
  await expect(canvas).toBeVisible()

  // The Rain label should be active
  await expect(page.getByText('Rain')).toBeVisible()
})
```

> **Note:** If the WEATHER carousel arrow selector doesn't match, inspect the Panel component's aria labels and adjust the locator. Run with `--headed` to debug visually.

**Step 2: Run the full Playwright suite**

```bash
npx playwright test
```

Expected: all specs pass including the new `rain-animation.spec.js`.

If `rain-animation.spec.js` fails because the WEATHER next-arrow selector doesn't match, open Panel.jsx and check the aria-label on the next button, then update the locator.

**Step 3: Commit**

```bash
git add e2e/rain-animation.spec.js
git commit -m "test: add Playwright spec for rain weather animation"
```

---

## Done

Both commits on main. The rain particle system is live and covered by an e2e smoke test.
