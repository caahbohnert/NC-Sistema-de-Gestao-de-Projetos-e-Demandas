import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  Link,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Close,
  Edit,
  OpenInNew,
  CalendarToday,
  FlagOutlined,
  CheckCircleOutline,
  RadioButtonUnchecked,
  Timelapse,
  Cancel,
  FolderOutlined,
  PersonOutlined,
} from "@mui/icons-material";
import type { Tarefa, Status, Projeto } from "../types";

interface Props {
  open: boolean;
  tarefa: Tarefa | null;
  projeto: Projeto | null;
  onClose: () => void;
  onEditar: (tarefa: Tarefa) => void;
}

const statusConfig: Record<
  Status,
  { label: string; color: "default" | "warning" | "success" | "error"; icon: React.ReactNode }
> = {
  PENDENTE: {
    label: "Pendente",
    color: "default",
    icon: <RadioButtonUnchecked sx={{ fontSize: 14 }} />,
  },
  EM_ANDAMENTO: {
    label: "Em Andamento",
    color: "warning",
    icon: <Timelapse sx={{ fontSize: 14 }} />,
  },
  CONCLUIDA: {
    label: "Concluída",
    color: "success",
    icon: <CheckCircleOutline sx={{ fontSize: 14 }} />,
  },
  CANCELADA: {
    label: "Cancelada",
    color: "error",
    icon: <Cancel sx={{ fontSize: 14 }} />,
  },
};

const prioridadeConfig: Record<
  string,
  { label: string; color: string; bgColor: string }
> = {
  BAIXA: { label: "Baixa", color: "#43a047", bgColor: "#e8f5e9" },
  MEDIA: { label: "Média", color: "#fb8c00", bgColor: "#fff3e0" },
  ALTA: { label: "Alta", color: "#e53935", bgColor: "#ffebee" },
  CRITICA: { label: "Crítica", color: "#6a1a1a", bgColor: "#ff5252" },
};

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function normalizarUrl(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
}
function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, py: 1.2 }}>
      <Box sx={{ color: "text.disabled", mt: 0.1, flexShrink: 0 }}>{icon}</Box>
      <Box sx={{ flex: 1 }}>
        <Typography fontSize={11} fontWeight={600} color="text.disabled" textTransform="uppercase" letterSpacing={0.7} mb={0.3}>
          {label}
        </Typography>
        {children}
      </Box>
    </Box>
  );
}

