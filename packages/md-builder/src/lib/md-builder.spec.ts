import { mdBuilder } from './md-builder';

describe('mdBuilder', (): void => {
  it('should work', (): void => {
    expect.hasAssertions();
    expect(mdBuilder()).toBe('md-builder');
  });
});
