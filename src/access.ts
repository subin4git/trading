/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};
  return {
    isBroker: currentUser && currentUser.usertype === 'broker',
    isStocker: currentUser && currentUser.usertype === 'stocker',
  };
}
