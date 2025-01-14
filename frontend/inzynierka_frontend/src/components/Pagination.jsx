import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";


export default function Pagination({ handleClickLeft, handleClickRight, page }){
    return(
        <div className='mt-4 container custom-container-next d-flex justify-content-between'>
            <button className='navigator custom-btn' onClick={handleClickLeft}><FaArrowLeft /></button>
            <h3 className='page'>Strona: {page}</h3>
            <button className='navigator custom-btn' onClick={handleClickRight}><FaArrowRight /></button>
        </div>
    )
}