import { createFFmpeg, fetchFile } from 'https://unpkg.com/@ffmpeg/ffmpeg@0.12.6/dist/ffmpeg.min.js';

const ffmpeg = createFFmpeg({ log: true });

window.convertToGIF = async () => {
  const input = document.getElementById('videoInput');
  const loader = document.getElementById('loader');
  const result = document.getElementById('result');

  if (input.files.length === 0) {
    alert("Please upload an MP4 file.");
    return;
  }

  const file = input.files[0];

  loader.style.display = 'block';
  result.innerHTML = '';

  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }

  const inputName = 'input.mp4';
  const outputName = 'output.gif';

  ffmpeg.FS('writeFile', inputName, await fetchFile(file));

  await ffmpeg.run(
    '-i', inputName,
    '-vf', 'fps=30,scale=480:-1:flags=lanczos',
    '-f', 'gif',
    outputName
  );

  const data = ffmpeg.FS('readFile', outputName);
  const blob = new Blob([data.buffer], { type: 'image/gif' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'converted.gif';
  link.textContent = 'Download GIF';
  result.appendChild(link);

  loader.style.display = 'none';
};
