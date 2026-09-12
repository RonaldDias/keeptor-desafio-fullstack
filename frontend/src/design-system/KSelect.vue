<script setup lang="ts">
import { computed, useId } from "vue";
import Select from "primevue/select";
import type { SelectChangeEvent } from "primevue/select";

interface Props {
  modelValue?: string | number | boolean | null;
  options?: Record<string, unknown>[];
  optionLabel?: string;
  optionValue?: string;
  label?: string;
  id?: string;
  name?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  loading?: boolean;
  filter?: boolean;
  emptyMessage?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  options: () => [],
  optionLabel: "nome",
  optionValue: "id",
  label: "",
  id: "",
  name: "",
  placeholder: "Selecione uma opção",
  error: "",
  hint: "",
  disabled: false,
  required: false,
  loading: false,
  filter: true,
  emptyMessage: "Nenhum resultado encontrado",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number | boolean | null): void;
  (e: "change", event: SelectChangeEvent): void;
  (e: "blur", event: Event): void;
}>();

const autoId = useId();
const inputId = computed(() => props.id || `k-select-${autoId}`);
const errorId = computed(() => `${inputId.value}-error`);
const hintId = computed(() => `${inputId.value}-hint`);

const ariaDescribedBy = computed(() => {
  if (props.error) return errorId.value;
  if (props.hint) return hintId.value;
  return undefined;
});

const onChange = (event: SelectChangeEvent) => {
  emit("update:modelValue", event.value);
  emit("change", event);
};
</script>

<template>
  <div class="flex flex-col gap-1 w-full text-left">
    <label
      v-if="label"
      :for="inputId"
      class="text-xs font-semibold text-slate-700 select-none flex items-center gap-1"
    >
      {{ label }}
      <span v-if="required" class="text-rose-500" aria-hidden="true">*</span>
    </label>
    <div class="relative">
      <Select
        :input-id="inputId"
        :name="name || inputId"
        :model-value="modelValue"
        :options="options"
        :option-label="optionLabel"
        :option-value="optionValue"
        :placeholder="placeholder"
        :disabled="disabled || loading"
        :loading="loading"
        :filter="filter"
        :empty-message="emptyMessage"
        :invalid="!!error"
        :aria-invalid="!!error"
        :aria-describedby="ariaDescribedBy"
        :aria-required="required"
        class="w-full !rounded-lg !border !text-sm transition-colors"
        :class="
          error
            ? '!border-rose-500 !ring-rose-200'
            : '!border-slate-300 focus:!border-indigo-600 focus:!ring-indigo-100'
        "
        @change="onChange"
        @blur="emit('blur', $event)"
      />
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
