export const defaultMovementState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  up: false,
  down: false,
};
export const defaultMouseState = {
  primaryMouse: false,
  secondaryMouse: false,
  mouseDeltaX: 0,
  mouseDeltaY: 0,
  scrollDelta: 0,
  isCaptured: false,
  mode: "mouse" as inputMode,
};

export type inputMode = "mouse" | "touch";
export type MouseState = typeof defaultMouseState;
export type MovementState = typeof defaultMovementState;

export type InputState = {
  movement: MovementState;
  mouse: MouseState;
};

export const defaultBindings = {
  moveForward: ["KeyW", "ArrowUp"],
  moveBackward: ["KeyS", "ArrowDown"],
  moveLeft: ["KeyA", "ArrowLeft"],
  moveRight: ["KeyD", "ArrowRight"],
  moveUp: ["Space", "KeyQ"],
  moveDown: ["ShiftLeft", "KeyE"],

  showOrbits: ["KeyO"],
  showTrails: ["KeyT"],
  showLabels: ["KeyL"],
  showMoons: ["KeyM"],
  showIndicators: ["KeyI"],

  changeCamera: ["KeyC"],
  changeTime: ["KeyX"],
  showSettings: ["Tab"],
  showSearch: ["KeyZ"],

  releasePointerLock: ["AltLeft"],

  focusSun: ["Digit0"],
  focusMercury: ["Digit1"],
  focusVenus: ["Digit2"],
  focusEarth: ["Digit3"],
  focusMars: ["Digit4"],
  focusJupiter: ["Digit5"],
  focusSaturn: ["Digit6"],
  focusUranus: ["Digit7"],
  focusNeptune: ["Digit8"],
  focusPluto: ["Digit9"],
} as const;

export type InputAction = keyof typeof defaultBindings;

type BindingState = {
  binding: string[];
  active: boolean;
};

class InputController {
  private canvas: HTMLCanvasElement;
  private movementState: typeof defaultMovementState;
  private mouseState: typeof defaultMouseState;
  private lastTouchX = 0;
  private lastTouchY = 0;

  private pointerCaptured = false;

  private lastPinchDistance = 0;
  private touchScrollVelocity = 0;
  private requiresFreshTouch = false;

  private readonly TOUCH_ROTATION_SCALE = 2.2;
  private readonly TOUCH_SCROLL_SCALE = 1.8;
  private readonly TOUCH_SCROLL_DECAY = 0.9;
  private readonly TOUCH_SCROLL_THRESHOLD = 5;

  private keyBindings: Record<InputAction, BindingState> = {} as any;
  private keyLookup: Record<string, InputAction[]> = {};
  private pressedKeys = new Set<string>();
  private virtualActions = new Set<InputAction>();
  private subscribers = new Map<
    InputAction,
    Set<(key: string, state: { active: boolean }) => void>
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
    this.movementState = { ...defaultMovementState };
    this.mouseState = { ...defaultMouseState };

    for (const action in defaultBindings) {
      this.keyBindings[action as InputAction] = {
        binding: [...defaultBindings[action as InputAction]],
        active: false,
      };
    }

