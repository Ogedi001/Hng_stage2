import server from './app';
import { prisma } from './client';
import Logger from './utils/logger';


const PORT = process.env.PORT ||3012

const startServer = () => {
  Logger.info("connected to the database");
  
  server.listen(PORT, () => {
    Logger.info(`App is running @localhost:${PORT}`);
  });


  // Shutdown hook
  const handleShutdown = async () => {
    Logger.info("Shutting down server...");
    await prisma.$disconnect(); 
    server.close(() => {
      Logger.info("Server is shut down");
      process.exit(0); 
    });
  };
  
  // Listen for SIGINT and SIGTERM signals
  process.on("SIGINT", handleShutdown);
  process.on("SIGTERM", handleShutdown);


}

  
startServer();
