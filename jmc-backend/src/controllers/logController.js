const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getLogs = async (req, res) => {
  try {
    const search = req.query.search || '';

    const logs = await prisma.activityLog.findMany({
      where: {
        OR: [
          { module: { contains: search } },
          { action: { contains: search } }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: 50 // Batasi 50 log terakhir
    });

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = { getLogs };