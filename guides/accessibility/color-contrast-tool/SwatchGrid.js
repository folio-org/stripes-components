import React, { useEffect, useState } from 'react';
import colorVariables from './colorVariables';
import {
  resolveCssVarColor,
  flattenOnBackground,
  contrastRatio,
  toHex,
} from './contrastUtils';
import css from './ColorContrastTool.css';

const WHITE = { r: 255, g: 255, b: 255 };
const AA_NORMAL_TEXT = 4.5;

export default function SwatchGrid() {
  const [swatches, setSwatches] = useState([]);
  const [activeName, setActiveName] = useState('--bg');

  useEffect(() => {
    const resolved = colorVariables.map((name) => {
      const rgba = resolveCssVarColor(name);
      const rgb = flattenOnBackground(rgba, WHITE);
      return { name, rgb, hex: toHex(rgb) };
    });
    setSwatches(resolved);
  }, []);

  const active = swatches.find((s) => s.name === activeName) || swatches[0];

  return (
    <div className={css.swatchTool}>
      <p className={css.activeBackgroundLabel}>
        Comparing against: <code>{activeName}</code>
        {active && <span> ({active.hex})</span>}
        {' '}— click any swatch below to use it as the comparison background.
      </p>
      <div className={css.swatchGrid}>
        {swatches.map((swatch) => {
          const ratio = active ? contrastRatio(swatch.rgb, active.rgb) : null;
          const pass = ratio !== null && ratio >= AA_NORMAL_TEXT;
          const isActive = swatch.name === activeName;
          return (
            <button
              type="button"
              key={swatch.name}
              className={`${css.swatchTile} ${isActive ? css.swatchTileActive : ''}`}
              onClick={() => setActiveName(swatch.name)}
            >
              <span
                className={css.swatchColor}
                style={{ backgroundColor: swatch.hex }}
              />
              <span className={css.swatchName}>{swatch.name}</span>
              <span className={css.swatchHex}>{swatch.hex}</span>
              {ratio !== null && (
                <span className={`${css.swatchRatio} ${pass ? css.pass : css.fail}`}>
                  {ratio.toFixed(2)}:1 — {pass ? 'PASS' : 'FAIL'}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
