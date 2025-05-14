import { atom } from 'nanostores';
import { cars } from '../data/cars.js';

export const filteredCars = atom(cars);
export const isLogged = atom(false);


export const account = atom(null)
