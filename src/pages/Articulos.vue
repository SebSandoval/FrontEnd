<template>
  <div>

  

      
    <v-data-table
      :headers="headers"
      :items="buscar"
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
                          ARTICULOS

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
                  >Nuevo Articulo</v-btn
                >
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card>


       

          
         
        



          
          <v-dialog v-model="dialog" persistent max-width="800px">
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
                <v-container>
                  <v-form ref="cat">
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.codigo"
                          label="Codigo"
                          :disabled="codigoDisable"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.nombre"
                          label="Nombre"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-select
                          v-model="editedItem.categoria"
                          label="Categoria"
                          :items="categorias"
                        ></v-select>
                      </v-col>

                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.stock"
                          label="Stock"
                          type="number"
                          :disabled="stockDisable"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.impuesto"
                          label="Impuesto"
                          type="number"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.precioVenta"
                          label="Precio Venta"
                          type="number"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.descripcion"
                          label="Descipcion"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="close"> Cancelar </v-btn>
                <v-btn color="primary" text @click="save"> Guardar </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="550px">
            <v-card color="primary">
              <v-card-title class="white--text text-h5">{{
                dialogText
              }}</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="secondary" text @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn color="secondary" text @click="ActivarDesactivarConfirm"
                  >OK</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
       
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2 title" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small class="mr-2 title" @click="ActivarDesactivar(item)">
          {{ item.estado === 1 ? "mdi-close-outline" : "mdi-check-underline" }}
        </v-icon>
      </template>

      <template v-slot:[`item.estado`]="{ item }">
        <span v-bind:class="[item.estado === 1 ? 'blue--text' : 'red--text']">
          {{ item.estado === 1 ? "Activo" : " Inactivo" }}</span
        >
      </template>
      <template v-slot:[`item.categoria`]="{ item }">
        {{ item.categoria }}
      </template>
    </v-data-table>
  </div>
