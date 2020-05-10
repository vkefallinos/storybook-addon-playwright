import React, { SFC, memo, useCallback } from 'react';
import { makeStyles, IconButton } from '@material-ui/core';
import { ActionSet } from '../../../typings';
import DeleteIcon from '@material-ui/icons/DeleteOutlineSharp';
import EditIcon from '@material-ui/icons/EditSharp';

const useStyles = makeStyles(
  () => {
    return {
      icon: {
        fontSize: 20,
      },
      item: {
        alignItems: 'center',
        boxShadow: '0px 0.5px 4px -2px rgba(0,0,0,0.75)',
        display: 'flex',
        justifyContent: 'space-between',
        minHeight: '48px',
        padding: '5px 8px',
        paddingLeft: 16,
      },
    };
  },
  { name: 'ActionSetListItem' },
);

export interface ActionSetListItemProps {
  onEdit: (actionSet: ActionSet) => void;
  onDelete: (setId: string) => void;
  actionSet: ActionSet;
}

const ActionSetListItem: SFC<ActionSetListItemProps> = memo(
  ({ onEdit, onDelete, actionSet }) => {
    const classes = useStyles();

    const handleDelete = useCallback(async () => {
      onDelete(actionSet.id);
    }, [actionSet.id, onDelete]);

    const handleEdit = useCallback(() => {
      onEdit(actionSet);
    }, [actionSet, onEdit]);

    return (
      <div className={classes.item} key={actionSet.id}>
        <div>{actionSet.description}</div>
        <div>
          <IconButton onClick={handleEdit} size="small">
            <EditIcon className={classes.icon} />
          </IconButton>
          <IconButton onClick={handleDelete} size="small">
            <DeleteIcon className={classes.icon} />
          </IconButton>
        </div>
      </div>
    );
  },
);

ActionSetListItem.displayName = 'ActionSetListItem';

export { ActionSetListItem };