import {
  contentToFormData,
  CONTENT_FIELDS,
} from 'js/utils/content';
import { Status } from 'js/enums';
import { Content } from 'js/types';

const mockFile = new File(['mock file contents'], 'mock.png');
const mockContent: Content = {
  title: 'Mock Content',
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

  // This test does not really test anything. Need changes.
  test('should include all filled in fields', () => {
    expect(organizedCalls).toHaveProperty(CONTENT_FIELDS['title'], 'Mock Content');
    expect(organizedCalls).toHaveProperty(CONTENT_FIELDS['status'], Status.REVIEW);
    expect(organizedCalls).toHaveProperty(CONTENT_FIELDS['fileName'], 'mock.png');
    // file -> content_file mapping does not exist in CONTENT_FIELDS, as
    // the content_file in the API response from Django matches fileURL.
    // Having both file -> content_file and fileURL -> content_file could
    // lead to some unintended side effects in the future.
    // Hence, here, the mapping field is 'fileURL' instead of 'file'
    expect(organizedCalls).toHaveProperty(CONTENT_FIELDS['fileURL'], mockFile);
  });
});
