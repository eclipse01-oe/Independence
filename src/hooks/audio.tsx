import { useCallback, useEffect, useRef, useState } from "react";

const voiceByScene: Record<number, string> = {
    0: `${import.meta.env.BASE_URL}audio/Nigeria.mp3`,
    1: `${import.meta.env.BASE_URL}audio/our_culture.mp3`,
    2: `${import.meta.env.BASE_URL}audio/our_heritage.mp3`,
    3: `${import.meta.env.BASE_URL}audio/our_people.mp3`,
};

export const useHeritageAudio = () => {
    const drumRef = useRef<HTMLAudioElement | null>(null);
    const voiceRef = useRef<HTMLAudioElement | null>(null);
    const audioEnabledRef = useRef(false);
    const currentSceneRef = useRef(0);

    const [isAudioPlaying, setIsAudioPlaying] = useState(false);

    useEffect(() => {
        const drum = new Audio(`${import.meta.env.BASE_URL}audio/talking_drum.mp3`);
        drum.loop = true;
        drum.volume = .7;

        const voice = new Audio();
        voice.volume = 1;

        drumRef.current = drum;
        voiceRef.current = voice;

        return () => {
            drum.pause();
            voice.pause();

            drumRef.current = null;
            voiceRef.current = null;
        };
    }, []);

    const playVoiceForScene = useCallback((sceneIndex: number, restart: boolean) => {
        const audioPath = voiceByScene[sceneIndex];
        const drum = drumRef.current;
        const voice = voiceRef.current;

        if (!drum || !voice) return;

        if (!audioPath) {
            voice.pause();
            drum.volume = .7;
            return;
        }

        const sameSource = voice.getAttribute("src") === audioPath;

        if (restart || !sameSource) {
            voice.pause();
            voice.currentTime = 0;
            voice.src = audioPath;
        }

        if (!restart && sameSource && voice.ended) {
            drum.volume = .7;
            return;
        }

        voice.playbackRate = 0.8;
        voice.preservesPitch = true;

        drum.volume = 0.2;

        const restoreDrumVolume = () => {
            if (drumRef.current) drumRef.current.volume = .7;
        };

        voice.onended = restoreDrumVolume;
        voice.onerror = restoreDrumVolume;

        void voice.play().catch((error) => {
            restoreDrumVolume();
            console.error("Unable to play voice recording:", error);
        });
    }, []);

    const startAudio = useCallback(async () => {
        const drum = drumRef.current;

        if (!drum) return;

        const drumPlayback = drum.play();

        audioEnabledRef.current = true;
        setIsAudioPlaying(true);

        playVoiceForScene(currentSceneRef.current, false);

        try {
            await drumPlayback;
        } catch (error) {
            audioEnabledRef.current = false;
            setIsAudioPlaying(false);

            console.error("Unable to start talking drum:", error);
        }
    }, [playVoiceForScene]);

    const pauseAudio = useCallback(() => {
        audioEnabledRef.current = false;

        drumRef.current?.pause();
        voiceRef.current?.pause();

        setIsAudioPlaying(false);
    }, []);

    const playSceneVoice = useCallback((sceneIndex: number) => {
        currentSceneRef.current = sceneIndex;

        if (!audioEnabledRef.current) return;

        playVoiceForScene(sceneIndex, true);
    }, [playVoiceForScene]);

    return { startAudio, pauseAudio, playSceneVoice, isAudioPlaying };
};