import { useEffect, useState } from "react";
import { SeparateMap } from "../utils/SeparateMap";
import { Stars } from "../utils/Stars";
import { env_config } from "../utils/import";
import "../css/introScene.css";


const spacePath = (name: string, cat: string)=>`${env_config}space/${cat}/${name}.png`

interface IntroSCeneProps {
    onComplete?: () => void;
    playIntroVoice?: (index: number) => void;
    isAudioPlaying: boolean;
}

const IntroText = [
    { text: "Once upon A time", timer: 2500 },
    { text: "In A far away Land", timer: 2500 },
    { text: "There Lived A group of great People", timer: 2500 },
    { text: "Brought together To form A Nation Called", timer: 3500 },
    { text: "Nigeria", timer: 500 },
]


export const IntroSCene = ({onComplete, playIntroVoice, isAudioPlaying}: IntroSCeneProps) => {

    const [viewText, setViewText] = useState(0)
    const [displayText, setDisplayText] = useState("")
    const [ displayMap, setDisplayMap ] = useState(false)

    useEffect(() => {
        if (viewText >= IntroText.length) {
            setDisplayText("");
            return;
        }

        if (viewText >= IntroText.length + 1) {
            setDisplayMap(true);
            return;
        }

        setDisplayText(IntroText[viewText].text);

        // Don't advance the narration or text while audio is paused.
        if (!isAudioPlaying) return;

        playIntroVoice?.(viewText);

        const timeText = setTimeout(() => {
            setViewText((prev) => prev + 1);
        }, IntroText[viewText].timer);

        return () => clearTimeout(timeText);
    }, [viewText, isAudioPlaying, playIntroVoice]);

    useEffect(()=>{
        if(viewText === IntroText.length){
            setDisplayMap(true)
        }
    }, [viewText])

    return (
        <div className="intro-div">
            <div className="intro-text-div">
                <p>{displayText}</p>
            </div>
            <div>
                <img src={spacePath("Debris_small", "Objects")} alt="" className="debris-img" style={{top: "70%", left: "70%"}}/>
                <img src={spacePath("Rocks_small", "Objects")} alt="" className="rocks-img mid" style={{top: "50%", left: "10%"}}/>
                <img src={spacePath("Rocks_small", "Objects")} alt="" className="rocks-img big" style={{top: "80%", left: "90%"}}/>
                <img src={spacePath("Rocks_small", "Objects")} alt="" className="rocks-img small" style={{top: "25%", left: "80%"}}/>
                <img src={spacePath("volcano", "planets")} alt="" className="planet-img" style={{top: "10%", left: "10%"}}/>
                <img src={spacePath("moon", "planets")} alt="" className="moon-img" style={{top: "15%", left: "50%"}}/>
                
            </div>
            <Stars />
            {displayMap && <SeparateMap
                divClassName="intro-map-div"
                convasClassName="intro-map-canvas"
                onComplete={onComplete}
            />}
        </div>
    );
};