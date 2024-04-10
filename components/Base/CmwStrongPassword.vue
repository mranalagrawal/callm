<script>
import { ref, watch } from '@nuxtjs/composition-api'

import eyeHideIcon from '~/assets/svg/eye-hide.svg'
import eyeShowIcon from '~/assets/svg/eye-show.svg'

import { regexRules } from '~/utilities/validators'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'CmwStrongPassword',
  props: {
    value: {
      type: [Number, String, Date],
      default: null,
      validator: prop => ['string', 'number', 'date', 'boolean'].includes(typeof prop) || prop === null,
    },
    name: {
      type: String,
      default: 'new-password',
    },
    theme: {
      type: String,
      validator: prop => ['light', 'dark', 'gray'].includes(prop),
      default: 'light',
    },
    hideLabel: {
      type: Boolean,
    },
  },
  emits: ['input', 'keydown'],
  setup(props) {
    const progressStyles = Object.freeze([
      'background: none repeat scroll 0 0 #e6362e; width: 0',
      'background: none repeat scroll 0 0 #e6362e; width: 25%',
      'background: none repeat scroll 0 0 #ffb800; width: 50%',
      'background: none repeat scroll 0 0 #93b7db; width: 75%',
      'background: none repeat scroll 0 0 #517aa3; width: 85%',
      'background: none repeat scroll 0 0 #299100; width: 100%',
    ])

    const passwordIsVisible = ref(false)
    const showPasswordToast = ref(false)

    const barProgressStyle = ref('none repeat scroll 0 0 red; width: 0')
    const passwordValidation = ref({
      min: false,
      oneNumber: false,
      oneUpperCase: false,
      oneLowerCase: false,
      oneSpecialChar: false,
    })

    const passwordValidationLength = Object.keys(passwordValidation.value).length
    const handleFocus = () => showPasswordToast.value = true
    const handleBlur = () => showPasswordToast.value = false

    watch(() => props.value, (val = '') => {
      passwordValidation.value = {
        min: (val.length >= 8),
        oneNumber: new RegExp(regexRules('oneNumber')).test(val),
        oneUpperCase: new RegExp(regexRules('oneUpperCase')).test(val),
        oneLowerCase: new RegExp(regexRules('oneLowerCase')).test(val),
        oneSpecialChar: new RegExp(regexRules('oneSpecialChar')).test(val),
      }

      const nValidRules = Object.values(passwordValidation.value).filter(v => v).length
      barProgressStyle.value = progressStyles[nValidRules]
      showPasswordToast.value = nValidRules < passwordValidationLength
    })

    const getTheme = () => {
      return ({
        light: 'bg-white',
        gray: 'bg-gray-lightest',
        dark: 'bg-black',
      })[props.theme]
    }

    return { passwordIsVisible, showPasswordToast, barProgressStyle, passwordValidation, getTheme, handleBlur, handleFocus, eyeHideIcon, eyeShowIcon }
  },
}
</script>

<template>
  <div class="relative">
    <ValidationProvider
      v-slot="{ errors }"
      :vid="name"
      rules="required|min:8|oneNumber|oneUpperCase|oneLowerCase|oneSpecialChar"
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
              focus:(outline-none border-gray-dark)
              autofill:(text-body border-info text-base)
              disabled:(border-gray-light/70 cursor-not-allowed)"
            :class="[
              { 'border-error': !!errors.length },
              `is-${theme}`,
              { '-filled': value },
            ]"
            :name="name"
            :type="!passwordIsVisible ? 'password' : 'text'"
            :placeholder="$attrs.placeholder"
            @input="$emit('input', $event.target.value)"
            @keydown="$emit('keydown', $event)"
            @focus="handleFocus"
            @blur="handleBlur"
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
          >{{ $t('password').toString() }}</label>

          <button
            type="button"
            class="transform absolute top-1/2 right-0 -translate-y-1/2 -translate-x-1/2"
            @click="() => passwordIsVisible = !passwordIsVisible"
          >
            <VueSvgIcon :data="passwordIsVisible ? eyeHideIcon : eyeShowIcon" color="#E6362E" width="30px" height="30px" />
          </button>
        </div>
        <span v-if="!!errors.length" class="block text-sm text-error">{{ errors[0] }}</span>
      </div>
    </ValidationProvider>
    <transition name="slideFade" mode="out-in">
      <div
        v-if="showPasswordToast" class="absolute w-full z-100 transform
           transition-transform-opacity translate-x-0 translate-y-full bottom-0 left-0"
      >
        <div
          class="
            rounded-lg bg-white shadow-popover py-4 px-6 mt-8 relative
            before:(content-DEFAULT absolute w-0 h-0 top-[-0.5rem] left-[1.75rem])
            before:(border-l-[0.75rem] border-l-transparent)
            before:(border-r-[0.75rem] border-r-transparent)
            before:(border-b-[0.5rem] border-b-white)
"
        >
          <p>{{ $t('validations.password.title') }}</p>
          <!-- Note: Maybe we can simplify this with a v-for -->
          <ul class="py-4">
            <li class="flex items-center gap-2" :class="{ 'text-success': passwordValidation.min }">
              <VueSvgIcon width="18" height="18" :data="require(`@/assets/svg/checkmark.svg`)" />
              <span v-text="$t('validations.password.min')" />
            </li>
            <li
              class="flex items-center gap-2"
              :class="{ 'text-success': passwordValidation.oneNumber }"
            >
              <VueSvgIcon width="18" height="18" :data="require(`@/assets/svg/checkmark.svg`)" />
              <span v-text="$t('validations.password.oneNumber')" />
            </li>
            <li
              class="flex items-center gap-2"
              :class="{ 'text-success': passwordValidation.oneUpperCase }"
            >
              <VueSvgIcon width="18" height="18" :data="require(`@/assets/svg/checkmark.svg`)" />
              <span v-text="$t('validations.password.oneUpperCase')" />
            </li>
            <li
              class="flex items-center gap-2"
              :class="{ 'text-success': passwordValidation.oneLowerCase }"
            >
              <VueSvgIcon width="18" height="18" :data="require(`@/assets/svg/checkmark.svg`)" />
              <span v-text="$t('validations.password.oneLowerCase')" />
            </li>
            <li
              class="flex items-center gap-2"
              :class="{ 'text-success': passwordValidation.oneSpecialChar }"
            >
              <VueSvgIcon width="18" height="18" :data="require(`@/assets/svg/checkmark.svg`)" />
              <span v-text="$t('validations.password.oneSpecialChar')" />
            </li>
          </ul>
          <p class="overline-2">
            {{ $t('validations.password.effectiveness') }}
          </p>
          <div class="w-full h-2 bg-gray-lightest rounded-pill overflow-hidden">
            <div class="h-2 transition-progress-bar" :style="barProgressStyle" />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
