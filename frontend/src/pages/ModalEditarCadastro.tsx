import { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { useAuthService } from '../services/authService';
import { useAuth } from '../context/authContext';

interface Props {
  open: boolean;
  onClose: () => void;
  usuario: { id: string; name: string; email: string } | null;
  onAtualizado?: (novoNome: string) => void;
}

export function ModalEditarCadastro({
  open,
  onClose,
  usuario,
  onAtualizado,
}: Props) {
  const { atualizarCadastro } = useAuthService();
  const { setUser } = useAuth();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (usuario) {
      setNome(usuario.name);
      setEmail(usuario.email);
      setSenha('');
      setErro(null);
    }
  }, [usuario, open]);

  async function handleSalvar() {
    if (!usuario) return;

    if (!nome.trim()) {
      setErro('O nome não pode ficar em branco.');
      return;
    }
    if (!email.trim()) {
      setErro('O e-mail não pode ficar em branco.');
      return;
    }

    setLoading(true);
    setErro(null);
    try {
      const dto: Record<string, string> = { nome, email };
      if (senha) dto.senha = senha;
      await atualizarCadastro(usuario.id, dto);

      setUser((prev) => (prev ? { ...prev, name: nome, email } : prev));
      onAtualizado?.(nome);
      onClose();
    } catch {
      setErro('Não foi possível atualizar o cadastro.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle
        sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}
      >
        <Avatar
          sx={{ width: 36, height: 36, fontSize: 14, bgcolor: 'primary.main' }}
        >
          {nome?.[0]?.toUpperCase() ?? 'U'}
        </Avatar>
        <Box>
          <Typography fontWeight={600} fontSize={15}>
            Editar cadastro
          </Typography>
          <Typography fontSize={12} color="text.secondary">
            Atualize suas informações
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          pt: '12px !important',
        }}
      >
        <TextField
          label="Nome"
          size="small"
          fullWidth
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <TextField
          label="E-mail"
          type="email"
          size="small"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Nova senha"
          type="password"
          size="small"
          fullWidth
          placeholder="Deixe em branco para não alterar"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        {erro && (
          <Typography fontSize={12} color="error">
            {erro}
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button size="small" onClick={onClose} sx={{ textTransform: 'none' }}>
          Cancelar
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={handleSalvar}
          disabled={loading}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          {loading ? 'Salvando...' : 'Salvar alterações'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
