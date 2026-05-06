import { Sequelize } from "sequelize";

let sequelize = null;

export const connectMysql = async () => {

    if (process.env.USE_MYSQL !== "true") {
        console.log("MySQL deshabilitado");
        return;
    }

    try {
        sequelize = new Sequelize(
            process.env.MYSQL_DATABASE,
            process.env.MYSQL_USER,
            process.env.MYSQL_PASSWORD,
            {
                host: process.env.MYSQL_HOST,
                dialect: "mysql",
            }
        );

        await sequelize.authenticate();
        await sequelize.sync({ alter: true });

        console.log("Connected to MySQL");
    } catch (error) {
        console.error("Error connecting to MySQL:", error);
        process.exit(1);
    }
};

export default sequelize;