import onNextFrame from './on-next-frame';
import createRenderStep from './create-render-step';

/*
  Generate current timestamp

  @return [timestamp]: Current UNIX timestamp
*/
const HAS_PERFORMANCE_NOW = (typeof performance !== 'undefined' && performance.now);
export const currentTime = HAS_PERFORMANCE_NOW ? () => performance.now() : () => new Date().getTime();

let willRenderNextFrame: boolean = false;

// Maximum permitted ms since last frame
const MAX_ELAPSED: number = 20;

// Current framestamp
let currentFramestamp: number = currentTime();

let elapsed: number = 0;

// Factor to multiply `elapsed` by - 0.5 would be slow motion, 2 would be fast
let dilation: number = 1;

function startRenderLoop(): void {
  if (!willRenderNextFrame) {
    willRenderNextFrame = true;
    onNextFrame(processFrame);
  }
}

const frameStart = createRenderStep(startRenderLoop);
const frameUpdate = createRenderStep(startRenderLoop);
const frameRender = createRenderStep(startRenderLoop);
const frameEnd = createRenderStep(startRenderLoop);

function processFrame(framestamp: number): void {
  willRenderNextFrame = false;
  elapsed = Math.max(Math.min(framestamp - currentFramestamp, MAX_ELAPSED), 1) * dilation;
  currentFramestamp = framestamp;

  frameStart.process();
  frameUpdate.process();
  frameRender.process();
  frameEnd.process();
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
