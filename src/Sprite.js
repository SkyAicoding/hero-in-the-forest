export class Sprite {
    constructor(imageSrc, frameWidth, frameHeight, frameCount, frameSpeed = 10) {
        this.image = new Image();
        this.image.src = imageSrc;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.frameCount = frameCount;
        this.frameSpeed = frameSpeed; // frames to wait before switching

        this.currentFrame = 0;
        this.tickCount = 0;
        this.isReady = false;

        this.image.onload = () => {
            this.isReady = true;
            if (!this.frameWidth || !this.frameHeight) {
                // Auto-detect squares
                this.frameHeight = this.image.height;
                this.frameWidth = this.image.width / this.frameCount;
            }
        };
    }

    update() {
        if (!this.isReady) return;
        this.tickCount++;
        if (this.tickCount > this.frameSpeed) {
            this.tickCount = 0;
            this.currentFrame = (this.currentFrame + 1) % this.frameCount;
        }
    }

    draw(ctx, x, y, scale = 1, flipH = false) {
        if (!this.isReady) return;
        ctx.save();
        ctx.translate(x, y);
        if (flipH) {
            ctx.scale(-1, 1);
        }
        ctx.drawImage(
            this.image,
            this.currentFrame * this.frameWidth,
            0,
            this.frameWidth,
            this.frameHeight,
            - (this.frameWidth * scale) / 2, // Centered
            - (this.frameHeight * scale),     // Bottom-aligned roughly
            this.frameWidth * scale,
            this.frameHeight * scale
        );
        ctx.restore();
    }
}
