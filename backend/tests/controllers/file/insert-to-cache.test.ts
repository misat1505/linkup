import { FileControllers } from "../../../src/controllers";
import { CACHE_CAPACITY } from "../../../src/controllers/file/insertToCache.controller";
import { UserWithCredentials } from "../../../src/types/User";
import {
  mockFileService,
  mockFileStorage,
  mockRequest,
  mockResponse,
} from "../../utils/mocks";

describe("insertToCache", () => {
  mockFileService.isUserAvatar.mockResolvedValue(true);
  mockFileService.isChatMessage.mockResolvedValue(true);
  mockFileService.isChatPhoto.mockResolvedValue(true);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("inserts file to cache with new filename", async () => {
    mockFileStorage.listFiles.mockResolvedValue([]);
    mockFileStorage.uploadFile.mockResolvedValue("new-file.jpg");

    const req = mockRequest({
      file: {
        buffer: Buffer.from("fake-image-data"),
        originalname: "testfile.jpg",
      } as Express.Multer.File,
      user: { id: "userId" } as UserWithCredentials,
    });
    const res = mockResponse();

    await FileControllers.insertToCache(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ file: expect.any(String) })
    );
    expect(mockFileStorage.uploadFile).toHaveBeenCalledTimes(1);
  });

  it(`blocks cache insertion at ${CACHE_CAPACITY}-file limit`, async () => {
    mockFileStorage.listFiles.mockResolvedValue(
      new Array(CACHE_CAPACITY).fill("existing-file.jpg")
    );

    const req = mockRequest({
      file: { buffer: Buffer.from("fake-image-data") } as Express.Multer.File,
      user: { id: "userId" } as UserWithCredentials,
    });
    const res = mockResponse();

    await FileControllers.insertToCache(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("returns 400 for missing file upload", async () => {
    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
    });
    const res = mockResponse();

    await FileControllers.insertToCache(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 500 for failed cache insertion", async () => {
    mockFileStorage.listFiles.mockResolvedValue([]);
    mockFileStorage.uploadFile.mockRejectedValue(new Error("upload failed"));

    const mockNextFunction = jest.fn();

    const req = mockRequest({
      file: { buffer: Buffer.from("fake-image-data") } as Express.Multer.File,
      user: { id: "userId" } as UserWithCredentials,
    });
    const res = mockResponse();

    await FileControllers.insertToCache(req, res, mockNextFunction);

    expect(mockNextFunction).toHaveBeenCalled();
  });
});
