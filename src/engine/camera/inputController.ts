const movementState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  up: false,
  down: false,
};
const mouseState = {
  primaryMouse: false,
  secondaryMouse: false,
  mouseDeltaX: 0,
  mouseDeltaY: 0,
  scrollDelta: 0,
};

const bindings: Record<string, keyof typeof movementState> = {
  KeyW: "forward",
  KeyS: "backward",
  KeyA: "left",
  KeyD: "right",
  KeyQ: "up",
  KeyE: "down",
  ArrowUp: "forward",
  ArrowDown: "backward",
  ArrowLeft: "left",
  ArrowRight: "right",
  Space: "up",
  ShiftLeft: "down",
};

export type InputState = {
  movement: typeof movementState;
  mouse: typeof mouseState;
};

export class InputController {
  private canvas: HTMLCanvasElement;
  private movementState: typeof movementState;
  private mouseState: typeof mouseState;
  private lastTouchX = 0;
  private lastTouchY = 0;
  private lastPinchDistance = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.movementState = { ...movementState };
    this.mouseState = { ...mouseState };
    this.initialiseListeners();
    console.log("input controller initialised");
  }

  private initialiseListeners() {
    window.addEventListener("keydown", (e) => {
      if (e.repeat) return;
      this.handleKeys(e.code, true);
    });
    window.addEventListener("keyup", (e) => {
      this.handleKeys(e.code, false);
    });
    this.canvas.addEventListener("mousedown", (e) => {
      this.handleMouseClick(e.button, true);
    });
    this.canvas.addEventListener("mouseup", (e) => {
      this.handleMouseClick(e.button, false);
    });
    this.canvas.addEventListener("mousemove", (e) => {
      this.mouseState.mouseDeltaX = e.movementX;
      this.mouseState.mouseDeltaY = e.movementY;
    });
    this.canvas.addEventListener("wheel", (e) => {
      this.mouseState.scrollDelta = e.deltaY;
    });
    this.canvas.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();

        if (e.touches.length === 1) {
          const touch = e.touches[0];
          this.lastTouchX = touch.clientX;
          this.lastTouchY = touch.clientY;
          this.mouseState.primaryMouse = true;
        } else if (e.touches.length === 2) {
          this.mouseState.primaryMouse = false;

          const [a, b] = e.touches;
          this.lastPinchDistance = Math.hypot(
            b.clientX - a.clientX,
            b.clientY - a.clientY,
          );
        }
      },
      { passive: false },
    );

    this.canvas.addEventListener(
      "touchmove",
      (e) => {
        e.preventDefault();

        if (e.touches.length === 1) {
          const touch = e.touches[0];

          this.mouseState.mouseDeltaX = touch.clientX - this.lastTouchX;
          this.mouseState.mouseDeltaY = touch.clientY - this.lastTouchY;

          this.lastTouchX = touch.clientX;
          this.lastTouchY = touch.clientY;
        } else if (e.touches.length === 2) {
          const [a, b] = e.touches;

          const distance = Math.hypot(
            b.clientX - a.clientX,
            b.clientY - a.clientY,
          );

          this.mouseState.scrollDelta = this.lastPinchDistance - distance;
          this.lastPinchDistance = distance;
        }
      },
      { passive: false },
    );

    this.canvas.addEventListener(
      "touchend",
      (e) => {
        e.preventDefault();

        if (e.touches.length === 0) {
          this.mouseState.primaryMouse = false;
          this.lastPinchDistance = 0;
        } else if (e.touches.length === 1) {
          const touch = e.touches[0];
          this.lastTouchX = touch.clientX;
          this.lastTouchY = touch.clientY;
          this.mouseState.primaryMouse = true;
        }
      },
      { passive: false },
    );
  }
  private handleKeys(key: string, val: boolean) {
    const binding = bindings[key];
    if (!binding) return;
    this.movementState[binding] = val;
  }
  private handleMouseClick(button: number, val: boolean) {
    if (button === 0) {
      this.mouseState.primaryMouse = val;
    }
    if (button === 2) {
      this.mouseState.secondaryMouse = val;
    }
  }
  public getState(): InputState {
    return {
      movement: this.movementState,
      mouse: this.mouseState,
    };
  }
  public endFrame() {
    this.mouseState.mouseDeltaX = 0;
    this.mouseState.mouseDeltaY = 0;
    this.mouseState.scrollDelta = 0;
  }
}
