import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { usuarioService } from "../services/dashboardservice";
import type { Status } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (dto: {
    titulo: string;
    descricao?: string;
    status: Status;
    prioridade: string;
    dataLimite?: string;
    idResponsavel?: string;
  }) => Promise<void>;
}

export function ModalNovaTarefa({ open, onClose, onConfirm }: Props) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [status, setStatus] = useState<Status>("PENDENTE");
  const [prioridade, setPrioridade] = useState("MEDIA");
  const [dataLimite, setDataLimite] = useState("");
  const [idResponsavel, setIdResponsavel] = useState("");
  const [usuarios, setUsuarios] = useState<{ id: string; nome: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    usuarioService
      .listar()
      .then(setUsuarios)
      .catch(() => setUsuarios([]));
  }, [open]);

  async function handleSubmit() {
    setLoading(true);
    await onConfirm({
      titulo,
      descricao,
      status,
      prioridade,
      dataLimite: dataLimite || undefined,
      idResponsavel: idResponsavel || undefined,
    });
    setLoading(false);
    reset();
  }

  function reset() {
    setTitulo("");
    setDescricao("");
    setStatus("PENDENTE");
    setPrioridade("MEDIA");
    setDataLimite("");
    setIdResponsavel("");
  }

  function handleClose() {
    reset();
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, fontSize: 16 }}>Nova Tarefa</DialogTitle>
      <DialogContent>
        <TextField
          label="Título"
          fullWidth
          margin="normal"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <TextField
          label="Descrição (opcional)"
          fullWidth
          margin="normal"
          multiline
          rows={2}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Status</InputLabel>
          <Select value={status} label="Status" onChange={(e) => setStatus(e.target.value as Status)}>
            <MenuItem value="PENDENTE">Pendente</MenuItem>
            <MenuItem value="EM_ANDAMENTO">Em Andamento</MenuItem>
            <MenuItem value="CONCLUIDA">Concluída</MenuItem>
            <MenuItem value="CANCELADA">Cancelada</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Prioridade</InputLabel>
          <Select value={prioridade} label="Prioridade" onChange={(e) => setPrioridade(e.target.value)}>
            <MenuItem value="BAIXA">Baixa</MenuItem>
            <MenuItem value="MEDIA">Média</MenuItem>
            <MenuItem value="ALTA">Alta</MenuItem>
            <MenuItem value="CRITICA">Crítica</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Responsável</InputLabel>
          <Select
            value={idResponsavel}
            label="Responsável"
            onChange={(e) => setIdResponsavel(e.target.value)}
          >
            <MenuItem value="">Nenhum</MenuItem>
            {usuarios.map((u) => (
              <MenuItem key={u.id} value={u.id}>
                {u.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Data limite (opcional)"
          type="date"
          fullWidth
          margin="normal"
          value={dataLimite}
          onChange={(e) => setDataLimite(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color="inherit">Cancelar</Button>
        <Button
          variant="contained"
          disabled={!titulo.trim() || loading}
          onClick={handleSubmit}
        >
          Criar
        </Button>
      </DialogActions>
    </Dialog>
  );
}