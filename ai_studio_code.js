document.addEventListener('DOMContentLoaded', () => {
    const promptInput = document.getElementById('prompt-input');
    const generateButton = document.getElementById('generate-button');
    const statusMessage = document.getElementById('status-message');
    const imageContainer = document.getElementById('image-container');
    const generatedImage = document.getElementById('generated-image');
    const placeholderText = document.getElementById('placeholder-text');
    const errorMessage = document.getElementById('error-message');

    generateButton.addEventListener('click', async () => {
        const prompt = promptInput.value.trim();

        if (!prompt) {
            alert('Please enter a prompt!');
            return;
        }

        // Reset previous states
        generatedImage.classList.add('hidden');
        placeholderText.classList.remove('hidden');
        errorMessage.classList.add('hidden');
        statusMessage.classList.remove('hidden');
        generateButton.disabled = true; // Disable button during generation
        generateButton.textContent = 'Generating...';

        try {
            // IMPORTANT: This URL will be your Cloudflare Worker endpoint!
            // For local testing, you might point it to a mock server or temporarily
            // to a public test API if available and safe.
            // Replace '/api/generate-image' with your actual Worker URL path.
            const response = await fetch('/api/generate-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: prompt }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const imageUrl = data.imageUrl; // Expecting the Worker to return { imageUrl: '...' }

            if (imageUrl) {
                generatedImage.src = imageUrl;
                generatedImage.classList.remove('hidden');
                placeholderText.classList.add('hidden');
            } else {
                throw new Error('No image URL received.');
            }

        } catch (error) {
            console.error('Error generating image:', error);
            errorMessage.textContent = `Error: ${error.message}. Please try again.`;
            errorMessage.classList.remove('hidden');
            generatedImage.classList.add('hidden');
            placeholderText.classList.remove('hidden');
        } finally {
            statusMessage.classList.add('hidden');
            generateButton.disabled = false; // Re-enable button
            generateButton.textContent = 'Generate Image';
        }
    });
});