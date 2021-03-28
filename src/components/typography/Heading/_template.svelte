<script>
  // Importing modules
  import { afterUpdate } from "svelte";

  // Exporting some variables

  // @export style
  export let style;

  // @export classes
  // - Custom classes
  export let classes;

  // @export color: white
  // - Default color
  export let white = false;
  
  // @export color: black
  export let dark = false;

  // Listen for changes
  // (to set default value)
  afterUpdate(() => {
    if (!white && !dark) {
      white = true;
    };
  });
</script>

<h1 style="{ style }" class="{ white ? "text-white" : "text-black" } { classes }">
  <slot></slot>
</h1>