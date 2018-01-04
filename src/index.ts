import onNextFrame from './on-next-frame';
import createRenderStep from './create-render-step';

/*
  Generate current timestamp

  @return [timestamp]: Current UNIX timestamp
*/
const HAS_PERFORMANCE_NOW = typeof performance !== 'undefined' && performance.now !== undefined;
export const currentTime = HAS_PERFORMANCE_NOW ? () => performance.now() : () => Date.now();

let willRenderNextFrame = false;

// Maximum permitted ms since last frame
const MAX_ELAPSED = 40;

let defaultElapsed = 16.7;
let useDefaultElapsed = true;

let currentFramestamp = 0;

let elapsed = 0;

function startRenderLoop() {
  if (willRenderNextFrame) return;

  willRenderNextFrame = true;
  useDefaultElapsed = true;
  onNextFrame(processFrame);
}

const frameStart = createRenderStep(startRenderLoop);
const frameUpdate = createRenderStep(startRenderLoop);
const frameRender = createRenderStep(startRenderLoop);
const frameEnd = createRenderStep(startRenderLoop);

function processFrame(framestamp: number) {
  willRenderNextFrame = false;
  elapsed = useDefaultElapsed
    ? defaultElapsed
    : Math.max(Math.min(framestamp - currentFramestamp, MAX_ELAPSED), 1);

  // Set this elapsed as default elapsed
  // Maybe move this to a moving average for a more precise value
  if (!useDefaultElapsed) defaultElapsed = elapsed;

  currentFramestamp = framestamp;

  frameStart.process();
  frameUpdate.process();
  frameRender.process();
  frameEnd.process();

  if (willRenderNextFrame) useDefaultElapsed = false;
}

export const onFrameStart = frameStart.schedule;
export const onFrameUpdate = frameUpdate.schedule;
export const onFrameRender = frameRender.schedule;
export const onFrameEnd = frameEnd.schedule;
export const cancelOnFrameStart = frameStart.cancel;
export const cancelOnFrameUpdate = frameUpdate.cancel;
export const cancelOnFrameRender = frameRender.cancel;
export const cancelOnFrameEnd = frameEnd.cancel;

export const timeSinceLastFrame = () => elapsed;
export const currentFrameTime = () => currentFramestamp;
