const AddedThread = require('../AddedThread');

describe('a AddedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'sebuah thread',
    };

    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload property did not meet data type needed', () => {
    const payload = {
      title: 123,
      body: 'sebuah body thread',
      owner: 'user-123',
    };

    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.PROPORTY_NOT_MEET_DATA_TYPE_NEEDED');
  });

  it('should create addedThread object correctly', () => {
    const payload = {
      title: 'sebuah thread',
      body: 'sebuah body thread',
      owner: 'user-123',
    };

    const addedThread = new AddedThread(payload);

    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.body).toEqual(payload.body);
    expect(addedThread.owner).toEqual(payload.owner);
  });
});
