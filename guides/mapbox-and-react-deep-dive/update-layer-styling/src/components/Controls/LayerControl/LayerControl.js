import {
  Checkbox,
  FormGroup,
  FormControlLabel,
  List,
  ListItem,
  Paper,
} from "@mui/material";
import s from "./LayerControl.module.css";

export const LayerControl = ({ layers, onToggle }) => {
  return (
    <Paper className={s.layerControlRoot}>
      <List>
        <FormGroup>
          {layers.map((layer) => (
            <ListItem key={layer.id}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={layer?.layout?.visibility === "visible"}
                    onChange={(event) =>
                      onToggle(layer.id, event.target.checked)
                    }
                  />
                }
                label={layer.name}
              />
            </ListItem>
          ))}
        </FormGroup>
      </List>
    </Paper>
  );
};
