/*
  Detect and load appropriate clock setting for the execution environment
 */
const hasRAF = (typeof window !== 'undefined' && window.requestAnimationFrame) ? true : false;

let prevTime = 0;

const onNextFrame = hasRAF
  ? window.requestAnimationFrame
  : (callback: Function) => {
    const currentTime = Date.now();
    const timeToCall = Math.max(0, 16 - (currentTime - prevTime));
    prevTime = currentTime + timeToCall;
    setTimeout(() => callback(prevTime), timeToCall);
  };

export default onNextFrame;
