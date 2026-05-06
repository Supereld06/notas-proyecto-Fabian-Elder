import { DataTypes } from "sequelize";
import sequelize from "./connection.js";

export const CategoryModel = sequelize.define("Category", {
    name: { type: DataTypes.STRING, allowNull: false },
    userId: { type: DataTypes.STRING, allowNull: false }
}, {
    tableName: "categories",
    timestamps: true
});

export class CategoryRepository {
    async create(data) {
        const category = await CategoryModel.create(data);
        return category.toJSON();
    }

    async findByUser(userId) {
        return await CategoryModel.findAll({ where: { userId } });
    }

    async findById(id) {
        const category = await CategoryModel.findByPk(id);
        return category ? category.toJSON() : null;
    }

    async update(id, data) {
        const category = await CategoryModel.findByPk(id);
        if (!category) return null;
        await category.update(data);
        return category.toJSON();
    }

    async delete(id) {
        const category = await CategoryModel.findByPk(id);
        if (!category) return null;
        await category.destroy();
        return true;
    }
}
