/*
  Detect and load appropriate clock setting for the execution environment
 */
const hasRAF = typeof window !== 'undefined' && window.requestAnimationFrame !== undefined;

let prevTime = 0;

const onNextFrame = hasRAF
  ? (callback: FrameRequestCallback) => window.requestAnimationFrame(callback)
  : (callback: Function) => {
    const currentTime = Date.now();
    const timeToCall = Math.max(0, 16.7 - (currentTime - prevTime));
    prevTime = currentTime + timeToCall;
    setTimeout(() => callback(prevTime), timeToCall);
  };

export default onNextFrame;
