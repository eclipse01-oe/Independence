import { useEffect, useRef } from "react";

interface ParticleCanvasProps {
    onFlagFormed: () => void;
}

interface Particle {
    x: number;
    y: number;
    originX: number;
    originY: number;
    velocityX: number;
    velocityY: number;
    size: number;
    originSize: number;
    targetX: number;
    targetY: number;
    targetSize: number;
    color: string;
    targetColor: string;
}

export const Canva = ({ onFlagFormed }: ParticleCanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const onFlagFormedRef = useRef(onFlagFormed);

    useEffect(() => {
        onFlagFormedRef.current = onFlagFormed;
    }, [onFlagFormed]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");

        if (!canvas || !context) return;

        let width = 0;
        let height = 0;
        let particles: Particle[] = [];
        let textCanvas: HTMLCanvasElement | null = null;
        let animationFrame = 0;
        let startTime = 0;
        let formationCompleteNotified = false;

        const holdDuration = 1600;
        const scatterDuration = 2200;
        const formationDuration = 2500;
        const gravity = 25;

        let flagLeft = 0;
        let flagTop = 0;
        let flagWidth = 0;
        let flagHeight = 0;

        const setup = () => {
            width = Math.max(1, Math.floor(canvas.clientWidth));
            height = Math.max(1, Math.floor(canvas.clientHeight));

            const pixelRatio = window.devicePixelRatio || 1;

            canvas.width = Math.round(width * pixelRatio);
            canvas.height = Math.round(height * pixelRatio);

            context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

            // Create an invisible canvas for the declaration.
            textCanvas = document.createElement("canvas");
            textCanvas.width = width;
            textCanvas.height = height;

            const textContext = textCanvas.getContext("2d");

            if (!textContext) {
                textCanvas = null;
                return;
            }

            const lines = width < 480
                ? [
                    "NIGERIA.",
                    "WE HAIL THEE.",
                    "UNITY, FAITH,",
                    "PEACE, AND PROGRESS.",
                ]
                : [
                    "NIGERIA.",
                    "WE HAIL THEE.",
                    "UNITY, FAITH, PEACE, AND PROGRESS.",
                ];

            let fontSize = Math.min(64, width * 0.075);

            textContext.font = `700 ${fontSize}px Arial, sans-serif`;

            const widestLine = Math.max(
                ...lines.map((line) => textContext.measureText(line).width)
            );

            const maxTextWidth = width * 0.9;

            if (widestLine > maxTextWidth) {
                fontSize *= maxTextWidth / widestLine;
                textContext.font = `700 ${fontSize}px Arial, sans-serif`;
            }

            textContext.fillStyle = "#008751";
            textContext.textAlign = "center";
            textContext.textBaseline = "middle";

            const lineHeight = fontSize * 1.4;
            const totalHeight = lineHeight * (lines.length - 1);
            const startY = (height - totalHeight ) / 2;

            // Draw the declaration on the invisible canvas.
            lines.forEach((line, index) => {
                textContext.fillText(
                    line,
                    width / 2,
                    startY + index * lineHeight
                );
            });

            // Sample the pixels occupied by the text.
            const imageData = textContext.getImageData(
                0,
                0,
                width,
                height
            );

            const pixels = imageData.data;
            const gap = width < 480 ? 3 : 4;

            particles = [];

            for (let y = 0; y < height; y += gap) {
                for (let x = 0; x < width; x += gap) {
                    const pixelIndex = (y * width + x) * 4;
                    const alpha = pixels[pixelIndex + 3];

                    if (alpha > 100) {
                        particles.push({
                            x,
                            y,
                            originX: x,
                            originY: y,
                            velocityX: (Math.random() - 0.5) * 180,
                            velocityY: (Math.random() - 0.5) * 180,
                            size: gap,
                            originSize: gap,
                            targetX: x,
                            targetY: y,
                            targetSize: gap * 0.4,
                            color: "#008751",
                            targetColor: "#008751",
                        });
                    }
                }
            }

            // Calculate the flag dimensions.
            // The Nigerian flag has a 2:1 width-to-height ratio.
            flagWidth = Math.min(width * 0.5, height);
            flagHeight = flagWidth / 2;

            flagLeft = (width - flagWidth) / 2;
            flagTop = height * 0.07;

            if (particles.length === 0) return;

            // Calculate each particle's target position in the flag.
            const columns = Math.max(
                1,
                Math.ceil(
                    Math.sqrt(particles.length * (flagWidth / flagHeight))
                )
            );

            const rows = Math.ceil(particles.length / columns);

            const cellWidth = flagWidth / columns;
            const cellHeight = flagHeight / rows;
            const targetSize = Math.min(cellWidth, cellHeight) * 0.55;

            particles.forEach((particle, index) => {
                const column = index % columns;
                const row = Math.floor(index / columns);

                const horizontalPosition = (column + 0.5) / columns;

                particle.targetX = flagLeft + (column + 0.5) * cellWidth;
                particle.targetY = flagTop + (row + 0.5) * cellHeight;
                particle.targetSize = targetSize;

                // Nigerian flag: green, white, green.
                particle.targetColor =
                    horizontalPosition < 1 / 3 ||
                    horizontalPosition >= 2 / 3
                        ? "#008751"
                        : "#ffffff";
            });
        };

        const blendColor = (
            progress: number,
            targetColor: string
        ): string => {
            const target = targetColor === "#ffffff"
                ? [255, 255, 255]
                : [0, 135, 81];

            const red = Math.round(target[0] * progress);
            const green = Math.round(135 + (target[1] - 135) * progress);
            const blue = Math.round(81 + (target[2] - 81) * progress);

            return `rgb(${red}, ${green}, ${blue})`;
        };

        const drawParticle = (particle: Particle) => {
            context.fillStyle = particle.color;
            context.beginPath();
            context.arc(
                particle.x,
                particle.y,
                particle.size,
                0,
                Math.PI * 2
            );
            context.fill();
        };

        const animate = (now: number) => {
            if (!textCanvas) return;

            const elapsed = now - startTime;

            // Clear the previous frame.
            context.fillStyle = "#ffffff";
            context.fillRect(0, 0, width, height);

            // Phase 1: display the declaration.
            if (elapsed < holdDuration) {
                context.drawImage(textCanvas, 0, 0);

                animationFrame = window.requestAnimationFrame(animate);
                return;
            }

            // Phase 2: disintegrate the declaration into particles.
            if (elapsed < holdDuration + scatterDuration) {
                const seconds = (elapsed - holdDuration) / 1000;

                for (const particle of particles) {
                    particle.x =
                        particle.originX + particle.velocityX * seconds;

                    particle.y =
                        particle.originY +
                        particle.velocityY * seconds +
                        0.5 * gravity * seconds ** 2;

                    particle.color = "#008751";
                    particle.size = particle.originSize;

                    drawParticle(particle);
                }

                animationFrame = window.requestAnimationFrame(animate);
                return;
            }

            // Phase 3: form the Nigerian flag.
            const formationElapsed =
                elapsed - holdDuration - scatterDuration;

            const progress = Math.min(
                formationElapsed / formationDuration,
                1
            );

            // Ease out so particles slow down near their targets.
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const scatterSeconds = scatterDuration / 1000;

            for (const particle of particles) {
                const scatterX =
                    particle.originX + particle.velocityX * scatterSeconds;

                const scatterY =
                    particle.originY +
                    particle.velocityY * scatterSeconds +
                    0.5 * gravity * scatterSeconds ** 2;

                particle.x =
                    scatterX +
                    (particle.targetX - scatterX) * easedProgress;

                particle.y =
                    scatterY +
                    (particle.targetY - scatterY) * easedProgress;

                // Interpolate from the original particle size
                // to the target size without accumulating changes.
                particle.size =
                    particle.originSize +
                    (particle.targetSize - particle.originSize) *
                        easedProgress;

                particle.color = blendColor(
                    easedProgress,
                    particle.targetColor
                );

                drawParticle(particle);
            }

            // Subtle outline around the flag.
            context.strokeStyle = "#e5e5e5";
            context.lineWidth = 1;
            context.strokeRect(flagLeft, flagTop, flagWidth, flagHeight);

            if (progress < 1) {
                animationFrame = window.requestAnimationFrame(animate);
            } else if (!formationCompleteNotified) {
                formationCompleteNotified = true;
                onFlagFormedRef.current();
            }
        };

        setup();

        startTime = performance.now();
        animationFrame = window.requestAnimationFrame(animate);

        const handleResize = () => {
            window.cancelAnimationFrame(animationFrame);

            setup();

            formationCompleteNotified = false;
            startTime = performance.now();

            animationFrame = window.requestAnimationFrame(animate);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.cancelAnimationFrame(animationFrame);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="final-canvas"
            aria-label="Nigerian independence declaration transforming into the Nigerian flag"
            role="img"
        />
    );
};