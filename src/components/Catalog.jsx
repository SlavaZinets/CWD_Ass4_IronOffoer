import { filteredCars } from "../stores/mainStore.js";
import ProductCard from "./ProductCard.jsx";
import '../styles/catalog.css';
import { useStore } from "@nanostores/react";

export default function Catalog() {
    const filteredCarsData = useStore(filteredCars);
    
    return (
        <div className="catalog">
            {filteredCarsData.length === 0 ? (
                <p>No cars found</p>
            ) : (
                filteredCarsData.map((car) => (
                    <ProductCard key={car.id} car={car} />
                ))
            )}
        </div>
    );
}