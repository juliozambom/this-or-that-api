const { PrismaClient } = require("@prisma/client");
const { user } = new PrismaClient();

class UsersRepository {
  async findAll() {
    const users = await user.findMany();

    return users;
  }

  async findById(id) {
    const userExists = await user.findFirst({
      where: {
        id,
      },
    });

    return userExists;
  }

  async findByEmail(email) {
    const userExists = await user.findFirst({
      where: {
        email,
      },
    });

    return userExists;
  }

  async create({ name, email, password }) {
    try {
      const userCreated = await user.create({
        data: {
          name,
          email,
          password,
        },
      });

      return userCreated;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async update({ id, name, email }) {
    const updatedUser = await user.update({
      where: {
        id,
      },
      data: {
        name,
        email,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return updatedUser;
  }

  async delete(id) {
    const deletedUser = await user.deleteMany({
      where: {
        id,
      },
    });

    return deletedUser;
  }
}

module.exports = new UsersRepository();
