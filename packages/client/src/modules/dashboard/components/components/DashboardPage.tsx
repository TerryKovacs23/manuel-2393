import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  clearSession,
  readSession,
} from '../../../../services/storage/sessionStorage';
import { buildBetSummary } from '../../utils/betSummary';
import { buildSnailRaceSummary } from '../../utils/snailRaceSummary';

export function DashboardPage() {
  const navigate = useNavigate();
  const session = readSession(window.localStorage);
  const betSummary = buildBetSummary({ wins: 14, losses: 9 });
  const snailRaceSummary = buildSnailRaceSummary();
  const [winsSegment, lossesSegment] = betSummary.segments;

  const handleLogout = () => {
    clearSession(window.localStorage);
    navigate('/login', { replace: true });
  };

  const balance = session ? `$${(session.balanceCents / 100).toFixed(2)}` : '$0.00';
  const donutBackground =
    winsSegment && lossesSegment
      ? `conic-gradient(${winsSegment.color} 0 ${betSummary.winsPercentage}%, ${lossesSegment.color} ${betSummary.winsPercentage}% 100%)`
      : 'conic-gradient(#2d3436 0 100%)';

  return (
    <Box
      component="main"
      sx={{
        bgcolor: 'background.default',
        minHeight: '100vh',
      }}
    >
      <AppBar
        position="sticky"
        sx={{
          background: 'linear-gradient(90deg, #2d3436 0%, #40494b 100%)',
          boxShadow: 'none',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography component="h1" variant="h6" fontWeight={700}>
            Slow Rush
          </Typography>

          <Button color="secondary" onClick={handleLogout} variant="contained">
            Cerrar sesión
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack spacing={4}>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ borderRadius: 3, overflow: 'hidden', height: '100%' }}>
                <Box
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    px: 3,
                    py: 2,
                  }}
                >
                  <Typography variant="overline" sx={{ opacity: 0.8 }}>
                    Panel de información
                  </Typography>
                </Box>

                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Nombre del usuario
                    </Typography>
                    <Typography variant="h5" fontWeight={700}>
                      {session?.fullName ?? 'Sin sesión'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {session?.email ?? 'No hay sesión activa'}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ borderRadius: 3, overflow: 'hidden', height: '100%' }}>
                <Box
                  sx={{
                    bgcolor: 'secondary.main',
                    color: 'primary.main',
                    px: 3,
                    py: 2,
                  }}
                >
                  <Typography variant="overline" sx={{ opacity: 0.8 }}>
                    Saldo actual
                  </Typography>
                </Box>

                <CardContent sx={{ p: 3 }}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    spacing={2}
                  >
                    <Stack spacing={1}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Cuenta actual
                      </Typography>
                      <Typography variant="h4" fontWeight={700}>
                        {balance}
                      </Typography>
                    </Stack>

                    <Button
                      color="primary"
                      size="large"
                      variant="contained"
                      onClick={() => undefined}
                    >
                      Recargar saldo
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Stack spacing={3}>
            <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
              <Box
                sx={{
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  px: 3,
                  py: 2,
                }}
              >
                <Typography variant="overline" sx={{ opacity: 0.8 }}>
                  Historial de apuestas
                </Typography>
              </Box>

              <CardContent sx={{ p: 3 }}>
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={4}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      width: 190,
                      height: 190,
                      borderRadius: '50%',
                      background: donutBackground,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 'inset 0 0 0 1px rgba(45,52,54,0.08)',
                    }}
                  >
                    <Box
                      sx={{
                        width: 110,
                        height: 110,
                        borderRadius: '50%',
                        backgroundColor: 'background.paper',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="h5" fontWeight={700}>
                        {betSummary.winsPercentage}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ganadas
                      </Typography>
                    </Box>
                  </Box>

                  <Stack spacing={2} sx={{ width: '100%', maxWidth: 320 }}>
                    {betSummary.segments.map((segment) => (
                      <Stack
                        key={segment.label}
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={2}
                      >
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          <Box
                            sx={{
                              width: 14,
                              height: 14,
                              borderRadius: '50%',
                              backgroundColor: segment.color,
                            }}
                          />
                          <Typography variant="body1" fontWeight={600}>
                            {segment.label}
                          </Typography>
                        </Stack>

                        <Typography variant="body2" color="text.secondary">
                          {segment.value} · {segment.percentage}%
                        </Typography>
                      </Stack>
                    ))}

                    <Typography variant="body2" color="text.secondary">
                      Total de apuestas simuladas: {betSummary.total}
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
              <Box
                sx={{
                  bgcolor: 'secondary.main',
                  color: 'primary.main',
                  px: 3,
                  py: 2,
                }}
              >
                <Typography variant="overline" sx={{ opacity: 0.8 }}>
                  Victorias por caracol
                </Typography>
              </Box>

              <CardContent sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <Stack
                    direction="row"
                    alignItems="flex-end"
                    justifyContent="space-between"
                    spacing={1.5}
                    sx={{ minHeight: 200, px: 1 }}
                  >
                    {snailRaceSummary.map((snail) => (
                      <Stack key={snail.name} alignItems="center" spacing={1} sx={{ flex: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {snail.wins}
                        </Typography>
                        <Box
                          sx={{
                            width: '100%',
                            maxWidth: 42,
                            minHeight: 20,
                            height: `${(snail.wins / Math.max(...snailRaceSummary.map((item) => item.wins), 1)) * 100}%`,
                            bgcolor: snail.color,
                            borderRadius: '10px 10px 0 0',
                            boxShadow: '0 6px 18px rgba(45,52,54,0.12)',
                          }}
                        />
                        <Typography variant="caption" fontWeight={600}>
                          {snail.name}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>

                  <Typography variant="body2" color="text.secondary">
                    Resultados de las ultimas 6 carreras del día.
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}