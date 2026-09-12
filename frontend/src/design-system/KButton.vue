<script setup lang="ts">
import Button from "primevue/button";

interface Props {
  label?: string;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger" | "text" | "outlined";
  size?: "small" | "normal" | "large";
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
}

withDefaults(defineProps<Props>(), {
  label: "",
  type: "button",
  variant: "primary",
  size: "normal",
  loading: false,
  disabled: false,
  icon: "",
});

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();

const severityMap = {
  primary: "primary",
  secondary: "secondary",
  danger: "danger",
  text: "secondary",
  outlined: "secondary",
} as const;
</script>

<template>
  <Button
    :type="type"
    :label="label"
    :icon="icon"
    :loading="loading"
    :disabled="disabled || loading"
    :severity="severityMap[variant]"
    :text="variant === 'text'"
    :outlined="variant === 'outlined'"
    :size="size === 'normal' ? undefined : size"
    class="!font-medium !rounded-lg !transition-all !cursor-pointer"
    @click="emit('click', $event)"
  >
    <slot />
  </Button>
</template>
