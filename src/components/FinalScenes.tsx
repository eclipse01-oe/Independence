import { useState, useEffect } from "react";
import { Canva } from "./ParticleCanvas";


export const FinalScene = () => {
    const [flagFormed, setFlagFormed] = useState(false);
    const [changeScene, setChangeScene] = useState(false);

    useEffect(() => {
        if (!flagFormed) return;

        const timeout = setTimeout(() => setChangeScene(true), 3000);
        return () => clearTimeout(timeout);
    }, [flagFormed]);

    const srcImg = `${import.meta.env.BASE_URL}coatOfArm/Nigeria_coat_of_arm.webp`;
    const nigeriaMapSrc = `${import.meta.env.BASE_URL}map/Nigeria_map.svg`;

    return (
        <main className="final-scene">
            <section className={`national-identity-section${changeScene ? " not-visible" : ""}`}>
                <img
                    src={nigeriaMapSrc}
                    className="nigeria-map-bg"
                    alt=""
                    aria-hidden="true"
                />

                <Canva onFlagFormed={() => setFlagFormed(true)} />

                <div className={`coat-of-arm-div${flagFormed ? " is-visible" : ""}`}>
                    <img
                        src={srcImg}
                        alt="Nigerian coat of arms"
                    />

                    <p>Different cultures. Different cities. One nation.</p>
                </div>
            </section>

            {changeScene && (
                <section className={`final-info-div${changeScene ? " is-visible" : ""}`}>
                    <h1>NIGERIA @ 66</h1>
                    <p>1 OCTOBER 1960 – 2026</p>
                    <p style={{ color: "green", fontWeight: 700 }}>OsaiEmma</p>
                </section>
            )}
        </main>
    );
};