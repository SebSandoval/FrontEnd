
import ventas from '../pages/Ventas.vue'
import login from '../pages/Login.vue'
import home from '../pages/Home.vue'
import ingresos from '../pages/Ingresos.vue'
import proveedores from '../pages/Proveedores.vue'
import articulos  from '../pages/Articulos.vue'
import categorias from '../pages/Categorias.vue'
import clientes from '../pages/Clientes.vue'
import consultac from '../pages/ConsultaC.vue'
import consultav from '../pages/ConsultaV.vue'
import usuarios from '../pages/Usuarios.vue'


export const routes=[
    {path:'/', component:login},
    {path:'/ventas', component:ventas},
    {path:'/home', component:home},
    {path:'/ingresos', component:ingresos},
    {path:'/proveedores', component:proveedores},
    {path:'/articulos', component:articulos},
    {path:'/categorias', component:categorias},
    {path:'/clientes', component:clientes},
    {path:'/consultac', component:consultac},
    {path:'/consultav', component:consultav},
    {path:'/usuarios', component:usuarios},
]



