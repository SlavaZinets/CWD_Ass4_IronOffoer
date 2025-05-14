import closeIcon from "../images/icons/close-icon.svg";
import {useState} from "react";
import '../styles/global.css';
import '../styles/popUpContainer.css';


export default function PopUpContainer({buttonText, buttonStyle, children }) {

    const [isOpen, setIsOpen] = useState(false)

    return (
        isOpen ? (
           <>
               <button className={buttonStyle} onClick={() => setIsOpen(true)} >{buttonText}</button>
               <div className="pop-up-container active">
                   <div className="pop-up">
                       <div className="close-button-container">
                           <button className="close-button" onClick={() => setIsOpen(false)}>
                               <img src={closeIcon.src} alt="close-button" />
                           </button>
                       </div>
                       {children}
                   </div>
               </div>
           </>
        ) : (
            <button className={buttonStyle} onClick={() => setIsOpen(true)} >{buttonText}</button>
        )
    );
}
