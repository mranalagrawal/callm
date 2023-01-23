<script>
export default {
  name: 'InputField',
  inheritAttrs: false,
  props: {
    value: {
      type: [Number, String, Date],
      default: null,
      validator: prop => ['string', 'number', 'date', 'boolean'].includes(typeof prop) || prop === null,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'text',
    },
    label: {
      type: String,
      required: true,
    },
    rules: {
      type: [Object, String],
      default: '',
    },
    theme: {
      type: String,
      validator: prop => ['light', 'dark', 'gray'].includes(prop),
      default: 'light',
    },
    hideLabel: {
      type: Boolean,
    },
    icon: {
      type: [Object, String],
      default: '',
    },
    clickIcon: {
      type: [Function],
      default: () => {},
    },
  },
  emits: ['input', 'keydown', 'blur', 'focus', 'paste'],
  methods: {
    getTheme() {
      return ({
        light: 'cmw-bg-white',
        gray: 'cmw-bg-gray-lightest',
        dark: 'cmw-bg-black',
      })[this.$props.theme]
    },
  },
}
</script>

<template>
  <ValidationProvider
    v-slot="{ errors }"
    :vid="name"
    :rules="rules"
    :name="name"
    slim
  >
    <div class="cmw-mt-8">
      <div class="cmw-relative">
        <input
          v-bind="[$attrs]"
          :id="name"
          :value="value"
          class="peer cmw-px-4 cmw-text-gray-dark cmw-py-3 cmw-w-full cmw-bg-transparent cmw-border cmw-border-gray-light
              cmw-placeholder-transparent cmw-rounded cmw-transition-colors
              hover:(cmw-border-gray)
              focus:(cmw-outline-none cmw-border-gray-dark cmw-placeholder-gray-light)
              autofill:(cmw-text-body cmw-border-info cmw-text-base)
              disabled:(cmw-border-gray-light/70 cmw-cursor-not-allowed)"
          :class="[
            { 'cmw-border-error': !!errors.length },
            `is-${theme}`,
            { '-filled': value },
          ]"
          :name="name"
          :type="$props.type"
          :placeholder="$attrs.placeholder"
          @input="$emit('input', $event.target.value)"
          @keydown="$emit('keydown', $event)"
          @blur="$emit('blur', $event.target)"
          @focus="$emit('focus', $event.target)"
          @paste="$emit('paste', $event.target)"
        >
        <label
          :for="name"
          class="cmw-absolute cmw-m-0 cmw-left-4 cmw-transition-all cmw-select-none cmw-pointer-events-none cmw-truncate
          peer-focus:(cmw-top-[-0.4rem] cmw-text-[0.775rem] cmw-px-2 cmw-w-auto)
          peer-disabled:(cmw-text-gray-light/70)"
          :class="[
            { 'cmw-sr-only': hideLabel },
            `peer-focus:${getTheme()}`,
            value ? `cmw-text-[0.775rem] cmw-px-2 cmw-top-[-0.4rem] ${getTheme()} cmw-w-auto` : 'cmw-top-[0.75rem] cmw-w-full cmw-pr-8',
            !!errors.length ? 'cmw-text-error' : value ? 'cmw-text-secondary-800' : 'cmw-text-gray',
            `-${theme}`,
          ]"
        ><slot name="label">{{ label }}</slot></label>

        <button
          v-if="icon" type="button"
          class="cmw-transform cmw-absolute cmw-top-1/2 cmw-right-0 cmw-translate-y-[-50%] cmw-translate-x-[-50%]"
          @click="clickIcon"
        >
          <VueSvgIcon :data="icon" color="#E6362E" width="30px" height="30px" />
        </button>
      </div>
      <span v-if="!!errors.length" class="cmw-block cmw-text-sm cmw-text-error">{{ errors[0] }}</span>
    </div>
  </ValidationProvider>
</template>

<style scoped>
/* Temporary Fix */
input:not([type='date'])::-internal-input-suggested {
  @apply cmw-text-base cmw-text-gray-dark;
}

input:not([type='date']):-webkit-autofill ~ label {
  @apply cmw-text-[0.775rem] cmw-px-2 cmw-top-[-0.4rem];
}

input:-webkit-autofill ~ label.-light {
  @apply cmw-bg-white;
}

input:-webkit-autofill ~ label.-gray {
  @apply cmw-bg-gray-lightest;
}

input[type='date']::-webkit-datetime-edit {
  color: theme('colors.transparent');
}

input[type='date']:focus::-webkit-datetime-edit,
input[type='date'].-filled::-webkit-datetime-edit {
  color: theme('colors.gray.dark')
}
</style>
