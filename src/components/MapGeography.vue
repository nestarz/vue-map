<template>
  <path role="geography" class="rsm-geography" :d="geography.svgPath" v-bind="$attrs">
    <slot />
  </path>
</template>

<script lang="ts">
export default {
  props: {
    geography: { type: Object, required: true }
  }
};
</script>