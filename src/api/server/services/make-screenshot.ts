import { GetScreenshotRequest, ScreenshotInfo } from '../../../typings';
import { constructUrl } from '../../../utils';
import { getSnapshotHelper } from '../setup-snapshot';
import { executeAction } from '../utils';

export const makeScreenshot = async (
  data: GetScreenshotRequest,
  host: string,
  convertToBase64?: boolean,
): Promise<ScreenshotInfo> => {
  const helper = getSnapshotHelper();

  const url = constructUrl(
    helper.storybookEndpoint ? helper.storybookEndpoint : host,
    data.storyId,
    data.knobs,
  );

  const page = await helper.getPage(data.browserType);

  if (!page) {
    throw new Error('Make sure to return browser page instance from getPage.');
  }

  await page.goto(url);

  if (data.actions) {
    for (let i = 0; i < data.actions.length; i++) {
      const action = data.actions[i];
      await executeAction(page, action);
    }
  }

  if (helper.beforeSnapshot) {
    await helper.beforeSnapshot(page, data.browserType);
  }

  const buffer = await page.screenshot();

  if (helper.afterSnapshot) {
    await helper.afterSnapshot(page, data.browserType);
  }

  return {
    base64: convertToBase64 && buffer.toString('base64'),
    browserName: data.browserType,
    buffer,
  };
};
