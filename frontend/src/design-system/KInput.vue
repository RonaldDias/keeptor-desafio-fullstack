<script setup lang="ts">
import { computed, useId } from "vue";
import InputText from "primevue/inputtext";
import InputMask from "primevue/inputmask";

interface Props {
  modelValue?: string | null;
  label?: string;
  id?: string;
  name?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  mask?: "cnpj" | "phone" | "cep" | string;
  type?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  label: "",
  id: "",
  name: "",
  placeholder: "",
  error: "",
  hint: "",
  disabled: false,
  required: false,
  mask: "",
  type: "text",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "blur", event: Event): void;
  (e: "focus", event: Event): void;
}>();

const autoId = useId();
const inputId = computed(() => props.id || `k-input-${autoId}`);
const errorId = computed(() => `${inputId.value}-error`);
const hintId = computed(() => `${inputId.value}-hint`);

const computedMask = computed(() => {
  if (props.mask === "cnpj") return "99.999.999/9999-99";
  if (props.mask === "phone") return "(99) 99999-9999";
  if (props.mask === "cep") return "99999-999";
  return props.mask;
});

const ariaDescribedBy = computed(() => {
  if (props.error) return errorId.value;
  if (props.hint) return hintId.value;
  return undefined;
});

const onInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emit("update:modelValue", target.value);
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
      <InputMask
        v-if="computedMask"
        :id="inputId"
        :name="name || inputId"
        :model-value="modelValue ?? ''"
        :mask="computedMask"
        :placeholder="placeholder"
        :disabled="disabled"
        :invalid="!!error"
        :aria-invalid="!!error"
        :aria-describedby="ariaDescribedBy"
        :aria-required="required"
        class="w-full !rounded-lg !border !text-sm !py-2 !px-3 transition-colors"
        :class="
          error
            ? '!border-rose-500 !ring-rose-200'
            : '!border-slate-300 focus:!border-indigo-600 focus:!ring-indigo-100'
        "
        @update:model-value="emit('update:modelValue', $event ?? '')"
        @blur="emit('blur', $event)"
        @focus="emit('focus', $event)"
      />
      <InputText
        v-else
        :id="inputId"
        :name="name || inputId"
        :type="type"
        :value="modelValue ?? ''"
        :placeholder="placeholder"
        :disabled="disabled"
        :invalid="!!error"
        :aria-invalid="!!error"
        :aria-describedby="ariaDescribedBy"
        :aria-required="required"
        class="w-full !rounded-lg !border !text-sm !py-2 !px-3 transition-colors"
        :class="
          error
            ? '!border-rose-500 !ring-rose-200'
            : '!border-slate-300 focus:!border-indigo-600 focus:!ring-indigo-100'
        "
        @input="onInput"
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
