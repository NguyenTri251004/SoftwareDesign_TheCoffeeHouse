const authProvider = {
    login: ({ username, password }) => {
        localStorage.setItem('role', 'admin');
        localStorage.setItem('username', username);
        return Promise.resolve();
    },
  
    logout: () => {
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        return Promise.resolve();
    },
  
    checkAuth: () => {
        return localStorage.getItem('role') ? Promise.resolve() : Promise.reject();
    },
  
    checkError: () => Promise.resolve(),
  
    getPermissions: () => {
        const role = localStorage.getItem('role');
        return role ? Promise.resolve(role) : Promise.reject();
    },
  
    getIdentity: () => {
        return Promise.resolve({
            id: '123',
            fullName: 'bocchi',
            email: 'thecoffeehouse@gmail.com',
            avatar: 'https://th.bing.com/th/id/OIP.4NDUADoxnaqcHc21TWtWbAHaEK?w=1280&h=720&rs=1&pid=ImgDetMain'
        });
    }
  };
  
  export default authProvider;
  