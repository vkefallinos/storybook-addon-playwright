const unlinkSyncMock = jest.fn();
jest.mock('fs', () => ({ existsSync: () => true, unlinkSync: unlinkSyncMock }));

import { storyFileInfo } from '../../../../../__manual_mocks__/utils/story-file-info';
import { deleteScreenshot } from '../delete-screenshot';
import { saveStoryFile, loadStoryData } from '../../utils';
import { mocked } from 'ts-jest/utils';

jest.mock('../../utils/save-story-file');
jest.mock('../../utils/load-story-data');

describe('deleteScreenshot', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should delete', async () => {
    await deleteScreenshot({
      fileName: 'story.ts',
      hash: 'hash',
      storyId: 'story-id',
    });
    expect(
      mocked(saveStoryFile).mock.calls[0][1]['story-id'].screenshots,
    ).toStrictEqual([
      {
        actions: [{ id: 'action-id', name: 'action-name' }],
        browserType: 'chromium',
        hash: 'hash-2',
        index: 1,
        title: 'title-2',
      },
    ]);
  });

  it('should not have screenshots prop if no screen shot available', async () => {
    mocked(loadStoryData).mockImplementationOnce(() => {
      const data = storyFileInfo();
      return new Promise((resolve) => {
        data['story-id'].screenshots = [data['story-id'].screenshots[0]];
        resolve(data);
      });
    });

    await deleteScreenshot({
      fileName: 'story.ts',
      hash: 'hash',
      storyId: 'story-id',
    });

    expect(
      mocked(saveStoryFile).mock.calls[0][1]['story-id'].screenshots,
    ).toStrictEqual(undefined);

    expect(unlinkSyncMock).toBeCalledTimes(1);
  });
});