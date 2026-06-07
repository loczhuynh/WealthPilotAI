export const getUserId = () =>
    Number(localStorage.getItem("userId"));

export const getToken = () =>
    localStorage.getItem("token");

export const isLoggedIn = () =>
    !!localStorage.getItem("token");