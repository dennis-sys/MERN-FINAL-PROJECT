export const useApi = () => {
  const get = async (url) => (await fetch(url)).json();
  const post = async (url, data) =>
    (await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })).json();

  const put = async (url, data) =>
    (await fetch(url, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })).json();

  const del = async (url) => await fetch(url, { method: "DELETE" });

  return { get, post, put, del };
};
