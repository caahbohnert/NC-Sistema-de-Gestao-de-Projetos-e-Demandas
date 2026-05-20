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
import type { Status, Tarefa } from "../types";

interface Props {
  open: boolean;
  tarefa: Tarefa | null;
  onClose: () => void;
  onConfirm: (id: string, dto: any) => Promise<void>;
}

export function ModalEditarTarefa({ open, tarefa, onClose, onConfirm }: Props) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [status, setStatus] = useState<Status>("PENDENTE");
  const [prioridade, setPrioridade] = useState("MEDIA");
  const [dataLimite, setDataLimite] = useState("");
  const [linkMr, setLinkMr] = useState("");
  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios] = useState<{ id: string; nome: string }[]>([]);
  const [idResponsavel, setIdResponsavel] = useState('');

  useEffect(() => {
    if (tarefa) {
      setTitulo(tarefa.titulo);
      setDescricao(tarefa.descricao ?? "");
      setStatus(tarefa.status);
      setPrioridade(tarefa.prioridade ?? "");
      setDataLimite(tarefa.dataLimite ?? "");
      setLinkMr(tarefa.linkMr ?? "");
      setIdResponsavel(tarefa.idResponsavel ?? '');
    }
  }, [tarefa]);

  async function handleSubmit() {
    if (!tarefa) return;

    setLoading(true);

    await onConfirm(tarefa.id, {
      titulo,
      descricao,
      status,
      prioridade,
      dataLimite: dataLimite || undefined,
      linkMr: linkMr || undefined,
      idProjeto: tarefa.idProjeto,
      idResponsavel: idResponsavel || undefined,
    });

    setLoading(false);
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, fontSize: 16 }}>
        Editar Tarefa
      </DialogTitle>

      <DialogContent>
        <TextField
          label="Título"
          fullWidth
          margin="normal"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <TextField
          label="Descrição"
          fullWidth
          margin="normal"
          multiline
          rows={2}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        <TextField
          label="Link da MR (opcional)"
          fullWidth
          margin="normal"
          value={linkMr}
          onChange={(e) => setLinkMr(e.target.value)}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            label="Status"
            onChange={(e) => setStatus(e.target.value as Status)}
          >
            <MenuItem value="PENDENTE">Pendente</MenuItem>
            <MenuItem value="EM_ANDAMENTO">Em Andamento</MenuItem>
            <MenuItem value="CONCLUIDA">Concluída</MenuItem>
            <MenuItem value="CANCELADA">Cancelada</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Prioridade</InputLabel>
          <Select
            value={prioridade}
            label="Prioridade"
            onChange={(e) => setPrioridade(e.target.value)}
          >
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
          label="Data limite"
          type="date"
          fullWidth
          margin="normal"
          value={dataLimite}
          onChange={(e) => setDataLimite(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button
          variant="contained"
          disabled={!titulo.trim() || loading}
          onClick={handleSubmit}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}