'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
    const [width, setWidth] = useState(400);
    const [height, setHeight] = useState(300);
    const [fontFamily, setFontFamily] = useState('Arial');
    const [fontSize, setFontSize] = useState(24);
    const [fontColor, setFontColor] = useState('#000000');
    const [watermarkText, setWatermarkText] = useState('');
    const [watermarkPlacement, setWatermarkPlacement] = useState('bottomRight');

  return (
    <main>
          <h2>Image Customization</h2>
      <form>
        <label>
          Width:
          <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} />
        </label>
        <label>
          Height:
          <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
        </label>
        <label>
          Font Family:
          <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            {/* Add other font options */}
          </select>
        </label>
        {/* Add other customization options */}
        <button type="submit">Apply Changes</button>
      </form>
    </main>
  );
}
