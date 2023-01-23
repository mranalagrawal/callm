<script>
import { ref, watch } from '@nuxtjs/composition-api'
import eyeShowIcon from '~/assets/svg/eye-show.svg'
import eyeHideIcon from '~/assets/svg/eye-hide.svg'
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
        light: 'cmw-bg-white',
        gray: 'cmw-bg-gray-lightest',
        dark: 'cmw-bg-black',
      })[props.theme]
    }

    return { passwordIsVisible, showPasswordToast, barProgressStyle, passwordValidation, getTheme, handleBlur, handleFocus, eyeHideIcon, eyeShowIcon }
  },
}
</script>

<template>
  <div class="cmw-relative">
    <ValidationProvider
      v-slot="{ errors }"
      :vid="name"
      rules="required|min:8|oneNumber|oneUpperCase|oneLowerCase|oneSpecialChar"
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
              focus:(cmw-outline-none cmw-border-gray-dark)
              autofill:(cmw-text-body cmw-border-info cmw-text-base)
              disabled:(cmw-border-gray-light/70 cmw-cursor-not-allowed)"
            :class="[
              { 'cmw-border-error': !!errors.length },
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
          >{{ $t('password').toString() }}</label>

          <button
            type="button"
            class="cmw-transform cmw-absolute cmw-top-1/2 cmw-right-0 cmw-translate-y-[-50%] cmw-translate-x-[-50%]"
            @click="() => passwordIsVisible = !passwordIsVisible"
          >
            <VueSvgIcon :data="passwordIsVisible ? eyeHideIcon : eyeShowIcon" color="#E6362E" width="30px" height="30px" />
          </button>
        </div>
        <span v-if="!!errors.length" class="cmw-block cmw-text-sm cmw-text-error">{{ errors[0] }}</span>
      </div>
    </ValidationProvider>
    <transition name="slideFade" mode="out-in">
      <div
        v-if="showPasswordToast" class="cmw-absolute cmw-w-full cmw-z-100 cmw-transform
           cmw-transition-transform-opacity cmw-translate-x-0 cmw-translate-y-full cmw-bottom-0 cmw-left-0"
      >
        <div
          class="
            cmw-rounded-lg cmw-bg-white cmw-shadow-popover cmw-py-4 cmw-px-6 cmw-mt-8 cmw-relative
            before:(cmw-content-DEFAULT cmw-absolute cmw-w-0 cmw-h-0 cmw-top-[-0.5rem] cmw-left-[1.75rem])
            before:(cmw-border-l-[0.75rem] cmw-border-l-transparent)
            before:(cmw-border-r-[0.75rem] cmw-border-r-transparent)
            before:(cmw-border-b-[0.5rem] cmw-border-b-white)
"
        >
          <p>{{ $t('validations.password.title') }}</p>
          <!-- Note: Maybe we can simplify this with a v-for -->
          <ul class="cmw-py-4">
            <li class="cmw-flex cmw-items-center cmw-gap-2" :class="{ 'cmw-text-success': passwordValidation.min }">
              <VueSvgIcon width="18" height="18" :data="require(`@/assets/svg/checkmark.svg`)" />
              <span v-text="$t('validations.password.min')" />
            </li>
            <li
              class="cmw-flex cmw-items-center cmw-gap-2"
              :class="{ 'cmw-text-success': passwordValidation.oneNumber }"
            >
              <VueSvgIcon width="18" height="18" :data="require(`@/assets/svg/checkmark.svg`)" />
              <span v-text="$t('validations.password.oneNumber')" />
            </li>
            <li
              class="cmw-flex cmw-items-center cmw-gap-2"
              :class="{ 'cmw-text-success': passwordValidation.oneUpperCase }"
            >
              <VueSvgIcon width="18" height="18" :data="require(`@/assets/svg/checkmark.svg`)" />
              <span v-text="$t('validations.password.oneUpperCase')" />
            </li>
            <li
              class="cmw-flex cmw-items-center cmw-gap-2"
              :class="{ 'cmw-text-success': passwordValidation.oneLowerCase }"
            >
              <VueSvgIcon width="18" height="18" :data="require(`@/assets/svg/checkmark.svg`)" />
              <span v-text="$t('validations.password.oneLowerCase')" />
            </li>
            <li
              class="cmw-flex cmw-items-center cmw-gap-2"
              :class="{ 'cmw-text-success': passwordValidation.oneSpecialChar }"
            >
              <VueSvgIcon width="18" height="18" :data="require(`@/assets/svg/checkmark.svg`)" />
              <span v-text="$t('validations.password.oneSpecialChar')" />
            </li>
          </ul>
          <p class="cmw-overline-2">
            {{ $t('validations.password.effectiveness') }}
          </p>
          <div class="cmw-w-full cmw-h-2 cmw-bg-gray-lightest cmw-rounded-pill cmw-overflow-hidden">
            <div class="cmw-h-2 cmw-transition-progress-bar" :style="barProgressStyle" />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
