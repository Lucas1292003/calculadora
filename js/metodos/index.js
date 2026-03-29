import { biseccion }   from './biseccion.js';
import { regulaFalsi } from './regulaFalsi.js';
import { puntoFijo }   from './puntoFijo.js';
import { newton }      from './newton.js';
import { secante }     from './secante.js';

export const LISTA_METODOS = [
    biseccion,
    regulaFalsi,
    puntoFijo,
    newton,
    secante,
];