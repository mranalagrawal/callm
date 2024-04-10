<script>
import checkboxBlankIcon from '~/assets/svg/checkbox-blank.svg'
import checkboxIcon from '~/assets/svg/checkbox.svg'

export default {
  name: 'CmwCheckbox',
  inheritAttrs: false,
  model: {
    prop: 'checked',
    emit: 'change',
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    checked: Boolean,
    isRequired: { type: Boolean },
    theme: { type: String, default: 'light' },
  },
  emits: ['change'],
  setup(_, { attrs, emit }) {
    const handleChange = checked => emit('change', attrs['true-value'] ? attrs[`${checked}-value`] : checked)

    return { handleChange, checkboxIcon, checkboxBlankIcon }
  },
}
</script>

<template>
  <ValidationProvider
    v-slot="{ errors }"
    :vid="id"
    :rules="$attrs.required || { required: { allowFalse: !isRequired } }"
    :name="id"
    class="block text-left"
    slim
  >
    <div class="flex gap-6 my-6 text-left">
      <div class="relative flex items-start gap-2">
        <span class="w-[22px] h-[22px] flex-shrink-0" />
        <input
          v-bind="$attrs"
          :id="`${id}-checkbox`"
          :value="checked"
          :checked="checked"
          type="checkbox"
          class="ripple peer absolute block appearance-none flex-[0_0_26px] w-[26px] h-[26px]
           rounded-full top-[-2px] left-[-2px] bg-center
           [@supports(-webkit-touch-callout:none)]:scale-[4] default:ring-2 checked:outline-4"
          :name="id"
          @change="handleChange($event.target.checked)"
        >
        <span
          class="absolute flex w-[22px] h-[22px] top-0 left-0 pointer-events-none"
          :class="theme === 'dark' ? 'text-white' : 'text-primary-400'"
        >
          <VueSvgIcon :data="($attrs.checked || checked) ? checkboxIcon : checkboxBlankIcon" width="22" height="22" />
        </span>
        <label :for="`${id}-checkbox`" class="m-0">
          <slot name="label" />
        </label>
      </div>
    </div>
    <span v-if="!!errors.length" class="block relative top-[-1rem] text-sm text-error pl-[30px]" v-text="errors[0]" />
  </ValidationProvider>
</template>

<style scoped>
.ripple {
  background-position: center;
  transition: background 0.8s;
}

.ripple:hover {
  background: radial-gradient(circle, transparent 1%, theme('colors.primary.50') 1%) center/15000% theme('colors.primary.50');
}

.ripple:active {
  background-size: 100%;
  background-color: theme('colors.primary.100');
  transition: background 0s;
}
</style>
