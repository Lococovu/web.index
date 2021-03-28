<script>
  // Importing modules
  import { afterUpdate } from "svelte";

  // Exporting variables

  // @export color
  export let white = false;
  export let dark = false;

  // @export style 
  export let style;

  // @export opacity
  export let opacity = true;

  // @export classes
  // - Custom classes
  export let classes;

  // Listening to variables
  // change
  afterUpdate(() => {
    // Defining default caption color
    if (!white && !dark) {
      white = true;
    };
  })
</script>

<p style="{ style }" class="text-base text-gray-{ white ? "100" : "900" } { opacity ? "opacity-85" : "" } { classes }">
  <slot></slot>
</p>