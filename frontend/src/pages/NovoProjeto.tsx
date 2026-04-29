import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (dto: {
    nome: string;
    descricao?: string;
    dataInicio: string;
    dataFim: string;
  }) => Promise<void>;
}

export function ModalNovoProjeto({ open, onClose, onConfirm }: Props) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [loading, setLoading] = useState(false);

  const dataInvalida = !!dataInicio && !!dataFim && dataFim < dataInicio;
  const disabled = !nome.trim() || !dataInicio || !dataFim || dataInvalida || loading;

  async function handleSubmit() {
    if (dataInvalida) return;
    setLoading(true);
    await onConfirm({ nome, descricao, dataInicio, dataFim });
    setLoading(false);
    handleReset();
  }

  function handleReset() {
    setNome("");
    setDescricao("");
    setDataInicio("");
    setDataFim("");
  }

  function handleClose() {
    handleReset();
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, fontSize: 16 }}>Novo Projeto</DialogTitle>
      <DialogContent>
        <TextField
          label="Nome"
          fullWidth
          margin="normal"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
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
        <TextField
          label="Data de início"
          type="date"
          fullWidth
          margin="normal"
          value={dataInicio}
          onChange={(e) => setDataInicio(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Data de fim"
          type="date"
          fullWidth
          margin="normal"
          value={dataFim}
          onChange={(e) => setDataFim(e.target.value)}
          InputLabelProps={{ shrink: true }}
          error={dataInvalida}
          helperText={dataInvalida ? "A data de fim não pode ser anterior à data de início." : ""}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color="inherit">Cancelar</Button>
        <Button
          variant="contained"
          disabled={disabled}
          onClick={handleSubmit}
        >
          {loading ? "Criando..." : "Criar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}