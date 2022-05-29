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
                          CLIENTES

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
                  >Nuevo CLIENTE</v-btn
                >
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card>

          <v-dialog v-model="dialog" max-width="900px" persistent>
            <v-card>
              <v-card-title>
                <span class="primary--text text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-form ref="cat">
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          color="primary white--text"
                          v-model="editedItem.nombre"
                          label="Nombre"
                        ></v-text-field>
                      </v-col>
                     
                      <v-col cols="12" sm="6" md="4">
                        <v-select
                          color="primary white--text"
                          v-model="editedItem.tipoDocumento"
                          label="Tipo Documento"
                          :items="tiposDeDocumentos"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          color="primary white--text"
                          v-model="editedItem.numeroDocumento"
                          label="Numero de Documento"
                           type="number"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          color="primary white--text"
                          v-model="editedItem.direccion"
                          label="Direccion"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          color="primary white--text"
                          v-model="editedItem.telefono"
                          label="Telefono"
                           type="number"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          color="primary white--text"
                          v-model="editedItem.email"
                          label="Email"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="close"> Cancelar </v-btn>
                <v-btn color="primary" text @click="save"> Guardar </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="520px">
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

                <v-spacer></v-spacer>
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
    tiposDeDocumentos: [
      "Cédula de Ciudadanía",
      "Cédula extranjera",
      "Pasaporte",
    ],
    rules: [
      (value) => !!value || "Requerido",
      (value) => (value && value.trim().length >= 1) || "Minimo 1 caracteres",
    ],
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
        text: "Tipo Documento",
        value: "tipoDocumento",
        class: "title font-weight-black",
      },
      {
        text: "Número de Documento",
        value: "numeroDocumento",
        class: "title font-weight-black",
      },
      {
        text: "Direccion",
        value: "direccion",
        class: "title font-weight-black",
      },
      {
        text: "Telefono",
        value: "telefono",
        class: "title font-weight-black",
      },
      {
        text: "Email",
        value: "email",
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
      tipoDocumento: "",
      numeroDocumento: "",
      email: "",
      direccion: "",
      telefono: "",

      estado: "",
    },
    defaultItem: {
      nombre: "",
      tipoDocumento: "",
      numeroDocumento: "",
      email: "",
      direccion: "",
      telefono: "",

      estado: "",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Cliente" : "Editar Cliente";
    },

     buscar() {
      if (this.search===""){
        return this.desserts
      }else{
         return this.desserts.filter(x=>{
           return x.nombre.includes(this.search)===true
         })
         
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
      console.log(this.b);
    },
    traer() {
      let header = { headers: { "x-token": this.$store.state.token } };

      axios
        .get("cliente", header)
        .then((response) => {
          this.desserts = response.data.cliente;
          console.log(response.data.cliente);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    crearPDF() {
      const columns = [
        { title: "Estado", dataKey: "estado" },
        { title: "Nombre", dataKey: "nombre" },
        { title: "Tipo de Documento", dataKey: "tipoDocumento" },
        { title: "Número de Documento", dataKey: "numeroDocumento" },
        { title: "Direccion", dataKey: "direccion" },
        { title: "Telefono", dataKey: "telefono" },
        { title: "Email", dataKey: "email" },
      ];
      

      const filas = [];
      this.desserts.forEach(function (x) {
        filas.push({
          nombre: x.nombre,
          estado: x.estado==1 ? "Activo" : "Inactivo",
          tipoDocumento: x.tipoDocumento,
          numeroDocumento: x.numeroDocumento,
          direccion: x.direccion,
          telefono: x.telefono,
          email: x.email,
        });
      });
      const doc = new jsPDF("p", "pt");
      doc.autoTable(columns, filas, {
        margin: { top: 60 },
        addPageContent: function () {
          doc.text("Lista de Clientes", 40, 30);
        },
      });
      doc.save("Clientes.pdf");
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
        ? (this.dialogText = "¿Seguro que desea desactivar este cliente?")
        : (this.dialogText = "¿Seguro que desea activar este cliente?");
    },

    ActivarDesactivarConfirm() {
      let header = { headers: { "x-token": this.$store.state.token } };

      if (this.estado === 1) {
        axios
          .put(
            `cliente/desactivar/${this.id}`,
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
            `cliente/activar/${this.id}`,
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
            "cliente",
            {
              nombre: this.editedItem.nombre,
              tipoDocumento: this.editedItem.tipoDocumento,
              numeroDocumento: this.editedItem.numeroDocumento,
              telefono: this.editedItem.telefono,
              email: this.editedItem.email,
              direccion: this.editedItem.direccion,
              estado: 1,
            },
            header
          )
          .then((response) => {
            console.log(response);
            this.$fire({
              type: "success",
              text: "Cliente Agregado",
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
            "cliente/" + this.id,
            {
              nombre: this.editedItem.nombre,
              tipoDocumento: this.editedItem.tipoDocumento,
              numeroDocumento: this.editedItem.numeroDocumento,
              telefono: this.editedItem.telefono,
              email: this.editedItem.email,
              direccion: this.editedItem.direccion,
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
            this.error = error.response.data.errors[0].msg;

            //se puede agregar directamente el error o asigarnlo a una variable para mejor legibildiad
            this.$fire({
              type: "error",
              text: `${this.error}`,
            });
          });
      }
    },
  },
};
</script>
<style scoped>
</style>