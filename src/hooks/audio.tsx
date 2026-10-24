import { useCallback, useEffect, useRef, useState } from "react";
import { env_config } from "../utils/import";

const voiceByScene: Partial<Record<number, string>> = {
    0: `${env_config}audio/our_culture.mp3`,
    1: `${env_config}audio/our_heritage.mp3`,
    2: `${env_config}audio/our_tribes.mp3`,
    3: `${env_config}audio/our_people.mp3`,
    4: `${env_config}audio/our_delicacies.mp3`,
};

const IntroVoice: Record<number, string> = {
    0: `${env_config}audio/Intro0.mp3`,
    1: `${env_config}audio/Intro1.mp3`,
    2: `${env_config}audio/Intro2.mp3`,
    3: `${env_config}audio/Intro3.mp3`,
    4: `${env_config}audio/Nigeria.mp3`,
};

export const useHeritageAudio = () => {
    const drumRef = useRef<HTMLAudioElement | null>(null);
    const voiceRef = useRef<HTMLAudioElement | null>(null);

    // Each intro audio element is stored under its index.
    const introRefs = useRef<Record<number, HTMLAudioElement>>({});
    const activeIntroRef = useRef<HTMLAudioElement | null>(null);
    const currentIntroIndexRef = useRef<number | null>(null);

    const audioEnabledRef = useRef(false);
    const currentSceneRef = useRef(0);

    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [isIntro, setIsIntro] = useState(false);

    useEffect(() => {
        const drum = new Audio(`${env_config}audio/moja.mp3`);
        drum.loop = true;
        drum.volume = 0.6;

        const voice = new Audio();
        voice.preload = "auto";
        voice.volume = 1;

        // Create and preload an individual player for every intro.
        const introPlayers = introRefs.current;

        Object.entries(IntroVoice).forEach(([index, src]) => {
            const key = Number(index);
        
            if (!introPlayers[key]) {
                introPlayers[key] = new Audio(src);
            }
        
            introPlayers[key].preload = "auto";
            introPlayers[key].volume = 0.8;
            introPlayers[key].load();
        });

        const preloadedVoices = Object.values(voiceByScene).map((src) => {
            const audio = new Audio(src);
            audio.preload = "auto";
            audio.load();
            return audio;
        });

        drumRef.current = drum;
        voiceRef.current = voice;
        introRefs.current = introPlayers;

        return () => {
            drum.pause();
            voice.pause();

            Object.values(introPlayers).forEach((intro) => intro.pause());
            preloadedVoices.forEach((audio) => audio.pause());

            drumRef.current = null;
            voiceRef.current = null;
            introRefs.current = {};
            activeIntroRef.current = null;
            currentIntroIndexRef.current = null;
        };
    }, []);

    const playVoiceForScene = useCallback(
        (sceneIndex: number, restart: boolean) => {
            const audioPath = voiceByScene[sceneIndex];
            const drum = drumRef.current;
            const voice = voiceRef.current;

            if (!drum || !voice) return;

            if (!audioPath) {
                voice.pause();
                drum.volume = 0.6;
                return;
            }

            const sameSource = voice.getAttribute("src") === audioPath;

            if (restart || !sameSource) {
                voice.pause();
                voice.currentTime = 0;
                voice.src = audioPath;
            }

            if (!restart && sameSource && voice.ended) {
                drum.volume = 0.6;
                return;
            }

            voice.playbackRate = 0.8;
            voice.preservesPitch = true;
            drum.volume = 0.3;

            const restoreDrumVolume = () => {
                if (drumRef.current) drumRef.current.volume = 0.6;
            };

            voice.onended = restoreDrumVolume;
            voice.onerror = restoreDrumVolume;

            console.log("Scene voice requested:", sceneIndex, voiceByScene[sceneIndex]);

            void voice.play().catch((error) => {
                restoreDrumVolume();
                console.error("Unable to play voice recording:", error);
            });
        },
        []
    );

    const startAudio = useCallback(
        async (playCurrentScene = true) => {
            const drum = drumRef.current;
            if (!drum) return;

            audioEnabledRef.current = true;

            try {
                await drum.play();
                setIsAudioPlaying(true);
            } catch (error) {
                audioEnabledRef.current = false;
                setIsAudioPlaying(false);

                console.error("Unable to start talking drum:", error);
                return;
            }

            if (playCurrentScene) {
                const intro = activeIntroRef.current;

                if (intro) {
                    intro.pause();
                    intro.currentTime = 0;
                    intro.onended = null;
                }

                activeIntroRef.current = null;
                currentIntroIndexRef.current = null;

                setIsIntro(false);
                playVoiceForScene(currentSceneRef.current, false);
            }
        },
        [playVoiceForScene]
    );

    const pauseAudio = useCallback(() => {
        audioEnabledRef.current = false;

        drumRef.current?.pause();
        voiceRef.current?.pause();
        activeIntroRef.current?.pause();

        setIsIntro(false);
        setIsAudioPlaying(false);
    }, []);

    const playSceneVoice = useCallback(
        (sceneIndex: number) => {
            currentSceneRef.current = sceneIndex;

            const intro = activeIntroRef.current;

            if (intro) {
                intro.pause();
                intro.currentTime = 0;
                intro.onended = null;
            }

            activeIntroRef.current = null;
            currentIntroIndexRef.current = null;

            setIsIntro(false);

            if (!audioEnabledRef.current) return;

            playVoiceForScene(sceneIndex, true);
        },
        [playVoiceForScene]
    );

    const playIntroVoice = useCallback(async (introIndex: number) => {
        let intro = introRefs.current[introIndex];
        const introPath = IntroVoice[introIndex]

        if (!introPath) {
            return;
        }
        

        if (!intro) {
            intro = new Audio(introPath);
            intro.preload = "auto";
            intro.volume = 0.8;

            introRefs.current[introIndex] = intro;
            intro.load();
        }
        console.log("Intro index:", introIndex, "Audio:", introPath);

        if (!audioEnabledRef.current) return;

        // Stop the previous intro if a different one is selected.
        const activeIntro = activeIntroRef.current;

        if (activeIntro && activeIntro !== intro) {
            activeIntro.pause();
            activeIntro.currentTime = 0;
            activeIntro.onended = null;
        }

        // Prevent scene narration from overlapping the intro.
        voiceRef.current?.pause();

        // Resume the same intro when paused, but restart when switching clips.
        if (currentIntroIndexRef.current !== introIndex || intro.ended) {
            intro.currentTime = 0;
        }

        currentIntroIndexRef.current = introIndex;
        activeIntroRef.current = intro;

        const drum = drumRef.current;

        if (drum) drum.volume = 0.5;

        intro.volume = 1;
        intro.playbackRate = 0.8;

        setIsIntro(true);

        intro.onended = () => {
            // Ignore completion events from an intro that is no longer active.
            if (activeIntroRef.current !== intro) return;

            activeIntroRef.current = null;
            setIsIntro(false);

            if (drumRef.current) drumRef.current.volume = 0.6;
        };

        try {
            await intro.play();
        } catch (error) {
            if (activeIntroRef.current === intro) {
                activeIntroRef.current = null;
                setIsIntro(false);
            }

            if (drumRef.current) drumRef.current.volume = 0.6;

            console.error(
                `Unable to play intro ${introIndex}:`,
                error
            );
        }
    }, []);

    return {
        startAudio,
        pauseAudio,
        playSceneVoice,
        playIntroVoice,
        isAudioPlaying,
        isIntro,
    };
};