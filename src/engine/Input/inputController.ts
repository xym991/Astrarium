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
  isCaptured: false,
};

export type InputState = {
  movement: typeof movementState;
  mouse: typeof mouseState;
};

export const defaultBindings = {
  moveForward: "KeyW",
  moveBackward: "KeyS",
  moveLeft: "KeyA",
  moveRight: "KeyD",
  moveUp: "KeyQ",
  moveDown: "KeyE",

  showOrbits: "KeyO",
  showTrails: "KeyT",
  showLabels: "KeyL",
  showMoons: "KeyM",
  showIndicators: "KeyI",

  changeCamera: "KeyC",
  changeTime: "KeyX",
  showSettings: "Tab",

  releasePointerLock: "AltLeft",

  focusSun: "Digit0",
  focusMercury: "Digit1",
  focusVenus: "Digit2",
  focusEarth: "Digit3",
  focusMars: "Digit4",
  focusJupiter: "Digit5",
  focusSaturn: "Digit6",
  focusUranus: "Digit7",
  focusNeptune: "Digit8",
  focusPluto: "Digit9",
} as const;

export type InputAction = keyof typeof defaultBindings;

type BindingState = {
  binding: string;
  pressed: boolean;
  toggled: boolean;
};

class InputController {
  private canvas: HTMLCanvasElement;
  private movementState: typeof movementState;
  private mouseState: typeof mouseState;
  private lastTouchX = 0;
  private lastTouchY = 0;
  private lastPinchDistance = 0;
  pointerCaptured = false;
  private keyBindings: Record<InputAction, BindingState> = {} as any;
  private keyLookup: Record<string, InputAction> = {};
  private subscribers = new Map<
    InputAction,
    Set<(key: string, state: { pressed: boolean; toggled: boolean }) => void>
  >();

  static instance: InputController;

  public static getInstance(canvas?: HTMLCanvasElement) {
    if (!InputController.instance) {
      if (!canvas) {
        throw new Error("InputController not initialized yet");
      }
      InputController.instance = new InputController(canvas);
    }
    return InputController.instance;
  }

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.movementState = { ...movementState };
    this.mouseState = { ...mouseState, isCaptured: false };

    for (const action in defaultBindings) {
      this.keyBindings[action as InputAction] = {
        binding: defaultBindings[action as InputAction],
        pressed: false,
        toggled: false,
      };
    }

    this.loadConfig();
    this.rebuildLookup();
    this.initialiseListeners();
    this.subscribe("releasePointerLock", (_, state) => {
      this.enforcePointerLock();
    });
    console.log("input controller initialised");
  }

  private loadConfig() {
    const stored = localStorage.getItem("astrarium.keybindings");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        for (const action in parsed) {
          if (action in this.keyBindings) {
            this.keyBindings[action as InputAction].binding = parsed[action];
          }
        }
      } catch {
        // ignore parse errors
      }
    }
  }

  private storeConfig() {
    const toStore: Record<string, string> = {};
    for (const action in this.keyBindings) {
      toStore[action] = this.keyBindings[action as InputAction].binding;
    }
    localStorage.setItem("astrarium.keybindings", JSON.stringify(toStore));
  }

  private rebuildLookup() {
    this.keyLookup = {};
    for (const action in this.keyBindings) {
      const binding = this.keyBindings[action as InputAction].binding;
      this.keyLookup[binding] = action as InputAction;
    }
  }

  public getKey(action: InputAction) {
    return this.keyBindings[action].binding;
  }

  public setKey(action: InputAction, keyCode: string) {
    this.keyBindings[action].binding = keyCode;
    this.rebuildLookup();
    this.storeConfig();
  }

  public subscribe(
    action: InputAction,
    callback: (
      key: string,
      state: { pressed: boolean; toggled: boolean },
    ) => void,
  ) {
    if (!this.subscribers.has(action)) {
      this.subscribers.set(action, new Set());
    }
    const set = this.subscribers.get(action)!;
    set.add(callback);
    return () => {
      set.delete(callback);
    };
  }

  public getMouse() {
    return this.mouseState;
  }

  public getMovement() {
    return this.movementState;
  }

  public getInputState() {
    return {
      movement: this.movementState,
      mouse: this.mouseState,
    };
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
      this.enforcePointerLock();
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

    document.addEventListener("pointerlockchange", () => {
      this.mouseState.isCaptured = document.pointerLockElement === this.canvas;
    });
  }

  private handleKeys(key: string, val: boolean) {
    const action = this.keyLookup[key];
    if (!action) return;

    const bindingState = this.keyBindings[action];
    bindingState.pressed = val;
    if (val) {
      bindingState.toggled = !bindingState.toggled;
    }

    // Map movement actions to movementState for compatibility
    switch (action) {
      case "moveForward":
        this.movementState.forward = val;
        break;
      case "moveBackward":
        this.movementState.backward = val;
        break;
      case "moveLeft":
        this.movementState.left = val;
        break;
      case "moveRight":
        this.movementState.right = val;
        break;
      case "moveUp":
        this.movementState.up = val;
        break;
      case "moveDown":
        this.movementState.down = val;
        break;
    }

    const subs = this.subscribers.get(action);
    if (subs) {
      for (const cb of subs) {
        cb(bindingState.binding, {
          pressed: bindingState.pressed,
          toggled: bindingState.toggled,
        });
      }
    }
  }

  private handleMouseClick(button: number, val: boolean) {
    if (button === 0) {
      this.mouseState.primaryMouse = val;
    }
    if (button === 2) {
      this.mouseState.secondaryMouse = val;
    }
  }

  public capturePointer() {
    this.pointerCaptured = true;

    if (document.pointerLockElement !== this.canvas) {
      this.canvas.requestPointerLock();
    }
  }

  public releasePointer() {
    this.pointerCaptured = false;

    if (document.pointerLockElement === this.canvas) {
      document.exitPointerLock();
    }
  }

  private enforcePointerLock() {
    if (this.pointerCaptured) {
      if (!this.keyBindings.releasePointerLock.pressed) {
        if (document.pointerLockElement !== this.canvas) {
          this.canvas.requestPointerLock();
        }
      } else {
        if (document.pointerLockElement === this.canvas) {
          document.exitPointerLock();
        }
      }
    }
  }

  public isPointerCaptured() {
    return this.mouseState.isCaptured;
  }

  public endFrame() {
    this.mouseState.mouseDeltaX = 0;
    this.mouseState.mouseDeltaY = 0;
    this.mouseState.scrollDelta = 0;
  }
}

export default InputController;
