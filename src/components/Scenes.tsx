import { useEffect, useRef, useState } from "react";
import { Scene, type SceneInterface } from "./Scene";

interface ScenesProps {
    onComplete: () => void;
    onSceneChange: (index: number) => void;
}

interface TimedScene {
    scene: SceneInterface;
    duration: number;
}

export const sceneData: TimedScene[] = [
    {
        scene: {
            text: "NIGERIA",
            sceneStyle: { height: "100vh" },
            sceneClass: "intro-scene",
            textClass: "intro-title",
        },
        duration: 4500,
    },
    {
        scene: {
            videoUrl: `${import.meta.env.BASE_URL}culture/Nigeria_culture.mp4`,
            text: "OUR CULTURE",
            sceneClass: "culture-scene",
            mediaClass: "culture-video",
            textClass: "culture-title",
        },
        duration: 5800,
    },
    {
        scene: {
            videoUrl: `${import.meta.env.BASE_URL}heritage/Nigeria_heritage.mp4`,
            text: "OUR HERITAGE",
            sceneClass: "heritage-scene",
            mediaClass: "heritage-video",
            textClass: "heritage-title",
        },
        duration: 6200,
    },
    {
        scene: {
            imageUrl: `${import.meta.env.BASE_URL}people/Nigeria_people.png`,
            text: "OUR PEOPLE",
            sceneClass: "people-scene",
            mediaClass: "people-image",
            textClass: "people-title",
        },
        duration: 6300,
    },
];

export const Scenes = ({ onComplete, onSceneChange }: ScenesProps) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const preloadedMediaRef = useRef<(HTMLVideoElement | HTMLImageElement)[]>([]);

    useEffect(() => {
        onSceneChange(activeIndex);
    }, [activeIndex, onSceneChange]);

    

    useEffect(() => {
        const nextScene = sceneData[activeIndex + 1]?.scene;

        if (!nextScene) return;

        if (nextScene.videoUrl) {
            const video = document.createElement("video");
            video.preload = "auto";
            video.muted = true;
            video.src = nextScene.videoUrl;
            video.load();

            preloadedMediaRef.current.push(video);
        } else if (nextScene.imageUrl) {
            const image = new Image();
            image.src = nextScene.imageUrl;

            preloadedMediaRef.current.push(image);
        }
    }, [activeIndex]);
    

    useEffect(() => {
        const currentScene = sceneData[activeIndex];

        if (!currentScene) return;

        const timer = window.setTimeout(() => {
            if (activeIndex < sceneData.length - 1) {
                setActiveIndex((prev) => prev + 1);
            } else {
                onComplete();
            }
        }, currentScene.duration);

        return () => window.clearTimeout(timer);
    }, [activeIndex, onComplete]);

    const currentScene = sceneData[activeIndex];

    if (!currentScene) return null;

    return <Scene key={activeIndex} {...currentScene.scene} />;
};