import React, { useState, useEffect } from 'react';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import fontData from '../fonts.json';
import './TextEditor.css';

const TextEditor = () => {
  const [text, setText] = useState('');
  const [fontFamily, setFontFamily] = useState('');
  const [fontWeight, setFontWeight] = useState('');
  const [isItalic, setIsItalic] = useState(false);
  const [availableWeights, setAvailableWeights] = useState([]);

  useEffect(() => {
    const savedText = localStorage.getItem('text');
    const savedFontFamily = localStorage.getItem('fontFamily');
    const savedFontWeight = localStorage.getItem('fontWeight');
    const savedIsItalic = localStorage.getItem('isItalic') === 'true';

    if (savedText) setText(savedText);
    if (savedFontFamily) {
      setFontFamily(savedFontFamily);
      setAvailableWeights(Object.keys(fontData[savedFontFamily]));
    }
    if (savedFontWeight) setFontWeight(savedFontWeight);
    if (savedIsItalic) setIsItalic(savedIsItalic);
  }, []);

  const handleSave = () => {
    localStorage.setItem('text', text);
    localStorage.setItem('fontFamily', fontFamily);
    localStorage.setItem('fontWeight', fontWeight);
    localStorage.setItem('isItalic', isItalic);
  };

  const handleFontFamilyChange = (e) => {
    const selectedFont = e.target.value;
    setFontFamily(selectedFont);
    const weights = Object.keys(fontData[selectedFont]);
    setAvailableWeights(weights);

    if (!weights.includes(`${fontWeight}${isItalic ? 'italic' : ''}`)) {
      let newWeight = weights.find((w) => w.includes('italic')) || weights[0];
      if (newWeight.includes('italic')) {
        setIsItalic(true);
        setFontWeight(newWeight.replace('italic', ''));
      } else {
        setIsItalic(false);
        setFontWeight(newWeight);
      }
    }
  };

  const handleFontWeightChange = (e) => {
    setFontWeight(e.target.value);
  };

  const handleItalicToggle = (event) => {
    setIsItalic(event.target.checked);
  };

  const resetSettings = () => {
    setText('');
    setFontFamily('');
    setFontWeight('');
    setIsItalic(false);
    localStorage.removeItem('text');
    localStorage.removeItem('fontFamily');
    localStorage.removeItem('fontWeight');
    localStorage.removeItem('isItalic');
  };

  const loadFont = (fontFamily, fontWeight, isItalic) => {
    const variant = `${fontWeight}${isItalic ? 'italic' : ''}`;
    const fontUrl = fontData[fontFamily][variant];
    if (fontUrl) {
      const newStyle = document.createElement('style');
      newStyle.appendChild(document.createTextNode(`
        @font-face {
          font-family: '${fontFamily}';
          font-weight: ${fontWeight};
          font-style: ${isItalic ? 'italic' : 'normal'};
          src: url(${fontUrl});
        }
      `));
      document.head.appendChild(newStyle);
    }
  };

  useEffect(() => {
    if (fontFamily && fontWeight) {
      loadFont(fontFamily, fontWeight, isItalic);
    }
  }, [fontFamily, fontWeight, isItalic]);

  return (
    <div className="text-editor-container">
      <label className='TextEditorName'>Text Editor</label>
      <div className="controls">
        <label className='hii1'>
          Font Family: 
          <select
            className="select1"
            value={fontFamily}
            onChange={handleFontFamilyChange}
          >
            <option value="" disabled>Select a font</option>
            {Object.keys(fontData).map((font) => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
        </label>
        <label className='hii2'>
          Font Weight:
          <select
            className="select2"
            value={fontWeight}
            onChange={handleFontWeightChange}
          >
            {availableWeights.map((weight) => (
              <option key={weight} value={weight.replace('italic', '')}>
                {weight.replace('italic', ' Italic')}
              </option>
            ))}
          </select>
        </label>
        <FormControlLabel
          control={
            <Switch
              checked={isItalic}
              onChange={handleItalicToggle}
              disabled={!availableWeights.includes(`${fontWeight}italic`)}
            />
          }
          label="Italic"
        />
      </div>
      <div>
        <textarea
          className="textarea"
          style={{
            fontFamily,
            fontWeight,
            fontStyle: isItalic ? 'italic' : 'normal'
          }}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div className="buttons">
        <button className="button" onClick={resetSettings}>Reset</button>
        <button className="button" onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default TextEditor;
