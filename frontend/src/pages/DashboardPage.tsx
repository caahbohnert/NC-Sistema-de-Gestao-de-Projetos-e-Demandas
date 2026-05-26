import { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Skeleton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Add, Edit, FolderOpen, Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { projetoService, tarefaService } from '../services/dashboardservice';
import { api } from '../services/api';
import type { Projeto, Status, Tarefa } from '../types';
import { ListaTarefas } from './ListarTarefas';
import { ModalNovoProjeto } from './NovoProjeto';
import { ModalNovaTarefa } from './NovaTarefa';
import { ModalEditarTarefa } from './EditarTarefa';
import { ModalDetalhesTarefa } from './DetalharTarefas';

export function DashboardPage() {
  const { logout, user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [projetoAtivo, setProjetoAtivo] = useState<Projeto | null>(null);
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [loadingProjetos, setLoadingProjetos] = useState(true);
  const [loadingTarefas, setLoadingTarefas] = useState(false);

  const [modalProjeto, setModalProjeto] = useState(false);
  const [modalTarefa, setModalTarefa] = useState(false);
  const [projetoEmEdicao, setProjetoEmEdicao] = useState<Projeto | null>(null);

  const [anchorUser, setAnchorUser] = useState<null | HTMLElement>(null);

  const [modalEditar, setModalEditar] = useState(false);
  const [tarefaEdicao, setTarefaEdicao] = useState<Tarefa | null>(null);

  const [modalDetalhes, setModalDetalhes] = useState(false);
  const [tarefaDetalhes, setTarefaDetalhes] = useState<Tarefa | null>(null);

  const [modalEditarCadastro, setModalEditarCadastro] = useState(false);
  const [cadastroNome, setCadastroNome] = useState('');
  const [cadastroEmail, setCadastroEmail] = useState('');
  const [cadastroSenha, setCadastroSenha] = useState('');
  const [cadastroLoading, setCadastroLoading] = useState(false);
  const [cadastroErro, setCadastroErro] = useState<string | null>(null);

  useEffect(() => {
    projetoService.listar().then((data) => {
      setProjetos(data);
      if (data.length > 0) setProjetoAtivo(data[0]);
      setLoadingProjetos(false);
    });
  }, []);

  useEffect(() => {
    if (!projetoAtivo) return;
    setLoadingTarefas(true);
    tarefaService
      .listarPorProjeto(projetoAtivo.id)
      .then(setTarefas)
      .finally(() => setLoadingTarefas(false));
  }, [projetoAtivo]);

  function handleAbrirEditarCadastro() {
    setCadastroNome(user?.name ?? '');
    setCadastroEmail(user?.email ?? '');
    setCadastroSenha('');
    setCadastroErro(null);
    setModalEditarCadastro(true);
  }

  async function handleSalvarCadastro() {
    if (!user?.id) return;

    if (!cadastroNome.trim()) {
      setCadastroErro('O nome não pode ficar em branco.');
      return;
    }
    if (!cadastroEmail.trim()) {
      setCadastroErro('O e-mail não pode ficar em branco.');
      return;
    }

    setCadastroLoading(true);
    setCadastroErro(null);

    try {
      const dto: Record<string, string> = {
        nome: cadastroNome,
        email: cadastroEmail,
      };
      if (cadastroSenha) dto.senha = cadastroSenha;

      await api.put(`/usuarios/${user.id}`, dto);

      updateUser({ name: cadastroNome, email: cadastroEmail });
      setModalEditarCadastro(false);
    } catch {
      setCadastroErro('Não foi possível atualizar o cadastro.');
    } finally {
      setCadastroLoading(false);
    }
  }

  async function handleCriarProjeto(dto: {
    nome: string;
    descricao?: string;
    dataInicio: string;
    dataFim: string;
  }) {
    const novo = await projetoService.criar(dto);
    setProjetos((prev) => [...prev, novo]);
    setProjetoAtivo(novo);
    setModalProjeto(false);
  }

  async function handleCriarTarefa(dto: {
    titulo: string;
    descricao?: string;
    status: Status;
    prioridade: string;
    idResponsavel?: string;
  }) {
    if (!projetoAtivo) return;
    const nova = await tarefaService.criar({
      ...dto,
      idProjeto: projetoAtivo.id,
    });
    setTarefas((prev) => [...prev, nova]);
    setModalTarefa(false);
  }

  async function handleAtualizarProjeto(id: string, dto: {
    nome: string;
    descricao?: string;
    dataInicio: string;
    dataFim: string;
  }) {
    const atualizado = await projetoService.atualizar(id, dto);
    setProjetos((prev) => prev.map((p) => (p.id === id ? atualizado : p)));
    if (projetoAtivo?.id === id) {
      setProjetoAtivo(atualizado);
    }
    setModalProjeto(false);
    setProjetoEmEdicao(null);
  }

  function handleEditarProjeto(projeto: Projeto) {
    setProjetoEmEdicao(projeto);
    setModalProjeto(true);
  }

  function handleCriarProjeto(dto: {
    nome: string;
    descricao?: string;
    dataInicio: string;
    dataFim: string;
  }) {
    return projetoService.criar(dto).then((novo) => {
      setProjetos((prev) => [...prev, novo]);
      setProjetoAtivo(novo);
      setModalProjeto(false);
      setProjetoEmEdicao(null);
    });
  }

  async function handleMoverTarefa(id: string, status: Status) {
    const tarefaAtual = tarefas.find((t) => t.id === id);
    if (!tarefaAtual) return;
    const dto = { ...tarefaAtual, status };
    const atualizada = await tarefaService.atualizar(id, dto);
    setTarefas((prev) => prev.map((t) => (t.id === id ? atualizada : t)));
  }

  function handleEditarTarefa(tarefa: Tarefa) {
    setTarefaEdicao(tarefa);
    setModalEditar(true);
  }

  async function handleAtualizarTarefa(id: string, dto: any) {
    const atualizada = await tarefaService.atualizar(id, dto);
    setTarefas((prev) => prev.map((t) => (t.id === id ? atualizada : t)));
    setModalEditar(false);
  }

  function handleVerDetalhes(tarefa: Tarefa) {
    setTarefaDetalhes(tarefa);
    setModalDetalhes(true);
  }

  return (
    <Box
      sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}
    >
      <Box
        sx={{
          width: 240,
          flexShrink: 0,
          borderRight: 1,
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ px: 2.5, py: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography fontWeight={700} fontSize={16} color="primary">
            NC - Projetos e Demandas
          </Typography>
        </Box>

        <Box
          sx={{
            px: 2,
            pt: 2,
            pb: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            fontSize={11}
            fontWeight={600}
            color="text.secondary"
            textTransform="uppercase"
            letterSpacing={0.8}
          >
            Projetos
          </Typography>
          <Tooltip title="Novo projeto">
            <IconButton size="small" onClick={() => setModalProjeto(true)}>
              <Add fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <List dense sx={{ flex: 1, overflow: 'auto', px: 1 }}>
          {loadingProjetos
            ? [1, 2, 3].map((i) => (
                <Skeleton
                  key={i}
                  variant="rounded"
                  height={36}
                  sx={{ mb: 0.5 }}
                />
              ))
            : projetos.map((p) => (
                <ListItemButton
                  key={p.id}
                  selected={projetoAtivo?.id === p.id}
                  onClick={() => setProjetoAtivo(p)}
                  sx={{
                    borderRadius: 1,
                    mb: 0.3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <FolderOpen sx={{ fontSize: 16 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={p.nome}
                      primaryTypographyProps={{ fontSize: 13, noWrap: true }}
                    />
                  </Box>
                  {user?.id === p.idCriador && (
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditarProjeto(p);
                      }}
                      sx={{ ml: 0.5 }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  )}
                </ListItemButton>
              ))}

          {!loadingProjetos && projetos.length === 0 && (
            <Typography fontSize={12} color="text.disabled" px={1} py={2}>
              Nenhum projeto ainda.
            </Typography>
          )}
        </List>

        <Divider />
        <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Editar cadastro">
            <Avatar
              sx={{
                width: 30,
                height: 30,
                fontSize: 13,
                bgcolor: 'primary.main',
                cursor: 'pointer',
                '&:hover': { opacity: 0.85 },
              }}
              onClick={handleAbrirEditarCadastro}
            >
              {user?.name?.[0]?.toUpperCase() ?? 'U'}
            </Avatar>
          </Tooltip>
          <Typography
            fontSize={13}
            flex={1}
            noWrap
            sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
            onClick={handleAbrirEditarCadastro}
          >
            {user?.name ?? 'Usuário'}
          </Typography>
          <Tooltip title="Sair">
            <IconButton
              size="small"
              onClick={(e) => setAnchorUser(e.currentTarget)}
            >
              <Logout fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            bgcolor: 'background.paper',
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography fontWeight={700} fontSize={18}>
              {projetoAtivo?.nome ?? 'Selecione um projeto'}
            </Typography>
            {projetoAtivo?.descricao && (
              <Typography fontSize={13} color="text.secondary" mt={0.3}>
                {projetoAtivo.descricao}
              </Typography>
            )}
          </Box>
          {projetoAtivo && (
            <Button
              variant="contained"
              size="small"
              startIcon={<Add />}
              onClick={() => setModalTarefa(true)}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Nova Tarefa
            </Button>
          )}
        </Box>

        <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
          {!projetoAtivo ? (
            <Box sx={{ textAlign: 'center', mt: 10 }}>
              <Typography color="text.secondary" mb={2}>
                Selecione ou crie um projeto para começar.
              </Typography>
              <Button
                variant="outlined"
                onClick={() => setModalProjeto(true)}
                startIcon={<Add />}
              >
                Novo Projeto
              </Button>
            </Box>
          ) : (
            <ListaTarefas
              tarefas={tarefas}
              loading={loadingTarefas}
              onMover={handleMoverTarefa}
              onEditar={handleEditarTarefa}
              onVerDetalhes={handleVerDetalhes}
            />
          )}
        </Box>
      </Box>

      <Menu
        anchorEl={anchorUser}
        open={Boolean(anchorUser)}
        onClose={() => setAnchorUser(null)}
      >
        <MenuItem
          onClick={() => {
            logout();
            navigate('/login');
          }}
          sx={{ fontSize: 13 }}
        >
          Sair
        </MenuItem>
      </Menu>

      <Dialog
        open={modalEditarCadastro}
        onClose={() => setModalEditarCadastro(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle
          sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              fontSize: 14,
              bgcolor: 'primary.main',
            }}
          >
            {cadastroNome?.[0]?.toUpperCase() ?? 'U'}
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
            value={cadastroNome}
            onChange={(e) => setCadastroNome(e.target.value)}
          />
          <TextField
            label="E-mail"
            type="email"
            size="small"
            fullWidth
            value={cadastroEmail}
            onChange={(e) => setCadastroEmail(e.target.value)}
          />
          <TextField
            label="Nova senha"
            type="password"
            size="small"
            fullWidth
            placeholder="Deixe em branco para não alterar"
            value={cadastroSenha}
            onChange={(e) => setCadastroSenha(e.target.value)}
          />
          {cadastroErro && (
            <Typography fontSize={12} color="error">
              {cadastroErro}
            </Typography>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            size="small"
            onClick={() => setModalEditarCadastro(false)}
            sx={{ textTransform: 'none' }}
          >
            Cancelar
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={handleSalvarCadastro}
            disabled={cadastroLoading}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            {cadastroLoading ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </DialogActions>
      </Dialog>

      <ModalNovoProjeto
        open={modalProjeto}
        onClose={() => {
          setModalProjeto(false);
          setProjetoEmEdicao(null);
        }}
        onConfirm={async (dto) => {
          if (projetoEmEdicao) {
            await handleAtualizarProjeto(projetoEmEdicao.id, dto);
          } else {
            await handleCriarProjeto(dto);
          }
        }}
        initialValues={
          projetoEmEdicao
            ? {
                nome: projetoEmEdicao.nome,
                descricao: projetoEmEdicao.descricao,
                dataInicio: projetoEmEdicao.dataInicio,
                dataFim: projetoEmEdicao.dataFim,
              }
            : undefined
        }
        title={projetoEmEdicao ? "Editar Projeto" : "Novo Projeto"}
        submitLabel={projetoEmEdicao ? "Salvar" : "Criar"}
      />

      <ModalNovaTarefa
        open={modalTarefa}
        onClose={() => setModalTarefa(false)}
        onConfirm={handleCriarTarefa}
      />

      <ModalEditarTarefa
        open={modalEditar}
        tarefa={tarefaEdicao}
        onClose={() => setModalEditar(false)}
        onConfirm={handleAtualizarTarefa}
      />

      <ModalDetalhesTarefa
        open={modalDetalhes}
        tarefa={tarefaDetalhes}
        projeto={projetoAtivo}
        onClose={() => setModalDetalhes(false)}
        onEditar={handleEditarTarefa}
      />
    </Box>
  );
}
