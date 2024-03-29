export const setSearchQuery = (keyname: string, value: string) => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    params.set(keyname, value);
    url.search = params.toString();
    window.history.pushState(null, '', url.toString());
};

export const removeSearchQuery = () => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    params.delete("location");
    params.delete("guest");
    params.delete("category");
    params.delete("newest");
    params.delete("alphabate");
    params.delete("price");
    params.delete("limit");
    url.search = params.toString();
    window.history.pushState(null, '', url.toString());
};