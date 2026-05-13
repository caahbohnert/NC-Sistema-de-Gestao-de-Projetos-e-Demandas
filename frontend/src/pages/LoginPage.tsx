import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Link,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

async function handleLogin() {
  if (!email || !password) {
    alert("Preencha os campos obrigatórios.");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    alert("Digite um e-mail válido.");
    return;
  }

  await login(email, password);
  navigate("/dashboard");
}

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f0f4f8",
        px: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 5,
          width: "100%",
          maxWidth: 420,
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" fontWeight={700} mb={1}>
          Entrar
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Bem-vindo de volta 👋
        </Typography>

        <TextField
          label="E-mail"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Senha"
          type={showPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword((v) => !v)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleLogin}
          sx={{ mt: 3, mb: 2, borderRadius: 2 }}
        >
          Entrar
        </Button>

        <Typography variant="body2" textAlign="center" color="text.secondary">
          Não tem conta?{" "}
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate("/register")}
          >
            Criar conta
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}