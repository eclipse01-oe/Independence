import { useState, useEffect, useCallback } from "react";
import { Scenes, sceneData } from "./components/Scenes";
import { FinalScene } from "./components/FinalScenes";
import { useHeritageAudio } from "./hooks/audio";
import "./css/scene.css";
import "./css/finalScene.css";
import "./App.css";

const App = () => {
    const [showFinalScene, setShowFinalScene] = useState(false);

    const {
        startAudio,
        pauseAudio,
        playSceneVoice,
        isAudioPlaying,
    } = useHeritageAudio();

    const handleComplete = useCallback(() => {
        setShowFinalScene(true);
    }, []);

    const handleAudioToggle = async () => {
        if (isAudioPlaying) {
            pauseAudio();
        } else {
            await startAudio();
        }
    };

    useEffect(() => {
        const images: HTMLImageElement[] = [];

        sceneData.forEach(({ scene }) => {
            if (scene.imageUrl) {
                const image = new Image();
                image.src = scene.imageUrl;
                images.push(image);
            }
        });

        const coatOfArms = new Image();
        coatOfArms.src = `${import.meta.env.BASE_URL}coatOfArm/Nigeria_coat_of_arm.webp`;

        const map = new Image();
        map.src = `${import.meta.env.BASE_URL}map/Nigeria_map.svg`
        images.push(coatOfArms, map);
    }, []);


    useEffect(()=>{
        if(!showFinalScene) return

        const timer = setTimeout(()=>pauseAudio(), 14000)

        return ()=> clearTimeout(timer)
        
    }, [showFinalScene])

    return (
        <main>
            <button onClick={handleAudioToggle} className="audio-toggle-button">
                {isAudioPlaying ? "Pause Audio" : "Play Audio"}
            </button>

            {showFinalScene ? (
                <FinalScene />
            ) : (
                <Scenes
                    onComplete={handleComplete}
                    onSceneChange={playSceneVoice}
                />
            )}
        </main>
    );
};

export default App;