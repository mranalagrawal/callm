<script>
import chevronDownIcon from 'assets/svg/chevron-down.svg'

// noinspection JSUnusedGlobalSymbols
export default {

  name: 'BaseSelect',
  inheritAttrs: false,
  props: {
    id: String,
    value: {
      type: String,
      default: null,
      validator: prop => ['string'].includes(typeof prop) || prop === null,
    },
    label: {
      type: String,
      default: '',
    },
    options: {
      type: Array,
      required: true,
    },
    rules: { type: [Object, String] },
  },
  emits: ['change'],
  setup() {
    return { chevronDownIcon }
  },
}
</script>

<template>
  <ValidationProvider
    v-slot="{ classes, errors, ariaInput }"
    :vid="id"
    :rules="rules"
    :name="label"
    slim
  >
    <div class="text-left" :class="[classes]">
      <div class="mt-8">
        <div class="relative">
          <select
            v-bind="[$attrs, ariaInput]"
            :id="id"
            :value="value"
            :name="$attrs.name || id"
            class="
          peer appearance-none px-4 text-gray-dark py-3 w-full bg-transparent border border-gray-light
          placeholder-transparent rounded transition-colors
              focus:(outline-none border-gray-dark)
              autofill:!text-black autofill:border-secondary autofill:!shadow-input"
            :class="[(value) ? 'text-body' : 'text-transparent']"
            @change="$emit('change', $event.target.value)"
          >
            <option value="" disabled selected v-text="label" />
            <option v-for="option in options" :key="option.value" :value="option.value" v-text="option.label" />
          </select>
          <div
            class="absolute transform right-2 top-1/2 -translate-y-1/2 pointer-events-none"
            :class="$attrs.disabled ? 'text-body/50' : 'text-primary-400'"
          >
            <VueSvgIcon
              :data="chevronDownIcon"
              width="18"
              height="18"
            />
          </div>
          <label
            data-after=" *"
            :for="id"
            class="
            absolute m-0 left-4 transition-all select-none pointer-events-none
              "
            :class="(value) ? 'text-[0.775rem] px-2 top-[-0.4rem] bg-white text-secondary-800' : 'top-[0.7rem] text-gray'"
            v-text="label"
          />
        </div>
        <span v-if="!!errors.length" class="block text-sm text-error" v-text="errors[0]" />
      </div>
    </div>
  </ValidationProvider>
</template>
