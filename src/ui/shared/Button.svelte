<script lang="ts">
  import { cn } from "../utils/cn";

  interface Props {
    onclick?: (event: MouseEvent) => void;
    onpointerdown?: (event: PointerEvent) => void;
    onpointerup?: (event: PointerEvent) => void;
    onpointercancel?: (event: PointerEvent) => void;
    onlostpointercapture?: (event: PointerEvent) => void;
    ariaLabel?: string;
    disabled?: boolean;
    class?: string;
  }

  let {
    onclick,
    onpointerdown,
    onpointerup,
    onpointercancel,
    onlostpointercapture,
    ariaLabel,
    disabled = false,
    class: className,
  }: Props = $props();
</script>

<button
  class={cn(
    ` relative inline-flex h-10 items-center justify-center border border-(--primary-strong) gap-2
  bg-transparent px-4 font-[Oxanium,sans-serif] text-[0.8rem] font-medium uppercase tracking-[0.1em] 
  text-(--primary-full) transition-[background,color,box-shadow] duration-150 
  hover:shadow-[inset_0_0_10px_rgba(130,220,255,.05),0_0_10px_rgba(130,220,255,.08)] 
  disabled:cursor-default disabled:opacity-40 cursor-pointer select-none backdrop-blur-xs backdrop-saturate-150 hover:border-(--primary-full)`,
    className,
  )}
  {disabled}
  {onclick}
  {onpointerdown}
  {onpointerup}
  {onpointercancel}
  {onlostpointercapture}
  aria-label={ariaLabel}
>
  <slot />
</button>
