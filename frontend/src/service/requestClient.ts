import axios, { type Axios } from 'axios';

class RequestClient {
  public client: Axios;
  private loggedIn: boolean;
  private isInitialized: boolean;

  public get isLogin(): boolean {
    return this.loggedIn;
  }

  constructor() {
    this.isInitialized = false;
    this.loggedIn = false;
    this.client = axios.create({
      baseURL: '/api',
    });
  }

  public initialize = async (): Promise<void> => {
    if (this.isInitialized) return;
    const clientToken = localStorage.getItem('token');
    if (clientToken !== null) {
      this.client.defaults.headers.common.Authorization = `Bearer ${clientToken}`;
      try {
        const response = await this.client.get('/auth/verify');
        if (response.status === 200) {
          this.loggedIn = true;
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        localStorage.removeItem('token');
        delete this.client.defaults.headers.common.Authorization;
      }
    }

    this.isInitialized = true;
  };

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
await reqClient.initialize();

export default reqClient;
