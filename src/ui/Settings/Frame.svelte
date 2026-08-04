<div
  class="fixed top-1/2 left-1/2 z-[1000] h-fit max-h-[90vh] min-h-0 w-fit max-w-[90vw] min-w-0
  -translate-x-1/2 -translate-y-1/2 bg-[#0000]
  backdrop-blur-sm backdrop-saturate-150 pointer-events-auto"
>
  <!-- <div
    class="pointer-events-none absolute inset-[14px] border border-(--primary)"
  ></div> -->

  <div
    class="pointer-events-none absolute top-[14px] left-[14px] h-7 w-7 border-t-2 border-l-2 border-(--primary-strong)"
  ></div>
  <div
    class="pointer-events-none absolute top-[14px] right-[14px] h-7 w-7 border-t-2 border-r-2 border-(--primary-strong)"
  ></div>
  <div
    class="pointer-events-none absolute bottom-[14px] left-[14px] h-7 w-7 border-b-2 border-l-2 border-(--primary-strong)"
  ></div>
  <div
    class="pointer-events-none absolute right-[14px] bottom-[14px] h-7 w-7 border-r-2 border-b-2 border-(--primary-strong)"
  ></div>

  <div class="body p-12 max-h-[90vh] w-fit h-fit scrollbar-gutter-stable">
    <slot />
  </div>
</div>
