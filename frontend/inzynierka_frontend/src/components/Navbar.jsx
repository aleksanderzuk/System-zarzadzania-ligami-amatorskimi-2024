import React from "react";
import { Link } from "react-router-dom";

export default function Navbar (){


    return(
        <div className="navbar">
            <Link to="/leagues" className="btn">Ligi</Link>
            <Link to="/teams" className="btn">Drużyny</Link>
            <Link to="/players" className="btn">Zawodnicy</Link>
            <Link to="/profile" className="btn">Mój profil</Link>
        </div>
    );
}