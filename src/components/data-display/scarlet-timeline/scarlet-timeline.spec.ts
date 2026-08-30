import { newSpecPage } from '@stencil/core/testing';
import { ScarletTimeline } from './scarlet-timeline';

describe('scarlet-timeline', () => {
  it('renders one item per entry, with title/timestamp/description', async () => {
    const page = await newSpecPage({
      components: [ScarletTimeline],
      html: '<scarlet-timeline></scarlet-timeline>'
    });
    page.rootInstance.items = [
      { title: 'Pedido realizado', timestamp: '12/08', description: 'Recebemos seu pedido.' }
    ];
    await page.waitForChanges();

    const item = page.root!.shadowRoot!.querySelector('.scarlet-timeline__item')!;
    expect(item.querySelector('.scarlet-timeline__title')?.textContent?.trim()).toBe(
      'Pedido realizado'
    );
    expect(item.querySelector('.scarlet-timeline__timestamp')?.textContent?.trim()).toBe('12/08');
    expect(item.querySelector('.scarlet-timeline__description')?.textContent?.trim()).toBe(
      'Recebemos seu pedido.'
    );
  });

  it('defaults the marker status to "default" and reflects a custom status', async () => {
    const page = await newSpecPage({
      components: [ScarletTimeline],
      html: '<scarlet-timeline></scarlet-timeline>'
    });
    page.rootInstance.items = [{ title: 'A' }, { title: 'B', status: 'success' }];
    await page.waitForChanges();

    const markers = page.root!.shadowRoot!.querySelectorAll('.scarlet-timeline__marker');
    expect(markers[0].classList.contains('scarlet-timeline__marker--default')).toBe(true);
    expect(markers[1].classList.contains('scarlet-timeline__marker--success')).toBe(true);
  });

  it('draws a connecting line between items but not after the last one', async () => {
    const page = await newSpecPage({
      components: [ScarletTimeline],
      html: '<scarlet-timeline></scarlet-timeline>'
    });
    page.rootInstance.items = [{ title: 'A' }, { title: 'B' }, { title: 'C' }];
    await page.waitForChanges();

    expect(page.root!.shadowRoot!.querySelectorAll('.scarlet-timeline__line').length).toBe(2);
  });
});
