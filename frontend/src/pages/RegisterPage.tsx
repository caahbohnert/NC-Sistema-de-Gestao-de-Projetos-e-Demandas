import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Link,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { useAuthService } from '../services/authService';

export function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { register } = useAuthService();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleRegister() {
    try {
        if (!nome || !email || !senha) {
          alert('Preencha os campos obrigatórios.');
          return;
        }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        alert("Digite um e-mail válido.");
        return;
      }

      if (senha !== confirmPassword) {
        alert('As senhas não coincidem.');
        return;
      }

      if (senha.length < 6) {
        alert('A senha deve ter no mínimo 6 caracteres.');
        return;
      }

      await register({ nome, email, senha });
      await login(email, senha);

      navigate('/dashboard');
    } catch (err: any) {
      const message =
        err?.response?.data?.message || 'Erro inesperado ao criar conta.';

      alert(message);
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5',
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, width: 360 }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Criar conta
        </Typography>

        <Typography variant="body2" mb={3} color="text.secondary">
          Leva menos de 1 minuto 🚀
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Nome"
            fullWidth
            value={nome}
            required
            onChange={(e) => setNome(e.target.value)}
          />

          <TextField
            label="E-mail"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Senha"
            type={showSenha ? 'text' : 'password'}
            fullWidth
            value={senha}
            required
            onChange={(e) => setSenha(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowSenha((v) => !v)}
                    edge="end"
                  >
                    {showSenha ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Confirmar senha"
            type={showConfirm ? 'text' : 'password'}
            fullWidth
            value={confirmPassword}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirm((v) => !v)}
                    edge="end"
                  >
                    {showConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button variant="contained" size="large" onClick={handleRegister}>
            Criar conta
          </Button>

          <Typography variant="body2" textAlign="center">
            Já possui conta?{' '}
            <Link component="button" onClick={() => navigate('/')}>
              Entrar
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