export function ModalDetalhesTarefa({ open, tarefa, projeto, onClose, onEditar }: Props) {
  if (!tarefa) return null;

  const status = statusConfig[tarefa.status];
  const prioridade = prioridadeConfig[tarefa.prioridade ?? "MEDIA"];
  const dataFormatada = formatDate(tarefa.dataLimite);

  const isVencida =
    tarefa.dataLimite &&
    tarefa.status !== "CONCLUIDA" &&
    tarefa.status !== "CANCELADA" &&
    new Date(tarefa.dataLimite + "T00:00:00") < new Date();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          px: 3,
          pt: 2.5,
          pb: 2,
          bgcolor:
            tarefa.status === "CONCLUIDA"
              ? "success.main"
              : tarefa.status === "EM_ANDAMENTO"
              ? "warning.main"
              : tarefa.status === "CANCELADA"
              ? "error.main"
              : "primary.main",
          color: "white",
          position: "relative",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, pr: 4 }}>
          <Box sx={{ flex: 1 }}>
            <Typography fontSize={11} fontWeight={600} sx={{ opacity: 0.8, mb: 0.5, letterSpacing: 0.8, textTransform: "uppercase" }}>
              Detalhes da Tarefa
            </Typography>
            <Typography fontWeight={700} fontSize={18} lineHeight={1.3}>
              {tarefa.titulo}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ position: "absolute", top: 10, right: 10, display: "flex", gap: 0.5 }}>
          <Tooltip title="Editar tarefa">
            <IconButton
              size="small"
              onClick={() => { onClose(); onEditar(tarefa); }}
              sx={{ color: "white", opacity: 0.85, "&:hover": { opacity: 1, bgcolor: "rgba(255,255,255,0.15)" } }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Fechar">
            <IconButton
              size="small"
              onClick={onClose}
              sx={{ color: "white", opacity: 0.85, "&:hover": { opacity: 1, bgcolor: "rgba(255,255,255,0.15)" } }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <DialogContent sx={{ px: 3, py: 2.5 }}>
        <Box sx={{ display: "flex", gap: 1, mb: 2.5, flexWrap: "wrap" }}>
          <Chip
            icon={status.icon as any}
            label={status.label}
            color={status.color}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 600, fontSize: 12 }}
          />
          {tarefa.prioridade && (
            <Chip
              icon={<FlagOutlined sx={{ fontSize: 14, color: `${prioridade.color} !important` }} />}
              label={`Prioridade ${prioridade.label}`}
              size="small"
              sx={{
                fontWeight: 600,
                fontSize: 12,
                color: prioridade.color,
                bgcolor: prioridade.bgColor,
                borderColor: prioridade.color,
                border: "1px solid",
              }}
            />
          )}
          {isVencida && (
            <Chip
              label="Prazo vencido"
              size="small"
              color="error"
              sx={{ fontWeight: 600, fontSize: 12 }}
            />
          )}
        </Box>

        {tarefa.descricao && (
          <>
            <Box
              sx={{
                bgcolor: "action.hover",
                borderRadius: 1.5,
                p: 2,
                mb: 2,
                borderLeft: "3px solid",
                borderColor: "primary.main",
              }}
            >
              <Typography fontSize={11} fontWeight={600} color="text.disabled" textTransform="uppercase" letterSpacing={0.7} mb={0.8}>
                Descrição
              </Typography>
              <Typography fontSize={14} color="text.primary" lineHeight={1.6} sx={{ whiteSpace: "pre-wrap" }}>
                {tarefa.descricao}
              </Typography>
            </Box>
          </>
        )}

        <Divider sx={{ mb: 1 }} />

        <InfoRow icon={<CalendarToday sx={{ fontSize: 16 }} />} label="Data Limite">
          {dataFormatada ? (
            <Typography
              fontSize={14}
              fontWeight={500}
              color={isVencida ? "error.main" : "text.primary"}
            >
              {dataFormatada}
              {isVencida && " (vencida)"}
            </Typography>
          ) : (
            <Typography fontSize={14} color="text.disabled">
              Não definida
            </Typography>
          )}
        </InfoRow>

        <Divider />

        <InfoRow icon={<FolderOutlined sx={{ fontSize: 16 }} />} label="Projeto">
          <Typography fontSize={14} fontWeight={500}>
            {projeto?.nome ?? tarefa.idProjeto}
          </Typography>
        </InfoRow>

        {tarefa.idResponsavel && (
          <>
            <Divider />
            <InfoRow icon={<PersonOutlined sx={{ fontSize: 16 }} />} label="Responsável">
              <Typography fontSize={14} fontWeight={500}>
                {tarefa.nomeResponsavel ?? tarefa.idResponsavel}
              </Typography>
            </InfoRow>
          </>
        )}

        {tarefa.linkMr && (
          <>
            <Divider />
            <InfoRow icon={<OpenInNew sx={{ fontSize: 16 }} />} label="Link da MR">
              <Link
                href={normalizarUrl(tarefa.linkMr)}
                target="_blank"
                rel="noopener noreferrer"
                fontSize={14}
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                  wordBreak: "break-all",
                }}
              >
                {tarefa.linkMr}
                <OpenInNew sx={{ fontSize: 12, flexShrink: 0 }} />
              </Link>
            </InfoRow>
          </>
        )}

        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button onClick={onClose} color="inherit" size="small">
            Fechar
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<Edit />}
            onClick={() => { onClose(); onEditar(tarefa); }}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Editar Tarefa
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}