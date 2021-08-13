import {
  contentToFormData,
} from 'js/utils/content';
import { Status } from 'js/enums';
import { Content } from 'js/types';

const mockFile = new File(['mock file contents'], 'mock.png');
const mockContent: Content = {
  title: 'Mock Content',
  copyrightApproved: false,
  creator: 'User',
  status: Status.REVIEW,
  createdDate: '2021-08-07',
  id: 5,
  fileName: 'mock.png',
  file: mockFile,
  metadata: {},
};

describe('content conversion to FormData', () => {
  const append = jest.spyOn(FormData.prototype, 'append');
  contentToFormData(mockContent);
  const organizedCalls = append.mock.calls.sort(
    ([n1,_v1],[n2,_v2]) => n1.localeCompare(n2)
  ).reduce(
    (accum, [n,v]) => ({ ...accum, [n]: v }),
    {} as Record<string,string|Blob>,
  );

  test('should include all filled in fields', () => {
    expect(organizedCalls).toMatchObject({
      title: 'Mock Content',
      copyright_approved: 'false',
      status: Status.REVIEW,
      file_name: 'mock.png',
      content_file: mockFile,
    });
  });
});
