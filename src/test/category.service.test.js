import { jest } from '@jest/globals';
import { CategoryService } from "../application/use-cases/category.service.js";

describe("CategoryService", () => {

  it("should create a category (happy path)", async () => {
    const mockRepository = {
      create: jest.fn().mockResolvedValue({
        id: "1",
        name: "Ideas",
        userId: "user1"
      })
    };

    const service = new CategoryService(mockRepository);

    const result = await service.createCategory({
      name: "Ideas",
      userId: "user1"
    });

    expect(result.name).toBe("Ideas");
    expect(mockRepository.create).toHaveBeenCalled();
  });

});