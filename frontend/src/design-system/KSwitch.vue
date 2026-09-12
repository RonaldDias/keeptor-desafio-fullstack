<script setup lang="ts">
import { computed, useId } from "vue";
import ToggleSwitch from "primevue/toggleswitch";

interface Props {
  modelValue?: boolean;
  label?: string;
  id?: string;
  name?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: true,
  label: "",
  id: "",
  name: "",
  error: "",
  hint: "",
  disabled: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "change", event: Event): void;
}>();

const autoId = useId();
const inputId = computed(() => props.id || `k-switch-${autoId}`);
const errorId = computed(() => `${inputId.value}-error`);
const hintId = computed(() => `${inputId.value}-hint`);

const ariaDescribedBy = computed(() => {
  if (props.error) return errorId.value;
  if (props.hint) return hintId.value;
  return undefined;
});
</script>

<template>
  <div class="flex flex-col gap-1 text-left">
    <div class="flex items-center gap-3">
      <ToggleSwitch
        :input-id="inputId"
        :name="name || inputId"
        :model-value="modelValue"
        :disabled="disabled"
        :invalid="!!error"
        :aria-invalid="!!error"
        :aria-describedby="ariaDescribedBy"
        @update:model-value="emit('update:modelValue', $event)"
        @change="emit('change', $event)"
      />

      <label
        v-if="label"
        :for="inputId"
        class="text-sm font-medium text-slate-700 select-none cursor-pointer"
      >
        {{ label }}
        <span class="text-xs font-normal text-slate-500 ml-1">
          ({{ modelValue ? "Ativo" : "Inativo" }})
        </span>
      </label>
    </div>

    <p
      v-if="error"
      :id="errorId"
      class="text-xs text-rose-600 font-medium"
      role="alert"
    >
      {{ error }}
    </p>
    <p v-else-if="hint" :id="hintId" class="text-xs text-slate-500">
      {{ hint }}
    </p>
  </div>
</template>
