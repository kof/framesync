export interface RenderStep {
  readonly schedule: (callback: Function, immediate?: boolean) => void;
  readonly cancel: (callback: Function) => void;
  readonly process: Function;
}

export default function createRenderStep(startRenderLoop: Function): RenderStep {
  /**
   * We use two arrays, one for this frame and one to queue for the
   * next frame, reusing each to avoid GC.
   * @type {Array}
   */
  let functionsToRun: Function[] = [];
  let functionsToRunNextFrame: Function[] = [];
  let numThisFrame = 0;
  let isProcessing = false;
  let i = 0;

  return {
    cancel: (callback: Function) => {
      const indexOfCallback = functionsToRunNextFrame.indexOf(callback);
      if (indexOfCallback !== -1) {
        functionsToRunNextFrame.splice(indexOfCallback, 1);
      }
    },

    process: () => {
      isProcessing = true;

      // Swap this frame and next frame arrays to avoid GC
      [functionsToRun, functionsToRunNextFrame] = [functionsToRunNextFrame, functionsToRun];

      // Clear next frame list
      functionsToRunNextFrame.length = 0;

      // Execute all of this frame's functions
      numThisFrame = functionsToRun.length;
      for (i = 0; i < numThisFrame; i++) {
        functionsToRun[i]();
      }

      isProcessing = false;
    },

    schedule: (callback: Function, immediate: boolean = false) => {
      startRenderLoop();

      const addToCurrentBuffer = immediate && isProcessing;
      const buffer = addToCurrentBuffer ? functionsToRun : functionsToRunNextFrame;

      // If this callback isn't already scheduled to run next frame
      if (buffer.indexOf(callback) === -1) {
        buffer.push(callback);

        // If we're adding to the current buffer, update its size
        if (addToCurrentBuffer) {
          numThisFrame = functionsToRun.length;
        }
      }
    },
  };
}
