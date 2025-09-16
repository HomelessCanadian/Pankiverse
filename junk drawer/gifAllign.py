from PIL import Image
import imageio
import numpy as np  # Add this line to import NumPy with the alias 'np'

# Load the GIF
gif = Image.open('dfg-3000.gif')

# Get frames
frames = []
try:
    while True:
        frames.append(gif.copy())
        gif.seek(gif.tell() + 1)
except EOFError:
    pass

# Determine the maximum width and height of all frames
max_width = max(frame.width for frame in frames)
max_height = max(frame.height for frame in frames)

# Align frames by resizing or padding them to the maximum size
aligned_frames = []
for frame in frames:
    # Create a new image with the maximum size and paste the frame onto it
    new_frame = Image.new('RGBA', (max_width, max_height), (0, 0, 0, 0))
    new_frame.paste(frame, (0, 0))
    aligned_frames.append(new_frame)

# Save as a new GIF
duration = gif.info['duration'] / 1000 if 'duration' in gif.info else 0.1  # Default duration if not available
imageio.mimsave('aligned_gif.gif', [np.array(frame) for frame in aligned_frames], duration=duration)
