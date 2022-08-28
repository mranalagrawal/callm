export default function ({ redirect, store }) {
  const isAuthenticated = store.state.user.user ? true : false;
  if (!isAuthenticated) {
    redirect({ name: "index" });
  }
}
