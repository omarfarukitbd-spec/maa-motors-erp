/**
 * camera-capture.js
 * Handles silent camera permission and image capture.
 */

// Request camera permission on login
export async function initializeCameraPermission() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        // Immediately stop the stream, we just wanted permission
        stream.getTracks().forEach(track => track.stop());
        return true;
    } catch (err) {
        console.warn('Camera permission denied or camera not found:', err);
        return false;
    }
}

// Silently capture a photo
export async function capturePhoto() {
    return new Promise(async (resolve) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            
            const video = document.createElement('video');
            video.srcObject = stream;
            video.autoplay = true;
            video.muted = true;
            video.playsInline = true;
            // Hide the video element
            video.style.display = 'none';
            document.body.appendChild(video);

            video.onloadedmetadata = () => {
                video.play();
                // Wait briefly for the camera to adjust exposure (500ms)
                setTimeout(() => {
                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    
                    // Stop tracks
                    stream.getTracks().forEach(track => track.stop());
                    video.remove();

                    // Convert to blob
                    canvas.toBlob((blob) => {
                        resolve(blob);
                    }, 'image/jpeg', 0.8);
                }, 500);
            };
        } catch (err) {
            console.error('Failed to capture photo:', err);
            resolve(null);
        }
    });
}
