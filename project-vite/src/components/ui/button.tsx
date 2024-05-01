import { styles } from "../../config/project";
import { FormButton, FormButtonProps } from "@rhf-kit/mui";

export const Button = ({ children, ...props }: FormButtonProps) => {
  return (
    <FormButton
      variant="contained"
      sx={{
        background: styles.primaryColor,
        ":hover": {
          brightness: 0.9,
        },
        fontWeight: "bold",
      }}
      {...props}
    >
      {children}
    </FormButton>
  );
};

export default Button;
