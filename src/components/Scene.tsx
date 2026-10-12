import React from "react"


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
    onComplete?: ()=> void
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
                        />
                    ) : (
                        <img
                            src={props.imageUrl}
                            alt={props.text || "Scene image"}
                            className={props.mediaClass}
                            style={props.mediaStyle}
                        />
                    )}
                </div>
            )}

            {props.text && (
                <div className={props.textDivClass} style={props.textDivStyle}>
                    <h1 className={props.textClass} style={props.textStyle}>
                        {props.text}
                    </h1>
                </div>
            )}

        </div>
    )
}
