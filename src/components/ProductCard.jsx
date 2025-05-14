import React, {useEffect, useState} from 'react';
import '../styles/productCard.css';
import LikeButton from "./LikeButton.jsx";



const ProductCard = ({ car }) => {

    const [imageToUse, setImageToUse] = useState();

    useEffect(() => {
        async function getImage() {
            try {
                // Use import.meta.glob for proper path resolution in both dev and build
                const images = import.meta.glob('/src/images/*.{png,jpg,jpeg,gif,webp}', { eager: true });
                const imagePath = `/src/images/${car.imageUrl}`;
                
                if (images[imagePath]) {
                    setImageToUse(images[imagePath].default.src);
                } else {
                    console.error(`Image not found: ${imagePath}`);
                }
            } catch (error) {
                console.error("Error loading image:", error);
            }
        }

        getImage();
    }, [car.imageUrl]);


    return (
        <a href={`cars/${car.id}`} className="product_card">
            <div className="product_card_image_container">
                <LikeButton id={car.id} />
                <img
                    className="product_card_image"
                    src={imageToUse}
                    alt={car.title}
                />
            </div>

            <h4 className="product_card_title">{car.title}</h4>
            <div className="product_card_info">
                <p>
                    {car.origin || "Unknown origin"},
                    {car.run || "Unknown run"},
                    {car.wheel || "Unknown wheel"},
                    {car.transmission || "Unknown transmission"},
                    {car.color || "Unknown color"}
                </p>
                <p className="product_card_price">
                    Price:
                    <span>€ {car.price}</span>
                </p>
            </div>
        </a>
    );
};

export default ProductCard;