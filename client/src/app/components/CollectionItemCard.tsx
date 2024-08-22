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
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import SelectList from './SelectList.tsx';
import { Visibility } from '../models/attractionCollection.ts';

const CardContentNoPadding = styled(CardContent)(`
  padding: 0;
  &:last-child {
    padding-bottom: 0;
  }
`);

const imageSize = { height: 90, width: 160 };

const photoPlaceholder = (
  <div
    className="centered-flex"
    style={{
      ...imageSize,
      backgroundColor: 'lightgray',
      flexShrink: 0,
    }}
  >
    <img alt="No photo" />
  </div>
);

interface Props {
  isEditable: boolean;
  position: number;
  onPositionChange: (position: number) => void;
  count: number;
  photo: string;
  titleName: string;
  visibility?: Visibility;
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

      {props.photo ? (
        <CardMedia image={props.photo} sx={{ ...imageSize, flexShrink: 0 }} />
      ) : (
        photoPlaceholder
      )}

      <Box display="flex" flexDirection="column" sx={{ flexGrow: 1 }}>
        <CardHeader
          title={
            <Box display="flex" alignItems="center">
              <Link href={props.titleUrl} sx={{ textDecoration: 'none' }}>
                {props.titleName}
              </Link>

              {props.visibility && (
                <Typography
                  variant="caption"
                  sx={{ paddingLeft: 1 }}
                >{`(${props.visibility})`}</Typography>
              )}
            </Box>
          }
          titleTypographyProps={{ fontSize: 19 }}
          sx={{ padding: 0 }}
        />

        {props.body && (
          <CardContentNoPadding sx={{ padding: 0, paddingBottom: 0 }}>
            <Typography
              component={'div'}
              variant="body2"
              sx={{ overflowY: 'auto', maxHeight: 60, whiteSpace: 'pre-wrap' }}
            >
              {props.titleUrl.startsWith('/attractions') && <b>{'Note: '}</b>}
              {props.body}
            </Typography>
          </CardContentNoPadding>
        )}
      </Box>

      {props.actions && !props.isEditable && props.actions.length > 0 && (
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
            expandIcon={
              props.children.length ? (
                <ExpandMoreIcon />
              ) : (
                <HorizontalRuleIcon />
              )
            }
            sx={{ flexDirection: 'row-reverse', padding: 0.5, gap: 1 }}
          >
            {self}
          </AccordionSummary>

          <AccordionDetails sx={{ paddingX: 5 }}>
            <Stack spacing={2}>{...props.children}</Stack>
          </AccordionDetails>
        </Accordion>
      )}
    </>
  );
}
