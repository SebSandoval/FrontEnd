  <template>
  <div>
    <v-data-table
      :headers="headers"
      :items="buscarIngreso"
      :items-per-page="20"
      class="elevation-1 pa-2 ma-2"
    >
      <template v-slot:top>
        <v-card flat>
          <v-form ref="form">
            <v-container class="spacing-playground pa-10">
              <v-row>
                <v-col cols="12" sm="4" class="d-flex justify-center headline">
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
                      INGRESOS

                      <!-- class="mx-auto mt-3 font-weight-medium" -->
                    </p></v-toolbar-title
                  >
                   <v-divider class="mx-4 hidden-xs-only" inset vertical></v-divider>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field
                    class="px-2"
                      v-model.trim="searchIngreso"
            append-icon="mdi-magnify"
            label="Buscar por numero de comprobante"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" class="d-flex justify-center">
                  <v-btn @click="nuevo()" dark class="primary"
                    >NUEVO INGRESO</v-btn
                  >
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card>

       
          <v-dialog
            :fullscreen="$vuetify.breakpoint.xsOnly"
            persistent
            v-model="dialog"
            max-width="75%"
          >
            <v-card>
              <v-card-title>
                <span class="headline font-weight-black red--text">{{
                  formTitle
                }}</span>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-btn v-if="btnPDF === true" @click="alerta()">
                  <v-icon color="error">mdi-printer </v-icon></v-btn
                >

                <v-spacer></v-spacer>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-form ref="form" :disabled="isDisabled">
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.usuario"
                          v-bind:label="label"
                          disabled
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="6" md="4">
                        <v-select
                          v-model="editedItem.proveedor"
                          label="Proveedor"
                          :items="proveedores"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-select
                          v-model="editedItem.tipoComprobante"
                          label="Tipo comprobante"
                          :items="tipoComprobante"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.serieComprobante"
                          label="Serie comprobante"
                          type="number"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.numeroComprobante"
                          label="Numero comprobante"
                          type="number"
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
                          v-model="editedItem.total"
                          label="Total"
                          type="number"
                          v-show="totalDisable"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4"> </v-col>
                    </v-row>
                  </v-form>

                  <v-divider class="mx-2" inset></v-divider>
                  <!-- card detalle factura -->
                  <v-card
                    v-show="cardDisable"
                    class="mx-auto"
                    color="primary"
                    dark
                    max-width="100%"
                  >
                    <v-card-title>
                      <span class="text-h6 font-weight-light">Resumen</span>
                    </v-card-title>

                    <v-card-text class="text-h5 font-weight-bold">
                      <h6>Impuesto: {{ imp }}</h6>
                      <h5>Subotal: {{ calcularSubtotal }}</h5>
                      <h4>Total: {{ sub }}</h4>
                    </v-card-text>

                    <v-card-actions> </v-card-actions>
                  </v-card>
                  <v-card-title>
                    <span class="text-h5">{{ titulo }}</span>
                    <v-spacer></v-spacer>
                  </v-card-title>

                  <!-- modal agregar productos a factura -->

                  <v-dialog
                    transition="dialog-top-transition"
                    width="70%"
                    persistent
                    :fullscreen="$vuetify.breakpoint.xsOnly"
                    v-model="btnModal"
                    style="min-height: 100vh"
                  >
                    <template v-slot:default="dialog">
                      <v-card>
                        <v-card-title>
                          <v-toolbar color="#EF5350" dark
                            >Agregar productos</v-toolbar
                          >
                        </v-card-title>

                        <v-card-subtitle>
                          <v-text-field
                            class="px-6 mx-6"
                            v-model.trim="search"
                            append-icon="mdi-magnify"
                            label="Buscar"
                            single-line
                            hide-details
                          ></v-text-field>
                        </v-card-subtitle>
                        <!-- tabla que muestra los productos que puedo agregar -->
                        <v-card-text>
                          <v-data-table
                            :headers="encabezadoArticulos"
                            :items="buscarArticulos"
                            :items-per-page="10"
                            class="elevation-0"
                            disable-sort
                          >
                            <template v-slot:[`item.acciones`]="{ item }">
                              <v-btn
                                elevation="6"
                                plain
                                rounded
                                small
                                color="primary"
                                @click="agregar_producto(item)"
                              >
                                Agregar
                                <v-icon small class="ml-2">
                                  mdi-plus-circle
                                </v-icon>
                              </v-btn>
                            </template>
                          </v-data-table>
                        </v-card-text>
                        <v-card-actions class="justify-end">
                          <v-btn
                            text
                            @click="
                              dialog.value = false;
                              search = '';
                            "
                            >Cerrar</v-btn
                          >
                        </v-card-actions>
                      </v-card>
                    </template>
                  </v-dialog>

                  <!-- tabla de detalle de nueva factura -->
                  <v-card>
                    <v-card-title>
                      <v-toolbar
                        color="#EF5350"
                        class="white--text"
                        flat
                        dense
                        width="100%"
                        elevation="10"
                        shaped
                        ><p
                          :class="{
                            'caption font-weight-black mx-auto mt-3':
                              $vuetify.breakpoint.xs,
                            'mx-auto mt-3 font-weight-medium':
                              $vuetify.breakpoint.smAndUp,
                          }"
                        >
                          Lista de Productos

                          <!-- class="mx-auto mt-3 font-weight-medium" -->
                        </p></v-toolbar
                      >
                    </v-card-title>
                    <!-- tabla de productos ya agregados previamente -->

                    <v-card-text>
                      <v-data-table
                        :headers="
                          show
                            ? encabezadoDescripcion
                            : encabezadoDescripcionSin
                        "
                        :items="productosDescripcion"
                        :items-per-page="15"
                        max-width="90%"
                        class="elevation-0 pt-0 my-2"
                        persistent
                        disable-sort
                      >
                        <template
                          v-if="textCantidad === true"
                          v-slot:[`item.cantidadProducto`]="{ item }"
                        >
                          <v-text-field
                            type="number"
                            v-model="item.cantidadProducto"
                            @keyup="onChange(item)"
                          >
                          </v-text-field>
                        </template>

                        <template v-slot:[`item.subtotal`]="{ item }">
                          <v-container>
                            {{ item.precioProducto * item.cantidadProducto }}
                          </v-container>
                        </template>

                        <template v-slot:[`item.acciones`]="{ item }"
                          ><div v-show="textAcciones">
                            <v-icon
                              v-show="textAcciones"
                              @click="mostrar(item)"
                            >
                              mdi-delete {{ item.acciones }}
                            </v-icon>
                          </div>
                        </template>
                        <!-- 
                         <template
                         
                          v-slot:[`item.index`]="{ item }"
                        >
                        <v-container>


                          
                        </v-container>
                        </template> -->
                      </v-data-table>
                    </v-card-text>
                    <v-card-actions> </v-card-actions>
                  </v-card>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-btn
                  class="hidden-sm-and-up"
                  fab
                  dark
                  color="error"
                  @click="modalAgregar()"
                  v-if="btnAgregar === true"
                >
                  <v-icon> mdi-plus </v-icon>
                </v-btn>

                <v-btn
                  color="error"
                  class="hidden-xs-only"
                  v-if="btnAgregar === true"
                  @click="modalAgregar()"
                >
                  Agregar Productoss
                </v-btn>
                <v-spacer></v-spacer>

                <v-btn
                  color="blue darken-1"
                  v-if="btnCancelar == true"
                  text
                  @click="close"
                >
                  {{ btc }}
                </v-btn>

                <v-btn
                  color="blue darken-1"
                  text
                  v-if="btnGuardar == true"
                  @click="save"
                >
                  Guardar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- dialogo delete -->

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

      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2 title" @click="infoItem(item)">
          mdi-eye
        </v-icon>
        <v-icon small class="mr-2 title" @click="ActivarDesactivar(item)">
          {{ item.estado === 1 ? "mdi-close-outline" : "mdi-check-underline" }}
        </v-icon>
      </template>

      <template v-slot:[`item.nombre`]="{ item }">
        <p class="subtitle-1">{{ item.nombre }}</p>
      </template>
      <template v-slot:[`item.descripcion`]="{ item }">
        <p class="subtitle-1">{{ item.descripcion }}</p>
      </template>

      <template v-slot:[`item.estado`]="{ item }">
        <span v-bind:class="[item.estado === 1 ? 'blue--text' : 'red--text']">
          {{ item.estado === 1 ? "Activo" : " Inactivo" }}</span
        >
      </template>
    </v-data-table>
    <!-- <v-data-table
      item-key="name"
      class="elevation-1"
      loading
      loading-text="Cargando datos... Por favor espere"
      v-else
    ></v-data-table> -->
  </div>
