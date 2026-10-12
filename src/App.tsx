import { useState, useCallback } from "react";
import { Scenes } from "./components/Scenes";
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