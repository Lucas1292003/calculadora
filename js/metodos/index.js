import { biseccion }   from './biseccion.js';
import { regulaFalsi } from './regulaFalsi.js';
import { puntoFijo }   from './puntoFijo.js';
import { newton }      from './newton.js';
import { secante }     from './secante.js';

import { trapecio }  from './trapecio.js';
import { simpson13 } from './simpson13.js';
import { simpson38 } from './simpson38.js';

import { metodoEDO } from './edo.js';

// Lista plana — usada por el router para buscar métodos por id
export const LISTA_METODOS = [
    biseccion, regulaFalsi, puntoFijo, newton, secante,
    trapecio, simpson13, simpson38,
    metodoEDO,
];

// Grupos — usados por ui.js para el sidebar y el dashboard
export const GRUPOS_METODOS = [
    {
        titulo:  'Búsqueda de Raíces',
        icon:    '🔍',
        metodos: [biseccion, regulaFalsi, puntoFijo, newton, secante],
    },
    {
        titulo:  'Integración Numérica',
        icon:    '∫',
        metodos: [trapecio, simpson13, simpson38],
    },
    {
        titulo:  'Ecuaciones Diferenciales',
        icon:    '📉',
        metodos: [metodoEDO],
    },
];