export type MockType<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [P in keyof T]: jest.Mock<{}>;
};

export const repositoryMockFactory: jest.Mock<
  {
    find: jest.Mock<any, [undefined]>;
    save: jest.Mock<any, [undefined]>;
    findOne: jest.Mock<any, [undefined]>;
  },
  any[]
> = jest.fn(() => ({
  find: jest.fn((entity) => entity),
  save: jest.fn((entity) => entity),
  findOne: jest.fn((entity) => entity),
}));
