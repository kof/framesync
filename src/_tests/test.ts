import {
  cancelOnFrameEnd,
  cancelOnFrameRender,
  cancelOnFrameStart,
  cancelOnFrameUpdate,
  currentFrameTime,
  currentTime,
  onFrameEnd,
  onFrameRender,
  onFrameStart,
  onFrameUpdate,
  timeSinceLastFrame
} from '../';
import onNextFrame from '../on-next-frame';

describe('onNextFrame', () => {
  it('fires callback on following frame', () => {
    return new Promise((resolve: Function) => onNextFrame(resolve));
  });
});

describe('frameSchedulers', () => {
  it('fires callbacks in the correct order', () => {
    return new Promise((resolve: Function) => {
      const order: number[] = [];
      onFrameStart(() => order.push(1));
      onFrameUpdate(() => order.push(2));
      onFrameRender(() => order.push(3));
      onFrameEnd(() => {
        order.push(4);
        if (order[0] === 1 && order[1] === 2 && order[2] === 3 && order[3] === 4) resolve();
      });
    });
  });

  it('cancels callbacks', () => {
    return new Promise((resolve: Function) => {
      let hasFired = false;
      const onFire = () => hasFired = true;
      onFrameUpdate(onFire);
      onFrameStart(() => cancelOnFrameUpdate(onFire));
      onFrameEnd(() => {
        if (!hasFired) resolve();
      });
    });
  });

  it('fires callback on current frame if scheduled with `true` within the same step', () => {
    return new Promise((resolve: Function, reject: Function) => {
      let v = 0;
      onFrameUpdate(() => {
        const timestamp = currentFrameTime();
        v++;
        onFrameUpdate(() => {
          v++;
          currentFrameTime() !== timestamp ? reject() : undefined;
        }, true);
      });
      onFrameEnd(() => {
        (v === 2) ? resolve() : reject();
      });
    });
  });

  it('fires callback on next frame if scheduled with `true` outside the same step', () => {
    return new Promise((resolve: Function, reject: Function) => {
      let v = 0;
      onFrameUpdate(() => v++);
      onFrameUpdate(() => v++, true);
      onFrameEnd(() => {
        (v === 2) ? resolve() : reject();
      });
    });
  });
});
