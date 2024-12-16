export const storeToSelect = store => store.map(item => ({
  value: item,
  label: item
}))
