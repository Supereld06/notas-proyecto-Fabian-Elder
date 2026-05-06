import { jest } from '@jest/globals';
import { CategoryService } from "../application/use-cases/category.service.js";

describe("CategoryService", () => {
  let mockRepository;
  let service;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRepository = {
      create: jest.fn()
    };
    service = new CategoryService(mockRepository);
  });

  it("should create a category (happy path)", async () => {
    // Arrange
    const categoryData = {
      name: "Ideas",
      userId: "user_123"
    };

    const createdCategory = {
      id: 1,
      ...categoryData
    };

    mockRepository.create.mockResolvedValue(createdCategory);

    // Act
    const result = await service.createCategory(categoryData);

    // Assert
    expect(result).toEqual(createdCategory);
    expect(result.name).toBe("Ideas");
    expect(result.userId).toBe("user_123");
    expect(mockRepository.create).toHaveBeenCalledTimes(1);
    expect(mockRepository.create).toHaveBeenCalledWith(categoryData);
  });

});
