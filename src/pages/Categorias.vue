<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="buscar"
      :items-per-page="15"
      class="elevation-1 pa-2 ma-2"
    >
      <template v-slot:top>
             <v-card flat>
        <v-form ref="form">
          <v-container class="spacing-playground pa-10">
            <v-row>
              <v-col cols="12" sm="4"   class="d-flex justify-center headline">
                <v-toolbar-title 
                  ><p
                          :class="{
                            'mx-auto mt-3 title font-weight-bold':
                              $vuetify.breakpoint.xs,
                            ' body-1   mt-3 mr-3 pr-3 font-weight-bold':
                              $vuetify.breakpoint.sm,
                               ' headline   mt-3 mr-3 pr-3 font-weight-bold':
                              $vuetify.breakpoint.mdAndUp,
                          }"
                        >
                          CATEGORIAS

                          <!-- class="mx-auto mt-3 font-weight-medium" -->
                        </p></v-toolbar-title
                >
                <v-divider class="mx-4" insert vertical></v-divider>
                 <v-icon color="primary" @click="crearPDF()">mdi-printer</v-icon>
              </v-col>
              <v-col  cols="12" sm="4"  >
                   <v-text-field
            class="mx-auto"
            v-model.trim="search"
            append-icon="mdi-magnify"
            label="Buscar por nombre"
            single-line
            hide-details
          ></v-text-field>
              </v-col>
              <v-col cols="12"  sm="4" class="d-flex justify-center">
                <v-btn @click="abrirModal()" dark class="primary"
                  >Nueva categoria</v-btn
                >
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card>



          <v-dialog persistent v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title>
                <v-toolbar
                  color="#EF5350"
                  class="white--text"
                  flat
                  dense
                  width="100%"
                  elevation="7"
                  shaped
                >
                  <span class="white--text text-h6 mx-auto">{{
                    formTitle
                  }}</span>
                </v-toolbar>
              </v-card-title>

              <v-card-text>
                <v-form ref="cat">
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          color=" red lighten-1 white--text"
                          v-model="editedItem.nombre"
                          label="Nombre"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="2" md="12">
                        <v-textarea
                          solo
                          elevation="0"
                          color=" red lighten-1 white--text"
                          v-model="editedItem.descripcion"
                          label="Descipcion"
                        ></v-textarea>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" text @click="close">
                  Cancelar
                </v-btn>
                <v-btn color="red darken-1" text @click="save"> Guardar </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" width="550px">
            <v-card color="primary">
              <v-card-title class="white--text text-h5">{{
                dialogText
              }}</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="secondary" text @click="closeDelete"
                  >Cancelar</v-btn
                >
                <v-btn color="secondary" text @click="ActivarDesactivarConfirm"
                  >OK</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
      </template>

      <template v-slot:[`item.estado`]="{ item }">
        <span v-bind:class="[item.estado === 1 ? 'blue--text' : 'red--text']">
          {{ item.estado === 1 ? "Activo" : " Inactivo" }}</span
        >
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2 title" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small class="mr-2 title" @click="ActivarDesactivar(item)">
          {{ item.estado === 1 ? "mdi-close-outline" : "mdi-check-underline" }}
        </v-icon>
      </template>
      <!--  <template v-slot:no-data>
          <v-btn color="primary" @click="initialize"> Reset </v-btn>
        </template> -->
      <template v-slot:[`item.nombre`]="{ item }">
        <p class="subtitle-1">{{ item.nombre }}</p>
      </template>
      <template v-slot:[`item.descripcion`]="{ item }">
        <p class="subtitle-1">{{ item.descripcion }}</p>
      </template>
    </v-data-table>
  </div>
