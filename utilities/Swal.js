import Swal from 'sweetalert2/dist/sweetalert2.min'
import {getIconAsImg} from "@/utilities/icons";
export const SweetAlertConfirm = Swal.mixin({
  buttonsStyling: false,
  icon: 'info',
  showCancelButton: true,
  closeButtonHtml: getIconAsImg('close'),
  showLoaderOnConfirm: true,
  preConfirm () {},
  allowOutsideClick: () => !Swal.isLoading(),
  backdrop: 'rgba(0, 0, 0, 0.45)',
  background: 'rgba(255, 255, 255, 1)',
  reverseButtons: true,
  showCloseButton: true,
  // TODO: Implement a nice wine glass loader
  loaderHtml: '<div class="loader loader--style2" title="1">\n' +
    '  <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n' +
    '     width="40px" height="40px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">\n' +
    '  <path fill="#2c8982" d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z">\n' +
    '    <animateTransform attributeType="xml"\n' +
    '      attributeName="transform"\n' +
    '      type="rotate"\n' +
    '      from="0 25 25"\n' +
    '      to="360 25 25"\n' +
    '      dur="0.6s"\n' +
    '      repeatCount="indefinite"/>\n' +
    '    </path>\n' +
    '  </svg>\n' +
    '</div>',
  customClass: {
    title: 'h3',
    htmlContainer: 'cmw-text-body',
    actions: 'cmw-grid cmw-grid-cols-2 cmw-gap-4 cmw-w-3/4',
    confirmButton: 'cmw-btn-base cmw-btn-default',
    denyButton: 'cmw-btn-base cmw-btn-text',
    cancelButton: 'cmw-btn-base cmw-btn-text',
    loader: 'cmw',
  },
})

export const SweetAlertFeedback = Swal.mixin({
  icon: 'success',
  timer: 2000,
})

export const SweetAlertToast = Swal.mixin({
  toast: true,
  position: 'bottom',
  showConfirmButton: false,
  timerProgressBar: true,
  timer: 2500,
  background: 'rgba(0, 0, 0, 0.85)',
  customClass: {
    htmlContainer: 'cmw-text-gray-lightest',
  },
})
