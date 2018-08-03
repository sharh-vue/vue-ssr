import Vue from 'vue'
import Vuex from "vuex"

Vue.use(Vuex)

export function createStore(context) {
  return new Vuex.Store({
    state: {
      name: 'test'
    },
    actions: {
      CHANGE_NAME({commit, dispatch, state}, data){
        commit('SET_NAME', data);
      }
    },
    mutations: {
      SET_NAME(state, data){
        state.name = data;
      }
    }
  })
}