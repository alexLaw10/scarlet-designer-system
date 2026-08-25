import { newSpecPage } from '@stencil/core/testing';
import { ScarletAvatarGroup } from './scarlet-avatar-group';
import { ScarletAvatar } from '@/components/data-display/scarlet-avatar/scarlet-avatar';

describe('scarlet-avatar-group', () => {
  it('propagates size to every child avatar', async () => {
    const page = await newSpecPage({
      components: [ScarletAvatarGroup, ScarletAvatar],
      html: `
        <scarlet-avatar-group size="lg">
          <scarlet-avatar name="Ana Souza"></scarlet-avatar>
          <scarlet-avatar name="Bruno Lima"></scarlet-avatar>
        </scarlet-avatar-group>
      `
    });
    await page.waitForChanges();

    const avatars = Array.from(page.root!.querySelectorAll('scarlet-avatar')) as any[];
    expect(avatars.every(avatar => avatar.size === 'lg')).toBe(true);
  });

  it('shows no overflow indicator when max is unset or not exceeded', async () => {
    const page = await newSpecPage({
      components: [ScarletAvatarGroup, ScarletAvatar],
      html: `
        <scarlet-avatar-group max="5">
          <scarlet-avatar name="Ana Souza"></scarlet-avatar>
          <scarlet-avatar name="Bruno Lima"></scarlet-avatar>
        </scarlet-avatar-group>
      `
    });
    await page.waitForChanges();

    expect(page.root!.shadowRoot!.querySelector('.scarlet-avatar-group__overflow')).toBeNull();
  });

  it('hides avatars past max and shows the overflow count', async () => {
    const page = await newSpecPage({
      components: [ScarletAvatarGroup, ScarletAvatar],
      html: `
        <scarlet-avatar-group max="2">
          <scarlet-avatar name="Ana Souza"></scarlet-avatar>
          <scarlet-avatar name="Bruno Lima"></scarlet-avatar>
          <scarlet-avatar name="Carla Nunes"></scarlet-avatar>
          <scarlet-avatar name="Diego Alves"></scarlet-avatar>
        </scarlet-avatar-group>
      `
    });
    await page.waitForChanges();

    const avatars = Array.from(page.root!.querySelectorAll('scarlet-avatar'));
    expect(avatars.map(avatar => avatar.hasAttribute('hidden'))).toEqual([
      false,
      false,
      true,
      true
    ]);

    const overflow = page.root!.shadowRoot!.querySelector('.scarlet-avatar-group__overflow');
    expect(overflow?.textContent?.trim()).toBe('+2');
  });
});
