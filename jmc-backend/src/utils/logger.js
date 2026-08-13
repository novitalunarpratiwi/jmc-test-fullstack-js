const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const logActivity = async (userId, action, moduleName, detail, ipAddress = null) => {
  try {
    await prisma.activityLog.create({
      data: {
        userId: userId,
        action: action,
        module: moduleName,
        detail: detail,
        ipAddress: ipAddress
      }
    });
  } catch (error) {
    console.error("Gagal mencatat log aktivitas:", error);
  }
};

module.exports = { logActivity };