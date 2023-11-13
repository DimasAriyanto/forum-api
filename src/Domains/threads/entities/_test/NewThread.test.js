const NewThread = require('../NewThread');

describe('a NewThread entities', () => {
  it('should throw error when payload did not contain right property', () => {
    const payload = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah thread',
    };

    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload contain wrong data type', () => {
    const payload = {
      id: 123,
      title: 'sebuah thread',
      body: 'sebuah body thread',
    };

    expect(() => new NewThread(payload)).toThrowError(
      'NEW_THREAD.PROPERTY_NOT_MEET_DATA_TYPE_NEEDED',
    );
  });

  it('should create addedThread object correctly', () => {
    const payload = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah thread',
      body: 'sebuah body thread',
    };

    const addedThread = new NewThread(payload);

    expect(addedThread.id).toEqual(payload.id);
    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.owner).toEqual(payload.owner);
  });
});
