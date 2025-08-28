import * as THREE from 'three';

export function loadTexture(path) {
  const texture = new THREE.TextureLoader().load(path);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export const roomTextureMap = {
  bedroom: '/textures/4.jpg',
  kitchen: '/textures/7.jpg',
  bathroom: '/textures/9.jpg',
  livingroom: '/textures/6.jpg',
  lawn: '/textures/grass.jpg',
  balcony: '/textures/5.jpg',
  garage: '/textures/2.jpg',
  washroom: '/textures/1.jpg',
  study: '/textures/8.jpg',
  default: '/textures/4.jpg',
};
