import { Coordinates, Ship } from 'app/utils/commands-types';
import { MatrixError } from '../../app/utils/errors';

export class Field {
  matrix: Cell[][];

  constructor(ships: Ship[]) {
    this.matrix = transformShipsToMatrix(ships);
  }

  attack({ x, y }: Coordinates): boolean {
    const cell = this.matrix[y]?.[x];
    if (!cell) throw new MatrixError();
    return cell.isShip;
  }
}

type Cell = {
  isShip: boolean;
  isShot: boolean;
};

function transformShipsToMatrix(ships: Ship[]) {
  const matrix: Cell[][] = Array(10)
    .fill(null)
    .map(() =>
      Array(10)
        .fill(null)
        .map(() => ({ isShip: false, isShot: false })),
    );

  ships.forEach(({ position: { x, y }, length, direction: isVertical }) => {
    for (
      let i = x, j = y;
      isVertical ? j < y + length : i < x + length;
      isVertical ? j++ : i++
    ) {
      const cell = matrix[j]?.[i];
      if (!cell) throw new MatrixError();
      cell.isShip = true;
    }
  });
  return matrix;
}
