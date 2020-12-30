import React from 'react';
import styled from '@emotion/styled';

import Button from 'app/components/button';
import ClipboardTooltip from 'app/components/clipboardTooltip';
import TextOverflow from 'app/components/textOverflow';
import {IconStack} from 'app/icons';
import {t} from 'app/locale';
import space from 'app/styles/space';
import {Image} from 'app/types/debugImage';

import layout from '../layout';
import NotAvailable from '../notAvailable';
import Stacktrace from '../stacktrace';
import {combineStatus, getFileName} from '../utils';

import Address from './address';
import StacktraceStatusIcon from './stacktraceStatusIcon';
import StatusTag from './statusTag';

type Props = {
  image: Image;
  onOpenImageDetailsModal: (
    image: Image,
    imageAddress: React.ReactElement | null,
    fileName?: string
  ) => void;
  style?: React.CSSProperties;
};

function DebugImage({image, onOpenImageDetailsModal, style}: Props) {
  const {unwind_status, debug_status, code_file} = image;

  const status = combineStatus(debug_status, unwind_status);

  const fileName = getFileName(code_file);
  const imageAddress = <Address image={image} />;

  return (
    <Wrapper style={style}>
      <StatusColumn>
        <StatusTag status={status} />
      </StatusColumn>
      <ImageColumn>
        <ClipboardTooltip title={code_file} containerDisplayMode="inline-flex">
          <FileName>{fileName}</FileName>
        </ClipboardTooltip>
        <ImageAddress>{imageAddress}</ImageAddress>
      </ImageColumn>
      <StacktraceColumn>
        {debug_status || unwind_status ? (
          <Stacktraces>
            <Stacktrace
              type="symbolication"
              icon={<StacktraceStatusIcon status={debug_status} />}
            />
            <Stacktrace
              type="stack-unwinding"
              icon={<StacktraceStatusIcon status={unwind_status} />}
            />
          </Stacktraces>
        ) : (
          <NotAvailable />
        )}
      </StacktraceColumn>
      <DebugFilesColumn>
        <Button
          size="xsmall"
          icon={<IconStack size="xs" />}
          onClick={() => onOpenImageDetailsModal(image, imageAddress, fileName)}
        >
          {t('View')}
        </Button>
        <Button
          size="xsmall"
          icon={<IconStack size="xs" />}
          onClick={() => onOpenImageDetailsModal(image, imageAddress, fileName)}
          label={t('View')}
        />
      </DebugFilesColumn>
    </Wrapper>
  );
}

export default DebugImage;

const Wrapper = styled('div')`
  :not(:last-child) {
    > * {
      border-bottom: 1px solid ${p => p.theme.border};
    }
  }
  ${p => layout(p.theme)};
`;

const Column = styled('div')`
  padding: ${space(2)};
  display: flex;
  align-items: center;
`;

// Status Column
const StatusColumn = styled(Column)`
  max-width: 100%;
  overflow: hidden;
`;

const FileName = styled(TextOverflow)`
  color: ${p => p.theme.gray500};
  font-family: ${p => p.theme.text.family};
  font-size: ${p => p.theme.fontSizeMedium};
  width: 100%;
`;

// Image Column
const ImageColumn = styled(Column)`
  font-family: ${p => p.theme.text.familyMono};
  color: ${p => p.theme.gray300};
  font-size: ${p => p.theme.fontSizeSmall};
  overflow: hidden;
  flex-direction: column;
  align-items: flex-start;
`;

const ImageAddress = styled(TextOverflow)`
  width: 100%;
`;

// Stack trace Column
const StacktraceColumn = styled(Column)``;

const Stacktraces = styled('div')`
  display: grid;
  grid-auto-flow: column;
  grid-column-gap: ${space(2)};
  font-size: ${p => p.theme.fontSizeSmall};
`;

// Debug Files Column
const DebugFilesColumn = styled(Column)`
  justify-content: flex-end;

  > *:first-child {
    display: none;
  }

  @media (min-width: ${p => p.theme.breakpoints[0]}) {
    > *:first-child {
      display: flex;
    }
    > *:nth-child(2) {
      display: none;
    }
  }

  @media (min-width: ${p => p.theme.breakpoints[2]}) {
    > *:first-child {
      display: none;
    }
    > *:nth-child(2) {
      display: flex;
    }
  }

  @media (min-width: ${p => p.theme.breakpoints[3]}) {
    > *:first-child {
      display: flex;
    }
    > *:nth-child(2) {
      display: none;
    }
  }
`;
