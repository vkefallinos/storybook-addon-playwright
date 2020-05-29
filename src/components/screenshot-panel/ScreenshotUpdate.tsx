import React, { SFC, useCallback, useState } from 'react';
import { ScreenshotData, StoryInput } from '../../typings';
import Update from '@material-ui/icons/Update';
import { IconButton, Button } from '@material-ui/core';
import { useAsyncApiCall } from '../../hooks';
import { getScreenshot, updateScreenshot } from '../../api/client';
import { Loader, Snackbar } from '../common';
import { ScreenShotDialog } from '../common/ScreenShotDialog';

export interface ScreenshotUpdateProps {
  screenshot: ScreenshotData;
  storyInput: StoryInput;
}

const ScreenshotUpdate: SFC<ScreenshotUpdateProps> = (props) => {
  const { storyInput, screenshot } = props;

  const [successSnackbar, setSuccessSnackbar] = useState(false);

  const {
    makeCall,
    inProgress,
    clearResult,
    result: getScreenshotResult,
  } = useAsyncApiCall(getScreenshot);

  const {
    makeCall: updateScreenshotClient,
    inProgress: updateScreenshotInProgress,
    clearResult: updateScreenshotClearResult,
    error: updateScreenshotError,
    clearError: updateScreenshotClearError,
  } = useAsyncApiCall(updateScreenshot, false);

  const handleUpdate = useCallback(async () => {
    await makeCall({
      storyId: storyInput.id,
      ...screenshot,
    });
  }, [makeCall, screenshot, storyInput]);

  const handleSaveScreenshot = useCallback(async () => {
    const res = await updateScreenshotClient({
      base64: getScreenshotResult.base64,
      fileName: storyInput.parameters.fileName,
      hash: screenshot.hash,
      storyId: storyInput.id,
    });
    if (!(res instanceof Error)) {
      clearResult();
      setSuccessSnackbar(true);
    }
  }, [
    clearResult,
    getScreenshotResult,
    screenshot,
    storyInput,
    updateScreenshotClient,
  ]);

  const handleCloseSuccess = useCallback(() => {
    updateScreenshotClearResult();
    setSuccessSnackbar(false);
  }, []);

  return (
    <>
      <IconButton onClick={handleUpdate} size="small" title="Update screenshot">
        <Update />
      </IconButton>
      {(inProgress || updateScreenshotInProgress) && (
        <Loader progressSize={20} position="absolute" open={true} />
      )}
      {getScreenshotResult && (
        <ScreenShotDialog
          title="Following screenshot will be saved, would you like to continue?"
          imgSrcString={'data:image/gif;base64,' + getScreenshotResult.base64}
          onClose={clearResult}
          open={true}
          actions={() => (
            <>
              <Button onClick={clearResult} color="primary">
                No
              </Button>
              <Button onClick={handleSaveScreenshot} color="primary" autoFocus>
                Yes
              </Button>
            </>
          )}
        />
      )}
      {successSnackbar && (
        <Snackbar
          type="success"
          title="Success"
          message="Screenshot updated successfully."
          open={true}
          onClose={handleCloseSuccess}
          autoHideDuration={4000}
        />
      )}
      {updateScreenshotError && (
        <Snackbar
          type="error"
          title="Error"
          message={updateScreenshotError}
          open={true}
          onClose={updateScreenshotClearError}
        />
      )}
    </>
  );
};

ScreenshotUpdate.displayName = 'ScreenshotUpdate';

export { ScreenshotUpdate };
