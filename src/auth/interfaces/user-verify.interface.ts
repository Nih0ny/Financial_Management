export interface UserVerify {
  name: string;

  email: string;

  password: string;

  avatar: string | Buffer<ArrayBufferLike>;

  activationCode: string;
}
