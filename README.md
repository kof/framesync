# Framesync

A tiny frame scheduler for performantly batching reads and renders. Segregating actions that read and write to the DOM will avoid [layout thrashing](https://developers.google.com/web/fundamentals/performance/rendering/avoid-large-complex-layouts-and-layout-thrashing).

## Install

```bash
npm install framesync --save
```

## Usage

The Framesync render loop executes four sequential steps, once per frame.

- `frameStart`
- `frameUpdate`
- `frameRender`
- `frameEnd`

Developers can set any function to run at any of these steps using the `on` and `cancel` callbacks:

- `onFrameStart`, `cancelOnFrameStart`
- `onFrameUpdate`, `cancelOnFrameUpdate`
- `onFrameRender`, `cancelOnFrameRender`
- `onFrameEnd`, `cancelOnFrameEnd`

`timeSinceLastFrame` and `currentFrameTimestamp` methods provide frame-locked time measurements.

### Example

```javascript
import {
  timeSinceLastFrame,
  onFrameStart,
  cancelFrameStart
} from 'popmotion';

function logTimeSinceLastFrame() {
  console.log(timeSinceLastFrame());
  onFrameStart(logTimeSinceLastFrame);
}

onFrameStart(logTimeSinceLastFrame);

function stopLogging() {
  cancelOnFrameStart(logTimeSinceLastFrame);
}

setTimeout(stopLogging, 5000);
```
