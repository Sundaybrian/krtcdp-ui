import type { StackProps } from '@mui/material/Stack';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/config-global';
import { varAlpha, stylesMode } from 'src/theme/styles';

import { SvgColor } from 'src/components/svg-color';
import { varFade, MotionViewport } from 'src/components/animate';

import { SectionTitle } from './components/section-title';
import { CircleSvg, FloatLine, FloatPlusIcon } from './components/svg-elements';

// ----------------------------------------------------------------------

export function HomeMinimal({ sx, ...other }: StackProps) {
  const renderLines = (
    <>
      <FloatPlusIcon sx={{ top: 72, left: 72 }} />
      <FloatPlusIcon sx={{ bottom: 72, left: 72 }} />
      <FloatLine sx={{ top: 80, left: 0 }} />
      <FloatLine sx={{ bottom: 80, left: 0 }} />
      <FloatLine vertical sx={{ top: 0, left: 80 }} />
    </>
  );

  const renderDescription = (
    <>
      <SectionTitle
        caption="The digital platform"
        title="Objectives"
        txtGradient="and benefits"
        sx={{ mb: { xs: 5, md: 8 }, textAlign: { xs: 'center', md: 'left' } }}
      />

      <Stack
        spacing={6}
        sx={{
          maxWidth: { sm: 560, md: 400 },
          mx: { xs: 'auto', md: 'unset' },
        }}
      >
        {ITEMS.map((item) => (
          <Box
            component={m.div}
            key={item.title}
            variants={varFade({ distance: 24 }).inUp}
            gap={3}
            display="flex"
          >
            <SvgColor src={item.icon} sx={{ width: 40, height: 40 }} />
            <Stack spacing={1}>
              <Typography variant="h5" component="h6">
                {item.title}
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>{item.description}</Typography>
            </Stack>
          </Box>
        ))}
      </Stack>
    </>
  );

  {
    /* </Stack> 
      component={m.div}
      variants={varFade({ distance: 24 }).inRight}
      alignItems="center"
      justifyContent="center"
      sx={{ height: 1, position: 'relative' }}
    >
      <Box
        sx={{
          left: 0,
          width: 720,
          borderRadius: 2,
          position: 'absolute',
          bgcolor: 'background.default',
          boxShadow: (theme) =>
            `-40px 40px 80px 0px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
          [stylesMode.dark]: {
            boxShadow: (theme) =>
              `-40px 40px 80px 0px ${varAlpha(theme.vars.palette.common.blackChannel, 0.16)}`,
          },
        }}
      >
        <Box
          component="img"
          alt="Home Chart"
          src={`${CONFIG.site.basePath}/assets/images/home/home-chart.webp`}
          sx={{ width: 720 }}
        />
      </Box>
    </Stack> */
  }

  const renderImg = (
    <>
      <SectionTitle
        caption=""
        title="About"
        txtGradient="us"
        sx={{ mb: { xs: 5, md: 8 }, textAlign: { xs: 'center', md: 'left' } }}
      />

      <Stack
        spacing={6}
        sx={{
          maxWidth: { sm: 560, md: 400 },
          mx: { xs: 'auto', md: 'unset' },
        }}
      >
        <Box component={m.div} variants={varFade({ distance: 24 }).inUp} gap={3} display="flex">
          <Stack spacing={1}>
            <Typography sx={{ color: 'text.secondary' }}>
              Kenya Rural Transformation Centres Digital Platform project introduces a uniquely
              tailored innovative digital platform, which allows various service providers to plug
              in, while delivering affordable and timely services to farmers and other value chain
              actors. It will further enable and facilitate the following factors/elements in the
              agricultural sector
            </Typography>
          </Stack>
        </Box>
      </Stack>

      <SectionTitle
        caption=""
        title="Our"
        txtGradient="goal"
        sx={{ mb: { xs: 5, md: 8, mt: 2 }, textAlign: { xs: 'center', md: 'left' } }}
      />

      <Stack
        spacing={6}
        sx={{
          maxWidth: { sm: 560, md: 400 },
          mx: { xs: 'auto', md: 'unset' },
        }}
      >
        <Box component={m.div} variants={varFade({ distance: 24 }).inUp} gap={3} display="flex">
          <Stack spacing={1}>
            <Typography sx={{ color: 'text.secondary' }}>
              The goal of the project is to increase productivity, profitability and sustainability
              of agricultural cooperatives, and to consequently impact the entire agriculture/food
              and trade value chains, spurring holistic growth across Kenya's agricultural sector.
              The project's goal will be achieved through the creation of a single point of
              convergence for all agro-sector stakeholders in Kenya, thereby connecting farmers with
              the private sector actors as well as public sector services.
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </>
  );

  return (
    <Stack
      component="section"
      sx={{
        overflow: 'hidden',
        position: 'relative',
        py: { xs: 10, md: 20 },
        ...sx,
      }}
      {...other}
    >
      <MotionViewport>
        {renderLines}

        <Container sx={{ position: 'relative' }}>
          <Grid container columnSpacing={{ xs: 0, md: 8 }} sx={{ position: 'relative', zIndex: 9 }}>
            <Grid xs={12} md={6} lg={7}>
              {renderDescription}
            </Grid>

            <Grid md={6} lg={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              {renderImg}
            </Grid>
          </Grid>

          <CircleSvg variants={varFade().in} sx={{ display: { xs: 'none', md: 'block' } }} />
        </Container>
      </MotionViewport>
    </Stack>
  );
}

// ----------------------------------------------------------------------

const ITEMS = [
  {
    icon: `${CONFIG.site.basePath}/assets/icons/home/ic-make-brand.svg`,
    title: 'Digital Ecosystem',
    description: `Put farmers at the center of a single digital "ecosystem" and connect them with value chain players such as input suppliers and agro-dealers, buyers, and other service providers, among others`,
  },
  {
    icon: `${CONFIG.site.basePath}/assets/icons/home/ic-design.svg`,
    title: 'Scalability',
    description:
      'Facilitate streamlining of processes coupled to mobile phone-based innovations to reach small scale farmers.',
  },
  {
    icon: `${CONFIG.site.basePath}/assets/icons/home/ic-development.svg`,
    title: 'Linkages',
    description:
      'Enhance linkages between upstream, midstream, and downstream agriculture value chain activitie',
  },
];
