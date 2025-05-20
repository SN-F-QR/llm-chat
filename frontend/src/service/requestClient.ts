import axios, { type Axios } from 'axios';

class RequestClient {
  public client: Axios;
  private loggedIn: boolean;

  public get isLogin(): boolean {
    return this.loggedIn;
  }

  constructor() {
    const clientToken = localStorage.getItem('token');
    if (clientToken !== null) {
      this.client = axios.create({
        baseURL: '/api',
        headers: {
          Authorization: `Bearer ${clientToken}`,
        },
      });
      this.loggedIn = true;
      // console.log('Token found in localStorage:', clientToken);
    } else {
      this.client = axios.create({
        baseURL: '/api',
      });
      this.loggedIn = false;
      console.log('No token found in localStorage');
    }
  }

  public login = async (stuNum: string, password: string): Promise<boolean> => {
    if (localStorage.token !== undefined) {
      throw new Error('Already logged in');
    }
    const response = await this.client.post<{ info: string; token: string }>('/auth/login', {
      stuNum: stuNum,
      password: password,
    });
    if (response.status === 200) {
      console.log(response.data.info);
      localStorage.setItem('token', response.data.token);
      this.loggedIn = true;
      this.client.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;
      return true;
    }
    return false;
  };

  public logout = async () => {
    if (!this.isLogin) {
      return;
    }
    const response = await this.client.get('/auth/logout');
    if (response.status === 200) {
      localStorage.removeItem('token');
      this.loggedIn = false;
      delete this.client.defaults.headers.common.Authorization;
      return true;
    } else {
      throw new Error('Logout failed: Incorrect status code');
    }
  };
}

const reqClient = new RequestClient();

export default reqClient;
