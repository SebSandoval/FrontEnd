import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        token: "",
        nombre: "",
        rol: "",
        id:"",
    },

    mutations: {
        setToken(state, value) {
            state.token = value;
        },
        setRol(state, value) {
            state.rol = value;
        },
        setNombre(state, value) {
            state.nombre = value;
        },
        setId(state, value) {
            state.id = value;
        },
    },
    actions:{
        setToken(context, value){
            context.commit("setToken", value);
        },
        setRol(context, value){
            context.commit("setRol", value);
        },
        setNombre(context, value){
            context.commit("setNombre", value);
        },
        setId(context, value){
            context.commit("setId", value);
        }
    }
})