import { filteredCars } from "../stores/filterStore.js";
import ProductCard from "./ProductCard.jsx";
import '../styles/catalog.css';
import { useStore } from "@nanostores/react";

export default function Catalog() {
    const $filteredCars = useStore(filteredCars);
    
    return (
        <div className="catalog">
            {$filteredCars.length === 0 ? (
                <p>No cars found</p>
            ) : (
                $filteredCars.map((car) => (
                    <ProductCard key={car.id} car={car} />
                ))
            )}
        </div>
    );
}