<script lang="ts">
  import { cn } from "../utils/cn";

  interface Props {
    onclick?: () => void;
    disabled?: boolean;
    class?: string;
  }

  let { onclick, disabled = false, class: className }: Props = $props();
</script>

<button
  class={cn(
    ` relative inline-flex h-10 items-center justify-center border border-(--primary-strong) gap-2
  bg-transparent px-4 font-[Oxanium,sans-serif] text-[0.8rem] font-medium uppercase tracking-[0.1em] 
  text-(--primary-full) transition-[background,color,box-shadow] duration-150 hover:bg-[rgba(130,220,255,.06)] 
  hover:shadow-[inset_0_0_10px_rgba(130,220,255,.05),0_0_10px_rgba(130,220,255,.08)] active:bg-[rgba(130,220,255,.12)] 
  disabled:cursor-default disabled:opacity-40 cursor-pointer select-none backdrop-blur-xs backdrop-saturate-150 hover:border-(--primary-full)`,
    className,
  )}
  {disabled}
  {onclick}
>
  <slot />
</button>