</template>
<script>
import axios from "axios";
export default {
  data: () => ({
    searchIngreso: "",
    search: "",
    subt: 0,
    imp: 0,
    cantidadTotal: 1,
    c: 1,
    calcular: 0,
    total: 0,
    id: "",
    estado: null,
    cardDisable: false, //  carta donde me muestra el total
    st: 0,
    index: -1,
    totalDisable: null,
    tipoComprobante: ["NOTA DÉBITO", "NOTA CRÉDITO", "FACTURA"],
    label: "",
    dialog: false,
    btnModal: false,
    show: false,
    cantidad: 0,
    textCantidad: true,
    textAcciones: true,
    btnPDF: true,
    titulo: "",
    btnAgregar: true, //condicion mostrar o ocultar boton Agregar Producto en el modal principal
    btnCancelar: true, //Mostrar o ocultar el boton cancelar al momento de mirar un registro
    btnGuardar: true, //Mostrar o ocultar el boton guardar al momento de mirar un registro
    btc: "CANCELAR", //texto del boton cancelar, para que al momento de ver un registro cambie el texto del boton
    isDisabled: false,

    dialogDelete: false,
    dialogText: "",

    proveedores: [],
    /*  rules: {
      usuario: [
        (value) => !!value || "Requerido",
        (value) => (value && value.trim().length >= 6) || "Minimo 6 caracteres",
      ],
    }, */
    articulos: [],
    encabezadoDescripcion: [
      { text: "Nombre", value: "nombreProducto" },
      { text: "Precio", value: "precioProducto" },

      { text: "Cantidad", value: "cantidadProducto", align: "center" },
      { text: "Subtotal", value: "subtotal" },
      { text: "Acciones", value: "acciones" },
    ],
    encabezadoDescripcionSin: [
      { text: "Nombre", value: "nombreProducto" },

      { text: "Precio", value: "precioProducto" },
      { text: "Cantidad", value: "cantidadProducto", align: "center" },

      { text: "Subtotal", value: "subtotal" },
    ],
    productosDescripcion: [],
    productosAgregar: [],
    encabezadoAgregar: [
      { text: "Nombre", value: "nombre", class: "subtitle font-weight-black" },
      { text: "Precio", value: "precio", class: "subtitle font-weight-black" },
      {
        text: "Acciones",
        value: "acciones",
      },
    ],

    encabezadoArticulos: [
      { text: "Nombre", value: "nombre", class: "subtitle font-weight-black" },

      {
        text: "Precio",
        value: "precioVenta",
        class: "subtitle font-weight-black",
      },
      { text: "Stock", value: "stock" },
      {
        text: "Acciones",
        value: "acciones",
      },
    ],

    headers: [
      { text: "Estado", value: "estado", class: "sutitle font-weight-black" },
      {
        text: "Usuario",

        value: "usuario.nombre",
        class: "subtitle font-weight-black",
      },
      {
        text: "Proveedor",
        value: "proveedor.nombre",
        class: "subtitle font-weight-black",
      },
      {
        text: "Tipo Comprobante",
        value: "tipoComprobante",
        class: "subtitle font-weight-black",
        align: "start",
      },
      {
        text: "Serie comprobante",
        value: "serieComprobante",
        class: "subtitle font-weight-black",
      },
      {
        text: "Numero comprobante",
        value: "numeroComprobante",
        class: "subtitle font-weight-black",
      },

      {
        text: "Fecha",
        value: "fecha",
        class: "subtitle font-weight-black",
      },
      {
        text: "Impuesto",
        value: "impuesto",
        class: "subtitle font-weight-black",
      },

      {
        text: "Total",
        value: "total",
        class: "subtitle font-weight-black",
      },
      {
        text: "Opciones",
        value: "actions",
        sortable: false,
        class: "subtitle font-weight-black",
      },
    ],
    desserts: [],
    detallesFactura: [],

    editedIndex: -1,
    editedItem: {
      usuario: "",
      proveedor: "",
      tipoComprobante: "",
      serieComprobante: "",
      numeroComprobante: "",
      impuesto: 0.19,
      total: "",
      estado: "",
    },
    defaultItem: {
      usuario: "",
      proveedor: "",
      tipoComprobante: "",
      serieComprobante: "",
      numeroComprobante: "",
      impuesto: 0.19,
      total: "",
      estado: "",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Ingreso" : "Visualización";
    },

    sub() {
      // return this.productosDescripcion ? this.productosDescripcion.forEach((x, y) => (x += y.subtotal)):0
      //return  this.productosDescripcion.forEach((x, y) => (x += y.subtotal))

      //return this.productosDescripcion.reduce((x, y) => x += y.subtotal);
      this.productosDescripcion.map((x) => (this.st += x.subtotal));
      return this.st;
    },

    calcularSubtotal() {
      return this.st - this.imp;
    },

    buscar() {
      if (this.searchIngreso === 0) {
        return this.desserts;
      } else {
        return this.desserts.filter((x) => {
          return x.numeroComprobante.includes(this.searchIngreso) === true;
        });
      }
    },

    buscarArticulos() {
      if (this.search === "") {
        return this.articulos;
      } else {
        return this.articulos.filter((x) => {
          return x.nombre.includes(this.search) === true;
        });
      }
    },
    buscarIngreso() {
      if (this.searchIngreso === "") {
        return this.desserts;
      } else {
        return this.desserts.filter((x) => {
          return (
            x.numeroComprobante.toString().indexOf(this.searchIngreso) != -1
          );
        });
      }
    },
  },

  watch: {
    /* dialog(val) {
      val || this.close();
    }, */
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.traer();
    this.traerProveedor();
  },

  //metodos

  methods: {
    traerProveedor() {
      let header = { headers: { "x-token": this.$store.state.token } };
      axios
        .get("proveedor/act", header)
        .then((response) => {
          //this.nombreCategorias = response.data.categoria;

          response.data.proveedor.map((x) => {
            this.proveedores.push({
              text: x.nombre,
              value: x._id,
            });
          });
        })

        .catch((error) => {
          console.log(error);
        });
    },
    traerArticulos() {
      let header = { headers: { "x-token": this.$store.state.token } };
      axios
        .get("articulo/actIngreso", header)
        .then((response) => {
          this.articulos = response.data.articulo;
        })

        .catch((error) => {
          console.log(error);
        });
    },
    traer() {
      let header = { headers: { "x-token": this.$store.state.token } };

      axios
        .get("ingreso", header)
        .then((response) => {
          console.log(response.data);
          this.desserts = response.data.ingreso;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    mostrar(item) {
      //buscar id para comparar y reemplazar
      let index = this.productosDescripcion.findIndex((x) => x._id == item._id);

      this.productosDescripcion.splice(index, 1);
      //let conteo = this.productosDescripcion.reduce((x, y) => x += y.subtotal, 0)
      this.st = 0;
      this.imp = this.productosDescripcion.reduce(
        (x, y) => (x += y.subtotal * this.editedItem.impuesto),
        0
      );

      // console.log(conteo);
      // console.log(index);
    },
    alerta() {
      this.$prompt("Input your name").then((text) => {
        text;
      });
    },
    modalAgregar() {
      this.btnModal = true;
    },
    onChange(item) {
      item.subtotal = item.cantidadProducto * item.precioProducto;
      this.imp = this.productosDescripcion.reduce(
        (x, y) => (x += y.subtotal * this.editedItem.impuesto),
        0
      );

      this.st = 0;
    },
    nuevo() {
      this.cardDisable = true;
      this.label = this.$store.state.nombre + " - " + this.$store.state.rol;
      this.traerProveedor(), this.traerArticulos(), (this.show = true);
      this.totalDisable = false;
      this.textCantidad = true;
      this.textAcciones = true;
      this.dialog = true;
      this.btnPDF = false;
      this.isDisabled = false;
      this.btc = "CANCELAR";
      this.btnGuardar = true;
      this.btnCancelar = true;
      this.btnAgregar = true;
    },
    // agregar un solo producto y que no se puede repetir
    agregar_producto(item) {
      item.subtotal = item.cantidadProducto * item.precioProducto;

      this.imp = this.productosDescripcion.reduce(
        (x, y) => (x += y.subtotal * this.editedItem.impuesto),
        0
      );
      this.st = 0;

      let indice = this.productosDescripcion.findIndex(
        (x) => x.nombreProducto === item.nombre
      );

      if (this.productosDescripcion.length === 0) {
        this.productosDescripcion.push({
          _id: item._id,
          nombreProducto: item.nombre,
          precioProducto: item.precioVenta,
          cantidadProducto: 1,
          subtotal: item.precioVenta * this.c,
        });
      } else if (indice === -1) {
        this.productosDescripcion.push({
          _id: item._id,
          nombreProducto: item.nombre,
          precioProducto: item.precioVenta,
          cantidadProducto: 1,

          subtotal: item.precioVenta * this.c,
        });
      } else {
        this.$fire({
          title: "Producto ya agregado",

          type: "info",
          timer: 1500,
        });
      }
      this.imp = this.productosDescripcion.reduce(
        (x, y) => (x += y.subtotal * this.editedItem.impuesto),
        0
      );
    },

    infoItem(item) {
      item.detalles.map((x) => {
        this.productosDescripcion.push({
          _id: x._id,
          nombreProducto: x.nombreProducto,
          cantidadProducto: x.cantidadProducto,
          precioProducto: x.precioProducto,

          subtotal: x.cantidadProducto * x.precioProducto,
        });
      });
      this.cardDisable = false;
      this.totalDisable = true;
      this.show = false;
      this.btc = "SALIR";
      this.btnPDF = true;
      this.btnAgregar = false;
      this.btnCancelar = true;
      this.btnGuardar = false;
      this.textCantidad = false;
      this.textAcciones = false;
      this.isDisabled = true;
      this.editedIndex = 0;
      this.editedItem.tipoComprobante = item.tipoComprobante;
      this.editedItem.serieComprobante = item.serieComprobante;
      this.editedItem.numeroComprobante = item.numeroComprobante;
      this.editedItem.impuesto = item.impuesto;
      this.editedItem.total = item.total;
      this.editedItem.proveedor = item.proveedor._id;
      this.id = item._id;
      this.dialog = true;
    },

    ActivarDesactivar(item) {
      this.dialogDelete = true;
      this.id = item._id;
      this.estado = item.estado;

      this.estado === 1
        ? (this.dialogText = "¿Seguro que desea desactivar este ingreso?")
        : (this.dialogText = "¿Seguro que desea activar este ingreso?");
    },

    ActivarDesactivarConfirm() {
      let header = { headers: { "x-token": this.$store.state.token } };
      if (this.estado === 1) {
        axios
          .put(
            `ingreso/desactivar/${this.id}`,
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
            `ingreso/activar/${this.id}`,
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
      this.st = 0;
      this.imp = 0;
      this.$refs.form.resetValidation();
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
      this.isDisabled = false;

      this.productosDescripcion = [];
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

      axios
        .post(
          "ingreso",
          {
            usuario: this.$store.state.id,
            proveedor: this.editedItem.proveedor,
            tipoComprobante: this.editedItem.tipoComprobante,
            serieComprobante: this.editedItem.serieComprobante,
            numeroComprobante: this.editedItem.numeroComprobante,
            impuesto: this.editedItem.impuesto,
            total: this.editedItem.total,
            detalles: this.productosDescripcion,

            estado: 1,
          },
          header
        )
        .then((response) => {
          console.log(response);

          this.$fire({
            type: "success",
            text: "Ingreso realizado",
            timer: 1200,
          });
          this.traer();
          this.close();
        })
        .catch((error) => {
          console.log(error.response.data);
          this.error = error.response.data.errors[0].msg;

          //se puede agregar directamente el error o asigarnlo a una variable para mejor legibildiad
          this.$fire({
            type: "error",
            text: `${this.error}`,
          });
        });
    },
  },
};
</script>
<style scoped>
</style>