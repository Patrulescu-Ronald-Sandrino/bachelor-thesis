import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  Link,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import { ReactNode } from 'react';
import { MoreHoriz } from '@mui/icons-material';
import AppMenu from './AppMenu.tsx';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SelectList from './SelectList.tsx';

const CardContentNoPadding = styled(CardContent)(`
  padding: 0;
  &:last-child {
    padding-bottom: 0;
  }
`);

interface Props {
  isEditable: boolean;
  position: number;
  onPositionChange: (position: number) => void;
  count: number;
  photo: string;
  titleName: string;
  titleUrl: string;
  body: string | ReactNode;
  actions?: ReactNode[];
  children?: ReactNode[];
}

export default function CollectionItemCard(props: Props) {
  const additionalCardStyles =
    !!props.children && !props.isEditable // hide box shadow
      ? { boxShadow: 'none' }
      : { margin: 1, padding: 1.5 };

  const self = (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        ...additionalCardStyles,
        width: '100%',
      }}
    >
      {props.isEditable ? (
        <div style={{ flex: 0 }}>
          <SelectList
            selectedValue={props.position}
            items={[...Array(props.count).keys()].map((i) => i + 1)}
            onChange={(value) => {
              console.log(`position change: ${props.position} to ${value}`);
              props.onPositionChange(value);
            }}
            notFullWidth
          />
        </div>
      ) : (
        <Typography>{props.position}.</Typography>
      )}

      <CardMedia
        image={props.photo}
        sx={{ height: 90, width: 160, flexShrink: 0 }}
      />

      <Box display="flex" flexDirection="column" sx={{ flexGrow: 1 }}>
        <CardHeader
          title={
            <Link href={props.titleUrl} sx={{ textDecoration: 'none' }}>
              {props.titleName}
            </Link>
          }
          titleTypographyProps={{ fontSize: 19 }}
          sx={{ padding: 0 }}
        />

        {props.body && (
          <CardContentNoPadding sx={{ padding: 0, paddingBottom: 0 }}>
            <Typography
              variant="body2"
              sx={{ overflowY: 'auto', maxHeight: 60 }}
            >
              {props.body}
            </Typography>
          </CardContentNoPadding>
        )}
      </Box>

      {props.actions && !props.isEditable && (
        <div onClick={(e) => e.stopPropagation()}>
          <AppMenu
            button={
              <IconButton color="inherit">
                <MoreHoriz />
              </IconButton>
            }
            items={props.actions}
          />
        </div>
      )}
    </Card>
  );

  return (
    <>
      {!props.children || props.isEditable ? (
        self
      ) : (
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ flexDirection: 'row-reverse', padding: 0.5 }}
          >
            {self}
          </AccordionSummary>

          <AccordionDetails>
            <Stack spacing={2}>{...props.children}</Stack>
          </AccordionDetails>
        </Accordion>
      )}
    </>
  );
}
