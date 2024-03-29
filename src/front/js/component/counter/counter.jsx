import PropTypes from "prop-types";
import React, { useEffect, useState, useContext } from "react";
import gusinet from "../../../img/gusinet.png";
import gusinette from "../../../img/gusinette.png";
import { Context } from "../../store/appContext";
import "../../../styles/components/counter.scss";

export const Counter = props => {
    const { store, actions } = useContext(Context);
    const [clock, setClock] = useState([]);
    const [end, setEnd] = useState(props.date.getTime() < new Date().getTime());

    useEffect(() => {
        let timer = null;

        const updateClock = () => {
            let currentTime = new Date().getTime();

            // Segundos que quedan antes de la fecha
            let seg = Math.round((props.date.getTime() - currentTime) / 1000);

            if (seg < 0) {
                // stop timer
                setEnd(true);
                clearInterval(timer);
            } else {
                // update timer
                let days = Math.floor(seg / (24 * 60 * 60));
                seg = seg - days * 24 * 60 * 60;
                let hours = Math.floor(seg / (60 * 60));
                seg = seg - hours * 60 * 60;
                let mins = Math.floor(seg / 60);
                seg = seg - mins * 60;

                setClock(
                    [days, hours, mins, seg].map(num => {
                        num = num.toString();
                        if (num.length === 2) return num;
                        else return "0" + num;
                    })
                );
            }
        };

        timer = setInterval(updateClock, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        let keys = "";

        const handleKeyDown = e => {
            if (e.key === "Backspace") {
                keys = "";
            } else {
                keys += e.key;
                if (keys === "admin") {
                    actions.exitCounter();
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    const exit = () => {
        setTimeout(() => {
            actions.exitCounter();
        }, 1000);
    };

    return (
        <div className="counter center bg-dark-500">
            {end ? (
                <div className="greetings center">
                    <div className="greetings__images center">
                        <img src={gusinet} alt="gusinet" />
                        <img src={gusinette} alt="gusinette" />
                    </div>
                    <h1 className="greetings__msg">
                        🎉 ¡Feliz Gusiversario! 🎊
                    </h1>
                    <button className="btn btn--secondary" onClick={exit}>
                        Continuar
                    </button>
                </div>
            ) : (
                <div className="container">
                    <div className="row">
                        {clock.map((value, index) => (
                            <div className="time" key={index}>
                                {`${value}${
                                    index !== clock.length - 1 ? ":" : ""
                                }`}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

Counter.propTypes = {
    date: PropTypes.object.isRequired,
};
