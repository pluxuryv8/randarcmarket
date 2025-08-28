import { toHttp } from '../media';

describe('toHttp', () => {
  it('ipfs:// -> https', () => {
    expect(toHttp('ipfs://QmHash/file.png')).toMatch(/^https:\/\/.*\/QmHash\/file.png$/);
  });
  it('// -> https://', () => {
    expect(toHttp('//cdn.example.com/a.png')).toBe('https://cdn.example.com/a.png');
  });
  it('http:// -> https://', () => {
    expect(toHttp('http://a.com/x')).toBe('https://a.com/x');
  });
  it('relative -> undefined', () => {
    expect(toHttp('/x.png')).toBeUndefined();
  });
});
