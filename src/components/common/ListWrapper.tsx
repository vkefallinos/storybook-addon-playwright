import React, { SFC } from 'react';
import { makeStyles } from '@material-ui/core';
import { ScrollArea } from '@storybook/components';

const useStyles = makeStyles(
  (theme) => {
    return {
      root: {
        color: theme.palette.text.primary,
        height: '100%',
        padding: 4,
        width: '100%',
      },
    };
  },
  { name: 'ListWrapper' },
);

export { useStyles as useListWrapperStyles };

const ListWrapper: SFC = (props) => {
  const { children } = props;

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ScrollArea vertical>{children}</ScrollArea>
    </div>
  );
};

ListWrapper.displayName = 'ListWrapper';

export { ListWrapper };