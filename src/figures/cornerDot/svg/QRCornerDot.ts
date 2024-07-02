import cornerDotTypes from "../../../constants/cornerDotTypes";
import { CornerDotType, RotateFigureArgs, BasicFigureDrawArgs, DrawArgs } from "../../../types";

export default class QRCornerDot {
  _svg: SVGElement;
  _type: CornerDotType;

  constructor({ svg, type }: { svg: SVGElement; type: CornerDotType }) {
    this._svg = svg;
    this._type = type;
  }

  draw(x: number, y: number, size: number, rotation: number): void {
    const type = this._type;
    let drawFunction;

    switch (type) {
      case cornerDotTypes.square:
        drawFunction = this._drawSquare;
        break;
      case cornerDotTypes.star:
        drawFunction = this._drawStar;
        break;
      case cornerDotTypes.squareRounded:
        drawFunction = this._drawSquareRounded;
        break;
      case cornerDotTypes.plus:
        drawFunction = this._drawPlus;
        break;
      case cornerDotTypes.squareLeftTop:
        drawFunction = this._drawSquareLeftExtended;
        break;
      case cornerDotTypes.leftTopCircle:
        drawFunction = this._drawCircleLeftTopEdge;
        break;
      case cornerDotTypes.dot:
      default:
        drawFunction = this._drawDot;
    }

    drawFunction.call(this, { x, y, size, rotation });
  }

  _rotateFigure({ x, y, size, rotation = 0, draw }: RotateFigureArgs): void {
    const cx = x + size / 2;
    const cy = y + size / 2;

    draw();
    if (rotation) {
      this._svg.lastChild?.setAttribute("transform", `rotate(${(180 * rotation) / Math.PI},${cx},${cy})`);
    }
  }

  _basicDot(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", String(x + size / 2));
        circle.setAttribute("cy", String(y + size / 2));
        circle.setAttribute("r", String(size / 2));
        this._svg.appendChild(circle);
      }
    });
  }

  _basicSquare(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", String(x));
        rect.setAttribute("y", String(y));
        rect.setAttribute("width", String(size));
        rect.setAttribute("height", String(size));
        this._svg.appendChild(rect);
      }
    });
  }

  _basicRoundedSquare(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const radius = size / 5; // Adjust the radius as needed

    this._rotateFigure({
      ...args,
      draw: () => {
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", String(x));
        rect.setAttribute("y", String(y));
        rect.setAttribute("width", String(size));
        rect.setAttribute("height", String(size));
        rect.setAttribute("rx", String(radius));
        rect.setAttribute("ry", String(radius));
        this._svg.appendChild(rect);
      }
    });
  }

  _basicExtendedSquare(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const extension = size / 4; // Adjust the extension as needed
    const cornerRadius = size / 10; // Adjust the corner radius as needed

    this._rotateFigure({
      ...args,
      draw: () => {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const d = `
                M ${x - size / 2.2 - extension},${y - size / 2.2 - extension}  // Move to the top left corner
                L ${x + size / 2.2},${y - size / 2.2}  // Draw top edge
                L ${x + size / 2.2},${y + size / 2.2}  // Draw right edge
                L ${x - size / 2.2},${y + size / 2.2}  // Draw bottom edge
                A ${cornerRadius},${cornerRadius} 0 0 1 ${x - size / 2.2 - extension + cornerRadius},${
          y - size / 2.2 + cornerRadius
        }  // Draw rounded left top corner
                Z  // Close the path
            `;
        path.setAttribute("d", d);
        this._svg.appendChild(path);
      }
    });
  }

  _basicCircleLeftTopEdge(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const radius = size / 2;

    this._rotateFigure({
      ...args,
      draw: () => {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", String(x - radius)); // Adjusted center to make left top edge
        circle.setAttribute("cy", String(y - radius)); // Adjusted center to make left top edge
        circle.setAttribute("r", String(radius));
        this._svg.appendChild(circle);
      }
    });
  }

  // _basicExtendedSquare(args: BasicFigureDrawArgs): void {
  //   const { size, x, y } = args;
  //   const extension = size / 6;  // Adjust the extension as needed

  //   this._rotateFigure({
  //     ...args,
  //     draw: () => {
  //       const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  //       rect.setAttribute("x", String(x - extension));
  //       rect.setAttribute("y", String(y - extension));
  //       rect.setAttribute("width", String(size + extension));
  //       rect.setAttribute("height", String(size + extension));
  //       this._svg.appendChild(rect);
  //     }
  //   });
  // }

  _basicStar(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    const numPoints = 5;
    const outerRadius = size / 2;
    const innerRadius = outerRadius / 2.5;
    const step = Math.PI / numPoints;

    this._rotateFigure({
      ...args,
      draw: () => {
        const points = [];
        for (let i = 0; i < 2 * numPoints; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = i * step;
          const px = x + size / 2 + radius * Math.cos(angle);
          const py = y + size / 2 + radius * Math.sin(angle);
          points.push(`${px},${py}`);
        }

        const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        polygon.setAttribute("points", points.join(" "));
        this._svg.appendChild(polygon);
      }
    });
  }

  _basicPlus(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    const thickness = size / 5;
    const halfThickness = thickness / 2;
    const halfSize = size / 2;

    this._rotateFigure({
      ...args,
      draw: () => {
        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");

        const verticalRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        verticalRect.setAttribute("x", String(x + halfSize - halfThickness));
        verticalRect.setAttribute("y", String(y));
        verticalRect.setAttribute("width", String(thickness));
        verticalRect.setAttribute("height", String(size));
        group.appendChild(verticalRect);

        const horizontalRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        horizontalRect.setAttribute("x", String(x));
        horizontalRect.setAttribute("y", String(y + halfSize - halfThickness));
        horizontalRect.setAttribute("width", String(size));
        horizontalRect.setAttribute("height", String(thickness));
        group.appendChild(horizontalRect);

        this._svg.appendChild(group);
      }
    });
  }

  _drawDot({ x, y, size, rotation }: DrawArgs): void {
    this._basicDot({ x, y, size, rotation });
  }

  _drawSquare({ x, y, size, rotation }: DrawArgs): void {
    this._basicSquare({ x, y, size, rotation });
  }

  _drawStar({ x, y, size, rotation }: DrawArgs): void {
    this._basicStar({ x, y, size, rotation });
  }

  _drawPlus({ x, y, size, rotation }: DrawArgs): void {
    this._basicPlus({ x, y, size, rotation });
  }

  _drawSquareRounded({ x, y, size, rotation }: DrawArgs): void {
    this._basicRoundedSquare({ x, y, size, rotation });
  }

  _drawSquareLeftExtended({ x, y, size, rotation }: DrawArgs): void {
    this._basicExtendedSquare({ x, y, size, rotation });
  }

  _drawCircleLeftTopEdge({ x, y, size, context, rotation }: DrawArgsCanvas): void {
    this._basicCircleLeftTopEdge({ x, y, size, context, rotation });
  }
}
