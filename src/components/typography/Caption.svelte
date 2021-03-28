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

  // @export size
  // - Size of this caption
  // - Default: sm
  export let size = "sm";

  // Listening to variables
  // change
  afterUpdate(() => {
    // Undefined size of caption
    if (size != "sm" && size != "xs" && size != "md") {
      size = "sm";
    };

    // Defining default caption color
    if (!white && !dark) {
      white = true;
    };
  })
</script>

<p style="{ style }" class="text-{ size } text-gray-{ white ? "100" : "900" } { opacity ? `opacity-${ size == "sm" ? "80" : "60" }` : "" } { classes }">
  <slot></slot>
</p>