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
      type: [String, Object], // <-- Using object until we turn this script to ts, so we can properly use VueI18n.TranslateResult
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
        light: 'bg-white',
        gray: 'bg-gray-lightest',
        dark: 'bg-black',
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
    <div class="mt-8">
      <div class="relative">
        <input
          v-bind="[$attrs]"
          :id="name"
          :value="value"
          class="peer px-4 text-gray-dark py-3 w-full bg-transparent border border-gray-light
              placeholder-transparent rounded transition-colors
              hover:(border-gray)
              focus:(outline-none border-gray-dark placeholder-gray-light)
              autofill:(text-body border-info text-base)
              disabled:(border-gray-light/70 cursor-not-allowed)"
          :class="[
            { 'border-error': !!errors.length },
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
          class="absolute m-0 left-4 transition-all select-none pointer-events-none truncate
          peer-focus:(top-[-0.4rem] text-[0.775rem] px-2 w-auto)
          peer-disabled:(text-gray-light/70)"
          :class="[
            { 'sr-only': hideLabel },
            `peer-focus:${getTheme()}`,
            value ? `text-[0.775rem] px-2 top-[-0.4rem] ${getTheme()} w-auto` : 'top-[0.75rem] w-full pr-8',
            !!errors.length ? 'text-error' : value ? 'text-secondary-800' : 'text-gray',
            `-${theme}`,
          ]"
        ><slot name="label">{{ label }}</slot></label>

        <button
          v-if="icon" type="button"
          class="transform absolute top-1/2 right-0 -translate-y-1/2 -translate-x-1/2"
          @click="clickIcon"
        >
          <VueSvgIcon :data="icon" color="#E6362E" width="30px" height="30px" />
        </button>
      </div>
      <span v-if="!!errors.length" class="block text-sm text-error">{{ errors[0] }}</span>
    </div>
  </ValidationProvider>
</template>

<style scoped>
/* Temporary Fix */
input:not([type='date'])::-internal-input-suggested {
  @apply text-base text-gray-dark;
}

input:not([type='date']):-webkit-autofill ~ label {
  @apply text-[0.775rem] px-2 top-[-0.4rem];
}

input:-webkit-autofill ~ label.-light {
  @apply bg-white;
}

input:-webkit-autofill ~ label.-gray {
  @apply bg-gray-lightest;
}

input[type='date']::-webkit-datetime-edit {
  color: theme('colors.transparent');
}

input[type='date']:focus::-webkit-datetime-edit,
input[type='date'].-filled::-webkit-datetime-edit {
  color: theme('colors.gray.dark')
}
</style>
