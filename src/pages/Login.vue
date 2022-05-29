<template  >
  <div>
    <v-form ref="formulario" heigth="auto" class="ma-5 pa-5">
      <v-row class="ma-1 pa-5" justify="center">
        <v-card elevation="0">
          <v-card-title>
            <span class="primary--text font-weight-black"> Login</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="Email*"
                    v-model="email"
                    color=" primary white--text"
                    :rules="rules"
                    prepend-icon="mdi-account"
                    @keyup.enter="guardar()"
                    required
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="password"
                    label="Contraseña*"
                    color=" primary white--text"
                    :rules="pass"
                    prepend-icon="mdi-lock"
                    required
                    :type="show ? 'text' : 'password'"
                    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="show = !show"
                    @keyup.enter="guardar()"
                  >
                    ></v-text-field
                  >
                </v-col>
              </v-row>
            </v-container>
            <small>*Indicadores requeridos</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              class="font-weight-black"
              @click="guardar()"
              color="primary "
              text
               
              :loading="loading"
            >
              Iniciar Sesión
            </v-btn>
          </v-card-actions>

          <v-alert color="red" shaped v-if="b == true" type="warning">
            {{ error }}
          </v-alert>
          <v-alert color="green" v-else-if="b == false" type="success">{{
            error
          }}</v-alert>
        </v-card>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    email: "",
    password: "",
    loading: false,
    users: [],
    show: false,
    rules: [(value) => !!value || "Requerido"],
    pass: [
      (value) => !!value || "Requerido",
      (value) => (value && value.trim().length >= 6) || "Minimo 6 caracteres",
    ],
    error: "",
    b: null,
  }),
  created() {
    this.traerUsuarios();
  },
  methods: {
    traerUsuarios() {
      axios
        .get("usuario")
        .then((response) => {
          response.data.usuario;
        })
        .catch((error) => {
          console.log(error.response);
        });
    },

    /*  async guardar() {
      if (!this.$refs.formulario.validate()) {
        this.$fire({
          title: "Datos incorrectos",

          type: "error",
          timer: 1500,
        });
      } else {
          


        this.error = "Datos correctos";
        this.b = false;
        setTimeout(() => {
          this.b = null;
          this.$router.replace({ path: "/home" });
        }, 1000);
        this.loading = true;

        await new Promise((resolve) => setTimeout(resolve, 1000));

        this.loading = false;
      }
    }, */
    async guardar() {
      axios
        .post("usuario/login", {
          email: this.email,
          password: this.password,
        })
        .then((response) => {
          this.$store.dispatch("setNombre", response.data.usuario.nombre);
          this.$store.dispatch("setRol", response.data.usuario.rol);
          this.$store.dispatch("setToken", response.data.token);
          this.$store.dispatch("setId", response.data.usuario._id);
          console.log(this.$store.state.token);
          this.error = "Datos correctos";
          this.b = false;
          setTimeout(() => {
            this.b = null;
            this.$router.replace({ path: "/home" });
          }, 1000);
          this.loading = true;

        })
        .catch((err) => {
          console.log(err.response);
          if (!err.response.data.msg) {
            this.$fire({
              title: err.response.data.errors[0].msg,
              type: "error",
              background: "primary",
            });
          } else {
            this.$fire({
              title: err.response.data.msg,
              type: "error",
              background: "primary",
            });
          }
        });
    },
  },
};
</script>

<style scoped>
#fire {
  font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
}
</style>