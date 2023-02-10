<script>
import { customerReset } from '../utilities/getUser'
export default {
  data() {
    return {
      passwordIsVisible: false,
      password: '',
      userId: null,
      token: null,
    }
  },
  computed: {
    passwordStrenght() {
      let strenght = 1
      if (this.noSpecialChar)
        strenght++
      if (this.length)
        strenght++
      if (this.letter)
        strenght++
      return strenght
    },
    noSpecialChar() {
      return (
        !/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(this.password)
        && this.password.length > 0
      )
    },
    length() {
      return this.password.length >= 8
    },
    letter() {
      return /[a-z]/i.test(this.password)
    },
  },
  created() {
    this.userId = `gid://shopify/Customer/${this.$route.query.id}`
    this.token = this.$route.query.token
  },
  methods: {
    async submit(e) {
      e.preventDefault()
      window.stop()

      const domain = this.$config.DOMAIN
      const access_token = this.$config.STOREFRONT_ACCESS_TOKEN

      const response = await customerReset(
        domain,
        access_token,
        this.userId,
        this.password,
        this.token,
      )

      this.$router.push('/login')
    },
  },
}
</script>

<template>
  <div class="container-fluid vh-100">
    <div class="row mt-5">
      <div class="col-12 text-center">
        <p class="h2">
          Imposta una nuova password
        </p>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-12 col-md-4 text-center">
        <p>userid: {{ userId }}</p>
        <p>token: {{ token }}</p>
        <form class="mt-5" @submit="submit">
          <b-form-group id="input-group-1" class="position-relative">
            <i
              v-if="passwordIsVisible"
              class="fal fa-eye-slash position-absolute text-light-secondary pointer"
              style="right: 10px; top: 10px"
              @click="passwordIsVisible = !passwordIsVisible"
            />
            <i
              v-else
              class="fal fa-eye position-absolute text-light-secondary pointer"
              style="right: 10px; top: 10px"
              @click="passwordIsVisible = !passwordIsVisible"
            />
            <b-form-input
              id="input-2"
              v-model="password"
              class="custom-input"
              :type="passwordIsVisible ? 'text' : 'password'"
              required
            />
            <div class="helper card shadow text-left mt-4">
              <p>La password deve contenere:</p>
              <p v-if="length" class="text-success">
                <i class="fal fa-check" /> almeno 8 caratteri
              </p>
              <p v-else class="text-danger">
                <i class="fal fa-times" /> almeno 8 caratteri
              </p>
              <p v-if="letter" class="text-success">
                <i class="fal fa-check" /> una lettera
              </p>
              <p v-else class="text-danger">
                <i class="fal fa-times" /> una lettera
              </p>
              <p v-if="noSpecialChar" class="text-success">
                <i class="fal fa-check" /> nessun carattere speciale
              </p>
              <p v-else class="text-danger">
                <i class="fal fa-times" /> nessun carattere speciale
              </p>
              <p>Efficacia password</p>

              <div class="progress">
                <div
                  class="progress-bar"
                  role="progressbar"
                  :style="{ width: `${passwordStrenght * 25}%` }"
                  aria-valuenow="25"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  :class="
                    passwordStrenght < 2
                      ? 'bg-danger'
                      : passwordStrenght < 4
                        ? 'bg-warning'
                        : 'bg-success'
                  "
                />
              </div>
            </div>
          </b-form-group>
          <button class="btn btn-light-secondary w-100 mt-5">
            INVIA
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-label {
  position: relative;
  bottom: -11px;
  left: 12px;
  padding: 0px 4px;
  background: white;
  color: #11312b;
}
.custom-input {
  border-radius: 10px;
  border-color: #11312b;
  border-width: 2px;
}

.helper {
  height: 0px;
  padding: 24px;
  height: auto;
}
</style>
