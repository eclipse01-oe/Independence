import React from "react";

export interface EachSceneInterface {
    divStyle?: React.CSSProperties;
    divClass?: string;
}

export interface SceneInterface {
    imageUrl?: string;
    videoUrl?: string;
    text?: string;
    sceneStyle?: React.CSSProperties;
    sceneClass?: string;
    mediaStyle?: React.CSSProperties;
    mediaClass?: string;
    mediaDivStyle?: React.CSSProperties;
    mediaDivClass?: string;
    textStyle?: React.CSSProperties;
    textClass?: string;
    textDivStyle?: React.CSSProperties;
    textDivClass?: string;
    onComplete?: () => void;
    onMediaReady?: () => void;
}

export const Scene = (props: SceneInterface) => {
    return (
        <div className={props.sceneClass} style={props.sceneStyle}>
            {(props.videoUrl || props.imageUrl) && (
                <div className={props.mediaDivClass} style={props.mediaDivStyle}>
                    {props.videoUrl ? (
                        <video
                            src={props.videoUrl}
                            className={props.mediaClass}
                            style={props.mediaStyle}
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="auto"
                            onCanPlay={(event) => {
                                const video = event.currentTarget;

                                if (video.paused) {
                                    void video.play()
                                        .then(() => {
                                            props.onMediaReady?.();
                                        })
                                        .catch((error) => {
                                            console.error(
                                                "Video playback failed:",
                                                props.videoUrl,
                                                error
                                            );

                                            props.onMediaReady?.();
                                        });
                                } else {
                                    props.onMediaReady?.();
                                }
                            }}
                            onError={(event) => {
                                const video = event.currentTarget;

                                console.error("Video loading failed:", {
                                    src: video.currentSrc,
                                    errorCode: video.error?.code,
                                    errorMessage: video.error?.message,
                                });

                                // Allow the scene sequence to continue if the video fails.
                                props.onMediaReady?.();
                            }}
                        />
                    ) : (
                        <img
                            src={props.imageUrl}
                            alt={props.text || "Scene image"}
                            className={props.mediaClass}
                            style={props.mediaStyle}
                            onLoad={() => props.onMediaReady?.()}
                            onError={() => {
                                console.error(
                                    "Image loading failed:",
                                    props.imageUrl
                                );

                                // Allow the scene sequence to continue if the image fails.
                                props.onMediaReady?.();
                            }}
                        />
                    )}
                </div>
            )}

            {props.text && (
                <div
                    className={props.textDivClass}
                    style={props.textDivStyle}
                >
                    <h1 className={props.textClass} style={props.textStyle}>
                        {props.text}
                    </h1>
                </div>
            )}
        </div>
    );
};