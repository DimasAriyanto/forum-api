const InvariantError = require('./InvariantError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username dan password harus string'),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan input'),
  'ADDED_THREAD.PROPORTY_NOT_MEET_DATA_TYPE_NEEDED': new InvariantError('input harus string'),
  'ADDED_COMMENT.PROPORTY_NOT_MEET_DATA_TYPE_NEEDED': new InvariantError('input harus string'),
  'ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan input'),
  'ADDED_COMMENT_REPLY.PROPORTY_NOT_MEET_DATA_TYPE_NEEDED': new InvariantError('input harus string'),
  'ADDED_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan input'),
  'ADDED_COMMENT.PROPORTY_NOT_MEET_DATA_TYPE_NEEDED': new InvariantError('harus mengirimkan input'),
};

module.exports = DomainErrorTranslator;
