import { Box, Paper, Typography } from "@mui/material";
import s from "./StyleControl.module.css";

const Colors = [
  { name: "Red", value: "hsla(342, 73%, 66%, .51)" },
  { name: "Purple", value: "hsla(263, 73%, 66%, .51)" },
  { name: "Teal", value: "hsla(167, 75%, 43%, .51)" },
];

const ColorControl = ({ active, color, onStyleChange }) => {
  const { name, value } = color;
  return (
    <div>
      <Typography variant="body1">{name}</Typography>
      <Box
        className={active ? s.colorBoxActive : s.colorBox}
        onClick={onStyleChange}
        sx={{ backgroundColor: value }}
      />
    </div>
  );
};

export const StyleControl = ({ layer, onStyleChange, title }) => {
  return (
    <Paper className={s.styleControlRoot}>
      <Typography variant="h6">{title}</Typography>
      <div className={s.colorControl}>
        {Colors.map((color) => {
          return (
            <ColorControl
              key={color.name}
              active={layer?.paint?.["fill-color"] === color.value}
              color={color}
              onStyleChange={() =>
                onStyleChange(layer.id, "fill-color", color.value)
              }
            />
          );
        })}
      </div>
    </Paper>
  );
};
