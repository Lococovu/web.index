<!-- 

 -->

<script>
  // Importing different logotype types
  import FullLogotype from "./types/Full.logotype.svelte";
  import SmallLogotype from "./types/Small.logotype.svelte";

  // Exporting variables
  
  // @export type
  // - Type of a logotype
  export let type = "full";

  // @export attrs
  // - Object, containing all
  // attributes
  export let attrs = {
    // @attribute pulseAnimation
    // Do we need to show pulsing animation
    // on this logotype?
    pulseAnimation: false,

    // @attribute size
    // Different size of logotype: 8, 12, 16, etc.
    size: "8",

    // @attribute color
    // Logotype color
    color: "#fff"
  }
</script>

<!-- 
  @type: Full
  - Full logotype (with caption)
 -->
{ #if type == "full" }
  <FullLogotype on:click bind:attrs={attrs}>
    <slot></slot>
  </FullLogotype>
{ :else if type == "small" }
<!-- 
  @type: Small
  - Full Logotypw without it's caption
 -->
  <SmallLogotype on:click bind:attrs={attrs}>
    <slot></slot> 
  </SmallLogotype>
{ /if }