</template>
<script>
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
export default {
  data: () => ({
    search: "",
    codigoDisable: false,
    stockDisable: false,
    precioDisable: false,
    error: "",
    id: "",
    estado: null,
    b: null,
    dialog: false,
    dialogDelete: false,
    //rules: [(value) => !!value || "Requerido"],
    nombreCategorias: [],
    categorias: [],
    headers: [
      { text: "Estado", value: "estado", sortable: false },
      { text: "Codigo", value: "codigo" },
      {
        text: "Nombre",
        align: "start",
        sortable: false,
        value: "nombre",
      },
      { text: "Categoria", value: "categoria.nombre", sortable: false },
      { text: "Stock", value: "stock", sortable: false },
      { text: "Impuesto", value: "impuesto", sortable: false },
      { text: "Precio Venta", value: "precioVenta", sortable: false },
      { text: "Descripcion", value: "descripcion", sortable: false },

      { text: "Opciones", value: "actions", sortable: false },
    ],
    desserts: [],
    dialogText: "",
    editedIndex: -1,
    editedItem: {
      codigo: "",
      nombre: "",
      stock: "",
      precioVenta: "",
      impuesto: "",
      categoria: "",
      descripcion: "",
    },
    defaultItem: {
      codigo: "",
      nombre: "",
      stock: "",
      categoria: "",
      precioVenta: "",
      impuesto: "",

      descripcion: "",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Articulo" : "Editar Articulo";
    },

    buscar() {
      if (this.search === "") {
        return this.desserts;
      } else {
        return this.desserts.filter((x) => {
          return x.nombre.includes(this.search) === true;
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
    this.listarArticulos();
    this.traerCategoriasNombre();
  },

  methods: {
    crearPDF() {
      const columns = [
        { title: "Estado", dataKey: "estado" },
        { title: "Nombre", dataKey: "nombre" },
        { title: "Codigo", dataKey: "codigo" },
        { title: "Categoria", dataKey: "categoria" },
        { title: "Stock", dataKey: "stock" },
        { title: "Impuesto", dataKey: "impuesto" },
        { title: "Precio Venta", dataKey: "precioVenta" },
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
          stock: x.stock,
          codigo: x.codigo,
          categoria: x.categoria.nombre,
          impuesto: x.impuesto,
          precioVenta: x.precioVenta,
        });
      });
      const doc = new jsPDF("p", "pt");
      doc.autoTable(columns, filas, {
        margin: { top: 60 },
        addPageContent: function () {
          doc.text("Lista de Articulos", 40, 30);
        },
      });
      doc.save("Articulos.pdf");
    },

    abrirModal() {
      this.codigoDisable = false;
      this.stockDisable = false;
      this.precioDisable = false;
      this.dialog = true;
      this.traerCategoriasNombre();
      this.b = 1;
    },

    listarArticulos() {
      let header = { headers: { "x-token": this.$store.state.token } };
      axios
        .get("articulo", header)
        .then((response) => {
          this.desserts = response.data.articulo;
        })
        .catch((error) => {
          console.log(error.response);
        });
    },

    traerCategoriasNombre() {
      let header = { headers: { "x-token": this.$store.state.token } };
      axios
        .get("categoria/act", header)
        .then((response) => {
          //this.nombreCategorias = response.data.categoria;

          response.data.categoria.map((x) => {
            this.categorias.push({
              text: x.nombre,
              value: x._id,
            });
          });
        })

        .catch((error) => {
          console.log(error);
        });
    },

    editItem(item) {
      this.codigoDisable = true;
      this.stockDisable = true;
      this.precioDisable = true;
      this.dialog = true;
      this.b = 2;
      this.id = item._id;
      this.editedItem.nombre = item.nombre;
      this.editedItem.codigo = item.codigo;
      this.editedItem.stock = item.stock;
      this.editedItem.impuesto = item.impuesto;
      this.editedItem.precioVenta = item.precioVenta;
      this.editedItem.descripcion = item.descripcion;
      this.editedItem.categoria = item.categoria._id;
    },

    ActivarDesactivar(item) {
      this.dialogDelete = true;

      this.id = item._id;

      this.estado = item.estado;

      this.estado === 1
        ? (this.dialogText = "¿Seguro que desea desactivar este articulo?")
        : (this.dialogText = "¿Seguro que desea activar este articulo?");
    },

    ActivarDesactivarConfirm() {
      let header = { headers: { "x-token": this.$store.state.token } };
      if (this.estado === 1) {
        axios
          .put(
            `articulo/desactivar/${this.id}`,
            {
              estado: 0,
            },
            header
          )
          .then((response) => {
            console.log(response);

            this.listarArticulos();
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        axios
          .put(
            `articulo/activar/${this.id}`,
            {
              estado: 1,
            },
            header
          )
          .then((response) => {
            console.log(response);
            this.listarArticulos();
          })
          .catch((error) => {
            console.log(error);
          });
      }

      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$refs.cat.reset();
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      this.codigoDisable = false;
      /* if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
      } else {
        this.desserts.push(this.editedItem);
      }
      this.close(); */
      let header = { headers: { "x-token": this.$store.state.token } };
      if (this.b === 1) {
        axios
          .post(
            "articulo",
            {
              codigo: this.editedItem.codigo,
              nombre: this.editedItem.nombre,
              categoria: this.editedItem.categoria,
              descripcion: this.editedItem.descripcion,
              impuesto: this.editedItem.impuesto,
              stock: this.editedItem.stock,
              precioVenta: this.editedItem.precioVenta,
              estado: 1,
            },
            header
          )
          .then((response) => {
            console.log(response);
            this.$fire({
              type: "success",
              text: "Articulo Agregado",
              timer: 1200,
            });
            this.listarArticulos();
            this.close();
          })
          .catch((error) => {
            console.log(error);
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
            "articulo/" + this.id,
            {
              nombre: this.editedItem.nombre,
              categoria: this.editedItem.categoria,
              impuesto: this.editedItem.impuesto,
              descripcion: this.editedItem.descripcion,
              stock: this.editedItem.stock,
              precioVenta: this.editedItem.precioVenta,
            },
            header
          )
          .then((response) => {
            console.log(response);
            this.$fire({
              type: "success",
              text: "Registro editado",
              timer: 1500,
            });
            this.listarArticulos();
            this.close();
          })
          .catch((error) => {
            console.log(error.response.data);
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
.v-data-table {
  font-size: 274px !important;
}
</style>