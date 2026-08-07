import React, { useEffect, useMemo, useState } from 'react';
import Button from '../../../lib/Button';
import Icon from '../../../lib/Icon';
import Select from '../../../lib/Select';

import {
  discoverColorVariables,
  resolveCssVarColor,
  flattenOnBackground,
  relativeLuminance,
  contrastRatio,
  toHex,
  toRgbaString,
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

const SORTS = [
  { value: 'alpha', label: 'Alpha' },
  { value: 'luminance', label: 'Luminance' },
  { value: 'luminance-reversed', label: 'Luminance (reversed)' },
];

const SORT_COMPARATORS = {
  alpha: (a, b) => a.name.localeCompare(b.name),
  luminance: (a, b) => relativeLuminance(a.rgb) - relativeLuminance(b.rgb),
  'luminance-reversed': (a, b) => relativeLuminance(b.rgb) - relativeLuminance(a.rgb),
};

export default function SwatchGrid() {
  const [swatches, setSwatches] = useState([]);
  const [activeName, setActiveName] = useState('--bg');
  const [copiedName, setCopiedName] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('alpha');

  useEffect(() => {
    const resolved = discoverColorVariables().map((name) => {
      const rgba = resolveCssVarColor(name);
      const rgb = flattenOnBackground(rgba, WHITE);
      return { name, rgba, rgb, hex: toHex(rgb) };
    });
    setSwatches(resolved);
  }, []);

  const active = swatches.find((s) => s.name === activeName) || swatches[0];
  const systemBg = swatches.find((s) => s.name === '--bg') || active;

  const copyToClipboard = (name) => {
    navigator.clipboard.writeText(`var(${name})`).then(() => {
      setCopiedName(name);
      setTimeout(() => setCopiedName((current) => (current === name ? null : current)), COPIED_MESSAGE_DURATION);
    });
  };

  const swatchesWithRatio = useMemo(() => swatches.map((swatch) => {
    // The rating reflects what actually shows up on screen: the row's own (possibly
    // translucent) color composited over the chosen comparison color, not the row's
    // color pre-flattened against white.
    const composited = active ? flattenOnBackground(swatch.rgba, active.rgb) : swatch.rgb;
    const ratio = active ? contrastRatio(composited, active.rgb) : null;
    const pass = ratio !== null && ratio >= AA_NORMAL_TEXT;
    return { ...swatch, ratio, pass };
  }), [swatches, active]);

  const visibleSwatches = useMemo(() => swatchesWithRatio
    .filter((swatch) => {
      if (filter === 'passing') return swatch.pass;
      if (filter === 'failing') return !swatch.pass;
      return true;
    })
    .sort(SORT_COMPARATORS[sortBy]), [swatchesWithRatio, filter, sortBy]);

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
            <strong>Comparing against <code>{activeName}</code></strong>
            {active && <span> ({active.hex})</span>}
            <br />&quot;Compare&quot; will let you to compare every swatch against the chosen color.
            <br />&quot;Copy&quot; to copy its variable for use in your own module's styles.
          </p>
        </div>
        <div className={css.filterRow}>
          <Select
            marginBottom0
            id="swatchFilter"
            label="Show:"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {FILTERS.map(({ value, label }) => (
              <option
                key={value}
                value={value}
              >
                {label}
              </option>
            ))}
          </Select>
          <Select
            marginBottom0
            id="swatchSort"
            label="Sort by:"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {SORTS.map(({ value, label }) => (
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
          <div className={css.swatchHeaderRow}>
            <span className={css.swatchHeaderCell}>Color, variable name</span>
            <span className={css.swatchHeaderCell}><div>Comparison</div><div>Chosen | Over-chosen</div></span>
            <span className={css.swatchHeaderCell}>CSS value</span>
            <span className={css.swatchHeaderCell}>Flattened hex</span>
            <span className={css.swatchHeaderCell}>Contrast rating</span>
            <span className={css.swatchHeaderCell}>Actions</span>
          </div>
          {visibleSwatches.map(({ ratio, pass, ...swatch }) => {
            const isActive = swatch.name === activeName;
            const swatchRow = `${css.swatchRow} ${isActive ? css.swatchRowActive : ''}`;
            return (
              <div key={swatch.name} className={swatchRow}>
                <span className={`${css.swatchRowCell} ${css.swatchName}`}>
                  <span className={css.swatchColorSystem}>
                    <span
                      className={css.swatchColorPartBg}
                      style={{ backgroundColor: systemBg ? systemBg.hex : swatch.hex }}
                    />
                    <span
                      className={css.swatchColorPartOverlay}
                      style={{ backgroundColor: toRgbaString(swatch.rgba) }}
                    />
                  </span>
                  {swatch.name}
                </span>
                <span className={css.swatchRowCell}>
                  <span className={css.swatchColor}>
                    <span
                      className={css.swatchColorPart}
                      style={{ backgroundColor: active ? active.hex : swatch.hex }}
                    >
                      <span
                        className={css.swatchColorSample}
                        style={{ color: toRgbaString(swatch.rgba) }}
                      >
                        Ag
                      </span>
                    </span>
                    <span className={css.swatchColorPart}>
                      <span
                        className={css.swatchColorPartBg}
                        style={{ backgroundColor: active ? active.hex : swatch.hex }}
                      />
                      <span
                        className={css.swatchColorPartOverlay}
                        style={{ backgroundColor: toRgbaString(swatch.rgba) }}
                      />
                    </span>
                  </span>

                </span>

                <span
                  className={`${css.swatchRowCell} ${css.swatchCssValue}`}
                  style={{ color: 'var(--color-text)' }}
                >
                  {toRgbaString(swatch.rgba)}
                </span>
                <span
                  className={`${css.swatchRowCell} ${css.swatchFlattenedHex}`}
                  style={{ color: 'var(--color-text)' }}
                >
                  {swatch.hex}
                </span>
                <span className={`${css.swatchRowCell}`}>
                  <span className={`${css.swatchRowCell} ${css.swatchRatio} ${ratio !== null ? (pass ? css.pass : css.fail) : ''}`}>
                    {ratio !== null && `${ratio.toFixed(2)}:1 — ${pass ? 'PASS' : 'FAIL'}`}
                  </span>
                </span>
                <div className={`${css.swatchRowCell} ${css.swatchActions}`}>
                  <Button
                    buttonStyle="default slim"
                    disabled={isActive}
                    onClick={() => setActiveName(swatch.name)}
                    marginBottom0
                  >
                    Compare
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
