<script>
import checkboxIcon from '~/assets/svg/checkbox.svg'
import checkboxBlankIcon from '~/assets/svg/checkbox-blank.svg'

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
    class="cmw-block cmw-text-left"
    slim
  >
    <div class="cmw-flex cmw-gap-6 cmw-my-6 cmw-text-left">
      <div class="cmw-relative cmw-flex cmw-items-start cmw-gap-2">
        <span class="cmw-w-[22px] cmw-h-[22px] cmw-flex-shrink-0" />
        <input
          v-bind="$attrs"
          :id="`${id}-checkbox`"
          :value="checked"
          :checked="checked"
          type="checkbox"
          class="ripple peer cmw-absolute cmw-block cmw-appearance-none cmw-flex-[0_0_26px] cmw-w-[26px] cmw-h-[26px]
           cmw-rounded-full cmw-top-[-2px] cmw-left-[-2px] cmw-bg-center
           [@supports(-webkit-touch-callout:none)]:scale-[4] default:ring-2 checked:outline-4"
          :name="id"
          @change="handleChange($event.target.checked)"
        >
        <span class="cmw-absolute cmw-flex cmw-text-primary-400 cmw-w-[22px] cmw-h-[22px] cmw-top-0 cmw-left-0 cmw-pointer-events-none">
          <VueSvgIcon :data="($attrs.checked || checked) ? checkboxIcon : checkboxBlankIcon" width="22" height="22" />
        </span>
        <label :for="`${id}-checkbox`" class="cmw-m-0">
          <slot name="label" />
        </label>
      </div>
    </div>
    <span v-if="!!errors.length" class="cmw-block cmw-relative cmw-top-[-1rem] cmw-text-sm cmw-text-error cmw-pl-[30px]" v-text="errors[0]" />
  </ValidationProvider>
</template>

<style scoped>
.ripple {
  background-position: center;
  transition: background 0.8s;
}

.ripple:hover {
  background: theme('colors.primary.50') radial-gradient(circle, transparent 1%, theme('colors.primary.50') 1%) center/15000%;
}
.ripple:active {
  background-size: 100%;
  background-color: theme('colors.primary.100');
  transition: background 0s;
}
</style>
