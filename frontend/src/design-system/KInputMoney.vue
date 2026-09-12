<script setup lang="ts">
import { computed, useId } from "vue";
import InputNumber from "primevue/inputnumber";
import type { InputNumberBlurEvent } from "primevue/inputnumber";

interface Props {
  modelValue?: number | null;
  label?: string;
  id?: string;
  name?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  label: "",
  id: "",
  name: "",
  placeholder: "R$ 0,00",
  error: "",
  hint: "",
  disabled: false,
  required: false,
  min: 0,
  max: undefined,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: number | null): void;
  (e: "blur", event: InputNumberBlurEvent): void;
  (e: "focus", event: Event): void;
}>();

const autoId = useId();
const inputId = computed(() => props.id || `k-money-${autoId}`);
const errorId = computed(() => `${inputId.value}-error`);
const hintId = computed(() => `${inputId.value}-hint`);

const ariaDescribedBy = computed(() => {
  if (props.error) return errorId.value;
  if (props.hint) return hintId.value;
  return undefined;
});
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
      <InputNumber
        :input-id="inputId"
        :name="name || inputId"
        :model-value="modelValue"
        mode="currency"
        currency="BRL"
        locale="pt-BR"
        :min-fraction-digits="2"
        :max-fraction-digits="2"
        :min="min"
        :max="max"
        :placeholder="placeholder"
        :disabled="disabled"
        :invalid="!!error"
        :aria-invalid="!!error"
        :aria-describedby="ariaDescribedBy"
        :aria-required="required"
        class="w-full !rounded-lg"
        :input-class="[
          'w-full !rounded-lg !border !text-sm !py-2 !px-3 transition-colors',
          error
            ? '!border-rose-500 !ring-rose-200'
            : '!border-slate-300 focus:!border-indigo-600 focus:!ring-indigo-100',
        ]"
        @update:model-value="emit('update:modelValue', $event)"
        @blur="emit('blur', $event)"
        @focus="emit('focus', $event)"
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
