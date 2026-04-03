const getCsrfToken = (): string | undefined => {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];
};

const putPostAndThen = (method: string, url: string, data: any, andThen: Function) => {
  const csrfToken = getCsrfToken();
  const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
  };
  if (csrfToken) {
    headers['X-XSRF-TOKEN'] = decodeURIComponent(csrfToken);
  }

  return fetch(url, {
    method: method,
    headers: headers,
    credentials: 'include',
    body: JSON.stringify(data)
  })
  .then((response) => {
    if(!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  })
  .then((data) => andThen(data));
};

const getAndThen = (url: string, andThen: Function) => {
  const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
  };

  return fetch(url, {
    headers: headers,
    credentials: 'include',
  })
  .then((response) => {
    if(!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  })
  .then((data) => andThen(data));
};

const postAndThen = (url: string, data: any, andThen: Function) => {
  return putPostAndThen("post", url, data, andThen);
};

const putAndThen = (url: string, data: any, andThen: Function) => {
  return putPostAndThen("put", url, data, andThen);
};

export { getAndThen, postAndThen, putAndThen };