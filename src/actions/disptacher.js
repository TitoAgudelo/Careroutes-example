import axios from 'axios';

import { routesConstants } from '../constants';
import { history } from '../helpers';

const ROOT_URL='http://careroutes-api-dev.us-east-2.elasticbeanstalk.com/api';

const app = new Vue({
  el: '#root',
  data: {
    view: 'auth',
    regions: null,
    regionId: null,
    routePlanId: undefined,
    routePlanDate: null,
    notifications: [],
    lastId: null,
    connected: false,
    auth: {
      baseUrl: 'http://localhost:3000',
      email: 'admin@example.com',
      password: '',
      token: null,
      error: null,
    },
  },
  created: function() {
    const token = localStorage.getItem('auth-token');

    if (token) {
      this.showNotifications(token);
    }
  },
  methods: {
    signIn() {
      this.auth.error = null;

      if (!this.auth.baseUrl) {
        this.auth.error = 'The base API URL is mandatory.';
        return;
      }

      if (!this.auth.email) {
        this.auth.error = 'The email is mandatory.';
        return;
      }

      if (!this.auth.password) {
        this.auth.error = 'The password is mandatory.';
        return;
      }

      const payload = {
        email: this.auth.email,
        password: this.auth.password,
      };

      axios
        .post(`${this.auth.baseUrl}/api/auth/signin`, payload)
        .then(result => {
          this.showNotifications(result.data.token);
        })
        .catch(err => {
          console.log('Error signing in:', err.response);

          if (err.response.status === 401) {
            this.auth.error = err.response.data.message;
          } else {
            this.auth.error = 'Error trying to sign in.';
          }
        });
    },

    signOut() {
      this.auth.error = null;
      this.auth.token = null;
      this.view = 'auth';
      localStorage.removeItem('auth-token');

      this.clear();
      this.disconnect();
      this.socket = null;
      this.routePlanId = undefined;
      this.lastId = undefined;
    },

    showNotifications(token) {
      localStorage.setItem('auth-token', token);

      this.auth.token = token;
      this.auth.error = null;
      this.view = 'notifications';

      this.loadRegions();
      this.initializeSocket();
    },

    loadRegions() {
      axios
        .get(`${this.auth.baseUrl}/api/regions`, {
          headers: {
            Authorization: `Bearer ${this.auth.token}`,
          },
        })
        .then(result => {
          this.regions = result.data.regions;
          this.regionId = this.regions[0].id;
        })
        .catch(err => {
          console.log('Error loading the regions.', err);
          this.regions = [{ name: 'Error' }];
          this.regionId = null;
        });
    },

    initializeSocket() {
      this.socket = io('/', {
        transportOptions: {
          polling: {
            extraHeaders: {
              Authorization: `Bearer ${this.auth.token}`,
            },
          },
        },
      });

      this.socket.on('disconnect', () => {
        this.connected = false;
      });

      this.socket.on('connect', () => {
        this.connected = true;

        if (this.routePlanId) {
          if (this.lastId) {
            this.recoverMissidNotifications();
          }
          this.joinRoutePlan();
        }
      });

      this.socket.on('error', err => {
        this.connected = false;
        console.log('Socket.io error:', err);
      });

      this.socket.on('route-notification', notification => {
        this.notifications.push(notification);
        this.lastId = notification.id;
      });
    },

    searchRoutePlan() {
      this.clear();

      this.routePlanId = undefined;
      this.lastId = null;

      this.socket.emit('leave-routeplan');

      axios
        .post(
          `${this.auth.baseUrl}/api/routing/planning/check`,
          {
            regionId: this.regionId,
            date: this.routePlanDate,
          },
          {
            headers: {
              Authorization: `Bearer ${this.auth.token}`,
            },
          },
        )
        .then(result => {
          this.routePlanId = result.data.id;
          this.joinRoutePlan();
        })
        .catch(err => {
          console.log('Error loading the route plan.', err);
          if (err.response.status === 404) {
            this.routePlanId = null;
          }
        });
    },

    recoverMissidNotifications() {
      const data = { routePlanId: this.routePlanId, lastId: this.lastId };

      this.socket.emit('missed-notifications', data, (err, notifications) => {
        if (err) {
          console.log('Error getting missed notifications.', err);
        } else {
          this.notifications.push(...notifications);

          if (notifications.length) {
            this.lastId = notifications[notifications.length - 1].id;
          }
        }
      });
    },

    joinRoutePlan() {
      this.socket.emit('join-routeplan', { routePlanId: this.routePlanId }, (err, { lastId }) => {
        if (err) {
          console.log('Error joining the route plan:', err);
        } else {
          this.lastId = lastId;
        }
      });
    },

    toggleConnection() {
      if (this.connected) {
        this.disconnect();
      } else {
        this.connect();
      }
    },

    connect() {
      this.socket.connect();
    },

    disconnect() {
      this.socket.disconnect();
    },

    clear() {
      this.notifications = [];
    },
  },
});