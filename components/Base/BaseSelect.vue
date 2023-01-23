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
      <div class="cmw-mt-8">
        <div class="cmw-relative">
          <select
            v-bind="[$attrs, ariaInput]"
            :id="id"
            :value="value"
            :name="$attrs.name || id"
            class="
          peer cmw-appearance-none cmw-px-4 cmw-text-gray-dark cmw-py-3 cmw-w-full cmw-bg-transparent cmw-border cmw-border-gray-light
          cmw-placeholder-transparent cmw-rounded cmw-transition-colors
              focus:(cmw-outline-none cmw-border-gray-dark)
              autofill:!text-black autofill:border-secondary autofill:!shadow-input"
            :class="[(value) ? 'cmw-text-body' : 'cmw-text-transparent']"
            @change="$emit('change', $event.target.value)"
          >
            <option value="" disabled selected v-text="label" />
            <option v-for="option in options" :key="option.value" :value="option.value" v-text="option.label" />
          </select>
          <div
            class="cmw-absolute cmw-transform cmw-right-2 cmw-top-1/2 cmw-translate-y-[-50%] cmw-pointer-events-none"
            :class="$attrs.disabled ? 'cmw-text-body/50' : 'cmw-text-primary-400'"
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
            cmw-absolute cmw-m-0 cmw-left-4 cmw-transition-all cmw-select-none cmw-pointer-events-none
              "
            :class="(value) ? 'cmw-text-[0.775rem] cmw-px-2 cmw-top-[-0.4rem] cmw-bg-white cmw-text-secondary-800' : 'cmw-top-[0.7rem] cmw-text-gray'"
            v-text="label"
          />
        </div>
        <span v-if="!!errors.length" class="block text-sm text-error" v-text="errors[0]" />
      </div>
    </div>
  </ValidationProvider>
</template>
