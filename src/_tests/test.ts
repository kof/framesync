import onNextFrame from '../on-next-frame';
import {
  currentTime,
  currentFrameTimestamp,
  timeSinceLastFrame,
  onFrameStart,
  onFrameEnd,
  onFrameRender,
  onFrameUpdate,
  cancelOnFrameEnd,
  cancelOnFrameRender,
  cancelOnFrameStart,
  cancelOnFrameUpdate
} from '../';

describe('onNextFrame', () => {
  it('fires callback on following frame', () => {
    return new Promise((resolve: Function) => onNextFrame(resolve));
  });
});

describe('frameSchedulers', () => {
  it('fires callbacks in the correct order', () => {
    return new Promise((resolve: Function) => {
      const order: Array<number> = [];
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
});
