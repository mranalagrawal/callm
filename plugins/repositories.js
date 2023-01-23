import createRepository from '~/repositories'

export default (ctx, inject) => {
  inject('cmwRepo', createRepository(ctx))
}