    this.loadConfig();
    this.rebuildLookup();
    this.initialiseListeners();
    this.handleInternalSubscriptions();
    console.log("input controller initialised");
  }

  private loadConfig() {
    const stored = localStorage.getItem("astrarium.keybindings");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        for (const action in parsed) {
          if (action in this.keyBindings) {
            const binding = parsed[action];
            this.keyBindings[action as InputAction].binding = Array.isArray(
              binding,
            )
              ? binding.filter((key): key is string => typeof key === "string")
              : typeof binding === "string"
                ? [binding]
                : this.keyBindings[action as InputAction].binding;
          }
        }
      } catch {
        // ignore parse errors
      }
    }
  }

  private storeConfig() {
    const toStore: Record<string, string[]> = {};
    for (const action in this.keyBindings) {
      toStore[action] = this.keyBindings[action as InputAction].binding;
    }
    localStorage.setItem("astrarium.keybindings", JSON.stringify(toStore));
  }

  private rebuildLookup() {
    this.keyLookup = {};
    for (const action in this.keyBindings) {
      const bindings = this.keyBindings[action as InputAction].binding;
      for (const binding of bindings) {
        (this.keyLookup[binding] ??= []).push(action as InputAction);
      }
    }
  }

  public getKey(action: InputAction) {
    return [...this.keyBindings[action].binding];
  }

  public setKey(action: InputAction, keyCodes: string | string[]) {
    this.keyBindings[action].binding = Array.isArray(keyCodes)
      ? [...keyCodes]
      : [keyCodes];
    this.rebuildLookup();
    this.storeConfig();
  }

  public subscribe(
    action: InputAction,
    callback: (key: string, state: { active: boolean }) => void,
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
      this.mouseState.mode = "mouse";
      this.handleMouseClick(e.button, true);
      this.enforcePointerLock();
    });
    this.canvas.addEventListener("mouseup", (e) => {
      this.handleMouseClick(e.button, false);
    });
    this.canvas.addEventListener("mousemove", (e) => {
      this.mouseState.mode = "mouse";
      this.mouseState.mouseDeltaX += e.movementX;
      this.mouseState.mouseDeltaY += e.movementY;
    });
    this.canvas.addEventListener("wheel", (e) => {
      this.mouseState.mode = "mouse";
      this.mouseState.scrollDelta = e.deltaY;
    });
    this.canvas.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
        this.mouseState.mode = "touch";

        if (e.touches.length === 1 && !this.requiresFreshTouch) {
          const touch = e.touches[0];
          this.lastTouchX = touch.clientX;
          this.lastTouchY = touch.clientY;
          this.mouseState.primaryMouse = true;
        } else if (e.touches.length === 2) {
          this.touchScrollVelocity = 0;
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
        this.mouseState.mode = "touch";

        if (e.touches.length === 1) {
          const touch = e.touches[0];

          const dx =
            (touch.clientX - this.lastTouchX) * this.TOUCH_ROTATION_SCALE;

          const dy =
            (touch.clientY - this.lastTouchY) * this.TOUCH_ROTATION_SCALE;

          this.mouseState.mouseDeltaX += dx;
          this.mouseState.mouseDeltaY += dy;

          this.lastTouchX = touch.clientX;
          this.lastTouchY = touch.clientY;
        } else if (e.touches.length === 2) {
          this.requiresFreshTouch = true;
          this.mouseState.primaryMouse = false;
          const [a, b] = e.touches;

          const distance = Math.hypot(
            b.clientX - a.clientX,
            b.clientY - a.clientY,
          );
          const delta =
            (this.lastPinchDistance - distance) * this.TOUCH_SCROLL_SCALE;

          this.mouseState.scrollDelta += delta;

          if (Math.abs(delta) > this.TOUCH_SCROLL_THRESHOLD) {
            this.touchScrollVelocity = delta;
          }

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
          this.requiresFreshTouch = false;
        } else if (e.touches.length === 1 && !this.requiresFreshTouch) {
          this.mouseState.primaryMouse = false;
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
    const actions = this.keyLookup[key];
    if (!actions) return;

    if (val) this.pressedKeys.add(key);
    else this.pressedKeys.delete(key);

    for (const action of actions) {
      this.updateAction(action, val);
    }
  }

  public setActionActive(action: InputAction, active: boolean) {
    if (active) this.virtualActions.add(action);
    else this.virtualActions.delete(action);
    this.updateAction(action, false);
  }

  private updateAction(action: InputAction, toggle: boolean) {
    const bindingState = this.keyBindings[action];
    const wasActive = bindingState.active;
    bindingState.active =
      this.virtualActions.has(action) ||
      bindingState.binding.some((key) => this.pressedKeys.has(key));

    if (wasActive === bindingState.active && !toggle) return;

    for (const cb of this.subscribers.get(action) ?? []) {
      cb(bindingState.binding.join(" / "), {
        active: bindingState.active,
      });
    }
  }

  private handleInternalSubscriptions() {
    this.subscribe("moveForward", (binding, state) => {
      this.movementState.forward = state.active;
    });
    this.subscribe("moveBackward", (binding, state) => {
      this.movementState.backward = state.active;
    });
    this.subscribe("moveLeft", (binding, state) => {
      this.movementState.left = state.active;
    });
    this.subscribe("moveRight", (binding, state) => {
      this.movementState.right = state.active;
    });
    this.subscribe("moveUp", (binding, state) => {
      this.movementState.up = state.active;
    });
    this.subscribe("moveDown", (binding, state) => {
      this.movementState.down = state.active;
    });
    this.subscribe("releasePointerLock", () => {
      this.enforcePointerLock();
    });
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
  }

  public releasePointer() {
    this.pointerCaptured = false;

    if (document.pointerLockElement === this.canvas) {
      document.exitPointerLock();
    }
  }

  private enforcePointerLock() {
    if (this.pointerCaptured) {
      if (!this.keyBindings.releasePointerLock.active) {
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

  public setActive(action: InputAction, active: boolean = true) {
    this.setActionActive(action, active);
  }

  public endFrame() {
    this.mouseState.mouseDeltaX = 0;
    this.mouseState.mouseDeltaY = 0;

    if (this.mouseState.mode === "touch") {
      if (Math.abs(this.touchScrollVelocity) > 0.05) {
        this.touchScrollVelocity *= this.TOUCH_SCROLL_DECAY;

        this.mouseState.scrollDelta = this.touchScrollVelocity;
      } else {
        this.touchScrollVelocity = 0;
        this.mouseState.scrollDelta = 0;
      }
    } else {
      this.mouseState.scrollDelta = 0;
    }
  }
}

export default InputController;
