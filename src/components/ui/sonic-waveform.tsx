"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart2 } from 'lucide-react';

// Utility for class names
const cn = (...classes: Array<string | false | null | undefined>) =>
    classes.filter(Boolean).join(' ');

// Simple media query hook
function useMediaQuery(query: string) {
    const [matches, setMatches] = useState(false);
    useEffect(() => {
        const mql = window.matchMedia(query);
        const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
        setMatches(mql.matches);
        if (mql.addEventListener) mql.addEventListener('change', onChange);
        else mql.addListener(onChange);
        return () => {
            if (mql.removeEventListener) mql.removeEventListener('change', onChange);
            else mql.removeListener(onChange);
        };
    }, [query]);
    return matches;
}

type CanvasProps = { centerRatio?: number };

// Canvas renderer
const SonicWaveformCanvas: React.FC<CanvasProps> = ({ centerRatio = 0.5 }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId = 0;
        let dpr = 1, cssW = 0, cssH = 0;
        const mouse = { x: 0, y: 0 };
        let time = 0;

        const resizeCanvas = () => {
            dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
            cssW = window.innerWidth;
            cssH = window.innerHeight;
            canvas.width = Math.floor(cssW * dpr);
            canvas.height = Math.floor(cssH * dpr);
            canvas.style.width = cssW + 'px';
            canvas.style.height = cssH + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // draw using CSS pixels
            mouse.x = cssW / 2;
            mouse.y = cssH / 2;
        };

        const draw = () => {
            ctx.fillStyle = 'rgba(0,0,0,0.1)';
            ctx.fillRect(0, 0, cssW, cssH);

            const lineCount = 60;
            const segmentCount = 80;
            const baseY = cssH * centerRatio;

            for (let i = 0; i < lineCount; i++) {
                ctx.beginPath();
                const progress = i / lineCount;
                const colorIntensity = Math.sin(progress * Math.PI);
                ctx.strokeStyle = `rgba(255,176,0,${Math.max(0, colorIntensity) * 0.55})`;
                ctx.lineWidth = 1.5;

                for (let j = 0; j <= segmentCount; j++) {
                    const x = (j / segmentCount) * cssW;
                    const distToMouse = Math.hypot(x - mouse.x, baseY - mouse.y);
                    const mouseEffect = Math.max(0, 1 - distToMouse / 400);
                    const noise = Math.sin(j * 0.1 + time + i * 0.2) * 20;
                    const spike = Math.cos(j * 0.2 + time + i * 0.1) * Math.sin(j * 0.05 + time) * 50;
                    const y = baseY + noise + spike * (1 + mouseEffect * 2);
                    if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }

            time += 0.02;
            animationFrameId = requestAnimationFrame(draw);
        };

        const handleMouseMove = (ev: MouseEvent) => {
            mouse.x = ev.clientX;
            mouse.y = ev.clientY;
        };

        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', handleMouseMove);
        resizeCanvas();
        draw();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [centerRatio]);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full bg-transparent" />;
};

// Named export: background-only variant
export const SonicWaveformBackground: React.FC<{
    className?: string;
    gradient?: boolean;
    centerRatioMobile?: number;
    centerRatioDesktop?: number;
}> = ({
    className,
    gradient = true,
    centerRatioMobile = 0.5,
    centerRatioDesktop = 0.5
}) => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const centerRatio = isMobile ? centerRatioMobile : centerRatioDesktop;

    return (
        <div className={cn('pointer-events-none fixed inset-0 z-0', className)}>
            <SonicWaveformCanvas centerRatio={centerRatio} />
            {gradient && (
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
            )}
        </div>
    );
};

// Default export: demo hero
const SonicWaveformHero: React.FC = () => {
    const fadeUpVariants: Record<string, any> = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.2 + 0.5, duration: 0.8, ease: 'easeInOut' }
        })
    };

    return (
        <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
            <SonicWaveformCanvas centerRatio={0.5} />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 z-10"></div>

            <div className="relative z-20 text-center p-6">
                <motion.div
                    custom={0}
                    variants={fadeUpVariants}
                    initial="hidden"
                    animate="visible"
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6 backdrop-blur-sm"
                >
                    <BarChart2 className="h-4 w-4 text-amber-300" />
                    <span className="text-sm font-medium text-gray-200">Real-Time Data Sonification</span>
                </motion.div>

                <motion.h1
                    custom={1}
                    variants={fadeUpVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400"
                >
                    Sonic Waveform
                </motion.h1>

                <motion.p
                    custom={2}
                    variants={fadeUpVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-2xl mx-auto text-lg text-gray-400 mb-10"
                >
                    Translate complex data streams into intuitive, interactive soundscapes. Hear the patterns, feel the insights.
                </motion.p>

                <motion.div custom={3} variants={fadeUpVariants} initial="hidden" animate="visible">
                    <button className="px-8 py-4 bg-white text-black font-semibold rounded-lg shadow-lg hover:bg-gray-200 transition-colors duration-300 flex items-center gap-2 mx-auto">
                        Analyze the Stream
                        <ArrowRight className="h-5 w-5" />
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default SonicWaveformHero;
