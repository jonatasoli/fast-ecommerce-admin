import { writable } from 'svelte/store'

export function createInventory() {
  const store = writable({
  inventory: [],
  page: 1,
  offset: 10,
  totalPages: 0,
  totalRecords: 0,
  });
  store.request = async (method, url, params={}, token) => {
    store.update(data => {
      delete data.errors
      data.loading = true

      return data
    })

    // define headers and body
    const headers = {
      "Content-type": "application/json",
      "Authorization": `Bearer ${token}`,
    }
    const body = (method === 'POST' || method === 'PATCH' || method === 'DELETE') ? JSON.stringify(params) : undefined;

    // execute fetch
    const response = await fetch(`${url}`, { method, body, headers })
    // pull out json body
    const json = await response.json()

    // if response is 2xx
    if (response.ok) {
      // update the store, which will cause subscribers to be notified
      store.update(data => ({ ...data, ...json, loading: false }));
    } else {
      // response failed, set `errors` and clear `loading` flag
      store.update(data => {
        console.log('dados')
        console.log(data)
        data.loading = false
        data.errors = json.errors
        return data
      })
    }
  }
  // convenience wrappers for get, post, patch, and delete
  store.get = (url, token) => store.request('GET', url, token);
  store.post = (url, params, token) => store.request('POST', url, params, token);
  store.patch = (url, params, token) => store.request('PATCH', url, params, token);
  store.delete = (url, params, token) => store.request('DELETE', url, params, token);

  // return the customized store
  return store
}
