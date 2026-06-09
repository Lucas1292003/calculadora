import { biseccion }   from './biseccion.js';
import { regulaFalsi } from './regulaFalsi.js';
import { puntoFijo }   from './puntoFijo.js';
import { newton }      from './newton.js';
import { secante }     from './secante.js';
 
// ── Métodos de integración ────────────────────
import { trapecio }  from './trapecio.js';
import { simpson13 } from './simpson13.js';
import { simpson38 } from './simpson38.js';
 
// ── Ecuaciones diferenciales ──────────────────
import { metodoEDO } from './edo.js';
 
export const LISTA_METODOS = [
    // Búsqueda de raíces
    biseccion,
    regulaFalsi,
    puntoFijo,
    newton,
    secante,
 
    // Integración numérica
    trapecio,
    simpson13,
    simpson38,
 
    // Ecuaciones diferenciales
    metodoEDO,
];