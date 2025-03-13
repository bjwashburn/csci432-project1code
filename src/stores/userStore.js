import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    profile: null,
    token: null,
  }),
  actions: {
    setUserData(profile, token) {
      this.profile = profile;
      this.token = token;
    },
    clearUserData() {
      this.profile = null;
      this.token = null;
    },
    setToken(token) {
      this.token = token;
    },
    setProfile(profile) {
      this.profile = profile;
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    getToken: (state) => state.token,
    getProfile: (state) => state.profile,
  },
});