import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'https://skin-health-three.vercel.app/',
  pretendToBeVisual: true,
  resources: 'usable',
});

Object.defineProperty(global, 'window', {
  value: dom.window,
  writable: true,
  configurable: true,
});
Object.defineProperty(global, 'document', {
  value: dom.window.document,
  writable: true,
  configurable: true,
});
Object.defineProperty(global, 'navigator', {
  value: dom.window.navigator,
  writable: true,
  configurable: true,
});
Object.defineProperty(global, 'HTMLElement', {
  value: dom.window.HTMLElement,
  writable: true,
  configurable: true,
});
Object.defineProperty(global, 'Element', {
  value: dom.window.Element,
  writable: true,
  configurable: true,
});
Object.defineProperty(global, 'Node', {
  value: dom.window.Node,
  writable: true,
  configurable: true,
});
Object.defineProperty(global, 'Event', {
  value: dom.window.Event,
  writable: true,
  configurable: true,
});
Object.defineProperty(global, 'CustomEvent', {
  value: dom.window.CustomEvent,
  writable: true,
  configurable: true,
});
Object.defineProperty(global, 'localStorage', {
  value: dom.window.localStorage,
  writable: true,
  configurable: true,
});
Object.defineProperty(global, 'sessionStorage', {
  value: dom.window.sessionStorage,
  writable: true,
  configurable: true,
});
global.requestAnimationFrame = (cb) => setTimeout(cb, 16);
global.cancelAnimationFrame = (id) => clearTimeout(id);