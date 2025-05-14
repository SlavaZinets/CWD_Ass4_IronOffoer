import "../styles/filterBar.css";
import { useState } from "react";
import { cars } from "../data/cars.js";

import { filteredCars } from "../stores/mainStore.js";

export default function FilterBar() {
    // State for all filter inputs
    const [priceFrom, setPriceFrom] = useState("");
    const [priceTo, setPriceTo] = useState("");
    const [runFrom, setRunFrom] = useState("");
    const [runTo, setRunTo] = useState("");
    const [wheelLeft, setWheelLeft] = useState(false);
    const [wheelRight, setWheelRight] = useState(false);
    const [originGermany, setOriginGermany] = useState(false);
    const [originUSA, setOriginUSA] = useState(false);
    const [originJapan, setOriginJapan] = useState(false);
    const [originItaly, setOriginItaly] = useState(false);


    // Handle filter application
    const handleApplyFilters = () => {
        // Convert inputs to appropriate types
        const priceFromValue = priceFrom ? parseInt(priceFrom) : 0;
        const priceToValue = priceTo ? parseInt(priceTo) : Number.MAX_SAFE_INTEGER;
        const runFromValue = runFrom ? parseInt(runFrom) : 0;
        const runToValue = runTo ? parseInt(runTo) : Number.MAX_SAFE_INTEGER;
        
        // Get selected origins
        const selectedOrigins = [];
        if (originGermany) selectedOrigins.push("Germany");
        if (originUSA) selectedOrigins.push("USA");
        if (originJapan) selectedOrigins.push("Japan");
        if (originItaly) selectedOrigins.push("Italy");

        // Filter the cars data
        const filteredCarsData = cars.filter(car => {
            // Filter by price
            if (car.price < priceFromValue || car.price > priceToValue) {
                return false;
            }

            // Filter by run (need to convert from string like "50,000 km" to number)
            const runValue = parseInt(car.run.replace(/,/g, ''));
            if (runValue < runFromValue || runValue > runToValue) {
                return false;
            }

            // Filter by wheel placement
            if ((wheelLeft || wheelRight) &&
                (!wheelLeft || car.wheel !== 'Left Hand Drive') &&
                (!wheelRight || car.wheel !== 'Right Hand Drive')) {
                return false;
            }

            // Filter by origin - if any origins are selected, check if car's origin is in the array
            if (selectedOrigins.length > 0 && !selectedOrigins.includes(car.origin)) {
                return false;
            }

            return true;
        });

        filteredCars.set(filteredCarsData);
    };

    return (
        <div className="filter-bar">
            <form className="filter_form">
                <fieldset className="filter_range">
                    <legend className="filter_subtitle">Price</legend>
                    <label>
                        <input 
                            className="filter_input" 
                            type="number" 
                            placeholder="from"
                            value={priceFrom}
                            onChange={(e) => setPriceFrom(e.target.value)}
                        />
                    </label>

                    <span>-</span>

                    <label>
                        <input 
                            className="filter_input" 
                            type="number" 
                            placeholder="to"
                            value={priceTo}
                            onChange={(e) => setPriceTo(e.target.value)}
                        />
                    </label>
                </fieldset>

                <fieldset className="filter_range">
                    <legend className="filter_subtitle">Run</legend>
                    <label>
                        <input 
                            className="filter_input" 
                            type="number" 
                            placeholder="from"
                            value={runFrom}
                            onChange={(e) => setRunFrom(e.target.value)}
                        />
                    </label>

                    <span>-</span>

                    <label>
                        <input 
                            className="filter_input" 
                            type="number" 
                            placeholder="to"
                            value={runTo}
                            onChange={(e) => setRunTo(e.target.value)}
                        />
                    </label>
                </fieldset>

                <fieldset className="filter_choice">
                    <legend className="filter_subtitle">Wheel placement</legend>
                    <label className="filter_label">
                        <input 
                            className="filter_input" 
                            type="checkbox" 
                            value="Left Hand Drive"
                            checked={wheelLeft}
                            onChange={(e) => setWheelLeft(e.target.checked)}
                        />
                        <span>Left hand</span>
                    </label>

                    <label className="filter_label">
                        <input 
                            className="filter_input" 
                            type="checkbox" 
                            value="Right Hand Drive"
                            checked={wheelRight}
                            onChange={(e) => setWheelRight(e.target.checked)}
                        />
                        <span>Right hand</span>
                    </label>
                </fieldset>

                <fieldset className="filter_choice">
                    <legend className="filter_subtitle">Origin</legend>
                    <label className="filter_label">
                        <input 
                            className="filter_input" 
                            type="checkbox" 
                            value="Germany"
                            checked={originGermany}
                            onChange={(e) => setOriginGermany(e.target.checked)}
                        />
                        <span>Germany</span>
                    </label>


                    <label className="filter_label">
                        <input
                            className="filter_input"
                            type="checkbox"
                            value="USA"
                            checked={originUSA}
                            onChange={(e) => setOriginUSA(e.target.checked)}
                        />
                        <span>USA</span>
                    </label>

                    <label className="filter_label">
                        <input
                            className="filter_input"
                            type="checkbox"
                            value="Japan"
                            checked={originJapan}
                            onChange={(e) => setOriginJapan(e.target.checked)}
                        />
                        <span>Japan</span>
                    </label>

                    <label className="filter_label">
                        <input
                            className="filter_input"
                            type="checkbox"
                            value="Italy"
                            checked={originItaly}
                            onChange={(e) => setOriginItaly(e.target.checked)}
                        />
                        <span>Italy</span>
                    </label>
                </fieldset>

                <button 
                    className="filter_button red_button"
                    type="button"
                    onClick={handleApplyFilters}
                >
                    Apply filters
                </button>
            </form>
        </div>
    );
}
