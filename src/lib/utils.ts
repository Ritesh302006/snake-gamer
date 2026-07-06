import { Point, Direction } from '../types';
import { GRID_SIZE } from '../constants';

export const getRandomFoodPosition = (snake: Point[]): Point => {
  let newFood: Point;
  let isOccupied = true;
  while (isOccupied) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    isOccupied = snake.some(
      (segment) => segment.x === newFood.x && segment.y === newFood.y
    );
  }
  return newFood!;
};

export const checkCollision = (head: Point, snakeBody: Point[]): boolean => {
  // Wall collision
  if (
    head.x < 0 ||
    head.x >= GRID_SIZE ||
    head.y < 0 ||
    head.y >= GRID_SIZE
  ) {
    return true;
  }
  
  // Self collision
  for (let i = 1; i < snakeBody.length; i++) {
    if (head.x === snakeBody[i].x && head.y === snakeBody[i].y) {
      return true;
    }
  }
  return false;
};
