import React, { useEffect, useMemo, useState } from 'react';
import Button from '../../../lib/Button';
import Icon from '../../../lib/Icon';
import colorVariables from './colorVariables';
import Select from '../../../lib/Select';

import {
  resolveCssVarColor,
  flattenOnBackground,
  contrastRatio,
  toHex,
} from './contrastUtils';
import css from './ColorContrastTool.css';

const WHITE = { r: 255, g: 255, b: 255 };
const AA_NORMAL_TEXT = 4.5;
const COPIED_MESSAGE_DURATION = 1500;

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'passing', label: 'Passing' },
  { value: 'failing', label: 'Failing' },
];

export default function SwatchGrid() {
  const [swatches, setSwatches] = useState([]);
  const [activeName, setActiveName] = useState('--bg');
  const [copiedName, setCopiedName] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const resolved = colorVariables.map((name) => {
      const rgba = resolveCssVarColor(name);
      const rgb = flattenOnBackground(rgba, WHITE);
      return { name, rgb, hex: toHex(rgb) };
    });
    setSwatches(resolved);
  }, []);

  const active = swatches.find((s) => s.name === activeName) || swatches[0];

  const copyToClipboard = (name) => {
    navigator.clipboard.writeText(`var(${name})`).then(() => {
      setCopiedName(name);
      setTimeout(() => setCopiedName((current) => (current === name ? null : current)), COPIED_MESSAGE_DURATION);
    });
  };

  const swatchesWithRatio = useMemo(() => swatches.map((swatch) => {
    const ratio = active ? contrastRatio(swatch.rgb, active.rgb) : null;
    const pass = ratio !== null && ratio >= AA_NORMAL_TEXT;
    return { ...swatch, ratio, pass };
  }), [swatches, active]);

  const visibleSwatches = swatchesWithRatio.filter((swatch) => {
    if (filter === 'passing') return swatch.pass;
    if (filter === 'failing') return !swatch.pass;
    return true;
  });

  return (
    <div className={css.swatchTool}>
      <div className={css.toolbar}>
        <div className={css.compareInfo}>
          {active && (
            <span
              className={css.activeBackgroundSwatch}
              style={{ backgroundColor: active.hex }}
            />
          )}
          <p className={css.activeBackgroundLabel}>
            Comparing against <strong><code>{activeName}</code></strong>
            {active && <span> ({active.hex})</span>}
            <br />Use the &quot;Set as compare&quot; button on any row below to use it as the
            comparison background, or &quot;Copy&quot; to copy its variable.
          </p>
        </div>
        <div className={css.filterRow}>
          <label htmlFor="swatchFilter" className={css.filterLabel}>Show:</label>
          <Select marginBottom0 id="swatchFilter" value={filter} onChange={(e) => setFilter(e.target.value)}>
            {FILTERS.map(({ value, label }) => (
              <option
                key={value}
                value={value}
              >
                {label}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className={css.swatchGridScroll}>
        <div className={css.swatchGrid}>
          {visibleSwatches.map(({ ratio, pass, ...swatch }) => {
            const isActive = swatch.name === activeName;
            return (
              <div
                key={swatch.name}
                className={`${css.swatchTile} ${isActive ? css.swatchTileActive : ''}`}
              >
                <div className={css.swatchMain}>
                  <span className={css.swatchColor}>
                    <span
                      className={css.swatchColorHalf}
                      style={{ backgroundColor: active ? active.hex : swatch.hex }}
                    />
                    <span
                      className={css.swatchColorHalf}
                      style={{ backgroundColor: swatch.hex }}
                    />
                  </span>
                  <span className={css.swatchName}>{swatch.name}</span>
                  <span className={css.swatchHex}>{swatch.hex}</span>
                  {ratio !== null && (
                    <span className={`${css.swatchRatio} ${pass ? css.pass : css.fail}`}>
                      {ratio.toFixed(2)}:1 — {pass ? 'PASS' : 'FAIL'}
                    </span>
                  )}
                </div>
                <div className={css.swatchActions}>
                  <Button
                    buttonStyle="default slim"
                    disabled={isActive}
                    onClick={() => setActiveName(swatch.name)}
                    marginBottom0
                  >
                    Set as compare
                  </Button>
                  <Button
                    buttonStyle="default slim"
                    onClick={() => copyToClipboard(swatch.name)}
                    marginBottom0
                  >
                    <Icon icon="clipboard">Copy</Icon>
                  </Button>
                  {copiedName === swatch.name && <span className={css.copiedMessage}>Copied!</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
