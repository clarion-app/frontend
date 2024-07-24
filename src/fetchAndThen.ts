import { store } from "./build/store";

const putPostAndThen = (method: string, url: string, data: any, andThen: Function) => {
  const state = store.getState();
  const token = state.token.value;

  const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
  };

  fetch(url, {
    method: method,
    headers: headers,
    body: JSON.stringify(data)
  })
  .then((response) => {
    if(!response.ok) {
      console.error(response);
    }

    return response.json();
  })
  .then((data) => andThen(data));
};

const getAndThen = (url: string, andThen: Function) => {
  const state = store.getState();
  const token = state.token.value;

  const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
  };

  fetch(url, {
    headers: headers
  })
  .then((response) => {
    if(!response.ok) {
      console.error(response);
    }

    return response.json();
  })
  .then((data) => andThen(data));
};

const postAndThen = (url: string, data: any, andThen: Function) => {
  putPostAndThen("post", url, data, andThen);
};

const putAndThen = (url: string, data: any, andThen: Function) => {
  putPostAndThen("put", url, data, andThen);
};

export { getAndThen, postAndThen, putAndThen };