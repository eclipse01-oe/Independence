import { useEffect, useRef, useState } from "react";
import { Scene, type SceneInterface } from "./Scene";
import { env_config } from "../utils/import";

interface ScenesProps {
    onComplete: () => void;
    onSceneChange: (index: number) => void;
}

interface SceneMedia {
    type: "image" | "video";
    src: string;
    duration: number;
    mediaClass: string;
    text?: string;
}

type SceneConfig = Omit<
    SceneInterface,
    "videoUrl" | "imageUrl" | "mediaClass"
>;

interface TimedScene {
    scene: SceneConfig;
    media: SceneMedia[];
}

export const sceneData: TimedScene[] = [
    // 0. Our Culture
    {
        scene: {
            text: "A NATION OF BEAUTIFUL CULTURE",
            sceneClass: "culture-scene",
            textClass: "culture-title",
        },
        media: [
            {
                type: "video",
                src: `${env_config}culture/Nigeria_culture_optimized.mp4`,
                duration: 5800,
                mediaClass: "culture-video",
            },
        ],
    },

    // 1. Our Heritage
    {
        scene: {
            text: "A LAND OF GREAT HERITAGE",
            sceneClass: "heritage-scene",
            textClass: "heritage-title",
        },
        media: [
            {
                type: "video",
                src: `${env_config}heritage/Nigeria_heritage_optimized.mp4`,
                duration: 2300,
                mediaClass: "heritage-video",
            },
            {
                type: "image",
                src: `${env_config}heritage/heritae1.jpeg`,
                duration: 2000,
                mediaClass: "heritage-video",
            },
            {
                type: "image",
                src: `${env_config}heritage/heritage2.jpeg`,
                duration: 2000,
                mediaClass: "heritage-video",
            },
            {
                type: "image",
                src: `${env_config}heritage/heritage3.jpeg`,
                duration: 2000,
                mediaClass: "heritage-video",
            },
        ],
    },    
    
    // 2. Our Languages
    {
        scene: {
            text: "A PEOPLE WITH DIVERS TRIBES AND LANGUAGES",
            sceneClass: "people-scene",
            textClass: "people-title",
        },
        media: [
            {
                type: "image",
                src: `${env_config}tribe/housa.jpeg`,
                duration: 2100,
                mediaClass: "people-image",
                text: "OUR LANGUAGES — HAUSA",
            },
            {
                type: "image",
                src: `${env_config}tribe/igbo.jpeg`,
                duration: 2100,
                mediaClass: "people-image",
                text: "OUR LANGUAGES — IGBO",
            },
            {
                type: "image",
                src: `${env_config}tribe/yorouba.jpeg`,
                duration: 2100,
                mediaClass: "people-image",
                text: "OUR LANGUAGES — YORUBA",
            },
        ],
    },

    // 3. Our People
    {
        scene: {
            text: "A LAND OF BEAUTIFUL PEOPLE",
            sceneClass: "people-scene",
            textClass: "people-title",
        },
        media: [
            {
                type: "image",
                src: `${env_config}people/people1.jpeg`,
                duration: 2000,
                mediaClass: "people-image",
            },
            {
                type: "image",
                src: `${env_config}people/people2.jpeg`,
                duration: 2000,
                mediaClass: "people-image",
            },
            {
                type: "image",
                src: `${env_config}people/people3.jpeg`,
                duration: 2000,
                mediaClass: "people-image",
            },
            {
                type: "image",
                src: `${env_config}people/people4.jpeg`,
                duration: 2000,
                mediaClass: "people-image",
            },
            {
                type: "image",
                src: `${env_config}people/Nigeria_people.webp`,
                duration: 2000,
                mediaClass: "people-image",
            },
        ],
    },

    // 4. Our Delicacies
    {
        scene: {
            text: "A NATION WITH SWEET DELICACIES",
            sceneClass: "people-scene",
            textClass: "people-title",
        },
        media: [
            {
                type: "image",
                src: `${env_config}food/food1.jpeg`,
                duration: 2500,
                mediaClass: "people-image",
            },
            {
                type: "image",
                src: `${env_config}food/food2.jpeg`,
                duration: 2500,
                mediaClass: "people-image",
            },
            {
                type: "image",
                src: `${env_config}food/food3.jpg`,
                duration: 2500,
                mediaClass: "people-image",
            },
            {
                type: "image",
                src: `${env_config}food/food4.jpeg`,
                duration: 2500,
                mediaClass: "people-image",
            },
        ],
    },
];

