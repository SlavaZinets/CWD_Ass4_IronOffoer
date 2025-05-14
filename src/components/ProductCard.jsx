import React, {useEffect, useState} from 'react';
import '../styles/productCard.css';
import LikeButton from "./LikeButton.jsx";



const ProductCard = ({ car }) => {

    const [imageToUse, setImageToUse] = useState()

    useEffect(() => {
       async function getImage() {
            const image = await import(`${car.imageUrl}`);
            setImageToUse(image.default.src);
        }

        getImage();
    }, []);


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