import { useState, useEffect, useCallback } from "react";
import { IntroSCene } from "./components/IntroScene";
import { Scenes, sceneData } from "./components/Scenes";
import { FinalScene } from "./components/FinalScenes";
import { useHeritageAudio } from "./hooks/audio";
import { env_config } from "./utils/import";
import "./css/scene.css";
import "./css/finalScene.css";
import "./App.css";

const App = () => {
    type AppStage = "intro" | "scenes" | "final";

    const [stage, setStage] = useState<AppStage>("intro");

    const handleComplete = useCallback(() => {
        setStage("final");
    }, []);

    const {
        startAudio,
        pauseAudio,
        playSceneVoice,
        isAudioPlaying,
        playIntroVoice,
    } = useHeritageAudio();

const handleAudioToggle = async () => {
    if (isAudioPlaying) {
        pauseAudio();
        return;
    }

    if (stage === "intro") {
        await startAudio(false);
    } else {
        await startAudio();
    }
};

    useEffect(() => {
        const images: HTMLImageElement[] = [];

        sceneData.forEach(({ scene, media }) => {
            if (scene) {
                media.forEach(({type, src})=>{

                    if(type !== "image") return;

                    const image = new Image();
                    image.src = src;
                    images.push(image);
                })
                
            }
        });

        const coatOfArms = new Image();
        coatOfArms.src = `${env_config}coatOfArm/Nigeria_coat_of_arm.webp`;

        const map = new Image();
        map.src = `${env_config}map/Nigeria_map.svg`
        images.push(coatOfArms, map);
    }, []);

    useEffect(() => {
        if (stage !== "final") return;

        const timer = setTimeout(() => pauseAudio(), 17000);

        return () => clearTimeout(timer);
    }, [stage, pauseAudio]);

    return (
        <main>
            <button onClick={handleAudioToggle} className="audio-toggle-button">
                {isAudioPlaying ? "Pause Audio" : "Play Audio"}
            </button>

           {stage === "intro" && (
                <IntroSCene
                    onComplete={() => setStage("scenes")}
                    playIntroVoice={playIntroVoice}
                    isAudioPlaying={isAudioPlaying}

                />
            )}

            {stage === "scenes" && (
                <Scenes
                    onComplete={handleComplete}
                    onSceneChange={playSceneVoice}
                />
            )}

            {stage === "final" && <FinalScene />}
        </main>
    );
};

export default App;