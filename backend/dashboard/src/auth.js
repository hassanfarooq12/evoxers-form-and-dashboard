export const isAdminLoggedIn = () => {
  return localStorage.getItem("admin") === "true";
};

export const loginAdmin = () => {
  localStorage.setItem("admin", "true");
};

export const logoutAdmin = () => {
  localStorage.removeItem("admin");
};


