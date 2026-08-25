import { newSpecPage } from '@stencil/core/testing';
import { ScarletStat } from './scarlet-stat';

describe('scarlet-stat', () => {
  it('renders label and value', async () => {
    const page = await newSpecPage({
      components: [ScarletStat],
      html: '<scarlet-stat label="Receita" value="R$ 100"></scarlet-stat>'
    });

    expect(page.root?.shadowRoot?.querySelector('.scarlet-stat__label')?.textContent?.trim()).toBe(
      'Receita'
    );
    expect(page.root?.shadowRoot?.querySelector('.scarlet-stat__value')?.textContent?.trim()).toBe(
      'R$ 100'
    );
  });

  it('hides the change row entirely when change is unset', async () => {
    const page = await newSpecPage({
      components: [ScarletStat],
      html: '<scarlet-stat label="Receita" value="R$ 100"></scarlet-stat>'
    });

    expect(page.root?.shadowRoot?.querySelector('.scarlet-stat__change')).toBeNull();
  });

  it('shows an arrow icon for up/down trends but not for neutral', async () => {
    const up = await newSpecPage({
      components: [ScarletStat],
      html: '<scarlet-stat change="+12%" trend="up"></scarlet-stat>'
    });
    expect(up.root?.shadowRoot?.querySelector('scarlet-icon')).not.toBeNull();

    const neutral = await newSpecPage({
      components: [ScarletStat],
      html: '<scarlet-stat change="Estável" trend="neutral"></scarlet-stat>'
    });
    expect(neutral.root?.shadowRoot?.querySelector('scarlet-icon')).toBeNull();
  });

  it('applies the trend modifier class', async () => {
    const page = await newSpecPage({
      components: [ScarletStat],
      html: '<scarlet-stat change="-4%" trend="down"></scarlet-stat>'
    });

    expect(page.root?.shadowRoot?.querySelector('.scarlet-stat__change--down')).not.toBeNull();
  });
});
