export class VoiceVisualizer {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.ctx = canvasElement.getContext('2d');
        this.state = 'idle'; // 'idle' | 'listening' | 'thinking' | 'speaking'
        this.animationFrameId = null;
        this.angle = 0;
        this.pulse = 0;

        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.startLoop();
    }

    resize() {
        if (!this.canvas) return;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio || 300;
        this.canvas.height = rect.height * window.devicePixelRatio || 300;
    }

    setState(newState) {
        this.state = newState;
    }

    startLoop() {
        const render = () => {
            this.draw();
            this.animationFrameId = requestAnimationFrame(render);
        };
        render();
    }

    draw() {
        const { width, height } = this.canvas;
        const ctx = this.ctx;
        ctx.clearRect(0, 0, width, height);

        const cx = width / 2;
        const cy = height / 2;
        const baseRadius = Math.min(width, height) * 0.28;

        this.angle += 0.02;
        this.pulse += 0.05;

        // Dynamic State Parameters
        let coreColor = '#0284c7';
        let glowColor = 'rgba(14, 165, 233, 0.5)';
        let ringSpeed = 1;
        let pulseScale = 1 + Math.sin(this.pulse) * 0.05;

        if (this.state === 'listening') {
            coreColor = '#10b981'; // Emerald/Cyan when listening
            glowColor = 'rgba(16, 185, 129, 0.6)';
            pulseScale = 1 + Math.sin(this.pulse * 2) * 0.15;
            ringSpeed = 2;
        } else if (this.state === 'thinking') {
            coreColor = '#8b5cf6'; // Violet while reasoning
            glowColor = 'rgba(139, 92, 246, 0.7)';
            ringSpeed = 4;
            pulseScale = 1 + Math.sin(this.pulse * 3) * 0.08;
        } else if (this.state === 'speaking') {
            coreColor = '#38bdf8'; // Electric blue when speaking
            glowColor = 'rgba(56, 189, 248, 0.8)';
            pulseScale = 1 + Math.sin(this.pulse * 4) * 0.22;
            ringSpeed = 2.5;
        }

        // 1. Outer Diffused Glow
        const gradient = ctx.createRadialGradient(cx, cy, baseRadius * 0.2, cx, cy, baseRadius * 1.8 * pulseScale);
        gradient.addColorStop(0, glowColor);
        gradient.addColorStop(0.5, glowColor.replace(/[\d.]+\)$/, '0.2)'));
        gradient.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cx, cy, baseRadius * 1.8 * pulseScale, 0, Math.PI * 2);
        ctx.fill();

        // 2. Concentric Sci-Fi Rotating Arcs
        ctx.save();
        ctx.translate(cx, cy);

        // Arc 1 (Clockwise)
        ctx.save();
        ctx.rotate(this.angle * ringSpeed);
        ctx.strokeStyle = coreColor;
        ctx.lineWidth = 2.5 * window.devicePixelRatio;
        ctx.shadowColor = coreColor;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(0, 0, baseRadius * 1.2 * pulseScale, 0, Math.PI * 0.8);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, baseRadius * 1.2 * pulseScale, Math.PI, Math.PI * 1.8);
        ctx.stroke();
        ctx.restore();

        // Arc 2 (Counter-Clockwise)
        ctx.save();
        ctx.rotate(-this.angle * ringSpeed * 1.3);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5 * window.devicePixelRatio;
        ctx.setLineDash([8, 12]);
        ctx.beginPath();
        ctx.arc(0, 0, baseRadius * 1.4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // 3. Central Core Reactor
        const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, baseRadius * 0.7 * pulseScale);
        coreGrad.addColorStop(0, '#ffffff');
        coreGrad.addColorStop(0.4, coreColor);
        coreGrad.addColorStop(1, 'rgba(15, 23, 42, 0.8)');

        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(0, 0, baseRadius * 0.7 * pulseScale, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }
}