</template>
<script>
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
export default {
  data: () => ({
    search: "",
    //variable id, estado me capturan el valor para poder trabajar con ellas
    id: "",
    estado: null,
    //variable b para alternar entre guardar y editar
    b: null,
    error: "",
    dialog: false,
    encabezado: [],

    /* rules: [
      (value) => !!value || "Requerido",
      (value) => (value && value.trim().length >= 1) || "Minimo 1 caracteres",
    ], */
    dialogDelete: false,
    dialogText: "",
    headers: [
      { text: "Estado", value: "estado", class: "title font-weight-black" },
      {
        text: "Nombre",
        align: "start",
        sortable: false,
        value: "nombre",
        class: "title font-weight-black",
      },
      {
        text: "Descripcion",
        value: "descripcion",
        class: "title font-weight-black",
      },

      {
        text: "Opciones",
        value: "actions",
        sortable: false,
        class: "title font-weight-black",
      },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      nombre: "",
      descripcion: "",
      estado: "",
    },
    defaultItem: {
      nombre: "",
      descripcion: "",
      estado: "",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nueva Categoria" : "Editar Item";
    },
    buscar() {
      if (this.search === "") {
        return this.desserts;
      } else {
        return this.desserts.filter((x) => {
          return (
            x.nombre.includes(this.search) ||
            x.descripcion.includes(this.search) === true
          );
        });
      }
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.traer();
  },

  methods: {
    abrirModal() {
      this.dialog = true;
      this.b = 1;
    },
    traer() {
      let header = { headers: { "x-token": this.$store.state.token } };
      axios
        .get("categoria", header)
        .then((response) => {
          this.desserts = response.data.categoria;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    crearPDF() {
      const columns = [
        { title: "Estado", dataKey: "estado" },
        { title: "Nombre", dataKey: "nombre" },
        { title: "Descripcion", dataKey: "descripcion" },
      ];
      /* this.headers.forEach(function(y){
        columns.push({
          title:y.text, datakey:y.value
        })
      })
 */

      const filas = [];
      this.desserts.forEach(function (x) {
        filas.push({
          nombre: x.nombre,
          descripcion: x.descripcion,
          estado: x.estado == 1 ? "Activo" : "Inactivo",
        });
      });
      const doc = new jsPDF("p", "pt");
      doc.autoTable(columns, filas, {
        margin: { top: 60 },
        addPageContent: function () {
          doc.text("Lista de categorias", 40, 30);
        },
      });
      doc.save("Categorias.pdf");
    },

    editItem(item) {
      this.b = 2;
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
      this.id = item._id;
    },

    ActivarDesactivar(item) {
      this.dialogDelete = true;

      this.id = item._id;

      this.estado = item.estado;

      this.estado === 1
        ? (this.dialogText = "¿Seguro que desea desactivar esta categoria?")
        : (this.dialogText = "¿Seguro que desea activar esta categoria?");
    },

    ActivarDesactivarConfirm() {
      let header = { headers: { "x-token": this.$store.state.token } };

      if (this.estado === 1) {
        axios
          .put(
            `categoria/desactivar/${this.id}`,
            {
              estado: 0,
            },
            header
          )
          .then((response) => {
            console.log(response);

            this.traer();
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        axios
          .put(
            `categoria/activar/${this.id}`,
            {
              estado: 1,
            },
            header
          )
          .then((response) => {
            console.log(response);

            this.traer();
          })
          .catch((error) => {
            console.log(error);
          });
      }

      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$refs.cat.resetValidation();
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({});
        this.editedIndex = -1;
      });
    },

    save() {
      let header = { headers: { "x-token": this.$store.state.token } };

      if (this.b === 1) {
        axios
          .post(
            "categoria",
            {
              nombre: this.editedItem.nombre,
              descripcion: this.editedItem.descripcion,
              estado: 1,
            },
            header
          )
          .then((response) => {
            console.log(response);
            this.$fire({
              type: "success",
              text: "Categoria Agregada",
              timer: 1200,
            });
            this.traer();
            this.close();
          })
          .catch((error) => {
            console.log(error.response.data.errors[0].msg);
            this.error = error.response.data.errors[0].msg;

            //se puede agregar directamente el error o asigarnlo a una variable para mejor legibildiad
            this.$fire({
              type: "error",
              text: `${this.error}`,
            });
          });
      }
      if (this.b === 2) {
        axios
          .put(
            "categoria/" + this.id,
            {
              nombre: this.editedItem.nombre,
              descripcion: this.editedItem.descripcion,
            },
            header
          )
          .then((response) => {
            console.log(response);
            this.traer();
            this.close();

            this.$fire({
              type: "success",
              text: "Registro editado",
              timer: 1500,
            });
          })
          .catch((error) => {
            console.log(error);
            this.$fire({
              type: "error",
              text: error.response.data.errors[0].msg,
            });
          });
      }
    },
  },
};
</script>
<style scoped>
</style>