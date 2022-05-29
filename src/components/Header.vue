<template>
  <div>
    <v-app-bar class="primary" dark>
      <v-app-bar-nav-icon
        v-if="$store.state.token != ''"
        @click="drawer = true"
      ></v-app-bar-nav-icon>
      <v-toolbar-title class="headline"> <p
        :class="{
          'subtitle-1 font-weight-black mx-auto mt-3': $vuetify.breakpoint.xs,
          'mx-auto mt-3 font-weight-medium': $vuetify.breakpoint.smAndUp,
        }"
      >
        Sistema de Compraventa

        <!-- class="mx-auto mt-3 font-weight-medium" -->
      </p></v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- v-if="$store.state.token != ''"
        class="secondary primary--text pr-5" -->

     

      <v-btn
        v-if="$store.state.token != ''"
        color="primary"
        @click="drawerSalir()"
      >
        <v-icon>mdi-account-settings</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      temporary
      app
      clipped
      color="primary"
      elevation="0"
    >
      <v-list nav dense class="text-xs-h1">
  

        <v-list-item-group v-model="group" active-class="primary white--text">
          <!--  <v-card height="210px" class="mb-2">
    
      <template v-slot:prepend>
        <v-list-item two-line>
          <v-list-item-avatar>
            <img src="https://randomuser.me/api/portraits/women/81.jpg">
          </v-list-item-avatar>

          <v-list-item-content>
   {{$store.state.nombre}} <br/>
   {{$store.state.rol}}
          </v-list-item-content>
        </v-list-item>
      </template>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          :to="item.url"
        >
          <v-list-item-icon >
            <v-icon>{{ item.icon }}</v-icon>
            
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
   
  </v-card>
 -->

          <v-card class="card overflow-hidden" elevation="0">
            <v-list>
              <v-list-group
                v-if="
                  $store.state.rol === 'ALMACENISTA' ||
                  $store.state.rol === 'ADMINISTRADOR'
                "
                :value="false"
                prepend-icon="mdi-server"
              >
                <template v-slot:activator>
                  <v-list-item-title>Almacen</v-list-item-title>
                </template>

                <v-list-item
                  v-for="([title, icon, url], i) in admins"
                  :key="i"
                  link
                  :to="url"
                >
                  <v-list-item-title v-text="title"></v-list-item-title>

                  <v-list-item-icon>
                    <v-icon v-text="icon"></v-icon>
                  </v-list-item-icon>
                </v-list-item>
              </v-list-group>

              <v-list-group
                v-if="
                  $store.state.rol === 'ALMACENISTA' ||
                  $store.state.rol === 'ADMINISTRADOR'
                "
                :value="false"
                prepend-icon="mdi-arrow-top-right"
              >
                <template v-slot:activator>
                  <v-list-item-title>Compras</v-list-item-title>
                </template>

                <v-list-item
                  v-for="([title, icon, url], i) in cruds"
                  :key="i"
                  link
                  :to="url"
                >
                  <v-list-item-title v-text="title"></v-list-item-title>

                  <v-list-item-icon>
                    <v-icon v-text="icon"></v-icon>
                  </v-list-item-icon>
                </v-list-item>
              </v-list-group>
              <v-list-group
                v-if="
                  $store.state.rol === 'VENDEDOR' ||
                  $store.state.rol === 'ADMINISTRADOR'
                "
                :value="false"
                prepend-icon=" mdi-chart-line"
              >
                <template v-slot:activator>
                  <v-list-item-title>Ventas</v-list-item-title>
                </template>

                <v-list-item
                  v-for="([title, icon, url], i) in ventas"
                  :key="i"
                  link
                  :to="url"
                >
                  <v-list-item-title v-text="title"></v-list-item-title>

                  <v-list-item-icon>
                    <v-icon v-text="icon"></v-icon>
                  </v-list-item-icon>
                </v-list-item>
              </v-list-group>

              <v-list-group
                v-if="$store.state.rol === 'ADMINISTRADOR'"
                :value="false"
                prepend-icon="mdi-tag-plus"
              >
                <template v-slot:activator>
                  <v-list-item-title>Consultas</v-list-item-title>
                </template>

                <v-list-item
                  v-for="([title, icon, url], i) in consultas"
                  :key="i"
                  link
                  :to="url"
                >
                  <v-list-item-title v-text="title"></v-list-item-title>

                  <v-list-item-icon>
                    <v-icon v-text="icon"></v-icon>
                  </v-list-item-icon>
                </v-list-item>
              </v-list-group>
              <v-list-group
                v-if="$store.state.rol === 'ADMINISTRADOR'"
                :value="false"
                prepend-icon="mdi-locker-multiple"
              >
                <template v-slot:activator>
                  <v-list-item-title>Accesos</v-list-item-title>
                </template>

                <v-list-item
                  v-for="([title, icon, url], i) in accesos"
                  :key="i"
                  link
                  :to="url"
                >
                  <v-list-item-title v-text="title"></v-list-item-title>

                  <v-list-item-icon>
                    <v-icon v-text="icon"></v-icon>
                  </v-list-item-icon>
                </v-list-item>
              </v-list-group>
            </v-list>
          </v-card>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer
      v-model="drawerRight"
      temporary
      color="primary"
      elevation="0"
      right
      app
      clipped
    >
      <v-list-item>
        <v-list-item-avatar>
          <v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title class="white--text">
            {{ this.$store.state.nombre }}</v-list-item-title
          >
          <v-list-item-subtitle class="white--text">
            {{ this.$store.state.rol }}</v-list-item-subtitle
          >
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          :to="item.url"
          link
        >
          <v-list-item-icon>
            <v-icon class="white--text">{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="subtitle-1 white--text">{{
              item.title
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-btn
        block
        color="primary
  "
        class="white--text"
        elevation="0"
        @click="abrirDialogSalir()"
        >Cerrar Sesión <v-icon right dark> mdi-logout </v-icon>
      </v-btn>
    </v-navigation-drawer>

    <v-dialog v-model="dialogSalir" max-width="550px">
      <v-card color="primary">
        <v-card-title class="white--text text-h5"
          >¿Seguro que desea cerrar sesión?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" text @click="cerrarSalir()">Cancelar</v-btn>
          <v-btn color="secondary" text @click="salir()">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  data: () => ({
    drawer: false,
    drawerRight: false,
    group: null,
    dialogSalir: false,
    items: [{ title: "Home", icon: "mdi-view-dashboard", url: "/home" }],

    admins: [
      ["Categorias", "mdi-monitor-multiple", "/categorias"],
      ["Articulos", "mdi-view-module", "/articulos"],
    ],
    cruds: [
      ["Ingresos", "mdi-plus-outline", "/ingresos"],
      ["Proveedores", "mdi-file-outline", "/proveedores"],
    ],
    ventas: [
      ["Ventas", "mdi-plus-outline", "/ventas"],
      ["Clientes", "mdi-account-multiple-outline", "/clientes"],
    ],
    accesos: [["Usuarios", "mdi-account-multiple-outline", "/usuarios"]],
    consultas: [
      ["Consulta compras", "mdi-plus-outline", "/consultac"],
      ["Consulta ventas", "mdi-file-outline", "/consultav"],
    ],
  }),
  methods: {
    drawerSalir() {
      this.drawerRight = true;
    },
    salir() {
      this.$store.state.token = "";
      setTimeout(() => {
        this.$router.replace({ path: "/" });
      }, 500);
      this.cerrarSalir();
    },
    abrirDialogSalir() {
      this.dialogSalir = true;
    },
    cerrarSalir() {
      this.dialogSalir = false;
    },
  },
};
</script>

<style scoped>
</style>
