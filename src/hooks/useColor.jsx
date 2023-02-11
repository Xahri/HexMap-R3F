import { Color, MathUtils } from "three";

// Summer colors
export const colors = {
  Water: { // Ocean
    value: 0.21,
    color: "#00b9ff"
  },
  Shore: { // Sand
    value: 0.01,
    color: "#ffcc99"
  },
  Beach: { // Sunburn
    value: 0.04,
    color: "#ff9966"
  },
  Shrub: { // Palm
    value: 0.1,
    color: "#9ea548"
  },
  Forest: { // Jungle
    value: 0.29,
    color: "#586647"
  },
  Stone: { // Rock
    value: 0.36,
    color: "#666666"
  },
  Snow: { // Seashell
    value: 0.6,
    color: "#cccccc"
  }
}

// Winter colors
export const colorsW = {
  Water: {
    value: 0.21,
    color: "#A2BED2"
  },
  Shore: {
    value: 0.01,
    color: "#A6A9A0"
  },
  Beach: {
    value: 0.04,
    color: "#A5A79E"
  },
  Shrub: {
    value: 0.1,
    color: "#AEB0A8"
  },
  Forest: {
    value: 0.29,
    color: "#B9BEB6"
  },
  Stone: {
    value: 0.36,
    color: "#A3A3A3"
  },
  Snow: {
    value: 0.6,
    color: "white"
  }
}

export default function useColor() {
  
  let color;

  return (height, season, isSide = false) => {

    if(season === "Summer" && !isSide){

      color = (() => {
        if (height <= colors.Water.value) {
          return new Color(colors.Water.color);
        } else if (height <= colors.Water.value + colors.Shore.value) {
          return new Color(colors.Shore.color);
        } else if (height <= colors.Water.value + colors.Beach.value) {
          return new Color(colors.Beach.color);
        } else if (height <= colors.Water.value + colors.Shrub.value) {
          return new Color(colors.Shrub.color);
        } else if (height <= colors.Water.value + colors.Forest.value) {
          return new Color(colors.Forest.color);
        } else if (height <= colors.Water.value + colors.Stone.value) {
          return new Color(colors.Stone.color);
        } else {
          return new Color(colors.Snow.color);
        }
      })();
    }

    else if(season === "Winter" && !isSide){

      color = (() => {
        if (height <= colorsW.Water.value) {
          return new Color(colorsW.Water.color);
        } else if (height <= colorsW.Water.value + colorsW.Shore.value) {
          return new Color(colorsW.Shore.color);
        } else if (height <= colorsW.Water.value + colorsW.Beach.value) {
          return new Color(colorsW.Beach.color);
        } else if (height <= colorsW.Water.value + colorsW.Shrub.value) {
          return new Color(colorsW.Shrub.color);
        } else if (height <= colorsW.Water.value + colorsW.Forest.value) {
          return new Color(colorsW.Forest.color);
        } else if (height <= colorsW.Water.value + colorsW.Stone.value) {
          return new Color(colorsW.Stone.color);
        } else {
          return new Color(colorsW.Snow.color);
        }
      })();
    }

    else{ // isSide
      return new Color("grey");
    }

    let initialHSL = { h: 0, s: 1, l: 1 }; // Define the initial hue, saturation, and lightness values of the color
    const currentHSL = color.getHSL(initialHSL); // Get the current hue, saturation, and lightness values of the color

    const colorValues = (one, value, modifier, satMult) => {
      // Calculate the lightness modifier based on the height difference between the water and the height
      let lightnessModifier = MathUtils.mapLinear(
        // Raise the difference to the power of 6 and subtract it from 1 to get the lightness value
        Math.pow(one - (value - height) * 1.3, 6) + modifier,
        // Map the lightness value to the range of 0 to 1.4
        0,
        1,
        0,
        1.4
      );
      // Set the hue, saturation, and lightness values of the color, with the lightness value being multiplied by the lightness modifier
      color.setHSL(currentHSL.h, currentHSL.s * satMult, currentHSL.l * lightnessModifier);
    }
  
  
    if (height <= colors.Water.value) {
      colorValues(1, colors.Water.value, 0, 1.7);
    }
    else if (height <= colors.Water.value + colors.Forest.value && height >= colors.Water.value + colors.Shrub.value) {
      colorValues(-1, colors.Forest.value, Math.random() * (0.8 - 0.6) + 0.6, 1.2);
    }
    else if (height <= colors.Water.value + colors.Shrub.value && height >= colors.Water.value + colors.Beach.value) {
      colorValues(-1, colors.Shrub.value, Math.random() * (0.6 - 0.4) + 0.4, 1.8);
    }
    else if (height <= colors.Water.value + colors.Beach.value && height >= colors.Water.value + colors.Shore.value) {
      colorValues(-1, colors.Beach.value, Math.random() * (0.65 - 0.6) + 0.6, 1.8);
    }
    else {
      color.setHSL(currentHSL.h, currentHSL.s * 1.7, currentHSL.l);
    }

    return color;
  };
}