export const Scenes = ({ onComplete, onSceneChange }: ScenesProps) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [activeMediaIndex, setActiveMediaIndex] = useState(0);

    const preloadedMediaRef = useRef<
        (HTMLVideoElement | HTMLImageElement)[]
    >([]);

    // Keep the latest callbacks without restarting the scene timer.
    const onCompleteRef = useRef(onComplete);
    const onSceneChangeRef = useRef(onSceneChange);

    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    useEffect(() => {
        onSceneChangeRef.current = onSceneChange;
    }, [onSceneChange]);

    // Narration changes only when the scene changes, not on every shot.
    useEffect(() => {
        onSceneChangeRef.current(activeIndex);
    }, [activeIndex]);

    // Preload the next shot so cuts are less likely to show a blank frame.
    useEffect(() => {
        const currentScene = sceneData[activeIndex];

        if (!currentScene) return;

        const nextMedia = currentScene.media[activeMediaIndex + 1] ??
        sceneData[activeIndex + 1]?.media[0];

        if (!nextMedia) return;

        const alreadyPreloaded = preloadedMediaRef.current.some((item) => {
            if (nextMedia.type === "video") {
                return (
                    item instanceof HTMLVideoElement &&
                    item.getAttribute("src") === nextMedia.src
                );
            }

            return (
                item instanceof HTMLImageElement &&
                item.getAttribute("src") === nextMedia.src
            );
        });

        if (alreadyPreloaded) return;

        if (nextMedia.type === "video") {
            const video = document.createElement("video");

            video.preload = "auto";
            video.muted = true;
            video.src = nextMedia.src;
            video.load();

            preloadedMediaRef.current.push(video);
        } else {
            const image = new Image();

            image.src = nextMedia.src;

            preloadedMediaRef.current.push(image);
        }
    }, [activeIndex, activeMediaIndex]);

    // Advance through shots, then advance to the next scene.
    useEffect(() => {
        const currentScene = sceneData[activeIndex];
        const currentMedia = currentScene?.media[activeMediaIndex];

        if (!currentScene || !currentMedia) return;

        const timer = window.setTimeout(() => {
            const hasAnotherShot =
                activeMediaIndex < currentScene.media.length - 1;

            if (hasAnotherShot) {
                setActiveMediaIndex((previous) => previous + 1);
                return;
            }

            const hasAnotherScene = activeIndex < sceneData.length - 1;

            if (hasAnotherScene) {
                setActiveIndex((previous) => previous + 1);
                setActiveMediaIndex(0);
                return;
            }

            onCompleteRef.current();
        }, currentMedia.duration);

        return () => window.clearTimeout(timer);
    }, [activeIndex, activeMediaIndex]);

    const currentScene = sceneData[activeIndex];
    const currentMedia = currentScene?.media[activeMediaIndex];

    if (!currentScene || !currentMedia) return null;

    return (
        <Scene
            key={`${activeIndex}-${activeMediaIndex}`}
            {...currentScene.scene}
            videoUrl={
                currentMedia.type === "video"
                    ? currentMedia.src
                    : undefined
            }
            imageUrl={
                currentMedia.type === "image"
                    ? currentMedia.src
                    : undefined
            }
            mediaClass={currentMedia.mediaClass}
            text={currentMedia.text ?? currentScene.scene.text}
        />
    );
};