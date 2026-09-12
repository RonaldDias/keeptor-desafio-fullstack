<script setup lang="ts">
import { computed, useId } from "vue";
import DatePicker from "primevue/datepicker";
import type { DatePickerBlurEvent } from "primevue/datepicker";

interface Props {
  modelValue?: Date | string | null;
  label?: string;
  id?: string;
  name?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  dateFormat?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  label: "",
  id: "",
  name: "",
  placeholder: "dd/mm/aaaa",
  error: "",
  hint: "",
  disabled: false,
  required: false,
  dateFormat: "dd/mm/yy",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: Date | string | null): void;
  (e: "blur", event: DatePickerBlurEvent): void;
}>();

const onDateUpdate = (
  val: Date | Date[] | (Date | null)[] | null | undefined,
) => {
  if (Array.isArray(val)) {
    emit("update:modelValue", val[0] ?? null);
  } else {
    emit("update:modelValue", val ?? null);
  }
};

const autoId = useId();
const inputId = computed(() => props.id || `k-date-${autoId}`);
const errorId = computed(() => `${inputId.value}-error`);
const hintId = computed(() => `${inputId.value}-hint`);

const ariaDescribedBy = computed(() => {
  if (props.error) return errorId.value;
  if (props.hint) return hintId.value;
  return undefined;
});

const parsedDate = computed<Date | null>(() => {
  if (!props.modelValue) return null;
  if (props.modelValue instanceof Date) return props.modelValue;

  const d = new Date(props.modelValue);
  return isNaN(d.getTime()) ? null : d;
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
      <DatePicker
        :input-id="inputId"
        :name="name || inputId"
        :model-value="parsedDate"
        :date-format="dateFormat"
        :placeholder="placeholder"
        :disabled="disabled"
        :invalid="!!error"
        :aria-invalid="!!error"
        :aria-describedby="ariaDescribedBy"
        :aria-required="required"
        show-icon
        icon-display="input"
        class="w-full"
        :input-class="[
          'w-full !rounded-lg !border !text-sm !py-2 !px-3 transition-colors',
          error
            ? '!border-rose-500 !ring-rose-200'
            : '!border-slate-300 focus:!border-indigo-600 focus:!ring-indigo-100',
        ]"
        @update:model-value="onDateUpdate"
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
